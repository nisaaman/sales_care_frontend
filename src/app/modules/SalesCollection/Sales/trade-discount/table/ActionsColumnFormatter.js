/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../../_metronic/_helpers";

export  const ActionsColumnFormatter = (cellContent, row, rowIndex, {openViewPage, openEditPage,  openDeleteDialog}) => (
  <div className="sales-trade-discount-action">
    <OverlayTrigger
      overlay={<Tooltip id="products-edit-tooltip">View product details</Tooltip>}
    >
      <div
        className="btn btn-icon btn-light btn-hover-success btn-sm mx-3"
        onClick={() => openViewPage(row.id)}
      >
        <span className="svg-icon svg-icon-sm svg-icon-success">
          <SVG
             src={toAbsoluteUrl("/media/svg/icons/General/Visible.svg")}
          />
        </span>
      </div>
    </OverlayTrigger>
  
    {/* <OverlayTrigger
      overlay={<Tooltip id="products-edit-tooltip">Edit product</Tooltip>}
    >
      <a
        className="btn btn-icon btn-light btn-hover-primary btn-sm mx-3"
        onClick={() => openEditPage(row.id)}
      >
        <span className="svg-icon svg-icon-sm svg-icon-primary">
          <SVG
            src={toAbsoluteUrl("/media/svg/icons/Communication/Write.svg")}
          />
        </span>
      </a>
    </OverlayTrigger>

    <> </>
    <OverlayTrigger
      overlay={<Tooltip id="products-delete-tooltip">Delete product</Tooltip>}
    >
      <a
        className="btn btn-icon btn-light btn-hover-danger btn-sm"
        onClick={() => openDeleteDialog(row.id)}
      >
        <span className="svg-icon svg-icon-sm svg-icon-danger">
          <SVG src={toAbsoluteUrl("/media/svg/icons/General/Trash.svg")} />
        </span>
      </a>
    </OverlayTrigger> */}
  </div>
);
