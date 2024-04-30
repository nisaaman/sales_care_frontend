
import React from "react";
import { useHistory } from "react-router-dom";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import { ActionsColumnFormatter } from "./ActionsColumnFormatter";
import {useIntl} from "react-intl";
import { format, parse, isValid, parseISO } from 'date-fns';
import {
  sortCaret,
  headerSortingClasses,
} from "../../../../../../../../../_metronic/_helpers";

export default function SalessBookingList({setSingleAll, singleAll, data}) {
  const intl = useIntl();
  let history = useHistory();

  const openApprovePage = (data) => {
    history.push('/sales-booking-proposal-approval', { state: data });
  }
  const openWaitingPage = (data) => {
    //history.push('/salescollection/payment-adjustment/payment-verify/view-verify', { state: data });
  }
  const openReviewPage = (data) => {
    //history.push('/salescollection/payment-adjustment/payment-verify/view-verify', { state: data });
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
      text:"BOOKING INFO",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      formatter: (cellContent, row) => (
        <>
          <span className="text-muted">{row.booking_no}</span>
          <strong className=
          {row.approval_status === "PENDING" ? "dark-gray-color" : 
          row.approval_status === "APPROVED" ? "dark-success-color" : 
          row.approval_status === "REJECTED" ? "dark-danger-color" : "dark-gray-color"}
          >({row.approval_status})</strong><br />
          <strong>{row.distributor_name}</strong><br />
          <span className="text-muted">{row.booking_date !=null ?format(parseISO(row.booking_date), 'dd-MMM-yyyy HH:mm a'): ""}</span>
        </>
      )
    },
    {
      dataField: "sales_officer",
      text: "BY",
      formatter: (cellContent, row) => (
        <>
          <strong>{row.sales_officer_name}</strong><br />
          <span className="text-muted">{row.designation_name},&nbsp;{row.location_name}</span>
        </>
      )
    },
    {
      dataField: "tentative_delivery_date",
      text: "EST. Delivery date",
      headerClasses:"text-right",
      classes:"text-right",
      formatter: (cellContent, row) => (
        <>
          <strong>{row.days_left} Days Left</strong><br />
          <span className="text-muted">{row.tentative_delivery_date!=null ? format(parseISO(row.tentative_delivery_date), 'dd-MMM-yyyy'): ""}</span>
        </>
      )
    },
    {
      dataField: "booking_amount",
      text: "booking amount",
      headerClasses:"text-right",
      formatter: (cellContent, row) => (
        <>
          <strong className="float-right">{row.booking_amount !==null ? row.booking_amount.toLocaleString('en-US', {minimumFractionDigits: 2}) : 0.00}</strong><br />
          <span className="text-muted float-right" >{row.discounted_amount !==null ? row.discounted_amount.toFixed(2) : 0.00}</span><br />
          <span className="text-muted float-right" >{row.invoice_nature}</span>
        </>
      )
    },
    {
      dataField: "action",
      text: intl.formatMessage({id: "MENU.ACTION"}),
      formatter: ActionsColumnFormatter,
      formatExtraData: {
        openApprovePage: openApprovePage,
        openWaitingPage: openWaitingPage,
        openReviewPage: openReviewPage,
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
        data={data}
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
