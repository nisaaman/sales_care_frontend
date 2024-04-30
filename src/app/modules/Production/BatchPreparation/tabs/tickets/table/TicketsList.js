
import React, { useState } from "react";
import { useHistory, Route } from "react-router-dom";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import { ActionsColumnFormatter } from "./ActionsColumnFormatter";
import { RejectModal } from "./RejectModal";
import { ConfirmModal } from "./ConfirmModal";
import { ViewModal } from "./ViewModal";
import { useIntl } from "react-intl";
import { showError, showSuccess } from '../../../../../../pages/Alert';
import axios from 'axios';
import { shallowEqual, useSelector } from "react-redux";
import { format, parseISO } from 'date-fns';

export function TicketsList({ setSingleAll, singleAll, ticketsList, searchParams, ticketListAction }) {
  const intl = useIntl();
  let history = useHistory();
  const fields = {
    commitmentDate: "",
    notes: ""
    //confirmQuantity:""
}
  const companyId = useSelector((state) => state.auth.company, shallowEqual);
  const [inputs, setInputs] = useState(fields);
  const [confirm, setConfirm] = useState({});
  const [reject, setReject] = useState({});
  const [view, setView] = useState({});
  const [depotWiseStockList, setDepotWiseStockList] = useState([])
  const openConfirmPage = (data) => {
    setConfirm(data)
    history.push('/production/production-batch-preparation/production-batch-preparation-product-tickets/confirm');
  }
  const openRejectPage = (data) => {
    setReject(data)
    history.push('/production/production-batch-preparation/production-batch-preparation-product-tickets/rejected');
  }

  const openViewPage = (data) => {
    let queryParams = 'companyId=' + companyId;
    queryParams += '&productId=' + data.product_id;
    const URL = `${process.env.REACT_APP_API_URL}/api/product/get-product-wise-depot?` + queryParams;
    axios.get(URL).then(response => {
      setDepotWiseStockList(response.data.data);
    }).catch(err => { });
    setView(data)
    history.push('/production/production-batch-preparation/production-batch-preparation-product-tickets/view');
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
  const validate = () => {
    trimData();
    if (!inputs.confirmQuantity) {
      showError('Ticket quantity is required.');
      return false;
  }
    if (!inputs.commitmentDate || inputs.commitmentDate==="Invalid date") {
        showError('Commitment date is required.');
        return false;
    }
    if (!inputs.notes) {
      showError('Note is required.');
      return false;
    }
    return true;
  }
  const trimData = () => {
    inputs.notes = inputs.notes.trim();
}
  const confirmAction = (data) => {
    if (!validate()) {return false;}
    let obj = {};
    obj.id = data.material_receive_plan_id;
    obj.salesBookingDetailsId = data.sales_booking_details_id;
    obj.ticketStatus = "CONFIRMED";
    obj.itemStatus = "TICKET_CONFIRMED";
    obj.notes = inputs.notes;
    obj.commitmentDate = inputs.commitmentDate;
    obj.confirmQuantity = inputs.confirmQuantity;
    //console.log(obj)
    const URL = `${process.env.REACT_APP_API_URL}/api/material-receive-plan`;
        axios.put(URL, obj).then(response => {
            if (response.data.success === true) {
              showSuccess("This ticket successfully confirmed")
              ticketListAction(searchParams);
              history.push('/production/production-batch-preparation/production-batch-preparation-product-tickets');
            } else {
                showError(response.data.message);
            }
        }).catch(err => {
            showError("Cannot be Updated");
        });
    
  }
  const rejectAction = (data) => {
    let obj = {};
    obj.id = data.material_receive_plan_id;
    obj.salesBookingDetailsId = data.sales_booking_details_id;
    obj.ticketStatus = "REJECTED";
    obj.itemStatus = "TICKET_REJECTED";

    const URL = `${process.env.REACT_APP_API_URL}/api/material-receive-plan`;
        axios.put(URL, obj).then(response => {
            if (response.data.success === true) {
              showSuccess("This ticket successfully Rejected")
              ticketListAction(searchParams);
              history.push('/production/production-batch-preparation/production-batch-preparation-product-tickets');
            } else {
                showError(response.data.message);
            }
        }).catch(err => {
            showError("Cannot be Updated");
        });
    
  }
  console.log(ticketsList)
  const columns = [
    {
      dataField: "depot_id",
      text: "Depot",
      formatter: (cellContent, row) => (
        <>
          <strong>{row.depot_name}</strong><br />
        </>
      )
    },
    {
      dataField: "bookingInfo",
      text: "BOOKING INFO",
      formatter: (cellContent, row) => (
        <>
          <span className="text-muted">{row.booking_no}</span><br />
          <strong>{row.distributor_name}</strong><br />
          <span className="text-muted">{format(parseISO(row.booking_date), 'dd-MMM-yyyy HH:mm a')}</span>
        </>
      )
    },
    {
      dataField: "productInfo",
      text: "PRODUCT INFO",
      formatter: (cellContent, row) => (
        <>
          <span className="text-muted">{row.product_sku}</span><br />
          <strong>{row.product_name}</strong><br />
          <span className="text-muted">{row.category_name}</span>
        </>
      )
    },

    {
      dataField: "qty",
      text: "Qty.",
      formatter: (cellContent, row) => (
        <>
          <span className="dark-blue-color">
            <span className="mr-1">Booking Qty.</span>
            <strong>{row.booking_quantity}</strong>
          </span><br />
          <span className="dark-purple-color">
            <span className="mr-1">Stock Qty.</span>
            <strong>{row.stock_quantity}</strong>
          </span><br />
          <span className="dark-danger-color">
            <span className="mr-1">Ticket Qty.</span>
            <strong>{row.ticket_quantity}</strong>
          </span><br />
          {
            row.confirm_quantity !==null?
            <span className="dark-warning-color">
            <span className="mr-1">Confirm Qty.</span>
            <strong>{row.confirm_quantity}</strong>
          </span>
            :""
          }
        </>
      )
    },
    {
      dataField: "action",
      text: intl.formatMessage({ id: "MENU.ACTIONS" }),
      formatter: ActionsColumnFormatter,
      formatExtraData: {
        openConfirmPage: openConfirmPage,
        openRejectPage: openRejectPage,
        openViewPage:openViewPage
      },
      classes: "text-center",
      headerClasses: "text-center",
      style: {
        minWidth: "300px",
      }
    },
  ];

  return (
    <>
      <Route path="/production/production-batch-preparation/production-batch-preparation-product-tickets/confirm">
        {({ history, match }) => (
          <ConfirmModal
            show={match != null}
            data={confirm}
            confirmAction={confirmAction}
            inputs={inputs}
            setInputs={setInputs}
            onHide={() => {
              history.push("/production/production-batch-preparation/production-batch-preparation-product-tickets");
            }}
          />
        )}
      </Route>
      <Route path="/production/production-batch-preparation/production-batch-preparation-product-tickets/rejected">
        {({ history, match }) => (
          <RejectModal
            show={match != null}
            data={reject}
            rejectAction={rejectAction}
            onHide={() => {
              history.push("/production/production-batch-preparation/production-batch-preparation-product-tickets");
            }}
          />
        )}
      </Route>
      <Route path="/production/production-batch-preparation/production-batch-preparation-product-tickets/view">
        {({ history, match }) => (
          <ViewModal
            show={match != null}
            dataList = {depotWiseStockList}
            data = {view}
            onHide={() => {
              history.push("/production/production-batch-preparation/production-batch-preparation-product-tickets");
            }}
          />
        )}
      </Route>
      <BootstrapTable
        wrapperClasses="table-responsive"
        classes="table table-head-custom table-vertical-center overflow-hidden"
        bootstrap4
        bordered={false}
        keyField="id"
        data={ticketsList}
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
