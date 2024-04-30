
import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

export  const ActionsColumnFormatter = (cellContent, row, rowIndex, { openAdjustPage }) => (
  <>
    <OverlayTrigger
      overlay={<Tooltip id="products-edit-tooltip">
        {row.adjustable_amount > 0 ? "Click here to adjust" : "Unable to adjust"}
      </Tooltip>}
    >
     <button
        className="btn"
        style={
          row.adjustable_amount > 0 ? {background:"#56CCF2",color:"white",borderRadius:"100px"} :
          {background:"#F9F9F9",color:"#BDBDBD",borderRadius:"100px"} 
        }
        onClick={row.adjustable_amount > 0 ? ()=>openAdjustPage(row) : null}
      >
        Adjust
      </button>
    </OverlayTrigger>
  </>
);
