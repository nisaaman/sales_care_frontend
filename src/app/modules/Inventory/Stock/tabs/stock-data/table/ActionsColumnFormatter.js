
import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../../../_metronic/_helpers";

export  const ActionsColumnFormatter = (cellContent, row, rowIndex, { openViewPage }) => (
  <>
  <OverlayTrigger
      overlay={<Tooltip id="products-edit-tooltip">
        View
      </Tooltip>}
    >
     <button
        className="btn light-blue-bg text-success mr-5"
        onClick={()=>openViewPage(row)}
      >
        <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/blueview.svg")} width="15px" height="15px" />
        &nbsp;View
      </button>
    </OverlayTrigger>
  </>
);
