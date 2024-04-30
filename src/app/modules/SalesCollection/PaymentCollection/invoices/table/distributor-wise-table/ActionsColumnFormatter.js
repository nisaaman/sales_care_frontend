
import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../../../_metronic/_helpers";

export  const ActionsColumnFormatter = (cellContent, row, rowIndex, { openViewPage }) => (
  <>
    <OverlayTrigger
      overlay={<Tooltip id="products-edit-tooltip">View details</Tooltip>}
    >
     <button
        className="btn"
        style={{background:"#E1F0FA",color:"#0396FF"}}
        onClick={()=>openViewPage(row)}
      >View
      </button>
    </OverlayTrigger>
  </>
);
