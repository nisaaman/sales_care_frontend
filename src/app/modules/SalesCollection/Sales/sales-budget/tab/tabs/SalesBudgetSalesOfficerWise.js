import React, { useState, useEffect, useMemo} from "react";
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
import {SalesOfficerWiseList} from "../../table/sales-officer-wise-table/SalesOfficerWiseList";
import { amountFormatterWithoutCurrency } from "../../../../../Util";
import { shallowEqual, useSelector } from "react-redux";

export default function SalesBudgetSalesOfficerWise(){
    
    const companyId = useSelector((state) => state.auth.company, shallowEqual);
    const userLoginId = useSelector((state) => state.auth.user.userId, shallowEqual);

    let history = useHistory();
    const intl = useIntl();
    const [currentAccountingYear, setCurrentAccountingYear] = useState();
    const [accountingYearId, setAccountingYearId] = useState('');
    const [locationId, setLocationId] = useState('');
    const [sessionData, setSessionData] = useState();
    const [allAccountingYear, setAllAccountingYear] = useState([]);
    const searchParams = useMemo(() => {
        return {userLoginId: userLoginId, companyId: companyId, accountingYearId: accountingYearId,
        locationId:locationId}
    },[userLoginId,companyId,accountingYearId,locationId]);
    const [locationTree, setLocationTree] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState({});
    const [locationTypeNameSelect, setLocationTypeNameSelect] = useState("Area");
    const [salesOfficerWiseBudgetList, setSalesOfficerWiseSalesBudgetList] = useState([]);

    let [singleAll, setSingleAll] = useState([]);

    useEffect(() => {
        document.getElementById('pills-sales-budget-tab').classList.add('active');
        document.getElementById('pills-sales-budget-sales-officer-wise-tab').classList.add('active');
        getLocationTreeList();
        getAccountingYear(companyId);
    }, [userLoginId,companyId]);

    useEffect(() => {
        getSalesOfficerWiseSalesBudget(searchParams)
    },[searchParams]);

    const handleExport = () => {
        const exportData = [...singleAll]
        // console.log(exportData);
    }

    // const getCurrentAccountingYear = (companyId) => {
    //     const URL = `${process.env.REACT_APP_API_URL}/api/accounting-year/current/${companyId}`;
    //     axios.get(URL).then((response) => {
    //         setCurrentAccountingYear(response.data.data);
            
    //         let searchObj = { ...sessionData, accountingYearId: response.data.data};
    //         setSearchParams(searchObj);
    //     }).catch();
    // }

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
            setLocationId(node.id);
            setSelectedLocation(node);
        }
    }

    const getSalesOfficerWiseSalesBudget = (params) => {

        let queryString = "?";
        queryString += params.accountingYearId ? "&accountingYearId="+params.accountingYearId : "";
        queryString += params.month ? "&month="+params.month : "";
        queryString += "&companyId="+params.companyId;
        queryString += params.locationId ? "&locationId="+params.locationId : "";
        queryString += "&userLoginId="+params.userLoginId;

        const URL = `${process.env.REACT_APP_API_URL}/api/sales-budget/sales-officer-wise`+queryString;
        axios.get(URL).then(response => {
            setSalesOfficerWiseSalesBudgetList(response.data.data);
        }).catch();
    }
    const getAccountingYear = (companyId) => {        
        const URL = `${process.env.REACT_APP_API_URL}/api/accounting-year/companyWise/${companyId}`;
        if (companyId) {
        axios.get(URL).then(response => {
            setAllAccountingYear(response.data.data);
        }).catch(err => {
           
        });
    }
    }

    const setAccountingYearData = (event) => {
        setAccountingYearId(event.target.value);   
    }
    const handleKeyPressChange = (e) => {
        if (e.keyCode === 32) {
            getSalesOfficerWiseSalesBudget(searchParams)
        } else if (e.keyCode === 8) {
            getSalesOfficerWiseSalesBudget(searchParams)
        }
    }
    const handleSearchChange = (event) => {
        let value = event.target.value;
        getSearchList(value);
    }
    const getSearchList = (searchText) => {
        let searchTextValue = searchText.toLowerCase();
        let tp = [];
        for (let i = 0; i < salesOfficerWiseBudgetList.length; i++) {
            let salesOfficer = salesOfficerWiseBudgetList[i].salesOfficer.toLowerCase();
            if (salesOfficer.includes(searchTextValue)) {
                tp.push(salesOfficerWiseBudgetList[i]);
            }
        }
        setSalesOfficerWiseSalesBudgetList(tp);
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
                                                    <i className="bi bi-funnel mr-2"></i>Filter
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    {/* ALL SUMMARY ROW */}
                                    <div className='row ml-2'>
                                        <div className='col-xl-3 sales-data-chip' style={{ borderRadius: "5px 0px 0px 5px" }}>
                                            <div className="d-flex">
                                                <div className="dark-gray-color">
                                                <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/location.svg")} width="30px" height="30px" />
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
                                                <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/Duotone.svg")} width="25px" height="25px" />
                                                </div>
                                                <div className="ml-2">
                                                    <span>
                                                        <span className="dark-gray-color"
                                                              style={{ fontWeight: "500" }}>{intl.formatMessage({id: "COMMON.SALES.OFFICER"})}</span>
                                                        <p><strong>{salesOfficerWiseBudgetList.length}</strong></p>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-xl-3 sales-data-chip' style={{ borderRadius: "0px 5px 5px 0px" }}>
                                            <div className="d-flex">
                                                <div className="dark-gray-color">
                                                <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/total-entry.svg")} width="25px" height="25px" />
                                                </div>
                                                <div className="ml-2">
                                                    <span>
                                                        <span className="dark-gray-color"
                                                              style={{ fontWeight: "500" }}>{intl.formatMessage({id: "COMMON.TOTAL_SALES_BUDGET"})}</span>
                                                        <p><strong>{amountFormatterWithoutCurrency(salesOfficerWiseBudgetList.reduce((total, salesOfficerWiseBudget) => 
                                                        total = total + salesOfficerWiseBudget.salesBudget,0))}</strong></p>
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
                                        <SalesOfficerWiseList setSingleAll = {setSingleAll} singleAll={singleAll} salesOfficerWiseBudgetList = {salesOfficerWiseBudgetList} />
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