
import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { toAbsoluteUrl } from "../../../../../../../../../_metronic/_helpers";
import SVG from "react-inlinesvg";

export  const ActionsColumnFormatter = (cellContent, row, rowIndex, { openReceivePage, openClaimPage }) => (
  <>
    <OverlayTrigger
      overlay={<Tooltip id="products-edit-tooltip">
        {row.receivedStatus === "Pending" && row.transaction_type === "TRANSFER_SENT" ? "Receive" : "Claim"
        }
      </Tooltip>}
    >
     <button  
        className="btn"
        style={
          row.receivedStatus === "Pending" ? {background:"#0396FF",color:"white"} :
          row.receivedStatus === "Completed" && row.claimedStatus === ""? {background:"#EB5757",color:"white"} : 
          row.receivedStatus === "Completed" && row.claimedStatus === "Claimed"? {background:"#F2F2F2", fontWeight:"700", cursor:"text",color:"#EB5757"}:""
        }
        onClick={
          row.receivedStatus === "Pending"  ? ()=>openReceivePage(row) : 
          row.receivedStatus === "Completed" && row.claimedStatus === "" ? ()=>openClaimPage(row) :""
        }  
        
      >
        {
          row.receivedStatus === "Pending"  ? <SVG className="mr-1" src={toAbsoluteUrl("/media/svg/icons/project-svg/white-receive.svg")} /> : 
          row.receivedStatus === "Completed" && row.claimedStatus === "" ? <SVG className="mr-1" src={toAbsoluteUrl("/media/svg/icons/project-svg/white-receive.svg")} /> : ""
        }
        {
        row.receivedStatus === "Pending"  ? "Receive" : 
        row.receivedStatus === "Completed" && row.claimedStatus === "" ? "Claim" :
        row.receivedStatus === "Completed" && row.claimedStatus === "Claimed"?"Claimed":""}
      </button>
      
    </OverlayTrigger>
  </>
);
