import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import {Card, CardBody} from "../../../../../_metronic/_partials/controls";
import { hasAcess } from "../../../Util";

export default function SalesTabsHeader() {
    const permissions = useSelector((state) => state.auth.user.permissions, shallowEqual);
    const history = useHistory();
    const handleSalesOverView = () => {
       history.push("/salescollection/sales/overview")
    }
    const handleSalesDataChange = () => {
        history.push("/salescollection/sales/sales-data")
    }
    const handleBookingChange = () => {
        history.push("/salescollection/sales/sales-booking")
    }
    const handleOrderChange = () => {
        history.push("/salescollection/sales/sales-order")
    }
    const handleSalesReturn = () => {
       history.push("/salescollection/sales/sales-return")
    }
    const handleTradePrice = () => {
       history.push("/salescollection/sales/trade-price")
    }
    const handleTradeDiscount = () => {
       history.push("/salescollection/sales/trade-discount")
    }
    const handleSalesBudget = () => {
       history.push("/salescollection/sales/sales-budget")
    }
    const handleReport = () => {
       //history.push("/salescollection/sales/overview")
    }
    return (
        <>
            <div>
                {/* TODAY SALE ROW */}
                <div className="mt-3">
                    <Card>
                        <CardBody style={{ marginBottom: "-36px" }}>
                            {/* <div>
                                <p className="create-field-title">Today’s Sale</p>
                            </div>
                            <div className="mt-5 ml-2 row">
                            <span className="sales-chip mt-5 mr-5"><i className="bi bi-arrow-up-short text-primary"></i>&nbsp;৳428,030&nbsp;<span className='text-muted'>Sale</span></span>
                            <span className="sales-chip mt-5 mr-5"><i className="bi bi-arrow-down-short text-danger"></i>&nbsp;৳428,030&nbsp;<span className='text-muted'>Booking</span></span>
                            <span className="sales-chip mt-5 mr-5"><i className="bi bi-arrow-up-short text-primary"></i>&nbsp;৳428,030&nbsp;<span className='text-muted'>Sales Order</span></span>
                            <span className="sales-chip mt-5 mr-5"><i className="bi bi-arrow-up-short text-primary"></i>&nbsp;QTY. 428&nbsp;<span className='text-muted'>Sales Return</span></span>
                            </div> */}
                            <div className="mt-5">
                                <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
                                    <li className="nav-item" role="presentation">
                                        <a className="nav-link" id="pills-overview-tab" data-toggle="pill" href="#pills-overview" role="tab" aria-controls="pills-overview" aria-selected="false" onClick={handleSalesOverView}>Overview</a>
                                    </li>
                                    {hasAcess(permissions, 'SALES_DATA_VIEW') &&
                                    <li className="nav-item" role="presentation">
                                        <a className="nav-link" id="pills-sales-data-tab" data-toggle="pill" href="#pills-sales-data" role="tab" aria-controls="pills-sales-data" aria-selected="false" onClick={handleSalesDataChange}>Sales Data</a>
                                    </li>}
                                    {hasAcess(permissions, 'SALES_BOOKING_VIEW') &&
                                    <li className="nav-item" role="presentation">
                                        <a className="nav-link" id="pills-sales-booking-tab" data-toggle="pill" href="#pills-sales-booking" role="tab" aria-controls="pills-sales-booking" aria-selected="false" onClick={handleBookingChange}>Sales Booking</a>
                                    </li>}
                                    {hasAcess(permissions, 'SALES_ORDER_VIEW') &&
                                    <li className="nav-item" role="presentation">
                                        <a className="nav-link" id="pills-sales-order-tab" data-toggle="pill" href="#pills-sales-order" role="tab" aria-controls="pills-sales-order" aria-selected="false" onClick={handleOrderChange}>Sales Order</a>
                                    </li>}
                                    {hasAcess(permissions, 'SALES_RETURN_VIEW') &&
                                    <li className="nav-item" role="presentation">
                                        <a className="nav-link" id="pills-sales-return-tab" data-toggle="pill" href="#pills-sales-return" role="tab" aria-controls="pills-sales-return" aria-selected="false" onClick={handleSalesReturn}>Sales Return</a>
                                    </li>}
                                    {hasAcess(permissions, 'TRADE_PRICE_VIEW') &&
                                    <li className="nav-item" role="presentation">
                                        <a className="nav-link" id="pills-trade-price-tab" data-toggle="pill" href="#pills-trade-price" role="tab" aria-controls="pills-trade-price" aria-selected="false" onClick={handleTradePrice}>Trade Price</a>
                                    </li>}
                                    {hasAcess(permissions, 'TRADE_DISCOUNT_VIEW') &&
                                    <li className="nav-item" role="presentation">
                                        <a className="nav-link" id="pills-trade-discount-tab" data-toggle="pill" href="#pills-trade-discount" role="tab" aria-controls="pills-trade-discount" aria-selected="false" onClick={handleTradeDiscount}>Trade Discount</a>
                                    </li>}
                                    {hasAcess(permissions, 'SALES_BUDGET_VIEW') &&
                                    <li className="nav-item" role="presentation">
                                        <a className="nav-link" id="pills-sales-budget-tab" data-toggle="pill" href="#pills-sales-budget" role="tab" aria-controls="pills-sales-budget" aria-selected="false" onClick={handleSalesBudget}>Sales Budget</a>
                                    </li>}
                                    
                                    {/* <li className="nav-item" role="presentation">
                                        <a className="nav-link" id="pills-report-tab" data-toggle="pill" href="#pills-report" role="tab" aria-controls="pills-report" aria-selected="false" onClick={handleReport}>Report</a>
                                    </li> */}
                                </ul>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </>
    );
}