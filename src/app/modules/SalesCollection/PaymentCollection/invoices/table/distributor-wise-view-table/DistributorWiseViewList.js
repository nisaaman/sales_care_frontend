
import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import SVG from "react-inlinesvg";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import { useIntl } from "react-intl";
import { ActionsColumnFormatter } from "./ActionsColumnFormatter";
import { ReferenceColumnFormatter } from "./ReferenceColumnFormatter";
import {

  toAbsoluteUrl,
  sortCaret,
  headerSortingClasses,
} from "../../../../../../../_metronic/_helpers";
import axios from "axios";
import { amountFormatterWithoutCurrency, dateFormatPattern } from "../../../../../Util";
import moment from "moment";



export function DistributorWiseViewList({ setSingleAll, singleAll,invoiceDetails }) {
  let history = useHistory();
  const intl = useIntl();
    const openViewPage = (data) => {
        let queryParams = '?id=' + data.salesInvoiceId;
        const URL = `${process.env.REACT_APP_API_URL}/api/report/invoice/invoiceReport`+queryParams;
        axios.get(URL, {responseType: 'blob'}).then(response => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', "InvoiceReport.pdf");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }).catch(err => {

        });

    }


  const acknowledgeDocumentDownload = (data) => {
    let queryParams = '?invoiceId=' + data.salesInvoiceId;
    const URL = `${process.env.REACT_APP_API_URL}/api/sales-invoice/get-acknowledge-document-info` + queryParams;
    axios.get(URL).then(response => {
      let documentInfo = response.data.data;

      const URL = `${process.env.REACT_APP_API_URL}/api/sales-invoice/download-acknowledge-document` + queryParams;
      axios.get(URL, {responseType: 'blob'}).then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', documentInfo.fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }).catch(err => {

      });

    }).catch(err => {

    });
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
            <strong>{row.invoiceNo + "(" + row.invoiceNature + ")"}</strong><br/>
            <span className="text-muted">{moment(row.invoiceDate).format(dateFormatPattern())}</span>
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
          <strong>{row.salesOfficer}</strong><br/>
          <span className="text-muted">{row.designation}, {row.location_name}</span>
        </div>

      )
    },
    {
      dataField: "elapsed",
      text: intl.formatMessage({ id: "COMMON.OVERDUE_DAYS" }),
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      headerClasses: "text-center",
      classes: "text-center",
      formatter: (cellContent, row) => (
        <div>
          <span className="invoices-count-span-credit mr-5">
            <strong>{row.overDueDays}</strong>
          </span>
        </div>

      )
    },
    {
      dataField: "acknowledge document",
      text: "acknowledge document",
      formatter: ReferenceColumnFormatter,
      formatExtraData: {
        acknowledgeDocumentDownload: acknowledgeDocumentDownload,
      },
      classes: "text-center",
      headerClasses: "text-center",
      style: {
        minWidth: "100px",
      },
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
          <strong>{amountFormatterWithoutCurrency(row.invoiceBalance)}</strong>
          <span className="text-primary" style={{display:"inline-block", position:"relative"}}>{"("+amountFormatterWithoutCurrency(row.ordAmount)+")"}</span><br/>
          <span className="text-muted">Amount</span>
          <strong>{" "+amountFormatterWithoutCurrency(row.invoiceAmount)}</strong>
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
        keyField="salesInvoiceId"
        data={invoiceDetails}
        columns={columns}
        sort={{dataField: 'invoiceNo', order: 'desc'}} 
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
