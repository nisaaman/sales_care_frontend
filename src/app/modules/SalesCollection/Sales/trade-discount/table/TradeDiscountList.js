
import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import { ActionsColumnFormatter } from "./ActionsColumnFormatter";
import { Route } from "react-router-dom";
import { TradeDiscountDelete } from "../delete-modal/TradeDiscountDelete"
import { sortCaret, headerSortingClasses,} from "../../../../../../_metronic/_helpers";
import {useIntl} from "react-intl";
import { amountFormatterWithoutCurrency, dateFormatPattern} from "../../../../Util";
import moment from "moment";


export function TradeDiscountList({ setSingleAll, singleAll, tradeDiscountList }) {
    const intl = useIntl();
    const [deleteId, setDeleteId] = useState(0);
    let history = useHistory();

    const openViewPage = (data) => {

        history.push('/salescollection/sales/sales-order', { state: data });
    }

    // const openEditPage = (data) => {

    //     history.push('/salescollection/sales/sales-order', { state: data });
    // }

    // const actionEventUI = {
    //      openDeleteDialog : (id) => {
    //         setDeleteId(id)
    //         history.push('/salescollection/sales/trade-discount/delete');
    //     }
    //   }

    const singleWiseSelectHandler = (data, isSelect) => {
        if (isSelect == true) {
          let temp = [...singleAll]
          temp.push(data)
          setSingleAll(temp)
        } else {
          if (singleAll.length >= 0) {
            let temp = [...singleAll]
            const index = temp.findIndex(obj => obj.tradeDiscountId == data.tradeDiscountId);
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
              const index = singleAll.findIndex(obj => obj.tradeDiscountId == allData[i].tradeDiscountId);
              singleAll.splice(index, 1);
              setSingleAll(singleAll)
            }
          }
        }
      }
    const columns = [
        {
            dataField: "name",
            text: intl.formatMessage({id: "TRADEDISCOUNT.PRODUCTS_INFO"}),
            sortCaret: sortCaret,
            headerSortingClasses,
            formatter: (cellContent, row) => (
                <>
                    <span className="text-muted">{row.productSku}</span><br />
                    <strong>{row.p_name}</strong><br />
                    <span className="text-muted">{row.productCategory}</span>
                </>
            )
        },
        {
            dataField: "tradePrice",
            text: intl.formatMessage({id: "TRADEDISCOUNT.TRADE_PRICE"}),
            sortCaret: sortCaret,
            headerSortingClasses,
            formatter: (cellContent, row) => (
                <>
                    <strong>{row.tradePrice.toFixed(2)}</strong><br />
                    <span className="text-muted">{moment(row.date, "DD/MM/YYYY").format(dateFormatPattern())}</span>
                </>
            )
        },
        {
            dataField: "discountCashType",
            text: intl.formatMessage({id: "TRADEDISCOUNT.DISCOUNT_CASH"}),
            sortCaret: sortCaret,
            headerSortingClasses,
            formatter: (cellContent, row) => (
                <>
                    <strong>{row.cashAmount}</strong><br />
                    <span className="text-muted">{row.cashValue} {row.cashType}</span>
                </>
            )
        },
        {
            dataField: "discountCreditType",
            text: intl.formatMessage({id: "TRADEDISCOUNT.DISCOUNT_CREDIT"}),
            sortCaret: sortCaret,
            headerSortingClasses,
            formatter: (cellContent, row) => (
                <>
                    <strong>{row.creditAmount}</strong><br />
                    <span className="text-muted">{row.creditValue} {row.creditType}</span>
                </>
            )
        },
        {
          dataField: "semesterName",
          text: intl.formatMessage({id: "COMMON.SEMESTER"}),
          sortCaret: sortCaret,
          headerSortingClasses,
          formatter: (cellContent, row) => (
              <>
                  <strong>{row.semesterName}</strong><br />
                  <span className="text-muted">{row.fiscalYearName}</span>
              </>
          )
      }

        //,
        // {
        //     dataField: "action",
        //     text:intl.formatMessage({id: "COMMON.ACTION"}),
        //     formatter: ActionsColumnFormatter,
        //     formatExtraData: {
        //         openViewPage: openViewPage,
        //         // openEditPage: openEditPage,
        //         // openDeleteDialog: actionEventUI.openDeleteDialog,
        //     },
        //     classes: "text-center",
        //     headerClasses: "text-center",
        //     style: {
        //         minWidth: "100px",
        //     },
        // }
    ];
    return (
        <>
            <Route path="/salescollection/sales/trade-discount/delete">
                {({ history, match }) => (
                    <TradeDiscountDelete
                        show={match != null}
                        id={deleteId}
                        onHide={() => {
                            history.push("/salescollection/sales/trade-discount");
                        }}
                    />
                )}
            </Route>

            <BootstrapTable
                sort={{ dataField: 'name', order: 'asc' }}
                wrapperClasses="table-responsive"
                classes="table table-head-custom table-vertical-center overflow-hidden"
                bootstrap4
                bordered={false}
                keyField="tradeDiscountId"
                data={tradeDiscountList}
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
