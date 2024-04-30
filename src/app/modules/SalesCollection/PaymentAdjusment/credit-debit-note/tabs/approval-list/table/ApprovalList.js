import React from "react";
import {useHistory} from "react-router-dom";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import {ActionsColumnFormatter} from "./ActionsColumnFormatter";
import {useIntl} from "react-intl";

export function ApprovalList({setSingleAll, singleAll, approvalNoteList}) {
    const intl = useIntl();
    let history = useHistory();

    const openViewPage = (data) => {
        history.push('/salescollection/payment-adjustment/credit-debit-note/approval-view', {state: data});
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
        } else {
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
            dataField: "note_no",
            text: "CREDIT/DEBIT INFO",
            formatter: (cellContent, row) => (
                <>
                    <span className="text-muted">{row.note_no + ' '}</span>
                    <span
                        className={row.approval_status == "APPROVED" ? "dark-success-color" : row.approval_status == "REJECTED" ? "text-danger" : "dark-gray-color"}><strong>({row.approval_status})</strong></span>
                    <br/>
                    <strong>{row.day_diff + ' Days ago'}</strong><br/>
                    <span className="text-muted">{row.approval_date}</span>
                </>
            )
        },
        {
            dataField: "distributor_name",
            text: "DISTRIBUTORS",
            formatter: (cellContent, row) => (
                <>
                    <strong>{row.distributor_name}</strong><br/>
                    <span className="text-muted">Balance&nbsp;{Number(row.ledger_balance).toFixed(2)}</span>
                </>
            )
        },
        {
            dataField: "entry_by",
            text: "ENTRY BY",
            formatter: (cellContent, row) => (
                <>
                    <strong>{row.entry_by}</strong><br/>
                    <span className="text-muted">{row.entry_by_designation + ', ' + row.company_name}</span>
                </>
            )
        },
        {
            dataField: "collection_amount",
            text: "AMOUNT",
            classes: "text-right",
            formatter: (cellContent, row) => (
                <>
                    <strong
                        className={row.note_type == "CREDIT" ? "dark-success-color" : "text-danger"}>{row.note_type == "DEBIT" ? '-' : ''}{row.amount.toFixed(2)}</strong><br/>
                    <span className="text-muted" style={{marginLeft: "30px"}}>{row.note_type}</span>
                </>
            )
        },
        {
            dataField: "action",
            text: intl.formatMessage({id: "MENU.ACTION"}),
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
                keyField="credit_debit_note_id"
                data={approvalNoteList}
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
                pagination={paginationFactory({sizePerPage: 10, showTotal: true})}
            />
        </>
    );
}
