import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../../_metronic/layout";
import PaymentBookList from "./tab/payment-book/PaymentBookList";
import { PaymentBookAdd } from  "./tab/create/PaymentBookAdd";

export default function PaymentBookSetupRoute() {
  return (
    <Switch>
      <Redirect
        exact={true}
        from="/salescollection/configure/payment-book"
        to="/salescollection/configure/payment-book/payment-book-setup"
      />

      <ContentRoute
        path="/salescollection/configure/payment-book/payment-book-setup"
        component={PaymentBookList}
      />

      <ContentRoute
        path="/salescollection/configure/payment-book/payment-book-setup-new"
        component={PaymentBookAdd}
      />

    </Switch>
  );
}