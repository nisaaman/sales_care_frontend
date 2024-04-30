import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../../../_metronic/layout";
import SalesCollectionReport from "./sub-tabs/sales-collection-reports/SalesCollectionReport"

export default function Reports() {
  return (
    <Switch>
      <Redirect
        exact={true}
        from="/inventory/stock/stock-report"
        to="/inventory/stock/stock-report/stock-report-salescollection"
      />

      <ContentRoute
        path="/inventory/stock/stock-report/stock-report-salescollection"
        component={SalesCollectionReport}
      />  
    </Switch>
  );
}
