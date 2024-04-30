import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { CardBody } from "../../../../../../../../_metronic/_partials/controls";
import PaymentAdjustmentBreadCrum from '../../../../common/PaymentAdjustmentBreadCrum';
import { useHistory, Route } from 'react-router-dom';
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../../../../_metronic/_helpers";
import PaymentVerifyCollectionAmountView from "./PaymentVerifyCollectionAmountView";
import PaymentHistory from "./PaymentHistory";
import ApproveModal from "../approve/ApproveModal";
import RejectModal from "../approve/RejectModal";
import moment from "moment";

export default function AllVerifView({location}) {
    let history = useHistory();
    const [approve, setApprove] = useState(false)
    const [reject, setReject] = useState(false)
    const [rejectRemarks, setRejectRemarks] = useState("")
    const [data, setData] = useState(null)
    const [responseData, setResponseData] = useState();

    useEffect(()=>{ 
        setData(location.state.data);
    },[])

    const approveAndRejectUIEvents = {
        approveButtonClick: () => {
            history.push("/salescollection/payment-adjustment/payment-verify/view-verify/approve");
        },
        rejectButtonClick: () => {
            history.push("/salescollection/payment-adjustment/payment-verify/view-verify/reject");
        },
    };
    const handleBackToAllListPage = () => {
        history.push('/salescollection/payment-adjustment/payment-verify/all');
    }

    return (
        <>
            <Route path="/salescollection/payment-adjustment/payment-verify/view-verify/reject">
                {({ history, match }) => (
                    <RejectModal
                        paymentId={data && data.id}
                        setResponseData={setResponseData}
                        show={match != null}
                        onHide={() => {
                            history.push("/salescollection/payment-adjustment/payment-verify/view-verify");
                        }}
                        setReject={setReject}
                        setRejectRemarks = {setRejectRemarks}
                    />
                )}
            </Route>
            <Route path="/salescollection/payment-adjustment/payment-verify/view-verify/approve">
                {({ history, match }) => (
                    <ApproveModal 
                        paymentId={data && data.id}
                        setResponseData={setResponseData}
                        show={match != null}
                        onHide={() => {
                            history.push("/salescollection/payment-adjustment/payment-verify/view-verify");
                        }}
                        setApprove={setApprove}
                    />
                )}
            </Route>
            <div>
                {/* BREAD CRUM ROW */}
                <PaymentAdjustmentBreadCrum />
            </div>

            <div>
                <Card>
                    <CardBody>
                        {/* BACK AND TITLE ROW */}
                        <div className="row">
                            <div className="col-xl-4">
                                <span>
                                    <button className='btn' onClick={handleBackToAllListPage}>
                                        <strong>
                                            <i className="bi bi-arrow-left-short sales-booking-view-icon"></i>
                                        </strong>
                                    </button>
                                </span>
                            </div>
                            <div className="col-xl-4 text-center mt-3">
                                <strong>Payment Verify</strong>
                            </div>
                        </div>

                        {/* APPROVE BTN ROW */}
                        {
                            approve === false && reject === false ?
                                <div id="approve-rejet-btn-div" className="payment-verify-div mt-5 row">
                                    <div className="col-xl-6">
                                        <span><strong>Once payment is being approved it will show in the distributors’ ledger (Debit) referencing the Money Receipt No.
                                        </strong></span>
                                    </div>
                                    <div className="col-xl-6 mt-2">
                                        <button className="reject-btn float-right" onClick={approveAndRejectUIEvents.rejectButtonClick}>
                                            <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/reject.svg")} width="15px" height="15px" />&nbsp;
                                            Rejected
                                        </button>
                                        <button className="approve-btn text-white mr-5 float-right" onClick={approveAndRejectUIEvents.approveButtonClick}>
                                            <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/white-approved.svg")} width="15px" height="15px" />&nbsp;
                                            Approve
                                        </button>
                                    </div>
                                </div> : reject === false && approve === true ? 
                                    <div className="row light-success-bg p-5 rounded mt-5">
                                        <div className="col-3">
                                            <span className='dark-gray-color'><strong>Payment No.</strong></span><br />
                                            <span><strong>{responseData && responseData.paymentNo}</strong></span>
                                        </div>
                                        <div className="col-3">
                                            <span className='dark-gray-color'><strong>Approved Date</strong></span><br />
                                            <span><strong>{responseData && moment(responseData.actionTakenDate).format('DD MMM YYYY h:mm a')}</strong></span>
                                        </div>
                                        <div className="col-4">
                                            <span className='dark-gray-color'><strong>Approved By</strong></span><br />
                                            <span><strong>{responseData && responseData.actionTakenBy && responseData.actionTakenBy.name}
                                            <span className="text-muted display-inline-block">({
                                                responseData.actionTakenBy.designation && responseData.actionTakenBy.designation.name},&nbsp; 
                                                {responseData.company && responseData.company.name})</span></strong></span>
                                        </div>
                                        <div className="col-2">
                                            <span className="approved-btn float-right mt-3">
                                                <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/approved-done.svg")} width="15px" height="15px" />&nbsp;
                                                Approve
                                            </span>
                                        </div>
                                    </div> :
                                    <div>
                                        <div className="row reject-comment-div p-5 mt-5">
                                            <div className="col-3">
                                                <span className='dark-gray-color'><strong>Payment No.</strong></span><br />
                                                <span><strong>{responseData && responseData.paymentNo}</strong></span>
                                            </div>
                                            <div className="col-3">
                                                <span className='dark-gray-color'><strong>Rjected Date</strong></span><br />
                                                <span><strong>{responseData && moment(responseData.actionTakenDate).format('DD MMM YYYY h:mm a')}</strong></span>
                                            </div>
                                            <div className="col-4">
                                                <span className='dark-gray-color'><strong>Rejected By</strong></span><br />
                                                <span><strong>{responseData && responseData.actionTakenBy && responseData.actionTakenBy.name}
                                                <span className="text-muted display-inline-block">({
                                                responseData.actionTakenBy.designation && responseData.actionTakenBy.designation.name},&nbsp; 
                                                {responseData.company && responseData.company.name})</span></strong></span>
                                            </div>
                                            <div className="col-2">
                                                <span className="confirm-reject-span float-right mt-3">
                                                    <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/reject.svg")} width="15px" height="15px" />&nbsp;
                                                    Rejected
                                                </span>
                                            </div>
                                        </div>

                                        {/* WARNING ROW */}
                                        <div className="reject-note-div mt-5 row">
                                            <div className="col-12">
                                            <span>
                                                <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/warning.svg")} width="30px" height="30px" />&nbsp;
                                                <strong>Payment Rejection Notes</strong>
                                            </span><br /> 
                                            <span className="dark-gray-color">
                                                {rejectRemarks}
                                            </span>
                                            </div>
                                        </div>
                                    </div>


                        }

                        {/*  */}
                        <div className='row order-table mt-5 p-2'>
                            <div className='col-xl-4'>
                                <PaymentHistory data={data}/>
                            </div>
                            <div className='col-xl-8'>
                                <Card style={{ borderRadius: "25px" }}>
                                    <CardBody>
                                        <PaymentVerifyCollectionAmountView data={data}/>
                                    </CardBody>
                                </Card>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </>
    );
}