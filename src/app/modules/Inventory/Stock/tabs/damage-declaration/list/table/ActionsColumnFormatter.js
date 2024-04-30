
import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { toAbsoluteUrl } from "../../../../../../../../_metronic/_helpers";
import SVG from "react-inlinesvg";

export  const ActionsColumnFormatter = (cellContent, row, rowIndex, { openQACheckPage, openApprovePage }) => (
  <>
    <OverlayTrigger
      overlay={<Tooltip id="products-edit-tooltip">
       {row.status === "QACHECK" ? "QA Check" :row.status === "INAPPROVE"?"Approve":row.status === "DISPOSED"?"Disposed":""}
      </Tooltip>}
    >
     {
      row.status === "QACHECK" ?
      <button
        style={{fontWeight:"700"}}
        className="btn light-blue-bg dark-blue-color"
        onClick={()=>openQACheckPage(row)}
      >
        <SVG className="mr-1" src={toAbsoluteUrl("/media/svg/icons/project-svg/status.svg")} />
        QA Check
      </button>:
       row.status === "INAPPROVE" ?
       <button
        style={{fontWeight:"700"}}
        className="btn light-warning-bg dark-warning-color"
        onClick={()=>openApprovePage(row)}
      >
        <SVG className="mr-1" src={toAbsoluteUrl("/media/svg/icons/project-svg/waiting-tickets.svg")} />
        In Approve
      </button>:
      row.status === "DISPOSED"?
      <strong style={{cursor:"text",fontWeight:"700"}} className="btn light-success-bg dark-success-color">
        <SVG className="mr-1" src={toAbsoluteUrl("/media/svg/icons/project-svg/approved-done.svg")} />
        Disposed
      </strong>:""
     }
      
    </OverlayTrigger>
  </>
);
