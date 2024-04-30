
import React from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";

export default function QAReviewList({ setSingleAll, singleAll, qaInspectionData}) {
 // alert(qaInspectionData)
  const singleWiseSelectHandler = (data, isSelect) => {
    console.log("data",qaInspectionData);
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
      dataField: "productsInfo",
      text: "PRODUCTS INFO",
      formatter: (cellContent, row) => (
        <>
            <span className="text-muted">{row.productSku}</span><br />
            <strong>{row.productName}</strong><br />
            <span className="text-muted">{row.productCategory}</span>
        </>
      )
    },
    {
      dataField: "batchInfo",
      text: "BATCH INFO",
      formatter: (cellContent, row) => (
        <>
            <span className="text-muted">{row.batchNo}</span><br />
        </>
      )
    },
    {
      dataField: "name",
      text: "QA BY",
      formatter: (cellContent, row) => (
        <>
            <strong>{row.salesOfficer}</strong><br />
            <span className="text-muted">{row.designation}</span>
        </>
      )
    },
    {
      dataField: "qty",
      text: "QTY.",
      formatter: (cellContent, row) => (
        <>
            <strong>{row.quantity}</strong><br />
        </>
      )
    },
    {
      dataField: "status",
      text: "STATUS",
      formatter: (cellContent, row) => (
        <>
            <strong className="dark-success-color">{row.qaStatus}</strong><br />
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
        keyField="id"
        data={qaInspectionData}
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
