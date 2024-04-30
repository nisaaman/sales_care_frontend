import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
import { PaymentCollectionOverview } from "./payment-collection-overview/tabs/PaymentCollectionOverview"
import { CollectionData } from "./collection-data/tabs/CollectionData"
import { ORDCalculator } from "./ord-calculator/tabs/ORDCalculator"
import { CollectionDataView } from "./collection-data/view-pages/CollectionDataView"
import { Ord } from "./ORD/tab/Ord";
import { Calculator } from "./ord-calculator/view/Calculator";
import  CollectionBudgetTabsRoute  from "./collection-budget/tab/CollectionBudgetTabsRoute"
import PaymentCollectionInvoices from "./invoices/tab/PaymentCollectionInvoicesRoute";
import { PaymentCollectionReportRouting } from "./report/PaymentCollectionReportRouting";

export function PaymentCollectionRouting() {
  return (
    <Switch>
      <Redirect
        exact={true}
        from="/salescollection/payment-collection"
        to="/salescollection/payment-collection/overview"
      />

      <ContentRoute
        path="/salescollection/payment-collection/overview"
        component={PaymentCollectionOverview}
      />

      <ContentRoute
        path="/salescollection/payment-collection/collection-data"
        component={CollectionData}
      />

      <ContentRoute
        path="/salescollection/payment-collection/invoices"
        component={PaymentCollectionInvoices}
      />

      <ContentRoute
        path="/salescollection/payment-collection/collection-data-view"
        component={CollectionDataView}
      />

      <ContentRoute
        path="/salescollection/payment-collection/ord"
        component={Ord}
      />
      <ContentRoute
        path="/salescollection/payment-collection/ord-calculator"
        component={ORDCalculator}
      />

      <ContentRoute
        path="/salescollection/payment-collection/ord-calculator-view"
        component={Calculator}
      />

      <ContentRoute
        path="/salescollection/payment-collection/collection-budget"
        component={CollectionBudgetTabsRoute}
      />
      <ContentRoute
        path="/salescollection/payment-collection/report"
        component={PaymentCollectionReportRouting}
      />

    </Switch>
  );
}