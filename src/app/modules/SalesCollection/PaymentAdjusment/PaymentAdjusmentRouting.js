import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
import { OverViewPage } from "./overview/OverViewPage";
import PaymentVerifyRoute from "./payment-verify/PaymentVerifyRoute";
import PaymentAdjustmentRoute from "./payment-adjustment/PaymentAdjustmentRoute";
import ORDSettlementRoute from "./ord-settlement/ORDSettlementRoute";
import CreditDebitNoteRoute from "./credit-debit-note/CreditDebitNoteRoute";

export default function PaymentAdjusmentRouting() {
  return (
    <Switch>
      <Redirect
        exact={true}
        from="/salescollection/payment-adjustment"
        to="/salescollection/payment-adjustment/payment-verify"
      />

      <ContentRoute
        path="/salescollection/payment-adjustment/overview"
        component={OverViewPage}
      />

      <ContentRoute
        path="/salescollection/payment-adjustment/payment-verify"
        component={PaymentVerifyRoute}
      />

      <ContentRoute
        path="/salescollection/payment-adjustment/payment-adjustment"
        component={PaymentAdjustmentRoute}
      />

      <ContentRoute
        path="/salescollection/payment-adjustment/ord-settlement"
        component={ORDSettlementRoute}
      />  

      <ContentRoute
        path="/salescollection/payment-adjustment/credit-debit-note"
        component={CreditDebitNoteRoute}
      />   
    </Switch>
  );
}