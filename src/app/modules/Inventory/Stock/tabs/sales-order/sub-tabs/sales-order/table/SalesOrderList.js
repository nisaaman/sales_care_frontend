
import React from "react";
import { useHistory } from "react-router-dom";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import { ActionsColumnFormatter } from "./ActionsColumnFormatter";
import {useIntl} from "react-intl";
import { amountFormatterWithoutCurrency, dateFormatPattern } from "../../../../../../../Util";
import moment from "moment";
import { Today } from "@material-ui/icons";
import { shallowEqual, useSelector } from 'react-redux';
import { hasCreateAccess } from "../../../../../../../Util";

export default function SalesOrderList({setSingleAll, singleAll, 
                salesBookingDetailsList, companyId, accountingYearId, semesterId}) {

  const intl = useIntl();
  let history = useHistory();
  const permissions = useSelector((state) => state.auth.user.permissions, shallowEqual);

  let quantityRatio = 0;
  const openCreatePage = (data) => {
    history.push('/add-sales-order', { state: data, companyId:companyId, 
                      accountingYearId:accountingYearId, semesterId: semesterId });
  }
  const openViewPage = (data) => {
    history.push('/view-sales-order', { state: data, companyId:companyId, 
      accountingYearId:accountingYearId, semesterId: semesterId });
  }

  const singleWiseSelectHandler = (data, isSelect) => {
    if (isSelect === true) {
      let temp = [...singleAll]
      temp.push(data)
      setSingleAll(temp)
    } else {
      if (singleAll.length >= 0) {
        let temp = [...singleAll]
        const index = temp.findIndex(obj => obj.id === data.bookingId);
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
      text:"BOOKING INFO",
      formatter: (cellContent, row) => (
        <>
          <span className="text-muted">{row.bookingNo}</span>
          <strong className=
          {row.approvalStatus === "PENDING" ? "dark-gray-color" : 
           row.approvalStatus === "APPROVED" ? "dark-success-color" : 
           row.approvalStatus === "REJECTED" ? "dark-danger-color" : "dark-gray-color"}
          >({row.approvalStatus})</strong><br />
          <strong>{row.distributorName}</strong><br />
          <span className="text-muted">{row.bookingDate ? moment(row.bookingDate).format(dateFormatPattern()) : ''}</span>
        </>
      )
    },
    {
      dataField: "sales_officer",
      text: "BY",
      formatter: (cellContent, row) => (
        <>
          <strong>{row.salesOfficerName}</strong><br />
          <span className="text-muted">{row.designation}, {row.soLocationName}</span>
          {/* &nbsp; */}
        </>
      )
    },
    {
      dataField: "collection_amount",
      text: "EST. Delivery date",
      formatter: (cellContent, row) => (
        <>
          <strong>{row.daysLeft == 0 ? moment().diff(row.tentativeDeliveryDate,'days') + " Overdue Days" : row.daysLeft + " Days Left"}</strong><br />
          <span className="text-muted">{row.tentativeDeliveryDate ? moment(row.tentativeDeliveryDate).format(dateFormatPattern()) : ''}</span>
        </>
      )
    },
    {
      dataField: "collection_amount",
      text: "Converted vs Booking",
      headerClasses:"text-center",
      formatter: (cellContent, row) => (
        <>
          <span className="text-muted"><strong>{row.orderConvertedQuantity}</strong></span>
          <span className="text-muted float-right"><strong>{row.bookingQuantity}</strong></span>
          <div class="progress mt-3" style={{height:"5px"}}>
            <div className="d-none">
              {
                 quantityRatio = (row.orderConvertedQuantity * 100) / (row.bookingQuantity)
              }
            </div>
            <div class="progress-bar dark-success-color" role="progressbar" style={{width:quantityRatio+"%"}} aria-valuenow={row.orderConvertedQuantity} aria-valuemin="0" aria-valuemax={row.orderConvertedQuantity + row.bookingQuantity}></div>
          </div>
        </>
      )
    },
    hasCreateAccess(permissions, "SALES_ORDER") ? 
    {
      dataField: "action",
      text: intl.formatMessage({id: "MENU.ACTIONS"}),
      formatter: ActionsColumnFormatter,
      formatExtraData: {
        openCreatePage: openCreatePage,
        openViewPage: openViewPage,
      },
      classes: "text-center",
      headerClasses: "text-center",
      style: {
        minWidth: "100px",
      },
    } : 
    "",
  ];

  return (
    <>
      <BootstrapTable
        wrapperClasses="table-responsive"
        classes="table table-head-custom table-vertical-center overflow-hidden"
        bootstrap4
        bordered={false}
        keyField="bookingId"
        data={salesBookingDetailsList}
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
