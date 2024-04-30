import React from "react";
import { useLocation } from "react-router";
import { NavLink } from "react-router-dom";
import { toAbsoluteUrl, checkIsActive } from "../../../../_helpers";
import { shallowEqual, useSelector } from "react-redux";
import { hasAcess, hasAnyAcess } from "../../../../../app/modules/Util";

export function AsideMenuList({ layoutProps }) {
  const permissions = useSelector((state) => state.auth.user.permissions, shallowEqual);
  const location = useLocation();
  const getMenuItemActive = (url, hasSubmenu = false) => {
    return checkIsActive(location, url)
      ? ` ${!hasSubmenu && "menu-item-active"} menu-item-open `
      : "";
  };

  const productionFeatures = ['BATCH_PREPARATION','QUALITY_ASSURANCE'];
  const productionQAFeatures = ['QA_REVIEW','QA_REPORT'];
  
  const inventoryStockSalesOrderFeatures = ['SALES_BOOKING_CONFIRMATION','SALES_ORDER','PICKING_LIST','DELIVERY_CHALLAN','INVOICE'];
  const inventoryStockStockTransferFeatures = ['PRODUCTION_RECEIVE','STOCK_RECEIVE','STOCK_SEND'];
  const inventoryConfigerFeatures = ['PRODUCT_CONFIGURE','DEPOT_CONFIGURE'];
  const inventoryStockFeatures = ['STOCK_DATA','SALES_RETURN','STORE_MOVEMENT','STOCK_DAMAGE_DECLARATION', ...inventoryStockSalesOrderFeatures, ...inventoryStockStockTransferFeatures];
  const inventoryFeatures = [...inventoryConfigerFeatures, ...inventoryStockFeatures];

  const salesCollectionSalesFeatures = ['SALES_DATA_VIEW','SALES_BOOKING_VIEW','SALES_ORDER_VIEW','SALES_RETURN_VIEW','TRADE_PRICE_VIEW','TRADE_DISCOUNT_VIEW','SALES_BUDGET_VIEW'];
  const salesCollectionPaymentCollectionFeatures = ['COLLECTION_DATA_VIEW','INVOICES_VIEW','ORD_VIEW','ORD_CALCULATOR_VIEW','COLLECTION_BUDGET_VIEW'];
  const salesCollectionPaymentAdjustmentFeatures = ['PAYMENT_VERIFY','PAYMENT_ADJUSTMENT','ORD_SETTLEMENT','CREDIT_DEBIT_NOTE'];
  const salesCollectionDistributorsFeatures = ['DISTRIBUTOR_LIST','CREDIT_LIMIT_PROPOSAL','DISTRIBUTOR_LEDGER_REPORT'];
  const salesCollectionConfigureFeatures = ['TIMELINE_SETUP','TRADE_PRICE_SETUP','TRADE_DISCOUNT_SETUP','BUDGET_SETUP','ORD_SETUP','OVERDUE_SETUP','PAYMENT_BOOK_SETUP','CREDIT_LIMIT_SETUP'];
  const salesCollectionFeatures = [...salesCollectionSalesFeatures, ...salesCollectionPaymentCollectionFeatures, 
    ...salesCollectionPaymentAdjustmentFeatures, ...salesCollectionDistributorsFeatures, ...salesCollectionConfigureFeatures];

  const userManagementFeatures = ['USER_PROFILE','ROLE_SETUP','USER_ROLE_MAPPING','USER_COMPANY_MAPPING','FEATURE_PERMISSION_SETUP'];
  const approvalPathFeatures = ['APPROVAL_STEP_SETUP','AUTHORIZATION_FEATURE','MULTILAYER_APPROVAL_PATH'];
  const masterConfigureFeatures = ['BANK_SETUP','BRANCH_SETUP','BANK_ACCOUNT_SETUP','DEPARTMENT_SETUP','DESIGNATION_SETUP','STORE_SETUP','UOM_SETUP','PACK_SIZE_SETUP','VEHICLE_SETUP','REPORTING_MANAGER_SETUP','LOCATION_MANAGER_SETUP','DEPOT_LOCATION_LEVEL_SETUP','TERMS_CONDITION_SETUP'];
  const reportFeatures = ['RECEIVABLE_INVOICE_STATEMENT_REPORT'];

  return (
    <>
      {/* begin::Menu Nav */}
      <ul className={`menu-nav ${layoutProps.ulClasses}`}>
        {/*begin:::OVERVIEW LEVEL*/}
        <li className={`menu-item ${getMenuItemActive("/dashboard", false)}`}
          aria-haspopup="true"
        >
          <NavLink className="menu-link" to="/dashboard">
            <span className="svg-icon menu-icon">
              <img src={toAbsoluteUrl("/images/OverView.png")} width="24px" height="24px" />
            </span>
            <span className="menu-text">Overview</span>
          </NavLink>
        </li>
        {/*end:::OVERVIEW LEVEL*/}

        {/* PRODUCTION */}
        {/*begin::PRODUCTION LEVEL*/}
        {hasAnyAcess(permissions, productionFeatures) &&
        <li className={`menu-item menu-item-submenu ${getMenuItemActive(
            "/production",
            true
          )}`}
          aria-haspopup="true"
          data-menu-toggle="hover"
        >
          <NavLink className="menu-link menu-toggle" to="/production">
            <span className="svg-icon menu-icon">
              <img src={toAbsoluteUrl("/images/Inventory.png")} width="24px" height="24px" />
            </span>
            <span className="menu-text">Production</span>
            <i className="menu-arrow" />
          </NavLink>
          <div className="menu-submenu ">
            <i className="menu-arrow" />
            <ul className="menu-subnav">
              <li className="menu-item  menu-item-parent" aria-haspopup="true">
                <span className="menu-link">
                  <span className="menu-text">Production</span>
                </span>
              </li>
              {/* BATCH PREPARATION */}
              {/*begin::BATCH PREPARATION LEVEL*/}
              {hasAcess(permissions, 'BATCH_PREPARATION') &&
              <li className={`menu-item menu-item-submenu ${getMenuItemActive(
                  "/production/production-batch-preparation",
                  false
                )}`}
                aria-haspopup="true"
                data-menu-toggle="hover"
              >
                <NavLink
                  className="menu-link menu-toggle"
                  to="/production/production-batch-preparation/production"
                >
                  <i className="bi bi-dash" style={{ margin: "7px" }}></i>
                  <span className="menu-text">Batch Preparation</span>
                </NavLink>

              </li>}
              {/*end::BATCH PREPARATION LEVEL*/}
              {/*begin::CONFIGURE LEVEL*/}
              {hasAcess(permissions, 'QUALITY_ASSURANCE') &&
              <li className={`menu-item menu-item-submenu ${getMenuItemActive(
                  "/production/production-qa",
                  true
                )}`}
                aria-haspopup="true"
                data-menu-toggle="hover"
              >
                <NavLink
                  className="menu-link menu-toggle"
                  to="/production/production-qa"
                >
                  <i className="bi bi-dash" style={{ margin: "7px" }}></i>
                  <span className="menu-text">QA</span>
                  <i className="menu-arrow" />
                </NavLink>
                <div className="menu-submenu" style={{ marginLeft: "30px" }}>
                  <i className="menu-arrow" />
                  <ul className="menu-subnav">
                    {/*begin::QA REVIEW CONFIGURE LEVEL*/}
                    {hasAcess(permissions, 'QUALITY_ASSURANCE') &&
                    <li className={`menu-item  ${getMenuItemActive(
                        "/production/production-qa/production-qa-setup"
                      )}`}
                      aria-haspopup="true"
                    >
                      <NavLink
                        className="menu-link"
                        to="/production/production-qa/production-qa-setup"
                      >
                        <i className="menu-bullet menu-bullet-dot">
                          <span />
                        </i>
                        <span className="menu-text">QA Review</span>
                      </NavLink>
                    </li>}
                    {/*end::QA REVIEW CONFIGURE LEVEL*/}

                    {/*begin::REPORT CONFIGURE LEVEL*/}
                    {hasAcess(permissions, 'QUALITY_ASSURANCE') &&
                    <li className={`menu-item  ${getMenuItemActive(
                        "/production/production-qa/production-qa-reports"
                      )}`}
                      aria-haspopup="true"
                    >
                      <NavLink
                        className="menu-link"
                        to="/production/production-qa/production-qa-reports"
                      >
                        <i className="menu-bullet menu-bullet-dot">
                          <span />
                        </i>
                        <span className="menu-text">Report</span>
                      </NavLink>
                    </li>}
                    {/*end::REPORT CONFIGURE LEVEL*/}
                  </ul>
                </div>
              </li>}
              {/*end::CONFIGURE LEVEL*/}
            </ul>
          </div>
        </li>}
        {/*end::PRODUCTION*/}


        {/* INVENTORY */}
        {/*begin::INVENTORY LEVEL*/}
        {hasAnyAcess(permissions, inventoryFeatures) &&
        <li className={`menu-item menu-item-submenu ${getMenuItemActive(
            "/inventory",
            true
          )}`}
          aria-haspopup="true"
          data-menu-toggle="hover"
        >
          <NavLink className="menu-link menu-toggle" to="/inventory">
            <span className="svg-icon menu-icon">
              <img src={toAbsoluteUrl("/images/Inventory.png")} width="24px" height="24px" />
            </span>
            <span className="menu-text">Inventory</span>
            <i className="menu-arrow" />
          </NavLink>
          <div className="menu-submenu ">
            <i className="menu-arrow" />
            <ul className="menu-subnav">
              <li className="menu-item  menu-item-parent" aria-haspopup="true">
                <span className="menu-link">
                  <span className="menu-text">Inventory</span>
                </span>
              </li>
              {/* CONFIGURE */}
              {/*begin::CONFIGURE LEVEL*/}
              {hasAnyAcess(permissions, inventoryConfigerFeatures) &&
              <li className={`menu-item menu-item-submenu ${getMenuItemActive(
                  "/inventory/configure",
                  true
                )}`}
                aria-haspopup="true"
                data-menu-toggle="hover"
              >
                <NavLink
                  className="menu-link menu-toggle"
                  to="/inventory/configure"
                >
                  <i className="bi bi-dash" style={{ margin: "7px" }}></i>
                  <span className="menu-text">Configure</span>
                  <i className="menu-arrow" />
                </NavLink>
                <div className="menu-submenu" style={{ marginLeft: "30px" }}>
                  <i className="menu-arrow" />
                  <ul className="menu-subnav">
                    {/*begin::PRODUCT CONFIGURE LEVEL*/}
                    {hasAcess(permissions, 'PRODUCT_CONFIGURE') &&
                    <li className={`menu-item  ${getMenuItemActive(
                        "/inventory/configure/product-configure"
                      )}`}
                      aria-haspopup="true"
                    >
                      <NavLink
                        className="menu-link"
                        to="/inventory/configure/product-configure"
                      >
                        <i className="menu-bullet menu-bullet-dot">
                          <span />
                        </i>
                        <span className="menu-text">Product Configure</span>
                      </NavLink>
                    </li>}
                    {/*end::PRODUCT CONFIGURE LEVEL*/}

                    {/*begin::DEPOT CONFIGURE LEVEL*/}
                    {hasAcess(permissions, 'DEPOT_CONFIGURE') &&
                    <li className={`menu-item  ${getMenuItemActive(
                        "/inventory/configure/depot-configure"
                      )}`}
                      aria-haspopup="true"
                    >
                      <NavLink
                        className="menu-link"
                        to="/inventory/configure/depot-configure/list"
                      >
                        <i className="menu-bullet menu-bullet-dot">
                          <span />
                        </i>
                        <span className="menu-text">Depot Configure</span>
                      </NavLink>
                    </li>}
                    {/*end::DEPOT CONFIGURE LEVEL*/}
                  </ul>
                </div>
              </li>}
              {/*end::CONFIGURE LEVEL*/}

              {/* STOCK PREPARATION */}
              {/*begin::STOCK LEVEL*/}
              {hasAnyAcess(permissions, inventoryStockFeatures) &&
              <li className={`menu-item menu-item-submenu ${getMenuItemActive(
                  "/inventory/stock",
                  false
                )}`}
                aria-haspopup="true"
                data-menu-toggle="hover"
              >
                <NavLink
                  className="menu-link menu-toggle"
                  to="/inventory/stock"
                >
                  <i className="bi bi-dash" style={{ margin: "7px" }}></i>
                  <span className="menu-text">Stock</span>
                </NavLink>

              </li>}
              {/*end::STOCK LEVEL*/}
            </ul>
          </div>
        </li>}
        {/*end::INVENTORY*/}

        {/* SALES & COLLECTION */}
        {/*begin::SALES & COLLECTION LEVEL*/}
        {hasAnyAcess(permissions, salesCollectionFeatures) &&
        <li className={`menu-item menu-item-submenu ${getMenuItemActive(
            "/salescollection",
            true
          )}`}
          aria-haspopup="true"
          data-menu-toggle="hover"
        >
          <NavLink className="menu-link menu-toggle" to="/salescollection">
            <span className="svg-icon menu-icon">
              <img src={toAbsoluteUrl("/images/LineChart.png")} width="24px" height="24px" />
            </span>
            <span className="menu-text">Sales & Collection</span>
            <i className="menu-arrow" />
          </NavLink>
          <div className="menu-submenu " >
            <i className="menu-arrow" />
            <ul className="menu-subnav">
              <li className="menu-item  menu-item-parent" aria-haspopup="true">
                <span className="menu-link">
                  <span className="menu-text">Sales & Collection</span>
                </span>
              </li>
              {/* SALES */}
              {/*begin::SALES LEVEL*/}
              {hasAnyAcess(permissions, salesCollectionSalesFeatures) &&
              <li className={`menu-item menu-item-submenu ${getMenuItemActive(
                  "/salescollection/sales",
                  false
                )}`}
                aria-haspopup="true"
                data-menu-toggle="hover"
              >
                <NavLink
                  className="menu-link menu-toggle"
                  to="/salescollection/sales/overview"
                >
                  <i className="bi bi-dash" style={{ margin: "7px" }}></i>
                  <span className="menu-text">Sales</span>
                </NavLink>

              </li>}
              {/*end::SALES LEVEL*/}

              {/* PAYMENT COLLECTION */}
              {/*begin::PAYMENT COLLECTION LEVEL*/}              
              {hasAnyAcess(permissions, salesCollectionPaymentCollectionFeatures) &&
              <li className={`menu-item menu-item-submenu ${getMenuItemActive(
                  "/salescollection/payment-collection",
                  false
                )}`}
                aria-haspopup="true"
                data-menu-toggle="hover"
              >
                <NavLink
                  className="menu-link menu-toggle"
                  to="/salescollection/payment-collection/overview"
                >
                  <i className="bi bi-dash" style={{ margin: "7px" }}></i>
                  <span className="menu-text">Payment Collection</span>
                </NavLink>

              </li>}
              {/*end::PAYMENT COLLECTION LEVEL*/}

              {/* PAYMENT ADJUSTMENT */}
              {/*begin::PAYMENT ADJUSTMENT LEVEL*/}
              {hasAnyAcess(permissions, salesCollectionPaymentAdjustmentFeatures) &&
              <li className={`menu-item menu-item-submenu ${getMenuItemActive(
                  "/salescollection/payment-adjustment",
                  false
                )}`}
                aria-haspopup="true"
                data-menu-toggle="hover"
              >
                <NavLink
                  className="menu-link menu-toggle"
                  to="/salescollection/payment-adjustment"
                >
                  <i className="bi bi-dash" style={{ margin: "7px" }}></i>
                  <span className="menu-text">Payment Adjustment</span>
                </NavLink>

              </li>}
              {/*end::PAYMENT ADJUSTMENT LEVEL*/}

              {/* DISTRIBUTORS */}
              {/*begin::DISTRIBUTORS LEVEL*/}
              {hasAnyAcess(permissions, salesCollectionDistributorsFeatures) &&
              <li className={`menu-item menu-item-submenu ${getMenuItemActive(
                  "/salescollection/distributors",
                  false
                )}`}
                aria-haspopup="true"
                data-menu-toggle="hover"
              >
                <NavLink
                  className="menu-link menu-toggle"
                  to="/salescollection/distributors/distributors-list"
                >
                  <i className="bi bi-dash" style={{ margin: "7px" }}></i>
                  <span className="menu-text">Distributors</span>
                </NavLink>
              </li>}
              {/*end::DISTRIBUTORS LEVEL*/}

              {/* CONFIGURE */}
              {/*begin::CONFIGURE LEVEL*/}
              {hasAnyAcess(permissions, salesCollectionConfigureFeatures) &&
              <li
                className={`menu-item menu-item-submenu ${getMenuItemActive(
                  "/salescollection/configure",
                  true
                )}`}
                aria-haspopup="true"
                data-menu-toggle="hover"
              >
                <NavLink
                  className="menu-link menu-toggle"
                  to="/salescollection/configure"
                >
                  <i className="bi bi-dash" style={{ margin: "7px" }}></i>
                  <span className="menu-text">Configure</span>
                  <i className="menu-arrow" />
                </NavLink>
                <div className="menu-submenu" style={{ marginLeft: "30px" }}>
                  <i className="menu-arrow" />
                  <ul className="menu-subnav">
                    {/*begin::TIMELINE SETUP LEVEL*/}
                    {hasAcess(permissions, 'TIMELINE_SETUP') &&
                    <li className={`menu-item  ${getMenuItemActive(
                        "/salescollection/configure/time-line-setup/list",
                      )}`}
                      aria-haspopup="true"
                    >
                      <NavLink
                        className="menu-link"
                        to="/salescollection/configure/time-line-setup/list"
                      >
                        <i className="menu-bullet menu-bullet-dot">
                          <span />
                        </i>
                        <span className="menu-text">Timeline Setup</span>
                      </NavLink>
                    </li>}
                    {/*end::TIMELINE SETUP LEVEL*/}

                    {/*begin::TRADE PRICE SETUP LEVEL*/}
                    {hasAcess(permissions, 'TRADE_PRICE_SETUP') &&
                    <li className={`menu-item  ${getMenuItemActive(
                        "/salescollection/configure/trade-price-setup/list",
                      )}`}
                      aria-haspopup="true"
                    >
                      <NavLink
                        className="menu-link"
                        to="/salescollection/configure/trade-price-setup/list"
                      >
                        <i className="menu-bullet menu-bullet-dot">
                          <span />
                        </i>
                        <span className="menu-text">Trade Price Setup</span>
                      </NavLink>
                    </li>}
                    {/*end::TRADE PRICE SETUP LEVEL*/}

                    {/*begin::TRADE DISCOUNT SETUP LEVEL*/}
                    {hasAcess(permissions, 'TRADE_DISCOUNT_SETUP') &&
                    <li className={`menu-item  ${getMenuItemActive(
                        "/salescollection/configure/trade-discount-setup/list",
                      )}`}
                      aria-haspopup="true"
                    >
                      <NavLink
                        className="menu-link"
                        to="/salescollection/configure/trade-discount-setup/list"
                      >
                        <i className="menu-bullet menu-bullet-dot">
                          <span />
                        </i>
                        <span className="menu-text">Trade Discount Setup</span>
                      </NavLink>
                    </li>}
                    {/*end::TRADE DISCOUNT SETUP LEVEL*/}

                    {/*begin::BUDGET SETUP LEVEL*/}
                    {hasAcess(permissions, 'BUDGET_SETUP') &&
                    <li className={`menu-item  ${getMenuItemActive(
                        "/salescollection/configure/budget-setup/distributor-wise-list",
                      )}`}
                      aria-haspopup="true"
                    >
                      <NavLink
                        className="menu-link"
                        to="/salescollection/configure/budget-setup/distributor-wise-list"
                      >
                        <i className="menu-bullet menu-bullet-dot">
                          <span />
                        </i>
                        <span className="menu-text">Budget Setup</span>
                      </NavLink>
                    </li>}
                    {/*end::BUDGET SETUP LEVEL*/}

                    {/*begin::ORD & OVERDUE SETUP LEVEL*/}
                    {hasAcess(permissions, 'ORD_SETUP') &&
                    <li className={`menu-item  ${getMenuItemActive(
                        "/salescollection/configure/ord-overdue-setup/ord-list",
                      )}`}
                      aria-haspopup="true"
                    >
                      <NavLink
                        className="menu-link"
                        to="/salescollection/configure/ord-overdue-setup/ord-list"
                      >
                        <i className="menu-bullet menu-bullet-dot">
                          <span />
                        </i>
                        <span className="menu-text">Commission & Overdue Setup</span>
                      </NavLink>
                    </li>}
                    {/*end::ORD & OVERDUE SETUP LEVEL*/}

                    {/*begin::PAYMENT BOOK SETUP LEVEL*/}
                    {hasAcess(permissions, 'PAYMENT_BOOK_SETUP') &&
                    <li className={`menu-item  ${getMenuItemActive(
                        "/salescollection/configure/payment-book/payment-book-setup",
                      )}`}
                      aria-haspopup="true"
                    >
                      <NavLink
                        className="menu-link"
                        to="/salescollection/configure/payment-book/payment-book-setup"
                      >
                        <i className="menu-bullet menu-bullet-dot">
                          <span />
                        </i>
                        <span className="menu-text">Payment Book Setup</span>
                      </NavLink>
                    </li>}
                    {/*end::PAYMENT BOOK SETUP LEVEL*/}

                    {/*begin::CREDIT LIMIT SETUP LEVEL*/}
                    {hasAcess(permissions, 'CREDIT_LIMIT_SETUP') &&
                    <li className={`menu-item  ${getMenuItemActive(
                        "/salescollection/configure/credit-limit-setup/credit-limit-setup",
                      )}`}
                      aria-haspopup="true"
                    >
                      <NavLink
                        className="menu-link"
                        to="/salescollection/configure/credit-limit-setup/credit-limit-setup"
                      >
                        <i className="menu-bullet menu-bullet-dot">
                          <span />
                        </i>
                        <span className="menu-text">Credit Limit Setup</span>
                      </NavLink>
                    </li>}
                    {/*end::CREDIT LIMIT SETUP LEVEL*/}
                  </ul>
                </div>
              </li>}
              {/*end::CONFIGURE LEVEL*/}
            </ul>
          </div>
        </li>}
        {/*end::SALES & COLLECTION LEVEL*/}

        {/* USER MANAGEMENT */}
        {/*begin::USER MANAGEMENT LEVEL*/}
        {hasAnyAcess(permissions, userManagementFeatures) &&
        <li
          className={`menu-item menu-item-submenu ${getMenuItemActive(
            "/user-management",
            true
          )}`}
          aria-haspopup="true"
          data-menu-toggle="hover"
        >
          <NavLink className="menu-link menu-toggle" to="/user-management">
            <span className="svg-icon menu-icon">
              <img src={toAbsoluteUrl("/images/UserManagement.png")} width="24px" height="24px" />
            </span>
            <span className="menu-text">User Management</span>
            <i className="menu-arrow" />
          </NavLink>
          <div className="menu-submenu">
            <i className="menu-arrow" />
            <ul className="menu-subnav">
              <li className="menu-item menu-item-parent" aria-haspopup="true">
                <span className="menu-link">
                  <span className="menu-text">User Management</span>
                </span>
              </li>
              {/*begin::USER PROFILE*/}
              {hasAcess(permissions, 'USER_PROFILE') &&
              <li className={`menu-item ${getMenuItemActive(
                  "/user-management/profile-setup"
                )}`}
                aria-haspopup="true"
              >
                <NavLink className="menu-link" to="/user-management/profile-setup">
                  <i className="bi bi-dash" style={{ margin: "7px" }}>
                    <span />
                  </i>
                  <span className="menu-text">User Profile</span>
                </NavLink>
              </li>}
              {/*end::USER PROFILE*/}

              {/*begin::ROLE SETUP*/}
              {hasAcess(permissions, 'ROLE_SETUP') &&
              <li className={`menu-item ${getMenuItemActive(
                  "/user-management/role-setup"
                )}`}
                aria-haspopup="true"
              >
                <NavLink className="menu-link" to="/user-management/role-setup"> {/* user-management/role-setup */}
                  <i className="bi bi-dash" style={{ margin: "7px" }}>
                    <span />
                  </i>
                  <span className="menu-text">Role Setup</span>
                </NavLink>
              </li>}
              {/*end::ROLE SETUP*/}

              {/*begin::USER ROLE MAPPING*/}
              {hasAcess(permissions, 'USER_ROLE_MAPPING') &&
              <li className={`menu-item ${getMenuItemActive(
                  "/user-management/user-role-setup-new"
                )}`}
                aria-haspopup="true"
              >
                <NavLink className="menu-link" to="/user-management/user-role-setup-new"> {/* user-management/role-setup */}
                  <i className="bi bi-dash" style={{ margin: "7px" }}>
                    <span />
                  </i>
                  <span className="menu-text">User Role Map</span>
                </NavLink>
              </li>}
              {/*end::USER ROLE MAPPING*/}

              {/*begin::USER COMPANY MAP*/}
              {hasAcess(permissions, 'USER_COMPANY_MAPPING') &&
              <li className={`menu-item ${getMenuItemActive(
                  "/user-management/user-company-map"
                )}`}
                aria-haspopup="true"
              >
                <NavLink className="menu-link" to="/user-management/user-company-map">
                  <i className="bi bi-dash" style={{ margin: "7px" }}>
                    <span />
                  </i>
                  <span className="menu-text">User Company Map</span>
                </NavLink>
              </li>}
              {/*end::USER COMPANY MAP*/}
              
              {/*begin::USER COMPANY MAP*/}
              {hasAcess(permissions, 'FEATURE_PERMISSION_SETUP') &&
              <li className={`menu-item ${getMenuItemActive(
                  "/user-management/feature-permission-setup"
                )}`}
                aria-haspopup="true"
              >
                <NavLink className="menu-link" to="/user-management/feature-permission-setup">
                  <i className="bi bi-dash" style={{ margin: "7px" }}>
                    <span />
                  </i>
                  <span className="menu-text">Feature Permission Setup</span>
                </NavLink>
              </li>}
              {/*end::USER COMPANY MAP*/}

            </ul>
          </div>
        </li>}
        {/*end::USER MANAGEMENT LEVEL*/}

        {/* APPROVAL PATH MANAGEMENT */}
        {/*begin::APPROVAL PATH LEVEL*/}
        {hasAnyAcess(permissions, approvalPathFeatures) &&
        <li
          className={`menu-item menu-item-submenu ${getMenuItemActive(
            "/approval-path",
            true
          )}`}
          aria-haspopup="true"
          data-menu-toggle="hover"
        >
          <NavLink className="menu-link menu-toggle" to="/approval-path">
            <span className="svg-icon menu-icon">
              <img src={toAbsoluteUrl("/images/UserManagement.png")} width="24px" height="24px" />
            </span>
            <span className="menu-text">Approval Path</span>
            <i className="menu-arrow" />
          </NavLink>
          <div className="menu-submenu">
            <i className="menu-arrow" />
            <ul className="menu-subnav">
              <li className="menu-item menu-item-parent" aria-haspopup="true">
                <span className="menu-link">
                  <span className="menu-text">Approval Path</span>
                </span>
              </li>

              {/*begin::USER PROFILE*/}
              {hasAcess(permissions, 'APPROVAL_STEP_SETUP') &&
              <li className={`menu-item ${getMenuItemActive(
                  "/approval-path/approval-step-setup"
                )}`}
                aria-haspopup="true"
              >
                <NavLink className="menu-link" to="/approval-path/approval-step-setup">
                  <i className="bi bi-dash" style={{ margin: "7px" }}>
                    <span />
                  </i>
                  <span className="menu-text">Approval Step Setup</span>
                </NavLink>
              </li>}
              {/*end::USER PROFILE*/}

              {/*begin:::AUTHORIZATION FEATURE LEVEL*/}
              {hasAcess(permissions, 'AUTHORIZATION_FEATURE') &&
              <li className={`menu-item ${getMenuItemActive(
                  "/approval-path/authorization-feature"
                )}`}
                aria-haspopup="true"
              >
                <NavLink className="menu-link" to="/approval-path/authorization-feature">
                  <i className="bi bi-dash" style={{ margin: "7px" }}>
                    <span />
                  </i>
                  <span className="menu-text">Authorization Feature</span>
                </NavLink>
              </li>}
              {/*end:::AUTHORIZATION FEATURE LEVEL*/}

              {/*begin:::MULTILAYER APPROVAL PATH LEVEL*/}
              {hasAcess(permissions, 'MULTILAYER_APPROVAL_PATH') &&
              <li className={`menu-item ${getMenuItemActive(
                  "/approval-path/multilayer-approval-path-setup"
                )}`}
                aria-haspopup="true"
              >
                <NavLink className="menu-link" to="/approval-path/multilayer-approval-path-setup">
                  <i className="bi bi-dash" style={{ margin: "7px" }}>
                    <span />
                  </i>
                  <span className="menu-text">Multilayer Approval Path</span>
                </NavLink>
              </li>}
              {/*end:::MULTILAYER APPROVAL PATH LEVEL*/}

            </ul>
          </div>
        </li>}
        {/*end::APPROVAL PATH LEVEL*/}

        {/* MASTER CONFIGURATION */}
        {/*begin::MASTER CONFIGURATION LEVEL*/}
        {hasAnyAcess(permissions, masterConfigureFeatures) &&
        <li className={`menu-item menu-item-submenu ${getMenuItemActive(
            "/master-config",
            true
          )}`}
          aria-haspopup="true"
          data-menu-toggle="hover"
        >
          <NavLink className="menu-link menu-toggle" to="/master-config">
            <span className="svg-icon menu-icon">
              <img src={toAbsoluteUrl("/images/settings.jpg")} width="24px" height="24px" />
            </span>
            <span className="menu-text">Configure</span>
            <i className="menu-arrow" />
          </NavLink>
          <div className="menu-submenu">
            <i className="menu-arrow" />
            <ul className="menu-subnav">
              <li className="menu-item menu-item-parent" aria-haspopup="true">
                <span className="menu-link">
                  <span className="menu-text">Configure</span>
                </span>
              </li>
              {/*begin::BANK SETUP*/}
              {hasAcess(permissions, 'BANK_SETUP') &&
              <li className={`menu-item ${getMenuItemActive(
                  "/master-config/bank-setup"
                )}`}
                aria-haspopup="true"
              >
                <NavLink className="menu-link" to="/master-config/bank-setup">
                  <i className="bi bi-dash" style={{ margin: "7px" }}>

                  </i>
                  <span className="menu-text">Bank Setup</span>
                </NavLink>
              </li>}
              {/*end::BANK SETUP*/}

              {/*begin::BRANCH SETUP*/}
              {hasAcess(permissions, 'BRANCH_SETUP') &&
              <li className={`menu-item ${getMenuItemActive(
                  "/master-config/bank-branch-setup"
                )}`}
                aria-haspopup="true"
              >
                <NavLink className="menu-link" to="/master-config/bank-branch-setup">
                  <i className="bi bi-dash" style={{ margin: "7px" }}>

                  </i>
                  <span className="menu-text">Bank Branch Setup</span>
                </NavLink>
              </li>}
              {/*end::BRANCH SETUP*/}

              {/*begin::BANK ACCOUNT SETUP*/}
              {hasAcess(permissions, 'BANK_ACCOUNT_SETUP') &&
              <li className={`menu-item ${getMenuItemActive(
                  "/master-config/bank-account"
                )}`}
                aria-haspopup="true"
              >
                <NavLink className="menu-link" to="/master-config/bank-account-setup">
                  <i className="bi bi-dash" style={{ margin: "7px" }}>

                  </i>
                  <span className="menu-text">Bank Account Setup</span>
                </NavLink>
              </li>}
              {/*end::BANK ACCOUNT SETUP*/}

              {/*begin::DEPARTMENT SETUP*/}
              {hasAcess(permissions, 'DEPARTMENT_SETUP') &&
              <li className={`menu-item ${getMenuItemActive(
                  "/master-config/department-setup"
                )}`}
                aria-haspopup="true"
              >
                <NavLink className="menu-link" to="/master-config/department-setup">
                  <i className="bi bi-dash" style={{ margin: "7px" }}>

                  </i>
                  <span className="menu-text">Department Setup</span>
                </NavLink>
              </li>}
              {/*end::DEPARTMENT SETUP*/}

              {/*begin::DESIGNATION SETUP*/}
              {hasAcess(permissions, 'DESIGNATION_SETUP') &&
              <li className={`menu-item ${getMenuItemActive(
                  "/master-config/designation-setup"
                )}`}
                aria-haspopup="true"
              >
                <NavLink className="menu-link" to="/master-config/designation-setup">
                  <i className="bi bi-dash" style={{ margin: "7px" }}>

                  </i>
                  <span className="menu-text">Designation Setup</span>
                </NavLink>
              </li>}
              {/*end::DESIGNATION SETUP*/}

              {/*begin::STORE SETUP*/}
              {hasAcess(permissions, 'STORE_SETUP') &&
              <li className={`menu-item ${getMenuItemActive(
                  "/master-config/store-setup"
                )}`}
                aria-haspopup="true"
              >
                <NavLink className="menu-link" to="/master-config/store-setup">
                  <i className="bi bi-dash" style={{ margin: "7px" }}>

                  </i>
                  <span className="menu-text">Store Setup</span>
                </NavLink>
              </li>}
              {/*end::STORE SETUP*/}

              {/*begin::UOM SETUP*/}
              {hasAcess(permissions, 'UOM_SETUP') &&
              <li className={`menu-item ${getMenuItemActive(
                  "/master-config/uom-setup"
                )}`}
                aria-haspopup="true"
              >
                <NavLink className="menu-link" to="/master-config/uom-setup">
                  <i className="bi bi-dash" style={{ margin: "7px" }}>

                  </i>
                  <span className="menu-text">Unit of Measurement Setup</span>
                </NavLink>
              </li>}
              {/*end::UOM SETUP*/}

              {/*begin::PACKSIZE SETUP*/}
              {hasAcess(permissions, 'PACK_SIZE_SETUP') &&
              <li className={`menu-item ${getMenuItemActive(
                  "/master-config/pack-size-setup"
                )}`}
                aria-haspopup="true"
              >
                <NavLink className="menu-link" to="/master-config/pack-size-setup">
                  <i className="bi bi-dash" style={{ margin: "7px" }}>

                  </i>
                  <span className="menu-text">Pack Size Setup</span>
                </NavLink>
              </li>}
              {/*end::PACKSIZE SETUP*/}

              {/*begin::CURRENCY SETUP*/}
              {/* <li
                className={`menu-item ${getMenuItemActive(
                  "/master-config/currency-setup"
                )}`}
                aria-haspopup="true"
              >
                <NavLink className="menu-link" to="/master-config/currency-setup">
                  <i className="bi bi-dash" style={{ margin: "7px" }}>

                  </i>
                  <span className="menu-text">Currency</span>
                </NavLink>
              </li> */}
              {/*end::CURRENCY SETUP*/}

              {/*begin::VEHICLE SETUP*/}
              {hasAcess(permissions, 'VEHICLE_SETUP') &&
              <li className={`menu-item ${getMenuItemActive(
                  "/master-config/vehicle-setup"
                )}`}
                aria-haspopup="true"
              >
                <NavLink className="menu-link" to="/master-config/vehicle-setup">
                  <i className="bi bi-dash" style={{ margin: "7px" }}>

                  </i>
                  <span className="menu-text">Vehicle Setup</span>
                </NavLink>
              </li>}
              {/*end::VEHICLE SETUP*/}
              {/*begin::REPORTING MANAGER SETUP*/}
              {hasAcess(permissions, 'REPORTING_MANAGER_SETUP') &&
              <li className={`menu-item ${getMenuItemActive(
                  "/master-config/reporting-manager-setup"
                )}`}
                aria-haspopup="true"
              >
                <NavLink className="menu-link" to="/master-config/reporting-manager-setup">
                  <i className="bi bi-dash" style={{ margin: "7px" }}>

                  </i>
                  <span className="menu-text">Reporting Manager Setup</span>
                </NavLink>
              </li>}
              {/*end::REPORTING MANAGER SETUP*/}

              {/*begin::LOCATION MANAGER SETUP*/}
              {hasAcess(permissions, 'LOCATION_MANAGER_SETUP') &&
              <li className={`menu-item ${getMenuItemActive(
                  "/master-config/location-manager-setup"
                )}`}
                aria-haspopup="true"
              >
                <NavLink className="menu-link" to="/master-config/location-manager-setup">
                  <i className="bi bi-dash" style={{ margin: "7px" }}>

                  </i>
                  <span className="menu-text">Location Manager Setup</span>
                </NavLink>
              </li>}
              {/*end::LOCATION MANAGER SETUP*/}
              
              {/*begin::DEPOT LOCATION LEVEL MAP SETUP*/}
              {hasAcess(permissions, 'DEPOT_LOCATION_LEVEL_SETUP') &&
              <li className={`menu-item ${getMenuItemActive(
                      "/master-config/depot-location-level-map-setup"
                  )}`}
                  aria-haspopup="true"
              >
                <NavLink className="menu-link" to="/master-config/depot-location-level-map-setup">
                  <i className="bi bi-dash" style={{ margin: "7px" }}>

                  </i>
                  <span className="menu-text">Depot Location Level Map Setup</span>
                </NavLink>
              </li>}
              {/*end::DEPOT LOCATION LEVEL MAP SETUP*/}

              {/*begin::TERMS AND CONDITION MAP SETUP*/}
              {hasAcess(permissions, 'TERMS_CONDITION_SETUP') &&
              <li className={`menu-item ${getMenuItemActive(
                      "/master-config/terms-and-condition-setup"
                  )}`}
                  aria-haspopup="true"
              >
                <NavLink className="menu-link" to="/master-config/terms-and-condition-setup">
                  <i className="bi bi-dash" style={{ margin: "7px" }}>

                  </i>
                  <span className="menu-text">Terms & Condition Setup</span>
                </NavLink>
              </li>}
              {/*end::TERMS AND CONDITION LEVEL MAP SETUP*/}

            </ul>
          </div>
        </li>}
        {/*end::MASTER CONFIGURATION LEVEL*/}

        {/* Report start CONFIGURATION */}
        {/*begin::REPORT CONFIGURATION LEVEL*/}
        {hasAnyAcess(permissions, reportFeatures) &&
        <li className={`menu-item menu-item-submenu ${getMenuItemActive(
            "/report/mis-report",
            true
          )}`}
          aria-haspopup="true"
          data-menu-toggle="hover"
        >
          <NavLink className="menu-link menu-toggle" to="/report/mis-report/finance-report">
            <span className="svg-icon menu-icon">
              <img src={toAbsoluteUrl("/images/LineChart.png")} width="24px" height="24px" />
            </span>
            <span className="menu-text">Reports</span>
            <i className="menu-arrow" />
          </NavLink>
          <div className="menu-submenu " >
            <i className="menu-arrow" />
            <ul className="menu-subnav">
              <li className="menu-item  menu-item-parent" aria-haspopup="true">
                <span className="menu-link">
                  <span className="menu-text">Reports</span>
                </span>
              </li>
       
              {/*begin::sub menu LEVEL*/}
              {hasAcess(permissions, 'RECEIVABLE_INVOICE_STATEMENT_REPORT') &&
              <li className={`menu-item menu-item-submenu ${getMenuItemActive(
                  "/report/mis-report/finance-report/ReceivableInvoiceStatement",
                  false
                )}`}
                aria-haspopup="true"
                data-menu-toggle="hover"
              >
                <NavLink
                  className="menu-link menu-toggle"
                  to="/report/mis-report/finance-report/ReceivableInvoiceStatement"
                >
                  <i className="bi bi-dash" style={{ margin: "7px" }}></i>
                  <span className="menu-text">Finance Analysis Report</span>
                </NavLink>
              </li>
              
              }
              {/*end::*/}

              {/*begin::sub menu LEVEL*/}
              {hasAcess(permissions, 'RECEIVABLE_INVOICE_STATEMENT_REPORT') &&
              <li className={`menu-item menu-item-submenu ${getMenuItemActive(
                  "/report/mis-report/mis-report-inventory/inventory-stock-valuation",
                  false
                )}`}
                aria-haspopup="true"
                data-menu-toggle="hover"
              >
                <NavLink
                  className="menu-link menu-toggle"
                  to="/report/mis-report/mis-report-inventory/inventory-stock-valuation"
                >
                  <i className="bi bi-dash" style={{ margin: "7px" }}></i>
                  <span className="menu-text">Stock valuation Report</span>
                </NavLink>
              </li>
              
              }
              {/*end::*/}

              {/*begin::sub menu LEVEL*/}
              {hasAcess(permissions, 'RECEIVABLE_INVOICE_STATEMENT_REPORT') &&
              <li className={`menu-item menu-item-submenu ${getMenuItemActive(
                  "/report/mis-report/mis-report-inventory/finished-goods-ageing",
                  false
                )}`}
                aria-haspopup="true"
                data-menu-toggle="hover"
              >
                <NavLink
                  className="menu-link menu-toggle"
                  to="/report/mis-report/mis-report-inventory/finished-goods-ageing"
                >
                  <i className="bi bi-dash" style={{ margin: "7px" }}></i>
                  <span className="menu-text">Finished Goods Ageing</span>
                </NavLink>
              </li>
              
              }
              {/*end::*/}


               {/*begin::sub menu LEVEL*/}
               {hasAcess(permissions, 'RECEIVABLE_INVOICE_STATEMENT_REPORT') &&
              <li className={`menu-item menu-item-submenu ${getMenuItemActive(
                  "/report/mis-report/mis-report-sales-and-collection/mis-report-sales-and-collection-reports",
                  false
                )}`}
                aria-haspopup="true"
                data-menu-toggle="hover"
              >
                <NavLink
                  className="menu-link menu-toggle"
                  to="/report/mis-report/mis-report-sales-and-collection/mis-report-sales-and-collection-reports"
                >
                  <i className="bi bi-dash" style={{ margin: "7px" }}></i>
                  <span className="menu-text">Sales report</span>
                </NavLink>
              </li>
              
              }
              {/*end::*/}

               {/*begin::sub menu LEVEL*/}
               {hasAcess(permissions, 'RECEIVABLE_INVOICE_STATEMENT_REPORT') &&
              <li className={`menu-item menu-item-submenu ${getMenuItemActive(
                  "/report/mis-report/mis-report-sales-and-collection/collection-report",
                  false
                )}`}
                aria-haspopup="true"
                data-menu-toggle="hover"
              >
                <NavLink
                  className="menu-link menu-toggle"
                  to="/report/mis-report/mis-report-sales-and-collection/collection-report"
                >
                  <i className="bi bi-dash" style={{ margin: "7px" }}></i>
                  <span className="menu-text">Collection report</span>
                </NavLink>
              </li>
              
              }
              {/*end::*/}


                {/*begin::sub menu LEVEL*/}
                {hasAcess(permissions, 'RECEIVABLE_INVOICE_STATEMENT_REPORT') &&
              <li className={`menu-item menu-item-submenu ${getMenuItemActive(
                  "/report/mis-report/mis-report-sales-and-collection/mis-report-sales-and-collection-sales-return-report",
                  false
                )}`}
                aria-haspopup="true"
                data-menu-toggle="hover"
              >
                <NavLink
                  className="menu-link menu-toggle"
                  to="/report/mis-report/mis-report-sales-and-collection/mis-report-sales-and-collection-sales-return-report"
                >
                  <i className="bi bi-dash" style={{ margin: "7px" }}></i>
                  <span className="menu-text">Sales Return Report</span>
                </NavLink>
              </li>
              
              }
              {/*end::*/}

              {/*begin::sub menu LEVEL*/}
              {hasAcess(permissions, 'RECEIVABLE_INVOICE_STATEMENT_REPORT') &&
              <li className={`menu-item menu-item-submenu ${getMenuItemActive(
                  "/report/mis-report/mis-report-sales-and-collection/mis-report-sales-and-collection-sales-budget-report",
                  false
                )}`}
                aria-haspopup="true"
                data-menu-toggle="hover"
              >
                <NavLink
                  className="menu-link menu-toggle"
                  to="/report/mis-report/mis-report-sales-and-collection/mis-report-sales-and-collection-sales-budget-report"
                >
                  <i className="bi bi-dash" style={{ margin: "7px" }}></i>
                  <span className="menu-text">Sales Budget Report</span>
                </NavLink>
              </li>
              
              }

              {/*begin::sub menu LEVEL*/}
              {/* {hasAcess(permissions, 'RECEIVABLE_INVOICE_STATEMENT_REPORT') &&
              <li className={`menu-item menu-item-submenu ${getMenuItemActive(
                  "/report/mis-report/mis-report-sales-and-collection/mis-report-sales-and-collection-sales-and-collection-forecast-report",
                  false
                )}`}
                aria-haspopup="true"
                data-menu-toggle="hover"
              >
                <NavLink
                  className="menu-link menu-toggle"
                  to="/report/mis-report/mis-report-sales-and-collection/mis-report-sales-and-collection-sales-and-collection-forecast-report"
                >
                  <i className="bi bi-dash" style={{ margin: "7px" }}></i>
                  <span className="menu-text">Sales and Collection Forecast Report</span>
                </NavLink>
              </li>
              
              } */}


               {/*begin::sub menu LEVEL*/}
               {hasAcess(permissions, 'RECEIVABLE_INVOICE_STATEMENT_REPORT') &&
              <li className={`menu-item menu-item-submenu ${getMenuItemActive(
                  "/report/mis-report/mis-report-others/mis-report-others-profitability-analysis",
                  false
                )}`}
                aria-haspopup="true"
                data-menu-toggle="hover"
              >
                <NavLink
                  className="menu-link menu-toggle"
                  to="/report/mis-report/mis-report-others/mis-report-others-profitability-analysis"
                >
                  <i className="bi bi-dash" style={{ margin: "7px" }}></i>
                  <span className="menu-text">Profitability Analysis Report</span>
                </NavLink>
              </li>
              
              }


              {/*begin::sub menu LEVEL*/}
              {hasAcess(permissions, 'RECEIVABLE_INVOICE_STATEMENT_REPORT') &&
              <li className={`menu-item menu-item-submenu ${getMenuItemActive(
                  "/report/mis-report/mis-report-inventory/mis-report-inventory-order-to-cash-cycle",
                  false
                )}`}
                aria-haspopup="true"
                data-menu-toggle="hover"
              >
                <NavLink
                  className="menu-link menu-toggle"
                  to="/report/mis-report/mis-report-inventory/mis-report-inventory-order-to-cash-cycle"
                >
                  <i className="bi bi-dash" style={{ margin: "7px" }}></i>
                  <span className="menu-text">Order To Cash Cycle</span>
                </NavLink>
              </li>
              
              }

                 {/*begin::sub menu LEVEL*/}
                 {hasAcess(permissions, 'RECEIVABLE_INVOICE_STATEMENT_REPORT') &&
              <li className={`menu-item menu-item-submenu ${getMenuItemActive(
                  "/report/mis-report/mis-report-sales-and-collection/mis-report-sales-and-collection-invoice-wise-aging-report",
                  false
                )}`}
                aria-haspopup="true"
                data-menu-toggle="hover"
              >
                <NavLink
                  className="menu-link menu-toggle"
                  to="/report/mis-report/mis-report-sales-and-collection/mis-report-sales-and-collection-invoice-wise-aging-report"
                >
                  <i className="bi bi-dash" style={{ margin: "7px" }}></i>
                  <span className="menu-text">Invoice Wise Aging Report</span>
                </NavLink>
              </li>
              
              }

               {/*begin::sub menu LEVEL*/}
               {hasAcess(permissions, 'RECEIVABLE_INVOICE_STATEMENT_REPORT') &&
              <li className={`menu-item menu-item-submenu ${getMenuItemActive(
                  "/report/mis-report/mis-report-sales-and-collection/mis-report-sales-and-collection-receivable-overdue-report",
                  false
                )}`}
                aria-haspopup="true"
                data-menu-toggle="hover"
              >
                <NavLink
                  className="menu-link menu-toggle"
                  to="/report/mis-report/mis-report-sales-and-collection/mis-report-sales-and-collection-receivable-overdue-report"
                >
                  <i className="bi bi-dash" style={{ margin: "7px" }}></i>
                  <span className="menu-text">Receivable Overdue Report</span>
                </NavLink>
              </li>
              
              }

              {/*begin::sub menu LEVEL*/}
              {hasAcess(permissions, 'RECEIVABLE_INVOICE_STATEMENT_REPORT') &&
              <li className={`menu-item menu-item-submenu ${getMenuItemActive(
                  "/report/mis-report/mis-report-sales-and-collection/mis-report-sales-and-collection-product-trade-price-change-history",
                  false
                )}`}
                aria-haspopup="true"
                data-menu-toggle="hover"
              >
                <NavLink
                  className="menu-link menu-toggle"
                  to="/report/mis-report/mis-report-sales-and-collection/mis-report-sales-and-collection-product-trade-price-change-history"
                >
                  <i className="bi bi-dash" style={{ margin: "7px" }}></i>
                  <span className="menu-text">Product Trade Price Change History</span>
                </NavLink>
              </li>             
              }

              {/*begin::sub menu LEVEL*/}
              {hasAcess(permissions, 'RECEIVABLE_INVOICE_STATEMENT_REPORT') &&
              <li className={`menu-item menu-item-submenu ${getMenuItemActive(
                  "/report/mis-report/mis-report-sales-and-collection/mis-report-sales-and-collection-performance-report",
                  false
                )}`}
                aria-haspopup="true"
                data-menu-toggle="hover"
              >
                <NavLink
                  className="menu-link menu-toggle"
                  to="/report/mis-report/mis-report-sales-and-collection/mis-report-sales-and-collection-performance-report"
                >
                  <i className="bi bi-dash" style={{ margin: "7px" }}></i>
                  <span className="menu-text">Performance Report</span>
                </NavLink>
              </li>             
              }


              {/*begin::sub menu LEVEL*/}
              {hasAcess(permissions, 'RECEIVABLE_INVOICE_STATEMENT_REPORT') &&
              <li className={`menu-item menu-item-submenu ${getMenuItemActive(
                  "/report/mis-report/mis-report-inventory/mis-report-inventory-restricted-report",
                  false
                )}`}
                aria-haspopup="true"
                data-menu-toggle="hover"
              >
                <NavLink
                  className="menu-link menu-toggle"
                  to="/report/mis-report/mis-report-inventory/mis-report-inventory-restricted-report"
                >
                  <i className="bi bi-dash" style={{ margin: "7px" }}></i>
                  <span className="menu-text">Restricted Report</span>
                </NavLink>
              </li>
              
              }

              {/*end::*/}

              {/*begin::MATERIAL PLANNER REPORT LEVEL*/}
              {hasAcess(permissions, 'RECEIVABLE_INVOICE_STATEMENT_REPORT') &&
              <li className={`menu-item menu-item-submenu ${getMenuItemActive(
                  "/report/mis-report/mis-report-material-planner",
                  false
                )}`}
                aria-haspopup="true"
                data-menu-toggle="hover"
              >
                <NavLink
                  className="menu-link menu-toggle"
                  to="/report/mis-report/mis-report-material-planner"
                >
                  <i className="bi bi-dash" style={{ margin: "7px" }}></i>
                  <span className="menu-text">Material Planner Report</span>
                </NavLink>
              </li>
              
              }


               {/*begin::MATERIAL PLANNER REPORT LEVEL*/}
               {hasAcess(permissions, 'RECEIVABLE_INVOICE_STATEMENT_REPORT') &&
              <li className={`menu-item menu-item-submenu ${getMenuItemActive(
                  "/report/mis-report/mis-report-sales-and-collection/mis-report-sales-and-collection-debit-credit-report",
                  false
                )}`}
                aria-haspopup="true"
                data-menu-toggle="hover"
              >
                <NavLink
                  className="menu-link menu-toggle"
                  to="/report/mis-report/mis-report-sales-and-collection/mis-report-sales-and-collection-debit-credit-report"
                >
                  <i className="bi bi-dash" style={{ margin: "7px" }}></i>
                  <span className="menu-text">Debit/Credit Note </span>
                </NavLink>
              </li>
              
              }
              {/*end::*/}

              {/*begin::MATERIAL PLANNER REPORT LEVEL*/}
              {hasAcess(permissions, 'RECEIVABLE_INVOICE_STATEMENT_REPORT') &&
              <li className={`menu-item menu-item-submenu ${getMenuItemActive(
                  "/report/mis-report/mis-report-inventory/mis-report-inventory-depot-to-depot-movement",
                  false
                )}`}
                aria-haspopup="true"
                data-menu-toggle="hover"
              >
                <NavLink
                  className="menu-link menu-toggle"
                  to="/report/mis-report/mis-report-inventory/mis-report-inventory-depot-to-depot-movement"
                >
                  <i className="bi bi-dash" style={{ margin: "7px" }}></i>
                  <span className="menu-text">Depot To Depot Movement Report</span>
                </NavLink>
              </li>
              
              }
              {/*end::*/}

               {/*begin::sub menu LEVEL*/}
              {hasAcess(permissions, 'RECEIVABLE_INVOICE_STATEMENT_REPORT') &&
                <li className={`menu-item menu-item-submenu ${getMenuItemActive(
                    "/report/mis-report/mis-report-sales-and-collection/mis-report-sales-and-collection-credit-limit-history-report",
                    false
                  )}`}
                  aria-haspopup="true"
                  data-menu-toggle="hover"
                >
                  <NavLink
                    className="menu-link menu-toggle"
                    to="/report/mis-report/mis-report-sales-and-collection/mis-report-sales-and-collection-credit-limit-history-report"
                  >
                    <i className="bi bi-dash" style={{ margin: "7px" }}></i>
                    <span className="menu-text">Credit Limit History Report</span>
                  </NavLink>
                </li>              
              }
              {/*end::*/}

              {/*begin::sub menu LEVEL*/}
              {/*begin::sub menu LEVEL*/}
              {hasAcess(permissions, 'RECEIVABLE_INVOICE_STATEMENT_REPORT') &&
                <li className={`menu-item menu-item-submenu ${getMenuItemActive(
                    "/report/mis-report/mis-report-others/mis-report-others-distributor-ledger-summary-report",
                    false
                  )}`}
                  aria-haspopup="true"
                  data-menu-toggle="hover"
                >
                  <NavLink
                    className="menu-link menu-toggle"
                    to="/report/mis-report/mis-report-others/mis-report-others-distributor-ledger-summary-report"
                  >
                    <i className="bi bi-dash" style={{ margin: "7px" }}></i>
                    <span className="menu-text">Distributor Ledger Summary Report</span>
                  </NavLink>
                </li>
              }
              {/*end::*/}

                 {/*begin::sub menu LEVEL*/}
                 {/* {hasAcess(permissions, 'RECEIVABLE_INVOICE_STATEMENT_REPORT') &&
              <li className={`menu-item menu-item-submenu ${getMenuItemActive(
                  "/report/mis-report/mis-report-sales-and-collection/mis-report-sales-and-collection-invoice-type-wise-summary-report",
                  false
                )}`}
                aria-haspopup="true"
                data-menu-toggle="hover"
              >
                <NavLink
                  className="menu-link menu-toggle"
                  to="/report/mis-report/mis-report-sales-and-collection/mis-report-sales-and-collection-invoice-type-wise-summary-report"
                >
                  <i className="bi bi-dash" style={{ margin: "7px" }}></i>
                  <span className="menu-text">Invoice Type Wise Summary Report</span>
                </NavLink>
              </li>
              
              } */}
              {/*end::*/}

              </ul>
          </div>
        </li>}
      </ul>
      {/* end::Menu Nav */}
    </>
  );
}
