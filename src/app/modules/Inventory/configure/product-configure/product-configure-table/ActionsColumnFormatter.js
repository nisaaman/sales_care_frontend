import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../../_metronic/_helpers";

export const ActionsColumnFormatter = (
  cellContent,
  row,
  rowIndex,
  { openViewPage, openEditPage, openDeleteDialog }
) => (
  <>
  <OverlayTrigger
      overlay={<Tooltip id="products-edit-tooltip">View product details</Tooltip>}
    >
      <a
        className="mr-4"
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
      overlay={<Tooltip id="products-edit-tooltip">Edit product</Tooltip>}
    >
      <a
        className="mr-4"
        onClick={() => openEditPage(row)}
      >
        <i className="bi bi-pencil-square text-primary"></i>
      </a>
    </OverlayTrigger>

    <> </>
    <OverlayTrigger
      overlay={<Tooltip id="products-delete-tooltip">Delete product</Tooltip>}
    >
      <a
        onClick={() => openDeleteDialog(row)}
      >
        <i className="bi bi-trash3-fill text-danger"></i>
      </a>
    </OverlayTrigger>
  </>
);
