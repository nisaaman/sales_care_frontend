
import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { toAbsoluteUrl } from "../../../../../../../../../_metronic/_helpers";
import SVG from "react-inlinesvg";

export  const ActionsColumnFormatter = (cellContent, row, rowIndex, { openViewQAReport }) => (
  <>
    <OverlayTrigger
      overlay={<Tooltip id="products-edit-tooltip">
        {row.status === "QUARANTINE" ? "Waiting For QA Report" : "View QA Report"
        }
      </Tooltip>}
    >
     <button
        className={row.status === "QUARANTINE" ? "btn dark-warning-color" : "btn dark-success-color"}
        style={row.status ==="QUARANTINE"?{background:"#F9F9F9", cursor:"text"}:{background:"#F9F9F9"}}
        onClick={row.status !=="QUARANTINE" ?()=>openViewQAReport(row):""}
      >
        {
          row.status=== "QUARANTINE" ? 
          <SVG className="mr-1" src={toAbsoluteUrl("/media/svg/icons/project-svg/waiting-tickets.svg")} /> :
          <SVG className="mr-1" src={toAbsoluteUrl("/media/svg/icons/project-svg/view-green.svg")} />
        }
        
        {row.status === "QUARANTINE" ? "Waiting For QA Report" : "View QA Report"}
      </button>
      
    </OverlayTrigger>
  </>
);
