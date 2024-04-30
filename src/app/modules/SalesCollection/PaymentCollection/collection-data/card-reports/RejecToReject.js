import React from 'react';
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../../_metronic/_helpers";
import { useHistory, useLocation } from "react-router-dom";
import {
    Card,
    CardBody,
} from "../../../../../../_metronic/_partials/controls";
import { useIntl } from "react-intl";

export function RejecToReject(props) {

    const intl = useIntl();
    const paymentInfo = props.paymentInfo;

    return (
        <>
            <div>
                <Card className="collection-sales-booking-title">
                    <CardBody>
                        <div>
                            <p className='report-sales-booking-title'>
                            {intl.formatMessage({id: "REJECTTOREJECT.COLLECTION_VERIFICATION"})}
                            </p>
                        </div>

                        <div className='report-booking-bg row'>
                            <div className='col-xl-6 mt-3'>
                                <span className='report-booking-title'>{paymentInfo.paymentNo}</span>
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
                            {intl.formatMessage({id: "REJECTTOREJECT.PAYMENT_COLLECTION"})}
                            </p>
                        </div>

                        <div className='report-booking-bg row'>
                            <div className='col-xl-6 mt-3'>
                                <span className='report-booking-title'>{paymentInfo.paymentNo}</span>
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