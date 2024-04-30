import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { hasAcess } from "../../../../../Util";

export default function SalesOrderSubTabsHeader() {
    const permissions = useSelector((state) => state.auth.user.permissions, shallowEqual);
    const history = useHistory();
    const handleSalesBookingChange = () => {
        history.push("/inventory/stock/sales-order/sales-booking-list")
    }
    const handleSalesOrderChange = () => {
        history.push("/inventory/stock/sales-order/sales-order-list")
    }
    const handlePickingListChange = () => {
        history.push("/inventory/stock/sales-order/picking-list")
    }
    const handleDeliveryChallanChange = () => {
        history.push("/inventory/stock/sales-order/delivery-challan-list")
    }
    const handleInvoiceChange = () => {
        history.push("/inventory/stock/sales-order/invoice-list")
    }
    return (
        <>
            {/* TODAY SALE ROW */}
            <div>  
                <div className="mt-5 collection-budget-tabs">
                    <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
                        {hasAcess(permissions, 'SALES_BOOKING_CONFIRMATION') &&
                        <li className="nav-item" role="presentation">
                            <a className="nav-link" id="pills-inventory-stock-sales-order-sub-booking-tab" data-toggle="pill" href="#pills-inventory-stock-sales-order-sub-booking" role="tab" aria-controls="pills-inventory-stock-sales-order-sub-booking" aria-selected="false" onClick={handleSalesBookingChange}>Sales Booking</a>
                        </li>}

                        {hasAcess(permissions, 'SALES_ORDER') &&
                        <li className="nav-item" role="presentation">
                            <a className="nav-link" id="pills-inventory-stock-sales-order-sub-order-tab" data-toggle="pill" href="#pills-inventory-stock-sales-order-sub-order" role="tab" aria-controls="pills-inventory-stock-sales-order-sub-order" aria-selected="false" onClick={handleSalesOrderChange}>Sales Order</a>
                        </li>}

                        {hasAcess(permissions, 'PICKING_LIST') &&
                        <li class="nav-item" role="presentation">
                            <a class="nav-link" id="pills-inventory-stock-sales-order-sub-picking-list-tab" data-toggle="pill" href="#pills-inventory-stock-sales-order-sub-picking-list" role="tab" aria-controls="pills-inventory-stock-sales-order-sub-picking-list" aria-selected="false" onClick={handlePickingListChange}>Picking List</a>
                        </li>}

                        {hasAcess(permissions, 'DELIVERY_CHALLAN') &&
                        <li className="nav-item mr-5" role="presentation">
                            <a className="nav-link" id="pills-inventory-stock-sales-order-sub-delivery-challan-tab" data-toggle="pill" href="#pills-inventory-stock-sales-order-sub-delivery-challan" role="tab" aria-controls="pills-inventory-stock-sales-order-sub-delivery-challan" aria-selected="false" onClick={handleDeliveryChallanChange}>Delivery Challan</a>
                        </li>}

                        {hasAcess(permissions, 'INVOICE') &&
                        <li className="nav-item" role="presentation">
                            <a className="nav-link" id="pills-inventory-stock-sales-order-sub-invoices-tab" data-toggle="pill" href="#pills-inventory-stock-sales-order-sub-invoices" role="tab" aria-controls="pills-inventory-stock-sales-order-sub-invoices" aria-selected="false" onClick={handleInvoiceChange}>Invoice</a>
                        </li>}
                    </ul>
                </div>
            </div>
        </>
    );
}