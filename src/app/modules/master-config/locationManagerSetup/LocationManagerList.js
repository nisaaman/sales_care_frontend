import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import { Route, useHistory } from "react-router-dom";
import {
  CardBody,
  CardHeaderToolbar,
} from "../../../../_metronic/_partials/controls";
import { CommonDeleteModal } from "../../Common/CommonDeleteModal";
import { ActionsColumnFormatter } from "../ActionsColumnFormatter";
import MasterConfigBreadCrum from "../MasterConfigBreadCrum";
import * as XLSX from "xlsx";
import { showError, showSuccess } from "../../../pages/Alert";
import { toAbsoluteUrl } from "../../../../_metronic/_helpers";
import SVG from "react-inlinesvg";
import axios from "axios";
import moment from "moment";
import { useSelector, shallowEqual } from "react-redux";

export default function LocationManagerList() {
  let history = useHistory();
  const companyId = useSelector((state) => state.auth.company, shallowEqual);
  const userLoginId = useSelector(
    (state) => state.auth.user.userId,
    shallowEqual
  );
  const [locationManagerList, setLocationManagerList] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [managerListSearch, setManagerListSearch] = useState([]);

  useEffect(() => {
    getAllLocationManager();
  }, [companyId]);

  const openViewPage = (data) => {
    //console.log(data);
    // history.push('/master-config/location-manager-setup-new', { state: data });
  };

  const createNewLocationManager = () => {
    history.push("/master-config/location-manager-setup-new");
  };

  const openEditPage = (data) => {
    history.push({
      pathname: "/master-config/location-manager-setup-new",
      state: { data },
    });
  };

  const openDeleteDialog = (data) => {
    //setDeleteId(data.id)
    //history.push('/master-config/location-manager-setup/delete');
  };

  const getAllLocationManager = () => {
    if (companyId) {
      const URL = `${process.env.REACT_APP_API_URL}/api/location-manager-map/get-all-by-company-id/${companyId}`;
      axios
        .get(URL)
        .then((response) => {
          if (response.data.success === true) {
            console.log(response.data.data)
            setLocationManagerList(response.data.data);
            setManagerListSearch(response.data.data);
          } else {
            showError(response.data.message);
          }
        })
        .catch((err) => {
          showError(err);
        });
    }
  };

  const deleteLocationManager = () => {
    const URL = `${process.env.REACT_APP_API_URL}/api/location-manager-map/${deleteId}`;
    axios
      .delete(URL)
      .then((response) => {
        if (response.data.success === true) {
          showSuccess(response.data.message);
          const tempLocationManagerList = [...locationManagerList];
          const pIndex = tempLocationManagerList.findIndex(
            (obj) => obj.id === deleteId
          );
          tempLocationManagerList.splice(pIndex, 1);
          setLocationManagerList(tempLocationManagerList);
          setDeleteId(null);
        } else {
          showError(response.data.message);
        }
      })
      .catch((err) => {
        showError(err);
      });

    history.push("/master-config/location-manager-setup");
  };

  const singleRowSelectHandler = (data, isSelect) => {
    if (isSelect === true) {
      let temp = [...selectedRows];
      temp.push(data);
      setSelectedRows(temp);
    } else {
      if (selectedRows.length >= 0) {
        let temp = [...selectedRows];
        const index = temp.findIndex((obj) => obj.id === data.id);
        temp.splice(index, 1);
        setSelectedRows(temp);
      }
    }
  };

  const allRowSelectHandler = (allData, isSelect) => {
    if (isSelect === true) {
      setSelectedRows(allData);
    } else {
      setSelectedRows([]);
    }
  };

  const exportData = (e) => {
    handleExport();
  };

  const handleExport = () => {
    const data = [...selectedRows];
    if (data.length === 0) {
      showError("No row is selected for export data");
      return;
    }
    let exportData = [];
    data.map((row) => {
      let obj = {};
      obj.company = row.company.name;
      obj.locationType = row.location.locationType.name;
      obj.location = row.location.name;
      obj.applicationUser = row.applicationUser.name;
      obj.fromDate = moment(row.fromDate, "YYYY-MM-DD").format("DD-MMM-YYYY");
      exportData.push(obj);
      //setSelectedRows([]);
    });
    const workbook = XLSX.utils.book_new();
    const Heading = [
      [
        "COMPANY NAME",
        "LOCATION TYPE",
        "LOCATION",
        "LOCATION MANAGER",
        "REPORTING FROM (DATE)",
      ],
    ];
    const worksheet = XLSX.utils.json_to_sheet(exportData, {
      origin: "A2",
      skipHeader: true,
    });

    // creating sheet and adding data from 2nd row of column A.
    // Leaving first row to add Heading
    XLSX.utils.sheet_add_aoa(worksheet, Heading, { origin: "A1" });

    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "Location Manager List.xlsx");
  };

  const handleSearchChange = (event) => {
    let value = event.target.value;
    getSearchList(value);
  };

  const getSearchList = (searchText) => {
    let searchTextValue = searchText.toLowerCase();
    let tp = [];
    for (let i = 0; i < managerListSearch.length; i++) {
      let field1 = managerListSearch[i].location.locationType.name.toLowerCase();
      let field2 = managerListSearch[i].location.name.toLowerCase();

      if (
        field1.includes(searchTextValue) ||
        field2.includes(searchTextValue)
      ) {
        tp.push(managerListSearch[i]);
      }
    }
    setLocationManagerList(tp);
  };

  const columns = [
    {
      dataField: "company",
      text: "Company Name",
      formatter: (cellContent, row) => {
        return row.company.name;
      },
    },
    {
      dataField: "locationType",
      text: "Location Type",
      formatter: (cellContent, row) => {
        return row.location.locationType.name;
      },
    },
    {
      dataField: "location",
      text: "Location",
      formatter: (cellContent, row) => {
        return row.location.name;
      },
    },
    {
      dataField: "locationManager",
      text: "Location Manager",
      formatter: (cellContent, row) => {
        return row.applicationUser.name + ", " + row.applicationUser.email;
      },
    },
    {
      dataField: "fromDate",
      text: "Reporting From (Date)",
      formatter: (cellContent, row) => {
        return moment(row.fromDate, "YYYY-MM-DD").format("DD-MMM-YYYY");
      },
    },
    {
      dataField: "action",
      text: "Actions",
      formatter: ActionsColumnFormatter,
      formatExtraData: {
        openViewPage: openViewPage,
        openEditPage: openEditPage,
        openDeleteDialog: openDeleteDialog,
      },
      classes: "text-center",
      headerClasses: "text-center",
      style: {
        minWidth: "8.5rem",
      },
    },
  ];

  return (
    <>
      {/* BREAD CRUM ROW */}
      <MasterConfigBreadCrum menuTitle="Location Manager" />

      <Card>
        <CardBody>
          <div className="row">
            <div className="col-lg-12">
              <div className="row">
                <div className="col-xl-4">
                  <span className="create-field-title">
                    Location Manager List
                  </span>
                  {/* <p style={{ color: "#B6B6B6" }}>Total {productProfileList.length} products </p> */}
                </div>
                <div className="col-xl-8 d-flex justify-content-end">
                  {/* SEARCH BOX ROW */}
                  <div className="col-xl-3">
                    <div
                      style={{
                        position: "absolute",
                        padding: "7px",
                        marginTop: "3px",
                      }}
                    >
                      <img
                        src={toAbsoluteUrl("/images/search.png")}
                        width="20px"
                        height="20px"
                      />
                    </div>
                    <form className="form form-label-right">
                      <input
                        type="text"
                        className="form-control"
                        name="searchText"
                        placeholder="Search Here"
                        style={{ paddingLeft: "28px" }}
                        onChange={handleSearchChange}
                      />
                    </form>
                  </div>

                  <div className="mr-5">
                    <CardHeaderToolbar title="Create New Location Manager">
                      <button
                        /* tree={categoryTypeTree} */
                        type="button"
                        className="btn btn-primary"
                        onClick={createNewLocationManager}
                      >
                        + New Location Manager
                      </button>
                    </CardHeaderToolbar>
                  </div>
                  <div style={{ marginRight: "20px", background: "#F9F9F9" }}>
                    <button
                      title="Download excel data"
                      className="btn float-right export-btn"
                      onClick={exportData}
                    >
                      <SVG
                        src={toAbsoluteUrl(
                          "/media/svg/icons/project-svg/download.svg"
                        )}
                        width="15px"
                        height="15px"
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Route path="/master-config/location-manager-setup/delete">
            {({ history, match }) => (
              <CommonDeleteModal
                show={match != null}
                id={deleteId}
                deleteAction={deleteLocationManager}
                onHide={() => {
                  history.push("/master-config/location-manager-setup");
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
            data={locationManagerList}
            columns={columns}
            selectRow={{
              mode: "checkbox",
              onSelect: (row, isSelect, rowIndex, e) => {
                singleRowSelectHandler(row, isSelect);
              },
              onSelectAll: (isSelect, rows, e) => {
                allRowSelectHandler(rows, isSelect);
              },
            }}
            pagination={paginationFactory({ sizePerPage: 10, showTotal: true })}
          />
        </CardBody>
      </Card>
    </>
  );
}
