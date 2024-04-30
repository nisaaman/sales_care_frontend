import React from "react";
import { Redirect, Switch } from "react-router-dom";
import CompanyListPage from "./CompanyListPage";
import { CompanyCreate } from "./CompanyCreate/CompanyCreate"
import { ContentRoute } from "../../../_metronic/layout";

export default function CompanyRoute() {
  return (
    <Switch>
      <Redirect
        exact={true}
        from="/company"
        to="/company/list"
      />

      <ContentRoute
        path="/company/list"
        component={CompanyListPage}
      />
       <ContentRoute
        path="/company/new"
        component={CompanyCreate}
      />
    </Switch>
  );
}
