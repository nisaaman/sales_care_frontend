
import React, {useState, useEffect} from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../../_metronic/_helpers";
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import IOSSwitch from "../../../../../pages/IOSSwitch";

export function ActionsColumnFormatter (cellContent, row, rowIndex, { openViewPage, openEditPage, openUpdateDialog }){
  return(
    <>
    <OverlayTrigger
      overlay={<Tooltip id="products-edit-tooltip">{row.Active === true ? "Active" :"Inactive"}</Tooltip>}
    >
       <a
        onClick={() => openUpdateDialog(row)}
      >
        <FormControlLabel
          labelPlacement="end"
          control={
            <IOSSwitch id="isActive" name="isActive"
              checked={row.Active}
              value={row.Active}
            />
          }
        />
      </a>
    </OverlayTrigger>
  
    <OverlayTrigger
      overlay={<Tooltip id="products-edit-tooltip">Edit Distributor</Tooltip>}
    >
      <a
        className="btn btn-icon btn-light btn-hover-primary btn-sm mx-3"
        onClick={() => openEditPage(row)}
      >
        <span className="svg-icon svg-icon-sm svg-icon-primary">
          <SVG
            src={toAbsoluteUrl("/media/svg/icons/project-svg/edit.svg")}
          />
        </span>
      </a>
    </OverlayTrigger>

    <> </>
    <OverlayTrigger
      overlay={<Tooltip id="products-edit-tooltip">View Distributor</Tooltip>}
    >
      <div
        className="btn btn-icon btn-light btn-hover-success btn-sm mx-3"
        //onClick={() => openViewPage(row.id)}
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
}
