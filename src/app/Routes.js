/**
 * High level router.
 *
 * Note: It's recommended to compose related routes in internal router
 * components (e.g: `src/app/modules/Auth/pages/AuthPage`, `src/app/BasePage`).
 */

import React from "react";
import { Redirect, Switch, Route } from "react-router-dom";
import { shallowEqual, useSelector } from "react-redux";
import {Layout} from "../_metronic/layout";
import BasePage from "./BasePage";
import { Logout, AuthPage } from "./modules/Auth";
import ErrorsPage from "./modules/ErrorsExamples/ErrorPage";
import BookingApprovalViewPage from "./modules/Inventory/Stock/tabs/sales-order/sub-tabs/sales-booking/approval-view/BookingApprovalViewPage";
import AddSalesOrder from "./modules/Inventory/Stock/tabs/sales-order/sub-tabs/sales-order/create-order/AddSalesOrder";
import AddDeliveryChallan from "./modules/Inventory/Stock/tabs/sales-order/sub-tabs/delivery-challan/create-challan/AddDeliveryChallan";
import ProposalReceived from "./modules/Inventory/Stock/tabs/sales-return/sub-tabs/proposal/create-proposal/ProposalReceived0";
import NewProductionReceive from "./modules/Inventory/Stock/tabs/stock-transfer/sub-tabs/production-receive/create-production-receive/NewProductionReceive";
import StockSendCreate from "./modules/Inventory/Stock/tabs/stock-transfer/sub-tabs/stock-send/create-stock-send/StockSendCreate";
import NewStoreMovement from "./modules/Inventory/Stock/tabs/store-movement/create/NewStoreMovement";
import NewStockDamage from "./modules/Inventory/Stock/tabs/damage-declaration/create/NewStockDamage";
import NewPickingList from "./modules/Inventory/Stock/tabs/sales-order/sub-tabs/picking-list/create/NewPickingList";
import NewQA from "./modules/Production/QA/qa-review/create/NewQA";
//import ViewDeliveryChallan from "./modules/Inventory/Stock/tabs/sales-order/sub-tabs/delivery-challan/view/DeliveryChallanView";

export function Routes() {
    const {isAuthorized} = useSelector(
        ({auth}) => ({
            isAuthorized: auth.user != null,
        }),
        shallowEqual
    );

    return (
        <Switch>
            {!isAuthorized ? (
                /*Render auth page when user at `/auth` and not authorized.*/
                <Route>
                    <AuthPage />
                </Route>
            ) : (
                /*Otherwise redirect to root page (`/`)*/
                <Redirect from="/auth" to="/"/>
            )}

            <Route path="/error" component={ErrorsPage}/>
            <Route path="/logout" component={Logout}/>
            <Route path="/sales-booking-proposal-approval" component={BookingApprovalViewPage}/>
            <Route path="/add-sales-order" component={AddSalesOrder}/>
            <Route path="/add-delivery-challan" component={AddDeliveryChallan}/>
            {/* <Route path="/view-delivery-challan" component={ViewDeliveryChallan}/> */}
            <Route path="/proposal-received" component={ProposalReceived}/>
            <Route path="/new-production-receive" component={NewProductionReceive}/>
            <Route path="/new-stock-send" component={StockSendCreate}/>
            <Route path="/new-store-movement" component={NewStoreMovement}/>
            <Route path="/new-stock-damage" component={NewStockDamage}/>
            <Route path="/new-picking-list" component={NewPickingList}/>
            <Route path="/production-qa-setup-new" component={NewQA}/>
            {!isAuthorized ? (
                /*Redirect to `/auth` when user is not authorized*/
                <Redirect to="/auth/login"/>
            ) : (
                <Layout>
                    <BasePage/>
                </Layout>
            )}
        </Switch>
    );
}
