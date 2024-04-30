import React, { useState, useEffect } from "react";
import PaymentAdjustmentBreadCrum from '../../../common/PaymentAdjustmentBreadCrum';
import PaymentAdjustmentHeader from "../../../common/PaymentAdjustmentHeader";
import StatusTabs from "../../../common/StatusTabs";

import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../../../_metronic/_helpers";
import { Card, CardBody } from "../../../../../../../_metronic/_partials/controls";
import { AllList } from "./table/all/AllList";
import { shallowEqual, useSelector } from "react-redux";
import axios from "axios";
import { amountFormatterWithoutCurrency } from "../../../../../Util";

export default function All() {
    const companyId = useSelector((state) => state.auth.company, shallowEqual);
    const searchParams = {
        paymentNature: '',
        paymentType: '',
        location: '',
        fiscalYear: '',
        fromDate: '',
        toDate: ''
    };
    let [singleAll, setSingleAll] = useState([]);
    const [params, setParams] = useState(searchParams);
    const [paymentNature, setPaymentNature] = useState([]);
    const [location, setLocation] = useState([]);
    const [fiscalYear, setFiscalYear] = useState([]);
    const [paymentType, setPaymentType] = useState([]);
    const [data, setData] = useState([]);
    const [status, setStatus] = useState('');
    const [totalCollection, setTotalCollection] = useState(0);
    const [selectedPaymentNature, setSelectedPaymentNature] = useState('All');
    const [selectedPaymentType, setSelectedPaymentType] = useState('All');

    useEffect(() => {
        document.getElementById('pills-payment-adjustment-payment-verify-tab').classList.add('active');
        document.getElementById('pills-payment-verify-all-tab').classList.add('active');
        getPaymentTypeAndNature();
        // getLocation();
        // getFiscalYear();
        // getAllPayment();
    }, []);

    useEffect(() => {
        getLocation();
        getFiscalYear();
    }, [companyId]);

    useEffect(() => {
        getAllPayment();
    }, [companyId, params, status]);

    const handleExport = () => {
        const exportData = [...singleAll]
    }

    const handleSearch = (e) => {
        const selectedText = e.target.options[e.target.options.selectedIndex].text;
        const name = e.target.name;
        const value = e.target.value;
        setParams(values => ({ ...values, [name]: value }));

        if (name === 'paymentNature') {
            setSelectedPaymentNature(selectedText);
        }

        if (name === 'paymentType') {
            setSelectedPaymentType(selectedText);
        }
    }

    const getAllPayment = () => {
        let URL = `${process.env.REACT_APP_API_URL}/api/payment-collection/payment-collection-list-to-verify`;
        URL += '?companyId=' + companyId
        params.paymentNature && (URL += '&paymentNature=' + params.paymentNature)
        params.paymentType && (URL += '&paymentType=' + params.paymentType)
        params.location && (URL += '&location=' + params.location)
        params.fiscalYear && (URL += '&fiscalYear=' + params.fiscalYear)
        status && (URL += '&status=' + status)
        // URL += '&fromDate=' + params.fromDate  
        // URL += '&toDate=' + params.toDate 
        if (companyId) {          
        axios.get(URL).then(response => {
            setData(response.data.data);

            const sum = response.data.data.reduce((accumulator, object) => {
                return accumulator + object.collection_amount;
            }, 0);

            setTotalCollection(sum);
        });
        } 
    }

    const getPaymentTypeAndNature = () => {
        const URL = `${process.env.REACT_APP_API_URL}/api/payment-collection/payment-type-and-nature`
        axios.get(URL).then(response => {
            setPaymentNature(response.data.data.paymentNature);
            setPaymentType(response.data.data.paymentType);
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
    const handleKeyPressChange = (e) => {
        if (e.keyCode === 32) {
            getAllPayment()
        } else if (e.keyCode === 8) {
            getAllPayment()
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
            let collectedBy = data[i].collected_by.toLowerCase();
            let distributorName = data[i].distributor_name.toLowerCase();
            let paymentNo = data[i].payment_no.toLowerCase();
            if (distributorName.includes(searchTextValue)
                || paymentNo.includes(searchTextValue)
                || collectedBy.includes(searchTextValue)
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
                <StatusTabs setStatus={setStatus} />
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
                                    <div className="col-xl-9 d-flex flex-wrap justify-content-end">
                                        {/* PAYMENT NATURE ROW */}
                                        <div className="mr-3">
                                            <div className="row">
                                                <div className="col-7 mt-3">
                                                    <label className="dark-gray-color">Payment Nature</label>
                                                </div>
                                                <div className="col-5">
                                                    <select name="paymentNature" id="paymentNature"
                                                        className="form-control border-0"
                                                        onChange={handleSearch}>
                                                        <option value="" selected>All</option>
                                                        {paymentType && paymentNature.map((data) =>
                                                            (<option key={data.code} value={data.code}>{data.name}</option>)
                                                        )}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        {/* PAYMENT TYPE ROW */}
                                        <div className="mr-3">
                                            <div className="row">
                                                <div className="col-6 mt-3">
                                                    <label className="dark-gray-color">Payment Type</label>
                                                </div>
                                                <div className="col-6">
                                                    <select name="paymentType" id="paymentType"
                                                        className="form-control border-0" onClick={handleSearch}>
                                                        <option value="" selected>All</option>
                                                        {paymentType && paymentType.map((data) =>
                                                            (<option key={data.code} value={data.code}>{data.name}</option>)
                                                        )}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        {/* LOCATION ROW */}
                                        <div className="mr-3">
                                            <div className="row">
                                                <div className="col-4 mt-3">
                                                    <label className="dark-gray-color">Location</label>
                                                </div>
                                                <div className="col-8">
                                                    <select className="form-control border-0" name="location" id="location" onChange={handleSearch}>
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
                                                <div className="col-4 mt-3">
                                                    <label className="dark-gray-color">Timeline</label>
                                                </div>
                                                <div className="col-8">
                                                    <select className="form-control border-0" name="fiscalYear" id="fiscalYear" onChange={handleSearch}>
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
                                                            <p><strong>All</strong></p>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/*  */}
                                            <div className='col-xl-3 sales-data-chip'>
                                                <div className="d-flex">
                                                    <div className="dark-gray-color">
                                                        <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/gray-doller.svg")} width="25px" height="25px" />
                                                    </div>
                                                    <div className="ml-2">
                                                        <span>
                                                            <span className="dark-gray-color"
                                                                style={{ fontWeight: "500" }}>Payment Nature</span>
                                                            <p><strong>{selectedPaymentNature}</strong></p>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='col-xl-3 sales-data-chip' style={{ borderRadius: "0px 5px 5px 0px" }}>
                                                <div className="d-flex">
                                                    <div className="dark-gray-color">
                                                        <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/gray-type.svg")} width="25px" height="25px" />
                                                    </div>
                                                    <div className="ml-2">
                                                        <span>
                                                            <span className="dark-gray-color"
                                                                style={{ fontWeight: "500" }}>Payment Type</span>
                                                            <p><strong>{selectedPaymentType}</strong></p>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='col-xl-3 sales-data-chip' style={{ borderRadius: "0px 5px 5px 0px" }}>
                                                <div className="d-flex">
                                                    <div className="dark-gray-color">
                                                        <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/icon3.svg")} width="25px" height="25px" />
                                                    </div>
                                                    <div className="ml-2">
                                                        <span>
                                                            <span className="dark-gray-color"
                                                                style={{ fontWeight: "500" }}>Collection Amount</span>
                                                            <p><strong>{amountFormatterWithoutCurrency(totalCollection)}</strong></p>
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
                                    <AllList setSingleAll={setSingleAll} singleAll={singleAll} getData={data} />
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </>
    );
}