import React, {useEffect, useState} from "react";
import InventoryBreadCrum from '../../../../../bread-crum/InventoryBreadCrum';
import InventoryStockHeader from "../../../../header/InventoryStockHeader";
import SalesOrderSubTabs from "../../sub-tabs-header/SalesOrderSubTabsHeader";
import {Card, CardBody} from "../../../../../../../../_metronic/_partials/controls";
import {toAbsoluteUrl} from "../../../../../../../../_metronic/_helpers";
import SVG from "react-inlinesvg";
import InvoiceList from "./table/InvoiceList";
import axios from "axios";
import {shallowEqual, useSelector} from "react-redux";
import * as XLSX from "xlsx";
import {showError} from '../../../../../../../pages/Alert';
import { hasCreateAccess } from "../../../../../../Util";

export default function Invoice() {
    const [singleAll, setSingleAll] = useState([]);
    const selectedCompany = useSelector((state) => state.auth.company, shallowEqual);
    const permissions = useSelector((state) => state.auth.user.permissions, shallowEqual);
    const [searchInputs, setSearchInputs] = useState({});
    const [timelineList, setTimelineList] = useState([]);
    const [distributorList, setDistributorList] = useState([]);
    const [searchedDistributorList, setSearchedDistributorList] = useState([]);
    const [locationList, setLocationList] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState("All");
    const [selectedTimeline, setSelectedTimeline] = useState("All");

    useEffect(() => {
        document.getElementById('pills-inventory-stock-sales-order-tab').classList.add('active');
        document.getElementById('pills-inventory-stock-sales-order-sub-invoices-tab').classList.add('active');
    }, []);

    useEffect(() => {
        setSearchedDistributorList([]);
        getAllFilterListByParams({companyId: selectedCompany});
        getLocationListByCompany({companyId: selectedCompany});
        setSearchInputs({
            companyId: selectedCompany,
            selectedLocationId: '',
            locationIds: [],
            accountingYearId: ''
        });
        setSelectedLocation("All");
        setSelectedTimeline("All");
    }, [selectedCompany]);

    useEffect(() => {
        if (searchInputs.companyId !== undefined) {
            getDistributorListByParams(searchInputs);
        }
    }, [searchInputs]);

    const getDistributorListByParams = (params) => {
        let locationIds = [];
        if (params.selectedLocationId === '') {
            if (params.locationIds.length === 0) {  // no location in dropdown
                return;
            } else { // all location
                locationIds = params.locationIds;
            }
        } else {
            locationIds.push(params.selectedLocationId);
        }

        let queryParams = 'companyId=' + params.companyId;
        queryParams += '&selectedLocationId=' + params.selectedLocationId;
        queryParams += '&locationIds=' + locationIds;
        queryParams += '&accountingYearId=' + params.accountingYearId;
        const URL = `${process.env.REACT_APP_API_URL}/api/delivery-challan/get-distributor-list-with-balance-and-total-challan-no?` + queryParams;
        axios.get(URL).then(response => {
            let list = response.data.data;
            let hasCreatePermission = hasCreateAccess(permissions, "INVOICE");
            list.map(m => {
                m.companyId = selectedCompany;
                m.selectedTimelineName = selectedTimeline;
                m.accountingYearId = searchInputs.accountingYearId;
                m.hasCreatePermission = hasCreatePermission;
            });
            setDistributorList(list);
            setSearchedDistributorList(list);
        }).catch(err => {

        });
    }

    const handleSearchInputsChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;
        setSearchInputs(values => ({...values, [name]: value}));
        if (name === 'selectedLocationId') {
            setSelectedLocation(event.target.options[event.target.selectedIndex].text);
            let locList = [];
            if (value === '') { // select all
                let ids = locationList.map(l => {
                    return l.id
                });
                locList = [...ids];
            } else { // select one item
                locList.push(value);
            }
            setSearchInputs(values => ({...values, [name]: value, locationIds: locList}));
        } else if (name === 'accountingYearId') {
            setSelectedTimeline(event.target.options[event.target.selectedIndex].text);
            setSearchInputs(values => ({...values, [name]: value}));
        }
    }

    const getAllFilterListByParams = (params) => {
        let queryParams = 'companyId=' + params.companyId;
        const URL = `${process.env.REACT_APP_API_URL}/api/sales-invoice/get-list-page-all-filter-list?` + queryParams;
        axios.get(URL).then(response => {
            let dataMap = response.data.data;
            setTimelineList(dataMap.accountingYearList);
        }).catch(err => {

        });
    }

    const getLocationListByCompany = (params) => {
        let queryParams = 'companyId=' + params.companyId;
        const URL = `${process.env.REACT_APP_API_URL}/api/location/get-login-user-location-list?` + queryParams;
        axios.get(URL).then(response => {
            let list = response.data.data;
            let ids = list.map(l => {
                return l.id
            });
            setLocationList(list);
            setSearchInputs(values => ({...values, selectedLocationId: '', locationIds: ids}));
        }).catch(err => {

        });
    }

    const handleSearchChange = (event) => {
        let value = event.target.value;
        getSearchList(value);
    }
    const getSearchList = (searchText) => {
        let searchTextValue = searchText.toLowerCase();
        let tp = [];
        for (let i = 0; i < searchedDistributorList.length; i++) {
            let distributor_name = searchedDistributorList[i].distributor_name.toLowerCase();
           
            if (distributor_name.includes(searchTextValue)) {
                tp.push(searchedDistributorList[i]);
            }
        }
        setDistributorList(tp);
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
            obj.distributor_name = row.distributor_name;
            obj.ledger_balance = row.ledger_balance;
            obj.number_of_challan = row.number_of_challan;
            exportData.push(obj);
            setSingleAll([]);
        })
        const workbook = XLSX.utils.book_new();
        const Heading = [
            ["DISTRIBUTOR NAME", "BALANCE", "TOTAL CHALLAN"]
        ];
        const worksheet = XLSX.utils.json_to_sheet(exportData, {origin: 'A2', skipHeader: true});

        // creating sheet and adding data from 2nd row of column A.
        // Leaving first row to add Heading
        XLSX.utils.sheet_add_aoa(worksheet, Heading, {origin: 'A1'});
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        for (let i = 0; i < Heading.length; i++) {
            worksheet[letters.charAt(i).concat('1')].s = {
                font: {
                    name: 'arial',
                    sz: 11,
                    bold: true,
                    color: "#F2F2F2"
                },
            }
        }
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, "distributor list for invoice create.xlsx");
    }


    return (
        <>
            {/* BREAD CRUM ROW */}
            <div>
                <InventoryBreadCrum/>
            </div>

            {/* HEADER ROW */}
            <div>
                {<InventoryStockHeader showStockData={false}/>}
            </div>

            {/*SUB TABS ROW */}
            <div>
                <SalesOrderSubTabs/>
            </div>

            {/* MAIN CARD ROW */}
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
                                <div className="mr-3">
                                        <div className="row">
                                            <div className="col-3 mt-3">
                                                <label className="dark-gray-color">Location</label>
                                            </div>
                                            <div className="col-9">
                                                <select className="form-control border-0" name="selectedLocationId"
                                                        value={searchInputs.selectedLocationId || ""}
                                                        onChange={handleSearchInputsChange}>
                                                    <option value="">Select Location</option>
                                                    {locationList.map((c) => (
                                                        <option key={c.id} value={c.id}>{c.name}</option>))}
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
                                              <select className="form-control border-0" name="accountingYearId"
                                                      value={searchInputs.accountingYearId || ""}
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
                            {/* NO. OF BOOKING ROW */}
                            <div className='col-xl-3 sales-data-chip'>
                                <div className="d-flex">
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
                                </div>
                            </div>
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

                            {/* EXPORT ROW */}
                            <div className='col-xl-6 sales-data-chip' style={{background: "#F9F9F9"}}>
                                <button className="btn float-right export-btn" onClick={handleExport}>
                                    <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/download.svg")} width="15px"
                                         height="15px"/>
                                </button>
                            </div>
                        </div>

                        {/* TABLE ROW */}
                        <div className='mt-5'>
                            <InvoiceList setSingleAll={setSingleAll} singleAll={singleAll}
                                         distributorList={distributorList}/>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </>
    );
}