import React from "react";
import { Redirect, Switch } from "react-router-dom";
import Location from "./Location";
import { LocationCreate } from "./location-create/LocationCreate"
import { ContentRoute } from "../../../_metronic/layout";

export default function LocationRoute() {
  return (
    <Switch>
      <Redirect
        exact={true}
        from="/location"
        to="/location/list"
      />

      <ContentRoute
        path="/location/list"
        component={Location}
      />
       <ContentRoute
        path="/location/new"
        component={LocationCreate}
      />
    </Switch>
  );
}
