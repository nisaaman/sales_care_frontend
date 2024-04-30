
import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

export  const ActionsColumnFormatter = (cellContent, row, rowIndex, { openApprovePage, openWaitingPage, openReviewPage }) => (
  <>
    <OverlayTrigger
      overlay={<Tooltip id="products-edit-tooltip">
        {row.approval_status === "APPROVED" && row.stock_confirmed === null ? "Stock Confirmation" :
        row.approval_status === "APPROVED" && row.stock_confirmed ==="Y" ? "Stock Confirmed" :
        row.approval_status === "REJECTED" ? "Rejected":""
        }
      </Tooltip>}
    >
     <button
        className={row.approval_status === "APPROVED" &&  row.stock_confirmed === null? 
        "btn bg-primary text-white" : 
        row.approval_status === "APPROVED" &&  row.stock_confirmed ==="Y"? 
        "btn light-success-bg dark-success-color" :
        row.approval_status === "REJECTED" ?
        "btn light-danger-bg dark-danger-color" :
        ""
      }
        style={row.approval_status === "REJECTED" ? {cursor:"text"} : {}}
        onClick={
          row.approval_status === "APPROVED" && row.stock_confirmed === null ? ()=>openApprovePage(row) :
          row.approval_status === "APPROVED" && row.stock_confirmed ==="Y" ? ()=>openApprovePage(row) :""}
      >
        {row.approval_status === "APPROVED" && row.stock_confirmed === null ? "Stock Confirmation" :
        row.approval_status === "APPROVED" && row.stock_confirmed ==="Y" ? "Stock Confirmed" :
        row.approval_status === "REJECTED" ? "Rejected":""
        }
      </button>
    </OverlayTrigger>
  </>
);
