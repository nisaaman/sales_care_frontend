
import React from "react";
import { useHistory } from "react-router-dom";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import { ActionsColumnFormatter } from "./ActionsColumnFormatter";
import {useIntl} from "react-intl";
import { format, parse, isValid, parseISO } from 'date-fns';

export default function StockReceiveList({setSingleAll, singleAll, data}) {
  const intl = useIntl();
  let history = useHistory();
  
  const openReceivePage = (data) => {
    history.push('/inventory/stock/stock-transfer/stock-received-list', { state: data, status:true });
  }
  const openClaimPage = (data) => {
    history.push('/inventory/stock/stock-transfer/stock-received-claim', { state: data, status:true });
  }


  const singleWiseSelectHandler = (data, isSelect) => {
    if (isSelect == true) {
      let temp = [...singleAll]
      temp.push(data)
      setSingleAll(temp)
    } else {
      if (singleAll.length >= 0) {
        let temp = [...singleAll]
        const index = temp.findIndex(obj => obj.id == data.id);
        temp.splice(index, 1);
        setSingleAll(temp)
      }
    }

  }
  const allSelectHandler = (allData, isSelect) => {
    if (isSelect == true) {
      setSingleAll(allData)
    }
    else {
      if (allData.length >= 0) {
        for (let i = 0; i < allData.length; i++) {
          const index = singleAll.findIndex(obj => obj.id == allData[i].id);
          singleAll.splice(index, 1);
          setSingleAll(singleAll)
        }
      }
    }

  }
  const columns = [
    {
      dataField: "transaction_date",
      text:"Stock receive info",
      formatter: (cellContent, row) => (
        <>
          <span className="text-muted">{row.transfer_no}</span><br />
          <strong>{row.depot_name}</strong><br />
          <span className="text-muted">{format(parseISO(row.transaction_date), 'dd-MMM-yyyy')}</span>
        </>
      )
    },
    {
      dataField: "sales_officer",
      text: "BY",
      formatter: (cellContent, row) => (
        <>
          <strong>{row.user_name}</strong><br />
          <span className="text-muted">{row.designation_name}</span>
        </>
      )
    },
    {
      dataField: "collection_amount",
      text: "QTY",
      headerClasses:"text-right",
      classes:"text-right",
      formatter: (cellContent, row) => (
        <>
          <strong>{row.quantity}</strong><br />
        </>
      )
    },
    {
      dataField: "action",
      text: intl.formatMessage({id: "MENU.ACTION"}),
      formatter: ActionsColumnFormatter,
      formatExtraData: {
        openReceivePage: openReceivePage,
        openClaimPage:openClaimPage,
      },
      classes: "text-center",
      headerClasses: "text-center",
      style: {
        minWidth: "100px",
      },
    },
  ];

  return (
    <>
      <BootstrapTable
        wrapperClasses="table-responsive"
        classes="table table-head-custom table-vertical-center overflow-hidden"
        bootstrap4
        bordered={false}
        keyField="id"
        data={data}
        columns={columns}
        sort={{ dataField: 'id', order: 'desc' }}
        selectRow={
          {
            mode: 'checkbox',
            onSelect: (row, isSelect, rowIndex, e) => {
              singleWiseSelectHandler(row, isSelect);
            },
            onSelectAll: (isSelect, rows, e) => {
              allSelectHandler(rows, isSelect);

            }

          }
        }

        pagination={paginationFactory({ sizePerPage: 10, showTotal: true })}
      />
    </>
  );
}
