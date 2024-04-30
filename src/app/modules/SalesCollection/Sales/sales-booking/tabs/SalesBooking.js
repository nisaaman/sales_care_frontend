import React , {useState, useEffect} from "react";
import axios from "axios";
import { useIntl } from "react-intl";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../../_metronic/_helpers";
import { SalesBookingList } from "../table/SalesBookingList";
import {Card, CardBody} from "../../../../../../_metronic/_partials/controls";
import { useHistory } from 'react-router-dom';
import {showError} from '../../../../../pages/Alert';
import LocationTreeView from '../../../CommonComponents/LocationTreeView';
import { BreadCrum } from "../../common/BreadCrum";
import { shallowEqual, useSelector } from "react-redux";
import SalesTabsHeader from "../../common/SalesTabsHeader"
import * as XLSX from 'xlsx';

export function SalesBooking(props) {
    const selectedCompany = useSelector((state) => state.auth.company, shallowEqual);
    const userId = useSelector((state) => state.auth.user.userId, shallowEqual);
    let history = useHistory();
    let [singleAll, setSingleAll] = useState([]);
    const intl = useIntl();
    const [sessionData, setSessionData] = useState({userLoginId: userId, companyId: selectedCompany});
    const [searchParams, setSearchParams] = useState({...sessionData, locationId: '', semesterId: '', accountingYearId: ''});
    //const [locationId, setLocationId] = useState();
    const [bookingList, setBookingList] = useState([]);
    const [bookingSummary, setBookingSummary] = useState(0.00);
    const [totalBookingQuantity, setTotalBookingQuantity] = useState();
    const [locationTree, setLocationTree] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState({});
    const [allFiscalYear, setAllFiscalYear] = useState([]);
    const [discountedAmount, setDiscountedAmount] = useState(0.00);
    const [freeQuantity, setFreeQuantity] = useState(0.00);
    const [rendered, setRendered] = useState(false);
    const [searchedBookingList, setSearchedBookingList] = useState([]);

    useEffect(() => {
        document.getElementById('pills-sales-booking-tab').classList.add('active')
    }, []);

    useEffect(() => {
        setSearchParams({...searchParams, companyId: selectedCompany});
    }, [selectedCompany]);

    useEffect(() => {
        if(rendered){
            getBookingList(searchParams);
            getFiscalYear(searchParams);
            getLocationTreeList(searchParams);
        }
        
        if( ! rendered ) {
            setRendered(true);
        }        
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
            obj.distributor_name = row.distributor_name;
            obj.sales_officer_name =row.sales_officer_name;
            obj.booking_no = row.booking_no;
            obj.approval_status =row.approval_status;
            obj.booking_quantity = row.booking_quantity;
            obj.booking_amount = row.booking_amount.toFixed(2);
            obj.free_quantity = row.free_quantity;
            obj.discounted_amount = row.discounted_amount.toFixed(2);
         
            exportData.push(obj);
            setSingleAll([]);
        })
        const workbook = XLSX.utils.book_new();
        const Heading = [
            ["DISTRIBUTOR NAME", "SALES OFFICER NAME", "BOOKING NO", "BOOKING STATUS", "BOOKING QUANTITY", "BOOKING AMOUNT", "FREE QUANTITY", "DISCOUNTED AMOUNT"]
        ];
        const worksheet = XLSX.utils.json_to_sheet(exportData, {origin: 'A2', skipHeader: true});

        XLSX.utils.sheet_add_aoa(worksheet, Heading, {origin: 'A1'});
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, "SalesBookingList.xlsx");
    }

    const getBookingList = (obj) => {
        let queryString = '?';
        queryString += 'userLoginId=' + obj.userLoginId;
        queryString += '&companyId=' + obj.companyId;
        queryString += '&accountingYearId=' + obj.accountingYearId;
        queryString += obj.locationId ? '&locationId=' + obj.locationId : '';
        queryString += obj.semesterId ? '&semesterId=' + obj.semesterId : '';
        const URL = `${process.env.REACT_APP_API_URL}/api/sales-booking/filtered-list` + queryString;
        axios.get(URL, JSON.stringify(obj), { headers: { "Content-Type": "application/json" } }).then(response => {            
            if(response.data.data.salesBookingList.length > 0) {
                let bookingList = response.data.data.salesBookingList;
                let bookingSummary = response.data.data.bookingSummary;
                let totalBookingQuantity = response.data.data.totalBookingQuantity;
                setBookingList(bookingList);
                setBookingSummary(bookingSummary);
                setTotalBookingQuantity(totalBookingQuantity);
                setDiscountedAmount(response.data.data.discountedAmount);
                setFreeQuantity(response.data.data.freeQuantity);
                setSearchedBookingList(bookingList);
            }
            else {         
                setBookingList([]);
                setSearchedBookingList([]);
                setBookingSummary(0);
                setTotalBookingQuantity(0);
                setDiscountedAmount(0);
                setFreeQuantity(0);
                //showError(intl.formatMessage({id: "COMMON.ERROR_SALESBOOKING_DATA"}));
            }            
        }).catch(err => {
            showError(intl.formatMessage({id: "COMMON.ERROR_SALESBOOKING_DATA"}));
        });
    }

    const getLocationTreeList = (param) => {
        const URL = `${process.env.REACT_APP_API_URL}/api/location-tree/locationTree/${param.userLoginId}/${param.companyId}`;
        if (param.companyId) { 
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
            let searchObj={...searchParams,locationId:node.id.toString()};
            setSearchParams(searchObj);
            setSelectedLocation(node);
            //getBookingList(searchObj);
        }
        
    }

    const getFiscalYear = () => {        
        const URL = `${process.env.REACT_APP_API_URL}/api/accounting-year/companyWise/${searchParams.companyId}`;
        if (searchParams.companyId) {
        axios.get(URL).then(response => {
            setAllFiscalYear(response.data.data);
        }).catch(err => {
            showError(intl.formatMessage({ id: "COMMON.ERROR_STATUS" }));
        });}
    }

    const selectFiscalYear = (e) => {
        let searchObj = { ...searchParams, accountingYearId: e.target.value };
        setSearchParams(searchObj);
    }
    const handleKeyPressChange = (e) => {
        if (e.keyCode === 32) {
            getBookingList(searchParams);
        } else if (e.keyCode === 8) {
            getBookingList(searchParams);
        }
    }

    const handleSearchChange = (event) => {
        let value = event.target.value;
        getSearchList(value);
    }
    const getSearchList = (searchText) => {
        let searchTextValue = searchText.toLowerCase();
        let tp = [];
        for (let i = 0; i < bookingList.length; i++) {
            let salesOfficerName = bookingList[i].sales_officer_name.toLowerCase();
            let distributorName = bookingList[i].distributor_name.toLowerCase();
            let bookingNo = bookingList[i].booking_no.toLowerCase();
            let bookingApprovalStatus = bookingList[i].approval_status.toLowerCase();
            if (salesOfficerName.includes(searchTextValue)
                || distributorName.includes(searchTextValue)
                || bookingNo.includes(searchTextValue)
                || bookingApprovalStatus.includes(searchTextValue)
            ) {
                tp.push(bookingList[i]);
            }
        }
        setSearchedBookingList(tp);
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
                        <div>
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
                                                    placeholder="Search Here"
                                                    style={{ paddingLeft: "28px" }}
                                                    //onKeyUp={(e) => handleKeyPressChange(e)}
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
                                                        <select className="border-0 form-control" name="fiscalYear" onChange={(e)=>selectFiscalYear(e)}>
                                                            <option value="" className="fs-1">Select Fiscal Year</option>
                                                            {
                                                                allFiscalYear.map((fiscalYear)=>(
                                                                    <option key={fiscalYear.id} value={fiscalYear.id}
                                                                        className="fs-1">{fiscalYear.fiscalYearName}</option>
                                                                ))
                                                            }
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <button className="btn filter-btn">
                                                    <i className="bi bi-funnel"></i>&nbsp; {intl.formatMessage({id: "COMMON.FILTER"})}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    {/* ALL SUMMARY ROW */}
                                    <div className='row ml-2'>
                                        <div className='col-xl-3 sales-data-chip' style={{ borderRadius: "5px 0px 0px 5px" }}>
                                            <div className="d-flex">
                                                <div className="dark-gray-color">
                                                    <i className="bi bi-geo-alt"></i>
                                                </div>
                                                <div className="ml-2">
                                                    <span>
                                                        <span className="dark-gray-color"
                                                            style={{ fontWeight: "500" }}>{intl.formatMessage({id: "LOCATION.AREA"})}</span>
                                                        <p><strong>{selectedLocation.locationName?selectedLocation.locationName:'All'}</strong></p>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-xl-3 sales-data-chip'>
                                            <div className="d-flex">
                                                <div className="dark-gray-color">
                                                    <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/box.svg")} width="15px" height="15px" />
                                                </div>
                                                <div className="ml-2">
                                                    <span>
                                                        <span className="dark-gray-color"
                                                            style={{ fontWeight: "500" }}>{intl.formatMessage({id: "SALES_BOOKING.TOTAL_BOOKING"})} (QTY)</span>
                                                        <p><strong>{totalBookingQuantity !==null ? totalBookingQuantity :0 + freeQuantity!==null ? freeQuantity : 0}</strong><br/>                                                        
                                                            {/* <span className="text-muted">{freeQuantity!==null ? freeQuantity : 0}+</span> */}
                                                        </p>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-xl-3 sales-data-chip' style={{ borderRadius: "0px 5px 5px 0px" }}>
                                            <div className="d-flex">
                                                <div className="dark-gray-color">
                                                    <img src={toAbsoluteUrl("/images/LineChart.png")} width="24px" height="24px" />
                                                </div>
                                                <div className="ml-2">
                                                    <span>
                                                        <span className="dark-gray-color"
                                                            style={{ fontWeight: "500" }}>{intl.formatMessage({id: "SALES_BOOKING.BOOKING_AMOUNT"})}</span>
                                                        <p>
                                                            <strong> {bookingSummary !== null? bookingSummary.toLocaleString('en-US', {minimumFractionDigits: 2}): 0.00}</strong><br/>
                                                            <span className="text-muted"> -{discountedAmount!==null ? discountedAmount.toFixed(2) : 0.00}</span>
                                                        </p>
                                                        
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-xl-3 sales-data-chip' style={{ background: "#F9F9F9" }}>
                                            <button className="btn float-right export-btn" onClick={handleExport}>
                                                <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/export.svg")} width="15px" height="15px" />
                                            </button>
                                        </div>
                                    </div>
                                    {/* TABLE ROW */}
                                    <div className='mt-5'>
                                        <SalesBookingList setSingleAll = {setSingleAll} singleAll={singleAll} bookingList = {searchedBookingList}/>
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