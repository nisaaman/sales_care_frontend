import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { BatchRoutePage } from "./BatchPreparation/BatchRoutePage";
import { ContentRoute } from "../../../_metronic/layout";
import  QaReviewRoute  from "./QA/qa-review/QaReviewRoute";

export default function Production() {
  return (
    <Switch>
      <Redirect
        exact={true}
        from="/production"
        to="/production/production-batch-preparation"
      />
      {/* Inputs */}
      <ContentRoute from="/production/production-batch-preparation" component={BatchRoutePage} />
      <ContentRoute from="/production/production-qa" component={QaReviewRoute} />
    </Switch>
  );
}
