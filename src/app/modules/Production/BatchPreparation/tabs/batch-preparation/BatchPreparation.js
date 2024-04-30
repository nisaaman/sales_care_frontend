import React, { useState, useEffect } from "react";
import { Card } from "react-bootstrap";
import { CardBody } from "../../../../../../_metronic/_partials/controls";
import BatchPreparationBreadCrum from '../../common/BatchPreparationBreadCrum';
import BatchPreparationTabs from '../../common/BatchPreparationTabs';
import { toAbsoluteUrl } from "../../../../../../_metronic/_helpers";
import SVG from "react-inlinesvg";
import { BatchPreparationList } from "./table/BatchPreparationList";
import { shallowEqual, useSelector } from "react-redux";
import axios from "axios";
import { showError } from "../../../../../pages/Alert";
import * as XLSX from 'xlsx';
import { hasAcess, hasCreateAccess } from '../../../../Util';

export default function BatchPreparation() {

    const companyId = useSelector((state)=> state.auth.company, shallowEqual);
    const permissions = useSelector((state) => state.auth.user.permissions, shallowEqual);
    const [productCategoryId, setProductCategoryId] = useState();
    const [searchParams, setSearchParams] = useState({companyId: companyId, productCategoryId: productCategoryId});
    const [productList, setProductList] = useState([]);
    const [productListSearch, setProductListSearch] = useState([]);
    const [childCategoryList, setChildCategoryList] = useState([]);
    const [categoryName, setCategoryName] = useState('');

    let [singleAll, setSingleAll] = useState([]);
    useEffect(() => {
        if(hasAcess(permissions, 'BATCH_PREPARATION_PRODUCT')){
            document.getElementById('pills-inventory-products-products-tab').classList.add('active');
        }
        
        //document.getElementById("regularId").classList.add("products-filter-span-change");
        //document.getElementById("regularId").setAttribute("selected", "true");
       
        //setSearchParams({...searchParams, companyId: companyId});
    }, [companyId]);

    useEffect(() => {
        const searchData = {...searchParams, companyId: companyId};
        getAllProductsOfACompany(searchData);
        getAllChildCategoryOfACompany(companyId);
        
    },[companyId,productCategoryId]);

    const handleExport = () => {
        const data = [...singleAll]
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
          
            exportData.push(obj);
        
        })
        const workbook = XLSX.utils.book_new();
        const Heading = [
            ["SKU", "PRODUCT NAME","PRODUCT CATEGORY"]
        ];
        const worksheet = XLSX.utils.json_to_sheet(exportData, {origin: 'A2', skipHeader: true});

        XLSX.utils.sheet_add_aoa(worksheet, Heading, {origin: 'A1'});
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, "ProductList.xlsx");
    }

    const handleKeyPressChange = (e) => {
        const searchData = {...searchParams, companyId: companyId};
        if (e.keyCode === 32) {
            getAllProductsOfACompany(searchData);
        } else if (e.keyCode === 8) {
            getAllProductsOfACompany(searchData);
        }
    }

    const handleRegularBackgroundChange = () => {
        const getId = document.getElementById("regularId");
        const attributrValue = getId.getAttribute("selected");

        document.getElementById("out-of-stock").classList.remove("products-filter-span-change");
        document.getElementById("out-of-stock").setAttribute("selected", "false");

        document.getElementById("minimum-stock").classList.remove("products-filter-span-change");
        document.getElementById("minimum-stock").setAttribute("selected", "false");

        if (attributrValue == "true") {
            getId.classList.remove("products-filter-span-change");
            getId.setAttribute("selected", "false");
        } else {
            getId.classList.add("products-filter-span-change");
            getId.setAttribute("selected", "true");
        }
    }
    const handleOutOfStockBackgroundChange = () => {
        const getId = document.getElementById("out-of-stock");
        const attributrValue = getId.getAttribute("selected");

        //document.getElementById("regularId").classList.remove("products-filter-span-change");
        //document.getElementById("regularId").setAttribute("selected", "false");

        //document.getElementById("minimum-stock").classList.remove("products-filter-span-change");
        //document.getElementById("minimum-stock").setAttribute("selected", "false");

        if (attributrValue == "true") {
            getId.classList.remove("products-filter-span-change");
            getId.setAttribute("selected", "false");
        } else {
            getId.classList.add("products-filter-span-change");
            getId.setAttribute("selected", "true");
        }
    }
    const handleMinimumStockBackgroundChange = () => {
        const getId = document.getElementById("minimum-stock");
        const attributrValue = getId.getAttribute("selected");

        document.getElementById("out-of-stock").classList.remove("products-filter-span-change");
        document.getElementById("out-of-stock").setAttribute("selected", "false");

        document.getElementById("regularId").classList.remove("products-filter-span-change");
        document.getElementById("regularId").setAttribute("selected", "false");

        if (attributrValue == "true") {
            getId.classList.remove("products-filter-span-change");
            getId.setAttribute("selected", "false");
        } else {
            getId.classList.add("products-filter-span-change");
            getId.setAttribute("selected", "true");
        }
    }

    const handleChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;
        var index = event.nativeEvent.target.selectedIndex;

        if(value !== "") {
            setCategoryName(event.nativeEvent.target[index].text);
        } else {
            setCategoryName("All");
        }
        
        setProductCategoryId(value);
        setSearchParams(values => ({...values, productCategoryId: value}));
    }

    const getAllChildCategoryOfACompany = (companyId) => {
        let queryString = "?";
        queryString += "companyId="+companyId;
       
        const URL = `${process.env.REACT_APP_API_URL}/api/product-category/child`+queryString;
        if (companyId) {
        axios.get(URL).then(response => {
            setChildCategoryList(response.data.data);
        }).catch(err => {
            showError("Products not available...")
        });}
    }

    const getAllProductsOfACompany = (searchParams) => {
        let queryString = "?";
        queryString += "companyId="+searchParams.companyId;
        queryString += searchParams.productCategoryId ? "&productCategoryId="+searchParams.productCategoryId : "";

        const URL = `${process.env.REACT_APP_API_URL}/api/product/all/company-wise`+queryString;

        axios.get(URL).then(response => {            
            let list = response.data.data;
            let hasCreatePermission = hasCreateAccess(permissions, "BATCH_PREPARATION_PRODUCT");
            // eslint-disable-next-line array-callback-return
            list.map(m => {
                m.hasCreatePermission = hasCreatePermission;
            });
            setProductList(list);
            setProductListSearch(response.data.data);
        }).catch(err => {
            showError("Products not available...")
        });
    }
    const handleSearchChange = (event) => {
        let value = event.target.value;
        getSearchList(value);
    }
    const getSearchList = (searchText) => {
        let searchTextValue = searchText.toLowerCase();
        let tp = [];
        for (let i = 0; i < productListSearch.length; i++) {
            let productName = productListSearch[i].productName.toLowerCase();
            let productSku = productListSearch[i].productSku.toLowerCase();
            let productCategory = productListSearch[i].productCategory.toLowerCase();
            if (productName.includes(searchTextValue)
                || productSku.includes(searchTextValue)
                || productCategory.includes(searchTextValue)
            ) {
                tp.push(productListSearch[i]);
            }
        }
        setProductList(tp);
    }
    return (
        <>
            {/* BREAD CRUM ROW */}
            <div>
                <BatchPreparationBreadCrum />
            </div>

            {/* TABS ROW */}
            <div>
                <BatchPreparationTabs />
            </div>

            {/* MAIN CARD ROW */}
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
                                    />
                                </form>
                            </div>

                            {/* SELECTED ROW */}
                            <div className="col-xl-8">
                                <div className="row justify-content-end">

                                    {/* ALL AND OUT STOCK AND MINIMUM STOCK BUTTON */}
                                    {/*<div className="col-xl-6 text-right">
                                        <span id="regularId" className="products-filter-span mr-5 display-inline-block" selected="false" onClick={handleRegularBackgroundChange}>
                                            Regular Stock
                                        </span>
                                        <span id="out-of-stock" className="products-filter-span mr-5 display-inline-block" selected="false" onClick={handleOutOfStockBackgroundChange}>
                                            Out Of Stock
                                        </span>
                                        <span id="minimum-stock" className="products-filter-span mr-5 display-inline-block" selected="false" onClick={handleMinimumStockBackgroundChange}>
                                            Minimum Stock
                                        </span>
                                    </div>

                                    {/* DEPOT DROPDOWN */}
                                    {/*<div className="col-xl-3">
                                        <div className="row">
                                            <div className="col-4 mt-3">
                                                <label style={{ color: "rgb(130, 130, 130)" }}>Depot</label>
                                            </div>
                                            <div className="col-8">
                                                <select className="form-control">
                                                    <option value="1" selected>Chittagong</option>
                                                    <option value="2">Dhaka</option>
                                                    <option value="3">Rajshahi</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>*/}

                                    {/* CATEGORY DROPDOWN */}
                                    <div className="col-xl-6">
                                        <div className="row">
                                            <div className="col-4 mt-3">
                                                <label className="ml-n3" style={{ color: "rgb(130, 130, 130)" }}>Categories</label>
                                            </div>
                                            <div className="col-8">
                                                <select className="form-control border-0" name="categoryName" onChange={handleChange}>
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
                                </div>
                            </div>

                            {/* FILTER BUTTON ROW */}
                            <div className="col-xl-1 mt-1">
                                <button className="btn filter-btn">
                                    <i className="bi bi-funnel" style={{ fontSize: "11px" }}></i>&nbsp;Filter
                                </button>
                            </div>
                        </div>

                        {/* ALL SUMMARY ROW */}
                        <div className='sales-data-chip d-flex flex-wrap justify-content-between'>
                            {/* DEPORT ROW */}
                            {/* <div style={{ borderRadius: "5px 0px 0px 5px" }}>
                                <div className="d-flex">
                                    <div className="dark-gray-color">
                                        <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/depot-gray.svg")} width="25px" height="25px" />
                                    </div>
                                    <div className="ml-2">
                                        <span>
                                            <span className="dark-gray-color"
                                                style={{ fontWeight: "500" }}>Depot</span>
                                            <p><strong>All</strong></p>
                                        </span>
                                </div>
                                </div>
                            </div> */}

                            {/* CATEGORY ROW */}
                            <div>
                                <div className="d-flex">
                                    <div className="dark-gray-color">
                                        <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/dark-gray-category.svg")} width="25px" height="25px" />
                                    </div>
                                    <div className="ml-2">
                                        <span>
                                            <span className="dark-gray-color"
                                                style={{ fontWeight: "500" }}>Category</span>
                                            <p><strong>{categoryName? categoryName : "All"}</strong></p>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div style={{ borderRadius: "0px 5px 5px 0px" }}>
                                <div className="d-flex">
                                    <div className="dark-gray-color">
                                        <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/dark-gray-product.svg")} width="25px" height="25px" />
                                    </div>
                                    <div className="ml-2">
                                        <span>
                                            <span className="dark-gray-color"
                                                style={{ fontWeight: "500" }}>Total Products</span>
                                            <p><strong>{productList?.length}</strong></p>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div style={{ background: "#F9F9F9" }}>
                                <button className="btn float-right export-btn" onClick={handleExport}>
                                    <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/download.svg")} width="15px" height="15px" />
                                </button>
                            </div>
                        </div>

                        {/* TABLE ROW */}
                        <div className='mt-5'>
                            <BatchPreparationList setSingleAll={setSingleAll} singleAll={singleAll} productList = {productList}/>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </>
    );
}