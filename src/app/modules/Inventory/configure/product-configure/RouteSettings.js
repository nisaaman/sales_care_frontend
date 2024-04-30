import React from "react";
import { Redirect, Switch } from "react-router-dom";
import ProductConfigurePage from "./ProductConfigurePage";
import { ProductProfileCreate } from "./product-profile-create/ProductProfileCreate"
import { ContentRoute } from "../../../../../_metronic/layout";

export default function RouteSettings() {
  return (
    <Switch>
      <Redirect
        exact={true}
        from="/inventory/configure/product-configure"
        to="/inventory/configure/product-configure/list"
      />

      <ContentRoute
        path="/inventory/configure/product-configure/list"
        component={ProductConfigurePage}
      />
       <ContentRoute
        path="/inventory/configure/product-configure/new"
        component={ProductProfileCreate}
      />
    </Switch>
  );
}
