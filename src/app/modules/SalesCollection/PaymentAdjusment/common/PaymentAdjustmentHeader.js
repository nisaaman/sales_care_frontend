import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import {useHistory} from "react-router-dom";
import {Card, CardBody} from "../../../../../_metronic/_partials/controls";
import { hasAcess } from "../../../Util";

export default function PaymentAdjustmentHeader() {
    const permissions = useSelector((state) => state.auth.user.permissions, shallowEqual);
    const history = useHistory();
    const handleOverviewChange = () => {
        //history.push("/salescollection/payment-adjustment/overview")
    }
    const handlePaymentVerifyChange = () => {
        history.push("/salescollection/payment-adjustment/payment-verify/all")
    }
    const handlePaymentAdjustmentChange = () => {
        history.push("/salescollection/payment-adjustment/payment-adjustment/invoices-map")
    }
    const handleORDSettlementChange = () => {
        history.push("/salescollection/payment-adjustment/ord-settlement/all-list")
    }
    const handleCreditDebitNoteChange = () => {
        history.push("/salescollection/payment-adjustment/credit-debit-note/all-list")
    }
    const handleProfitabilityAnalysisChange = () => {
        //history.push("/salescollection/payment-collection/collection-budget")
    }
    return (
        <>
            {/* TODAY SALE ROW */}
            <div className="mt-3">
                <Card>
                    <CardBody style={{marginBottom: "-36px"}}>
                        <div className="d-none">
                            <p className="create-field-title">Today’s Payment Adjustment</p>
                        </div>
                        <div className="mt-5 ml-2 row hide d-none">
                            <span className="sales-chip mt-5 mr-5"><i
                                className="bi bi-arrow-up-short text-primary"></i>&nbsp;595,428,030&nbsp;<span
                                className='text-muted'>Verify</span></span>
                            <span className="sales-chip mt-5 mr-5"><i
                                className="bi bi-arrow-down-short text-danger"></i>&nbsp;174,428,030&nbsp;<span
                                className='text-muted'>Adjustment</span></span>
                            <span className="sales-chip mt-5 mr-5"><i
                                className="bi bi-arrow-up-short text-primary"></i>&nbsp;99,567,428&nbsp;<span
                                className='text-muted'>Commission Settlement</span></span>
                            <span className="sales-chip mt-5 mr-5"><i
                                className="bi bi-arrow-up-short text-primary"></i>&nbsp;99,567,428&nbsp;<span
                                className='text-muted'>Profit</span></span>
                        </div>
                        <div className="mt-2">
                            <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
                                <li className="nav-item" role="presentation">
                                    <a className="nav-link" id="pills-payment-adjustment-overview-tab"
                                       data-toggle="pill" href="#pills-payment-adjustment-overview" role="tab"
                                       aria-controls="pills-payment-adjustment-overview" aria-selected="false"
                                       onClick={handleOverviewChange}>Overview</a>
                                </li>

                                {hasAcess(permissions, 'PAYMENT_VERIFY') &&
                                <li className="nav-item" role="presentation">
                                    <a className="nav-link" id="pills-payment-adjustment-payment-verify-tab"
                                       data-toggle="pill" href="#pills-payment-adjustment-payment-verify" role="tab"
                                       aria-controls="pills-payment-adjustment-payment-verify" aria-selected="false"
                                       onClick={handlePaymentVerifyChange}>Payment Verify</a>
                                </li>}

                                {hasAcess(permissions, 'PAYMENT_ADJUSTMENT') &&
                                <li className="nav-item" role="presentation">
                                    <a className="nav-link" id="pills-payment-adjustment-payment-adjustment-tab"
                                       data-toggle="pill" href="#pills-payment-adjustment-payment-adjustment" role="tab"
                                       aria-controls="pills-payment-adjustment-payment-adjustment" aria-selected="false"
                                       onClick={handlePaymentAdjustmentChange}>Payment Adjustment</a>
                                </li>}

                                {hasAcess(permissions, 'ORD_SETTLEMENT') &&
                                <li className="nav-item" role="presentation">
                                    <a className="nav-link" id="pills-payment-adjustment-ord-settlement-tab"
                                       data-toggle="pill" href="#pills-payment-adjustment-ord-settlement" role="tab"
                                       aria-controls="pills-payment-adjustment-ord-settlement" aria-selected="false"
                                       onClick={handleORDSettlementChange}>Commission Settlement</a>
                                </li>}

                                {hasAcess(permissions, 'CREDIT_DEBIT_NOTE') &&
                                <li className="nav-item" role="presentation">
                                    <a className="nav-link" id="pills-payment-adjustment-credit-debit-note-tab"
                                       data-toggle="pill" href="#pills-payment-adjustment-credit-debit-note" role="tab"
                                       aria-controls="pills-payment-adjustment-credit-debit-note" aria-selected="false"
                                       onClick={handleCreditDebitNoteChange}>Credit/Debit Note</a>
                                </li>}

                                {/* 
                                <li className="nav-item" role="presentation">
                                    <a className="nav-link" id="pills-payment-adjustment-profitability-analysis-tab"
                                       data-toggle="pill" href="#pills-payment-adjustment-profitability-analysis"
                                       role="tab" aria-controls="pills-payment-adjustment-profitability-analysis"
                                       aria-selected="false" onClick={handleProfitabilityAnalysisChange}>Profitability
                                        Analysis</a>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <a className="nav-link" id="pills-payment-adjustment-reports-tab" data-toggle="pill"
                                       href="#pills-payment-adjustment-reports" role="tab"
                                       aria-controls="pills-payment-adjustment-reports" aria-selected="false">Report</a>
                                </li> */}
                            </ul>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </>
    );
}