import React, { useState, useEffect } from "react";
import axios from "axios";
import InventoryBreadCrum from '../../../../../bread-crum/InventoryBreadCrum';
import InventoryStockHeader from "../../../../header/InventoryStockHeader";
import SalesOrderSubTabs from "../../sub-tabs-header/SalesOrderSubTabsHeader";
import { Card, CardBody } from "../../../../../../../../_metronic/_partials/controls";
import { toAbsoluteUrl } from "../../../../../../../../_metronic/_helpers";
import SVG from "react-inlinesvg";
import SalessBookingList from "./table/SalessBookingList";
import { shallowEqual, useSelector } from "react-redux";
import { useIntl } from "react-intl";
import { showError, showSuccess } from '../../../../../../../pages/Alert';
import * as XLSX from 'xlsx';

export default function SalesBooking() {
    let [singleAll, setSingleAll] = useState([]);
    const intl = useIntl();
    const userId = useSelector((state) => state.auth.user.userId, shallowEqual);
    const companyId = useSelector((state) => state.auth.company, shallowEqual);
    const [searchParams, setSearchParams] = 
        useState({userLoginId:userId, companyId: companyId, 
            isBookingToConfirm: 'Y', 
            status:'', accountingYearId:'', locationId:''});
    const [allStatus, setAllStatus] = useState([]);
    const [allFiscalYear, setAllFiscalYear] = useState([]);
    const [location, setLocation] = useState([]);
    const [bookingList, setBookingList] = useState([]);
    const [searchBookingList, setSearchBookingList] = useState([]);
    const [totalBookingAmount, setTotalBookingAmount] = useState(0.00);
    const [totalBooking, setTotalBooking] = useState(0);
    const [userDepot, setUserDepot] = useState([]);
    const [approvalStatus, setApprovalStatus] = useState('');
    const [selectedLocationName, setSelectedLocationName] = useState('');
    const [searchInputs, setSearchInputs] = useState({});
    const [discountedAmount, setDiscountedAmount] = useState(0.00);
    
    useEffect(() => {
        document.getElementById('pills-inventory-stock-sales-order-tab').classList.add('active');
        document.getElementById('pills-inventory-stock-sales-order-sub-booking-tab').classList.add('active');
        getStatus();
        getFiscalYear();
        getLocation();
        getUserDepot();
        getBookingList(searchParams);        
    }, []);

    useEffect(() => {
        setSearchParams({...searchParams, companyId: companyId});
        setSearchInputs({});
    }, [companyId]);

    useEffect(() => {
        getFiscalYear();
        getLocation();
        getUserDepot();
        getBookingList(searchParams);
        setSearchInputs({});
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
            obj.booking_quantity = row.booking_quantity;
            obj.booking_amount = row.booking_amount.toFixed(2);
            obj.discounted_amount = row.discounted_amount.toFixed(2);
         
            exportData.push(obj);
            setSingleAll([]);
        })
        const workbook = XLSX.utils.book_new();
        const Heading = [
            ["DISTRIBUTOR NAME", "SALES OFFICER NAME","FREE QUANTITY","BOOKING QUANTITY","BOOKING AMOUNT","DISCOUNTED AMOUNT"]
        ];
        const worksheet = XLSX.utils.json_to_sheet(exportData, {origin: 'A2', skipHeader: true});

        XLSX.utils.sheet_add_aoa(worksheet, Heading, {origin: 'A1'});
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, "SalesBookingList.xlsx");
        
    }

    const getStatus = () => {
        const URL = `${process.env.REACT_APP_API_URL}/api/constants/approval-status-except-draft`;
        axios.get(URL).then(response => {
            setAllStatus(response.data.data);
        }).catch(err => {
            //showError(intl.formatMessage({ id: "COMMON.ERROR_STATUS" }));
        });
    }

    const getFiscalYear = () => {        
        const URL = `${process.env.REACT_APP_API_URL}/api/accounting-year/companyWise/${searchParams.companyId}`;
        if (searchParams.companyId) {
        axios.get(URL).then(response => {
            setAllFiscalYear(response.data.data);
        }).catch(err => {
            //showError(intl.formatMessage({ id: "COMMON.ERROR_STATUS" }));
        });}
    }

    const getLocation = () => {
        const URL = `${process.env.REACT_APP_API_URL}/api/depot/area-list/${searchParams.companyId}/${searchParams.userLoginId}`
        axios.get(URL).then(response => {
            if (response.data.success === true) {
                setLocation(response.data.data);
            }            
        });
    }

    const getUserDepot = () => {
        const URL = `${process.env.REACT_APP_API_URL}/api/depot/user-depot/${searchParams.companyId}/${searchParams.userLoginId}`
        axios.get(URL).then(response => {
            setUserDepot(response.data.data);
        });
    }

    const getBookingList = (obj) => { 
        let queryString = '?';
        queryString += 'userLoginId=' + obj.userLoginId;
        queryString += '&companyId=' + obj.companyId;
        queryString += obj.accountingYearId ? '&accountingYearId=' + obj.accountingYearId : '';
        queryString += obj.locationId ? '&locationId=' + obj.locationId : '';
        queryString += obj.semesterId ? '&semesterId=' + obj.semesterId : '';
        queryString += obj.isBookingToConfirm ? '&isBookingToConfirm=' + obj.isBookingToConfirm : '';
        queryString += obj.status ? '&status=' + obj.status : '';
        
        const URL = `${process.env.REACT_APP_API_URL}/api/sales-booking/filtered-list` + queryString;
        axios.get(URL, JSON.stringify(obj), { headers: { "Content-Type": "application/json" } }).then(response => {
            let bookingList = response.data.data.salesBookingListToConfirm;
            let totalBooking = response.data.data.totalBooking;
            let totalBookingAmount = response.data.data.totalBookingAmount;
            setBookingList(bookingList);
            setSearchBookingList(bookingList);
            setTotalBookingAmount(totalBookingAmount);
            setTotalBooking(totalBooking);
            setApprovalStatus(response.data.data.approvalStatus);
            setDiscountedAmount(response.data.data.discountedAmount);
        }).catch(err => {
            showError(intl.formatMessage({id: "COMMON.ERROR_SALESBOOKING_DATA"}));
        });
    }

    const selectStatus = (e) => {       
        let searchObj = { ...searchParams, status: e.target.value };
        setSearchParams(searchObj);
    }
    const selectFiscalYear = (e) => {
        let searchObj = { ...searchParams, accountingYearId: e.target.value };
        setSearchParams(searchObj);
    }
    const selectLocation = (e) => {
        let searchObj = { ...searchParams, locationId: e.target.value };
        setSearchParams(searchObj);
        setSelectedLocationName(e.target.options[e.target.selectedIndex].text);
    }

    const handleSearchChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;
        setSearchInputs(values => ({...values, [name]: value}));
        getSearchListFromBookingList(value);
    }

    const getSearchListFromBookingList = (searchText) => {
        let searchTextValue = searchText.toLowerCase();
        let searchList = [];
        let totalBookingAmount = 0;
        let totalBooking = 0;
        for (let i = 0; i < bookingList.length; i++) {
            let salesOfficerName = bookingList[i].sales_officer_name.toLowerCase();
            let distributorName = bookingList[i].distributor_name.toLowerCase();
            let bookingNo = bookingList[i].booking_no.toLowerCase();
            if (salesOfficerName.includes(searchTextValue) 
            || distributorName.includes(searchTextValue) 
            || bookingNo.includes(searchTextValue)) {
                totalBooking++;
                totalBookingAmount += bookingList[i].booking_amount;
                searchList.push(bookingList[i]);
            }
        }
        setTotalBookingAmount(totalBookingAmount);
        setTotalBooking(totalBooking);
        setSearchBookingList(searchList);
    }

    const handleKeyPressChange = (e) => {
        if (e.keyCode === 32) {
            setSearchBookingList(searchParams);
        } else if (e.keyCode === 8) {
            setSearchBookingList(searchParams);
        }
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
                <SalesOrderSubTabs />
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
                                    <input type="text" className='form-control' name="searchText"
                                        placeholder="Search Here" style={{paddingLeft: "28px"}}
                                        value={searchInputs.searchText || ""}
                                        onChange={handleSearchChange}
                                        //onKeyUp={(e) => handleKeyPressChange(e)}
                                        />
                                </form>
                            </div>

                            {/* SELECTED ROW */}
                            <div className="col-xl-9 d-flex flex-wrap justify-content-end">
                                {/* STATUS DROPDOWN */}
                                <div className="mr-3 ">
                                    <div className="row">
                                        <div className="col-3 mt-3">
                                            <label className="dark-gray-color">Status</label>
                                        </div>
                                        <div className="col-9">
                                           <select className="border-0 form-control" name="status" onChange={(e) => selectStatus(e)}>
                                                <option value="" className="fs-1">All</option>
                                                {
                                                    allStatus.map((status) => (
                                                        <option key={status.code} value={status.code} className="fs-1">{status.name}</option>
                                                    ))
                                                }
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                {/* LOCATION DROPDOWN */}
                                <div className="mr-3">
                                    <div className="row">
                                        <div className="col-3 mt-3">
                                            <label className="dark-gray-color">Location</label>
                                        </div>
                                        <div className="col-9">
                                            <select className="border-0 form-control" name="location" id="location" onChange={(e) => selectLocation(e)}>
                                                <option value="" selected>Select Location</option>
                                                {location && location.map((data) =>
                                                    (<option key={data.id} value={data.id}>{data.name}</option>)
                                                )}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                {/* TIMELINE DROPDOWN */}
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
                            <div className='col-xl-3 sales-data-chip'>
                                <div className="d-flex">
                                    <div className="dark-gray-color">
                                        <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/location.svg")} width="30px" height="30px" />
                                    </div>
                                    <div className="ml-2">
                                        <span>
                                            <span className="dark-gray-color"
                                                style={{ fontWeight: "500" }}>Location</span>
                                            <p><strong>{selectedLocationName!== null && selectedLocationName!== '' ? '('+ selectedLocationName +')' : '(all)'}</strong></p>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* NO. OF BOOKING ROW */}
                            <div className='col-xl-3 sales-data-chip'>
                                <div className="d-flex">
                                    <div className="dark-gray-color">
                                        <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/dark-gray-category.svg")} width="25px" height="25px" />
                                    </div>
                                    <div className="ml-2">
                                        <span>
                                            <span className="dark-gray-color"
                                                style={{ fontWeight: "500" }}>No. Of Booking</span>
                                            <p><strong>{totalBooking !==null ? totalBooking : 0.00} {approvalStatus!== null && approvalStatus !== '' ? '('+ approvalStatus +')' : '(all)'}</strong></p>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* BOOKING AMOUNT ROW */}
                            <div className='col-xl-3 sales-data-chip'>
                                <div className="d-flex">
                                    <div className="dark-gray-color">
                                        <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/amount.svg")} width="25px" height="25px" />
                                    </div>
                                    <div className="ml-2">
                                        <span>
                                            <span className="dark-gray-color"
                                                style={{ fontWeight: "500" }}>Booking Amount</span>
                                            <p><strong>{totalBookingAmount!==null ? totalBookingAmount.toLocaleString('en-US', {minimumFractionDigits: 2}): 0.00}</strong><br />
                                            <span className="text-muted"> {discountedAmount!==null ? discountedAmount.toFixed(2) : 0.00}</span></p>                                            
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* EXPORT ROW */}
                            <div className='col-xl-3 sales-data-chip' style={{ background: "#F9F9F9" }}>
                                <button className="btn float-right export-btn" onClick={handleExport}>
                                    <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/download.svg")} width="15px" height="15px" />
                                </button>
                            </div>
                        </div>

                        {/* TABLE ROW */}
                        <div className='mt-5'>
                            <SalessBookingList setSingleAll={setSingleAll} singleAll={singleAll} data = {searchBookingList}/>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </>
    );
}