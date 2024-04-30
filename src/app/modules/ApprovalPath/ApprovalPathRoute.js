import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { useSubheader } from "../../../_metronic/layout";
import ApprovalStepList from "./approvalStepSetup/ApprovalStepList";
import ApprovalStepCreate from "./approvalStepSetup/ApprovalStepCreate";
import AuthorizationFeature from "./authorization-feature/AuthorizationFeature";
import MultilayerApprovalPathList from "./multilayer-approval-path/MultilayerApprovalPathList";
import MultilayerApprovalPathCreate from "./multilayer-approval-path/MultilayerApprovalPathCreate";

import AuthorizationFeatureList from "./authorization-feature/table/AuthorizationFeatureList";
export default function ApprovalPathRoute() {
  const suhbeader = useSubheader();
  suhbeader.setTitle("Approval Path");

  return (
    <div className="d-flex flex-row">
      <div className="flex-row-fluid ml-lg-8">
        <Switch>
          <Redirect
            from="/approval-path"
            exact={true}
            to="/approval-path/approval-step-setup"
          />
          <Route
            path="/approval-path/approval-step-setup"
            component={ApprovalStepList}
          />
          <Route
            path="/approval-path/approval-step-setup-new"
            component={ApprovalStepCreate}
          />
          <Route
            path="/approval-path/authorization-feature"
            component={AuthorizationFeatureList}
          />
          <Route
            path="/approval-path/authorization-feature-new"
            component={AuthorizationFeature}
          />
          <Route
            path="/approval-path/multilayer-approval-path-setup"
            component={MultilayerApprovalPathList}
          />
          <Route
            path="/approval-path/multilayer-approval-path-setup-new"
            component={MultilayerApprovalPathCreate}
          />
        </Switch>
      </div>
    </div>
  );
}
