/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

export  const ActionsColumnFormatter = (cellContent, row, rowIndex, { openViewPage }) => (
  <>
    <OverlayTrigger
      overlay={<Tooltip id="products-edit-tooltip">View</Tooltip>}
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
