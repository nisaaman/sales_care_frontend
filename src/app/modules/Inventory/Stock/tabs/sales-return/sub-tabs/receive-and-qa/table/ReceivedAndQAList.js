
import React from "react";
import { useHistory } from "react-router-dom";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import { ActionsColumnFormatter } from "./ActionsColumnFormatter";
import {useIntl} from "react-intl";
const data = [
  {
    "id": 1,
    "code": "12535689",
    "duration": "12 Days Left",
    "date": "10 APR 2022",
    "dateTime": "10 APR 2022 10:23 AM",
    "distributor":"Bhai Bhai Enterprize",
    "balance": "570,168,000",
    "user": "Mmh Shohagh",
    "designation": "Depot In Charge, Cox’s Bazar",
    "collectionamount": "570,168,000",
    "collectionType": "Cheque",
    "status": "QUARANTINE",
    "invoiceNo": "Credit"
  },
  {
    "id": 2,
    "code": "12535689",
    "duration": "12 Days Left",
    "date": "10 APR 2022",
    "dateTime": "10 APR 2022 10:23 AM",
    "distributor":"Bhai Bhai Enterprize",
    "balance": "570,168,000",
    "user": "Mmh Shohagh",
    "designation": "Depot In Charge, Cox’s Bazar",
    "collectionamount": "570,168,000",
    "collectionType": "Credit",
    "status": "QUARANTINE",
    "invoiceNo": "Credit"
  },
  {
    "id": 3,
    "code": "12535689",
    "duration": "12 Days Left",
    "date": "10 APR 2022",
    "dateTime": "10 APR 2022 10:23 AM",
    "distributor":"Bhai Bhai Enterprize",
    "balance": "570,168,000",
    "user": "Mmh Shohagh",
    "designation": "Depot In Charge, Cox’s Bazar",
    "collectionamount": "570,168,000",
    "collectionType": "Online",
    "status": "QA CHECKED",
    "invoiceNo": "Credit"
  },
  
]
export default function ReceivedAndQAList({setSingleAll, singleAll}) {
  const intl = useIntl();
  let history = useHistory();
  
  const openViewQAReport = (data) => {
    //history.push('/sales-booking-proposal-approval', { state: data });
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
      dataField: "code",
      text:"RETURN INFO",
      formatter: (cellContent, row) => (
        <>
          <span className="text-muted">{row.code}</span>
          <strong className=
          {row.status === "QUARANTINE" ? "dark-warning-color" : 
          row.status === "QA CHECKED" ? "dark-success-color" :""}
          >({row.status})</strong><br />
          <strong>{row.distributor}</strong><br />
          <span className="text-muted">{row.dateTime}</span>
        </>
      )
    },
    {
      dataField: "sales_officer",
      text: "RECEIVED BY",
      formatter: (cellContent, row) => (
        <>
          <strong>{row.user}</strong><br />
          <span className="text-muted">{row.designation}</span>
        </>
      )
    },
    {
      dataField: "collection_amount",
      text: "AMOUNT",
      headerClasses:"text-right",
      formatter: (cellContent, row) => (
        <>
          <strong className="float-right">{row.collectionamount}</strong><br />
          <span className="text-muted float-right" >{row.dateTime}</span>
        </>
      )
    },
    {
      dataField: "action",
      text: intl.formatMessage({id: "MENU.ACTION"}),
      formatter: ActionsColumnFormatter,
      formatExtraData: {
        openViewQAReport: openViewQAReport,
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
