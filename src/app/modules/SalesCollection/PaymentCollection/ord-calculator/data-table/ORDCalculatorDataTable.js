import React from "react";
import {useHistory} from "react-router-dom";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import {ActionsColumnFormatter} from "./ActionsColumnFormatter";
import SVG from "react-inlinesvg";
import {toAbsoluteUrl} from "../../../../../../_metronic/_helpers";

export function ORDCalculatorDataTable({setSingleAll, singleAll, ordList}) {
    let history = useHistory();

    const openViewPage = (data) => {
        history.push('/salescollection/payment-collection/ord-calculator-view', {state: data});
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
            dataField: "distributor",
            text: "DISTRIBUTOR",
            formatter: (cellContent, row) => (
                <>
                    <div className="d-flex  mr-5" style={{marginBottom: "-30px"}}>
                        <div>
                        </div>
                        <div className="ml-3">
                            <span>
                                <span style={{fontWeight: "500"}}><strong>{row.distributorName}</strong></span>
                                <p className="dark-gray-color">
                                    <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/CreditLimit.svg")}
                                         width="15px" height="55px"/>
                                    &nbsp;<span className="text-muted">Credit Limit</span>&nbsp;{row.openingBalance}
                                </p>
                            </span>
                        </div>
                    </div>

                </>
            )
        },
        {
            dataField: "receivable_amount",
            text: "RECEIVABLE AMOUNT",
            classes: "text-right",
            headerClasses: "text-right",
            formatter: (cellContent, row) => (
                <>
                    <strong>{Number(row.periodicBalance).toFixed(2)}</strong><br/>
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
                keyField="id"
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
                pagination={paginationFactory({sizePerPage: 10, showTotal: true})}
            />
        </>
    );
}
