import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../../_metronic/layout";
import ReceivableInvoiceStatement from "./ReceivableInvoiceStatement";
import StockValuation from "../inventory/StockValuation";
import SalesAndCollection from "../sales-and-collection/SalesAndCollection";
import SalesReturnReport from "../sales-and-collection/SalesReturnReport";
import SalesBudgetReport from "../sales-and-collection/SalesBudgetReport";
import SalesAndCollectionForecastReport from "../sales-and-collection/SalesAndCollectionForecastReport";
import ProfitabilityAnalysisReport from "../others/ProfitabilityAnalysisReport";
import OrderToCashCycle from "../inventory/OrderToCashCycle";
import InvoiceWiseAgingReport from "../sales-and-collection/InvoiceWiseAgingReport";
import ReceivableOverdueReport from "../sales-and-collection/ReceivableOverdueReport";

export function FinanceReportRouting() {
  return (
    <Switch>
      <Redirect
        exact={true}
        from="/report/mis-report/finance-report"
        to="/report/mis-report/finance-report/ReceivableInvoiceStatement"
      />

      <ContentRoute
        path="/report/mis-report/finance-report/ReceivableInvoiceStatement"
        component={ReceivableInvoiceStatement}
      />

      {/* <ContentRoute
        path="/report/mis-report/inventory/StockValuation"
        component={StockValuation}
      /> */}

      <ContentRoute
        path="/report/mis-report/finance-report/SalesAndCollection"
        component={SalesAndCollection}
      />

      <ContentRoute
        path="/report/mis-report/finance-report/SalesReturnReport"
        component={SalesReturnReport}
      />


       <ContentRoute
        path="/report/mis-report/finance-report/SalesBudgetReport"
        component={SalesBudgetReport}
      /> 

      <ContentRoute
        path="/report/mis-report/finance-report/SalesAndCollectionForecastReport"
        component={SalesAndCollectionForecastReport}
      /> 

      <ContentRoute
        path="/report/mis-report/others/ProfitabilityAnalysisReport"
        component={ProfitabilityAnalysisReport}
      /> 
      <ContentRoute
        path="/report/mis-report/finance-report/OrderToCashCycle"
        component={OrderToCashCycle}
      />
      <ContentRoute
        path="/report/mis-report/finance-report/InvoiceWiseAgingReport"
        component={InvoiceWiseAgingReport}
      />
       <ContentRoute
        path="/report/mis-report/finance-report/ReceivableOverdueReport"
        component={ReceivableOverdueReport}
      />
    </Switch>
  );
}