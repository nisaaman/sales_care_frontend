import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
import  DistributorsOverview  from "./overview/tab/DistributorsOverview";
import  DistributorsList from "./distributor-list/tab/DistributorsList";
import  CreditLimitProposal  from "./credit-limit-proposal/tab/CreditLimitProposal";
import  DistributorsActivity  from "./activity/tab/DistributorsActivity";
import  ActivityListView  from "./activity/view/ActivityListView";
import {DistributorsAdd} from "./add-distributors/DistributorsAdd"
import DistributorsReports from "./report/tab/DistributorsReports";
import OpeningBalance from "./opening-balance/OpeningBalance";
import DistributorUpload from "./upload/DistributorUpload";

export default function PaymentCollectionRouting() {
  return (
    <Switch>
      <Redirect
        exact={true}
        from="/salescollection/distributors"
        to="/salescollection/distributors/overview"
      />

      <ContentRoute
        path="/salescollection/distributors/overview"
        component={DistributorsOverview}
      />

      <ContentRoute
        path="/salescollection/distributors/distributors-list"
        component={DistributorsList}
      />

      <ContentRoute
        path="/salescollection/distributors/credit-limit-proposal"
        component={CreditLimitProposal}
      />

      <ContentRoute
        path="/salescollection/distributors/activity"
        component={DistributorsActivity}
      />

      <ContentRoute
        path="/salescollection/distributors/activity-view"
        component={ActivityListView}
      />

      <ContentRoute
        path="/salescollection/distributors/add-new-distributor"
        component={DistributorsAdd}
      />

      <ContentRoute
        path="/salescollection/distributors/reports"
        component={DistributorsReports}
      />

      <ContentRoute
        path="/salescollection/distributors/opening-balance"
        component={OpeningBalance}
      />
      <ContentRoute
        path="/salescollection/distributors/upload"
        component={DistributorUpload}
      />
      
    </Switch>
  );
}