import React from "react";
import { Redirect, Switch } from "react-router-dom";
import ProductRouteSettings from "./product-configure/RouteSettings";
import RouteSettings from "./depot/RouteSettings";
import { ContentRoute } from "../../../../_metronic/layout";

export function ConfigurePage() {
  return (
    <Switch>
      <Redirect
        exact={true}
        from="/inventory/configure"
        to="/inventory/configure/product-configure"
      />

      <ContentRoute
        path="/inventory/configure/product-configure"
        component={ProductRouteSettings}
      />

      <ContentRoute
        path="/inventory/configure/depot-configure"
        component={RouteSettings}
      />
    </Switch>
  );
}
