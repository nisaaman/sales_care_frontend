import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../../_metronic/layout";
import TradePriceSetup from "./tab/TradePriceSetup";

export default function TradePriceSetupRouting() {
  return (
    <Switch>
      <Redirect
        exact={true}
        from="/salescollection/configure/trade-price-setup"
        to="/salescollection/configure/trade-price-setup/list"
      />

      <ContentRoute
        path="/salescollection/configure/trade-price-setup/list"
        component={TradePriceSetup}
      /> 
    </Switch>
  );
}