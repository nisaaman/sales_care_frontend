
import React , {useState, useEffect} from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import { useIntl } from "react-intl";
import { format, parse, isValid, parseISO } from 'date-fns';
import { ActionsColumnFormatter } from "./ActionsColumnFormatter";
import {
  sortCaret,
  headerSortingClasses,
} from "../../../../../../_metronic/_helpers";
// const data = [
//   {
//     "id": 1,
//     "name": "Fungicide/",
//     "details": "Bhai Bhai Enterprise",
//     "code": "SKU X1253689",
//     "qty": 14254200,
//     "user": "Mmh Shohagh",
//     "designation": "Sales Officer, Cox’s Bazar",
//     "totalqty": "5000+",
//     "saleamount": "৳570,168,000",
//     "totalamount": "-৳142,542,000",
//   },
//   {
//     "id": 2,
//     "name": "Fungicide/",
//     "details": "Bhai Bhai Enterprise",
//     "code": "SKU X1253689",
//     "qty": 14254200,
//     "user": "Mmh Shohagh",
//     "designation": "Sales Officer, Cox’s Bazar vvvvvv",
//     "totalqty": "5000+",
//     "saleamount": "৳570,168,000",
//     "totalamount": "-৳142,542,000",
//   },
// ]


export function SalesBookingList({setSingleAll, singleAll, bookingList}) {
// console.log("setSingleAll", setSingleAll , "singleAll", singleAll);
  let history = useHistory();
  const intl = useIntl();
  const openViewPage = (data) => {
    history.push('/salescollection/sales/sales-booking-view', { state: data });
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
      dataField: "booking_date",
      text: intl.formatMessage({id: "SALES_BOOKING.BOOKING_INFO"}),
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      formatter: (cellContent, row) => (
        <>
          <span className="text-muted">{row.booking_no}</span><br />
          <strong>{row.distributor_name}</strong><br />
          <span className="text-muted">{format(parseISO(row.booking_date), 'dd-MMM-yyyy HH:mm a')}</span>
        </>
      )
    },
    {
      dataField: "sales_officer_name",
      text: intl.formatMessage({id: "SALES_BOOKING.BOOKING_BY"}),
      formatter: (cellContent, row) => (
        <>
          <strong>{row.sales_officer_name}</strong><br />
          <span className="text-muted">{row.designation_name}, {row.location_name}</span>
        </>
      )
    },
    {
      dataField: "booking_quantity",
      text: intl.formatMessage({id: "SALES_BOOKING.BOOKING_QUANTITY"}),
      formatter: (cellContent, row) => (
        <>
          <strong>{row.booking_quantity+row.free_quantity}</strong><br />
          {/* <span className="text-muted">{row.free_quantity}+</span> */}
        </>
      )
    },
    {
      dataField: "booking_amount",
      text: intl.formatMessage({id: "SALES_BOOKING.BOOKING_AMOUNT"}),
      formatter: (cellContent, row) => (
        <>
          <strong>{row.booking_amount !==null ?row.booking_amount.toLocaleString('en-US', {minimumFractionDigits: 2}) :0.00}</strong><br />
          <span className="text-muted">-{row.discounted_amount!==null ? row.discounted_amount.toFixed(2) : 0.00}</span>
        </>
      )
    },
    {
      dataField: "approval_status",
      text: "STATUS",
      formatter: (cellContent, row) => (
        <>
          <strong>{row.approval_status}</strong>
        </>
      )
    },
    {
      dataField: "action",
      text: "Actions",
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
        keyField="booking_id"
        data={bookingList}
        columns={columns}
        sort={{ dataField: 'booking_date', order: 'desc' }}
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
