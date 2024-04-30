import React from 'react';
import SVG from "react-inlinesvg";
import {toAbsoluteUrl} from "../../../../../../../../_metronic/_helpers";
import {Card, CardBody,} from "../../../../../../../../_metronic/_partials/controls";


export default function ProposalReports(props) {

    return (
        <>
            <div>
                <Card className="reports-card-delivery">
                    <CardBody>
                        <div>
                            <p className='report-sales-booking-title'>
                                Balance Adjustment
                            </p>
                        </div>

                        <div className='report-booking-bg row'>
                            <div className='col-xl-6 mt-3'>
                                <span className='report-booking-title'>Credit Note No. FF124568</span>
                            </div>
                            <div className='col-xl-6 d-flex justify-content-end'>
                                <button className='btn'><SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/share.svg")} width="15px" height="15px" /></button>
                                <button className='btn'><SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/view.svg")} width="15px" height="15px" /></button>
                                <button className='btn'><SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/download.svg")} width="15px" height="15px" /></button>
                            </div>
                        </div>
                    </CardBody>
                </Card>
                <Card className="reports-card-delivery">
                    <CardBody>
                        <div>
                            <p className='report-sales-booking-title'>
                                Credit Note Proposal Approval
                            </p>
                        </div>

                        <div className='report-booking-bg row'>
                            <div className='col-xl-6 mt-3'>
                                <span className='report-booking-title'>Credit Note Proposal No. FF124568</span>
                            </div>
                            <div className='col-xl-6 d-flex justify-content-end'>
                                <button className='btn'><SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/share.svg")} width="15px" height="15px" /></button>
                                <button className='btn'><SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/view.svg")} width="15px" height="15px" /></button>
                                <button className='btn'><SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/download.svg")} width="15px" height="15px" /></button>
                            </div>
                        </div>
                    </CardBody>
                </Card>
                <Card className="booking-reports-card">
                    <CardBody>
                        <div>
                            <p className='report-sales-booking-title'>
                                Credit Note Proposal
                            </p>
                        </div>

                        <div className='report-booking-bg row'>
                            <div className='col-xl-6 mt-3'>
                                <span className='report-booking-title'>Credit Note Proposal No. FF124568</span>
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