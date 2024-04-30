import React, { useState } from "react";
import { Card } from "react-bootstrap";
import { CardBody } from "../../../../../../../../../_metronic/_partials/controls";
import { toAbsoluteUrl } from "../../../../../../../../../_metronic/_helpers";
import SVG from "react-inlinesvg";

export default function NoNeedTickets() {
    return (
        <>
            {/* FOR TICKETS ROW */}
            <Card className="mt-3 h-100 pt-5">
                <CardBody>
                    <div>
                        <span>QTY.&nbsp;</span>
                        <strong>N/A</strong><br />
                        <small className="text-muted">(UOM N/A Kg)</small>
                    </div>
                    <div className="mt-5" style={{ border: "1px solid #F2F2F2", width: "100%" }}></div>
                    <div className="mt-3">
                        <div>
                            <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/no-need-gray.svg")} />&nbsp;
                            <small className="dark-gray-color">No Need To Apply For Tickets</small>
                        </div>
                    </div>
                </CardBody>
            </Card>
        </>
    );
}