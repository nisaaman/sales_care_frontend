import React, {useEffect, useState} from 'react';
import SVG from "react-inlinesvg";
import {toAbsoluteUrl} from "../../../../../../../../_metronic/_helpers";
import {useHistory, useLocation} from "react-router-dom";
import {Card, CardBody} from "../../../../../../../../_metronic/_partials/controls";
import {makeStyles} from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import clsx from 'clsx';
import ProposalSummaryInfo from "./ProposalSummaryInfo";
import CreditDebitNoteTabs from '../../../../common/CreditDebitNoteTabs';
import PaymentAdjustmentBreadCrum from '../../../../common/PaymentAdjustmentBreadCrum';
import PaymentAdjustmentHeader from "../../../../common/PaymentAdjustmentHeader";
import ProposalSummaryReason from "./ProposalSummaryReason";
import ProposalActivities from "./ProposalActivities";
import ProposalReports from "./ProposalReports";
import axios from "axios";

const useStyles = makeStyles(() => ({
    root: {
        backgroundColor: 'white',
        boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.03)",
        padding: 8,
        borderRadius: '50%'
    },
}));
export default function ApprovalViewPage() {
    const history = useHistory();
    const routeLocation = useLocation();
    const [activeStep, setActiveStep] = React.useState(0);
    let [noteInfo, setNoteInfo] = useState({});
    let [uploadedFileInfo, setUploadedFileInfo] = useState({});
    let [depotAndLocationInfo, setDepotAndLocationInfo] = useState({});
    const [distributorLogo, setDistributorLogo] = useState("");
    const [distributorImg, setDistributorImg] = useState(toAbsoluteUrl("/images/copmanylogo.png"));

    useEffect(() => {
        document.getElementById('pills-payment-adjustment-credit-debit-note-tab').classList.add('active');
        document.getElementById('pills-payment-adjustment-credit-debit-note-approval-tab').classList.add('active');
        let info = routeLocation.state.state;
        setNoteInfo(info);
        getDepotAndLocationByCompanyAndDistributor({companyId: info.company_id, distributorId: info.distributor_id});
        getUploadedDocumentInfoByCreditDebitNoteId(info.credit_debit_note_id);
        getDistributorLogo(info.distributor_id);
    }, []);

    const getDistributorLogo = (distributorId) => {
        const URL = `${process.env.REACT_APP_API_URL}/api/distributor/logo/${distributorId}`;
        axios.get(URL).then(response => {
            const logo = response.data;
            setDistributorLogo(logo);
        }).catch(err => {

        });
    }

    const getDepotAndLocationByCompanyAndDistributor = (params) => {
        // const URL = `${process.env.REACT_APP_API_URL}/api/depot/get-depot-by-distributor-id/${params.companyId}/${params.distributorId}`;
        // axios.get(URL).then(response => {
        //     let dataMap = response.data.data;
        //     setDepotAndLocationInfo(dataMap);
        // }).catch(err => {

        // });
    }

    const getUploadedDocumentInfoByCreditDebitNoteId = (id) => {
        const URL = `${process.env.REACT_APP_API_URL}/api/credit-debit-note/get-document-info-by-note-id/${id}`;
        axios.get(URL).then(response => {
            let fileInfo = response.data.data;
            setUploadedFileInfo(fileInfo === null ? {} : fileInfo);
        }).catch(err => {

        });
    }

    const CustomStepIcon = (props) => {
        const classes = useStyles();
        const stepIcons = {
            1: <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/ok.svg")} width="15px" height="15px"/>,

            2: noteInfo.approval_status == "PENDING" ?
                <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/status.svg")} width="15px" height="15px"/> :
                noteInfo.approval_status == "REJECTED" ?
                    <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/reject.svg")} width="15px" height="15px"/> :
                    <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/ok.svg")} width="15px" height="15px"/>,

            3: noteInfo.approval_status == "APPROVED" ?
                <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/ok.svg")} width="15px" height="15px"/> :
                <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/gray-doller.svg")} width="15px" height="15px"/>,
        };

        return (
            <div className={clsx(classes.root)}>
                {stepIcons[String(props.icon)]}
            </div>
        );
    };
    const creditNoteProposalDiv = <div className='text-center' style={{fontSize: "0.83rem"}}>
        <span
            style={{color: "#828282"}}>{noteInfo.note_type === 'CREDIT' ? 'Credit' : 'Debit'} Note</span><br/>
        <span style={{color: "#828282"}}>Applied On</span>&nbsp;<strong>{noteInfo.note_created_date}</strong><br/>
        <span style={{color: "#828282"}}>Reason</span>&nbsp;<strong>{noteInfo.reason}</strong>
    </div>

    const creditNoteProposalApprovalDiv = <div className='text-center' style={{fontSize: "0.83rem"}}>
        <span
            style={{color: "#828282"}}>{noteInfo.note_type === 'CREDIT' ? 'Credit' : 'Debit'} Note Approval</span><br/>
        <strong><span style={{color: "#828282"}}>Status</span>&nbsp;
            <span
                className={
                    noteInfo.approval_status == "PENDING" ? 'text-success' :
                        noteInfo.approval_status == "REJECTED" ? "text-danger" :
                            noteInfo.approval_status == "APPROVED" ? "dark-success-color" :
                                "dark-gray-color"}
            >{noteInfo.approval_status}</span>
        </strong>
    </div>

    const balanceAdjustmentDiv = <div className='text-center' style={{fontSize: "0.83rem"}}>
        <span style={{color: "#828282"}}>Balance Adjustment</span><br/>
        <span style={{color: "#828282"}}><strong>Ledger Adjustment</strong> </span>&nbsp;
        <strong className={
            noteInfo.approval_status == "APPROVED" ? "dark-success-color" :
                "dark-gray-color"
        }>{
            noteInfo.approval_status == "APPROVED" ? "APPROVED" :
                noteInfo.approval_status == "REJECTED" ? "" :
                    "PENDING"
        }</strong>
    </div>
    const getSteps = () => {
        return [creditNoteProposalDiv, creditNoteProposalApprovalDiv, balanceAdjustmentDiv];
    }
    const steps = getSteps();
    const handleBackApprovalListPageChange = () => {
        history.push("/salescollection/payment-adjustment/credit-debit-note/approval-list")
    }

    return (
        <>
            <div>
                {/* BREAD CRUM ROW */}
                <PaymentAdjustmentBreadCrum/>
                {/* TODAY  ROW */}
                <PaymentAdjustmentHeader/>
            </div>
            <div>
                <CreditDebitNoteTabs/>
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
                                            onClick={handleBackApprovalListPageChange}>
                                        <strong>
                                            <i className="bi bi-arrow-left-short sales-booking-view-icon"></i></strong>
                                    </button>
                                </span>
                                <span className="sales-booking-view-span mr-5">
                                    <span className="dark-gray-color"
                                          style={{fontWeight: "500"}}>{noteInfo.note_type === 'CREDIT' ? 'Credit' : 'Debit'} Note No.</span>
                                    <p><strong>{noteInfo.note_no}</strong></p>
                                </span>
                                <span className="sales-booking-view-span  mr-5">
                                    <span className="dark-gray-color"
                                          style={{fontWeight: "500"}}>Depot</span>
                                    <p><strong>{depotAndLocationInfo?.depot_name}</strong></p>
                                </span>

                                <span className="sales-booking-view-span mr-5">
                                    <span className="dark-gray-color"
                                          style={{fontWeight: "500"}}>{depotAndLocationInfo?.location_type_name}</span>
                                    <p><strong>{depotAndLocationInfo?.location_name}</strong></p>
                                </span>
                            </div>
                            <div className='col-xl-4 d-flex justify-content-end'>
                                <div className="d-flex  mr-5">
                                    <div>
                                        {/* {distributorLedger.distributorLogo} */}
                                        <img className="image-input image-input-circle"
                                             src={distributorLogo === undefined || distributorLogo === "" || distributorLogo === null ? distributorImg : `data:image/png;base64,${distributorLogo}`}
                                             width="35px" height="35px" alt='Distributor’s Picture'/>
                                    </div>
                                    <div className="ml-3">
                                        <span>
                                            <span
                                                style={{fontWeight: "500"}}><strong>{noteInfo.distributor_name}</strong></span>
                                            <p className="dark-gray-color"><i className="bi bi-telephone-fill"
                                                                              style={{fontSize: "10px"}}>
                                            </i>&nbsp;{noteInfo.contact_no}</p>
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <button className='btn sales-credit-btn'
                                            style={{padding: "0px 15px", borderRadius: "13px"}}>
                                        <span className='text-white' style={{fontSize: "0.83rem"}}>
                                            Balance<br/>
                                            {Number(noteInfo.ledger_balance).toFixed(2)}
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

                        {/* TABS ROW */}
                        <div className="mt-5">
                            <ul className="nav nav-pills mb-3" id="pills-tab-order" role="tablist">
                                <li className="nav-item" role="presentation">
                                    <a className="nav-link active" id="pills-proposal-summary-tab" data-toggle="pill"
                                       href="#pills-proposal-summary" role="tab" aria-controls="pills-proposal-summary"
                                       aria-selected="true">Proposal Summary</a>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <a className="nav-link" id="pills-payment-activities-reports-tab" data-toggle="pill"
                                       href="#pills-payment-activities-reports" role="tab"
                                       aria-controls="pills-payment-activities-reports" aria-selected="false">Activities
                                        & Reports</a>
                                </li>
                            </ul>
                            <div className="tab-content" id="pills-tab-orderContent">
                                {/* PROPOSAL SUMMARY */}
                                <div className="tab-pane fade show active" id="pills-proposal-summary" role="tabpanel"
                                     aria-labelledby="pills-proposal-summary-tab">
                                    <div className='row order-table'>
                                        <div className='col-xl-6'>
                                            <ProposalSummaryInfo noteInfo={noteInfo}/>
                                        </div>
                                        <div className='col-xl-6 mt-5'>
                                            <Card style={{borderRadius: "25px"}}>
                                                <CardBody>
                                                    <ProposalSummaryReason noteInfo={noteInfo}
                                                                           uploadedFileInfo={uploadedFileInfo}/>
                                                </CardBody>
                                            </Card>
                                        </div>
                                    </div>
                                </div>

                                {/* ACTIVITIES AND REPORTS */}
                                <div className="tab-pane fade" id="pills-payment-activities-reports" role="tabpanel"
                                     aria-labelledby="pills-payment-activities-reports-tab">
                                    <div className='order-table row p-5'>
                                        <div className='col-xl-6'>
                                            <ProposalActivities/>
                                        </div>
                                        <div className='col-xl-6'>
                                            <div>
                                                <div className='mt-3'>
                                                    <p className='report-title'>Reports</p>
                                                </div>
                                                <ProposalReports/>
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