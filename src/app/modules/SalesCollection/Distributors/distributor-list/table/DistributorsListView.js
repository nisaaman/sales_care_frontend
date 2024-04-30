import axios from "axios";
import React, { useState } from "react";
import { Route, useHistory } from "react-router-dom"
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../../_metronic/_helpers";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import { useIntl } from "react-intl";
import ReactStars from "react-rating-stars-component";
import { ActionsColumnFormatter } from "./ActionsColumnFormatter";
import { StatusUpdateModal } from "../../../../Common/StatusUpdateModal"
import { showError, showSuccess } from "../../../../../pages/Alert"
import {
  sortCaret,
  headerSortingClasses,
} from "../../../../../../_metronic/_helpers";


const data = [
    {
        "id": 1,
        "code": "Lay's Seed Enterprize",
        "name": "Bhai Bhai Enterprise",
        "status": "active",
        "user": "Mmh Shohagh",
        "type":"silver",
        "collectionamount": "৳570,168,000",
      },
      {
        "id": 2,
        "code": "Lay's Seed Enterprize",
        "name": "Bhai Bhai Enterprise",
        "status": "active",
        "user": "Mmh Shohagh",
        "type":"gold",
        "collectionamount": "৳570,168,000",
      },
      {
        "id": 3,
        "code": "Lay's Seed Enterprize",
        "name": "Bhai Bhai Enterprise",
        "status": "inactive",
        "user": "Mmh Shohagh",
        "type":"platinum",
        "collectionamount": "৳570,168,000",
      },
  
]


export function DistributorsListView({setSingleAll, singleAll, distributorList, setDistributorList}) {
  let history = useHistory();
  const intl = useIntl();
  //const [setDistributorList] = useState([]);
  const [updateId, setUpdateId] = useState(null);
  const [updateStatusData, setUpdateStatusData] = useState(null);
  const [deleteId, setDeleteId] = useState(0);
  const openViewPage = (data) => {
    history.push('/salescollection/sales/sales-return-view', { state: data });
  }
//   const openEditPage = (data) => {
// console.log(data)
//  // history.push('/salescollection/distributors/add-new-distributor', { state: data });
//     }

    const openEditPage = (data) => {
      //console.log("data=",data);
      if (data.Active) {
        history.push('/salescollection/distributors/add-new-distributor', { state: data });
    } else {
      showError(data.distributorName+" currently deactive");
  }
}

  const openUpdateDialog = (data) => {
    
    setUpdateId(data.distributorId);
    setUpdateStatusData(data);
    history.push('/salescollection/distributors/distributors-list/update');
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

  const updateUser = () => {

    let obj = new Object();
    obj.id = updateStatusData.distributorId;

    if (updateStatusData.Active) {
        obj.isActive = false;
    } else {
        obj.isActive = true;
    }

    const URL = `${process.env.REACT_APP_API_URL}/api/distributor/status-update`;
    axios.put(URL, obj).then(response => {
        if (response.data.success == true) {
            showSuccess(response.data.message)
            const tempDistributorList = [...distributorList]
            const pIndex = tempDistributorList.findIndex(o => o.distributorId == obj.id);
            tempDistributorList[pIndex].Active = response.data.data.isActive;
            setDistributorList(tempDistributorList);
            setUpdateId(null);
            setUpdateStatusData(null)
        }
        else {
            showError(response.data.message);
        }
    }).catch(err => {
        showError(err);
    });

    history.push('/salescollection/distributors/distributors-list');
}

  const columns = [
    {
      dataField: "distributor",
      text: intl.formatMessage({id: "PAYMENT.COLLECTION.ORD_DISTRIBUTOR"}),
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      formatter: (cellContent, row) => (
        <>
          <>
          <div className="d-flex" style={{ marginBottom: "-10px" }}>
            <div>
              <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/car.svg")} width="50px" height="50px" />
            </div>
            {row.Active==true?<div className="circel-active" ></div>:""}
            <div className="ml-3">
              <span>
                <span style={{ fontWeight: "500" }}><strong>{row.distributorName}</strong></span>
                <p className="dark-gray-color"> 
                  <span className="text-muted">
                  <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/CreditLimit.svg")} width="15px" height="15px" />&nbsp;
                    Credit Limit</span>&nbsp;{row.creditLimit}
                </p>
              </span>
            </div>
          </div>
        </>
        </>
      )
    },
   
    {
      dataField: "rating",
      text: intl.formatMessage({id: "COMMON.RATING"}),
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      formatter: (cellContent, row) => (
        <>
        <span className="text-warning">{row.type}</span>
          <ReactStars  value={row.distributorType == "Silver"?3:row.distributorType=="Gold"?4:5} edit={false} readonly/>
        </>
      )
    },
    {
      dataField: "action",
      text: intl.formatMessage({id: "MENU.ACTIONS"}),
      formatter: ActionsColumnFormatter,
      formatExtraData: {
        openViewPage: openViewPage,
        openEditPage: openEditPage,
        openUpdateDialog: openUpdateDialog
      },
      classes: "text-center",
      headerClasses: "text-center",
      style: {
        minWidth: "300px",
      },
    },
  ];

  return (
    <>
     <Route path="/salescollection/distributors/distributors-list/update">
                        {({ history, match }) => (
                            <StatusUpdateModal
                                show={match != null}
                                id={updateId}
                                updateStatusData={updateStatusData}
                                updateAction={updateUser}
                                onHide={() => {
                                    history.push("/salescollection/distributors/distributors-list");
                                }}
                            />
                        )}
                    </Route>
      <BootstrapTable
        wrapperClasses="table-responsive"
        classes="table table-head-custom table-vertical-center overflow-hidden"
        bootstrap4
        bordered={false}
        keyField="distributorId"
        data={distributorList}
        columns={columns}
        sort={{ dataField: 'distributorId', order: 'asc' }}
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
