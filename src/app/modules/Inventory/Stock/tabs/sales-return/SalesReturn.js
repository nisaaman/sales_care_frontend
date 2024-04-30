import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../../../_metronic/layout";
import Proposal from "./sub-tabs/proposal/Proposal";
import ReceivedAndQA from "./sub-tabs/receive-and-qa/ReceivedAndQA";

export default function SalesReturn() {
  return (
    <Switch>
      <Redirect
        exact={true}
        from="/inventory/stock/sales-return"
        to="/inventory/stock/sales-return/sales-return-list"
      />

      <ContentRoute
        path="/inventory/stock/sales-return/sales-return-list"
        component={Proposal}
      />

      <ContentRoute
        path="/inventory/stock/sales-return/received-qa-list"
        component={ReceivedAndQA}
      />   
    </Switch>
  );
}
