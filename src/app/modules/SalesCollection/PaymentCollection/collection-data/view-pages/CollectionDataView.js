import React, { useState, useEffect } from 'react';
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../../_metronic/_helpers";
import { useHistory, useLocation } from "react-router-dom";
import {
    Card,
    CardBody,
} from "../../../../../../_metronic/_partials/controls";
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import clsx from 'clsx';
import { useIntl } from "react-intl";
import axios from 'axios';
import { showError } from '../../../../../pages/Alert';
import { format, parse, isValid, parseISO } from 'date-fns';
import { CollectionSummaryTable } from "../collection-data-table/CollectionSummaryTable"
import { CollectionAmountTable } from "../collection-data-table/CollectionAmountTable"
import { InprogressPendingView } from "./InprogressPendingView"
import { VerifiedInprogresView } from "./VerifiedInprogresView"
import { DoneView } from './DoneView';
import { RejectToRejectView } from "./RejectToRejectView"
import { InprogrssPending } from "../card-reports/InprogrssPending"
import { DoneReports } from "../card-reports/DoneReports"
import { RejecToReject } from "../card-reports/RejecToReject"
import CollectionBreadCrum from '../../common/CollectionBreadCrum'
import CollectionTodaySales from "../../common/CollectionTodaySales"
const useStyles = makeStyles(() => ({
    root: {
        backgroundColor: 'white',
        boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.03)",
        padding: 8,
        borderRadius: '50%'
    },
}));
export function CollectionDataView() {
    const history = useHistory();
    const location = useLocation();
    const paymentInfo = location.state.state;

    const [activeStep, setActiveStep] = React.useState(0);
    const [paymentAdjustmentStatus, setPaymentAdjustmentStatus] = useState("");
    const [paymentAdjustmentInfo, setPaymentAdjustmentInfo] = useState([]);
    const [salesOfficerLocation, setSalesOfficerLocation] = useState([]);
    const [distributorLedger, setDistributorLedger] = useState([]);
    const [paymentOrdAdjustment, setPaymentOrdAdjustment] = useState("");

    const intl = useIntl();
    useEffect(() => {
        document.getElementById('pills-payment-collection-data-tab').classList.add('active');
        getPaymentAdjustmentStatus(paymentInfo.id);
        getPaymentOrdAdjustmentStatus(paymentInfo.id);
        getSalesOfficerLocation(paymentInfo.company.id, paymentInfo.collectionBy.id);
        getDistributorLedgerBalance(paymentInfo.company.id, paymentInfo.distributor.id, format(new Date(), "yyyy-MM-dd"));
    }, []);

    let paymentVerification = paymentInfo.approvalStatus;
    let paymentAdjustment = paymentAdjustmentStatus;
    let oRDCommissionAdjustment = paymentOrdAdjustment.ordAdjustedStatus;
    let ordAdjustedInfo = paymentOrdAdjustment.ordAdjustedInfo;
    const paymentDate = paymentInfo.paymentDate;
    const parsePaymentDate = format(parseISO(paymentDate), 'dd MMM yyyy HH:mm a');

    const CustomStepIcon = (props) => {
        const classes = useStyles();
        const stepIcons = {
            1: <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/ok.svg")} width="15px" height="15px" />,

            2: paymentVerification == "REJECTED" ? <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/reject.svg")} width="15px" height="15px" /> : paymentVerification == "APPROVED" ? <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/ok.svg")} width="15px" height="15px" /> : <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/status.svg")} width="15px" height="15px" />,

            3: paymentVerification == "REJECTED" ? <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/payment.svg")} width="15px" height="15px" />
                : paymentVerification == "APPROVED" && (paymentAdjustment == "Pending" || paymentAdjustment == "In Progress") ?
                    <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/payment-blue.svg")} width="15px" height="15px" /> :
                    paymentAdjustment == "Pending" ? <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/payment.svg")} width="15px" height="15px" /> :
                        paymentAdjustment == "In Progress" ? <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/payment-blue.svg")} width="15px" height="15px" /> :
                            <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/ok.svg")} width="15px" height="15px" />,

            4: paymentVerification == "REJECTED" ? <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/Adjustment.svg")} width="15px" height="15px" /> :
                paymentAdjustment == "Completed" && (oRDCommissionAdjustment == "Pending" || oRDCommissionAdjustment == "In Progress") ?
                    <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/payment-blue.svg")} width="15px" height="15px" style={{ color: "blue" }} /> :
                    oRDCommissionAdjustment == "Pending" ? <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/Adjustment.svg")} width="15px" height="15px" /> :
                        oRDCommissionAdjustment == "In Progress" ? <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/payment-blue.svg")} width="15px" height="15px" /> :
                            <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/ok.svg")} width="15px" height="15px" />,
        };

        return (
            <div className={clsx(classes.root)}>
                {stepIcons[String(props.icon)]}
            </div>
        );
    };
    const paymentCollectionDiv = <div className='text-center' style={{ fontSize: "0.83rem" }}>
        <span style={{ color: "#828282" }}>{intl.formatMessage({id: "COLLECTIONDATAVIEW.PAYMENT_COLLECTION"})}</span><br />
        <span className='text-muted'>{intl.formatMessage({id: "COLLECTIONDATAVIEW.PAYMENT_VERIFICATION"})}</span>&nbsp;<strong>{parsePaymentDate}</strong><br />
        <span style={{ color: "#828282" }}>{intl.formatMessage({id: "COLLECTIONDATAVIEW.PAYMENT_VERIFICATION"})}</span>&nbsp;<strong>{paymentInfo.paymentNature}</strong>
    </div>

    const paymentVerificationDiv = <div className='text-center' style={{ fontSize: "0.83rem" }}>
        <span style={{ color: "#828282" }}>Payment Verification</span><br />
        {/* <span className='text-muted'>Status</span>&nbsp; */}
        <strong
            style={
                paymentVerification === "DRAFT" || paymentVerification === "PENDING" ? { color: "#0396FF" } :
                    paymentVerification === "REJECTED" ? { color: "red" } :
                        { color: "#6fcf97" }
            }
        ><span className='text-muted'>Status</span>&nbsp;
            {
                paymentVerification === "DRAFT" || paymentVerification == "PENDING" ? "In Progress" :
                    paymentVerification === "APPROVED" ? "Verified" : paymentVerification
            }
        </strong>
    </div>

    const paymentAdjustmentDiv = <div className='text-center' style={{ fontSize: "0.83rem" }}>
        <span style={{ color: "#828282" }}>Payment Adjustment</span><br />
        <span className='text-muted'>Payment Adjustment</span>&nbsp;

        <strong
            style={
                paymentVerification === "APPROVED" && (paymentAdjustment === "Pending" || paymentAdjustment === "In Progress") ? { color: "#0396FF" } :
                    paymentAdjustment === "In Progress" ? { color: "#0396FF" } :
                        paymentAdjustment === "Pending" ? { color: "#828282" } :
                            paymentAdjustment == "Completed" ? { color: "#6fcf97" } :
                                { color: "red" }
            }
        >
            {   paymentVerification === "REJECTED"?"":
                paymentVerification === "APPROVED" && (paymentAdjustment === "Pending" 
                || paymentAdjustment === "In Progress") ? "In Progress" :
                    paymentAdjustment
            }
        </strong>

    </div>

    const oRDCommissionAdjustmentDiv = <div className='text-center' style={{ fontSize: "0.83rem" }}>
        <span style={{ color: "#828282" }}>ORD Commission Adjustment</span><br />
        <span className='text-muted'>ORD Commission Adjustment</span>&nbsp;

        <strong
            style={
                paymentAdjustment === "Completed" && (oRDCommissionAdjustment == "Pending" 
                || oRDCommissionAdjustment === "In Progress") ? { color: "#0396FF" } :
                    oRDCommissionAdjustment === "In Progress" ? { color: "#0396FF" } :
                        oRDCommissionAdjustment === "Pending" ? { color: "#828282" } :
                            oRDCommissionAdjustment === "Completed" ? { color: "#6fcf97" } :
                                { color: "red" }
            }
        >{ paymentVerification === "REJECTED"?"":paymentAdjustment === "Completed" && (oRDCommissionAdjustment == "Pending" 
        || oRDCommissionAdjustment === "In Progress") ? "In Progress" : oRDCommissionAdjustment}</strong>
    </div>

    const getSteps = () => {
        return [paymentCollectionDiv, paymentVerificationDiv, paymentAdjustmentDiv, oRDCommissionAdjustmentDiv];
    }
    const steps = getSteps();
    const handleBackCollectionDataChange = () => {
        history.push("/salescollection/payment-collection/collection-data")
    }

    const getPaymentAdjustmentStatus = (id) => {
        const URL = `${process.env.REACT_APP_API_URL}/api/payment-collection/payment-adjustment-status/${id}`;
        axios.get(URL).then(response => {
            const paymentAdjustmentStatus = response.data.data.paymentAdjustmentStatus;
            setPaymentAdjustmentStatus(paymentAdjustmentStatus);
            setPaymentAdjustmentInfo(response.data.data.paymentAdjustmentInfo);

        }).catch(err => {
            showError(intl.formatMessage({ id: "COMMON.ERROR_PAYMENTADJUSTMENT_STATUS_DATA" }));
        });
    }

    const getSalesOfficerLocation = (companyId, soId) => {
        const URL = `${process.env.REACT_APP_API_URL}/api/location/sales-officer-location/${companyId}/${soId}`;
        axios.get(URL).then(response => {
            const salesOfficerLocation = response.data.data.soLocationMap;
            setSalesOfficerLocation(salesOfficerLocation);
        }).catch(err => {

        });
    }

    const getDistributorLedgerBalance = (companyId, distributorId, asOnDate) => {
        let queryString = '?';
        queryString += 'companyId=' + companyId ;
        queryString += '&distributorId=' + distributorId;
        queryString += asOnDate ? '&asOnDate=' + asOnDate : '';
        const URL = `${process.env.REACT_APP_API_URL}/api/distributor/ledger-balance` + queryString;
        axios.get(URL).then(response => {
            const distributorLedger = response.data.data;
            setDistributorLedger(distributorLedger);
            console.log("distributorLedger",distributorLedger);
        }).catch(err => {

        });
    }

    const getPaymentOrdAdjustmentStatus = (id) => {
        const URL = `${process.env.REACT_APP_API_URL}/api/payment-collection-adjustment/overriding-discount-status/${id}`;
        axios.get(URL).then(response => {
            const ordAdjustedMap = response.data.data;
            console.log(ordAdjustedMap);
            setPaymentOrdAdjustment(ordAdjustedMap);
        }).catch(err => {
            showError(intl.formatMessage({ id: "COMMON.ERROR_ORD_ADJUSTMENT_STATUS_DATA" }));
        });
    }


    return (
        <>
            <div>
                {/* BREAD CRUM ROW */}
                <CollectionBreadCrum />
                {/* TODAY  ROW */}
                <CollectionTodaySales />
            </div>
            {/* CONTENT ROW */}
            <div>
                <Card>
                    <CardBody>
                        {/* HEADER ROW */}
                        <div className='row'>
                            <div className='col-xl-8 row'>
                                <span className=" mr-5">
                                    <button className='btn'
                                        onClick={handleBackCollectionDataChange}>
                                        <strong>
                                            <i class="bi bi-arrow-left-short sales-booking-view-icon"></i></strong>
                                    </button>
                                </span>
                                <span className="sales-booking-view-span mr-5">
                                    <span className="dark-gray-color"
                                        style={{ fontWeight: "500" }}>{intl.formatMessage({id: "COLLECTIONDATAVIEW.PAYMENT_NO"})}</span>
                                    <p><strong>{paymentInfo.paymentNo}</strong></p>
                                </span>
                                <span className="sales-booking-view-span  mr-5">
                                    <span className="dark-gray-color"
                                        style={{ fontWeight: "500" }}>{intl.formatMessage({id: "COLLECTIONDATAVIEW.NATURE"})}</span>
                                    <p><strong>{paymentInfo.paymentNature}</strong></p>
                                </span>

                                <span className="sales-booking-view-span mr-5">
                                    <span className="dark-gray-color"
                                        style={{ fontWeight: "500" }}>{salesOfficerLocation.location_type}</span>
                                    <p><strong>{salesOfficerLocation.location_name}</strong></p>
                                </span>
                            </div>
                            <div className='col-xl-4 d-flex justify-content-end'>
                                <div className="d-flex  mr-5">
                                    <div>
                                        {/* {distributorLedger.distributorLogo} */}
                                        <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/Avatar.svg")} width="35px" height="35px" />
                                    </div>
                                    <div className="ml-3">
                                        <span>
                                            <span style={{ fontWeight: "500" }}><strong>{paymentInfo.distributor.distributorName}</strong></span>
                                            <p className="dark-gray-color"><i class="bi bi-telephone-fill" style={{ fontSize: "10px" }}>
                                            </i>&nbsp;+{paymentInfo.distributor.contactNo}</p>
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <button className='btn sales-credit-btn' style={{ padding: "0px 15px", borderRadius: "13px" }}>
                                        <span className='text-white' style={{ fontSize: "0.83rem" }}>
                                            Credit Balance<br />
                                            {distributorLedger}
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        {/* STEPPER ROW */}
                        <div className='sales-booking-view-stepper row'>
                            <div className='col-xl-12'>
                                <Stepper activeStep={activeStep} alternativeLabel>
                                    {steps.map(label => (
                                        <Step key={label}>
                                            <StepLabel StepIconComponent={CustomStepIcon}>{label}</StepLabel>
                                        </Step>
                                    ))}
                                </Stepper>
                            </div>
                        </div>
                        <div className="mt-5">
                            <ul class="nav nav-pills mb-3" id="pills-tab-order" role="tablist">
                                <li class="nav-item" role="presentation">
                                    <a class="nav-link active" id="pills-collection-summary-tab" data-toggle="pill" href="#pills-collection-summary" role="tab" aria-controls="pills-collection-summary" aria-selected="true">Collection Summary</a>
                                </li>
                                <li class="nav-item" role="presentation">
                                    <a class="nav-link" id="pills-payment-activities-reports-tab" data-toggle="pill" href="#pills-payment-activities-reports" role="tab" aria-controls="pills-payment-activities-reports" aria-selected="false">Activities & Reports</a>
                                </li>
                            </ul>
                            <div class="tab-content" id="pills-tab-orderContent">
                                {/* ORDER SUMMARY */}
                                <div class="tab-pane fade show active" id="pills-collection-summary" role="tabpanel" aria-labelledby="pills-collection-summary-tab">
                                    <div className='row order-table'>
                                        <div className='col-xl-6'>
                                            <CollectionSummaryTable paymentInfo={paymentInfo} salesOfficerLocation={salesOfficerLocation} />
                                        </div>
                                        <div className='col-xl-6 mt-5'>
                                            <Card style={{ borderRadius: "25px" }}>
                                                <CardBody>
                                                    <CollectionAmountTable paymentInfo={paymentInfo} />
                                                </CardBody>
                                            </Card>
                                        </div>
                                    </div>
                                </div>

                                {/* ACTIVITIES AND REPORTS */}
                                <div class="tab-pane fade" id="pills-payment-activities-reports" role="tabpanel" aria-labelledby="pills-payment-activities-reports-tab">
                                    <div className='order-table row p-5'>
                                        <div className='col-xl-6'>
                                            {
                                                paymentVerification == "REJECTED" ?
                                                    <RejectToRejectView paymentVerification={paymentVerification}
                                                        paymentInfo={paymentInfo} salesOfficerLocation={salesOfficerLocation} /> :

                                                    <DoneView
                                                        oRDCommissionAdjustment={oRDCommissionAdjustment}
                                                        ordAdjustedInfo={ordAdjustedInfo}
                                                        paymentAdjustment={paymentAdjustment}
                                                        paymentAdjustmentInfo={paymentAdjustmentInfo}
                                                        paymentVerification={paymentVerification}
                                                        paymentInfo={paymentInfo}
                                                        salesOfficerLocation={salesOfficerLocation}
                                                    />

                                            }
                                        </div>
                                        <div className='col-xl-6'>
                                            <div>
                                                <div className='mt-3'>
                                                    <p className='report-title'>{intl.formatMessage({id: "COLLECTIONDATAVIEW.REPORTS"})}</p>
                                                </div>
                                            {
                                                paymentVerification == "REJECTED" ?
                                                <RejecToReject 
                                                paymentInfo={paymentInfo} /> :  
                                                <DoneReports 
                                                paymentInfo={paymentInfo}
                                                oRDCommissionAdjustment={oRDCommissionAdjustment}
                                                paymentAdjustment={paymentAdjustment}
                                                paymentVerification={paymentVerification}
                                                />
                                            }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </>
    );
}