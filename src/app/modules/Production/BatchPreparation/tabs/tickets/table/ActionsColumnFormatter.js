
import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

export  const ActionsColumnFormatter = (cellContent, row, rowIndex, { openConfirmPage,openRejectPage, openViewPage }) => (
  <>
      {
        row.ticket_status==="REQUESTED" ?
        <div>
         {row.hasCreatePermission ?  
          <OverlayTrigger
        overlay={<Tooltip id="products-edit-tooltip">
          Confirm
        </Tooltip>}
      >
       <button
          className="btn btn-primary mr-5"
          onClick={()=>openConfirmPage(row)}
        >Confirm
        </button>
      </OverlayTrigger>
      : ""}
  
  {row.hasCreatePermission ?     
      <OverlayTrigger
        overlay={<Tooltip id="products-edit-tooltip">
          Reject
        </Tooltip>}
      >
       <button
          className="btn btn-danger mr-5"
          onClick={()=>openRejectPage(row)}
        >Reject
        </button>
      </OverlayTrigger>
      : "" }
      <OverlayTrigger
     overlay={<Tooltip id="products-edit-tooltip">
       view
     </Tooltip>}
   >
    <button
       className="btn btn-info mr-5"
       onClick={()=>openViewPage(row)}
     >view
     </button>
   </OverlayTrigger>
        </div>:row.ticket_status==="CONFIRMED" ?
        <div>
        <OverlayTrigger
        overlay={<Tooltip id="products-edit-tooltip">
          Confirmed
        </Tooltip>}
      >
       <button
          className="btn light-success-bg dark-success-color mr-5"
          style={{cursor:"text"}}
        >Confirmed
        </button>
      </OverlayTrigger>
      <OverlayTrigger
     overlay={<Tooltip id="products-edit-tooltip">
       view
     </Tooltip>}
   >
    <button
       className="btn btn-info mr-5"
       onClick={()=>openViewPage(row)}
     >view
     </button>
   </OverlayTrigger>
      </div>:row.ticket_status==="REJECTED" ?
      <div>
      <OverlayTrigger
      overlay={<Tooltip id="products-edit-tooltip">
        Rejected
      </Tooltip>}
    >
     <button
        className="btn light-danger-bg dark-danger-color mr-5"
        style={{cursor:"text"}}
      >Rejected
      </button>
    </OverlayTrigger>
     <OverlayTrigger
     overlay={<Tooltip id="products-edit-tooltip">
       view
     </Tooltip>}
   >
    <button
       className="btn btn-info mr-5"
       onClick={()=>openViewPage(row)}
     >view
     </button>
   </OverlayTrigger>
   </div>
      :""
      }

  </>
);
