import React, { useState, useEffect, useMemo } from 'react';
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../../_metronic/_helpers";
import { SalesOrderList } from '../table/SalesOrderList';
import {Card, CardBody} from "../../../../../../_metronic/_partials/controls";
import { useHistory } from 'react-router-dom';
import {showError} from '../../../../../pages/Alert';
import axios from 'axios';
import LocationTreeView from '../../../CommonComponents/LocationTreeView';
import { amountFormatterWithoutCurrency } from "../../../../Util";
import { shallowEqual, useSelector } from "react-redux";
import SalesTabsHeader from "../../common/SalesTabsHeader";
import { BreadCrum } from "../../common/BreadCrum";
import * as XLSX from 'xlsx';
import {useIntl} from "react-intl";

export function SalesOrder() {
    const selectedCompany = useSelector((state) => state.auth.company, shallowEqual);
     const userLoginId = useSelector((state) => state.auth.user.userId, shallowEqual);
    const intl = useIntl();
    //const [selectedCompanyId, setSelectedCompanyId] = useState(selectedCompany);
    const [locationId, setLocationId] = useState('');
    const [locationTree, setLocationTree] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState({});
    const [accountingYearId, setAccountingYearId] = useState('');
    const [allAccountingYear, setAllAccountingYear] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    
    const searchParams = useMemo(() => {
        return {userLoginId: userLoginId, companyId: selectedCompany, accountingYearId: accountingYearId,
            locationId:locationId}
    },[userLoginId,selectedCompany,accountingYearId,locationId]);

    const [salesOverView, setSalesOverView] = useState([]);
    let history = useHistory();
    const [singleAll, setSingleAll] = useState([]);

    useEffect(() => {
        document.getElementById('pills-sales-order-tab').classList.add('active')
        //getCurrentAccountingYear(selectedCompanyId)
        getLocationTreeList(searchParams);
        getAccountingYear(selectedCompany)
    }, [userLoginId,selectedCompany]);

    useEffect(() => {
        getSalesOrderOverViewList(searchParams);
        
    }, [searchParams]);
    
    // const handleExport = () => {
    // const data = [...singleAll]
    // const worksheet = XLSX.utils.json_to_sheet(data);
    // const workbook = XLSX.utils.book_new();
    // XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    // XLSX.writeFile(workbook, "SalesOrderData.xlsx");
    // }


    const exportData = (e) => {
        handleExport();
    }


    const handleExport = () => {
        const data = [...singleAll];
        if (data.length === 0) {
            showError("Please select rows to export data.");
            return;
        }
        let exportData = [];
        data.map(row => {
            let obj = {};           
            obj.salesOfficer = row.salesOfficer;
            obj.salesOrderId = row.salesOrderId;
            obj.salesOrderNo = row.salesOrderNo;
            obj.freeQuantity = row.freeQuantity;
            obj.orderAmount = row.orderAmount;
            obj.salesBookingId = row.salesBookingId;
            obj.distributorId = row.distributorId;
            obj.quantity = row.quantity;
            obj.tradeDiscount = row.tradeDiscount;
            obj.salesOrderDate = row.salesOrderDate;
            obj.distributorName = row.distributorName;      
            exportData.push(obj);
        })
        const workbook = XLSX.utils.book_new();
        const Heading = [
            ["Sales Officer","Sales Order Id","Sales Order No", "Free Quantity","Order Amount","Sales Booking Id","Distributor Id","quantity","Trade Discount","Sales Order Date","Distributor Name"]
        ];
        const worksheet = XLSX.utils.json_to_sheet(exportData, { origin: 'A2', skipHeader: true });
        XLSX.utils.sheet_add_aoa(worksheet, Heading, { origin: 'A1' });
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, "SalesOrderData.xlsx");
    }
    const getCurrentAccountingYear = (companyId) => {
        const URL = `${process.env.REACT_APP_API_URL}/api/accounting-year/current/${companyId}`;
        axios.get(URL).then((response) => {
            //let searchObj = { ...sessionData, accountingYearId: response.data.data};
            //setSearchParams(searchObj);
        }).catch();
    }

    const getSalesOrderOverViewList = (params) => {
        let queryString = '?';
        queryString += 'userLoginId=' + params.userLoginId;
        queryString += '&companyId=' + params.companyId;
        queryString += params.accountingYearId? '&accountingYearId=' + params.accountingYearId : '';
        queryString += params.locationId ? '&locationId=' + params.locationId : '';
        const URL = `${process.env.REACT_APP_API_URL}/api/sales-order-data/over-view`+ queryString;
        if (params.companyId) {        
        axios.get(URL).then(response => {
            const salesOrderOverView = response.data.data;
            setSalesOverView(salesOrderOverView);
        }).catch(err => {
            
        });}
    }

    const getLocationTreeList = (params) => {
        const URL = `${process.env.REACT_APP_API_URL}/api/location-tree/locationTree/${params.userLoginId}/${params.companyId}`;
        if (params.companyId) { 
        axios.get(URL).then(response => {
            const locationTree = response.data.data;
            setLocationTree(locationTree);
        }).catch(err => {
            showError("Cannot get Location Tree data.");
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
            setSelectedLocation(node);
            setLocationId(node.id)
        }
        //setSearchParams({...searchParams, locationId: node.id});
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
            getSalesOrderOverViewList(searchParams);
        } else if (e.keyCode === 8) {
            getSalesOrderOverViewList(searchParams);
        }
    }
    const handleSearchChange = (event) => {
        let value = event.target.value;
        getSearchList(value);
    }
    const getSearchList = (searchText) => {
        let searchTextValue = searchText.toLowerCase();
        let tp = [];
        for (let i = 0; i < salesOverView.length; i++) {
            let salesOrderNo = salesOverView[i].salesOrderNo.toLowerCase();
            let distributorName = salesOverView[i].distributorName.toLowerCase();
            let salesOfficer = salesOverView[i].salesOfficer.toLowerCase();
            if (salesOrderNo.includes(searchTextValue)
                || distributorName.includes(searchTextValue)
                || salesOfficer.includes(searchTextValue)
            ) {
                tp.push(salesOverView[i]);
            }
        }
        setSalesOverView(tp);
    }

    return (
        <>
            <div>
                {/* BREAD CRUM ROW */}
                <BreadCrum />
                {/* TODAY SALE ROW */}
                <SalesTabsHeader />
            </div>
            <div>
                <Card>
                    <CardBody>
                        <div className='row'>
                            {/* LEFT SIDE TREE ROW */}
                            <div className='col-xl-3' style={{ borderRight: "1px solid #F2F2F2" }}>
                                <div style={{ borderBottom: "1px solid #F2F2F2" }}>
                                    <label>
                                        <img src={toAbsoluteUrl("/images/loc3.png")}
                                            style={{ width: "20px", height: "20px", textAlign: "center" }}
                                            alt='Company Picture' />
                                        <strong style={{ marginLeft: "10px", color: "#828282" }}>{intl.formatMessage({id: "COMMON.LOCATION_ALL"})}</strong>
                                    </label>
                                </div>
                                {/* TREE */}
                                <LocationTreeView tree={locationTree} selectLocationTreeNode={selectLocationTreeNode}/>
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
                                                placeholder="Search Here"
                                                style={{ paddingLeft: "28px" }}
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
                                            <button className="btn" style={{ background: "rgba(130, 130, 130, 0.05)", color: "#828282" }}>
                                            <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/filter.svg")} width="15px" height="15px" />&nbsp;Filter
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                {/* ALL SUMMARY ROW */}
                                <div className='row ml-2'>
                                    <div className='col-xl-3 sales-data-chip' style={{ background: "#F9F9F9", borderRadius: "5px 0px 0px 5px" }}>
                                        <div className="d-flex">
                                            <div className="dark-gray-color">
                                            <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/location.svg")} width="35px" height="35px" />
                                            </div>
                                            <div className="ml-2">
                                                <span>
                                                    <span className="dark-gray-color"
                                                        style={{ fontWeight: "500" }}>{intl.formatMessage({id: "COMMON.AREA"})}</span>
                                                   <p><strong>{selectedLocation.locationName?selectedLocation.locationName:'All'}</strong></p>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col-xl-3 sales-data-chip' style={{ background: "#F9F9F9" }}>
                                        <div className="d-flex">
                                            <div className="dark-gray-color">
                                                <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/box.svg")} width="15px" height="15px" />
                                            </div>
                                            <div className="ml-2">
                                                <span>
                                                    <span className="dark-gray-color"
                                                        style={{ fontWeight: "500" }}>{intl.formatMessage({id: "SALESORDER.TOTAL_SALES_ORDER"})}</span>
                                                    <p><strong>{salesOverView?.length}</strong></p>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col-xl-3 sales-data-chip' style={{ background: "#F9F9F9", borderRadius: "0px 5px 5px 0px" }}>
                                        <div className="d-flex">
                                            <div className="dark-gray-color">
                                                <img src={toAbsoluteUrl("/images/LineChart.png")} width="24px" height="24px" />
                                            </div>
                                            <div className="ml-2">
                                                <span>
                                                    <span className="dark-gray-color"
                                                        style={{ fontWeight: "500" }}>{intl.formatMessage({id: "SALESORDER.SALES_ORDER_AMOUNT"})}</span>
                                                    <p><strong> {amountFormatterWithoutCurrency(salesOverView.reduce((total, salesOrder) =>
                                                                    total = total + salesOrder.orderAmount , 0
                                                                 ))}</strong></p>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col-xl-3 sales-data-chip' style={{ background: "#F9F9F9" }}>
                                        <button onClick={exportData} className="btn float-right" style={{ background: "white", boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.03)", color: "#828282" }}>
                                            <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/export.svg")} width="15px" height="15px" />
                                        </button>
                                    </div>               
                                </div>
                                {/* TABLE ROW */}
                                <div className='mt-5'>
                                    <SalesOrderList salesOverView={salesOverView} setSingleAll={setSingleAll} singleAll={singleAll} />
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </>
    );
}