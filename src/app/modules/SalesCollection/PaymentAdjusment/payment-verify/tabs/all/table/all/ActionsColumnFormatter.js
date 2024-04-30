
import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

export  const ActionsColumnFormatter = (cellContent, row, rowIndex, { openVerifyPage }) => (
  <>
    <OverlayTrigger
      overlay={<Tooltip id="products-edit-tooltip">
        {row.approval_status === "PENDING" ? "Verify" : row.approval_status === "APPROVED" ? "Verified" : "Rejected"}
      </Tooltip>}
    >
     <button
        className="btn"
        style={
          row.approval_status === "PENDING" ? {background:"linear-gradient(135deg, #ABDCFF 0%, #0396FF 100%)",color:"white",borderRadius:"100px",boxShadow: "0px 5px 10px rgba(46, 168, 255, 0.3)"} :
          row.approval_status === "APPROVED" ? {background:"rgba(111, 207, 151, 0.1)",color:"rgba(39, 174, 96, 0.75)",borderRadius:"100px", cursor:"text"} :
          {background:"rgba(235, 87, 87, 0.1)",color:"rgba(235, 87, 87, 0.75)",borderRadius:"100px", cursor:"text"}
        }
        onClick={row.approval_status === "PENDING" ? ()=>openVerifyPage(row) : null}
      >
        {row.approval_status === 'PENDING' ? 'Verify' : row.approval_status === 'APPROVED' ? 'Verified' : 'Rejected'}
      </button>
    </OverlayTrigger>
  </>
);
