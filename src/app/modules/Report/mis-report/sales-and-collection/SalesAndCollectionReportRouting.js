import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../../_metronic/layout";
import InvoiceWiseAgingReport from "./InvoiceWiseAgingReport";
import ReceivableOverdueReport from "./ReceivableOverdueReport";
import SalesCollectionReport from "./SalesAndCollection";
import SalesReturnReport from "./SalesReturnReport";
import SalesAndCollectionForecastReport from "./SalesAndCollectionForecastReport";
import SalesBudgetReport from "./SalesBudgetReport";
import ProductTradePriceChangeHistory from "./ProductTradePriceChangeHistory";
import PerformanceReport from "./PerformanceReport";
import CreditLimitHistoryReport from "./CreditLimitHistoryReport";
import DebitCreditNoteReport from "./DebitCreditNoteReport.js";
import CollectionReport from "./CollectionReport.js";
//import InvoiceTypeWiseSummaryReport from "./InvoiceTypeWiseSummaryReport";

export function SalesAndCollectionReportRouting() {
  return (
    <Switch>
      <Redirect
        exact={true}
        from="/report/mis-report/mis-report-sales-and-collection"
        to="/report/mis-report/mis-report-sales-and-collection/mis-report-sales-and-collection-reports"
      />
 
      <ContentRoute
        path="/report/mis-report/mis-report-sales-and-collection/mis-report-sales-and-collection-reports"
        component={SalesCollectionReport}
      />

      <ContentRoute
        path="/report/mis-report/mis-report-sales-and-collection/collection-report"
        component={CollectionReport}
      />

      <ContentRoute
        path="/report/mis-report/mis-report-sales-and-collection/mis-report-sales-and-collection-sales-return-report"
        component={SalesReturnReport}
      />
       <ContentRoute
        path="/report/mis-report/mis-report-sales-and-collection/mis-report-sales-and-collection-sales-budget-report"
        component={SalesBudgetReport}
      />

    <ContentRoute
        path="/report/mis-report/mis-report-sales-and-collection/mis-report-sales-and-collection-sales-and-collection-forecast-report"
        component={SalesAndCollectionForecastReport}
      />

    <ContentRoute
        path="/report/mis-report/mis-report-sales-and-collection/mis-report-sales-and-collection-invoice-wise-aging-report"
        component={InvoiceWiseAgingReport}
      />
    <ContentRoute
        path="/report/mis-report/mis-report-sales-and-collection/mis-report-sales-and-collection-receivable-overdue-report"
        component={ReceivableOverdueReport}
      />
      <ContentRoute
        path="/report/mis-report/mis-report-sales-and-collection/mis-report-sales-and-collection-product-trade-price-change-history"
        component={ProductTradePriceChangeHistory}
      />
       <ContentRoute
        path="/report/mis-report/mis-report-sales-and-collection/mis-report-sales-and-collection-performance-report"
        component={PerformanceReport}
      />
      <ContentRoute
        path="/report/mis-report/mis-report-sales-and-collection/mis-report-sales-and-collection-credit-limit-history-report"
        component={CreditLimitHistoryReport}
      />

      <ContentRoute
        path="/report/mis-report/mis-report-sales-and-collection/mis-report-sales-and-collection-debit-credit-report"
        component={DebitCreditNoteReport}
      />

      {/* <ContentRoute
        path="/report/mis-report/mis-report-sales-and-collection/mis-report-sales-and-collection-invoice-type-wise-summary-report"
        component={InvoiceTypeWiseSummaryReport}
      /> */}

    </Switch>
  );
}