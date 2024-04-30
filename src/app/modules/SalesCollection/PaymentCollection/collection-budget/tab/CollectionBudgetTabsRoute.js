import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../../../_metronic/layout";
import CollectionBudgetDistributorWise from "./tabs/CollectionBudgetDistributorWise";
import CollectionBudgetSalesOfficerWise from "./tabs/CollectionBudgetSalesOfficerWise";

export default function CollectionBudgetTabsRoute() {
  return (
    <Switch>
      <Redirect
        exact={true}
        from="/salescollection/payment-collection/collection-budget"
        to="/salescollection/payment-collection/collection-budget/distributor-wise"
      />

      <ContentRoute
        path="/salescollection/payment-collection/collection-budget/distributor-wise"
        component={CollectionBudgetDistributorWise}
      />

      <ContentRoute
        path="/salescollection/payment-collection/collection-budget/sales-officer-wise"
        component={CollectionBudgetSalesOfficerWise}
      />
    </Switch>
  );
}