
import React from "react";
import { useHistory } from "react-router-dom";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import { ActionsColumnFormatter } from "./ActionsColumnFormatter";
import {useIntl} from "react-intl";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../../../../../_metronic/_helpers";
// const data = [
//   {
//     "id": 1,
//     "code": "12535689",
//     "duration": "12 Days Left",
//     "date": "10 APR 2022",
//     "dateTime": "10 APR 2022 10:23 AM",
//     "distributor":"Bhai Bhai Enterprize",
//     "balance": "570,168,000",
//     "user": "Mmh Shohagh",
//     "designation": "Sales Officer, Cox’s Bazar",
//     "collectionamount": "570,168,000",
//     "collectionType": "Cheque",
//     "status": "PENDING",
//     "invoiceNo": "Cash",
//     "orderList" :[
//       {
//           "id": 1,
//           "orderNo": 1,
//           "bookingNo": 1,
//           "orderStatus": "NOT_DELIVERY",
//           "productList": [
//             {
//               "id": 1,
//               "pSku":"SKU X1253689",
//               "pName":"Seaconazole 5SC 50 ml * 40",
//               "pCategory":"Fungicide/",
//               "orderQty":456,
//               "cartQty":0,
//               "stockQty":"500",
//               "freeQty":50
              
//             },
//             {
//               "id": 2,
//               "pSku":"SKU X1253689",
//               "pName":"Seaconazole 5SC 50 ml * 40",
//               "pCategory":"Fungicide/",
//               "orderQty":556,
//               "cartQty":0,
//               "stockQty":"600",
//               "freeQty":60
              
//             },
//             {
//               "id": 3,
//               "pSku":"SKU X1253689",
//               "pName":"Seaconazole 5SC 50 ml * 40",
//               "pCategory":"Fungicide/",
//               "orderQty":656,
//               "cartQty":0,
//               "stockQty":"700",
//               "freeQty":70
              
//             }
//         ]
//       },
//       {
//         "id": 2,
//         "orderNo": 2,
//         "bookingNo": 2,
//         "orderStatus": "NOT_DELIVERY",
//         "productList": [
//           {
//             "id": 1,
//             "pSku":"SKU X1253689",
//             "pName":"Seaconazole 5SC 50 ml * 40",
//             "pCategory":"Fungicide/",
//             "orderQty":456,
//             "cartQty":0,
//             "stockQty":"500",
//             "freeQty":50
            
//           },
//           {
//             "id": 2,
//             "pSku":"SKU X1253689",
//             "pName":"Seaconazole 5SC 50 ml * 40",
//             "pCategory":"Fungicide/",
//             "orderQty":556,
//             "cartQty":0,
//             "stockQty":"600",
//             "freeQty":60
            
//           },
//           {
//             "id": 3,
//             "pSku":"SKU X1253689",
//             "pName":"Seaconazole 5SC 50 ml * 40",
//             "pCategory":"Fungicide/",
//             "orderQty":656,
//             "cartQty":0,
//             "stockQty":"700",
//             "freeQty":70
            
//           }
//       ]
//     },
//     {
//       "id": 3,
//       "orderNo": 3,
//       "bookingNo": 3,
//       "orderStatus": "NOT_DELIVERY",
//       "productList": [
//         {
//           "id": 1,
//           "pSku":"SKU X1253689",
//           "pName":"Seaconazole 5SC 50 ml * 40",
//           "pCategory":"Fungicide/",
//           "orderQty":456,
//           "cartQty":0,
//           "stockQty":"500",
//           "freeQty":50
          
//         },
//         {
//           "id": 2,
//           "pSku":"SKU X1253689",
//           "pName":"Seaconazole 5SC 50 ml * 40",
//           "pCategory":"Fungicide/",
//           "orderQty":556,
//           "cartQty":0,
//           "stockQty":"600",
//           "freeQty":60
          
//         },
//         {
//           "id": 3,
//           "pSku":"SKU X1253689",
//           "pName":"Seaconazole 5SC 50 ml * 40",
//           "pCategory":"Fungicide/",
//           "orderQty":656,
//           "cartQty":0,
//           "stockQty":"700",
//           "freeQty":70
          
//         }
//     ]
//   }
//     ]
//   },
 
// ]
export default function DeliveryChallanList({setSingleAll, singleAll,data }) {
  const intl = useIntl();
  let history = useHistory();

  const openCreatePage = (data) => {
    history.push('/add-delivery-challan', { state: data });
  }
  const openViewPage = (data) => {
    history.push('/inventory/stock/sales-order/view-delivery-challan', { state: data });
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
      dataField: "code",
      text:"DISTRIBUTOR",
      formatter: (cellContent, row) => (
        <>
         <div className="d-flex" style={{ marginBottom: "-10px" }}>
            <div>
              <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/group-logo.svg")} width="50px" height="50px" />
            </div>
            <div className="ml-3">
              <span>
                <span style={{ fontWeight: "500" }}><strong>{row.distributor_name}</strong></span>
                <p className="dark-gray-color"> 
                  <span className="text-muted">
                  <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/CreditLimit.svg")} width="15px" height="15px" />&nbsp;
                  Balance</span>&nbsp;{row.ledger_balance.toLocaleString('en-US', {minimumFractionDigits: 2})}
                </p>
              </span>
            </div>
          </div>
        </>
      )
    },
    {
      dataField: "sales_officer",
      text: "SALES ORDER",
      headerClasses:"text-center",
      classes:"text-center",
      formatter: (cellContent, row) => (
        <>
          <strong>{row.order_count}</strong>
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
        data={data}
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
