import React from "react";
import {OverlayTrigger, Tooltip} from "react-bootstrap";

export  const ActionsColumnFormatter = (cellContent, row, rowIndex, { openViewPage }) => (
  <>
    <OverlayTrigger
      overlay={<Tooltip id="products-edit-tooltip">
        view
      </Tooltip>}
    >
     <button
        className="btn light-blue-bg text-success"
        onClick={()=>openViewPage(row)}
      >
        View
      </button>
    </OverlayTrigger>
  </>
);
