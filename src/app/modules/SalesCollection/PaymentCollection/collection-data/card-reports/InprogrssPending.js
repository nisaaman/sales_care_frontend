import React from 'react';
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../../_metronic/_helpers";
import {
    Card,
    CardBody,
} from "../../../../../../_metronic/_partials/controls";

export function InprogrssPending() {
    return (
        <>
            <div>
                <Card className="booking-reports-card">
                    <CardBody>
                        <div>
                            <p className='report-sales-booking-title'>
                                Payment Collection
                            </p>
                        </div>

                        <div className='report-booking-bg row'>
                            <div className='col-xl-6 mt-3'>
                                <span className='report-booking-title'>Payment No. FF124568</span>
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