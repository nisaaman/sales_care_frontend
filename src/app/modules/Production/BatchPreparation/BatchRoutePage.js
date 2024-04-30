import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
import BatchPreparation from "./tabs/batch-preparation/BatchPreparation";
import BatchPreparationCreateBatch from "./tabs/batch-preparation/create/BatchPreparationCreateBatch";
import BatchProfileView from "./tabs/batch-preparation/view/BatchProfileView";
import QRView from "./tabs/batch-preparation/view/QRView";
import Tickets from "./tabs/tickets/Tickets";
import ProductionOverview from "./tabs/overview/ProductionOverview";
export function BatchRoutePage() {
  return (
    <Switch>
      <Redirect
        exact={true}
        from="/production/production-batch-preparation"
        to="/production/production-batch-preparation/production"
      />

    <ContentRoute
        path="/production/production-batch-preparation/production"
        component={ProductionOverview}
      />

      <ContentRoute
        path="/production/production-batch-preparation/production-batch-preparation-product"
        component={BatchPreparation}
      />
      <ContentRoute
        path="/production/production-batch-preparation/production-batch-preparation-product-new"
        component={BatchPreparationCreateBatch}
      />
      <ContentRoute
        path="/production/production-batch-preparation/production-batch-preparation-product-stock"
        component={BatchProfileView}
      />
      <ContentRoute
        path="/production/production-batch-preparation/production-batch-preparation-product-qr"
        component={QRView}
      />
      <ContentRoute
        path="/production/production-batch-preparation/production-batch-preparation-product-tickets"
        component={Tickets}
      />
    </Switch>
  );
}