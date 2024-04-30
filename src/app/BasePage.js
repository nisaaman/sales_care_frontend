import React, { Suspense, lazy } from "react";
import { Redirect, Switch, Route } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../_metronic/layout";
import { DashboardPage } from "./pages/DashboardPage";

const Production = lazy(() =>
  import("./modules/Production/Production")
);

const Inventory = lazy(() =>
  import("./modules/Inventory/Inventory")
);

const SalesAndCollection = lazy(() =>
  import("./modules/SalesCollection/Routing")
);

const UserManagementRoute = lazy(() =>
  import("./modules/UserManagement/UserManagementRoute")
);

const MasterConfig = lazy(() =>
  import("./modules/master-config/MasterConfig")
);

const CompanyRoute = lazy(() =>
  import("./modules/Company/CompanyRoute")
);

const LocationRoute = lazy(() =>
  import("./modules/Location/LocationRoute")
);
const ApprovalPathRoute = lazy(() =>
  import("./modules/ApprovalPath/ApprovalPathRoute")
);
const ReportPathRoute = lazy(() =>
  import("./modules/Report/Routing")
);
export default function BasePage() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {
        /* Redirect from root URL to /dashboard. */
        <Redirect exact from="/" to="/dashboard" />
        }
        <ContentRoute path="/dashboard" component={DashboardPage} />
        <Route path="/production" component={Production} />
        <Route path="/inventory" component={Inventory} />
        <Route path="/salescollection" component={SalesAndCollection} />
        <Route path="/user-management" component={UserManagementRoute} />
        <Route path="/master-config" component={MasterConfig} />

        <Route path="/company" component={CompanyRoute} />
        <Route path="/approval-path" component={ApprovalPathRoute} />
        <Route path="/location" component={LocationRoute} />
        <Route path="/report" component={ReportPathRoute} />
        <Redirect to="error/error-v1" /> 
      </Switch>
    </Suspense>
  );
}
