import React from "react";
import { useHistory } from "react-router-dom";

export default function StatusTabs({setStatus}) {
    const history = useHistory();
    const handleAllChange = () => {
        // history.push("/salescollection/payment-adjustment/payment-verify/all")
        setStatus('');
    }
    const handleRejectChange = () => {
        //history.push("/salescollection/payment-collection/invoices/sales-officer-wise")
        setStatus('REJECTED');
    }
    const handleVerifiedChange = () => {
        //history.push("/salescollection/payment-collection/invoices/sales-officer-wise")
        setStatus('APPROVED');
    }
    const handlePendingChange = () => {
        //history.push("/salescollection/payment-collection/invoices/sales-officer-wise")
        setStatus('PENDING');
    }

    return (
        <>
            {/* TODAY SALE ROW */}
            <div>  
                <div className="mt-5 collection-budget-tabs">
                    <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
                        <li class="nav-item" role="presentation">
                            <a class="nav-link" id="pills-payment-verify-pending-tab" data-toggle="pill" href="#pills-payment-verify-pending" role="tab" aria-controls="pills-payment-verify-pending" aria-selected="false" onClick={handlePendingChange}>Pending</a>
                        </li>
                        <li class="nav-item" role="presentation">
                            <a class="nav-link" id="pills-payment-verify-verified-tab" data-toggle="pill" href="#pills-payment-verify-verified" role="tab" aria-controls="pills-payment-verify-verified" aria-selected="false" onClick={handleVerifiedChange}>Verified</a>
                        </li>
                        <li class="nav-item" role="presentation">
                            <a class="nav-link" id="pills-payment-verify-reject-tab" data-toggle="pill" href="#pills-payment-verify-reject" role="tab" aria-controls="pills-payment-verify-reject" aria-selected="false" onClick={handleRejectChange}>Rejected</a>
                        </li>
                        <li class="nav-item mr-5" role="presentation">
                            <a class="nav-link" id="pills-payment-verify-all-tab" data-toggle="pill" href="#pills-payment-verify-all" role="tab" aria-controls="pills-payment-verify-all" aria-selected="false" onClick={handleAllChange}>All</a>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    );
}