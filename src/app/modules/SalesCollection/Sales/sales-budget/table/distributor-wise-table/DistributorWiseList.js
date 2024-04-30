
import React , {useState, useEffect} from "react";
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

export function DistributorWiseList({setSingleAll, singleAll, distributorWiseSalesBudgetList}) {
  let history = useHistory();
  const intl = useIntl();
  const openViewPage = (data) => {
    // history.push('/salescollection/distributors/activity-view', { state: data });
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
      text: intl.formatMessage({id: "PAYMENT.COLLECTION.ORD_DISTRIBUTOR"}),
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      formatter: (cellContent, row) => (

        <>
        <div className="d-flex" style={{ marginBottom: "-10px" }}>
         
          {row.status=="active"?<div className="circel-active" ></div>:""}
          <div className="ml-3 mt-2">
            <span>
              <span style={{ fontWeight: "500" }}><strong>{row.distributorName}</strong></span>
              <p className="dark-gray-color"> 
                <span className="text-muted">
                <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/CreditLimit.svg")} width="15px" height="15px" />&nbsp;
                  Credit Limit</span>&nbsp;{row.creditLimit}
              </p>
            </span>
          </div>
        </div>
      </>

      )
    },
    {/*{
      dataField: "collection_amount",
      text: intl.formatMessage({id: "SALES.RETURN.RETURN_By"}),
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      formatter: (cellContent, row) => (
        <>
          <strong>{row.salesOfficer}</strong><br />
          <span className="text-muted">{row.salesOfficerDesignation}, {row.assalesOfficerLocation}</span>
        </>
      )
    },*/},
   
    {
      dataField: "collection_budget",
      text: intl.formatMessage({id: "COMMON.SALES_BUDGET"}),
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      formatter: (cellContent, row) => (
        <>
          <strong>{amountFormatterWithoutCurrency(row.salesBudget)}</strong><br />
        </>
      )
    },
    {
      dataField: "action",
      text: intl.formatMessage({id: "MENU.ACTION"}),
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
        data={distributorWiseSalesBudgetList}
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
