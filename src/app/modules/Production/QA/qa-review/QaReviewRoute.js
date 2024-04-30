import React from "react";
import { Redirect, Switch } from "react-router-dom";
import QAReview from "./QAReview";
//import NewQA from "./create/NewQA";
import { ContentRoute } from "../../../../../_metronic/layout";

export default function QaReviewRoute() {
  return (
    <Switch>
      <Redirect
        exact={true}
        from="/production/production-qa"
        to="/production/production-qa/production-qa-setup"
      />

      <ContentRoute
        path="/production/production-qa/production-qa-setup"
        component={QAReview}
      />
      {/* <ContentRoute
        path="/production/production-qa/production-qa-setup-new"
        component={NewQA}
      /> */}
    </Switch>
  );
}
