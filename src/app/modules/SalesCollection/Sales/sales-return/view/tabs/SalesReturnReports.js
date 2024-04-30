import React from 'react';
import { Card } from 'react-bootstrap';
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../../../_metronic/_helpers";
import { CardBody } from '../../../../../../../_metronic/_partials/controls';
export default function SalesReturnReports(props) {

    return (
        <>
            <div>
                <div className='mt-3'>
                    <p className='report-title'>Reports</p>
                </div>
                {
                     props.qACheckStatus == "Pass" || props.qACheckStatus == "Fail"  ?
                        <Card className="reports-card-delivery mt-5">
                            <CardBody className="common-report-card">
                                <div>
                                    <p className='report-sales-booking-title'>
                                    QA Check
                                    </p>
                                </div>

                                <div className='report-booking-bg row'>
                                    <div className='col-xl-6 mt-3'>
                                        <span className='report-booking-title'>QA Check No. FF124568</span>
                                    </div>
                                    <div className='col-xl-6 d-flex justify-content-end'>
                                        <button className='btn'><SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/share.svg")} width="15px" height="15px" /></button>
                                        <button className='btn'><SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/view.svg")} width="15px" height="15px" /></button>
                                        <button className='btn'><SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/download.svg")} width="15px" height="15px" /></button>
                                    </div>
                                </div>
                            </CardBody>
                        </Card> 
                         : ""
                }
                {
                     props.storeReceiveStatus == "Quarantine" ?
                        <Card className="reports-card-delivery mt-5">
                            <CardBody className="common-report-card">
                                <div>
                                    <p className='report-sales-booking-title'>
                                    Store Activity
                                    </p>
                                </div>

                                <div className='report-booking-bg row'>
                                    <div className='col-xl-6 mt-3'>
                                        <span className='report-booking-title'>Store Activity No. FF124568</span>
                                    </div>
                                    <div className='col-xl-6 d-flex justify-content-end'>
                                        <button className='btn'><SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/share.svg")} width="15px" height="15px" /></button>
                                        <button className='btn'><SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/view.svg")} width="15px" height="15px" /></button>
                                        <button className='btn'><SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/download.svg")} width="15px" height="15px" /></button>
                                    </div>
                                </div>
                            </CardBody>
                        </Card> 
                         : ""
                }
                {
                     props.returnProposalApprovalStatus == "Approved" ?
                     <>
                        <Card className="reports-card-delivery mt-5">
                            <CardBody className="common-report-card">
                                <div>
                                    <p className='report-sales-booking-title'>
                                    Return Proposal Approval (3)
                                    </p>
                                </div>

                                <div className='report-booking-bg row'>
                                    <div className='col-xl-6 mt-3'>
                                        <span className='report-booking-title'>Return Proposal Approval No. FF124568</span>
                                    </div>
                                    <div className='col-xl-6 d-flex justify-content-end'>
                                        <button className='btn'><SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/share.svg")} width="15px" height="15px" /></button>
                                        <button className='btn'><SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/view.svg")} width="15px" height="15px" /></button>
                                        <button className='btn'><SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/download.svg")} width="15px" height="15px" /></button>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                        <Card className="reports-card-delivery mt-5">
                            <CardBody className="common-report-card">
                                <div>
                                    <p className='report-sales-booking-title'>
                                    Return Proposal Approval (2)
                                    </p>
                                </div>

                                <div className='report-booking-bg row'>
                                    <div className='col-xl-6 mt-3'>
                                        <span className='report-booking-title'>Return Proposal Approval No. FF124568</span>
                                    </div>
                                    <div className='col-xl-6 d-flex justify-content-end'>
                                        <button className='btn'><SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/share.svg")} width="15px" height="15px" /></button>
                                        <button className='btn'><SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/view.svg")} width="15px" height="15px" /></button>
                                        <button className='btn'><SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/download.svg")} width="15px" height="15px" /></button>
                                    </div>
                                </div>
                            </CardBody>
                        </Card> 
                        <Card className="reports-card-delivery mt-5">
                            <CardBody className="common-report-card">
                                <div>
                                    <p className='report-sales-booking-title'>
                                    Return Proposal Approval (1)
                                    </p>
                                </div>

                                <div className='report-booking-bg row'>
                                    <div className='col-xl-6 mt-3'>
                                        <span className='report-booking-title'>Return Proposal Approval No. FF124568</span>
                                    </div>
                                    <div className='col-xl-6 d-flex justify-content-end'>
                                        <button className='btn'><SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/share.svg")} width="15px" height="15px" /></button>
                                        <button className='btn'><SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/view.svg")} width="15px" height="15px" /></button>
                                        <button className='btn'><SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/download.svg")} width="15px" height="15px" /></button>
                                    </div>
                                </div>
                            </CardBody>
                        </Card> 
                        </>
                         : ""
                }
                <Card className="booking-reports-card mt-5">
                    <CardBody className="common-report-card">
                        <div>
                            <p className='report-sales-booking-title'>
                                Return Proposal
                            </p>
                        </div>

                        <div className='report-booking-bg row'>
                            <div className='col-xl-6 mt-3'>
                                <span className='report-booking-title'>Return Proposal No. FF124568</span>
                            </div>
                            <div className='col-xl-6 d-flex justify-content-end'>
                                <button className='btn'><SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/share.svg")} width="15px" height="15px" /></button>
                                <button className='btn'><SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/view.svg")} width="15px" height="15px" /></button>
                                <button className='btn'><SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/download.svg")} width="15px" height="15px" /></button>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </>
    );
}