import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { SalesRouting } from './Sales/SalesRouting';
import { PaymentCollectionRouting } from "./PaymentCollection/PaymentCollectionRouting";
import PaymentAdjusmentRouting  from "./PaymentAdjusment/PaymentAdjusmentRouting";
import  DistributorsRouting  from "./Distributors/DistributorsRouting";
import ConfigureRouting from "./Configure/ConfigureRouting";
import { ContentRoute } from "../../../_metronic/layout";
export default function Routing() {
  return (
    <Switch>
      <Redirect
        exact={true}
        from="/salescollection"
        to="/salescollection/sales"
      />
      {/* Inputs */}
      <ContentRoute from="/salescollection/sales" component={SalesRouting} />
      <ContentRoute from="/salescollection/payment-collection" component={PaymentCollectionRouting} />
      <ContentRoute from="/salescollection/payment-adjustment" component={PaymentAdjusmentRouting} />
      <ContentRoute from="/salescollection/distributors" component={DistributorsRouting} />
      <ContentRoute from="/salescollection/configure" component={ConfigureRouting} />
    </Switch>
  );
}