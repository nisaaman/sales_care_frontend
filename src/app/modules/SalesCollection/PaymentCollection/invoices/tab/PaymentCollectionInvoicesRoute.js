import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../../../_metronic/layout";
import DistributorWise from "./tabs/DistributorWise";
import SalesOfficerWise from "./tabs/SalesOfficerWise";
import DistributorWiseView from "../view/DistributorWiseView";
import SalesOfficerWiseView from "../view/SalesOfficerWiseView";

export default function PaymentCollectionInvoicesRoute() {
  return (
    <Switch>
      <Redirect
        exact={true}
        from="/salescollection/payment-collection/invoices"
        to="/salescollection/payment-collection/invoices/distributor-wise"
      />

      <ContentRoute
        path="/salescollection/payment-collection/invoices/distributor-wise"
        component={DistributorWise}
      />

      <ContentRoute
        path="/salescollection/payment-collection/invoices/distributor-wise-view"
        component={DistributorWiseView}
      />

      <ContentRoute
        path="/salescollection/payment-collection/invoices/sales-officer-wise"
        component={SalesOfficerWise}
      />

      <ContentRoute
        path="/salescollection/payment-collection/invoices/sales-officer-wise-view"
        component={SalesOfficerWiseView}
      />
    </Switch>
  );
}