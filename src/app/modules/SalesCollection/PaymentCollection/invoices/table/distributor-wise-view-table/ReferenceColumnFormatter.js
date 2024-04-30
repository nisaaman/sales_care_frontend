import React from "react";
import {OverlayTrigger, Tooltip} from "react-bootstrap";
import SVG from "react-inlinesvg";
import {toAbsoluteUrl} from "../../../../../../../_metronic/_helpers";

export const ReferenceColumnFormatter = (cellContent, row, rowIndex, {acknowledgeDocumentDownload}) => (
    row.isAccepted == true ?
        <>
            <OverlayTrigger overlay={<Tooltip id="products-edit-tooltip">Reference Download</Tooltip>}>
                <div className="btn btn-icon btn-light btn-hover-success btn-sm mx-3"
                     onClick={() => acknowledgeDocumentDownload(row)}>
                    {row.isAccepted}
                    <span className="svg-icon svg-icon-sm svg-icon-success">
                    <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/blueDownload.svg")}/>
                </span>
                </div>
            </OverlayTrigger>
        </>
        : ""
);
