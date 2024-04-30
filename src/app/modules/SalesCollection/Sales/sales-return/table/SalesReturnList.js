import React from "react";
import {useHistory} from "react-router-dom";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import {useIntl} from "react-intl";
import {ActionsColumnFormatter} from "./ActionsColumnFormatter";
import {headerSortingClasses, sortCaret,} from "../../../../../../_metronic/_helpers";


export function SalesReturnList({setSingleAll, singleAll, salesReturnProposalList}) {
  let history = useHistory();
  const intl = useIntl();
  const openViewPage = (data) => {
    history.push('/salescollection/sales/sales-return-view', { state: data });
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
      text: intl.formatMessage({id: "SALES.RETURN.RETURN_INFO"}),
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      formatter: (cellContent, row) => (
        <>
          <span className="text-muted">{row.proposalNo}</span><br />
          <strong>{row.distributorName}</strong><br />
          <span className="text-muted">{row.forMattedProposalDate}</span><br />
          <span className="text-muted">{row.invoiceNo}</span>
        </>
      )
    },
    {
      dataField: "name",
      text: intl.formatMessage({id: "SALES.RETURN.RETURN_By"}),
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      formatter: (cellContent, row) => (
        <>
          <strong>{row.salesOfficer}</strong><br />
          <span className="text-muted">{row.designation}, {row.location_name}</span>
        </>
      )
    },
   
    {
      dataField: "returnamount",
      text: intl.formatMessage({id: "SALES.RETURN.RETURN_AMOUNT"}),
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      formatter: (cellContent, row) => (
        <>
          <strong>{Number(row.returnProposalAmount).toLocaleString('en-US', {minimumFractionDigits: 2})}</strong><br />
          <span className="text-muted">{row.approvalStatus}</span>
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
        keyField="id"
        data={salesReturnProposalList}
        columns={columns}
        sort={{ dataField: 'distributor_name', order: 'asc' }}
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
