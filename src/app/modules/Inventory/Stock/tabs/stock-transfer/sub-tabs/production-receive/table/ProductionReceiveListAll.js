import React from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import { useIntl } from "react-intl";

export default function ProductionReceiveList({ setSingleAll, singleAll, invRcvDetails }) {
  const intl = useIntl();

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
      dataField: "batchQuantity",
      text: "BATCH INFO",
      formatter: (cellContent, row) => (
        <>
          <strong>{row.batchNo}</strong><br />
          <span className="text-muted">{row.batchQuantity}</span><br />
          <strong>{row.receive_no}</strong>
        </>
      )
    },
    {
      dataField: "productSku",
      text: "PRODUCT INFO",
      formatter: (cellContent, row) => (
        <>
          <span className="text-muted">{row.productSku}</span><br />
          <strong>{row.productName}</strong><br />
          <span className="text-muted">{row.productCategory}</span>
        </>
      )
    },
    {
      dataField: "receiveStore",
      text: "STORE INFO",
      formatter: (cellContent, row) => (
        <>
          <strong>{row.receiveStore}</strong><br />
        </>
      )
    },
    {
      dataField: "receiveQuantity",
      text: "QTY.",
      headerClasses: "text-right",
      classes: "text-right",
      formatter: (cellContent, row) => (
        <>
          <strong>{row.receiveQuantity}</strong><br />
        </>
      )
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
        data={invRcvDetails}
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
