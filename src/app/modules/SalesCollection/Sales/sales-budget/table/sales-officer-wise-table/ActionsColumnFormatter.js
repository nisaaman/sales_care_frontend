
import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../../../_metronic/_helpers";

export  const ActionsColumnFormatter = (cellContent, row, rowIndex, { openViewPage }) => (
  <>
    <OverlayTrigger
      overlay={<Tooltip id="products-edit-tooltip">View details</Tooltip>}
    >
      <div
        className="btn btn-icon btn-light btn-hover-success btn-sm mx-3"
        onClick={() => openViewPage(row.id)}
      >
        <span className="svg-icon svg-icon-sm svg-icon-success">
          <SVG
             src={toAbsoluteUrl("/media/svg/icons/project-svg/blueview.svg")}
          />
        </span>
      </div>
    </OverlayTrigger>
  </>
);
