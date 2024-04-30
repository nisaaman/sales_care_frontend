import React from "react";
import {Redirect, Switch} from "react-router-dom";
import {ContentRoute} from "../../../../../_metronic/layout";
import AllPage from "./tabs/all-list/AllPage";
import ViewPage from "./tabs/all-list/view/ViewPage";
import CreditAdd from "./tabs/all-list/create/credit/CreditAdd";
import DebitAdd from "./tabs/all-list/create/debit/DebitAdd";
import ApprovalPage from "./tabs/approval-list/ApprovalPage";
import ApprovalViewPage from "./tabs/approval-list/view/ApprovalViewPage";

export default function CreditDebitNoteRoute() {
  return (
    <Switch>
      <Redirect
        exact={true}
        from="/salescollection/payment-adjustment/credit-debit-note"
        to="/salescollection/payment-adjustment/credit-debit-note/all-list"
      />

      <ContentRoute
        path="/salescollection/payment-adjustment/credit-debit-note/all-list"
        component={AllPage}
      />
      <ContentRoute
        path="/salescollection/payment-adjustment/credit-debit-note/view"
        component={ViewPage}
      />

      <ContentRoute
        path="/salescollection/payment-adjustment/credit-debit-note/credit-add-page"
        component={CreditAdd}
      />

      <ContentRoute
        path="/salescollection/payment-adjustment/credit-debit-note/debit-add-page"
        component={DebitAdd}
      /> 

      <ContentRoute
        path="/salescollection/payment-adjustment/credit-debit-note/approval-list"
        component={ApprovalPage}
      />  

      <ContentRoute
        path="/salescollection/payment-adjustment/credit-debit-note/approval-view"
        component={ApprovalViewPage}
      />    
    </Switch>
  );
}