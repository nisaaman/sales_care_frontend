import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
import  TimeLineRouting  from "./time-line-setup/TimeLineRouting";
import TradePriceSetupRouting from "./trade-price-setup/TradePriceSetupRouting";
import TradeDiscountSetupRouting from "./trade-discount-setup/TradeDiscountSetupRouting";
import OrdOverdueSetupRouting from "./ord-overdue-setup/OrdOverdueSetupRouting";
import PaymentBookSetupRoute from "./payment-book-setup/PaymentBookSetupRoute";
import BudgetSetupRouting from "./budget-setup/BudgetSetupRouting";
import CreditLimitSetupRoute from "./credit-limit-setup/CreditLimitSetupRoute";

export default function ConfigureRouting() {
  return (
    <Switch>
      <Redirect
        exact={true}
        from="/salescollection/configure"
        to="/salescollection/configure/time-line-setup"
      />

      <ContentRoute
        path="/salescollection/configure/time-line-setup"
        component={TimeLineRouting}
      /> 

      <ContentRoute
        path="/salescollection/configure/trade-price-setup"
        component={TradePriceSetupRouting}
      />  

      <ContentRoute
        path="/salescollection/configure/trade-discount-setup"
        component={TradeDiscountSetupRouting}
      /> 

      <ContentRoute
        path="/salescollection/configure/payment-book"
        component={PaymentBookSetupRoute}
      />

      <ContentRoute
        path="/salescollection/configure/ord-overdue-setup"
        component={OrdOverdueSetupRouting}
      />

      <ContentRoute
        path="/salescollection/configure/budget-setup"
        component={BudgetSetupRouting}
      />

      <ContentRoute
        path="/salescollection/configure/credit-limit-setup"
        component={CreditLimitSetupRoute}
      />
    </Switch>
  );
}