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
import { useIntl } from 'react-intl';
import SalesTabsHeader from "../../common/SalesTabsHeader";
import { BreadCrum } from "../../common/BreadCrum";
import { SalesReturnActivies } from "./tabs/SalesReturnActivies";
import SalesReturnReports from "./tabs/SalesReturnReports";
import ReturnSummaryInformation from "./tabs/ReturnSummaryInformation";
import ReturnSummaryList from "./tabs/ReturnSummaryList";
import axios from 'axios';
import { dateFormatPattern } from '../../../../Util';
import moment from 'moment';


const useStyles = makeStyles(() => ({
    root: {
        backgroundColor: 'white',
        boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.03)",
        padding: 8,
        borderRadius: '50%'
    },
}));
export function SalesReturnView() {
    const history = useHistory();
    const location = useLocation();
    const intl = useIntl();
    const [activeStep, setActiveStep] = useState(0);
    const [returnProposalApprovalStatus, setReturnProposalApprovalStatus] = useState("");
    const [storeReceiveStatus, setStoreReceiveStatus] = useState("Quarantine");
    const [qACheckStatus, setQACheckStatus] = useState("Pass");
    const [stockInStatus, setStockInStatus] = useState("Regular");
    const [salesReturnProposalLifeCycle, setSalesReturnProposalLifeCycle] = useState('');
    const [salesReturnProposalDetails, setSalesReturnProposalDetails] = useState([]);
    const [salesReturnProposalSummary, setSalesReturnProposalSummary] = useState('');
    const [distributorInfo, setDistributorInfo] = useState('');
    const [totalSalesReturnProposalAmount, setTotalSalesReturnProposalAmount] = useState('');
    const [totalSalesReturnAmount, setTotalSalesReturnAmount] = useState('');
    const [totalReturnQuantity, setTotalReturnQuantity] = useState('');
    const salesReturnProposal = location.state.state;
    
    useEffect(() => {
        document.getElementById('pills-sales-return-tab').classList.add('active')
        getSalesReturnProposalDetails();
    }, []);

    const getSalesReturnProposalDetails = () => {
      
        const URL = `${process.env.REACT_APP_API_URL}/api/sales-return-proposal-data/details-view/${salesReturnProposal.id}`;
        axios.get(URL).then(response => {
            // alert(response.data.data.salesReturnProposalLifeCycle.approvalStatus)
            setSalesReturnProposalLifeCycle(response.data.data.salesReturnProposalLifeCycle);
            setSalesReturnProposalDetails(response.data.data.salesReturnProposalDetails);
            setSalesReturnProposalSummary(response.data.data.salesReturnProposalSummary);
            setDistributorInfo(response.data.data.distributorInfo);
            setReturnProposalApprovalStatus(response.data.data.salesReturnProposalLifeCycle.approvalStatus);
            setTotalSalesReturnProposalAmount(response.data.data.salesReturnProposalDetails.reduce((total, salesReturnProposal) => 
                total = total + salesReturnProposal.returnProposalAmount, 0));
            setTotalSalesReturnAmount(response.data.data.salesReturnProposalDetails.reduce((total, salesReturnProposal) => 
                total = total + salesReturnProposal.returnAmount, 0));
            setTotalReturnQuantity(response.data.data.salesReturnProposalDetails.reduce((total, salesReturnProposal) => 
            total = total + salesReturnProposal.returnQuantity, 0)); 
        }).catch();
    }

    const handleBackToSalesReturnPage = () => {
        history.push("/salescollection/sales/sales-return")
    }
    const CustomStepIcon = (props) => {
        const classes = useStyles();
        const stepIcons = {
            1: <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/ok.svg")} width="15px" height="15px" />,
            2: returnProposalApprovalStatus === "PENDING" || returnProposalApprovalStatus === "PENDING" ?
                <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/ProposalApproval.svg")} width="15px" height="15px" /> :
                returnProposalApprovalStatus === "Reject" ? <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/reject.svg")} width="15px" height="15px" /> :
                    <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/ok.svg")} width="15px" height="15px" />,
            3: returnProposalApprovalStatus === "APPROVED" && (qACheckStatus !== "Pass" || qACheckStatus=== "Fail") ?
                <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/store-blue.svg")} width="15px" height="15px" /> :
                    storeReceiveStatus === "Quarantine" && qACheckStatus === "Pass"?
                <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/ok.svg")} width="15px" height="15px" />:
                <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/store.svg")} width="15px" height="15px" />
               ,
            4: storeReceiveStatus === "Quarantine"?
            <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/ok.svg")} width="15px" height="15px" />:
            <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/payment.svg")} width="15px" height="15px" />
            ,
        };

        return (
            <div className={clsx(classes.root)}>
                {stepIcons[String(props.icon)]}
            </div>
        );

    };
    const returnProposalDiv = <div className='text-center' style={{ fontSize: "0.83rem" }}>
        <span style={{ color: "#828282" }}>{intl.formatMessage({ id: "SALES.RETURN.RETURN_PROPOSAL" })}</span><br />
        <span className='text-muted'>{intl.formatMessage({ id: "COMMON.APPLIED_ON" })}</span>&nbsp;<strong>{moment(salesReturnProposalLifeCycle.proposalDate).format(dateFormatPattern())}</strong><br />
        <span className='text-muted'>{intl.formatMessage({ id: "SALES.RETURN.RETURN_REASON" })}</span>&nbsp;
        <strong>{salesReturnProposalLifeCycle.returnReason}</strong>
    </div>;
    const returnProposalApprovalDiv = <div className='text-center' style={{ fontSize: "0.83rem" }}>
        <span style={{ color: "#828282" }}>{intl.formatMessage({ id: "SALES.RETURN.RETURN_PROPOSAL_APPROVAL" })}</span><br />
        <span className='text-muted'>{intl.formatMessage({ id: "COMMON.STATUS" })}</span>&nbsp;
        <strong
            style={
                returnProposalApprovalStatus === "In Progress" || returnProposalApprovalStatus === "Pending" ? { color: "#0396FF" } :
                    returnProposalApprovalStatus === "Approved" ? { color: "#6fcf97" } :
                        { color: "red" }
            }
        >{returnProposalApprovalStatus}</strong>
    </div>;
    const storeActivityDiv = <div className='text-center' style={{ fontSize: "0.83rem" }}>
        <span style={{ color: "#828282" }}>{intl.formatMessage({ id: "SALES.RETURN.STORE_ACTIVITY" })}</span><br />

        {/* STORE RECEIVE */}
        <span className='text-muted'>{intl.formatMessage({ id: "SALES.RETURN.STORE_RECEIVE" })}</span>&nbsp;
        <strong style={
            salesReturnProposalLifeCycle.receiveDate !== "" && storeReceiveStatus === "Quarantine" ? { color: "#0396FF" } :{ color: "#828282" }
        }>{returnProposalApprovalStatus === "Reject"?"":storeReceiveStatus}&nbsp;<br/>{salesReturnProposalLifeCycle.receiveDate ? moment(salesReturnProposalLifeCycle.receiveDate).format(dateFormatPattern()) : ''}</strong><br />

        {/* QA CHECK */}
        {/* <span className='text-muted'>{intl.formatMessage({ id: "SALES.RETURN.QA_CHECK" })}</span>&nbsp;
        <strong style={
            storeReceiveStatus == "Quarantine" && qACheckStatus == "Pass" ? { color: "#6fcf97" } :
            storeReceiveStatus == "Quarantine" && qACheckStatus == "Fail" ? { color: "red" } : {}
        }>{returnProposalApprovalStatus=="Reject"?"":qACheckStatus}</strong><br /> */}

        {/* STOCK IN */}
        {/* <span className='text-muted'>{intl.formatMessage({ id: "SALES.RETURN.STOCK_IN" })}</span>&nbsp;
        <strong style={
            storeReceiveStatus == "Quarantine" && qACheckStatus == "Pass" ? { color: "#6fcf97" } :
            storeReceiveStatus == "Quarantine" && qACheckStatus == "Fail" ? { color: "red" } : {}
        }>{returnProposalApprovalStatus=="Reject"?"":stockInStatus}</strong> */}
    </div>;
    const ledgerAdjustmentDiv = <div className='text-center' style={{ fontSize: "0.83rem" }}> 
        <span style={{ color: "#828282" }}>{intl.formatMessage({ id: "SALES.RETURN.LEDGER_ADJUSTMENT" })}</span><br />
        <span className='text-muted'>{intl.formatMessage({ id: "SALES.RETURN.LEDGER_ADJUSTMENT" })}</span>&nbsp;
        <strong
            style={
                salesReturnProposalSummary.salesReturnNo ?{ color: "#6fcf97" }:{}
            }
        >{salesReturnProposalSummary.salesReturnNo  ? "Done" : "Pending"}</strong>
        
    </div>;
    const getSteps = () => {
        return [returnProposalDiv, returnProposalApprovalDiv, storeActivityDiv, ledgerAdjustmentDiv];
    }
    const steps = getSteps();
    return (
        <>
            <div>
                {/* BREAD CRUM ROW */}
                <BreadCrum />
                {/* TODAY SALE ROW */}
                <SalesTabsHeader />
            </div>
            {/* CONTENT ROW */}
            <div>
                <Card>
                    <CardBody>
                        {/* HEADER ROW */}
                        <div className='row'>
                            {/* HEADER LEFT SIDE ROW START */}
                            <div className='col-xl-8 row'>
                                <span className=" mr-5">
                                    <button className='btn' onClick={handleBackToSalesReturnPage}>
                                        <strong>
                                            <i className="bi bi-arrow-left-short sales-booking-view-icon"></i>
                                        </strong>
                                    </button>
                                </span>
                                <span className="sales-booking-view-span mr-5">
                                    <span className="dark-gray-color"
                                        style={{ fontWeight: "500" }}>{intl.formatMessage({ id: "SALES.RETURN.RETURN_PROPOSAL_NO" })}</span>
                                    <p><strong>{salesReturnProposalSummary.proposalNo}</strong></p>
                                </span>
                                <span className="sales-booking-view-span  mr-5">
                                    <span className="dark-gray-color"
                                        style={{ fontWeight: "500" }}>{intl.formatMessage({ id: "DEPOT.DEPOT" })}</span>
                                    <p><strong>{salesReturnProposal.depotName}</strong></p>
                                </span>
                                {/* <span className="sales-booking-view-span mr-5">
                                    <span className="dark-gray-color"
                                        style={{ fontWeight: "500" }}>{intl.formatMessage({ id: "LOCATION.TERITORY" })}</span>
                                    <p><strong>{salesReturnProposal.locationName}</strong></p>
                                </span> */}
                            </div>
                            {/* HEADER LEFT SIDE ROW END */}

                            {/* HEADER RIGHT SIDE ROW START */}
                            <div className='col-xl-4 d-flex justify-content-end'>
                                <div className="d-flex  mr-5">
                                    <div>
                                        <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/Avatar.svg")} width="35px" height="35px" />
                                    </div>
                                    <div className="ml-3">
                                        <span>
                                            <span style={{ fontWeight: "500" }}><strong>{distributorInfo.distributorName}</strong></span>
                                            <p className="dark-gray-color">
                                                <i className="bi bi-telephone-fill" style={{ fontSize: "10px" }}></i>&nbsp;{distributorInfo.contactNo}
                                            </p>
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <button className='btn sales-credit-btn' style={{ padding: "0px 15px", borderRadius: "13px" }}>
                                        <span className='text-white' style={{ fontSize: "0.83rem" }}>
                                            {intl.formatMessage({ id: "SALES.RETURN.BALANCE" })}<br />
                                            {Number(distributorInfo.ledgerBalance).toLocaleString('en-US', {minimumFractionDigits: 2})}
                                        </span>
                                    </button>
                                </div>
                            </div>
                            {/* HEADER RIGHT SIDE ROW END */}
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

                        {/* TAB ROW */}
                        <div className="mt-5">

                            {/* TAB TITLE */}
                            <ul className="nav nav-pills mb-3" id="pills-tab-order" role="tablist">
                                <li className="nav-item" role="presentation">
                                    <a className="nav-link active" id="pills-order-summary-tab" data-toggle="pill"
                                        href="#pills-order-summary" role="tab" aria-controls="pills-order-summary"
                                        aria-selected="true">{intl.formatMessage({ id: "SALES.RETURN.RETURN_SUMMARY" })}</a>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <a className="nav-link" id="pills-activities-reports-tab" data-toggle="pill"
                                        href="#pills-activities-reports" role="tab" aria-controls="pills-activities-reports"
                                        aria-selected="false">{intl.formatMessage({ id: "COMMON.ACTIVITIES_AND_REPORTS" })}</a>
                                </li>
                            </ul>

                            {/* TAB CONTENT ROW */}
                            <div className="tab-content" id="pills-tab-orderContent">

                                {/* RETURN SUMMARY */}
                                <div className="tab-pane fade show active" id="pills-order-summary" role="tabpanel" aria-labelledby="pills-order-summary-tab">
                                    <div className='row order-table'>
                                        <div className='col-xl-4'>
                                            <ReturnSummaryInformation 
                                            salesReturnProposalSummary = {salesReturnProposalSummary}
                                            totalSalesReturnProposalAmount = {totalSalesReturnProposalAmount}
                                            totalSalesReturnAmount = {totalSalesReturnAmount}
                                            totalReturnQuantity = {totalReturnQuantity}/>
                                        </div>
                                        <div className='col-xl-8 mt-5'>
                                            <Card style={{ borderRadius: "25px" }}>
                                                <CardBody>
                                                    <ReturnSummaryList
                                                        returnProposalApprovalStatus={returnProposalApprovalStatus}
                                                        salesReturnProposalDetails={salesReturnProposalDetails}
                                                    />
                                                </CardBody>
                                            </Card>
                                        </div>
                                    </div>
                                </div>

                                {/* ACTIVITIES AND REPORTS */}
                                <div className="tab-pane fade" id="pills-activities-reports" role="tabpanel" aria-labelledby="pills-activities-reports-tab">

                                    <div className='order-table row p-5'>

                                        {/* ACTIVITIES AND REPORTS LEFT SIDE ROW */}
                                        <div className='col-xl-6'>
                                            <SalesReturnActivies 
                                            returnProposalApprovalStatus = {returnProposalApprovalStatus} 
                                            storeReceiveStatus = {storeReceiveStatus}
                                            qACheckStatus = {qACheckStatus}
                                            stockInStatus = {stockInStatus}
                                            />
                                        </div>

                                        {/* ACTIVITIES AND REPORTS RIGHT SIDE ROW */}
                                        <div className='col-xl-6'>
                                        <SalesReturnReports 
                                        returnProposalApprovalStatus = {returnProposalApprovalStatus} 
                                        storeReceiveStatus = {storeReceiveStatus}
                                        qACheckStatus = {qACheckStatus}
                                        stockInStatus = {stockInStatus}
                                        />
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