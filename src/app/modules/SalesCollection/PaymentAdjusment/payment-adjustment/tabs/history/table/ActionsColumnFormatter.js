
import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

export  const ActionsColumnFormatter = (cellContent, row, rowIndex, { openAdjustPage }) => (
  <>
    <OverlayTrigger
      overlay={<Tooltip id="products-edit-tooltip">
        {row.status === "Verify" ? "Verif" : row.status === "Verified" ? "Verified" : "Rejected"}
      </Tooltip>}
    >
     <button
        className="btn"
        style={
          row.payments != 0 ? {background:"#56CCF2",color:"white",borderRadius:"100px"} :
          {background:"#F9F9F9",color:"#BDBDBD",borderRadius:"100px"} 
        }
        onClick={()=>openAdjustPage(row)}
      >
        Adjust
      </button>
    </OverlayTrigger>
  </>
);
