
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
const data = [
  {
    "id": 1,
    "distributor": "Mohammad Atif Aslam 1", 
    "designation":"Sales Officer",
    "location":"Cox’s Bazar",
    "credit": "99 Credit",
    "cash": "99 Cash",
    "overdues": "99 Overdues" 
  },
  {
    "id": 2,
    "distributor": "Mohammad Atif Aslam 2", 
    "designation":"Sales Officer",
    "location":"Cox’s Bazar",
    "credit": "99 Credit",
    "cash": "99 Cash",
    "overdues": "99 Overdues"     
  },
  {
    "id": 3,
    "distributor": "Mohammad Atif Aslam 3", 
    "designation":"Sales Officer",
    "location":"Cox’s Bazar",
    "credit": "99 Credit",
    "cash": "99 Cash",
    "overdues": "99 Overdues"  
  },
  {
    "id": 4,
    "distributor": "Mohammad Atif Aslam 4", 
    "designation":"Sales Officer",
    "location":"Cox’s Bazar",
    "credit": "99 Credit",
    "cash": "99 Cash",
    "overdues": ""     
  },
  {
    "id": 5,
    "distributor": "Mohammad Atif Aslam 5", 
    "designation":"Sales Officer",
    "location":"Cox’s Bazar",
    "credit": "99 Credit",
    "cash": "99 Cash",
    "overdues": ""    
  },
  
]


export function SalesOfficerWiseList({setSingleAll, singleAll, }) {
  let history = useHistory();
  const intl = useIntl();
  const openViewPage = (data) => {
    history.push('/salescollection/payment-collection/invoices/sales-officer-wise-view', { state: data });
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
      dataField: "distributor",
      text: intl.formatMessage({id: "COMMON.SALES.OFFICER_TITLE"}),
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      formatter: (cellContent, row) => (

        <>
        <div className="d-flex" style={{ marginBottom: "-10px" }}>
          {row.status=="active"?<div className="circel-active" ></div>:""}
          <div className="ml-3 mt-2">
            <span>
              <span style={{ fontWeight: "500" }}><strong>{row.distributor}</strong></span>
              <p className="dark-gray-color"> 
                <span className="text-muted">
                <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/designation.svg")} width="13px" height="13px" />&nbsp;
                  {row.designation + "," +row.location}
                </span>
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
      formatter: (cellContent, row) => (
        <div>
          <span className="invoices-count-span-credit mr-5">
            <strong>{row.credit}</strong>
          </span>
          <span className="invoices-count-span-cash mr-5">
            <strong>{row.cash}</strong>
          </span>
          {
            row.overdues === "" ? "" : <span className="invoices-count-span-overdues">
              <strong>{row.overdues}</strong>
            </span>
          }

        </div>

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
