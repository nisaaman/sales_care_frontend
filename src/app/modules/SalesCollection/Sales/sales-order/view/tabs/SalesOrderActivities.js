import React from 'react';
import { Card } from 'react-bootstrap';
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../../../_metronic/_helpers";
import { CardBody } from '../../../../../../../_metronic/_partials/controls';
export function SalesOrderActivies() {
    return (
        <>

            <div className="timeline timeline-6 mt-3">
            <div className="timeline-item align-items-start">
                    <div className="timeline-label font-weight-bolder text-dark-75 font-size-lg">
                        <span className="booking-time-color">10:55 AM</span><br />
                        <span className="booking-time-color">15 APR 2022</span>
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
                                        <span className='booking-activities-title'>Delivery 1  [Chalan 12345678/Invoice 12354780]</span>
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
                    <div className="timeline-label font-weight-bolder text-dark-75 font-size-lg">
                        <span className="booking-time-color">12:55 AM</span><br />
                        <span className="booking-time-color">14 APR 2022</span>
                    </div>

                    <div className="timeline-badge">
                        <i className="fa fa-genderless icon-xl text-warning"></i>
                    </div>

                    <div className="timeline-content d-flex pl-5">
                        <div className='mr-5'><SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/Avatar.svg")} width="35px" height="35px" /></div>
                        <div>
                            <span className="font-weight-bolder text-dark-75">
                                Md. Moynul Hasan Shohagh
                            </span><br />
                            <span className="text-muted">
                                depot-In-Charge, Area(Chittagong)
                            </span>
                            <div className='mt-2'>
                                <Card className='booking-view-card'>
                                    <CardBody>
                                        <span className='booking-activities-title'>Stock Out  [Chalan 12345678/Invoice 12354780]</span>
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
                                        <span className='booking-activities-title'>Approved(2)</span>
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
                                        <span className='booking-activities-title'>Approved(1)</span>
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
                                        <span className='booking-activities-title'>Sales Booking Applied</span>
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