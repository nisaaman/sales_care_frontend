import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../../_metronic/layout";
import TradeDiscountSetup from "./tab/TradeDiscountSetup";

export default function TradeDiscountSetupRouting() {
  return (
    <Switch>
      <Redirect
        exact={true}
        from="/salescollection/configure/trade-discount-setup"
        to="/salescollection/configure/trade-discount-setup/list"
      />

      <ContentRoute
        path="/salescollection/configure/trade-discount-setup/list"
        component={TradeDiscountSetup}
      /> 
    </Switch>
  );
}