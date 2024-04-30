import React from 'react';
import { Card } from 'react-bootstrap';
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../../_metronic/_helpers";
import { CardBody } from '../../../../../../_metronic/_partials/controls';
import { useIntl } from "react-intl";
import { format, parseISO } from 'date-fns';

export function InprogressPendingView (props) {
    const intl = useIntl();
    const paymentInfo = props.paymentInfo;
    const salesOfficerLocation = props.salesOfficerLocation;

    return (
        <>
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
                                        <span className='booking-activities-title'>Payment Collection</span>
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
        </>
    );
}