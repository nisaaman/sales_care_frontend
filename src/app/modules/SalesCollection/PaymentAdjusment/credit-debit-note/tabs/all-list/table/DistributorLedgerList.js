import React from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import { amountFormatterWithoutCurrency } from "../../../../../../Util";


export default function DistributorLedgerList({setSingleAll, singleAll, noteList}) {
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
        } else {
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
            dataField: "proposal_date",
            text: "DATE",
            formatter: (cellContent, row) => (
                <>
                    <span><strong>{row.date}</strong></span><br/>
                    <span className="text-muted">{row.proposal_date}</span>
                </>
            )
        },
        {
            dataField: "note_no",
            text: "NOTE NO.",
            formatter: (cellContent, row) => (
                <>
                    <span className="dark-gray-color"><strong>{row.note_no}</strong></span>
                </>
            )
        },
        {
            dataField: "reason",
            text: "REASON",
            style: {
                width: "300px"
            },
            formatter: (cellContent, row) => (
                <>
                    <span className="dark-gray-color">{row.reason}</span>
                </>
            )
        },
        {
            dataField: "debit",
            text: "DEBIT",
            headerAlign: 'right',
            classes: "text-right",
            formatter: (cellContent, row) => (
                <>
                    <span className="text-danger"><strong>{amountFormatterWithoutCurrency(row.debit)}</strong></span>
                </>
            )
        },
        {
            dataField: "credit",
            text: "CREDIT",
            headerAlign: 'right',
            classes: "text-right",
            formatter: (cellContent, row) => (
                <>
                    <span className="text-danger"><strong>{amountFormatterWithoutCurrency(row.credit)}</strong></span>
                </>
            )
        },
        {
            dataField: "balance",
            text: "BALANCE",
            headerAlign: 'right',
            classes: "text-right",
            formatter: (cellContent, row) => (
                <>
                    <strong>{amountFormatterWithoutCurrency(row.balance)}</strong><br/>
                </>
            )
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
                data={noteList}
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
