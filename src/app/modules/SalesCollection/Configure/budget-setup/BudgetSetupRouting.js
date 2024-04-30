import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../../_metronic/layout";
import DistributorWiseList from "./tab/distributor-wise/DistributorWiseList";


export default function BudgetSetupRouting() {
  return (
    <Switch>
      <Redirect
        exact={true}
        from="/salescollection/configure/budget-setup"
        to="/salescollection/configure/budget-setup/distributor-wise-list"
      />

      <ContentRoute
        path="/salescollection/configure/budget-setup/distributor-wise-list"
        component={DistributorWiseList}
      /> 
    </Switch>
  );
}