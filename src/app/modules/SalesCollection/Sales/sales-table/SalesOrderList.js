import { useHistory } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import { ActionsColumnFormatter } from "./ActionsColumnFormatter";
import { amountFormatterWithoutCurrency } from "../../../Util";


export function SalesOrderList({ salesOverView, setSingleAll, singleAll }) {

    const data = [
        {
            "id": 1,
            "distributorName": "Bhai Bhai Enterprise",
            "salesOrderNo": "X1253689",
            "orderDate": "10 APR 2022 10:23 AM",
            "salesOfficer": "Mmh Shohagh",
            "salesOfficerDetails": "Sales Officer, Cox’s Bazar",
            "subQty": "5000+",
            "qty": 14254200,
            "salesAmount": "৳ 570,168,000",
            "subSalesAmount": "-৳ 142,542,000",
            "action": "View"
        },
        {
            "id": 2,
            "distributorName": "Bhai Bhai Enterprise",
            "salesOrderNo": "X1253689",
            "orderDate": "10 APR 2022 10:23 AM",
            "salesOfficer": "Mmh Shohagh",
            "salesOfficerDetails": "Sales Officer, Cox’s Bazar",
            "subQty": "5000+",
            "qty": 14254200,
            "salesAmount": "৳ 570,168,000",
            "subSalesAmount": "-৳ 142,542,000",
            "action": "View"
        },
        {
            "id": 3,
            "distributorName": "Bhai Bhai Enterprise",
            "salesOrderNo": "X1253689",
            "orderDate": "10 APR 2022 10:23 AM",
            "salesOfficer": "Mmh Shohagh",
            "salesOfficerDetails": "Sales Officer, Cox’s Bazar",
            "subQty": "5000+",
            "qty": 14254200,
            "salesAmount": "৳ 570,168,000",
            "subSalesAmount": "-৳ 142,542,000",
            "action": "View"
        },
        {
            "id": 4,
            "distributorName": "Bhai Bhai Enterprise",
            "salesOrderNo": "X1253689",
            "orderDate": "10 APR 2022 10:23 AM",
            "salesOfficer": "Mmh Shohagh",
            "salesOfficerDetails": "Sales Officer, Cox’s Bazar",
            "subQty": "5000+",
            "qty": 14254200,
            "salesAmount": "৳ 570,168,000",
            "subSalesAmount": "-৳ 142,542,000",
            "action": "View"
        },
        {
            "id": 5,
            "distributorName": "Bhai Bhai Enterprise",
            "salesOrderNo": "X1253689",
            "orderDate": "10 APR 2022 10:23 AM",
            "salesOfficer": "Mmh Shohagh",
            "salesOfficerDetails": "Sales Officer, Cox’s Bazar",
            "subQty": "5000+",
            "qty": 14254200,
            "salesAmount": "৳ 570,168,000",
            "subSalesAmount": "-৳ 142,542,000",
            "action": "View"
        },
        {
            "id": 6,
            "distributorName": "Bhai Bhai Enterprise",
            "salesOrderNo": "X1253689",
            "orderDate": "10 APR 2022 10:23 AM",
            "salesOfficer": "Mmh Shohagh",
            "salesOfficerDetails": "Sales Officer, Cox’s Bazar",
            "subQty": "5000+",
            "qty": 14254200,
            "salesAmount": "৳ 570,168,000",
            "subSalesAmount": "-৳ 142,542,000",
            "action": "View"
        },
        {
            "id": 7,
            "distributorName": "Bhai Bhai Enterprise",
            "salesOrderNo": "X1253689",
            "orderDate": "10 APR 2022 10:23 AM",
            "salesOfficer": "Mmh Shohagh",
            "salesOfficerDetails": "Sales Officer, Cox’s Bazar",
            "subQty": "5000+",
            "qty": 14254200,
            "salesAmount": "৳ 570,168,000",
            "subSalesAmount": "-৳ 142,542,000",
            "action": "View"
        },
        {
            "id": 8,
            "distributorName": "Bhai Bhai Enterprise",
            "salesOrderNo": "X1253689",
            "orderDate": "10 APR 2022 10:23 AM",
            "salesOfficer": "Mmh Shohagh",
            "salesOfficerDetails": "Sales Officer, Cox’s Bazar",
            "subQty": "5000+",
            "qty": 14254200,
            "salesAmount": "৳ 570,168,000",
            "subSalesAmount": "-৳ 142,542,000",
            "action": "View"
        },
        {
            "id": 9,
            "distributorName": "Bhai Bhai Enterprise",
            "salesOrderNo": "X1253689",
            "orderDate": "10 APR 2022 10:23 AM",
            "salesOfficer": "Mmh Shohagh",
            "salesOfficerDetails": "Sales Officer, Cox’s Bazar",
            "subQty": "5000+",
            "qty": 14254200,
            "salesAmount": "৳ 570,168,000",
            "subSalesAmount": "-৳ 142,542,000",
            "action": "View"
        },
        {
            "id": 10,
            "distributorName": "Bhai Bhai Enterprise",
            "salesOrderNo": "X1253689",
            "orderDate": "10 APR 2022 10:23 AM",
            "salesOfficer": "Mmh Shohagh",
            "salesOfficerDetails": "Sales Officer, Cox’s Bazar",
            "subQty": "5000+",
            "qty": 14254200,
            "salesAmount": "৳ 570,168,000",
            "subSalesAmount": "-৳ 142,542,000",
            "action": "View"
        },
        {
            "id": 11,
            "distributorName": "Bhai Bhai Enterprise",
            "salesOrderNo": "X1253689",
            "orderDate": "10 APR 2022 10:23 AM",
            "salesOfficer": "Mmh Shohagh",
            "salesOfficerDetails": "Sales Officer, Cox’s Bazar",
            "subQty": "5000+",
            "qty": 14254200,
            "salesAmount": "৳ 570,168,000",
            "subSalesAmount": "-৳ 142,542,000",
            "action": "View"
        },
        {
            "id": 12,
            "distributorName": "Bhai Bhai Enterprise",
            "salesOrderNo": "X1253689",
            "orderDate": "10 APR 2022 10:23 AM",
            "salesOfficer": "Mmh Shohagh",
            "salesOfficerDetails": "Sales Officer, Cox’s Bazar",
            "subQty": "5000+",
            "qty": 14254200,
            "salesAmount": "৳ 570,168,000",
            "subSalesAmount": "-৳ 142,542,000",
            "action": "View"
        },
        {
            "id": 13,
            "distributorName": "Bhai Bhai Enterprise",
            "salesOrderNo": "X1253689",
            "orderDate": "10 APR 2022 10:23 AM",
            "salesOfficer": "Mmh Shohagh",
            "salesOfficerDetails": "Sales Officer, Cox’s Bazar",
            "subQty": "5000+",
            "qty": 14254200,
            "salesAmount": "৳ 570,168,000",
            "subSalesAmount": "-৳ 142,542,000",
            "action": "View"
        },
        {
            "id": 14,
            "distributorName": "Bhai Bhai Enterprise",
            "salesOrderNo": "X1253689",
            "orderDate": "10 APR 2022 10:23 AM",
            "salesOfficer": "Mmh Shohagh",
            "salesOfficerDetails": "Sales Officer, Cox’s Bazar",
            "subQty": "5000+",
            "qty": 14254200,
            "salesAmount": "৳ 570,168,000",
            "subSalesAmount": "-৳ 142,542,000",
            "action": "View"
        },
        {
            "id": 15,
            "distributorName": "Bhai Bhai Enterprise",
            "salesOrderNo": "X1253689",
            "orderDate": "10 APR 2022 10:23 AM",
            "salesOfficer": "Mmh Shohagh",
            "salesOfficerDetails": "Sales Officer, Cox’s Bazar",
            "subQty": "5000+",
            "qty": 14254200,
            "salesAmount": "৳ 570,168,000",
            "subSalesAmount": "-৳ 142,542,000",
            "action": "View"
        }
    ];

    let history = useHistory();

    const openViewPage = (data) => {
        
        history.push('/salescollection/sales/sales-order-view', { state: data });
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
            dataField: "salesOrderNo",
            text: "SALES ORDER INFO",
            formatter: (cellContent, row) => (
                <>
                    <span className="text-muted">{row.salesOrderNo}</span><br />
                    <strong>{row.distributorName}</strong><br />
                    <span className="text-muted">{row.salesOrderDate}</span>
                    
                </>
            )
        },
        {
            dataField: "salesOfficer",
            text: "BY",
            formatter: (cellContent, row) => (
                <>
                    <strong>{row.salesOfficer}</strong><br />
                    <span className="text-muted">{row.salesOfficerDetails}</span>
                </>
            )
        },
        {
            dataField: "quantity",
            text: "QTY",
            formatter: (cellContent, row) => (
                <>
                    <strong>{row.quantity}</strong><br />
                    <span className="text-muted">{row.freeQuantity}</span>
                </>
            )
        },
        {
            dataField: "orderAmount",
            text: "ORDER AMOUNT",
            formatter: (cellContent, row) => (
                <>
                    <strong>{ amountFormatterWithoutCurrency(row.orderAmount)}</strong><br />
                    <span className="text-muted">{amountFormatterWithoutCurrency(row.tradeDiscount)}</span>
                </>
            )
        },
        {
            dataField: "action",
            text: "Action",
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
                keyField="id"
                data={salesOverView}
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
