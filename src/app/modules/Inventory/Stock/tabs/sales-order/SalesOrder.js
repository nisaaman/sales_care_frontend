import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../../../_metronic/layout";
import SalesBooking from "./sub-tabs/sales-booking/SalesBooking";
import SalesOrderTab from "./sub-tabs/sales-order/SalesOrderTab";
import PickingListTab from "./sub-tabs/picking-list/PickingListTab";
import DeliveryChallan from "./sub-tabs/delivery-challan/DeliveryChallan";
import Invoice from "./sub-tabs/invoice/Invoice";
import InvoiceView from "../../../../SalesCollection/PaymentCollection/invoices/view/DistributorWiseView";
import InvoiceCreate from "./sub-tabs/invoice/create/InvoiceCreate";
import DeliveryChallanView from "./sub-tabs/delivery-challan/view/DeliveryChallanView";
import PickingView from "./sub-tabs/picking-list/view/PickingView";
import ConfirmView from "./sub-tabs/picking-list/view/confirm-view/ConfirmView";

export default function SalesOrder() {
  return (
    <Switch>
      <Redirect
        exact={true}
        from="/inventory/stock/sales-order"
        to="/inventory/stock/sales-order/sales-booking-list"
      />

      <ContentRoute
        path="/inventory/stock/sales-order/sales-booking-list"
        component={SalesBooking}
      />

      <ContentRoute
        path="/inventory/stock/sales-order/sales-order-list"
        component={SalesOrderTab}
      />

      <ContentRoute
        path="/inventory/stock/sales-order/picking-list"
        component={PickingListTab}
      />

      <ContentRoute
        path="/inventory/stock/sales-order/picking-list-view"
        component={PickingView}
      />
      <ContentRoute
        path="/inventory/stock/sales-order/picking-list-view-confirm"
        component={ConfirmView}
      />

      <ContentRoute
        path="/inventory/stock/sales-order/delivery-challan-list"
        component={DeliveryChallan}
      /> 
      <ContentRoute
        path="/inventory/stock/sales-order/view-delivery-challan"
        component={DeliveryChallanView}
      /> 
      <ContentRoute
        path="/inventory/stock/sales-order/invoice-list"
        component={Invoice}
      />

      <ContentRoute
        path="/inventory/stock/sales-order/invoice-view"
        component={InvoiceView}
      />

      <ContentRoute
        path="/inventory/stock/sales-order/invoice-create"
        component={InvoiceCreate}
      />    
    </Switch>
  );
}
