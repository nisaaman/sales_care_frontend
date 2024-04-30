
import React, { useState } from "react";
import { Route, useHistory } from "react-router-dom";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import { ActionsColumnFormatter } from "./ActionsColumnFormatter";
import {useIntl} from "react-intl";
import { showError, showSuccess } from "../../../../../../../pages/Alert";
import { StatusUpdateModal } from "../../../../../../Common/StatusUpdateModal";
import axios from "axios";
import { CommonModal } from "../../../../../../Common/CommonModal";

export function AllList({setSingleAll, singleAll, data, setData}) {
  const intl = useIntl();
  let history = useHistory();
  const [settleOrd, setSettleOrd] = useState(null);
  
  const openVerifyPage = (data) => {
    setSettleOrd(data);
    history.push("/salescollection/payment-adjustment/ord-settlement/all-list/settle");
  }

  const settlePayment = () => { 
    console.log("settleOrd", settleOrd);   
    const obj = {};
    obj.id = settleOrd.id;
    obj.ordAmount = settleOrd.ord_amount;
    obj.salesInvoiceId = settleOrd.sales_invoice_id;
    obj.distributorBalanceId = settleOrd.distributor_balance_id
    obj.paymentCollectionId = settleOrd.payment_collection_id;
    obj.companyId = settleOrd.company_id;

    const URL = `${process.env.REACT_APP_API_URL}/api/payment-collection-adjustment/adjust-ord`;
    axios.post(URL, obj).then(response => {
      if(response.data.success == true){
          showSuccess(response.data.message)
          const tempData = [...data]
          const ord = tempData.find(o => o.id == obj.id);
          ord.is_ord_settled = true;
          setData(tempData);
          setSettleOrd(null);
      }
      else{
          showError(response.data.message);
      }
    }).catch(err => {
        showError(err);
    });

    history.push("/salescollection/payment-adjustment/ord-settlement/all-list"); 
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
        dataField: "duration",
        text: "PAYMENT RECEIVE INFO",
        formatter: (cellContent, row) => (
            <>
                <span className="text-muted">{row.payment_no}</span><br />
                <strong>{row.days_ago} Days Ago</strong><br />
                <span className="text-muted">{row.payment_date}</span>
            </>
        )
    },
    {
        dataField: "distributor",
        text: "DISTRIBUTORS",
        formatter: (cellContent, row) => (
            <>
                <strong>{row.distributor_name}</strong><br />
                <span className="text-muted">Balance {row.ledger_balance.toFixed(2)}</span>
            </>
        )
    },
    {
        dataField: "user",
        text: "ENTRY BY",
        formatter: (cellContent, row) => (
            <>
                <strong>{row.collected_by}</strong><br />
                <span className="text-muted">{row.designation + ', '+ row.company_name}</span>
            </>
        )
    },
    {
        dataField: "collection_amount",
        style: {textAlign: "right"},
        text: "ORD AMOUNT",        
        formatter: (cellContent, row) => (
            <>
                <strong>{row.ord_amount}</strong><br />
                <span className="text-muted">Invoice No. {row.invoice_no === null ? row.reference_no : row.invoice_no}</span>
            </>
        )
    },
    {
      dataField: "action",
      text: intl.formatMessage({id: "MENU.ACTION"}),
      formatter: ActionsColumnFormatter,
      formatExtraData: {
        openVerifyPage: openVerifyPage,
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
      <Route path="/salescollection/payment-adjustment/ord-settlement/all-list/settle">
        {({ history, match }) => (
          <CommonModal       
              title={'ORD Settlement !'}     
              message={'Are you sure to settle this ORD ?'}    
              data={settleOrd}
              show={match != null}
              action={settlePayment}
              btnName={'Settle'}
              onHide={() => {
                  history.push("/salescollection/payment-adjustment/ord-settlement/all-list");                      
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
