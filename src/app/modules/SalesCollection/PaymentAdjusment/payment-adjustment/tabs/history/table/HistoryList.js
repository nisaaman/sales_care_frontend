
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import { useIntl } from "react-intl";
import axios from "axios";
import { shallowEqual, useSelector } from "react-redux";


export default function HistoryList({ setSingleAll, singleAll, data}) {
    const intl = useIntl();
    let history = useHistory();
    

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
            dataField: "duration",
            text: "PAYMENT RECEIVE INFO",
            formatter: (cellContent, row) => (
                <>
                    <span className="text-muted">{row.payment_no}</span><br />
                    <strong>{row.days_ago} Days Ago</strong><br />
                    <span className="text-muted">{row.payment_date}</span>
                </>
            )
        },
        {
            dataField: "distributor",
            text: "DISTRIBUTORS",
            formatter: (cellContent, row) => (
                <>
                    <strong>{row.distributor_name}</strong><br />
                    <span className="text-muted">Balance {row.ledger_balance.toFixed(2)}</span>
                </>
            )
        },
        {
            dataField: "user",
            text: "ENTRY BY",
            formatter: (cellContent, row) => (
                <>
                    <strong>{row.collected_by}</strong><br />
                    <span className="text-muted">{row.designation + ', '+ row.company_name}</span>
                </>
            )
        },
        {
            dataField: "collection_amount",
            text: "INVOICE PAYMENT AMOUNT",
            formatter: (cellContent, row) => (
                <>
                    <strong>{row.payment_amount.toFixed(2)}&nbsp;<span className="dark-success-color">(+{row.ord_amount.toFixed(2)})</span></strong><br />
                    <span className="text-muted">Invoice No. {row.invoice_no}</span>
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
