
import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { toAbsoluteUrl } from "../../../../../../../../../_metronic/_helpers";
import SVG from "react-inlinesvg";

export  const ActionsColumnFormatter = (cellContent, row, rowIndex, { openReceivePage }) => (
  <>
    {/* <OverlayTrigger
      overlay={<Tooltip id="products-edit-tooltip">
       view
      </Tooltip>}
    >
     <button
        className="btn text-white light-blue-bg"
        onClick={()=>openReceivePage(row)}
      >
        <SVG className="mr-1" src={toAbsoluteUrl("/media/svg/icons/project-svg/blueview.svg")} />
      </button>
      
    </OverlayTrigger> */}
  </>
);
