import React from "react";
import {useHistory} from "react-router-dom";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import {ActionsColumnFormatter} from "./ActionsColumnFormatter";
import {useIntl} from "react-intl";
import SVG from "react-inlinesvg";
import {toAbsoluteUrl} from "../../../../../../../../../_metronic/_helpers";
import moment from "moment";

export default function InvoiceList({setSingleAll, singleAll, distributorList}) {
    const intl = useIntl();
    let history = useHistory();

    const openCreatePage = (data) => {
        history.push('/inventory/stock/sales-order/invoice-create', {state: data});
    }

    const openViewPage = (data) => {
        data.distributorId = data.distributor_id;
        let asOnDateStr = moment(new Date()).format('YYYY-MM-DD');
        data.distributorName = data.distributor_name;
        data.contactNo = data.contact_no;
        data.ledgerBalance = data.ledger_balance;
        history.push('/inventory/stock/sales-order/invoice-view', {
            state: data,
            asOnDateStr: asOnDateStr,
            status: true
        });
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
            dataField: "distributor_id",
            text: "DISTRIBUTOR",
            formatter: (cellContent, row) => (
                <>
                    <div className="d-flex" style={{marginBottom: "-10px"}}>
                        <div className="ml-3">
              <span>
                <span style={{fontWeight: "500"}}><strong>{row.distributor_name}</strong></span>
                <p className="dark-gray-color"> 
                  <span className="text-muted">
                  <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/CreditLimit.svg")} width="15px"
                       height="15px"/>&nbsp;
                      Balance</span>&nbsp;{Number(row.ledger_balance).toLocaleString('en-US', {minimumFractionDigits: 2})}
                </p>
              </span>
                        </div>
                    </div>
                </>
            )
        },
        {
            dataField: "code",
            text: "TOTAL CHALLAN",
            classes: "text-center",
            headerClasses: "text-center",
            formatter: (cellContent, row) => (
                <>
                    <div className="ml-3">
              <span>
                <span style={{fontWeight: "500"}}><strong>{row.number_of_challan}</strong></span>
              </span>
                    </div>
                </>
            )
        },
        {
            dataField: "action",
            text: intl.formatMessage({id: "MENU.ACTIONS"}),
            formatter: ActionsColumnFormatter,
            formatExtraData: {
                openCreatePage: openCreatePage,
                openViewPage: openViewPage
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
                keyField="distributor_id"
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
