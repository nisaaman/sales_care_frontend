import React from 'react';
import { Card } from 'react-bootstrap';
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../../_metronic/_helpers";
import { CardBody } from '../../../../../../_metronic/_partials/controls';
import { format, parseISO } from 'date-fns';
import { useIntl } from "react-intl";

export function DoneView(props) {
    const intl = useIntl();
    const paymentVerification = props.paymentVerification;
    const paymentInfo = props.paymentInfo;
    const salesOfficerLocation = props.salesOfficerLocation;
    const paymentAdjustmentInfo = props.paymentAdjustmentInfo;
    const ordAdjustedInfo = props.ordAdjustedInfo;

    return (
        <>
            <div>
            {
                    ordAdjustedInfo !== null && ordAdjustedInfo !== "" && props.oRDCommissionAdjustment === "Completed"?
                    <div className="timeline timeline-6 mt-3">
                    <div className="timeline-item align-items-start">
                        <div className="timeline-label">
                        <span className="booking-time-color">{ordAdjustedInfo.proposal_date ==="undefined" 
                            || ordAdjustedInfo.proposal_date===null 
                            || ordAdjustedInfo.proposal_date==="" ? "": format(parseISO(ordAdjustedInfo.proposal_date), 'dd MMM yyyy')}</span>
                        </div>

                        <div className="timeline-badge">
                            <i className="fa fa-genderless text-primary icon-xl"></i>
                        </div>

                        <div className="timeline-content d-flex pl-5">
                            <div className='mr-5'><SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/Avatar.svg")} width="35px" height="35px" /></div>
                            <div>
                                <span className="font-weight-bolder text-dark-75">
                                {ordAdjustedInfo.name} 
                                </span><br />
                                <span className="text-muted">
                                {ordAdjustedInfo.designation_name} 
                                </span>
                                <div className='mt-2'>
                                    <Card className='booking-view-card'>
                                        <CardBody>
                                            <span className='booking-activities-title'>ORD Commission Adjustment&nbsp;
                                            <span style={{ color: "#6fcf97" }}>{props.oRDCommissionAdjustment}</span></span>
                                            <p className='booking-activities-details'>
                                            {intl.formatMessage({id: "DONEVIEW.ORD_COMMISSION_ADJUSTMENT"})}
                                            </p>
                                        </CardBody>
                                    </Card>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                    :""
                }

                {
                    props.paymentAdjustment == "Completed"?
                    <div className="timeline timeline-6 mt-3">
                    <div className="timeline-item align-items-start">
                        <div className="timeline-label">
                            <span className="booking-time-color">{paymentAdjustmentInfo.mapping_date=="undefined" 
                            || paymentAdjustmentInfo.mapping_date==null 
                            || paymentAdjustmentInfo.mapping_date=="" ? "": format(parseISO(paymentAdjustmentInfo.mapping_date), 'dd MMM yyyy')}</span><br />
                        </div>

                        <div className="timeline-badge">
                            <i className="fa fa-genderless text-primary icon-xl"></i>
                        </div>

                        <div className="timeline-content d-flex pl-5">
                            <div className='mr-5'><SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/Avatar.svg")} width="35px" height="35px" /></div>
                            <div>
                                <span className="font-weight-bolder text-dark-75">
                                    {paymentAdjustmentInfo.name}
                                </span><br />
                                <span className="text-muted">
                                {paymentAdjustmentInfo.designation_name}
                                </span>
                                <div className='mt-2'>
                                    <Card className='booking-view-card'>
                                        <CardBody>
                                            <span className='booking-activities-title'>{intl.formatMessage({id: "PAYMENT.PAYMENT_ADJUSTMENT"})}</span>
                                            <p className='booking-activities-details'>
                                                {/* {paymentAdjustmentInfo.} */}
                                            </p>
                                        </CardBody>
                                    </Card>
                                </div>
                            </div>
                        </div>
                    </div>
                    </div>
                    :""
                }
                
                {
                    props.paymentVerification === "APPROVED"?
                    <div className="timeline timeline-6 mt-3">
                    <div className="timeline-item align-items-start">
                        <div className="timeline-label">
                            <span className="booking-time-color">{format(parseISO(paymentInfo.actionTakenDate), 'HH:mm a')}</span><br />
                            <span className="booking-time-color">{format(parseISO(paymentInfo.actionTakenDate), 'dd MMM yyyy')}</span>
                        </div>

                        <div className="timeline-badge">
                            <i className="fa fa-genderless text-primary icon-xl"></i>
                        </div>

                        <div className="timeline-content d-flex pl-5">
                            <div className='mr-5'><SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/Avatar.svg")} width="35px" height="35px" /></div>
                            <div>
                                <span className="font-weight-bolder text-dark-75">
                                    {paymentInfo.actionTakenBy.name}
                                </span><br />
                                <span className="text-muted">
                                    {paymentInfo.collectionBy.designation.name}
                                </span>
                                <div className='mt-2'>
                                    <Card className='booking-view-card'>
                                        <CardBody>
                                            <span className='booking-activities-title'>Payment Verification <span style={{ color: "#6fcf97" }}>{paymentVerification == "APPROVED" ? "Verified" : ""}</span></span>
                                            <p className='booking-activities-details'>
                                                {paymentInfo.rejectReason}
                                            </p>
                                        </CardBody>
                                    </Card>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                    :""
                }
                <div className="timeline timeline-6 mt-3">
                    <div className="timeline-item align-items-start">
                        <div className="timeline-label">
                            <span className="booking-time-color">{format(parseISO(paymentInfo.paymentDate), 'HH:mm a')}</span><br />
                            <span className="booking-time-color">{format(parseISO(paymentInfo.paymentDate), 'dd MMM yyyy')}</span>
                        </div>

                        <div className="timeline-badge">
                            <i className="fa fa-genderless text-success icon-xl"></i>
                        </div>

                        <div className="timeline-content d-flex pl-5">
                            <div className='mr-5'><SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/Avatar.svg")} width="35px" height="35px" /></div>
                            <div>
                                <span className="font-weight-bolder text-dark-75">
                                    {paymentInfo.collectionBy.name}
                                </span><br />
                                <span className="text-muted">
                                    {paymentInfo.collectionBy.designation.name}, {salesOfficerLocation.location_type} ({salesOfficerLocation.location_name})
                                </span>
                                <div className='mt-2'>
                                    <Card className='booking-view-card'>
                                        <CardBody>
                                            <span className='booking-activities-title'>{intl.formatMessage({id: "PAYMENT.PAYMENT_COLLECTION"})}</span>
                                            <p className='booking-activities-details'>
                                                {paymentInfo.remarks}
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