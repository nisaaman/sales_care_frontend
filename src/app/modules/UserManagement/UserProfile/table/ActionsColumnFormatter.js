import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../_metronic/_helpers";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import IOSSwitch from "../../../../pages/IOSSwitch";
export const ActionsColumnFormatter = (
  cellContent,
  row,
  rowIndex,
  { openViewPage, openEditPage, openUpdateDialog },

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
    {row.hasCreatePermission ? 
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
    </OverlayTrigger> : ""}

    <> </>
    {row.hasCreatePermission ? 
    <OverlayTrigger
      overlay={<Tooltip id="products-delete-tooltip"> Status</Tooltip>}
    >
      <a
        onClick={() => openUpdateDialog(row)}
      >
        <FormControlLabel
          labelPlacement="end"
          control={
            <IOSSwitch id="isActive" name="isActive"
              checked={row.isActive}
              value={row.isActive}
            />
          }
        />
      </a>
    </OverlayTrigger> : ""}
  </>
);
