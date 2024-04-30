
import React from "react";
import { useHistory } from "react-router-dom";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import { ActionsColumnFormatter } from "./ActionsColumnFormatter";
import {useIntl} from "react-intl";
import { format, parse, isValid, parseISO } from 'date-fns';
import { amountFormatterWithoutCurrency } from '../../../../Util';
const data = [
  {
    "id": 1,
    "code": "12535689",
    "name": "Bhai Bhai Enterprise",
    "date": "10 APR 2022 10:23 AM",
    "user": "Mmh Shohagh",
    "designation": "Sales Officer, Cox’s Bazar",
    "collectionamount": "৳570,168,000",
    "status": "Pending",
  },
]
export function CollectionDataTable({setSingleAll, singleAll, paymentCollectionList}) {
  const intl = useIntl();
  let history = useHistory();
  
  const openViewPage = (data) => {
    history.push('/salescollection/payment-collection/collection-data-view', { state: data });
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
      dataField: "id",
      text:intl.formatMessage({id: "COLLECTIONDATA.PAYMENT_INFO"}),
      formatter: (cellContent, row) => (
        <>
          <span className="text-muted">{row.paymentNo}</span><br />
          <strong>{row.distributor.distributorName}</strong><br />
          <span className="text-muted">{format(parseISO(row.paymentDate), 'dd-MMM-yyyy')}</span>
          
        </>
      )
    },
    {
      dataField: "sales_officer",
      text: intl.formatMessage({id: "COLLECTIONDATA.PAYMENT_INFO"}),
      formatter: (cellContent, row) => (
        <>
          <strong>{row.collectionBy.name}</strong><br />
          <span className="text-muted">{row.collectionBy.designation.name}</span>
        </>
      )
    },
    {
      dataField: "collection_amount",
      text: intl.formatMessage({id: "COLLECTIONDATA.ORDER_AMOUNT"}),
      formatter: (cellContent, row) => (
        <>
          <strong>{amountFormatterWithoutCurrency(row.collectionAmount)}</strong><br />
        
          <span className="text-muted" style={{marginLeft:"30px"}}>{row.approvalStatus}</span>
        </>
      )
    },
    {
      dataField: "action",
      text: intl.formatMessage({id: "COLLECTIONDATA.ACTION"}),
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
        data={paymentCollectionList}
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
