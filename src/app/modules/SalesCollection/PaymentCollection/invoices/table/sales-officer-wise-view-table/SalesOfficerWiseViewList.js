
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import SVG from "react-inlinesvg";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import { useIntl } from "react-intl";
import { ActionsColumnFormatter } from "./ActionsColumnFormatter";
import {

  toAbsoluteUrl,
  sortCaret,
  headerSortingClasses,
} from "../../../../../../../_metronic/_helpers";
const data = [
  {
    "id": 1,
    "invoiceNo": "11921364",
    "type": "Cash",
    "dateTime": "10 APR 2022 10:23 AM",
    "so": "Bhai Bhai Enterprise 1",
    "locationType": "Territory",
    "location": "Cox’s Bazar",
    "elapsed": "99 Days",
    "balance": "৳570,168",
    "discont": "+5,000 ORD",
    "amount": "৳55,606,521"
  },
  {
    "id": 2,
    "invoiceNo": "11921364",
    "type": "Cash",
    "dateTime": "10 APR 2022 10:23 AM",
    "so": "Bhai Bhai Enterprise 2",
    "locationType": "Territory",
    "location": "Cox’s Bazar",
    "elapsed": "99 Days",
    "balance": "৳570,168",
    "discont": "+5,000 ORD",
    "amount": "৳55,606,521"
  },
  {
    "id": 3,
    "invoiceNo": "11921364",
    "type": "Cash",
    "dateTime": "10 APR 2022 10:23 AM",
    "so": "Bhai Bhai Enterprise 3",
    "locationType": "Territory",
    "location": "Cox’s Bazar",
    "elapsed": "99 Days",
    "balance": "৳570,168",
    "discont": "+5,000 ORD",
    "amount": "৳55,606,521"
  },
  {
    "id": 4,
    "invoiceNo": "11921364",
    "type": "Cash",
    "dateTime": "10 APR 2022 10:23 AM",
    "so": "Bhai Bhai Enterprise 4",
    "locationType": "Territory",
    "location": "Cox’s Bazar",
    "elapsed": "99 Days",
    "balance": "৳570,168",
    "discont": "+5,000 ORD",
    "amount": "৳55,606,521"
  },
  {
    "id": 5,
    "invoiceNo": "11921364",
    "type": "Cash",
    "dateTime": "10 APR 2022 10:23 AM",
    "so": "Bhai Bhai Enterprise 5",
    "locationType": "Territory",
    "location": "Cox’s Bazar",
    "elapsed": "99 Days",
    "balance": "৳570,168",
    "discont": "+5,000 ORD",
    "amount": "৳55,606,521"
  },

]


export function SalesOfficerWiseViewList({ setSingleAll, singleAll }) {
  let history = useHistory();
  const intl = useIntl();
  const openViewPage = (data) => {
    history.push('/salescollection/payment-collection/invoices/distributor-wise-view', { state: data });
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
      dataField: "invoiceNo",
      text: intl.formatMessage({ id: "COMMON.INVOICES_CAPITAL" }),
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      formatter: (cellContent, row) => (

        <>
          <div>
            <strong>{row.invoiceNo + "(" + row.type + ")"}</strong><br />
            <span className="text-muted">{row.dateTime}</span>
          </div>
        </>

      )
    },
    {
      dataField: "so",
      text: intl.formatMessage({ id: "SALES.RETURN.RETURN_By" }),
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      formatter: (cellContent, row) => (
        <div>
          <span style={{ fontWeight: "500" }}><strong>{row.so}</strong></span><br />
          <span className="text-muted">
            <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/location.svg")} width="15px" height="15px" />&nbsp;
            {row.locationType + " " + row.location}
          </span>
        </div>

      )
    },
    {
      dataField: "elapsed",
      text: intl.formatMessage({ id: "COMMON.ELAPSED" }),
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      headerClasses: "text-center",
      classes: "text-center",
      formatter: (cellContent, row) => (
        <div>
          <span className="invoices-count-span-credit mr-5">
            <strong>{row.elapsed}</strong>
          </span>
        </div>

      )
    },
    {
      dataField: "balance",
      text: intl.formatMessage({ id: "COMMON.BALANCE" }),
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      headerClasses: "text-right",
      classes: "text-right",
      formatter: (cellContent, row) => (
        <div>
          <strong>{row.balance}</strong>
          <span className="text-primary" style={{ display: "inline-block", position: "relative" }}>{"(" + row.discont + ")"}</span><br />
          <span className="text-muted">Amount</span>
          <strong>{row.amount}</strong>
        </div>
      )
    },
    {
      dataField: "action",
      text: intl.formatMessage({ id: "MENU.ACTIONS" }),
      formatter: ActionsColumnFormatter,
      formatExtraData: {
        openViewPage: openViewPage,
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
