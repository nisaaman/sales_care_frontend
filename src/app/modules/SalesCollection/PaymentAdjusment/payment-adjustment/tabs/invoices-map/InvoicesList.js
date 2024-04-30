import React, { useState, useEffect } from "react";
import PaymentAdjustmentBreadCrum from '../../../common/PaymentAdjustmentBreadCrum';
import PaymentAdjustmentHeader from "../../../common/PaymentAdjustmentHeader";
import PaymentAdjustmentTabs from "../../../common/PaymentAdjustmentTabs";

import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../../../_metronic/_helpers";
import { Card, CardBody } from "../../../../../../../_metronic/_partials/controls";
import InvoicesMapList from "./table/invoices-table/InvoicesMapList";
import * as XLSX from "xlsx";
import { showError } from "../../../../../../pages/Alert";
import { round } from "lodash";
import { shallowEqual, useSelector } from "react-redux";
import axios from "axios";
import moment from "moment";
import Flatpickr from "react-flatpickr";
import {amountFormatterWithoutCurrency} from '../../../../../Util';

export default function InvoicesList() {
    const searchParams = {
        location: '',
        fiscalYear: '',
    };
    const [singleAll, setSingleAll] = useState([]);
    const [location, setLocation] = useState([]);
    const [fiscalYear, setFiscalYear] = useState([]);
    const [params, setParams] = useState(searchParams);
    const [totalAdjustableAmount, setTotalAdjustableAmount] = useState(0);
    const [selectedLocation, setSelectedLocation] = useState('All');
    const [data, setData] = useState([]);
    const companyId = useSelector((state) => state.auth.company, shallowEqual);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [dateDisable, setDateDisable] = useState(true);

    useEffect(() => {
        getLocation();
        getFiscalYear();
    }, [companyId]);

    useEffect(() => {
        getDataList();
    }, [companyId, params, startDate, endDate]);

    useEffect(() => {
        if(params.fiscalYear === ''){
            setDateDisable(false);
        }else{
            setStartDate(''); 
            setEndDate('');
            setDateDisable(true); 
        }
    }, [params.fiscalYear]);

    useEffect(() => {
        document.getElementById('pills-payment-adjustment-payment-adjustment-tab').classList.add('active');
        document.getElementById('pills-payment-adjustment-invoices-map-tab').classList.add('active');
    }, []);

    const getDataList = () => {
        if (companyId) {
        let URL = `${process.env.REACT_APP_API_URL}/api/payment-collection-adjustment/distributor-wise-payment-collection-info-list`;
        URL += '?companyId=' + companyId
        params.location && (URL += '&location=' + params.location)
        params.fiscalYear && (URL += '&fiscalYear=' + params.fiscalYear)
        URL += startDate ? '&startDate=' + startDate : '';
        URL += endDate ? '&endDate=' + endDate : '';
        axios.get(URL).then(response => {
            setData(response.data.data);

            const sum = response.data.data.reduce((accumulator, object) => {
                return accumulator + object.adjustable_amount;
            }, 0);

            setTotalAdjustableAmount(sum);
        });           
        }
    }

    const getLocation = () => {
        const URL = `${process.env.REACT_APP_API_URL}/api/location/get-last-location-by-company/` + companyId
        if (companyId) {
            axios.get(URL).then(response => {
                setLocation(response.data.data);
            });
        }
    }

    const getFiscalYear = () => {
        const URL = `${process.env.REACT_APP_API_URL}/api/accounting-year/companyWise/` + companyId
        if (companyId) {
        axios.get(URL).then(response => {
            setFiscalYear(response.data.data);
        });}
    }

    const handleSearch = (e) => {
        const selectedText = e.target.options[e.target.options.selectedIndex].text;
        const name = e.target.name;
        const value = e.target.value;
        setParams(values => ({ ...values, [name]: value }));

        if (name === 'location') {
            setSelectedLocation(selectedText);
        }

        if (name === 'fiscalYear') {
            handleClearDates();
        }
      
    }

    const handleClearDates = () => {
        const startDateInput = document.getElementById('startDate');
        const endDateInput = document.getElementById('endDate');
      
        if (startDateInput && endDateInput) {
          startDateInput._flatpickr.clear();
          endDateInput._flatpickr.clear();
          setStartDate(''); 
          setEndDate('');
        }
      }; 

    const handleExport = () => {
        const data = [...singleAll];
        if (data.length === 0) {
            showError("Please select rows to export data.");
            return;
        }
        let exportData = [];
        data.map(row => {
            let obj = {};
            obj.distributor_name = row.distributor_name;
            obj.ledger_balance = row.ledger_balance;
            obj.invoice_amount = row.invoice_amount;
            obj.overdu_count = row.overdu_count;
            obj.collection_amount = row.collection_amount;
            obj.advance_count = row.advance_count;
            obj.adjustable_amount = row.adjustable_amount;
            obj.adjustable_percent = round((row.adjustable_amount / row.collection_amount) * 100, 2) + "%";
            exportData.push(obj);
        })
        const workbook = XLSX.utils.book_new();
        const Heading = [
            ["Distributor Name", "Distributor Balance", "Invoice Amount", "Invoice Overdue",
                "Payment Amount", "Advance Payment", "Adjustable Amount", "Adjustable %"]
        ];
        const worksheet = XLSX.utils.json_to_sheet(exportData, { origin: 'A2', skipHeader: true });

        // creating sheet and adding data from 2nd row of column A.
        // Leaving first row to add Heading
        XLSX.utils.sheet_add_aoa(worksheet, Heading, { origin: 'A1' });

        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, "DistributorWisePaymentAdjustmentList.xlsx");
    }
    const handleKeyPressChange = (e) => {
        if (e.keyCode === 32) {
            getDataList();
        } else if (e.keyCode === 8) {
            getDataList();
        }
    }
    const handleSearchChange = (event) => {
        let value = event.target.value;
        getSearchList(value);
    }
    const getSearchList = (searchText) => {
        let searchTextValue = searchText.toLowerCase();
        let tp = [];
        for (let i = 0; i < data.length; i++) {
            let distributorName = data[i].distributor_name.toLowerCase();
            if (distributorName.includes(searchTextValue)) {
                tp.push(data[i]);
            }
        }
        setData(tp);
    }
    return (
        <>
            <div>
                {/* BREAD CRUM ROW */}
                <PaymentAdjustmentBreadCrum />
                {/* TODAY SALE ROW */}
                <PaymentAdjustmentHeader />
            </div>
            <div>
                <PaymentAdjustmentTabs />
            </div>
            <div className="mt-5">
                <Card>
                    <CardBody>
                        <div className='row'>
                            <div className='col-xl-12'>
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
                                    <div className="col-xl-9 mt-1 d-flex flex-wrap justify-content-end">
                                        <div className="row">
                                            {/* LOCATION ROW */}
                                            <div className="mr-3">
                                                <div className="row">
                                                    <div className="col-3 mt-3">
                                                        <label className="dark-gray-color">Location</label>
                                                    </div>
                                                    <div className="col-8.1">
                                                        <select className="form-control border-0 payment-collection-invoices-select"
                                                            name="location" id="location" onChange={handleSearch}>
                                                            <option value="" selected>Select Location</option>
                                                            {location && location.map((data) =>
                                                                (<option key={data.id} value={data.id}>{data.name}</option>)
                                                            )}
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* TIMELINE ROW */}
                                            <div className="mr-3">
                                                <div className="row">
                                                    <div className="col-3 mt-3">
                                                        <label className="dark-gray-color">Timeline</label>
                                                    </div>
                                                    <div className="col-8.1">
                                                        <select className="form-control border-0 payment-collection-invoices-select"
                                                            name="fiscalYear" id="fiscalYear" onChange={handleSearch}>
                                                            <option value="" selected>Select Fiscal Year</option>
                                                            {fiscalYear && fiscalYear.map((data) =>
                                                                (<option key={data.id} value={data.id}>{data.fiscalYearName}</option>)
                                                            )}
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mr-3">
                                                <div>
                                                    <div className="d-flex flex-wrap"> 
                                                        <div>
                                                            <div className="row">
                                                                <div className="col-3 mt-3" style={{ color: "rgb(130, 130, 130)" }}>
                                                                    <label>Start Date</label>
                                                                </div>
                                                                <div className="col-7">
                                                                    <Flatpickr className="form-control date border-0" id="startDate" name="startDate" placeholder="dd-MM-yyyy"
                                                                        options={{ dateFormat: "d-M-Y" }} required
                                                                        onChange={(value) => {
                                                                            setStartDate(
                                                                                moment(new Date(value)).format("YYYY-MM-DD")
                                                                            )
                                                                        }}
                                                                        disabled = {dateDisable}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div> 

                                                    <div className="d-flex flex-wrap"> 
                                                        <div>
                                                            <div className="row">
                                                                <div className="col-3 mt-3" style={{ color: "rgb(130, 130, 130)" }}>
                                                                    <label>End Date</label>
                                                                </div>
                                                                <div className="col-7">
                                                                        <Flatpickr className="form-control date border-0" id="endDate" placeholder="dd-MM-yyyy"
                                                                            options={{ dateFormat: "d-M-Y" }} required 
                                                                            onChange={(value) => {
                                                                                setEndDate(
                                                                                    moment(new Date(value)).format("YYYY-MM-DD")
                                                                                )
                                                                            }}                                        
                                                                            disabled = {dateDisable}            
                                                                        />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div> 
                                                </div>
                                            </div>

                                            {/* FILTER ROW */}
                                            <div>
                                                <button className="btn filter-btn float-right">
                                                    <i className="bi bi-funnel" style={{ fontSize: "13px" }}></i>&nbsp;Filter
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* ALL SUMMARY ROW */}
                                <div className='row ml-2'>
                                    <div className="col-xl-11">
                                        <div className="row">
                                            {/* LOCATION ROW */}
                                            <div className='col-xl-3 sales-data-chip' style={{ borderRadius: "5px 0px 0px 5px" }}>
                                                <div className="d-flex">
                                                    <div className="dark-gray-color">
                                                        <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/location.svg")} width="30px" height="30px" />
                                                    </div>
                                                    <div className="ml-2">
                                                        <span>
                                                            <span className="dark-gray-color"
                                                                style={{ fontWeight: "500" }}>Location</span>
                                                            <p><strong>{selectedLocation}</strong></p>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/*  */}
                                            <div className='col-xl-3 sales-data-chip'>
                                                <div className="d-flex">
                                                    <div className="dark-gray-color">
                                                        <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/list.svg")} width="25px" height="25px" />
                                                    </div>
                                                    <div className="ml-2">
                                                        <span>
                                                            <span className="dark-gray-color"
                                                                style={{ fontWeight: "500" }}>Invoices</span>
                                                            <p><strong>Regular</strong></p>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='col-xl-3 sales-data-chip' style={{ borderRadius: "0px 5px 5px 0px" }}>
                                                <div className="d-flex">
                                                    <div className="dark-gray-color">
                                                        <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/gray-doller.svg")} width="25px" height="25px" />
                                                    </div>
                                                    <div className="ml-2">
                                                        <span>
                                                            <span className="dark-gray-color"
                                                                style={{ fontWeight: "500" }}>Payments</span>
                                                            <p><strong>All</strong></p>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='col-xl-3 sales-data-chip' style={{ borderRadius: "0px 5px 5px 0px" }}>
                                                <div className="d-flex">
                                                    <div className="dark-gray-color">
                                                        <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/amount.svg")} width="20px" height="20px" />
                                                    </div>
                                                    <div className="ml-2">
                                                        <span>
                                                            <span className="dark-gray-color"
                                                                style={{ fontWeight: "500" }}>Adjustable amount</span>
                                                            <p><strong>{amountFormatterWithoutCurrency(totalAdjustableAmount)}</strong></p>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='col-xl-1 sales-data-chip' style={{ background: "#F9F9F9" }}>
                                        <button className="btn float-right export-btn" onClick={handleExport}>
                                            <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/download.svg")} width="15px" height="15px" />
                                        </button>
                                    </div>

                                </div>
                                {/* TABLE ROW */}
                                <div className='mt-5'>
                                    <InvoicesMapList setSingleAll={setSingleAll} singleAll={singleAll} data={data}
                                    />
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </>
    );
}