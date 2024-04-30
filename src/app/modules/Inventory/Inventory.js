import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { ConfigurePage } from "./configure/ConfigurePage";
import { ContentRoute } from "../../../_metronic/layout";
import StockRoutePage from "./Stock/StockRoutePage";

export default function Inventory() {
  return (
    <Switch>
      <Redirect
        exact={true}
        from="/inventory"
        to="/inventory/configure/product-configure"
      />
      {/* Inputs */}
      <ContentRoute from="/inventory/configure" component={ConfigurePage} />
      <ContentRoute from="/inventory/stock" component={StockRoutePage} />
    </Switch>
  );
}
