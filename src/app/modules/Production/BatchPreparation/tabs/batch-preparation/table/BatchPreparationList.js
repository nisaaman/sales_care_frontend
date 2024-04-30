
import React from "react";
import { useHistory } from "react-router-dom";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import { ActionsColumnFormatter } from "./ActionsColumnFormatter";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../../../_metronic/_helpers";
import { useIntl } from "react-intl";

export function BatchPreparationList({ setSingleAll, singleAll, productList}) {
  const intl = useIntl();
  let history = useHistory();
  {/**const openViewPage = (data) => {
    history.push('/production/batch-preparation/product-profile-view', { state: data });
  } */}
  const openBatchCreatePage = (data) => {
    history.push('/production/production-batch-preparation/production-batch-preparation-product-new', { state: data });
  }
  const openQRPage = (data) => {
    history.push('/production/production-batch-preparation/production-batch-preparation-product-qr', { state: data });
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
      text: "PRODUCTS INFO",
      formatter: (cellContent, row) => (
        <>
            <span className="text-muted">{row.productSku}</span><br />
            <strong>{row.productName}</strong><br />
            <span className="text-muted">{row.productCategory }</span>
        </>
      )
    },
    {/*{
      dataField: "sales_officer",
      text: "Current Stock (In PCs)",
      formatter: (cellContent, row) => (
        <>
        {
          row.balance == 0 ?
          <>
           <strong className="text-muted">{row.balance}&nbsp;<span className="text-danger">(Out Of Stock)</span></strong><br />
          <div class="progress mt-3" style={{ height: "5px" }}>
            <div class="progress-bar bg-danger" role="progressbar" style={{ width: "70px" }} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
          </div>
          </>:
          row.balance == 50 ?
          <>
           <strong className="text-muted">{row.balance}&nbsp;<span className="text-warning">(Out Of Stock)</span></strong><br />
          <div class="progress mt-3" style={{ height: "5px" }}>
            <div class="progress-bar bg-warning" role="progressbar" style={{ width: "70px" }} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
          </div>
          </>:
          <>
          <strong className="text-muted">{row.balance}&nbsp;</strong><br />
          <div class="progress mt-3" style={{ height: "5px" }}>
            <div class="progress-bar dark-success-bg" role="progressbar" style={{ width: "70px" }} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
          </div>
         </>
        }
          

        </>
      )
    },*/
    },
    {/*
  {
      dataField: "sales_officer",
      text: "W.A. Rate",
      formatter: (cellContent, row) => (
        <>
          <strong>{row.balance}</strong><br />
        </>
      )
    },*/},
    {
      dataField: "action",
      text: intl.formatMessage({ id: "MENU.ACTIONS" }),
      formatter: ActionsColumnFormatter,
      formatExtraData: {
        //openViewPage: openViewPage,
        openCreditPage: openBatchCreatePage,
        openQRPage: openQRPage
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
        data={productList}
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
