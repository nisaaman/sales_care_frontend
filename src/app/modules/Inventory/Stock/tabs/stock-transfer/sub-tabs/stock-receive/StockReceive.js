import React, { useState, useEffect } from "react";
import InventoryBreadCrum from '../../../../../bread-crum/InventoryBreadCrum';
import InventoryStockHeader from "../../../../header/InventoryStockHeader";
import StockTransferSubTabs from "../../sub-tabs-header/StockTransferSubTabs";
import { Card, CardBody } from "../../../../../../../../_metronic/_partials/controls";
import { toAbsoluteUrl } from "../../../../../../../../_metronic/_helpers";
import SVG from "react-inlinesvg";
import StockReceiveList from "./table/StockReceiveList";
import { shallowEqual, useSelector } from "react-redux";
import { useIntl } from "react-intl";
import { showError } from '../../../../../../../pages/Alert';
import axios from "axios";
import * as XLSX from 'xlsx';

export default function StockReceive() {
    let [singleAll, setSingleAll] = useState([]);
    const intl = useIntl();
    const companyId = useSelector((state) => state.auth.company, shallowEqual);
    const [searchParams, setSearchParams] = useState({companyId: companyId, accountingYearId:'', depotId:''});
    const [listData, setListData] = useState([]);
    const [totalQuantity, setTotalQuantity] = useState(0.00);
    const [allFiscalYear, setAllFiscalYear] = useState([]);
    const [depotList, setDepotList] = useState([]);

    useEffect(() => {
        document.getElementById('pills-inventory-stock-stock-transfer-tab').classList.add('active');
        document.getElementById('pills-inventory-stock-stock-transfer-stock-receive-tab').classList.add('active');
        getFiscalYear();
        getDepotList();
    }, []);
    const handleExport = () => {
        const data = [...singleAll];
        if (data.length === 0) {
            showError("No row is selected for export data");
            return;
        }
    
        let exportData = [];
        data.map(row => {
            let obj = {};
            obj.depot_name = row.depot_name;
            obj.transfer_no =row.transfer_no;
            obj.transaction_date = row.transaction_date;
            obj.user_name = row.user_name;
            obj.designation_name = row.designation_name;
            obj.quantity = row.quantity;
            
            exportData.push(obj);
        })
        const workbook = XLSX.utils.book_new();
        const Heading = [
            ["DEPOT NAME", "TRANSFER NO", "TRANSACTION DATE", "USER NAME", "DESIGNATION NAME", "QUANTITY"]
        ];
        const worksheet = XLSX.utils.json_to_sheet(exportData, {origin: 'A2', skipHeader: true});

        XLSX.utils.sheet_add_aoa(worksheet, Heading, {origin: 'A1'});
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, "StockReceiveList.xlsx");
    }
    useEffect(() => {
        setSearchParams({...searchParams, companyId: companyId});
    }, [companyId]);

    useEffect(() => {
        getTransferTransactionListToReceive(searchParams);
        getFiscalYear();
        getDepotList();
    }, [searchParams]);

    const getTransferTransactionListToReceive = (obj) => { 
        let queryString = '?';
        queryString += 'companyId=' + obj.companyId;
        queryString += obj.accountingYearId ? '&accountingYearId=' + obj.accountingYearId : '';
        queryString += obj.depotId ? '&depotId=' + obj.depotId : '';

        const URL = `${process.env.REACT_APP_API_URL}/api/inv-receive/transfer-transaction-list-to-receive` + queryString;
        axios.get(URL, JSON.stringify(obj), { headers: { "Content-Type": "application/json" } }).then(response => {
            setListData(response.data.data.transferTransactionListToReceive);
            setTotalQuantity(response.data.data.totalQuantity)
        }).catch(err => {
        });
    }
    const getFiscalYear = () => {        
        const URL = `${process.env.REACT_APP_API_URL}/api/accounting-year/companyWise/${companyId}`;
        if (companyId) {
        axios.get(URL).then(response => {
            setAllFiscalYear(response.data.data);
        }).catch(err => {
        });
    }
    }
    const getDepotList = () => {        
        const URL = `${process.env.REACT_APP_API_URL}/api/depot/all-of-a-company/${companyId}`;
        axios.get(URL).then(response => {
            setDepotList(response.data.data);
        }).catch(err => {
        });
    }
    const selectFiscalYear = (e) => {
        let searchObj = { ...searchParams, accountingYearId: e.target.value };
        setSearchParams(searchObj);
    }
    const selectDepot = (e) => {
        let searchObj = { ...searchParams, depotId: e.target.value };
        setSearchParams(searchObj);
    }
    const handleKeyPressChange = (e) => {
        if (e.keyCode === 32) {
            getTransferTransactionListToReceive(searchParams);
        } else if (e.keyCode === 8) {
            getTransferTransactionListToReceive(searchParams);
        }
    }
    const handleSearchChange = (event) => {
        let value = event.target.value;
        getSearchList(value);
    }
    const getSearchList = (searchText) => {
        let searchTextValue = searchText.toLowerCase();
        let tp = [];
        console.log(listData)
        for (let i = 0; i < listData.length; i++) {
            let transferNo = listData[i].transfer_no.toLowerCase();
            let userName = listData[i].user_name.toLowerCase();
            let depotName = listData[i].depot_name.toLowerCase();
            if (transferNo.includes(searchTextValue)
                ||userName.includes(searchTextValue)
                ||depotName.includes(searchTextValue)
                ) {
                tp.push(listData[i]);
            }
        }
        setListData(tp);
    }
    return (
        <>
            {/* BREAD CRUM ROW */}
            <div>
                <InventoryBreadCrum />
            </div>
            
            {/* HEADER ROW */}
            <div>
               <InventoryStockHeader showStockData={true}/>
            </div>

            {/*SUB TABS ROW */}
            <div>
                <StockTransferSubTabs />
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
                                    {/* DEPOT DROPDOWN */}
                                    <div className="mr-3">
                                        <div className="row">
                                            <div className="col-3 mt-3">
                                                <label className="dark-gray-color">Depot</label>
                                            </div>
                                            <div className="col-9">
                                                <select className="border-0 form-control" name="fiscalYear" onChange={(e)=>selectDepot(e)}>
                                                    <option value="" className="fs-1">Select Depot</option>
                                                    {
                                                        depotList.map((depot)=>(
                                                            <option key={depot.id} value={depot.id}
                                                                className="fs-1">{depot.depot_name}</option>
                                                        ))
                                                    }
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
                            {/* BOOKING AMOUNT ROW */}
                            <div className='col-xl-4 sales-data-chip'>
                                <div className="d-flex">
                                    <div className="dark-gray-color">
                                        <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/gray-doller.svg")} width="25px" height="25px" />
                                    </div>
                                    <div className="ml-2">
                                        <span>
                                            <span className="dark-gray-color"
                                                style={{ fontWeight: "500" }}>Qty</span>
                                            <p><strong>{totalQuantity}</strong></p>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* NO. OF BOOKING ROW */}
                            <div className='col-xl-4 sales-data-chip'>
                                <div className="d-flex">
                                    {/* <div className="dark-gray-color">
                                        <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/location.svg")} width="30px" height="30px" />
                                    </div>
                                    <div className="ml-2">
                                        <span>
                                            <span className="dark-gray-color"
                                                style={{ fontWeight: "500" }}>Location</span>
                                            <p><strong>Chittagong</strong></p>
                                        </span>
                                    </div> */}
                                </div>
                            </div>

                            {/* EXPORT ROW */}
                            <div className='col-xl-4 sales-data-chip' style={{ background: "#F9F9F9" }}>
                                <button className="btn float-right export-btn" onClick={handleExport}>
                                    <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/download.svg")} width="15px" height="15px" />
                                </button>
                            </div>
                        </div>

                        {/* TABLE ROW */}
                        <div className='mt-5'>
                            <StockReceiveList setSingleAll={setSingleAll} singleAll={singleAll} 
                                data={listData}/>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </>
    );
}