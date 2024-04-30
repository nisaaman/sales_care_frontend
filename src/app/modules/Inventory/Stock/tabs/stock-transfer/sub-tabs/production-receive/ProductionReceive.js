import React, { useState, useEffect, useMemo } from "react";
import InventoryBreadCrum from '../../../../../bread-crum/InventoryBreadCrum';
import InventoryStockHeader from "../../../../header/InventoryStockHeader";
import StockTransferSubTabs from "../../sub-tabs-header/StockTransferSubTabs";
import { Card, CardBody } from "../../../../../../../../_metronic/_partials/controls";
import { toAbsoluteUrl } from "../../../../../../../../_metronic/_helpers";
import SVG from "react-inlinesvg";
import ProductionReceiveList from "./table/ProductionReceiveList";
import ProductionReceiveListAll from "./table/ProductionReceiveListAll";

import { useHistory } from "react-router-dom";
import { shallowEqual, useSelector } from "react-redux";
import { showError, showSuccess } from '../../../../../../../pages/Alert';
import axios from "axios";
import * as XLSX from 'xlsx';
import { hasAcess, hasCreateAccess } from '../../../../../../Util';

export default function ProductionReceive() {
    let [singleAll, setSingleAll] = useState([]);
    const history = useHistory();
    const permissions = useSelector((state) => state.auth.user.permissions, shallowEqual);
    const companyId = useSelector((state) => state.auth.company, shallowEqual);
    const userLoginId = useSelector((state) => state.auth.user.userId, shallowEqual);
    const [accountingYearId, setAccountingYearId] = useState('');

    const searchParams = useMemo(() => {
        return { userLoginId: userLoginId, companyId: companyId, accountingYearId: accountingYearId }
    }, [userLoginId, companyId, accountingYearId]);

    const [allAccountingYear, setAllAccountingYear] = useState([]);
    const [invRcvDetails, setInvRcvDetails] = useState([]);
    const [invRcvDetailsSearch, setInvRcvDetailsSearch] = useState([]);
    const [mcCostData, setMcCostData] = useState([]);

    useEffect(() => {
        document.getElementById('pills-inventory-stock-stock-transfer-tab').classList.add('active');
        document.getElementById('pills-inventory-stock-stock-transfer-production-receive-tab').classList.add('active');
        getAllAccountingYear(companyId)
    }, [companyId]);

    useEffect(() => {
        getInvProductionReceiveDetails(searchParams);
    }, [searchParams]);

    const getAllAccountingYear = (companyId) => {
        const URL = `${process.env.REACT_APP_API_URL}/api/accounting-year/companyWise/${companyId}`;
        if (companyId) {
            axios.get(URL).then(response => {
                setAllAccountingYear(response.data.data);
                setAccountingYearId('');
            }).catch(err => {

            });
        }
    }

    const changeAccYear = event => {

        setAccountingYearId(event.target.value)
    }

    const getInvProductionReceiveDetails = (params) => {
        let queryString = "?";
        queryString += "&companyId=" + params.companyId;
        queryString += params.accountingYearId ? "&accountingYearId=" + params.accountingYearId : '';

        const URL = `${process.env.REACT_APP_API_URL}/api/inv-receive/details/data` + queryString;
        axios.get(URL).then((response) => {
            console.log("invRcvDetails", response.data.data);

            setInvRcvDetails(response.data.data);
            setInvRcvDetailsSearch(response.data.data);
        }).catch();
    }

    const handleExport = () => {
        const data = [...singleAll];
        if (data.length === 0) {
            showError("No row is selected for export data");
            return;
        }

        let exportData = [];
        data.map(row => {
            let obj = {};
            obj.batchNo = row.batchNo;
            obj.batchQuantity = row.batchQuantity;
            obj.productSku = row.productSku;
            obj.productName = row.productName;
            obj.productCategory = row.productCategory;
            obj.receiveStore = row.receiveStore;
            obj.receiveQuantity = row.receiveQuantity;
            obj.manFacCost = row.manFacCost;

            exportData.push(obj);
        })
        const workbook = XLSX.utils.book_new();
        const Heading = [
            ["BATCH NO", "BATCH QUANTITY", "PRODUCT SKU", "PRODUCT NAME", "PRODUCT CATEGORY", "RECEIVE STORE", "RECEIVE QUANTITY", "MANUFACTURING COST"]
        ];
        const worksheet = XLSX.utils.json_to_sheet(exportData, { origin: 'A2', skipHeader: true });

        XLSX.utils.sheet_add_aoa(worksheet, Heading, { origin: 'A1' });
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, "ProductionReceiveList.xlsx");
    }
    const handleNewProductReceive = () => {
        history.push("/new-production-receive", { companyId: companyId, userLoginId: userLoginId })
    }
    /* const handleKeyPressChange = (e) => {
        if (e.keyCode === 32) {
            getInvProductionReceiveDetails(searchParams);
        } else if (e.keyCode === 8) {
            getInvProductionReceiveDetails(searchParams);
        }
    } */
    const handleSearchChange = (event) => {
        let value = event.target.value;
        getSearchList(value);
    }

    const getSearchList = (searchText) => {
        let searchTextValue = searchText.toLowerCase();
        let tp = [];
        console.log(invRcvDetailsSearch)
        for (let i = 0; i < invRcvDetailsSearch.length; i++) {
            let batchNo = invRcvDetailsSearch[i].batchNo.toLowerCase();
            let productSku = invRcvDetailsSearch[i].productSku.toLowerCase();
            let productName = invRcvDetailsSearch[i].productName.toLowerCase();
            let productCategory = invRcvDetailsSearch[i].productCategory.toLowerCase();
            let receiveStore = invRcvDetailsSearch[i].receiveStore.toLowerCase();
            if (batchNo.includes(searchTextValue)
                || productSku.includes(searchTextValue)
                || productName.includes(searchTextValue)
                || productCategory.includes(searchTextValue)
                || receiveStore.includes(searchTextValue)
            ) {
                tp.push(invRcvDetailsSearch[i]);
            }
        }
        setInvRcvDetails(tp);
    }

    const manufacturingCostEntry = () => {
        if (mcCostData.length > 0) {
            const URL = `${process.env.REACT_APP_API_URL}/api/inv-receive/set-production-manufacturing-cost`;
            axios.put(URL, mcCostData).then(response => {
                console.log("searchParams", searchParams);
                getInvProductionReceiveDetails(searchParams);
                showSuccess("Manufacturing cost set successfully.");
            }).catch(err => {
                showError("Manufacturing cost set error");
                showError(err);
            });
        }
        else
            showError("Please set manufacturing cost");
    }

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

            {/*SUB TABS ROW */}
            <div>
                <StockTransferSubTabs />
            </div>

            {/* MAIN CARD ROW */}
            <div className="mb-n5">
                <Card>
                    <CardBody>
                        <span className="text-muted mt-3 display-inline-block">
                            In this program concern Central Warehouse personnel can receive the Product Master Carton after production.
                        </span>
                        <span>
                        {hasCreateAccess(permissions, 'PRODUCTION_RECEIVE') &&
                            <button onClick={handleNewProductReceive} className="float-right btn light-blue-bg dark-blue-color rounded">
                                <SVG className="mr-2" src={toAbsoluteUrl("/media/svg/icons/project-svg/blue-add.svg")} />
                                New Production Receive
                            </button>
                        }                   
                        </span>
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
                                <div style={{ position: "absolute", padding: "7px", marginTop: "3px" }}>
                                    <img src={toAbsoluteUrl("/images/search.png")} width="20px" height="20px" />
                                </div>
                                <form className="form form-label-right">
                                    <input type="text" className="form-control" name="searchText"
                                        placeholder="Search Here" style={{ paddingLeft: "28px" }}
                                        onChange={handleSearchChange}
                                    // onKeyUp={(e) => handleKeyPressChange(e)} 
                                    />
                                </form>
                            </div>

                            {/* SELECTED ROW */}
                            <div className="col-xl-9 d-flex flex-wrap justify-content-end">
                                {/* TIMELINE DROPDOWN */}
                                <div className="mr-3">
                                    <div className="row">
                                        <div className="col-3 mt-3">
                                            <label className="dark-gray-color">Timeline</label>
                                        </div>
                                        <div className="col-9">
                                            <select className="border-0 form-control" onChange={(event) => changeAccYear(event)}>
                                                <option value="" className="fs-1">Select Fiscal Year</option>
                                                {
                                                    allAccountingYear.map((accYear) => (
                                                        <option key={accYear.id} value={accYear.id}
                                                            className="fs-1">{accYear.fiscalYearName}</option>
                                                    ))
                                                }
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                {/* FILTER BUTTON ROW */}
                                <div>
                                    <button className="btn filter-btn float-right">
                                        <i className="bi bi-funnel" style={{ fontSize: "11px" }}></i>&nbsp;Filter
                                    </button>
                                </div>
                            </div>


                        </div>

                        {/* ALL SUMMARY ROW */}
                        <div className="row">
                            {/* NO. OF BOOKING ROW */}
                            <div className='col-xl-4 sales-data-chip'>
                                <div className="d-flex">
                                    {/* <div className="dark-gray-color">
                                        <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/location.svg")} width="30px" height="30px" />
                                    </div>
                                    <div className="ml-2">
                                        <span>
                                            <span className="dark-gray-color"
                                                style={{ fontWeight: "500" }}>Location</span>
                                            <p><strong>Chittagong</strong></p>
                                        </span>
                                    </div> */}
                                </div>
                            </div>

                            {/* NO. OF BOOKING ROW */}
                            <div className='col-xl-4 sales-data-chip'>
                                <div className="d-flex">
                                    {/* <div className="dark-gray-color">
                                        <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/history.svg")} width="25px" height="25px" />
                                    </div>
                                    <div className="ml-2">
                                        <span>
                                            <span className="dark-gray-color"
                                                style={{ fontWeight: "500" }}>No. Of Receive</span>
                                            <p><strong>{invRcvDetails?.length}</strong></p>
                                        </span>
                                    </div> */}
                                </div>
                            </div>

                            {/* EXPORT ROW */}
                            <div className='col-xl-4 sales-data-chip' style={{ background: "#F9F9F9" }}>
                                {hasAcess(permissions, 'MANUFACTURING_COST') &&
                                    <button className="btn text-white float-right" style={{ background: "#6FCF97" }}
                                        onClick={() => manufacturingCostEntry()}
                                    >
                                        <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/white-receive.svg")} />
                                        &nbsp;MC Cost Update
                                    </button>
                                }
                                <button className="btn float-right export-btn" onClick={handleExport}>
                                    <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/download.svg")} width="15px" height="15px" />
                                </button>
                            </div>
                        </div>

                        {/* TABLE ROW */}
                        {hasAcess(permissions, 'MANUFACTURING_COST') ?
                            <div className='mt-5'>
                                <ProductionReceiveList setSingleAll={setSingleAll} singleAll={singleAll}
                                    invRcvDetails={invRcvDetails} setMcCostData={setMcCostData} />
                            </div>
                            :
                            <div className='mt-5'>
                                <ProductionReceiveListAll setSingleAll={setSingleAll} singleAll={singleAll}
                                    invRcvDetails={invRcvDetails} />
                            </div>
                        }
                    </CardBody>
                </Card>
            </div>
        </>
    );
}