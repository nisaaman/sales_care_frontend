import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../../_metronic/layout";
import { AcknowledgeReport } from "./AcknowledgeReport";

export function PaymentCollectionReportRouting() {
  return (
    <Switch>
      <Redirect
        exact={true}
        from="/salescollection/payment-collection/report"
        to="/salescollection/payment-collection/report/acknowledge-report"
      />

      <ContentRoute
        path="/salescollection/payment-collection/report/acknowledge-report"
        component={AcknowledgeReport}
      />
    </Switch>
  );
}