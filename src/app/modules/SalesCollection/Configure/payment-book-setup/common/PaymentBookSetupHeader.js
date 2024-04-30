//import React, { useState } from "react";
import React, { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
import {
    Card,
    CardBody,
} from "../../../../../../_metronic/_partials/controls";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../../_metronic/_helpers";
import { useIntl } from "react-intl";
import axios from "axios";

export default function PaymentBookSetupHeader(props) {
    const intl = useIntl();
    const history = useHistory();
    const [inputs, setInputs] = useState({});
    const [allCompany, setAllCompany] = useState([]);
    const [activeStep, setActiveStep] = useState(0);
    const [searchInputs, setSearchInputs] = useState({});
    const handlePaymentBookChange = () => {
        //history.push("/salescollection/distributors/overview")
    }
    const handleTrackMoneyReceiptChange = () => {
        //history.push("/salescollection/distributors/configure-track-money-receipt")
    }
    const handleLostDeclarationChange = () => {
        //history.push("/salescollection/distributors/credit-limit-proposal")
    }
    const handleEditLogChange = () => {
        //history.push("/salescollection/distributors/activity")
    }

    const handleAddNewPaymentBook = () => {
        history.push("/salescollection/configure/payment-book/payment-book-setup-new")
    }
    useEffect(() => {
        getAllCompanyByOrganization();
    }, []);

    useEffect(() => {// useEffect() is call when search input is changed
        props.getSearchInputs(searchInputs);
    }, [searchInputs]);

    const handleChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;
        setSearchInputs(values => ({ ...values, [name]: value }));
    }
    const getAllCompanyByOrganization = () => {
        const URL = `${process.env.REACT_APP_API_URL}/api/organization/get-all-company-by-organization`;
        axios.get(URL).then(response => {
            setAllCompany(response.data.data)
        });
    }

    return (
        <>
            {/* TODAY SALE ROW */}
            <div className="mt-3">
                <Card>
                    <CardBody style={{ marginBottom: "-36px" }}>
                        {/* TITLE AND ADD BTN ROW */}
                        <div>
                            <span className="create-field-title">{intl.formatMessage({ id: "CONFIGURE.PAYMNET_BOOK_SETUP" })}</span>
                            <span className="d-flex float-right">
                                <div className="mr-3 mt-3" style={{ color: "rgb(130, 130, 130)" }}>
                                    <label>{intl.formatMessage({ id: "COMMON.COMPANY" })}<i style={{ color: "red" }}>*</i></label>
                                </div>
                                <div className="create-field-title mr-5">
                                    <select className='form-control' name="companyId"
                                        value={searchInputs.companyId || ""} onChange={handleChange}>
                                        <option value="">Select company</option>
                                        {allCompany.map((company) => (
                                            <option key={company.id} value={company.id}>{company.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="create-field-title">
                                    <button type="button" className="btn btn-gradient-blue" data-toggle="tooltip" data-placement="bottom" title="Add New Payment Book" style={{ color: "white" }} onClick={handleAddNewPaymentBook}>
                                        <SVG
                                            className="svg-icon svg-icon-md svg-icon-primary"
                                            src={toAbsoluteUrl("/media/svg/icons/project-svg/more.svg")}
                                        />Add New Payment Book
                                    </button>
                                </div>
                            </span>
                        </div>

                        {/* HISTORY ROW */}
                        {/* <div className="row mt-5">
                            <div className="col-xl-6 mt-5">
                                <span className="display-inline-block">
                                    <i class="bi bi-arrow-up-short text-primary"></i>
                                    &nbsp;45,428,030&nbsp;
                                    <span className='text-muted'>{intl.formatMessage({ id: "PAYMENT.BOOK.TOTAL_PAYMENT_BOOK" })}</span>
                                </span>
                            </div>
                            <div className="col-xl-6 mt-5" style={{ textAlign: "end" }}>
                                <span className="display-inline-block">
                                    <span className='text-muted'>New&nbsp;</span>
                                    <span className='text-success'>20,104&nbsp;</span>
                                    <span className='text-muted text-wrap'>(Year 2022-23)&nbsp;</span>
                                </span>
                                <span className='text-muted display-inline-block'>|&nbsp;</span>
                                <span className="display-inline-block">
                                    <span className='text-muted'>Available&nbsp;</span>
                                    <span className='text-primary'>2,456,457&nbsp;</span>
                                </span>
                                <span className='text-muted display-inline-block'>|&nbsp;</span>
                                <span className="display-inline-block">
                                    <span className='text-muted'>Used&nbsp;</span>
                                    &nbsp;25,514&nbsp;
                                </span>
                            </div>
                        </div> */}

                        {/* PROGRESSBAR ROW */}
                        {/* <div class="distributor-progress mt-5">
                            <div class="progress">
                                <div class="progress-bar bg-success" role="progressbar" style={{ width: "10%" }} aria-valuenow="15" aria-valuemin="0" aria-valuemax="100"></div>
                                <div class="progress-bar" role="progressbar" style={{ width: "80%" }} aria-valuenow="30" aria-valuemin="0" aria-valuemax="100"></div>
                            </div>
                        </div> */}

                        {/* TAB ROW */}
                        <div className="mt-5">
                            <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist" style={{ marginLeft: "-18px" }}>
                                <li class="nav-item" role="presentation">
                                    <a class="nav-link" id="pills-configure-payment-book-tab" data-toggle="pill" href="#pills-configure-payment-book" role="tab" aria-controls="pills-configure-payment-book" aria-selected="false" onClick={handlePaymentBookChange}>Payment Book</a>
                                </li>
                                <li class="nav-item" role="presentation">
                                    <a class="nav-link" id="pills-configure-track-money-receipt-tab" data-toggle="pill" href="#pills-configure-track-money-receipt" role="tab" aria-controls="pills-configure-track-money-receipt" aria-selected="false" onClick={handleTrackMoneyReceiptChange}>Track Money Receipt</a>
                                </li>
                                <li class="nav-item" role="presentation">
                                    <a class="nav-link" id="pills-configure-lost-declaration-tab" data-toggle="pill" href="#pills-configure-lost-declaration" role="tab" aria-controls="pills-configure-lost-declaration" aria-selected="false" onClick={handleLostDeclarationChange}>Lost Declaration</a>
                                </li>
                                <li class="nav-item" role="presentation">
                                    <a class="nav-link" id="pills-configure-edit-log-tab" data-toggle="pill" href="#pills-configure-edit-log" role="tab" aria-controls="pills-configure-edit-log" aria-selected="false" onClick={handleEditLogChange}>Edit Log</a>
                                </li>
                            </ul>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </>
    );
}