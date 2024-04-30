
import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

export  const ActionsColumnFormatter = (cellContent, row, rowIndex, { openVerifyPage }) => (
  <>
    <OverlayTrigger
      overlay={<Tooltip id="products-edit-tooltip">
        {row.status === "Settle" ? "Settle" : "Settled"}
      </Tooltip>}
    >
     <button
        className="btn"
        style={
          !row.is_ord_settled ? {background:"linear-gradient(135deg, #ABDCFF 0%, #0396FF 100%)",color:"white",borderRadius:"100px",boxShadow: "0px 5px 10px rgba(46, 168, 255, 0.3)"} :
          {background:"rgba(111, 207, 151, 0.1)",color:"rgba(39, 174, 96, 0.75)",borderRadius:"100px", cursor:"text"}
        }
        onClick={!row.is_ord_settled ? () => openVerifyPage(row) : null}
      >
        {row.is_ord_settled ? 'Settled' : 'Settle'}
      </button>
    </OverlayTrigger>
  </>
);
