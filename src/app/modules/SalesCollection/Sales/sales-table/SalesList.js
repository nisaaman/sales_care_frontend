import React, { useEffect, useMemo } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import {useIntl} from "react-intl";

export function SalesList({setSingleAll, singleAll,salesDataList}) {
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
      dataField: "products",
      text: intl.formatMessage({id: "SALES_DATA.PRODUCTS"}),
      formatter: (cellContent, row) => (
        <>
        <span className="text-muted">{row.productSku}</span><br />
        <strong>{row.productName}</strong><br />
        <span className="text-muted">{row.productCategory}</span>
        </>
    )
    },
    {
      dataField: "qty",
      text: "QTY",
      text: intl.formatMessage({id: "SALES_DATA.QTY"}),
      formatter: (cellContent, row) => (
        <>
        <strong>{row.quantity}</strong><br />
        <span className="text-muted">{row.freeQuantity}</span>
        </>
    )
    },
    {
      dataField: "saleamount",
      text: intl.formatMessage({id: "SALES_DATA.SALE_AMOUNT"}),
      formatter: (cellContent, row) => (
        <>
        <strong>{row.sale_amount}</strong><br />
        <span className="text-muted">{row.tradeDiscount}</span>
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
        data={salesDataList}
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
        pagination={paginationFactory({ sizePerPage: 10, showTotal:true })}
      />
    </>
  );
}
