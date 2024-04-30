import React, { useState, useEffect } from "react";
import axios from "axios";
import InventoryBreadCrum from '../../../../../bread-crum/InventoryBreadCrum';
import InventoryStockHeader from "../../../../header/InventoryStockHeader";
import SalesOrderSubTabs from "../../sub-tabs-header/SalesOrderSubTabsHeader";
import { Card, CardBody } from "../../../../../../../../_metronic/_partials/controls";
import { toAbsoluteUrl } from "../../../../../../../../_metronic/_helpers";
import SVG from "react-inlinesvg";
import DeliveryChallanList from "./table/DeliveryChallanList";
import { shallowEqual, useSelector } from "react-redux";
import { useIntl } from "react-intl";
import { showError, showSuccess } from '../../../../../../../pages/Alert';
import { ColorLensOutlined } from "@material-ui/icons";
import * as XLSX from 'xlsx';


export default function DeliveryChallan() {
    let [singleAll, setSingleAll] = useState([]);
    const intl = useIntl();
    const userId = useSelector((state) => state.auth.user.userId, shallowEqual);
    const companyId = useSelector((state) => state.auth.company, shallowEqual);
    const [searchParams, setSearchParams] =
        useState({
            userLoginId: userId, companyId: companyId,
            accountingYearId: '', locationId: ''
        });
    const [allFiscalYear, setAllFiscalYear] = useState([]);
    const [location, setLocation] = useState([]);
    const [selectedLocationName, setSelectedLocationName] = useState('');
    const [distributorList, setDistributorList] = useState([]);
    const [deliverableQuantity, setDeliverableQuantity] = useState(0);
    const [totalOrder, setTotalSalesOrder] = useState(0);
    const [searchText, setSearchText] = useState("");
    const [searchedDistributorList, setSearchedDistributorList] = useState([]);
    const [rendered, setRendered] = useState(false);
    
    useEffect(() => {
        document.getElementById('pills-inventory-stock-sales-order-tab').classList.add('active');
        document.getElementById('pills-inventory-stock-sales-order-sub-delivery-challan-tab').classList.add('active');
    }, []);

    useEffect(() => {
        setSearchParams({ ...searchParams, companyId: companyId });
    }, [companyId]);

    useEffect(() => {
        if(rendered){
            getFiscalYear();
            getLocation();
            getDistributorList(searchParams);
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
            obj.order_count = row.order_count;           
            exportData.push(obj);
            setSingleAll([]);
        })
        const workbook = XLSX.utils.book_new();
        const Heading = [
            ["Distributor Name", "Order Count"]
        ];
        const worksheet = XLSX.utils.json_to_sheet(exportData, {origin: 'A2', skipHeader: true});

        XLSX.utils.sheet_add_aoa(worksheet, Heading, {origin: 'A1'});
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, "DeliveryChallanList.xlsx");

    }

    const getFiscalYear = () => {
        const URL = `${process.env.REACT_APP_API_URL}/api/accounting-year/companyWise/${searchParams.companyId}`;
        if (companyId) {
        axios.get(URL).then(response => {
            setAllFiscalYear(response.data.data);
        }).catch(err => {
        });
    }
    }

    const getLocation = () => {

        const URL = `${process.env.REACT_APP_API_URL}/api/depot/area-list/${searchParams.companyId}/${searchParams.userLoginId}`
        axios.get(URL).then(response => {
            setLocation(response.data.data);
        }).catch(err => {
        });
    }

    const getDistributorList = (obj) => {
        let queryString = '?';
        queryString += 'userLoginId=' + obj.userLoginId;
        queryString += '&companyId=' + obj.companyId;
        queryString += obj.accountingYearId ? '&accountingYearId=' + obj.accountingYearId : '';
        queryString += obj.locationId ? '&locationId=' + obj.locationId : '';
        const URL = `${process.env.REACT_APP_API_URL}/api/delivery-challan/distributor-list-for-challan` + queryString
        axios.get(URL).then(response => {
            if(response.data.data.distributorList.length > 0) {
                setDeliverableQuantity(response.data.data.deliverableQuantity);
                setTotalSalesOrder(response.data.data.totalOrder);
                setDistributorList(response.data.data.distributorList);
                setSearchedDistributorList(response.data.data.distributorList);
            }
            else {
                setDeliverableQuantity(0);
                setTotalSalesOrder(0)
                setDistributorList([]);
                setSearchedDistributorList([]);
                showError(intl.formatMessage({ id: "COMMON.ERROR" })); 
            }
        }).catch(err => {
            console.log(err);
            showError(intl.formatMessage({ id: "COMMON.ERROR" }));
        });
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
    const handleSearchTextChange = (event) => {
        let value = event.target.value
        setSearchText(value);
        getSearchListFromDistributorList(value);
    }

    const getSearchListFromDistributorList = (searchText) => {
        let list = [];

        for (let i = 0; i < distributorList.length; i++) {
            if (distributorList[i].distributor_name.toLowerCase().includes(searchText.toLowerCase())) {
                list.push(distributorList[i]);
            }
        }
        setSearchedDistributorList(list);
    }

    return (
        <>
            {/* BREAD CRUM ROW */}
            <div>
                <InventoryBreadCrum />
            </div>

            {/* HEADER ROW */}
            <div>
                {<InventoryStockHeader showStockData={false} />}
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
                                        value={searchText} onChange={handleSearchTextChange}></input>
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
                                            <select className="border-0 form-control" name="fiscalYear" onChange={(e) => selectFiscalYear(e)}>
                                                <option value="" className="fs-1">Select Fiscal Year</option>
                                                {
                                                    allFiscalYear.map((fiscalYear) => (
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
                            {/* LOCATION ROW */}
                            <div className='col-xl-3 sales-data-chip'>
                                <div className="d-flex">
                                    <div className="dark-gray-color">
                                        <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/location.svg")} width="30px" height="30px" />
                                    </div>
                                    <div className="ml-2">
                                        <span>
                                            <span className="dark-gray-color"
                                                style={{ fontWeight: "500" }}>Location</span>
                                            <p><strong>{selectedLocationName !== null && selectedLocationName !== '' ? '(' + selectedLocationName + ')' : '(all)'}</strong></p>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* SALES ORDER ROW */}
                            <div className='col-xl-3 sales-data-chip'>
                                <div className="d-flex">
                                    <div className="dark-gray-color">
                                        <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/amount.svg")} width="25px" height="25px" />
                                    </div>
                                    <div className="ml-2">
                                        <span>
                                            <span className="dark-gray-color"
                                                style={{ fontWeight: "500" }}>Sales Order</span>
                                            <p><strong>{totalOrder}</strong></p>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* EXPORT ROW */}
                            <div className='col-xl-6 sales-data-chip' style={{ background: "#F9F9F9" }}>
                                <button className="btn float-right export-btn" onClick={handleExport}>
                                    <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/download.svg")} width="15px" height="15px" />
                                </button>
                            </div>
                        </div>

                        {/* TABLE ROW */}
                        {/* <div className='mt-5'>
                            <DeliveryChallanList setSingleAll={setSingleAll} singleAll={singleAll} data={distributorList}/>
                        </div> */}

                        <div className='mt-5'>
                            <DeliveryChallanList setSingleAll={setSingleAll} singleAll={singleAll}
                                data={searchedDistributorList} />
                        </div>
                    </CardBody>
                </Card>
            </div>
        </>
    );
}