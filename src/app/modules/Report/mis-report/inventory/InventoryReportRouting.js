import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../../_metronic/layout";
import StockValuation from "./StockValuation";
import OrderToCashCycle    from "./OrderToCashCycle";
import RestrictedReport from "./RestrictedReport";
import DepotToDepotMovementReport from "./DepotToDepotMovementReport"
import FinishedGoodsAgeing from "./FinishedGoodsAgeing";

export function InventoryReportRouting() {
  return (
    <Switch>
      <Redirect
        exact={true}
        from="/report/mis-report/mis-report-inventory"
        to="/report/mis-report/mis-report-inventory/inventory-stock-valuation"
      />

      <ContentRoute
        path="/report/mis-report/mis-report-inventory/inventory-stock-valuation"
        component={StockValuation}
      />

      <ContentRoute
        path="/report/mis-report/mis-report-inventory/finished-goods-ageing"
        component={FinishedGoodsAgeing}
      />
 
      <ContentRoute
        path="/report/mis-report/mis-report-inventory/mis-report-inventory-order-to-cash-cycle"
        component={OrderToCashCycle}
      />


     <ContentRoute
        path="/report/mis-report/mis-report-inventory/mis-report-inventory-restricted-report"
        component={RestrictedReport}
      />

      <ContentRoute
        path="/report/mis-report/mis-report-inventory/mis-report-inventory-depot-to-depot-movement"
        component={DepotToDepotMovementReport}
      />
      

    </Switch>
  );
}