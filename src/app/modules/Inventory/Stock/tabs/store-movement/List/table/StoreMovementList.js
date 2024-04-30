
import React from "react";
import { useHistory } from "react-router-dom";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import { ActionsColumnFormatter } from "./ActionsColumnFormatter";
import {useIntl} from "react-intl";
import moment from "moment";
import { dateFormatPattern } from "../../../../../../Util";

export default function StoreMovementList({setSingleAll, singleAll, interStoreMovementDetails}) {
  const intl = useIntl();
  let history = useHistory();

  const openWaitingPage = (data) => {
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
      dataField: "movementRefNo",
      text: "STOCK MOVEMENT INFO",
      formatter: (cellContent, row) => (
        <>
          <span className="text-muted">{row.movementRefNo}</span>
          <span 
          className={
            row.status === "WAITING"?"dark-gray-color":
            row.status === "APPROVED"?"dark-success-color":
            row.status === "REJECT"?"dark-danger-color":""
          }
          >({row.status})</span><br />
          <strong>{row.fromStore +" to " +row.toStore}</strong><br />
          <span className="text-muted">{moment(row.movementDate).format(dateFormatPattern())}</span>
        </>
      )
    },
    {
      dataField: "code",
      text:"Movement BY",
      sort: true,
      formatter: (cellContent, row) => (
        <>
          <strong>{row.movementBy}</strong><br />
          <span className="text-muted">{row.designation}</span>
        </>
      )
    },
    {
      dataField: "collection_amount",
      text: "MOVED QTY.",
      headerClasses:"text-right",
      classes:"text-right",
      formatter: (cellContent, row) => (
        <>
          <strong>{row.quantity}</strong><br />
          {/* <span className="text-muted">{row.uom}</span> */}
        </>
      )
    },
    {
      dataField: "action",
      text:"ACTION",
      formatter: ActionsColumnFormatter,
      formatExtraData: {
        openWaitingPage: openWaitingPage
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
        data={interStoreMovementDetails}
        columns={columns}
        sort={{ dataField: 'movementRefNo', order: 'desc' }}
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
