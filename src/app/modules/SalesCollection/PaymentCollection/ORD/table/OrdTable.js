import React from 'react';
import { useHistory } from "react-router-dom";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import { ActionsColumnFormatter } from "./ActionsColumnFormatter";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../../_metronic/_helpers";
import {useIntl} from "react-intl";
import { amountFormatterWithoutCurrency } from "../../../../Util";
import {
  sortCaret,
  headerSortingClasses,
} from "../../../../../../_metronic/_helpers";
// const data = [
//   {
//     "id": 1,
//     "code": "Lay's Seed Enterprize",
//     "name": "Bhai Bhai Enterprise",
//     "date": "10 APR 2022 10:23 AM",
//     "user": "Mmh Shohagh",
//     "designation": "Sales Officer, Cox’s Bazar",
//     "collectionamount": "৳570,168,000",
//     "status": "Pending",
//   },
// ]
export function OrdTable({ setSingleAll, singleAll, ordList }) {
  const intl = useIntl();
  let history = useHistory();
  
  const openViewPage = (data) => {
    history.push('#', { state: data });
  }

  const singleWiseSelectHandler = (data, isSelect) => {
    if (isSelect == true) {
      let temp = [...singleAll]
      temp.push(data)
      setSingleAll(temp)
    } else {
      if (singleAll.length >= 0) {
        let temp = [...singleAll]
        const index = temp.findIndex(obj => obj.distributor_id == data.distributor_id);
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
          const index = singleAll.findIndex(obj => obj.distributor_id == allData[i].distributor_id);
          singleAll.splice(index, 1);
          setSingleAll(singleAll)
        }
      }
    }

  }
 
  const columns = [
    
    {
      dataField: "distributor_id",
      text: intl.formatMessage({id:"COMMON.DISTRIBUTOR"}),
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      formatter: (cellContent, row) => (
        <>
          <div>
              <span>
                <span style={{ fontWeight: "500" }}><strong>{row.distributor_name}</strong></span>
                <p className="dark-gray-color">
                  &nbsp;<span className="text-muted">Balance</span>&nbsp;{amountFormatterWithoutCurrency(row.ledger_balance) ? amountFormatterWithoutCurrency(row.ledger_balance): 0.00}
                </p>
              </span>
            </div>
        </>
      )
    },
    {
      dataField: "ord_amount",
      text: intl.formatMessage({id:"PAYMENT.COLLECTION.ORD_AMOUNT"}),
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,    
      formatter: (cellContent, row) => (
        <>
          <strong>{amountFormatterWithoutCurrency(row.ord_amount)}</strong><br/>
          <span className="text-muted">{intl.formatMessage({id:"ORD.ORD_INVOICE"})}({row.total_invoice})</span>
        </>
      )
    },
    {
      dataField: "action",
      text: "Actions",
      formatter: ActionsColumnFormatter,
      formatExtraData: {
        openViewPage: openViewPage,
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
        data={ordList}
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

