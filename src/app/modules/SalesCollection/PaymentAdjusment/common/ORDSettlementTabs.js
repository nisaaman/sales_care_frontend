import React from "react";
import { useHistory } from "react-router-dom";

export default function ORDSettlementTabs({setStatus}) {
    const history = useHistory();
    const handleAllChange = () => {
        //history.push("/salescollection/payment-collection/invoices/distributor-wise")
        setStatus('');
    }
    const handleSettledChange = () => {
        //history.push("/salescollection/payment-collection/invoices/sales-officer-wise")
        setStatus(true);
    }
    const handlePendingChange = () => {
        //history.push("/salescollection/payment-collection/invoices/sales-officer-wise")
        setStatus(false);
    }

    return (
        <>
            {/* TODAY SALE ROW */}
            <div>  
                <div className="mt-5 collection-budget-tabs">
                    <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
                        <li class="nav-item" role="presentation">
                            <a class="nav-link" id="pills-payment-adjustment-ord-settlement-pending-tab" data-toggle="pill" href="#pills-payment-adjustment-ord-settlement-pending" role="tab" aria-controls="pills-payment-adjustment-ord-settlement-pending" aria-selected="false" onClick={handlePendingChange}>Pending</a>
                        </li>
                        <li class="nav-item" role="presentation">
                            <a class="nav-link" id="pills-payment-adjustment-ord-settlement-settled-tab" data-toggle="pill" href="#pills-payment-adjustment-ord-settlement-settled" role="tab" aria-controls="pills-payment-adjustment-ord-settlement-settled" aria-selected="false" onClick={handleSettledChange}>Settled</a>
                        </li>
                        <li class="nav-item mr-5" role="presentation">
                            <a class="nav-link" id="pills-payment-adjustment-ord-settlement-all-tab" data-toggle="pill" href="#pills-payment-adjustment-ord-settlement-all" role="tab" aria-controls="pills-payment-adjustment-ord-settlement-all" aria-selected="false" onClick={handleAllChange}>All</a>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    );
}