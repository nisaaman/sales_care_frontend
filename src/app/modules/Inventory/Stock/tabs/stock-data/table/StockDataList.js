
import React from "react";
import { useHistory } from "react-router-dom";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import { ActionsColumnFormatter } from "./ActionsColumnFormatter";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../../../_metronic/_helpers";
import { useIntl } from "react-intl";
import { shallowEqual, useSelector } from 'react-redux';
import { hasCreateAccess } from '../../../../../Util';

export default function StockDataList({ setSingleAll, singleAll, depotStockDetails }) {
  const intl = useIntl();
  let history = useHistory();
  const openViewPage = (data) => {
    history.push('/inventory/stock/stock-view', { state: data, status:true });
  }
  const permissions = useSelector((state) => state.auth.user.permissions, shallowEqual);

  const singleWiseSelectHandler = (data, isSelect) => {
    if (isSelect == true) {
      let temp = [...singleAll]
      temp.push(data)
      setSingleAll(temp)
      
    } else {
      if (singleAll.length >= 0) {
        let temp = [...singleAll]
        const index = temp.findIndex(obj => obj.productId === data.productId);
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
      dataField: "productSku",
      text: "PRODUCTS INFO",
      sort: true,
      formatter: (cellContent, row) => (
        <>
            <span className="text-muted">{row.productSku}</span><br />
            <strong>{row.productName}</strong><br />
            <span className="text-muted">{row.productCategory}</span>
        </>
      )
    },
    {
      dataField: "allStock",
      text: "QTY",
      headerClasses:"text-center",
      classes:"text-center",
      formatter: (cellContent, row) => (
        <>
          <span className="light-success-bg mr-5 p-2 rounded dark-success-color"><strong>{row.regularStock}</strong></span>
          <span className="light-blue-bg mr-5 p-2 rounded dark-blue-color"><strong>{row.inTransitStock}</strong></span>
          <span className="light-warning-bg mr-5 p-2 rounded dark-warning-color"><strong>{row.quarantineStock}</strong></span>
          <span className="light-danger-bg mr-5 p-2 rounded dark-danger-color"><strong>{row.restrictedStock}</strong></span>
        </>
      )
    },
    hasCreateAccess(permissions, "STOCK_DATA") ?
    { 
      dataField: "weightedAverageRate",
      text: "W.A. Rate",
      formatter: (cellContent, row) => (
        <>
          <strong>{row.weightedAverageRate ? (row.weightedAverageRate).toFixed(2) : ''}</strong><br />
        </>
      )
    } : "",
    // {
    //   dataField: "action",
    //   text: intl.formatMessage({ id: "MENU.ACTION" }),
    //   formatter: ActionsColumnFormatter,
    //   formatExtraData: {
    //     openViewPage: openViewPage,
    //   },
    //   classes: "text-center",
    //   headerClasses: "text-center",
    //   style: {
    //     minWidth: "100px",
    //   },
    // },
  ];

  return (
    <>
      <BootstrapTable
        wrapperClasses="table-responsive"
        classes="table table-head-custom table-vertical-center overflow-hidden"
        bootstrap4
        bordered={false}
        keyField="productId"
        data={depotStockDetails}
        columns={columns}
        sort={{ dataField: 'productSku', order: 'asc' }}
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
