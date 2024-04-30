
import React from "react";
import { useHistory } from "react-router-dom";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import { ActionsColumnFormatter } from "./ActionsColumnFormatter";
import {useIntl} from "react-intl";
import { amountFormatterWithoutCurrency } from "../../../../../../../Util";
import { shallowEqual, useSelector } from 'react-redux';
import { hasCreateAccess } from "../../../../../../../Util";

export function AllList({setSingleAll, singleAll, getData}) {
  const intl = useIntl();
  let history = useHistory();
  const permissions = useSelector((state) => state.auth.user.permissions, shallowEqual);

  const openVerifyPage = (data) => {
    history.push('/salescollection/payment-adjustment/payment-verify/view-verify', { data: data });
  }

  const singleWiseSelectHandler = (data, isSelect) => {
    if (isSelect === true) {
      let temp = [...singleAll]
      temp.push(data)
      setSingleAll(temp)
    } else {
      if (singleAll.length >= 0) {
        let temp = [...singleAll]
        const index = temp.findIndex(obj => obj.id === data.id);
        temp.splice(index, 1);
        setSingleAll(temp)
      }
    }

  }
  const allSelectHandler = (allData, isSelect) => {
    if (isSelect === true) {
      setSingleAll(allData)
    }
    else {
      if (allData.length >= 0) {
        for (let i = 0; i < allData.length; i++) {
          const index = singleAll.findIndex(obj => obj.id === allData[i].id);
          singleAll.splice(index, 1);
          setSingleAll(singleAll)
        }
      }
    }

  }
  const columns = [
    {
      dataField: "code",
      text:intl.formatMessage({id: "COLLECTIONDATA.PAYMENT_INFO"}),
      formatter: (cellContent, row) => (
        <>
          <span className="text-muted">{row.payment_no}</span>
          {row.payment_nature === 'ADVANCE' ? 
          <span className="text-primary">(Advance)</span> : '' }<br />
          <strong>{row.days_ago} Days Ago</strong><br />
          <span className="text-muted">{row.payment_date}</span>
        </>
      )
    },
    {
      dataField: "sales_officer",
      text: intl.formatMessage({id: "FROM"}),
      formatter: (cellContent, row) => (
        <>
          <strong>{row.distributor_name}</strong><br />
          <span className="text-muted">Balance&nbsp;{amountFormatterWithoutCurrency(row.distributor_balance)}</span>
        </>
      )
    },
    {
      dataField: "collection_by",
      text: intl.formatMessage({id: "COLLECTIONSUMMARYTABLE.COLLECTED_BY"}),
      formatter: (cellContent, row) => (
        <>
          <strong>{row.collected_by}</strong><br />
          <span className="text-muted">{row.designation + ', ' + row.location_name}</span>
        </>
      )
    },    
    {
      dataField: "collection_amount",
      text: intl.formatMessage({id: "COLLECTIONDATA.ORDER_AMOUNT"}),
      headerClasses: "text-right",
      classes: "text-right",
      formatter: (cellContent, row) => (
        <div >
          <strong>{amountFormatterWithoutCurrency(row.collection_amount)}</strong><br />
          <span className="text-muted">{row.payment_type}</span>
        </div>
      )
    },
    hasCreateAccess(permissions, "PAYMENT_VERIFY") ?
    {
      dataField: "action",
      text: intl.formatMessage({id: "MENU.ACTION"}),
      formatter: ActionsColumnFormatter,
      formatExtraData: {
        openVerifyPage: openVerifyPage,
      },
      classes: "text-right",
      headerClasses: "text-right",
      style: {
        minWidth: "100px",
      },
    } : "",
  ];

  return (
    <>
      <BootstrapTable
        wrapperClasses="table-responsive"
        classes="table table-head-custom table-vertical-center overflow-hidden"
        bootstrap4
        bordered={false}
        keyField="id"
        data={getData}
        columns={columns}
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
