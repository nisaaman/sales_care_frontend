import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../../_metronic/layout";
import AllPage from "./tabs/all-list/AllPage";

export default function ORDSettlementRoute() {
  return (
    <Switch>
      <Redirect
        exact={true}
        from="/salescollection/payment-adjustment/ord-settlement"
        to="/salescollection/payment-adjustment/ord-settlement/all-list"
      />

      <ContentRoute
        path="/salescollection/payment-adjustment/ord-settlement/all-list"
        component={AllPage}
      />
    </Switch>
  );
}