import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../../_metronic/layout";
import ORDList from "./tab/ord-setup/ORDList";
import {ORDAdd} from "./tab/ord-setup/create/ORDAdd";
import OverDueList from "./tab/over-due-setup/OverDueList";
import { OverDueAdd } from "./tab/over-due-setup/create/OverDueAdd";

export default function OrdOverdueSetupRouting() {
  return (
    <Switch>
      <Redirect
        exact={true}
        from="/salescollection/configure/ord-overdue-setup"
        to="/salescollection/configure/ord-overdue-setup/ord-list"
      />

      <ContentRoute
        path="/salescollection/configure/ord-overdue-setup/ord-list"
        component={ORDList}
      /> 

      <ContentRoute
        path="/salescollection/configure/ord-overdue-setup/ord-list-add"
        component={ORDAdd}
      /> 

      <ContentRoute
        path="/salescollection/configure/ord-overdue-setup/ord-list-overdue"
        component={OverDueList}
      /> 

      <ContentRoute
        path="/salescollection/configure/ord-overdue-setup/ord-list-overdue-add"
        component={OverDueAdd}
      /> 
    </Switch>
  );
}