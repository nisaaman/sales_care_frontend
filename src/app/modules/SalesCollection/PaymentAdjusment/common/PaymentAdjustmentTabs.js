import React from "react";
import { useHistory } from "react-router-dom";

export default function PaymentAdjustmentTabs() {
    const history = useHistory();
    const handleInvoicesMapChange = () => {
        history.push("/salescollection/payment-adjustment/payment-adjustment/invoices-map")
    }
    const handleHistoryChange = () => {
        history.push("/salescollection/payment-adjustment/payment-adjustment/history")
    }

    return (
        <>
            {/* TODAY SALE ROW */}
            <div>  
                <div className="mt-5 collection-budget-tabs">
                    <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
                        <li class="nav-item" role="presentation">
                            <a class="nav-link" id="pills-payment-adjustment-invoices-map-tab" data-toggle="pill" href="#pills-payment-adjustment-invoices-map" role="tab" aria-controls="pills-payment-adjustment-invoices-map" aria-selected="false" onClick={handleInvoicesMapChange}>Invoice Map</a>
                        </li>
                        <li class="nav-item" role="presentation">
                            <a class="nav-link" id="pills-payment-adjustment-history-tab" data-toggle="pill" href="#pills-payment-adjustment-history" role="tab" aria-controls="pills-payment-adjustment-history" aria-selected="false" onClick={handleHistoryChange}>History</a>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    );
}