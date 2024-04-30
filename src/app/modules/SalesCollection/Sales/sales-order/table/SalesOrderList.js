import { useHistory } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import { ActionsColumnFormatter } from "./ActionsColumnFormatter";
import { amountFormatterWithoutCurrency, dateFormatPattern } from "../../../../Util";
import {
    sortCaret,
    headerSortingClasses,
} from "../../../../../../_metronic/_helpers";
import {useIntl} from "react-intl";
import moment from "moment";

export function SalesOrderList({ salesOverView, setSingleAll, singleAll }) {
    const intl = useIntl();
    
    let history = useHistory();

    const openViewPage = (data) => {
        
        history.push('/salescollection/sales/sales-order-view', { state: data });
    }

    const singleWiseSelectHandler = (data, isSelect) => {
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
            dataField: "salesOrderId",
            text: "ORDER INFO",
            sort: true,
            sortCaret: sortCaret,
            headerSortingClasses,
            formatter: (cellContent, row) => (
                <>
                    <span className="text-muted">{row.salesOrderNo}</span><br />
                    <strong>{row.distributorName}</strong><br />
                    <span className="text-muted">{moment(row.salesOrderDate).format(dateFormatPattern())}</span>
                    
                </>
            )
        },
        {
            dataField: "salesOfficer",
            text: intl.formatMessage({id: "SALESORDER.BY"}),
            sort: true,
            sortCaret: sortCaret,
            headerSortingClasses,
            formatter: (cellContent, row) => (
                <>
                    <strong>{row.salesOfficer}</strong><br />
                    <span className="text-muted">{row.salesOfficerDetails}</span>
                </>
            )
        },
        {
            dataField: "quantity",
            text: intl.formatMessage({id: "SALESORDER.QTY"}),
            sort: true,
            sortCaret: sortCaret,
            headerSortingClasses,
            formatter: (cellContent, row) => (
                <>
                    <strong>{row.quantity}</strong><br />
                    {/* <span className="text-muted">{row.freeQuantity}</span> */}
                </>
            )
        },
        {
            dataField: "orderAmount",
            text: intl.formatMessage({id: "SALESORDER.ORDER_AMOUNT"}),
            sort: true,
            sortCaret: sortCaret,
            headerSortingClasses,
            formatter: (cellContent, row) => (
                <>
                    <strong>{ amountFormatterWithoutCurrency(row.orderAmount)}</strong><br />
                    {/* <span className="text-muted">{amountFormatterWithoutCurrency(row.tradeDiscount)}</span> */}
                </>
            )
        },
        {
            dataField: "approvalStatus",
            text: "STATUS",
            sortCaret: sortCaret,
            headerSortingClasses,
            formatter: (cellContent, row) => (
                <>
                    <strong>{row.approvalStatus}</strong><br />
                </>
            )
        },
        
        {
            dataField: "action",
            text: intl.formatMessage({id: "COMMON.ACTION"}),
            formatter: ActionsColumnFormatter,
            formatExtraData: {
                openViewPage: openViewPage,
            },
            classes: "text-center",
            headerClasses: "text-center",
            style: {
                minWidth: "100px",
            },
        }
    ];

    return (
        <>
            <BootstrapTable
                wrapperClasses="table-responsive"
                classes="table table-head-custom table-vertical-center overflow-hidden"
                bootstrap4
                bordered={false}
                keyField="salesOrderId"
                data={salesOverView}
                columns={columns}
                sort={{ dataField: 'salesOrderId', order: 'desc' }}
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
