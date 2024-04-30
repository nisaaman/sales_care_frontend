import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../../../_metronic/layout";
import SalesBudgetProductWise from "./tabs/SalesBudgetProductWise";
import SalesBudgetDistributorWise from "./tabs/SalesBudgetDistributorWise";
import SalesBudgetSalesOfficerWise from "./tabs/SalesBudgetSalesOfficerWise";

export default function SalesBudgetTabsRoute() {
  return (
    <Switch>
      <Redirect
        exact={true}
        from="/salescollection/sales/sales-budget"
        to="/salescollection/sales/sales-budget/product-wise"
      />

      <ContentRoute
        path="/salescollection/sales/sales-budget/product-wise"
        component={SalesBudgetProductWise}
      />

      <ContentRoute
        path="/salescollection/sales/sales-budget/distributor-wise"
        component={SalesBudgetDistributorWise}
      />

      <ContentRoute
        path="/salescollection/sales/sales-budget/sales-officer-wise"
        component={SalesBudgetSalesOfficerWise}
      />
    </Switch>
  );
}