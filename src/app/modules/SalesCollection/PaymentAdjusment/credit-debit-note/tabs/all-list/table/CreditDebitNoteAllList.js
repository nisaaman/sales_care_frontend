import React from "react";
import {useHistory} from "react-router-dom";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import {ActionsColumnFormatter} from "./ActionsColumnFormatter";
import SVG from "react-inlinesvg";
import {toAbsoluteUrl} from "../../../../../../../../_metronic/_helpers";
import {useIntl} from "react-intl";

export function CreditDebitNoteAllList({setSingleAll, singleAll, distributorList, commonInfo}) {
    const intl = useIntl();
    let history = useHistory();

    const openViewPage = (data) => {
        history.push('/salescollection/payment-adjustment/credit-debit-note/view', {state: data});
    }
    const openCreditPage = (data) => {
        history.push('/salescollection/payment-adjustment/credit-debit-note/credit-add-page', {state: data});
    }
    const openDebitPage = (data) => {
        history.push('/salescollection/payment-adjustment/credit-debit-note/debit-add-page', {state: data});
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
            dataField: "distributor_name",
            text: "DISTRIBUTOR",
            formatter: (cellContent, row) => (
                <>
                    <div className="d-flex" >
                        <div className="ml-3">
              <span>
                <span style={{fontWeight: "500"}}><strong>{row.distributor_name}</strong></span>
              </span>
                        </div>
                    </div>
                </>
            )
        },
        {
            dataField: "ledger_balance",
            text: "BALANCE",
            formatter: (cellContent, row) => (
                <>
                    <strong>{row.ledger_balance.toLocaleString('en-US', {minimumFractionDigits: 2})}</strong><br/>
                </>
            )
        },
        {
            dataField: "action",
            text: intl.formatMessage({id: "MENU.ACTIONS"}),
            formatter: ActionsColumnFormatter,
            formatExtraData: {openViewPage: openViewPage, openCreditPage: openCreditPage, openDebitPage: openDebitPage},
            classes: "text-center",
            headerClasses: "text-center",
            style: {
                minWidth: "25rem",
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
                keyField="sl"
                data={distributorList}
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
