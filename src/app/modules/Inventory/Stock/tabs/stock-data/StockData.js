import React, { useState, useEffect, useMemo } from "react";
import { Card, CardBody } from "../../../../../../_metronic/_partials/controls";
import InventoryBreadCrum from '../../../bread-crum/InventoryBreadCrum';
import InventoryStockHeader from "../../header/InventoryStockHeader";
import { toAbsoluteUrl } from "../../../../../../_metronic/_helpers";
import SVG from "react-inlinesvg";
import StockDataList from "./table/StockDataList";
import { shallowEqual, useSelector } from "react-redux";
import axios from "axios";
import UnauthorizedPage from "../../../../Common/UnauthorizedPage";
import { showError } from '../../../../../pages/Alert';
import { hasAcess } from "../../../../Util";
import * as XLSX from 'xlsx';

export default function StockData() {
    const permissions = useSelector((state) => state.auth.user.permissions, shallowEqual);
    const userLoginId = useSelector((state) => state.auth.user.userId, shallowEqual);
    const companyId = useSelector((state) => state.auth.company, shallowEqual);

    const [productCategoryId, setProductCategoryId] = useState();
    const [childCategoryList, setChildCategoryList] = useState([]);
    const [categoryName, setCategoryName] = useState('All');
    const searchParams = useMemo(() => {
        return { userLoginId: userLoginId, companyId: companyId, productCategoryId: productCategoryId }
    }, [userLoginId, companyId, productCategoryId]);

    const [depotStockDetails, setDepotStockDetails] = useState([]);

    let [singleAll, setSingleAll] = useState([]);
    useEffect(() => {
        document.getElementById('pills-inventory-stock-stock-data-tab').classList.add('active');

        getAllChildCategoryOfACompany()
    }, [searchParams]);

    useEffect(() => {
        getDepotWiseStockDetails(searchParams);
    }, [searchParams]);

    const handleExport = () => {
        const data = [...singleAll];
        if (data.length === 0) {
            showError("No row is selected for export data");
            return;
        }
    
        let exportData = [];
        data.map(row => {
            let obj = {};
            obj.productSku = row.productSku;
            obj.productName =row.productName;
            obj.productCategory = row.productCategory;
            obj.regularStock = row.regularStock;
            obj.inTransitStock = row.inTransitStock;
            obj.quarantineStock = row.quarantineStock ?  (row.quarantineStock) : 0;
            obj.restrictedStock = row.restrictedStock ?  (row.restrictedStock) : 0;
            obj.weightedAverageRate = row.weightedAverageRate ?  (row.weightedAverageRate).toFixed(2) : 0.00;
         
            exportData.push(obj);
            //setSingleAll([]);
        })
        const workbook = XLSX.utils.book_new();
        const Heading = [
            ["SKU", "PRODUCT NAME","PRODUCT CATEGORY","REGULAR STOCK","IN TRANSIT STOCK","QUARANTINE STOCK", "RESTRICTED STOCK", "W.A. RATE"]
        ];
        const worksheet = XLSX.utils.json_to_sheet(exportData, {origin: 'A2', skipHeader: true});

        XLSX.utils.sheet_add_aoa(worksheet, Heading, {origin: 'A1'});
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, "StockDataList.xlsx");
    }

    const getDepotWiseStockDetails = (params) => {

        let queryString = "?";
        queryString += "&companyId=" + params.companyId;
        queryString += "&userLoginId=" + params.userLoginId;
        queryString += params.productCategoryId ? "&productCategoryId=" + params.productCategoryId : '';

        const URL = `${process.env.REACT_APP_API_URL}/api/stock/depot-wise-stock-data` + queryString;
        axios.get(URL).then((response) => {
            setDepotStockDetails(response.data.data);

        }).catch();
    }

    const handleCategoryChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;
        var index = event.nativeEvent.target.selectedIndex;

        if (value !== "") {
            setCategoryName(event.nativeEvent.target[index].text);
        } else {
            setCategoryName("All");
        }

        setProductCategoryId(value);

    }

    const getAllChildCategoryOfACompany = () => {
        let queryString = "?";
        queryString += "companyId=" + searchParams.companyId;

        const URL = `${process.env.REACT_APP_API_URL}/api/product-category/child` + queryString;

        axios.get(URL).then(response => {
            setChildCategoryList(response.data.data);
        }).catch(err => {

        });
    }

    const handleAllChange = () => {
        const getId = document.getElementById("allId");
        const attributrValue = getId.getAttribute("selected");

        document.getElementById("regularId").classList.remove("products-filter-span-change");
        document.getElementById("regularId").classList.remove("text-white");
        document.getElementById("regularId").setAttribute("selected", "false");

        document.getElementById("inTransitId").classList.remove("products-filter-span-change");
        document.getElementById("inTransitId").classList.remove("text-white");
        document.getElementById("inTransitId").setAttribute("selected", "false");

        document.getElementById("quarantineId").classList.remove("products-filter-span-change");
        document.getElementById("quarantineId").classList.remove("text-white");
        document.getElementById("quarantineId").setAttribute("selected", "false");

        document.getElementById("restrictedId").classList.remove("products-filter-span-change");
        document.getElementById("restrictedId").classList.remove("text-white");
        document.getElementById("restrictedId").setAttribute("selected", "false");

        if (attributrValue == "true") {
            getId.classList.remove("products-filter-span-change");
            getId.classList.remove("text-white");
            getId.setAttribute("selected", "false");
        } else {
            getId.classList.add("products-filter-span-change");
            getId.classList.add("text-white");
            getId.setAttribute("selected", "true");
        }
    }
    const handleRegularChange = () => {
        const getId = document.getElementById("regularId");
        const attributrValue = getId.getAttribute("selected");

        document.getElementById("allId").classList.remove("products-filter-span-change");
        document.getElementById("allId").classList.remove("text-white");
        document.getElementById("allId").setAttribute("selected", "false");

        document.getElementById("inTransitId").classList.remove("products-filter-span-change");
        document.getElementById("inTransitId").classList.remove("text-white");
        document.getElementById("inTransitId").setAttribute("selected", "false");

        document.getElementById("quarantineId").classList.remove("products-filter-span-change");
        document.getElementById("quarantineId").classList.remove("text-white");
        document.getElementById("quarantineId").setAttribute("selected", "false");

        document.getElementById("restrictedId").classList.remove("products-filter-span-change");
        document.getElementById("restrictedId").classList.remove("text-white");
        document.getElementById("restrictedId").setAttribute("selected", "false");

        if (attributrValue == "true") {
            getId.classList.remove("products-filter-span-change");
            getId.classList.remove("text-white");
            getId.setAttribute("selected", "false");
        } else {
            getId.classList.add("products-filter-span-change");
            getId.classList.add("text-white");
            getId.setAttribute("selected", "true");
        }
    }
    const handleInTransitChange = () => {
        const getId = document.getElementById("inTransitId");
        const attributrValue = getId.getAttribute("selected");

        document.getElementById("regularId").classList.remove("products-filter-span-change");
        document.getElementById("regularId").classList.remove("text-white");
        document.getElementById("regularId").setAttribute("selected", "false");

        document.getElementById("allId").classList.remove("products-filter-span-change");
        document.getElementById("allId").classList.remove("text-white");
        document.getElementById("allId").setAttribute("selected", "false");

        document.getElementById("quarantineId").classList.remove("products-filter-span-change");
        document.getElementById("quarantineId").classList.remove("text-white");
        document.getElementById("quarantineId").setAttribute("selected", "false");

        document.getElementById("restrictedId").classList.remove("products-filter-span-change");
        document.getElementById("restrictedId").classList.remove("text-white");
        document.getElementById("restrictedId").setAttribute("selected", "false");

        if (attributrValue == "true") {
            getId.classList.remove("products-filter-span-change");
            getId.classList.remove("text-white");
            getId.setAttribute("selected", "false");
        } else {
            getId.classList.add("products-filter-span-change");
            getId.classList.add("text-white");
            getId.setAttribute("selected", "true");
        }
    }

    const handleQuarantineChange = () => {
        const getId = document.getElementById("quarantineId");
        const attributrValue = getId.getAttribute("selected");

        document.getElementById("regularId").classList.remove("products-filter-span-change");
        document.getElementById("regularId").classList.remove("text-white");
        document.getElementById("regularId").setAttribute("selected", "false");

        document.getElementById("allId").classList.remove("products-filter-span-change");
        document.getElementById("allId").classList.remove("text-white");
        document.getElementById("allId").setAttribute("selected", "false");

        document.getElementById("inTransitId").classList.remove("products-filter-span-change");
        document.getElementById("inTransitId").classList.remove("text-white");
        document.getElementById("inTransitId").setAttribute("selected", "false");

        document.getElementById("restrictedId").classList.remove("products-filter-span-change");
        document.getElementById("restrictedId").classList.remove("text-white");
        document.getElementById("restrictedId").setAttribute("selected", "false");

        if (attributrValue == "true") {
            getId.classList.remove("products-filter-span-change");
            getId.classList.remove("text-white");
            getId.setAttribute("selected", "false");
        } else {
            getId.classList.add("products-filter-span-change");
            getId.classList.add("text-white");
            getId.setAttribute("selected", "true");
        }
    }

    const handleRestrictedChange = () => {
        const getId = document.getElementById("restrictedId");
        const attributrValue = getId.getAttribute("selected");

        document.getElementById("regularId").classList.remove("products-filter-span-change");
        document.getElementById("regularId").classList.remove("text-white");
        document.getElementById("regularId").setAttribute("selected", "false");

        document.getElementById("allId").classList.remove("products-filter-span-change");
        document.getElementById("allId").classList.remove("text-white");
        document.getElementById("allId").setAttribute("selected", "false");

        document.getElementById("inTransitId").classList.remove("products-filter-span-change");
        document.getElementById("inTransitId").classList.remove("text-white");
        document.getElementById("inTransitId").setAttribute("selected", "false");

        document.getElementById("quarantineId").classList.remove("products-filter-span-change");
        document.getElementById("quarantineId").classList.remove("text-white");
        document.getElementById("quarantineId").setAttribute("selected", "false");

        if (attributrValue == "true") {
            getId.classList.remove("products-filter-span-change");
            getId.classList.remove("text-white");
            getId.setAttribute("selected", "false");
        } else {
            getId.classList.add("products-filter-span-change");
            getId.classList.add("text-white");
            getId.setAttribute("selected", "true");
        }
    }

    const handleKeyPressChange = (e) => {
        if (e.keyCode === 32) {
            getDepotWiseStockDetails(searchParams);
        } else if (e.keyCode === 8) {
            getDepotWiseStockDetails(searchParams);
        }
    }
    const handleSearchChange = (event) => {
        let value = event.target.value;
        getSearchList(value);
    }
    const getSearchList = (searchText) => {
        let searchTextValue = searchText.toLowerCase();
        let tp = [];
        for (let i = 0; i < depotStockDetails.length; i++) {
            let productName = depotStockDetails[i].productName.toLowerCase();
            let productSku = depotStockDetails[i].productSku.toLowerCase();
            let productCategory = depotStockDetails[i].productCategory.toLowerCase();
            if (productName.includes(searchTextValue)
                || productSku.includes(searchTextValue)
                || productCategory.includes(searchTextValue)) {
                tp.push(depotStockDetails[i]);
            }
        }
        setDepotStockDetails(tp);
    }
    return (
        <>
            {/* BREAD CRUM ROW */}
            <div>
                <InventoryBreadCrum />
            </div>

            <div>
                <InventoryStockHeader showStockData={true} />
            </div>
            {/* MAIN CARD ROW */}
            {hasAcess(permissions, 'STOCK_DATA') ?
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
                                            onKeyUp={(e) => handleKeyPressChange(e)}
                                        />
                                    </form>
                                </div>

                                <div className="col-xl-9 d-flex flex-wrap justify-content-end">
                                            {/* CATEGORY DROPDOWN */}
                                            <div className="mr-3">
                                                <div className="row">
                                                    <div className="col-3 mt-3">
                                                        <label className="ml-n3" style={{ color: "rgb(130, 130, 130)" }}>Categories</label>
                                                    </div>
                                                    <div className="col-9">
                                                        <select className="form-control border-0" name="categoryName" onChange={handleCategoryChange}>
                                                            <option value="" selected>Select Product Category</option>
                                                            {childCategoryList.map((childCat) => (
                                                                <option key={childCat.childCategory} value={childCat.productCategoryId}>
                                                                    {childCat.childCategory}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* FILTER BUTTON ROW */}
                                            <div>
                                                <button className="btn filter-btn">
                                                    <i className="bi bi-funnel" style={{ fontSize: "11px" }}></i>&nbsp;Filter
                                                </button>
                                            </div>
                                </div>
                            </div>

                            {/* ALL SUMMARY ROW */}
                            <div className="row">
                                {/* CATEGORY ROW */}
                                <div className='col-xl-2 sales-data-chip'>
                                    <div className="d-flex">
                                        <div className="dark-gray-color">
                                            <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/dark-gray-category.svg")} width="25px" height="25px" />
                                        </div>
                                        <div className="ml-2">
                                            <span>
                                                <span className="dark-gray-color"
                                                    style={{ fontWeight: "500" }}>Category</span>
                                                <p><strong>{categoryName}</strong></p>
                                            </span>
                                        </div>
                                    </div>
                                </div>


                                {/* REGULAR ROW */}
                                <div className='col-xl-2 sales-data-chip' style={{ borderRadius: "5px 0px 0px 5px" }}>
                                    <div className="d-flex">
                                        <div className="dark-gray-color">
                                            <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/regular.svg")} width="25px" height="25px" />
                                        </div>
                                        <div className="ml-2">
                                            <span>
                                                <span className="dark-gray-color"
                                                    style={{ fontWeight: "500" }}>Regular</span>
                                                <p><strong>{depotStockDetails?.reduce((total, stock) => total + stock.regularStock, 0).toLocaleString('en-US', {minimumFractionDigits: 0})}</strong></p>
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* IN TRANSIT ROW */}
                                <div className='col-xl-2 sales-data-chip' style={{ borderRadius: "0px 5px 5px 0px" }}>
                                    <div className="d-flex">
                                        <div className="dark-gray-color">
                                            <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/intransit.svg")} width="25px" height="25px" />
                                        </div>
                                        <div className="ml-2">
                                            <span>
                                                <span className="dark-gray-color"
                                                    style={{ fontWeight: "500" }}>In Transit</span>
                                                <p><strong>{depotStockDetails?.reduce((total, stock) => total + stock.inTransitStock, 0).toLocaleString('en-US', {minimumFractionDigits: 0})}</strong></p>
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* QUARANTINE ROW */}
                                <div className='col-xl-2 sales-data-chip' style={{ borderRadius: "0px 5px 5px 0px" }}>
                                    <div className="d-flex">
                                        <div className="dark-gray-color">
                                            <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/quarantine.svg")} width="25px" height="25px" />
                                        </div>
                                        <div className="ml-2">
                                            <span>
                                                <span className="dark-gray-color"
                                                    style={{ fontWeight: "500" }}>Quarantine</span>
                                                <p><strong>{depotStockDetails?.reduce((total, stock) => total + stock.quarantineStock, 0).toLocaleString('en-US', {minimumFractionDigits: 0})}</strong></p>
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* RESTRICTED ROW */}
                                <div className='col-xl-2 sales-data-chip' style={{ borderRadius: "0px 5px 5px 0px" }}>
                                    <div className="d-flex">
                                        <div className="dark-gray-color">
                                            <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/restricted.svg")} width="25px" height="25px" />
                                        </div>
                                        <div className="ml-2">
                                            <span>
                                                <span className="dark-gray-color"
                                                    style={{ fontWeight: "500" }}>Restricted</span>
                                                <p><strong>{depotStockDetails?.reduce((total, stock) => total + stock.restrictedStock, 0).toLocaleString('en-US', {minimumFractionDigits: 0})}</strong></p>
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* EXPORT ROW */}
                                <div className='col-xl-2 sales-data-chip' style={{ background: "#F9F9F9" }}>
                                    <button className="btn float-right export-btn" onClick={handleExport}>
                                        <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/download.svg")} width="15px" height="15px" />
                                    </button>
                                </div>
                            </div>

                            {/* TABLE ROW */}
                            <div className='mt-5'>
                                <StockDataList setSingleAll={setSingleAll}
                                    singleAll={singleAll}
                                    depotStockDetails={depotStockDetails} />
                            </div>
                        </CardBody>
                    </Card>
                </div>
                : <UnauthorizedPage />}
        </>
    );
}