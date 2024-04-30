import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../../_metronic/layout";
import InvoicesList from "./tabs/invoices-map/InvoicesList";
import InvoicesAdjustView from "./tabs/invoices-map/view/InvoicesAdjustView";
import HistoryPage from "./tabs/history/HistoryPage";

export default function PaymentAdjustmentRoute() {
  return (
    <Switch>
      <Redirect
        exact={true}
        from="/salescollection/payment-adjustment/payment-adjustment"
        to="/salescollection/payment-adjustment/payment-adjustment/invoices-map"
      />

      <ContentRoute
        path="/salescollection/payment-adjustment/payment-adjustment/invoices-map"
        component={InvoicesList}
      />
       
       <ContentRoute
        path="/salescollection/payment-adjustment/payment-adjustment/invoices-adjust-view"
        component={InvoicesAdjustView}
      />

      <ContentRoute
        path="/salescollection/payment-adjustment/payment-adjustment/history"
        component={HistoryPage}
      />
    </Switch>
  );
}