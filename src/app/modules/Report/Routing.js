import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../_metronic/layout";
import { MisReportRouting } from "./mis-report/MisReportRouting";
export default function Routing() {
  return (
    <Switch>
      <Redirect
        exact={true}
        from="/report"
        to="/report/mis-report"
      />
      {/* Inputs */}
       <ContentRoute from="/report/mis-report" component={MisReportRouting} />  
    </Switch>

    
  );
}