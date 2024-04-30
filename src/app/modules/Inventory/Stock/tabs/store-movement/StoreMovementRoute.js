import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../../../_metronic/layout";
import StoreMovement from "./List/StoreMovement";
export default function StoreMovementRoute() {
  return (
    <Switch>
      <Redirect
        exact={true}
        from="/inventory/stock/stock-store"
        to="/inventory/stock/stock-store/stock-store-movement"
      />

      <ContentRoute
        path="/inventory/stock/stock-store/stock-store-movement"
        component={StoreMovement}
      />  
    </Switch>
  );
}
