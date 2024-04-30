import React, { useState, useEffect, useMemo } from "react";
import InventoryBreadCrum from "../../../../bread-crum/InventoryBreadCrum";
import InventoryStockHeader from "../../../header/InventoryStockHeader";
import {
  Card,
  CardBody,
} from "../../../../../../../_metronic/_partials/controls";
import { toAbsoluteUrl } from "../../../../../../../_metronic/_helpers";
import SVG from "react-inlinesvg";
import StoreMovementList from "./table/StoreMovementList";
import { useHistory } from "react-router-dom";
import { shallowEqual, useSelector } from "react-redux";
import axios from "axios";
import * as XLSX from "xlsx";
import { showError } from "../../../../../../pages/Alert";
import moment from "moment";
import { dateFormatPattern } from "../../../../../Util";
import { hasCreateAccess } from "../../../../../Util";

export default function StoreMovement() {
  let [singleAll, setSingleAll] = useState([]);
  const history = useHistory();
  const permissions = useSelector((state) => state.auth.user.permissions, shallowEqual);
  const companyId = useSelector((state) => state.auth.company, shallowEqual);
  const userLoginId = useSelector(
    (state) => state.auth.user.userId,
    shallowEqual
  );
  const [accountingYearId, setAccountingYearId] = useState("");
  const [depotId, setDepotId] = useState();

  const searchParams = useMemo(() => {
    return {
      userLoginId: userLoginId,
      companyId: companyId,
      accountingYearId: accountingYearId,
    };
  }, [userLoginId, companyId, accountingYearId]);

  const [allAccountingYear, setAllAccountingYear] = useState([]);
  const [invRcvDetails, setInvRcvDetails] = useState([]);
  const [interStoreMovementDetails, setInterStoreMovementDetails] = useState(
    []
  );

  const [depotName, setDepotName] = useState("");

  useEffect(() => {
    document
      .getElementById("pills-inventory-stock-store-movement-tab")
      .classList.add("active");
    //getCurrentAccountingYear(companyId)
    getAllAccountingYear(companyId);
    getDepotInfo(companyId, userLoginId);
  }, [companyId]);

  useEffect(() => {
    getInterStoreStockMovementDetails(searchParams);
  }, [searchParams]);

  const getCurrentAccountingYear = (companyId) => {
    const URL = `${process.env.REACT_APP_API_URL}/api/accounting-year/current/${companyId}`;
    axios
      .get(URL)
      .then((response) => {
        setAccountingYearId(response.data.data);
      })
      .catch();
  };

  const getAllAccountingYear = (companyId) => {
    const URL = `${process.env.REACT_APP_API_URL}/api/accounting-year/companyWise/${companyId}`;
    if (companyId) {
      axios
        .get(URL)
        .then((response) => {
          setAllAccountingYear(response.data.data);
        })
        .catch((err) => {});
    }
  };
  const changeAccYear = (event) => {
    setAccountingYearId(event.target.value);
  };
  const handleExport = () => {
    const data = [...singleAll];
    if (data.length === 0) {
      showError("No row is selected for export data");
      return;
    }

    let exportData = [];
    data.map((row) => {
      let obj = {};
      obj.movementRefNo = row.movementRefNo;
      obj.status = row.status;
      obj.movement_status = row.fromStore + " to " + row.toStore;
      obj.movementDate = moment(row.movementDate).format(dateFormatPattern());
      obj.movementBy = row.movementBy;
      obj.designation = row.designation;
      obj.quantity = row.quantity;

      exportData.push(obj);
      //setSingleAll([]);
    });
    const workbook = XLSX.utils.book_new();
    const Heading = [
      [
        "MOVEMENT REFERENCE NO",
        "STATUS",
        "MOVEMENT STATUS",
        "MOVEMENT DATE",
        "MOVEMENT BY",
        "DESIGNATION",
        "QUANTITY",
      ],
    ];
    const worksheet = XLSX.utils.json_to_sheet(exportData, {
      origin: "A2",
      skipHeader: true,
    });

    XLSX.utils.sheet_add_aoa(worksheet, Heading, { origin: "A1" });
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "StoreMovementData.xlsx");
  };
  const handleNewStoreMovement = () => {
    history.push("/new-store-movement", {
      companyId: companyId,
      userLoginId: userLoginId,
      depotId: depotId,
    });
  };

  const getDepotInfo = (companyId, userLoginId) => {
    const URL = `${process.env.REACT_APP_API_URL}/api/depot/user-depot/${companyId}/${userLoginId}`;
    axios
      .get(URL)
      .then((response) => {
        setDepotName(response.data.data.depot_name);
        setDepotId(response.data.data.id);
        // setSearchParams({...searchParams, depotId: response.data.data.id});
      })
      .catch((err) => {});
  };

  const getInterStoreStockMovementDetails = (params) => {
    let queryString = "?";
    queryString += "&companyId=" + params.companyId;
    queryString += "&userLoginId=" + params.userLoginId;
    queryString += params.accountingYearId
      ? "&accountingYearId=" + params.accountingYearId
      : "";

    const URL =
      `${process.env.REACT_APP_API_URL}/api/inter-store-stock-movement/details/data` +
      queryString;
    axios
      .get(URL)
      .then((response) => {
        setInterStoreMovementDetails(response.data.data);
      })
      .catch();
  };
  const handleKeyPressChange = (e) => {
    if (e.keyCode === 32) {
      getInterStoreStockMovementDetails(searchParams);
    } else if (e.keyCode === 8) {
      getInterStoreStockMovementDetails(searchParams);
    }
  };
  const handleSearchChange = (event) => {
    let value = event.target.value;
    getSearchList(value);
  };
  const getSearchList = (searchText) => {
    let searchTextValue = searchText.toLowerCase();
    let tp = [];
    for (let i = 0; i < interStoreMovementDetails.length; i++) {
      let movementRefNo = interStoreMovementDetails[
        i
      ].movementRefNo.toLowerCase();
      let movementBy = interStoreMovementDetails[i].movementBy.toLowerCase();
      if (
        movementRefNo.includes(searchTextValue) ||
        movementBy.includes(searchTextValue)
      ) {
        tp.push(interStoreMovementDetails[i]);
      }
    }
    setInterStoreMovementDetails(tp);
  };
  return (
    <>
      {/* BREAD CRUM ROW */}
      <div>
        <InventoryBreadCrum />
      </div>

      {/* HEADER ROW */}
      <div>
        <InventoryStockHeader showStockData={true} />
      </div>

      {/* MAIN CARD ROW */}
      <div className="mb-n5">
        <Card>
          <CardBody>
            <span className="text-muted mt-3 display-inline-block">
              Inter Store Stock Movement will only change the physical location
              of the Products.
            </span>
            {hasCreateAccess(permissions, "STORE_MOVEMENT") && (
              <span>
                <button
                  onClick={() => handleNewStoreMovement()}
                  className="float-right btn light-blue-bg dark-blue-color rounded"
                >
                  <SVG
                    className="mr-2"
                    src={toAbsoluteUrl(
                      "/media/svg/icons/project-svg/storemove-blue.svg"
                    )}
                  />
                  Inter Store Stock Movement
                </button>
              </span>
            )}
          </CardBody>
        </Card>
      </div>
      <div>
        <Card>
          <CardBody>
            {/* SEARCH AND FILTER ROW */}
            <div className="row">
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
                    onKeyUp={(e) => handleKeyPressChange(e)}
                  />
                </form>
              </div>

              {/* SELECTED ROW */}
              <div className="col-xl-8 text-right">
                {/* TIMELINE DROPDOWN */}
                <span className="mr-3 display-inline-block">
                  <div className="row">
                    <div className="col-3 mt-3">
                      <label className="dark-gray-color">Timeline</label>
                    </div>
                    <div className="col-9">
                      <select
                        className="border-0 form-control"
                        onChange={(event) => changeAccYear(event)}
                      >
                        <option value="" className="fs-1">
                          Select Fiscal Year
                        </option>
                        {allAccountingYear.map((accYear) => (
                          <option
                            key={accYear.id}
                            value={accYear.id}
                            className="fs-1"
                          >
                            {accYear.fiscalYearName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </span>
              </div>

              {/* FILTER BUTTON ROW */}
              <div className="col-xl-1">
                <button className="btn filter-btn">
                  <i className="bi bi-funnel" style={{ fontSize: "11px" }}></i>
                  &nbsp;Filter
                </button>
              </div>
            </div>

            {/* ALL SUMMARY ROW */}
            <div className="row">
              {/* NO. OF BOOKING ROW */}
              <div className="col-xl-4 sales-data-chip">
                <div className="d-flex">
                  <div className="dark-gray-color">
                    <SVG
                      src={toAbsoluteUrl(
                        "/media/svg/icons/project-svg/location.svg"
                      )}
                      width="30px"
                      height="30px"
                    />
                  </div>
                  <div className="ml-2">
                    <span>
                      <span
                        className="dark-gray-color"
                        style={{ fontWeight: "500" }}
                      >
                        Depot
                      </span>
                      <p>
                        <strong>{depotName}</strong>
                      </p>
                    </span>
                  </div>
                </div>
              </div>

              {/* NO. OF BOOKING ROW */}
              <div className="col-xl-4 sales-data-chip">
                <div className="d-flex">
                  <div className="dark-gray-color">
                    {/* <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/history.svg")} width="25px" height="25px" /> */}
                  </div>
                  <div className="ml-2">
                    {/* <span>
                                            <span className="dark-gray-color"
                                                style={{ fontWeight: "500" }}>No. Of Movement Request</span>
                                            <p><strong>{invRcvDetails?.length}</strong></p>
                                        </span> */}
                  </div>
                </div>
              </div>

              {/* EXPORT ROW */}
              <div
                className="col-xl-4 sales-data-chip"
                style={{ background: "#F9F9F9" }}
              >
                <button
                  className="btn float-right export-btn"
                  onClick={handleExport}
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

            {/* TABLE ROW */}
            <div className="mt-5">
              <StoreMovementList
                setSingleAll={setSingleAll}
                singleAll={singleAll}
                interStoreMovementDetails={interStoreMovementDetails}
              />
            </div>
          </CardBody>
        </Card>
      </div>
    </>
  );
}
