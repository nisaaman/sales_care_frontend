import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
import { FinanceReportRouting } from "./finance-report/FinanceReportRouting";
import { InventoryReportRouting } from "./inventory/InventoryReportRouting";
import { OthersReportRouting } from "./others/OthersReportRouting";
import { SalesAndCollectionReportRouting } from "./sales-and-collection/SalesAndCollectionReportRouting";
import MaterialPlannerReport from "./material-planner-report/MaterialPlannerReport";

export function MisReportRouting() {
  return (
    <Switch>
      <Redirect
        exact={true}
        from="/report/mis-report"
        to="/report/mis-report/finance-report"
      />

      <ContentRoute
        path="/report/mis-report/finance-report"
        component={FinanceReportRouting}
      />

      <ContentRoute
        path="/report/mis-report/mis-report-inventory"
        component={InventoryReportRouting}
      />

      <ContentRoute
        path="/report/mis-report/mis-report-others"
        component={OthersReportRouting}
      />
      <ContentRoute
        path="/report/mis-report/mis-report-sales-and-collection"
        component={SalesAndCollectionReportRouting}
      />


     {/* <ContentRoute
        path="/report/mis-report/inventory"
        component={InventoryReportRouting}
      /> */}

      {/* 

      // <ContentRoute
      //   path="/report/mis-report/finance-report/SalesAndCollection"
      //   component={SalesAndCollection}
      // />

      // <ContentRoute
      //   path="/report/mis-report/finance-report/SalesReturnReport"
      //   component={SalesReturnReport}
      // />


      //  <ContentRoute
      //   path="/report/mis-report/finance-report/SalesBudgetReport"
      //   component={SalesBudgetReport}
      // /> 

      // <ContentRoute
      //   path="/report/mis-report/finance-report/SalesAndCollectionForecastReport"
      //   component={SalesAndCollectionForecastReport}
      // /> 

      // <ContentRoute
      //   path="/report/mis-report/others/ProfitabilityAnalysisReport"
      //   component={ProfitabilityAnalysisReport}
      // /> 
      // <ContentRoute
      //   path="/report/mis-report/finance-report/OrderToCashCycle"
      //   component={OrderToCashCycle}
      // />
      // <ContentRoute
      //   path="/report/mis-report/finance-report/InvoiceWiseAgingReport"
      //   component={InvoiceWiseAgingReport}
      // /> */}
       <ContentRoute
        path="/report/mis-report/mis-report-material-planner"
        component={MaterialPlannerReport}
      />
    </Switch>
  );
}