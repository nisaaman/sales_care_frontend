
import React from "react";
import { useHistory } from "react-router-dom";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import {useIntl} from "react-intl";
import { dateFormatPattern } from "../../../../../../../Util";
import moment from "moment";
const data = [
  {
    "id": 1,
    "code": "12535689",
    "depot":"Dhaka Depot",
    "dateTime": "10 APR 2022 10:23 AM",
    "user": "Mmh Shohagh",
    "designation": "Depot Incharge, Dhaka Depot",
    "qty": "55,570",
    "balance": "2,555,570",
    "status": "PENDING",
  } 
]
export default function StockSendList({setSingleAll, singleAll, invTransDetails}) {

  const singleWiseSelectHandler = (data, isSelect) => {
    if (isSelect == true) {
      let temp = [...singleAll]
      temp.push(data)
      setSingleAll(temp)
    } else {
      if (singleAll.length >= 0) {
        let temp = [...singleAll]
        const index = temp.findIndex(obj => obj.transferId == data.transferId);
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
          const index = singleAll.findIndex(obj => obj.transferId == allData[i].transferId);
          singleAll.splice(index, 1);
          setSingleAll(singleAll)
        }
      }
    }

  }
  const columns = [
    {
      dataField: "sales_officer",
      text: "STOCK RECEIVE INFO",
      formatter: (cellContent, row) => (
        <>
          <strong>{row.depotName}</strong><br />
          <span className="text-muted">{moment(row.transferDate).format(dateFormatPattern())}</span>
        </>
      )
    },
    {
      dataField: "code",
      text:"BY",
      formatter: (cellContent, row) => (
        <>
          <strong>{row.depotIncharge}</strong><br />
          <span className="text-muted">{row.designation}</span>
        </>
      )
    },
    {
      dataField: "collection_amount",
      text: "TRANSFER INFO",
      formatter: (cellContent, row) => (
        <>
          <strong>{row.transferNo}</strong><br />
          <span className="text-muted">{"QTY."+row.quantity}</span>
        </>
      )
    }
  ];

  return (
    <>
      <BootstrapTable
        wrapperClasses="table-responsive"
        classes="table table-head-custom table-vertical-center overflow-hidden"
        bootstrap4
        bordered={false}
        keyField="transferId"
        data={invTransDetails}
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
