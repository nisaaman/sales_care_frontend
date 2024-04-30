import React from "react";
import { Redirect, Switch } from "react-router-dom";
import StockData from "./tabs/stock-data/StockData";
import { ContentRoute } from "../../../../_metronic/layout";
import BatchProfileView from "../../Production/BatchPreparation/tabs/batch-preparation/view/BatchProfileView";
import SalesOrder from "./tabs/sales-order/SalesOrder";
import SalesReturn from "./tabs/sales-return/SalesReturn";
import StockTransfer from "./tabs/stock-transfer/StockTransfer";
import StoreMovementRoute from "./tabs/store-movement/StoreMovementRoute";
import DamageDeclarationRoute from "./tabs/damage-declaration/DamageDeclarationRoute";
import Reports from "./tabs/reports/Reports";
import ProductOpeningStock from "./tabs/product-opening-stock/ProductOpeningStock";
export default function StockRoutePage() {
  return (
    <Switch>
      <Redirect
        exact={true}
        from="/inventory/stock"
        to="/inventory/stock/stock-list"
      />

      <ContentRoute
        path="/inventory/stock/stock-list"
        component={StockData}
      />

      <ContentRoute
        path="/inventory/stock/stock-view"
        component={BatchProfileView}
      />

      <ContentRoute
        path="/inventory/stock/sales-order"
        component={SalesOrder}
      />

      <ContentRoute
        path="/inventory/stock/sales-return"
        component={SalesReturn}
      />

      <ContentRoute
        path="/inventory/stock/stock-transfer"
        component={StockTransfer}
      />

      <ContentRoute
        path="/inventory/stock/stock-store"
        component={StoreMovementRoute}
      />

      <ContentRoute
        path="/inventory/stock/stock-damage"
        component={DamageDeclarationRoute}
      />
      <ContentRoute
        path="/inventory/stock/product-opening-stock"
        component={ProductOpeningStock}
      />
      <ContentRoute
        path="/inventory/stock/stock-report"
        component={Reports}
      />
    </Switch>
  );
}
