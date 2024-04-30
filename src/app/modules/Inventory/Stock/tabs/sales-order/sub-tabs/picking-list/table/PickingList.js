
import React from "react";
import { useHistory } from "react-router-dom";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import { ActionsColumnFormatter } from "./ActionsColumnFormatter";
import {useIntl} from "react-intl";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../../../../../_metronic/_helpers";

export default function PickingList({setSingleAll, singleAll, data}) {
  const intl = useIntl();
  let history = useHistory();
  
  const openCreatePage = (data) => {
    history.push('/new-picking-list', { state: data });
  }
  const openViewPage = (data) => {
    history.push('/inventory/stock/sales-order/picking-list-view', { state: data });
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
      text:"DISTRIBUTOR",
      formatter: (cellContent, row) => (
        <>
         <div className="d-flex" style={{ marginBottom: "-10px" }}>
            <div className="ml-3">
              <span>
                <span style={{ fontWeight: "500" }}><strong>{row.distributor_name}</strong></span>
                <p className="dark-gray-color"> 
                  <span className="text-muted">
                  <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/CreditLimit.svg")} width="15px" height="15px" />&nbsp;
                  Balance</span>&nbsp;{Number(row.ledger_balance).toLocaleString('en-US', {minimumFractionDigits: 2})}
                </p>
              </span>
            </div>
          </div>
        </>
      )
    },
    {
      dataField: "sales_order",
      text: "Sales order",
      headerClasses:"text-center",
      classes:"text-center",
      formatter: (cellContent, row) => (
        <>
          <strong>{row.order_count}</strong>
        </>
      )
    },

    // {
    //   dataField: "collection_amount",
    //   text: "Picking listed sales order",
    //   headerClasses:"text-center",
    //   formatter: (cellContent, row) => (
    //     <>
    //       <span className="text-muted"><strong>3</strong></span>
    //       <span className="text-muted float-right"><strong>Picked All Order</strong></span>
    //       <div class="progress mt-3" style={{height:"5px"}}>
    //         <div class="progress-bar dark-success-color" role="progressbar" style={{width:"100%"}} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
    //       </div>
    //     </>
    //   )
    // },
    {
      dataField: "action",
      text: intl.formatMessage({id: "MENU.ACTIONS"}),
      formatter: ActionsColumnFormatter,
      formatExtraData: {
        openCreatePage: openCreatePage,
        openViewPage: openViewPage
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
        keyField="distributor_id"
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
