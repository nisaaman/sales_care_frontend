import React from "react";
import {useHistory} from "react-router-dom";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import {ActionsColumnFormatter} from "./ActionsColumnFormatter";
import {useIntl} from "react-intl";


export default function ProposalList({setSingleAll, singleAll, proposalList}) {
    const intl = useIntl();
    let history = useHistory();

    const openReceivePage = (data) => {
        history.push('/proposal-received', {state: data});
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
            dataField: "code",
            text: "RETURN PROPOSAL INFO",
            formatter: (cellContent, row) => (
                <>
                    <span className="text-muted">{row.proposal_no}</span><br/>
                    <strong>{row.distributor_name}</strong><br/>
                    <span className="text-muted">{row.proposal_date}</span>
                </>
            )
        },
        {
            dataField: "sales_officer",
            text: "BY",
            formatter: (cellContent, row) => (
                <>
                    <strong>{row.sales_officer_name}</strong><br/>
                    <span className="text-muted">{row.designation_name + ', ' + row.sales_officer_location}</span>
                </>
            )
        },
        {
            dataField: "challan_no",
            text: "DELIVERY CHALLAN",
            headerClasses: "text-right",
            classes: "text-right",
            formatter: (cellContent, row) => (
                <>
                    <strong>{row.challan_no}</strong><br/>
                    <span className="text-muted">{row.challan_date}</span>
                </>
            )
        },
        {
            dataField: "price",
            text: "AMOUNT",
            headerClasses: "text-right",
            formatter: (cellContent, row) => (
                <>
                    <strong className="float-right">{row.price.toLocaleString('en-US', {minimumFractionDigits: 2})}</strong><br/>
                    <span className="text-muted float-right">{row.invoice_nature}</span>
                </>
            )
        },
        {
            dataField: "action",
            text: intl.formatMessage({id: "MENU.ACTION"}),
            formatter: ActionsColumnFormatter,
            formatExtraData: {
                openReceivePage: openReceivePage,
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
                keyField="sales_return_proposal_id"
                data={proposalList}
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
