import React from 'react';
import {Card} from 'react-bootstrap';
import SVG from "react-inlinesvg";
import {toAbsoluteUrl} from "../../../../../../../../_metronic/_helpers";
import {CardBody} from '../../../../../../../../_metronic/_partials/controls';

export default function ProposalActivities(props) {
    return (
        <>
            <div>
                <div className="timeline timeline-6 mt-3">
                    <div className="timeline-item align-items-start">
                        <div className="timeline-label">
                            <span className="booking-time-color">10:42 AM</span><br />
                            <span className="booking-time-color">10 APR 2022</span>
                        </div>

                        <div className="timeline-badge">
                            <i className="fa fa-genderless dark-success-color icon-xl"></i>
                        </div>

                        <div className="timeline-content d-flex pl-5">
                            <div className='mr-5'><SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/Avatar.svg")} width="35px" height="35px" /></div>
                            <div>
                                <span className="font-weight-bolder text-dark-75">
                                    Md. Habibur Hasan
                                </span><br />
                                <span className="text-muted">
                                    CEO, Babylon Agri-science Ltd.
                                </span>
                                <div className='mt-2'>
                                    <Card className='booking-view-card'>
                                        <CardBody>
                                            <span className='booking-activities-title'>Credit Note Proposal <span className='dark-success-color'>Approved</span></span>
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

                <div className="timeline timeline-6 mt-3">
                    <div className="timeline-item align-items-start">
                        <div className="timeline-label">
                            <span className="booking-time-color">10:42 AM</span><br />
                            <span className="booking-time-color">10 APR 2022</span>
                        </div>

                        <div className="timeline-badge">
                            <i className="fa fa-genderless dark-success-color icon-xl"></i>
                        </div>

                        <div className="timeline-content d-flex pl-5">
                            <div className='mr-5'><SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/Avatar.svg")} width="35px" height="35px" /></div>
                            <div>
                                <span className="font-weight-bolder text-dark-75">
                                    Md. Habibur Hasan
                                </span><br />
                                <span className="text-muted">
                                    CEO, Babylon Agri-science Ltd.
                                </span>
                                <div className='mt-2'>
                                    <Card className='booking-view-card'>
                                        <CardBody>
                                            <span className='booking-activities-title'>Credit Note Proposal <span className='dark-success-color'>Approved</span></span>
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

                <div className="timeline timeline-6 mt-3">
                    <div className="timeline-item align-items-start">
                        <div className="timeline-label">
                            <span className="booking-time-color">10:42 AM</span><br />
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
                                Accountant, Babylon Agri-science Ltd.
                                </span>
                                <div className='mt-2'>
                                    <Card className='booking-view-card'>
                                        <CardBody>
                                            <span className='booking-activities-title'>Credit Note Proposal <span className='dark-success-color'>Submited</span></span>
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
            </div>
        </>
    );
}