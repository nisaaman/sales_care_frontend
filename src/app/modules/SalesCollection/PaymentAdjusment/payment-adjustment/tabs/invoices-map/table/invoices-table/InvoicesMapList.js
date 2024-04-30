
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import { ActionsColumnFormatter } from "./ActionsColumnFormatter";
import { useIntl } from "react-intl";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../../../../../_metronic/_helpers";
import { amountFormatterWithoutCurrency } from "../../../../../../../Util";
import { shallowEqual, useSelector } from 'react-redux';
import { hasCreateAccess } from "../../../../../../../Util";

export default function InvoicesMapList({ setSingleAll, singleAll, data}) {
    const intl = useIntl();
    let history = useHistory();
    const permissions = useSelector((state) => state.auth.user.permissions, shallowEqual);

    const openAdjustPage = (data) => {
        history.push('/salescollection/payment-adjustment/payment-adjustment/invoices-adjust-view', { data: data });
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
            dataField: "distributor",
            text: intl.formatMessage({ id: "PAYMENT.COLLECTION.ORD_DISTRIBUTOR" }),
            formatter: (cellContent, row) => (
                <>
                    <div className="d-flex" style={{ marginBottom: "-10px" }}>
                        {/* <div className="mt-2">
                            <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/Lays.svg")} width="30px" height="30px" />
                        </div> */}
                        <div className="mt-2">
                            <span>
                                <span style={{ fontWeight: "500" }}><strong>{row.distributor_name}</strong></span>
                                <p className="dark-gray-color">
                                    <span className="text-muted">
                                        <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/CreditLimit.svg")} width="15px" height="15px" />&nbsp;
                                        Balance</span>&nbsp;{amountFormatterWithoutCurrency(row.ledger_balance)}
                                </p>
                            </span>
                        </div>
                    </div>
                </>
            )
        },
        {
            dataField: "balance",
            text: intl.formatMessage({ id: "COMMON.INVOICES_CAPITAL" }),
            formatter: (cellContent, row) => (
                <>
                    <strong>{amountFormatterWithoutCurrency(row.invoice_amount)}</strong><br />
                    <span className="text-muted">Overdue({amountFormatterWithoutCurrency(row.overdu_count)})</span>
                </>
            )
        },
        {
            dataField: "nature",
            text: "PAYMENTS",
            formatter: (cellContent, row) => (
                <>
                    <strong>{amountFormatterWithoutCurrency(row.collection_amount)}</strong><br />
                    <span className="text-muted">Advance({row.advance_count})</span>
                </>
            )
        },
        {
            dataField: "collection_amount",
            text: "ADJUSTABLE AMOUNT",
            formatter: (cellContent, row) => (
                <>                    
                    <strong className="text-muted">{amountFormatterWithoutCurrency(row.adjustable_amount)}</strong><br />
                    <div className="progress mt-2" style={{height:"5px"}}>
                        <div className="progress-bar bg-primary" role="progressbar" 
                        style={{width: (row.adjustable_amount/row.collection_amount)*100 + "%"}} 
                        aria-valuenow={(row.adjustable_amount/row.collection_amount)*100} aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                </>
            )
        },
        hasCreateAccess(permissions, "PAYMENT_ADJUSTMENT") ?
        {
            dataField: "action",
            text: intl.formatMessage({ id: "MENU.ACTION" }),
            formatter: ActionsColumnFormatter,
            formatExtraData: {
                openAdjustPage: openAdjustPage,
            },
            classes: "text-center",
            headerClasses: "text-center",
            style: {
                minWidth: "100px",
            },
        } : "",
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
