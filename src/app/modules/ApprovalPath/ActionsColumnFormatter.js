import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../_metronic/_helpers";

export const ActionsColumnFormatter = (
  cellContent,
  row,
  rowIndex,
  { openViewPage, openEditPage, openDeleteDialog }
) => (
  <>
    <OverlayTrigger
      overlay={<Tooltip id="products-edit-tooltip">View details</Tooltip>}
    >
      <a
        className="mx-2"
        onClick={() => openViewPage(row)}
      >

        <SVG
          className="svg-icon svg-icon-md svg-icon-primary"
          src={toAbsoluteUrl("/media/svg/icons/project-svg/blueview.svg")}
        />

      </a>
    </OverlayTrigger>
    <></>
    <OverlayTrigger
      overlay={<Tooltip id="products-edit-tooltip">Edit existing record</Tooltip>}
    >
      <a
        className="mx-2"
        onClick={() => openEditPage(row)}
      >
        <span className="svg-icon svg-icon-md svg-icon-primary">
          <SVG
            src={toAbsoluteUrl("/media/svg/icons/Communication/Write.svg")}
          />
        </span>
      </a>
    </OverlayTrigger>

    <> </>
    <OverlayTrigger
      overlay={<Tooltip id="products-delete-tooltip">Delete record</Tooltip>}
    >
      <a
        onClick={() => openDeleteDialog(row)}
      >
        <span className="svg-icon svg-icon-md svg-icon-danger">
          <SVG src={toAbsoluteUrl("/media/svg/icons/General/Trash.svg")} />
        </span>
      </a>
    </OverlayTrigger>
  </>
);
