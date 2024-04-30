import React from "react";
import { useLocation } from "react-router";
import { NavLink } from "react-router-dom";
import { toAbsoluteUrl, checkIsActive } from "../../../../_helpers";
import { hasAcess } from "../../../../../app/modules/Util";
import { shallowEqual, useSelector } from "react-redux";

export function AsideMenuSecondList({ layoutProps }) {
  const permissions = useSelector((state) => state.auth.user.permissions, shallowEqual);
  const location = useLocation();
  const getMenuItemActive = (url, hasSubmenu = false) => {
    return checkIsActive(location, url)
      ? ` ${!hasSubmenu && "menu-item-active"} menu-item-open `
      : "";
  };

  return (
    <>
      {/* begin::Menu Nav */}
      <ul className={`menu-nav ${layoutProps.ulClasses}`}>
        {/*begin:::COMPANY LEVEL*/}
        {hasAcess(permissions, 'ORGANIZATION') && 
        <li
          className={`menu-item ${getMenuItemActive("/company", false)}`}
          aria-haspopup="true"
        >
          <NavLink className="menu-link" to="/company">
            <span className="svg-icon menu-icon">
              <img src={toAbsoluteUrl("/images/OverView.png")} width="24px" height="24px" />
            </span>
            <span className="menu-text">Company</span>
          </NavLink>
        </li> }
        {/*end:::COMPANY LEVEL*/}

        {/*begin:::LOCATION LEVEL*/}
        {hasAcess(permissions, 'LOCATION') &&
        <li
          className={`menu-item ${getMenuItemActive("/location", false)}`}
          aria-haspopup="true"
        >
          <NavLink className="menu-link" to="/location">
            <span className="svg-icon menu-icon">
              <img src={toAbsoluteUrl("/images/Inventory.png")} width="24px" height="24px" />
            </span>
            <span className="menu-text">Location</span>
          </NavLink>
        </li>}
        {/*end:::LOCATION LEVEL*/}
      </ul>

      {/* end::Menu Nav */}
    </>
  );
}
