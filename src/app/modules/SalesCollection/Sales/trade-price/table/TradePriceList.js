import {useHistory, Route} from "react-router-dom";
import React, {useState} from 'react';
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import {ActionsColumnFormatter} from "./ActionsColumnFormatter";
import {useIntl} from "react-intl";
import { CommonDeleteModal } from "../../../../Common/CommonDeleteModal";

export function TradePriceList({setSingleAll, singleAll, tradePriceList, deleteSingleRow}) {
    let history = useHistory();
    const intl = useIntl();
    const [deleteId, setDeleteId] = useState(0);

    const openViewPage = (data) => {
        history.push('/salescollection/sales/sales-order', { state: data });
    }
    const openDeleteDialog = (data) => {
        setDeleteId(data)
        history.push('/salescollection/sales/trade-price/delete', { state: data });
    }
    const openEditPage = (data) => {
        history.push('/salescollection/sales/sales-order', { state: data });
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
            dataField: "productInfo",
            text: intl.formatMessage({id: "TRADEPRICE.PRODUCTS_INFO"}),
            formatter: (cellContent, row) => (
                <>
                    <span className="text-muted">{row.productSku}</span><br />
                    <strong>{row.productName}&nbsp;{row.itemSize}&nbsp;{row.uomAbbreviation}&nbsp;*&nbsp;{row.packSize}</strong><br />
                    <span className="text-muted">{row.productCategoryName}</span>

                </>
            )
        },
        {
            dataField: "mp",
            text: intl.formatMessage({id: "TRADEPRICE.MFG_PRICE"}),
            formatter: (cellContent, row) => (
                <>
                    {row.mfgRate ?
                        <>
                            <strong>{row.mfgRate?row.mfgRate:0}</strong><br />
                            <span className="text-muted">{row.mfgDate}</span>
                        </>
                        :
                        <strong>N/A</strong>
                    }

                </>
            )
        },
        {
            dataField: "tp",
            text: intl.formatMessage({id: "TRADEPRICE.TRADE_PRICE"}),
            formatter: (cellContent, row) => (
                <>
                    <strong>{row.tradePrice}</strong><br />
                    <span className="text-muted">{row.productTradePriceCreatedDate}</span>
                </>
            )
        },
        {
            dataField: "vat",
            text: intl.formatMessage({id: "TRADEPRICE.VAT"}),
            formatter: (cellContent, row) => (
                <>
                    {row.vat ?
                        <>
                            <strong>{row.vat}%({row.vatIncluded ? 'Incl.' : 'Excl.'})</strong><br/>
                            <span className="text-muted">{row.vatFromDate}</span>
                        </>
                        :
                        <strong>N/A</strong>
                    }
                </>
            )
        },
        {
            dataField: "action",
            text: intl.formatMessage({id: "COMMON.ACTION"}),
            formatter: ActionsColumnFormatter,
            formatExtraData: {
                openViewPage: openViewPage,
                openEditPage: openEditPage,
                openDeleteDialog: openDeleteDialog,
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
            <Route path="/salescollection/sales/trade-price/delete">
                {({ history, match }) => (
                    <CommonDeleteModal
                    show={match != null}
                    id={deleteId}
                    deleteAction={deleteSingleRow}
                        onHide={() => {
                            history.push("/salescollection/sales/trade-price");
                        }}
                    />
                )}
            </Route>
            <BootstrapTable
                wrapperClasses="table-responsive"
                classes="table table-head-custom table-vertical-center overflow-hidden"
                bootstrap4
                bordered={false}
                keyField="id"
                data={tradePriceList}
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
