import React, { useState, useEffect, useMemo } from "react";
import InventoryBreadCrum from '../../../../../bread-crum/InventoryBreadCrum';
import InventoryStockHeader from "../../../../header/InventoryStockHeader";
import SalesOrderSubTabs from "../../sub-tabs-header/SalesOrderSubTabsHeader";
import { Card, CardBody } from "../../../../../../../../_metronic/_partials/controls";
import { toAbsoluteUrl } from "../../../../../../../../_metronic/_helpers";
import SVG from "react-inlinesvg";
import SalesOrderList from "./table/SalesOrderList";
import { shallowEqual, useSelector } from "react-redux";
import axios from "axios";
import { useIntl } from "react-intl";
import { showError, showSuccess } from '../../../../../../../pages/Alert';

export default function SalesOrderTab() {

    const companyId = useSelector((state) => state.auth.company, shallowEqual);
    const userLoginId = useSelector((state) => state.auth.user.userId, shallowEqual);
    const intl = useIntl();

    const [accountingYearId, setAccountingYearId] = useState('');
    const [semesterId, setSemesterId] = useState('');
    const [locationId, setLocationId] = useState('');
    const [sessionData, setSessionData] = useState({});
    //const [searchParams, setSearchParams] = useState({userLoginId: userLoginId, companyId: companyId, locationId: '', semesterId: semesterId});
    const searchParams = useMemo(() => {
        return {userLoginId: userLoginId, companyId: companyId, locationId: locationId, accountingYearId: accountingYearId, emesterId: semesterId}
    },[userLoginId,companyId,locationId,accountingYearId,semesterId]);

    const [salesBookingDetailsList, setSalesBookingDetailsList] = useState([]);
    const [locationList, setLocationList] = useState([]);
    const [allAccountingYear, setAllAccountingYear] = useState([]);
    const [locationName, setLocationName] = useState('');

    let [singleAll, setSingleAll] = useState([]);
    useEffect(() => {
        document.getElementById('pills-inventory-stock-sales-order-tab').classList.add('active');
        document.getElementById('pills-inventory-stock-sales-order-sub-order-tab').classList.add('active');
        //getCurrentAccountingYear(companyId);
        getAllLocationOfACompany(companyId);
        getAccountingYear(companyId)
    }, [companyId]);

    useEffect(() => {
        getSalesBookingListForSalesOrderCreation(searchParams);
    },[searchParams]);
    
    // useEffect(() => {
    //     setSearchParams({...searchParams, companyId:companyId});
    // },[companyId]);

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

    const getCurrentAccountingYear = (companyId) => {
        const URL = `${process.env.REACT_APP_API_URL}/api/accounting-year/current/${companyId}`;
        axios.get(URL).then((response) => {
            setAccountingYearId(response.data.data);
            
            let searchObj = { ...sessionData, accountingYearId: response.data.data};
            //setSearchParams(searchObj);
        }).catch();
    }

    const getAllLocationOfACompany = (companyId) => {
        const param = "?companyId="+companyId;
        const URL = `${process.env.REACT_APP_API_URL}/api/location/get-login-user-location-list`+param;

        axios.get(URL).then(response => {
            //console.log("Loc",response.data.data)
            setLocationList(response.data.data);
        }).catch(err => {
            
        });
    }

    const setLocationData = (event) => {

        let name = event.target.name;
        let value = event.target.value;
        var index = event.nativeEvent.target.selectedIndex;

        if (value !== "") {
            setLocationName(event.nativeEvent.target[index].text);
        } else {
            setLocationName("All");
        }
        //setLocationName(event.target.name);
        setLocationId(value);
       
        //setSearchParams(values => ({...values, locationId: value}));
    }

    const setAccountingYearData = (event) => {

        let name = event.target.name;
        let value = event.target.value;
        setAccountingYearId(event.target.value)
        //setSearchParams(values => ({...values, accountingYearId: value}));
    }

    const getSalesBookingListForSalesOrderCreation = (params) => {
        let queryString = "?";
        queryString += "companyId="+params.companyId;
        queryString += params.accountingYearId ? "&accountingYearId="+params.accountingYearId : "";
        queryString += params.semesterId ? "&semesterId="+params.semesterId : "";
        queryString += "&userLoginId="+params.userLoginId;
        queryString += params.locationId ? "&locationId="+params.locationId : "";

        const URL = `${process.env.REACT_APP_API_URL}/api/sales-order/creation-list`+queryString;
        if (companyId) {
          
        axios.get(URL).then(response => {
            setSalesBookingDetailsList(response.data.data);
            if(response.data.data === "") {
                showError(intl.formatMessage({ id: "COMMON.ERROR" }));
            }  
        }).catch(err => {
            showError(intl.formatMessage({ id: "COMMON.ERROR" }));
        });  
        }
    }

    const handleExport = () => {
        const exportData = [...singleAll]
    }
    const handleKeyPressChange = (e) => {
        if (e.keyCode === 32) {
            getSalesBookingListForSalesOrderCreation(searchParams);
        } else if (e.keyCode === 8) {
            getSalesBookingListForSalesOrderCreation(searchParams);
        }
    }
    const handleSearchChange = (event) => {
        let value = event.target.value;
        getSearchList(value);
    }
    const getSearchList = (searchText) => {
        let searchTextValue = searchText.toLowerCase();
        let tp = [];
        for (let i = 0; i < salesBookingDetailsList.length; i++) {
            let bookingNo = salesBookingDetailsList[i].bookingNo.toLowerCase();
            let distributorName = salesBookingDetailsList[i].distributorName.toLowerCase();
            let salesOfficerName = salesBookingDetailsList[i].salesOfficerName.toLowerCase();
            if (bookingNo.includes(searchTextValue)
                ||distributorName.includes(searchTextValue)
                ||salesOfficerName.includes(searchTextValue)) {
                tp.push(salesBookingDetailsList[i]);
            }
        }
        setSalesBookingDetailsList(tp);
    }
    return (
        <>
            {/* BREAD CRUM ROW */}
            <div>
                <InventoryBreadCrum />
            </div>
            
            {/* HEADER ROW */}
            <div>
               <InventoryStockHeader showStockData={false}/>
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
                                    <input type="text" className="form-control" name="searchText"
                                    placeholder="Search Here" style={{ paddingLeft: "28px" }}
                                    onChange={handleSearchChange}
                                    onKeyUp={(e) => handleKeyPressChange(e)} 
                                    />
                                </form>
                            </div>

                            {/* SELECTED ROW */}
                            <div className="col-xl-9 d-flex flex-wrap justify-content-end">
                                    {/* LOCATION DROPDOWN */}
                                    <div className="mr-3">
                                        <div className="row">
                                            <div className="col-3 mt-3">
                                                <label className="dark-gray-color">Location</label>
                                            </div>
                                            <div className="col-9">
                                                <select className="border-0 form-control" onChange={setLocationData}>
                                                    <option value="" selected>Select Location </option>
                                                        {locationList.map((location) => (
                                                        <option key={location.name} value={location.id}>
                                                                {location.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    {/* TIMELINE DROPDOWN */}
                                     <span className="mr-3">
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
                                    </span> 
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
                                            <p><strong>{locationName}</strong></p>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* NO. OF BOOKING ROW */}
                            <div className='col-xl-3 sales-data-chip'>
                                {/* <div className="d-flex">
                                    <div className="dark-gray-color">
                                        <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/dark-gray-category.svg")} width="25px" height="25px" />
                                    </div>
                                    <div className="ml-2">
                                        <span>
                                            <span className="dark-gray-color"
                                                style={{ fontWeight: "500" }}>No. Of Sales Order</span>
                                            <p><strong>50(Pending)</strong></p>
                                        </span>
                                    </div>
                                </div> */}
                            </div>

                            {/* BOOKING AMOUNT ROW */}
                            <div className='col-xl-3 sales-data-chip'>
                                {/* <div className="d-flex">
                                    <div className="dark-gray-color">
                                        <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/amount.svg")} width="25px" height="25px" />
                                    </div>
                                    <div className="ml-2">
                                        <span>
                                            <span className="dark-gray-color"
                                                style={{ fontWeight: "500" }}>Booking Amount</span>
                                            <p><strong>5,168,000</strong></p>
                                        </span>
                                    </div>
                                </div> */}
                            </div>

                            {/* EXPORT ROW */}
                            {/* <div className='col-xl-3 sales-data-chip' style={{ background: "#F9F9F9" }}>
                                <button className="btn float-right export-btn" onClick={handleExport}>
                                    <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/download.svg")} width="15px" height="15px" />
                                </button>
                            </div> */}
                        </div>

                        {/* TABLE ROW */}
                        <div className='mt-5'>
                            <SalesOrderList setSingleAll={setSingleAll} singleAll={singleAll} 
                                            salesBookingDetailsList={salesBookingDetailsList} 
                                            companyId= {companyId}
                                            accountingYearId={accountingYearId}
                                            semesterId={semesterId} />
                        </div>
                    </CardBody>
                </Card>
            </div>
        </>
    );
}