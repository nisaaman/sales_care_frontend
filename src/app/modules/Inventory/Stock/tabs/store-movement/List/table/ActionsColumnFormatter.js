
import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { toAbsoluteUrl } from "../../../../../../../../_metronic/_helpers";
import SVG from "react-inlinesvg";

export  const ActionsColumnFormatter = (cellContent, row, rowIndex, { openWaitingPage }) => (
  <>
    <OverlayTrigger
      overlay={<Tooltip id="products-edit-tooltip">
       {row.status === "APPROVED" ? "Moved" :row.status === "REJECT"?"Reject":row.status === "PENDING"?"Waiting":""}
      </Tooltip>}
    >
     {
      row.status === "PENDING" ?
      <button
        style={{fontWeight:"700"}}
        className="btn light-warning-bg dark-warning-color"
        onClick={()=>openWaitingPage(row)}
      >
        <SVG className="mr-1" src={toAbsoluteUrl("/media/svg/icons/project-svg/waiting-tickets.svg")} />
        Waiting for approval
      </button>:
       row.status === "APPROVED" ?
       <strong style={{cursor:"text",fontWeight:"700"}} className="btn light-success-bg dark-success-color">
        <SVG className="mr-1" src={toAbsoluteUrl("/media/svg/icons/project-svg/approved-done.svg")} />
        Moved
      </strong>:
      row.status === "REJECT"?
      <strong style={{cursor:"text",fontWeight:"700"}} className="btn light-danger-bg dark-danger-color">
        <SVG className="mr-1" src={toAbsoluteUrl("/media/svg/icons/project-svg/reject.svg")} />
        Reject
      </strong>:""
     }
      
    </OverlayTrigger>
  </>
);
