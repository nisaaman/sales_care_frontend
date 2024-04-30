import React from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";


export function TradePriceList(props) {
    const columns = [
        {
            dataField: "effective_date",
            text: "Effective Date",
            formatter: (cellContent, row) => (<span>{row.effective_date}</span>)
        },
        {
            dataField: "expired_date",
            text: "Expired Date",
            classes: "text-center",
            headerClasses: "text-center",
            formatter: (cellContent, row) => (<span>{row.expired_date}</span>)
        },
        {
            dataField: "amount",
            text: "Price",
            classes: "text-right",
            headerClasses: "text-right",
            formatter: (cellContent, row) => (<strong>{Number(row.amount).toFixed(2)}</strong>)
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
                data={props.tradePriceList}
                columns={columns}
                pagination={paginationFactory({sizePerPage: 10, showTotal: true})}
            />
        </>
    );
}
