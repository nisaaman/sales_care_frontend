import React from "react";
import { Redirect, Switch } from "react-router-dom";
import Depot from "./Depot";
import { DepotCreate } from "./depot-create/DepotCreate"
import { ContentRoute } from "../../../../../_metronic/layout";

export default function RouteSettings() {
  return (
    <Switch>
      <Redirect
        exact={true}
        from="/inventory/configure/depot-configure"
        to="/inventory/configure/depot-configure/list"
      />

      <ContentRoute
        path="/inventory/configure/depot-configure/list"
        component={Depot}
      />
       <ContentRoute
        path="/inventory/configure/depot-configure/new"
        component={DepotCreate}
      />
    </Switch>
  );
}
