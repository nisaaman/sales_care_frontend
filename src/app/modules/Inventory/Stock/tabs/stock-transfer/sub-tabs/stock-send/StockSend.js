import React, {useEffect, useMemo, useState} from "react";
import InventoryBreadCrum from '../../../../../bread-crum/InventoryBreadCrum';
import InventoryStockHeader from "../../../../header/InventoryStockHeader";
import StockTransferSubTabs from "../../sub-tabs-header/StockTransferSubTabs";
import {Card, CardBody} from "../../../../../../../../_metronic/_partials/controls";
import {toAbsoluteUrl} from "../../../../../../../../_metronic/_helpers";
import SVG from "react-inlinesvg";
import StockSendList from "./table/StockSendList";
import {useHistory} from "react-router-dom";
import {shallowEqual, useSelector} from "react-redux";
import { showError } from '../../../../../../../pages/Alert';
import axios from "axios";
import * as XLSX from 'xlsx';
import { hasCreateAccess } from '../../../../../../Util';

export default function StockSend() {

    //const companyId = useSelector((state) => state.auth.company, shallowEqual);
    const permissions = useSelector((state) => state.auth.user.permissions, shallowEqual);
    const userLoginId = useSelector((state) => state.auth.user.userId, shallowEqual);
    const selectedCompany = useSelector((state) => state.auth.company, shallowEqual);
    const [accountingYearId, setAccountingYearId] = useState('');
    const searchParams = useMemo(() => {
        return {userLoginId: userLoginId, companyId: selectedCompany, accountingYearId: accountingYearId}
    },[userLoginId, selectedCompany, accountingYearId]);
    let [singleAll, setSingleAll] = useState([]);
    const routerHistory = useHistory();

    const [selectedLocation, setSelectedLocation] = useState("All");
    const [selectedTimeline, setSelectedTimeline] = useState("All");
    const [searchInputs, setSearchInputs] = useState({});
    const [timelineList, setTimelineList] = useState([]);
    const [locationList, setLocationList] = useState([]);
    const [invTransDetails, setInvTransDetails] = useState([]);
    const [invTransDetailsSearch, setInvTransDetailsSearch] = useState([]);
    
    useEffect(() => {
        document.getElementById('pills-inventory-stock-stock-transfer-tab').classList.add('active');
        document.getElementById('pills-inventory-stock-stock-transfer-stock-send-tab').classList.add('active');
    }, []);

    useEffect(() => {
        getAllFilterListByParams({companyId: selectedCompany});
        //getCurrentAccountingYear(selectedCompany);
        setSearchInputs({
            companyId: selectedCompany,
            locationId: '',
            accountingYearId: accountingYearId
        });
        setSelectedLocation("All");
        setSelectedTimeline("All");
        
    }, [selectedCompany]);

    
    useEffect(() => {
        getInvTransferDetails(searchParams);
    },[searchParams]);

    const getAllFilterListByParams = (params) => {
        let queryParams = 'companyId=' + params.companyId;
        const URL = `${process.env.REACT_APP_API_URL}/api/sales-invoice/get-list-page-all-filter-list?` + queryParams;
        axios.get(URL).then(response => {
            let dataMap = response.data.data;
            setTimelineList(dataMap.accountingYearList);
            setLocationList(dataMap.locationList);
        }).catch(err => {

        });
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
            obj.depotName = row.depotName;
            obj.transferDate =row.transferDate;
            obj.depotIncharge = row.depotIncharge;
            obj.designation = row.designation;
            obj.transferNo = row.transferNo;
            obj.quantity = row.quantity;
        
            exportData.push(obj);
            //setSingleAll([]);
        })
        const workbook = XLSX.utils.book_new();
        const Heading = [
            ["DEPOT NAME", "TRANSFER DATE","DEPOT IN CHARGE","DESIGNATION","TRANSFER NO","QUANTITY"]
        ];
        const worksheet = XLSX.utils.json_to_sheet(exportData, {origin: 'A2', skipHeader: true});

        XLSX.utils.sheet_add_aoa(worksheet, Heading, {origin: 'A1'});
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, "StockSendList.xlsx");
    }

    const handleNewStockSend = () => {
        routerHistory.push("/new-stock-send", {companyId : selectedCompany, userLoginId:userLoginId})
    }

    const getInvTransferDetails = (params) => {
    
        let queryString = "?";
        queryString += "&companyId="+params.companyId;
        queryString += params.accountingYearId ? "&accountingYearId="+params.accountingYearId : '';

        const URL = `${process.env.REACT_APP_API_URL}/api/inv-transfer/details/data`+queryString;
        axios.get(URL).then((response) => {
            setInvTransDetails(response.data.data);
            setInvTransDetailsSearch(response.data.data);
            
        }).catch();
    }

    const handleSearchInputsChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;
        setSearchInputs(values => ({...values, [name]: value}));
        if (name === 'locationId') {
            setSelectedLocation(event.target.options[event.target.selectedIndex].text);
        } else if (name === 'accountingYearId') {
            setAccountingYearId(value);
            setSelectedTimeline(event.target.options[event.target.selectedIndex].text);
            
        }
    }
    const handleKeyPressChange = (e) => {
        if (e.keyCode === 32) {
            getInvTransferDetails(searchParams);
        } else if (e.keyCode === 8) {
            getInvTransferDetails(searchParams);
        }
    }
    const handleSearchChange = (event) => {
        let value = event.target.value;
        getSearchList(value);
    }
    const getSearchList = (searchText) => {
        let searchTextValue = searchText.toLowerCase();
        let tp = [];
        console.log("invTransDetailsSearch",invTransDetailsSearch);
        for (let i = 0; i < invTransDetailsSearch.length; i++) {
            let designation = invTransDetailsSearch[i].designation.toLowerCase();
            let depotIncharge = invTransDetailsSearch[i].depotIncharge.toLowerCase();
            let depotName = invTransDetailsSearch[i].depotName.toLowerCase();
            let transferNo = invTransDetailsSearch[i].transferNo.toLowerCase();
            if (depotIncharge.includes(searchTextValue)
                ||designation.includes(searchTextValue)
                ||depotName.includes(searchTextValue)
                ||transferNo.includes(searchTextValue)
                ) {
                tp.push(invTransDetailsSearch[i]);
            }
        }
        setInvTransDetails(tp);
    }
    return (
        <>
            {/* BREAD CRUM ROW */}
            <div>
                <InventoryBreadCrum/>
            </div>

            {/* HEADER ROW */}
            <div>
                <InventoryStockHeader showStockData={true}/>
            </div>

            {/*SUB TABS ROW */}
            <div>
                <StockTransferSubTabs/>
            </div>

            {/* MAIN CARD ROW */}
            <div className="mb-n5">
                <Card>
                    <CardBody>
                        <span className="text-muted mt-3 display-inline-block">
                        Source Location authorized responsible who has permission to access the feature or Depot In-charge can create the Transfer.
                        </span>
                        {hasCreateAccess(permissions, 'STOCK_SEND') &&
                        <span>
                            <button onClick={handleNewStockSend}
                                    className="float-right btn light-blue-bg dark-blue-color rounded">
                                <SVG className="mr-2" src={toAbsoluteUrl("/media/svg/icons/project-svg/blue-add.svg")}/>
                                Stock Send
                            </button>
                        </span>
}
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
                                <div style={{position: "absolute", padding: "7px", marginTop: "3px"}}>
                                    <img src={toAbsoluteUrl("/images/search.png")} width="20px" height="20px"/>
                                </div>
                                <form className="form form-label-right">
                                    <input type="text" className="form-control" name="searchText"
                                    placeholder="Search Here" style={{ paddingLeft: "28px" }}
                                    onChange={handleSearchChange}
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
                                                <select className="border-0 form-control" name="accountingYearId"
                                                        
                                                        onChange={handleSearchInputsChange}>
                                                    <option value="">Select Fiscal Year</option>
                                                    {timelineList.map((c) => (
                                                        <option key={c.id} value={c.id}>{c.fiscal_year_name}</option>))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                {/* FILTER BUTTON ROW */}
                            <div>
                                <button className="btn filter-btn float-right">
                                    <i className="bi bi-funnel" style={{fontSize: "11px"}}></i>&nbsp;Filter
                                </button>
                            </div>
                            </div>
                        </div>

                        {/* ALL SUMMARY ROW */}
                        <div className="row">
                            {/* NO. OF LOCATION ROW */}
                            
                            <div className='col-xl-3 sales-data-chip'>
                                <div className="d-flex">
                                    <div className="dark-gray-color">
                                        <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/history.svg")}
                                             width="30px" height="30px"/>
                                    </div>
                                    <div className="ml-2">
                                        <span>
                                            <span className="dark-gray-color"
                                                  style={{fontWeight: "500"}}>Timeline</span>
                                            <p><strong>{selectedTimeline}</strong></p>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* NO. OF TRANSFER ROW */}
                            <div className='col-xl-4 sales-data-chip'>
                                <div className="d-flex">
                                    <div className="dark-gray-color">
                                        <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/history.svg")}
                                             width="25px" height="25px"/>
                                    </div>
                                    <div className="ml-2">
                                        <span>
                                            <span className="dark-gray-color"
                                                  style={{fontWeight: "500"}}>No. Of Transfer</span>
                                            <p><strong>{invTransDetails?.length}</strong></p>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className='col-xl-3 sales-data-chip'>
                                {/* <div className="d-flex">
                                    <div className="dark-gray-color">
                                        <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/location.svg")}
                                             width="30px" height="30px"/>
                                    </div>
                                    <div className="ml-2">
                                        <span>
                                            <span className="dark-gray-color"
                                                  style={{fontWeight: "500"}}>Location</span>
                                            <p><strong>{selectedLocation}</strong></p>
                                        </span>
                                    </div>
                                </div> */}
                            </div>

                            {/* EXPORT ROW */}
                            <div className='col-xl-2 sales-data-chip' style={{background: "#F9F9F9"}}>
                                <button className="btn float-right export-btn" onClick={handleExport}>
                                    <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/download.svg")} width="15px"
                                         height="15px"/>
                                </button>
                            </div>
                        </div>

                        {/* TABLE ROW */}
                        <div className='mt-5'>
                            <StockSendList setSingleAll={setSingleAll} 
                            singleAll={singleAll} invTransDetails={invTransDetails}/>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </>
    );
}