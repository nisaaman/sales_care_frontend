import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../../../_metronic/layout";
import ProductionReceive from "./sub-tabs/production-receive/ProductionReceive";
import StockReceive from "./sub-tabs/stock-receive/StockReceive";
import StockSend from "./sub-tabs/stock-send/StockSend"
import StockReceiveList from "./sub-tabs/stock-receive/stock-receive/StockReceiveList"
import StockClaimList from "./sub-tabs/stock-receive/stock-receive/StockClaimList"
export default function StockTransfer() {
  return (
    <Switch>
      <Redirect
        exact={true}
        from="/inventory/stock/stock-transfer"
        to="/inventory/stock/stock-transfer/production-receive"
      />

      <ContentRoute
        path="/inventory/stock/stock-transfer/production-receive"
        component={ProductionReceive}
      /> 

      <ContentRoute
        path="/inventory/stock/stock-transfer/stock-receive"
        component={StockReceive}
      /> 

      <ContentRoute
        path="/inventory/stock/stock-transfer/stock-send"
        component={StockSend}
      /> 
      <ContentRoute
        path="/inventory/stock/stock-transfer/stock-received-list"
        component={StockReceiveList}
      />   
      <ContentRoute
        path="/inventory/stock/stock-transfer/stock-received-claim"
        component={StockClaimList}
      />
    </Switch>
  );
}
