import React, { useState, useEffect } from "react";
import PaymentAdjustmentBreadCrum from '../../../common/PaymentAdjustmentBreadCrum';
import PaymentAdjustmentHeader from "../../../common/PaymentAdjustmentHeader";
import PaymentAdjustmentTabs from "../../../common/PaymentAdjustmentTabs";

import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../../../_metronic/_helpers";
import { Card, CardBody } from "../../../../../../../_metronic/_partials/controls";
import HistoryList from "./table/HistoryList"
import { shallowEqual, useSelector } from "react-redux";
import axios from "axios";
import * as XLSX from "xlsx";
import { showError } from "../../../../../../pages/Alert";

export default function HistoryPage() {
    let [singleAll, setSingleAll] = useState([]);

    const companyId = useSelector((state) => state.auth.company, shallowEqual);
    const searchParams = {
        location: '',
        fiscalYear: ''
    };
    const [params, setParams] = useState(searchParams);
    const [data, setData] = useState([]);
    const [location, setLocation] = useState([]);
    const [fiscalYear, setFiscalYear] = useState([]);
    const [totalAdjustedAmount, setTotalAdjustedAmount] = useState(0);
    const [totalOrdAmount, setTotalOrdAmount] = useState(0);
    const [selectedLocation, setSelectedLocation] = useState('All');

    useEffect(() => {
        document.getElementById('pills-payment-adjustment-payment-adjustment-tab').classList.add('active');
        document.getElementById('pills-payment-adjustment-history-tab').classList.add('active');
        getAllPaymentAdjustedHistory();
    }, []);

    useEffect(() => {
        getLocation();
        getFiscalYear();

    }, [companyId]);

    useEffect(() => {
        getAllPaymentAdjustedHistory();
    }, [companyId, params]);

    const getAllPaymentAdjustedHistory = () => {
        let URL = `${process.env.REACT_APP_API_URL}/api/payment-collection-adjustment/payment-collection-adjusted-history`;
        URL += '?companyId=' + companyId
        params.location && (URL += '&location=' + params.location)
        params.fiscalYear && (URL += '&fiscalYear=' + params.fiscalYear)
        axios.get(URL).then(response => {
            setData(response.data.data);
            console.log(response.data.data);
            const sumAdjustedAmount = response.data.data.reduce((accumulator, object) => {
                return accumulator + object.payment_amount;
            }, 0);

            setTotalAdjustedAmount(sumAdjustedAmount);

            const sumOrdAmount = response.data.data.reduce((accumulator, object) => {
                return accumulator + object.ord_amount;
            }, 0);

            setTotalOrdAmount(sumOrdAmount);
        });
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
            obj.payment_no = row.payment_no;
            obj.days_ago = row.days_ago
            obj.payment_date = row.payment_date;
            obj.distributor_name = row.distributor_name;
            obj.ledger_balance = row.ledger_balance;
            obj.collected_by_name = row.collected_by;
            obj.collected_by_designation = row.designation + ', ' + row.company_name;
            obj.invoice_no = row.invoice_no;
            obj.payment_amount = row.payment_amount;
            obj.ord_amount = row.ord_amount;
            exportData.push(obj);
        })
        const workbook = XLSX.utils.book_new();
        const Heading = [
            ["Payment Number,", "Days Ago", "Payment Date", "Distributor Name", "Distributor Balance",
                "Entry By Name", "Entry By Designation", "Invoice Number", "Payment Amount", "ORD Amount"]
        ];
        const worksheet = XLSX.utils.json_to_sheet(exportData, { origin: 'A2', skipHeader: true });

        // creating sheet and adding data from 2nd row of column A.
        // Leaving first row to add Heading
        XLSX.utils.sheet_add_aoa(worksheet, Heading, { origin: 'A1' });

        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, "PaymentCollectionAdjustmentHistory.xlsx");
    }
    const handleKeyPressChange = (e) => {
        if (e.keyCode === 32) {
            getAllPaymentAdjustedHistory();
        } else if (e.keyCode === 8) {
            getAllPaymentAdjustedHistory();
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
            let collectedBy = data[i].collected_by.toLowerCase();
            let paymentNo = data[i].payment_no.toLowerCase();
            if (distributorName.includes(searchTextValue)
                || collectedBy.includes(searchTextValue)
                || paymentNo.includes(searchTextValue)
            ) {
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
                            <div className="col-xl-9 d-flex flex-wrap justify-content-end mt-1">
                                {/* LOCATION ROW */}
                                <div className="mr-3">
                                    <div className="row">
                                        <div className="col-4 mt-3">
                                            <label className="dark-gray-color">Location</label>
                                        </div>
                                        <div className="col-8">
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
                                        <div className="col-4 mt-3 text-xl-right">
                                            <label className="dark-gray-color">Timeline</label>
                                        </div>
                                        <div className="col-8">
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

                                {/* FILTER ROW */}
                                <div>
                                    <button className="btn filter-btn float-right">
                                        <i className="bi bi-funnel" style={{ fontSize: "13px" }}></i>&nbsp;Filter
                                    </button>
                                </div>
                            </div>
                        </div>
                        {/* ALL SUMMARY ROW */}

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

                            {/* TOTAL INVOICES ROW */}
                            <div className='col-xl-4 sales-data-chip'>
                                <div className="d-flex">
                                    <div className="dark-gray-color">
                                        <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/list.svg")} width="25px" height="25px" />
                                    </div>
                                    <div className="ml-2">
                                        <span>
                                            <span className="dark-gray-color"
                                                style={{ fontWeight: "500" }}>Total Invoice Amount</span>
                                            <p><strong>{totalAdjustedAmount.toFixed(2)}</strong></p>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* ORD AMOUNT ROW */}
                            <div className='col-xl-3 sales-data-chip float-right' style={{ borderRadius: "0px 5px 5px 0px" }}>
                                <div className="d-flex">
                                    <div className="dark-gray-color">
                                        <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/Adjustment.svg")} width="15px" height="15px" />
                                    </div>
                                    <div className="ml-2">
                                        <span>
                                            <span className="dark-gray-color"
                                                style={{ fontWeight: "500" }}>ORD Amount</span>
                                            <p><strong>{totalOrdAmount.toFixed(2)}</strong></p>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* EXPORT ROW */}
                            <div className='col-xl-2 sales-data-chip' style={{ background: "#F9F9F9" }}>
                                <button className="btn float-right export-btn" onClick={handleExport}>
                                    <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/download.svg")} width="15px" height="15px" />
                                </button>
                            </div>
                        </div>
                        {/* TABLE ROW */}
                        <div className='mt-5'>
                            <HistoryList setSingleAll={setSingleAll} singleAll={singleAll} data={data} />
                        </div>
                    </CardBody>
                </Card>
            </div>
        </>
    );
}