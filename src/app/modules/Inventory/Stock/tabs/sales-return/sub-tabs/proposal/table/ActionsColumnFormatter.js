import React from "react";
import {OverlayTrigger, Tooltip} from "react-bootstrap";
import {toAbsoluteUrl} from "../../../../../../../../../_metronic/_helpers";
import SVG from "react-inlinesvg";

export const ActionsColumnFormatter = (cellContent, row, rowIndex, {openReceivePage}) => (
    <>
        <OverlayTrigger
            overlay={<Tooltip id="products-edit-tooltip">{row.status === "RECEIVE" ? "Receive" : "Received"}</Tooltip>}>
            <button className="btn text-white" style={{background: "#0396FF"}}
                    disabled={row.status === "RECEIVE" ? false : true} onClick={() => openReceivePage(row)}>
                <SVG className="mr-1" src={toAbsoluteUrl("/media/svg/icons/project-svg/white-receive.svg")}/>
                {row.status}
            </button>
        </OverlayTrigger>
    </>
);
