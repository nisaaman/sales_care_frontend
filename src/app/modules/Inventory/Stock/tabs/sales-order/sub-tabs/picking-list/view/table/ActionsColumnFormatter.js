
import { reject } from "lodash";
import React from "react";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../../../../../../_metronic/_helpers";

export const ActionsColumnFormatter = (cellContent, row, rowIndex, { openConfirmPage, openViewPage }) => (
  <>
    {/* <OverlayTrigger
      overlay={<Tooltip id="products-edit-tooltip">
       View
      </Tooltip>}
    >
      <>
      </>
      
          {
      row.status === "CONFIRMED" || row.status === "PENDING"?
      <button
            className="btn light-primary-bg text-primary mr-5"
            onClick={() => openConfirmPage(row)}
          >
            View
          </button>:row.status === "CONFIRMED"||row.status === "REJECTED"?
      <button
            className={
              row.status ==="REJECTED"?"btn light-green-bg text-danger mr-5":"btn light-green-bg text-primary mr-5"
            }
            style={{ cursor: "text" }}
          >
            {row.status}
          </button>:''
    }
    </OverlayTrigger> */}

    {/* <OverlayTrigger
    overlay={<Tooltip id="products-edit-tooltip">
     {row.status=="PENDING"? "Confirm":row.status=="CONFIRMED"?"CONFIRMED":"REJECTED"}
    </Tooltip>}
  >
    
  </OverlayTrigger> */}
    <OverlayTrigger
      overlay={<Tooltip id="products-edit-tooltip">
        View
      </Tooltip>}
    ><button
      className="btn light-success-bg text-success"
      onClick={() => openConfirmPage(row)}
    >
        View
      </button>
    </OverlayTrigger>

    {
      row.status === "PENDING" ?
      <OverlayTrigger
        overlay={<Tooltip id="products-edit-tooltip">
          Pending
        </Tooltip>}
      ><button
        className="btn text-success"
        style={{ cursor: "text" }}
      >
          Pending
        </button>
      </OverlayTrigger>
      :row.status === "CONFIRMED" ?
        <OverlayTrigger
          overlay={<Tooltip id="products-edit-tooltip">
            Confirmed
          </Tooltip>}
        ><button
          className="btn text-primary "
          style={{ cursor: "text" }}
        >
            Confirmed
          </button>
        </OverlayTrigger>
        : row.status === "CANCELLED" ?
          <OverlayTrigger
            overlay={<Tooltip id="products-edit-tooltip">
              Canceled
            </Tooltip>}
          ><button
            className="btn text-danger"
            style={{ cursor: "text" }}
          >
              Canceled
            </button>
          </OverlayTrigger> : ""
    }
  </>

);
