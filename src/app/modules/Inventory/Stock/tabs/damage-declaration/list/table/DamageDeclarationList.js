
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
    "store":"Regular to Restricted",
    "dateTime": "10 APR 2022 10:23 AM",
    "user": "Mmh Shohagh",
    "designation": "Depot Incharge, Dhaka Depot",
    "qty": "55,570",
    "uom": "UOM 8,578 Kg",
    "status": "QACHECK"
  },
  {
    "id": 2,
    "code": "12535689",
    "store":"Quarantine to Restricted",
    "dateTime": "10 APR 2022 10:23 AM",
    "user": "Mmh Shohagh",
    "designation": "Depot Incharge, Dhaka Depot",
    "qty": "55,570",
    "uom": "UOM 8,578 Kg",
    "status": "INAPPROVE"
  },
  {
    "id": 3,
    "code": "12535689",
    "store":"Restricted to Regular",
    "dateTime": "10 APR 2022 10:23 AM",
    "user": "Mmh Shohagh",
    "designation": "Depot Incharge, Dhaka Depot",
    "qty": "55,570",
    "uom": "UOM 8,578 Kg",
    "status": "DISPOSED"
  } 
]
export default function DamageDeclarationList({setSingleAll, singleAll, listData}) {
  const intl = useIntl();
  let history = useHistory();

  const openQACheckPage = (data) => {
    // history.push('/proposal-received', { state: data.batchList });
  }
  const openApprovePage = (data) => {
    // history.push('/proposal-received', { state: data.batchList });
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
      dataField: "damage_no",
      text: "STOCK DAMAGE INFO",
      formatter: (cellContent, row) => (
        <>
          {/* <span className="text-muted">{row.damage_no}</span> */}
          {/* <span 
          className={
            row.status === "QACHECK"?"dark-blue-color":
            row.status === "INAPPROVE"?"dark-warning-color":
            row.status === "DISPOSED"?"dark-success-color":""
          }
          >({row.status})</span><br /> */}
          <strong>{row.damage_no}</strong><br />
          <span className="text-muted">{row.declaration_date}</span>
        </>
      )
    },
    {
      dataField: "created_by",
      text:"BY",
      formatter: (cellContent, row) => (
        <>
          <strong>{row.created_by}</strong><br />
          <span className="text-muted">{row.designation + ', ' + row.company_name}</span>
        </>
      )
    },
    {
      dataField: "reason",
      text:"REASON",
      formatter: (cellContent, row) => (
        <>          
          <span className="text-muted">{row.reason.length > 100 ? row.reason.substring(0,100)+'...' : row.reason}</span>
        </>
      ),
      style: {
        width: "30%",
      },
    },
    {
      dataField: "damage_quantity",
      text: "DAMAGE QTY.",
      headerClasses:"text-right",
      classes:"text-right",
      formatter: (cellContent, row) => (
        <>
          <strong>{row.damage_quantity}</strong>      
        </>
      )
    }/*,
    {
      dataField: "approval_status",
      text: "STATUS.",
      headerClasses:"text-right",
      classes:"text-right",
      formatter: (cellContent, row) => (
        <>
          <span className="text-muted">{row.approval_status}</span>
        </>
      )
    },
    {
      dataField: "action",
      text: intl.formatMessage({id: "MENU.ACTION"}),
      formatter: ActionsColumnFormatter,
      formatExtraData: {
        openQACheckPage: openQACheckPage,
        openApprovePage: openApprovePage
      },
      classes: "text-center",
      headerClasses: "text-center",
      style: {
        minWidth: "100px",
      },
    }, */
  ];

  return (
    <>
      <BootstrapTable
        wrapperClasses="table-responsive"
        classes="table table-head-custom table-vertical-center overflow-hidden"
        bootstrap4
        bordered={false}
        keyField="id"
        data={listData}
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
