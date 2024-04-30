import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
import { SalesOverView } from "./sales-overview/tabs/SalesOverView"
import { SalesBooking } from "./sales-booking/tabs/SalesBooking";
import { SalesBookingView } from "./sales-booking/view-page/SalesBookingView"
import { SalesData } from "./sales-data/tab/SalesData";
import { SalesOrder } from "./sales-order/tab/SalesOrder"
import { SalesReturn } from "./sales-return/tab/SalesReturn";
import { TradeDiscount } from "./trade-discount/tab/TradeDiscount";
import { TradePrice } from "./trade-price/tab/TradePrice";
import { SalesReturnView } from "./sales-return/view/SalesReturnView";
import SalesBudgetTabsRoute  from "./sales-budget/tab/SalesBudgetTabsRoute";
import SalesOrderView  from "./sales-order/view/SalesOrderView";

export function SalesRouting() {
  return (
    <Switch>
      <Redirect
        exact={true}
        from="/salescollection/sales"
        to="/salescollection/sales/overview"
      />

      <ContentRoute
        path="/salescollection/sales/overview"
        component={SalesOverView}
      />
      <ContentRoute
        path="/salescollection/sales/sales-booking"
        component={SalesBooking}
      />
      <ContentRoute
        path="/salescollection/sales/sales-data"
        component={SalesData}
      />
      <ContentRoute
        path="/salescollection/sales/sales-booking-view"
        component={SalesBookingView}
      />
      <ContentRoute
        path="/salescollection/sales/sales-order"
        component={SalesOrder}
      />
      <ContentRoute
        path="/salescollection/sales/sales-return"
        component={SalesReturn}
      />
      <ContentRoute
            path="/salescollection/sales/trade-price"
            component={TradePrice}
      />
      <ContentRoute
        path="/salescollection/sales/trade-discount"
        component={TradeDiscount}
      />
      <ContentRoute
        path="/salescollection/sales/sales-return-view"
        component={SalesReturnView}
      />

      <ContentRoute
        path="/salescollection/sales/sales-budget"
        component={SalesBudgetTabsRoute}
      />

      <ContentRoute
        path="/salescollection/sales/sales-order-view"
        component={SalesOrderView}
      />
    </Switch>
  );
}