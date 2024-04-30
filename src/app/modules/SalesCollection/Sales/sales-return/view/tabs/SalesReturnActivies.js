import React from 'react';
import { Card } from 'react-bootstrap';
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../../../_metronic/_helpers";
import { CardBody } from '../../../../../../../_metronic/_partials/controls';
export function SalesReturnActivies(props) {

    return (
        <>

            <div className="timeline timeline-6 mt-3">
               
               {
                props.qACheckStatus == "Pass" || props.qACheckStatus == "Fail" ? 
                <div className="timeline-item align-items-start">
                    <div className="timeline-label font-weight-bolder text-dark-75 font-size-lg">
                        <span className="booking-time-color">10:42 AM</span><br />
                        <span className="booking-time-color">10 APR 2022</span>
                    </div>

                    <div className="timeline-badge">
                        <i className="fa fa-genderless text-primary icon-xl"></i>
                    </div>

                    <div className="timeline-content d-flex pl-5">
                        <div className='mr-5'><SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/Avatar.svg")} width="35px" height="35px" /></div>
                        <div>
                            <span className="font-weight-bolder text-dark-75">
                                Md. Moynul Hasan Shohagh
                            </span><br />
                            <span className="text-muted">
                                Teritory Manager, Teritory (Cox’s Bazar)
                            </span>
                            <div className='mt-2'>
                                <Card className='booking-view-card'>
                                    <CardBody>
                                        <span className='booking-activities-title'>QA Check <span style={
                                            props.qACheckStatus == "Pass" ?
                                            { color: "#6fcf97" } :
                                            { color: "red" }
                                            }
                                            >{props.qACheckStatus}</span></span>
                                        <p className='booking-activities-details'>
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum.
                                        </p>
                                    </CardBody>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
                :""
               }


                {
                   props.storeReceiveStatus == "Quarantine" ?
                   <div className="timeline-item align-items-start">
                    <div className="timeline-label font-weight-bolder text-dark-75 font-size-lg">
                        <span className="booking-time-color">11:55 AM</span><br />
                        <span className="booking-time-color">11 APR 2022</span>
                    </div>

                    <div className="timeline-badge">
                        <i className="fa fa-genderless text-primary icon-xl"></i>
                    </div>

                    <div className="timeline-content d-flex pl-5">
                        <div className='mr-5'><SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/Avatar.svg")} width="35px" height="35px" /></div>
                        <div>
                            <span className="font-weight-bolder text-dark-75">
                                Md. Moynul Hasan Shohagh
                            </span><br />
                            <span className="text-muted">
                                Area Manager, Area(Chittagong)
                            </span>
                            <div className='mt-2'>
                                <Card className='booking-view-card'>
                                    <CardBody>
                                        <span className='booking-activities-title'>Store Receive <span style={{ color: "#6fcf97" }}>{props.storeReceiveStatus}(50)</span></span>
                                        <p className='booking-activities-details'>
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum.
                                        </p>
                                    </CardBody>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
                :""
                }
                
                {
                    props.returnProposalApprovalStatus == "Approved" ? 
                    <>
                    <div className="timeline-item align-items-start">
                    <div className="timeline-label">
                        <span className="booking-time-color">08:42 AM</span><br />
                        <span className="booking-time-color">10 APR 2022</span>
                    </div>

                    <div className="timeline-badge">
                        <i className="fa fa-genderless text-primary icon-xl"></i>
                    </div>

                    <div className="timeline-content d-flex pl-5">
                        <div className='mr-5'><SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/Avatar.svg")} width="35px" height="35px" /></div>
                        <div>
                            <span className="font-weight-bolder text-dark-75">
                                Md. Moynul Hasan Shohagh
                            </span><br />
                            <span className="text-muted">
                                Sales Officer, Teritory (Cox’s Bazar)
                            </span>
                            <div className='mt-2'>
                                <Card className='booking-view-card'>
                                    <CardBody>
                                        <span className='booking-activities-title'>Return Proposal Approval <span style={{ color: "#6fcf97" }}>{props.returnProposalApprovalStatus}(3)</span></span>
                                        <p className='booking-activities-details'>
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum.
                                        </p>
                                    </CardBody>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="timeline-item align-items-start">
                    <div className="timeline-label">
                        <span className="booking-time-color">08:42 AM</span><br />
                        <span className="booking-time-color">10 APR 2022</span>
                    </div>

                    <div className="timeline-badge">
                        <i className="fa fa-genderless text-primary icon-xl"></i>
                    </div>

                    <div className="timeline-content d-flex pl-5">
                        <div className='mr-5'><SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/Avatar.svg")} width="35px" height="35px" /></div>
                        <div>
                            <span className="font-weight-bolder text-dark-75">
                                Md. Moynul Hasan Shohagh
                            </span><br />
                            <span className="text-muted">
                                Sales Officer, Teritory (Cox’s Bazar)
                            </span>
                            <div className='mt-2'>
                                <Card className='booking-view-card'>
                                    <CardBody>
                                        <span className='booking-activities-title'>Return Proposal Approval <span style={{ color: "#6fcf97" }}>{props.returnProposalApprovalStatus}(2)</span></span>
                                        <p className='booking-activities-details'>
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum.
                                        </p>
                                    </CardBody>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="timeline-item align-items-start">
                    <div className="timeline-label">
                        <span className="booking-time-color">08:42 AM</span><br />
                        <span className="booking-time-color">10 APR 2022</span>
                    </div>

                    <div className="timeline-badge">
                        <i className="fa fa-genderless text-primary icon-xl"></i>
                    </div>

                    <div className="timeline-content d-flex pl-5">
                        <div className='mr-5'><SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/Avatar.svg")} width="35px" height="35px" /></div>
                        <div>
                            <span className="font-weight-bolder text-dark-75">
                                Md. Moynul Hasan Shohagh
                            </span><br />
                            <span className="text-muted">
                                Sales Officer, Teritory (Cox’s Bazar)
                            </span>
                            <div className='mt-2'>
                                <Card className='booking-view-card'>
                                    <CardBody>
                                        <span className='booking-activities-title'>Return Proposal Approval <span style={{ color: "#6fcf97" }}>{props.returnProposalApprovalStatus}(1)</span></span>
                                        <p className='booking-activities-details'>
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum.
                                        </p>
                                    </CardBody>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
                </>
                :""
                }

                <div className="timeline-item align-items-start">
                    <div className="timeline-label">
                        <span className="booking-time-color">08:42 AM</span><br />
                        <span className="booking-time-color">10 APR 2022</span>
                    </div>

                    <div className="timeline-badge">
                        <i className="fa fa-genderless text-success icon-xl"></i>
                    </div>

                    <div className="timeline-content d-flex pl-5">
                        <div className='mr-5'><SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/Avatar.svg")} width="35px" height="35px" /></div>
                        <div>
                            <span className="font-weight-bolder text-dark-75">
                                Md. Moynul Hasan Shohagh
                            </span><br />
                            <span className="text-muted">
                                Sales Officer, Teritory (Cox’s Bazar)
                            </span>
                            <div className='mt-2'>
                                <Card className='booking-view-card'>
                                    <CardBody>
                                        <span className='booking-activities-title'>Return Proposal <span style={{ color: "#6fcf97" }}>Submited</span></span>
                                        <p className='booking-activities-details'>
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum.
                                        </p>
                                    </CardBody>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
        </>
    );
}