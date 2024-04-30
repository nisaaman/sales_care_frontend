
import React from "react";
import { useHistory } from "react-router-dom";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import { ActionsColumnFormatter } from "./ActionsColumnFormatter";
import {useIntl} from "react-intl";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../../../../../../_metronic/_helpers";
import { format, parseISO } from 'date-fns';

export default function PickingViewList({setSingleAll, singleAll, pikingList}) {
  const intl = useIntl();
  let history = useHistory();
  
  const openConfirmPage = (data) => {
    history.push('/inventory/stock/sales-order/picking-list-view-confirm', { state: data });
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
      dataField: "picking_no",
      text:"PICKING INFO",
      formatter: (cellContent, row) => (
        <>
         <strong>{row.picking_no}</strong><br />
         <strong className="text-muted">{format(parseISO(row.picking_date), 'dd-MMM-yyyy')}</strong>
        </>
      )
    },
    // {
    //   dataField: "order_no",
    //   text:"ORDER",
    //   formatter: (cellContent, row) => (
    //     <>
    //      <strong>{row.order_no}</strong><br />
    //     </>
    //   )
    // },
    {
      dataField: "product",
      text: "PRODUCTS",
      headerClasses:"text-center",
      classes:"text-center",
      formatter: (cellContent, row) => (
        <>
          <strong>{row.total_product}</strong>
        </>
      )
    },
    {
      dataField: "action",
      text: intl.formatMessage({id: "MENU.ACTIONS"}),
      formatter: ActionsColumnFormatter,
      formatExtraData: {
        openConfirmPage: openConfirmPage,
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
        keyField="picking_id"
        data={pikingList}
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
