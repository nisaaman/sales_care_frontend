import React, {useState, useEffect, useMemo} from "react";
import {BreadCrum} from '../../../common/BreadCrum';
import SalesTabsHeader from "../../../common/SalesTabsHeader";
import SalesBudgetTabs from "../../../common/SalesBudgetTabs";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../../../_metronic/_helpers";
import {Card, CardBody} from "../../../../../../../_metronic/_partials/controls";
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import {showError} from '../../../../../../pages/Alert';
import { useIntl } from "react-intl";
import LocationTreeView from '../../../../CommonComponents/LocationTreeView';
import {ProductWiseList} from "../../table/product-wise-table/ProductWiseList";
import { amountFormatterWithoutCurrency } from "../../../../../Util";
import { shallowEqual, useSelector } from "react-redux";

export default function SalesBudgetProductWise(){
    const companyId = useSelector((state) => state.auth.company, shallowEqual);
    const userLoginId = useSelector((state) => state.auth.user.userId, shallowEqual);
    let history = useHistory();
    const intl = useIntl();
    const [currentAccountingYear, setCurrentAccountingYear] = useState();
    const [accountingYearId, setAccountingYearId] = useState('');
    const [locationId, setLocationId] = useState('');
    const [allAccountingYear, setAllAccountingYear] = useState([]);
    const [childCategoryList, setChildCategoryList] = useState([]);
    const [productCategoryId, setProductCategoryId] = useState('');
    const [categoryName, setCategoryName] = useState('All');
   
    const searchParams = useMemo(() => {
        return {userLoginId: userLoginId, companyId: companyId, accountingYearId: accountingYearId,
        locationId:locationId, productCategoryId:productCategoryId}
    },[userLoginId, companyId, accountingYearId, locationId, productCategoryId]);

    const [locationTree, setLocationTree] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState({});
    const [locationTypeNameSelect, setLocationTypeNameSelect] = useState("Area");
    const [productSelect, setProductSelect] = useState("Products");
    const [productWiseSalesBudgetList, setProductWiseSalesBudgetList] = useState([]);
   

    let [singleAll, setSingleAll] = useState([]);
    useEffect(() => {
        document.getElementById('pills-sales-budget-tab').classList.add('active');
        document.getElementById('pills-sales-budget-product-wise-tab').classList.add('active');
        getLocationTreeList();
        //getCurrentAccountingYear(companyId);
        getAllChildCategoryOfACompany()
        getAccountingYear(companyId);
    }, [userLoginId, companyId]);

    useEffect(() => {
        getProductWiseSalesBudget(searchParams);
    },[searchParams]);

    const handleExport = () => {
        const exportData = [...singleAll]
        // console.log(exportData);
    }

    const getCurrentAccountingYear = (companyId) => {
        const URL = `${process.env.REACT_APP_API_URL}/api/accounting-year/current/${companyId}`;
        axios.get(URL).then((response) => {
            setCurrentAccountingYear(response.data.data);
    
        }).catch();
    }

    const getLocationTreeList = () => {
        const URL = `${process.env.REACT_APP_API_URL}/api/location-tree/locationTree/${searchParams.userLoginId}/${searchParams.companyId}`;
        if (searchParams.companyId) { 
        axios.get(URL).then(response => {
            const locationTree = response.data.data;
            setLocationTree(locationTree);
        }).catch(err => {
            showError(intl.formatMessage({id: "COMMON.ERROR_LOCATION_TREE"}));
        });}
    }

    const selectLocationTreeNode = (node) => {
        let id = "summary-id-"+node.id;
        const getId = document.getElementById(id);
        const getElements = document.getElementsByClassName('tree-nav__item_demo tree-nav__item-title');
        
        for (var i = 0; i < getElements.length; i++) {
            getElements[i].classList.remove('tree-nav-item');
        }
        if (getId) {
            getId.classList.add('tree-nav-item');
            setLocationId(node.id)
            setSelectedLocation(node);
        }
    }

    const getProductWiseSalesBudget = (params) => {

        let queryString = "?";
        queryString += params.productCategoryId ? "productCategoryId="+params.productCategoryId : "";
        queryString += params.accountingYearId ? "&accountingYearId="+params.accountingYearId : "";
        queryString += params.month ? "&month="+params.month : "";
        queryString += "&companyId="+params.companyId;
        queryString += params.locationId ? "&locationId="+params.locationId : "";
        queryString += "&userLoginId="+params.userLoginId;

        const URL = `${process.env.REACT_APP_API_URL}/api/sales-budget/product-wise`+queryString;
        if (params.companyId) {
        axios.get(URL).then(response => {
            setProductWiseSalesBudgetList(response.data.data);
        }).catch();
    }
    }
    
    const getAllChildCategoryOfACompany = () => {
        let queryString = "?";
        queryString += "companyId="+searchParams.companyId;
       
        const URL = `${process.env.REACT_APP_API_URL}/api/product-category/child`+queryString;
        if (searchParams.companyId) {
        axios.get(URL).then(response => {
            setChildCategoryList(response.data.data);
        }).catch(err => {
           
        });}
    }
    
    const handleCategoryChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;
        var index = event.nativeEvent.target.selectedIndex;
        setProductCategoryId(value);
        if(value !== "") {
            setCategoryName(event.nativeEvent.target[index].text);
        } else {
            setCategoryName("All");
        }    
    }

    const getAccountingYear = (companyId) => {        
        const URL = `${process.env.REACT_APP_API_URL}/api/accounting-year/companyWise/${companyId}`;
        if (companyId) {
        axios.get(URL).then(response => {
            setAllAccountingYear(response.data.data);
        }).catch(err => {
            //showError(intl.formatMessage({ id: "COMMON.ERROR_STATUS" }));
        });
        }
    }

    const setAccountingYearData = (event) => {

        setAccountingYearId(event.target.value)
        
    }
    const handleKeyPressChange = (e) => {
        if (e.keyCode === 32) {
            getProductWiseSalesBudget(searchParams);
        } else if (e.keyCode === 8) {
            getProductWiseSalesBudget(searchParams);
        }
    }
    const handleSearchChange = (event) => {
        let value = event.target.value;
        getSearchList(value);
    }
    const getSearchList = (searchText) => {
        console.log(productWiseSalesBudgetList)
        let searchTextValue = searchText.toLowerCase();
        let tp = [];
        for (let i = 0; i < productWiseSalesBudgetList.length; i++) {
            let productSku = productWiseSalesBudgetList[i].productSku.toLowerCase();
            let productName = productWiseSalesBudgetList[i].productName.toLowerCase();
            let productCategory = productWiseSalesBudgetList[i].productCategory.toLowerCase();
            if (productSku.includes(searchTextValue)
                || productName.includes(searchTextValue)
                || productCategory.includes(searchTextValue)
            ) {
                tp.push(productWiseSalesBudgetList[i]);
            }
        }
        setProductWiseSalesBudgetList(tp);
    }

    return(
        <>
        <div>
             {/* BREAD CRUM ROW */}
             <BreadCrum />
            {/* TODAY SALE ROW */}
           <SalesTabsHeader />
        </div>
        <div>
            <SalesBudgetTabs />
        </div>
        <div className="mt-5">
                <Card>
                    <CardBody>
                        <div>
                            <div className='row'>
                                {/* LEFT SIDE TREE ROW */}
                                <div className='col-xl-3' style={{ borderRight: "1px solid #F2F2F2" }}>
                                    <div style={{ borderBottom: "1px solid #F2F2F2" }}>
                                        <label>
                                            <img src={toAbsoluteUrl("/images/loc3.png")}
                                                 style={{ width: "20px", height: "20px", textAlign: "center" }}
                                                 alt='Company Picture' />
                                            <strong style={{ marginLeft: "10px", color: "#828282" }}>Location (All)</strong>
                                        </label>
                                    </div>
                                    {/* TREE */}
                                    <LocationTreeView tree={locationTree}
                                                      selectLocationTreeNode={selectLocationTreeNode}/>
                                </div>
                                {/* RIGHT SIDE LIST ROW */}
                                <div className='col-xl-9'>
                                    {/* SEARCHING AND FILTERING ROW */}
                                    <div className="row">
                                        <div className="col-xl-3">
                                            <div style={{ position: "absolute", padding: "7px", marginTop: "3px" }}>
                                                <img src={toAbsoluteUrl("/images/search.png")} width="20px" height="20px" />
                                            </div>
                                            <form className="form form-label-right">
                                                <input type="text" className="form-control" name="searchText"
                                                       placeholder="Search Here" style={{ paddingLeft: "28px" }}
                                                       onKeyUp={(e) => handleKeyPressChange(e)}
                                                       onChange={handleSearchChange}
                                                       />
                                            </form>
                                        </div>
                                        <div className="col-xl-9 d-flex flex-wrap justify-content-end">
                                        <div className="mr-3">
                                            <div className="row">
                                                    <div className="col-3 mt-3">
                                                        <label className="dark-gray-color">Categories</label>
                                                    </div>
                                                    <div className="col-9">
                                                    <select className="form-control border-0" name="categoryName" onChange={handleCategoryChange}>
                                                            <option value="" selected>Select product category</option>
                                                            {childCategoryList.map((childCat) => (
                                                                <option key={childCat.childCategory} value={childCat.productCategoryId}>
                                                                    {childCat.childCategory}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                                
                                        </div>
                                            <div className="mr-3">
                                                    <div className="row">
                                                        <div className="col-3 mt-3">
                                                            <label className="dark-gray-color">Timeline</label>
                                                        </div>
                                                        <div className="col-9">
                                                            <select className="border-0 form-control" onChange={setAccountingYearData}>
                                                            <option value="" selected>Select Fiscal Year</option>
                                                                    {allAccountingYear.map((accYear) => (
                                                                    <option key={accYear.fiscalYearName} value={accYear.id}>
                                                                            {accYear.fiscalYearName}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    </div>
                                            </div>
                                            <div>
                                                <button className="btn filter-btn">
                                                    <i className="bi bi-funnel"></i>&nbsp;Filter
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    {/* ALL SUMMARY ROW */}
                                    <div className='row ml-2'>
                                        <div className='col-xl-3 sales-data-chip' style={{ borderRadius: "5px 0px 0px 5px" }}>
                                            <div className="d-flex">
                                                <div className="dark-gray-color">
                                                <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/location.svg")} width="30px" height="px" />
                                                </div>
                                                <div className="ml-2">
                                                    <span>
                                                    <span className="dark-gray-color"
                                                            style={{ fontWeight: "500" }}>{locationTypeNameSelect}</span>
                                                        <p><strong>{selectedLocation.locationName?selectedLocation.locationName:'All'}</strong></p>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-xl-3 sales-data-chip'>
                                            <div className="d-flex">
                                                <div className="dark-gray-color">
                                                    <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/box.svg")} width="20px" height="20px" />
                                                </div>
                                                <div className="ml-2">
                                                    <span>
                                                        <span className="dark-gray-color"
                                                              style={{ fontWeight: "500" }}>{productSelect}</span>
                                                        <p><strong>{productWiseSalesBudgetList.reduce((total, productWiseSalesBudget) => 
                                                        total = total + productWiseSalesBudget.budgetQuantity,0)}</strong></p>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-xl-3 sales-data-chip' style={{ borderRadius: "0px 5px 5px 0px" }}>
                                            <div className="d-flex">
                                                <div className="dark-gray-color">
                                                <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/chart-line.svg")} width="25px" height="25px" />
                                                </div>
                                                <div className="ml-2">
                                                    <span>
                                                        <span className="dark-gray-color"
                                                              style={{ fontWeight: "500" }}>{intl.formatMessage({id: "COMMON.TOTAL_SALES_BUDGET"})}</span>
                                                        <p><strong>{amountFormatterWithoutCurrency(productWiseSalesBudgetList.reduce((total, productWiseSalesBudget) => 
                                                            total = total + productWiseSalesBudget.salesBudget,0
                                                        ))}</strong></p>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-xl-3 sales-data-chip' style={{ background: "#F9F9F9" }}>
                                            <button className="btn float-right export-btn" onClick={handleExport}>
                                                <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/download.svg")} width="15px" height="15px" />
                                            </button>
                                        </div>
                                    </div>
                                    {/* TABLE ROW */}
                                    <div className='mt-5'>
                                        <ProductWiseList setSingleAll = {setSingleAll} singleAll={singleAll} productWiseSalesBudgetList = {productWiseSalesBudgetList}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </Card>
        </div>
        </>
    );
}