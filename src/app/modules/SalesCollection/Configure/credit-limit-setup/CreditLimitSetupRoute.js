import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../../_metronic/layout";
import CreditLimitSetup from "./CreditLimitSetup";
import CreditLimitAdd from "./CreditLimitAdd";
export default function CreditLimitSetupRoute() {
  return (
    <Switch>
      <Redirect
        exact={true}
        from="/salescollection/configure/credit-limit-setup"
        to="/salescollection/configure/credit-limit-setup/credit-limit-setup"
      />

      <ContentRoute
        path="/salescollection/configure/credit-limit-setup/credit-limit-setup"
        component={CreditLimitSetup}
      />  
      <ContentRoute
        path="/salescollection/configure/credit-limit-setup/credit-limit-setup-new"
        component={CreditLimitAdd}
      />
    </Switch>
  );
}