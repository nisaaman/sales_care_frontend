import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../../_metronic/layout";
import TimeLineList from "./view/TimeLineList";
import {TimeLineAdd} from "./create/TimeLineAdd";

export default function TimeLineRouting() {
  return (
    <Switch>
      <Redirect
        exact={true}
        from="/salescollection/configure/time-line-setup"
        to="/salescollection/configure/time-line-setup/list"
      />

      <ContentRoute
        path="/salescollection/configure/time-line-setup/list"
        component={TimeLineList}
      />  

      <ContentRoute
        path="/salescollection/configure/time-line-setup/list-add"
        component={TimeLineAdd}
      /> 
    </Switch>
  );
}