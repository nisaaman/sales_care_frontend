import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../../_metronic/layout";
import All from "./tabs/all/All";
import AllVerifView from "./tabs/all/view/AllVerifView";

export default function PaymentVerifyRoute() {
  return (
    <Switch>
      <Redirect
        exact={true}
        from="/salescollection/payment-adjustment/payment-verify"
        to="/salescollection/payment-adjustment/payment-verify/all"
      />

      <ContentRoute
        path="/salescollection/payment-adjustment/payment-verify/all"
        component={All}
      />

      <ContentRoute
        path="/salescollection/payment-adjustment/payment-verify/view-verify"
        component={AllVerifView}
      />
       
    </Switch>
  );
}