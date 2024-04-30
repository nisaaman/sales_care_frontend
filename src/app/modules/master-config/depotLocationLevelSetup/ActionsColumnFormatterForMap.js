import React from "react";
import {OverlayTrigger, Tooltip} from "react-bootstrap";
import SVG from "react-inlinesvg";
import {toAbsoluteUrl} from "../../../../_metronic/_helpers";

export const ActionsColumnFormatterForMap = (cellContent, row, rowIndex, {openEditPage, openDeleteDialog}) => (
    <>
        <OverlayTrigger overlay={<Tooltip id="products-edit-tooltip">Edit existing record</Tooltip>}>
            <a className="mx-2" onClick={() => openEditPage(row)}>
        <span className="svg-icon svg-icon-md svg-icon-primary">
         {row.isEditable === true ? <SVG src={toAbsoluteUrl("/media/svg/icons/Communication/Write.svg")}/> : ""}
        </span>
            </a>
        </OverlayTrigger>

        <> </>
        <OverlayTrigger overlay={<Tooltip id="products-delete-tooltip">Delete record</Tooltip>}>
            <a onClick={() => openDeleteDialog(row)}>
        <span className="svg-icon svg-icon-md svg-icon-danger">
             {row.isEditable === true ? <SVG src={toAbsoluteUrl("/media/svg/icons/General/Trash.svg")}/> : ""}
        </span>
            </a>
        </OverlayTrigger>
    </>
);
