
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
import { amountFormatterWithoutCurrency } from "../../../../../Util";

export function DistributorWiseList({ setSingleAll, singleAll, distributorWiseSalesInvoiceOverviewList,asOnDateStr}) {
  let history = useHistory();
  const intl = useIntl();
  const openViewPage = (data) => {
     history.push('/salescollection/payment-collection/invoices/distributor-wise-view', { state: data,asOnDateStr: asOnDateStr });
  }
  const singleWiseSelectHandler = (data, isSelect) => {
    if (isSelect == true) {
      let temp = [...singleAll]
      temp.push(data)
      setSingleAll(temp)
    } else {
      if (singleAll.length >= 0) {
        let temp = [...singleAll]
        const index = temp.findIndex(obj => obj.distributorId == data.distributorId);
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
          const index = singleAll.findIndex(obj => obj.distributorId == allData[i].distributorId);
          singleAll.splice(index, 1);
          setSingleAll(singleAll)
        }
      }
    }
  }

  const columns = [
    {
      dataField: "distributor",
      text: intl.formatMessage({ id: "PAYMENT.COLLECTION.ORD_DISTRIBUTOR" }),
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      formatter: (cellContent, row) => (

        <>
          <div className="d-flex" style={{ marginBottom: "-10px" }}>
            {/*<div className="mt-2">
              <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/Lays.svg")} width="30px" height="30px" />
      </div>*/}
            <div className="ml-3 mt-2">
              <span>
                <span style={{ fontWeight: "500" }}><strong>{row.distributorName}</strong></span>
                <p className="dark-gray-color">
                  <span className="text-muted">
                    <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/CreditLimit.svg")} width="15px" height="15px" />&nbsp;
                    Balance</span>&nbsp;{amountFormatterWithoutCurrency(row.ledgerBalance)}
                </p>
              </span>
            </div>
          </div>
        </>

      )
    },
    {
      dataField: "credit",
      text: intl.formatMessage({ id: "COMMON.INVOICES_CAPITAL" }),
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      headerClasses: "text-center",
      classes: "text-center",
      style: {
        minWidth: "25rem",
      },
      formatter: (cellContent, row) => (
        <div>
          <span className="invoices-count-span-credit mr-5">
            <strong>{row.creditInvoice +" Credit"}</strong>
          </span>
          <span className="invoices-count-span-cash mr-5">
            <strong>{row.cashInvoice +" Cash"}</strong>
          </span>
          {
            row.overdueInvoice === "" ? "" : <span className="invoices-count-span-overdues">
              <strong>{row.overdueInvoice +" Overdue"}</strong>
            </span>
          }

        </div>

      )
    },
    {
      dataField: "action",
      text: intl.formatMessage({ id: "MENU.ACTION" }),
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
        keyField="distributorId"
        data={distributorWiseSalesInvoiceOverviewList}
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
