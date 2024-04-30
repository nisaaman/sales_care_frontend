
import React from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import { useIntl } from "react-intl";
import {
  sortCaret,
  headerSortingClasses,
} from "../../../../../../_metronic/_helpers";

const data = [
  {
    "id": 1,
    "effective_date": "12/06/2022",
    "expired_date": "12/06/2022",
    "amount": "142",
  },
  {
    "id": 2,
    "effective_date": "12/06/2022",
    "expired_date": "12/06/2022",
    "amount": "142",
  },
  {
    "id": 3,
    "effective_date": "12/06/2022",
    "expired_date": "12/06/2022",
    "amount": "142",
  },
]


export function TradePriceList() {
  const intl = useIntl();
  const columns = [
    {
      dataField: "effective_date",
      text: "Effective Date",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      formatter: (cellContent, row) => (
        <>
          <span>{row.effective_date}</span>
        </>
      )
    },
    {
      dataField: "expired_date",
      text: "Expired Date",
      sort: true,
      classes: "text-center",
      headerClasses: "text-center",
      sortCaret: sortCaret,
      headerSortingClasses,
      formatter: (cellContent, row) => (
        <>
          <span>{row.expired_date}</span>
        </>
      )
    },
    {
      dataField: "amount",
      text: "Amount",
      sort: true,
      classes: "text-right",
      headerClasses: "text-right",
      sortCaret: sortCaret,
      headerSortingClasses,
      formatter: (cellContent, row) => (
        <>
          <strong>{row.amount}</strong>
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
        keyField="id"
        data={data}
        columns={columns}
        sort={{ dataField: 'effective_date', order: 'asc' }}
        pagination={paginationFactory({ sizePerPage: 10, showTotal: true })}
      />
    </>
  );
}
