import React from "react";
import { useHistory } from "react-router-dom";

export default function InvoicesTabs() {
    const history = useHistory();
    const handleDistributorWiseChange = () => {
        history.push("/salescollection/payment-collection/invoices/distributor-wise")
    }
    // const handleSalesOfficerWiseChange = () => {
    //     history.push("/salescollection/payment-collection/invoices/sales-officer-wise")
    // }

    return (
        <>
            {/* TODAY SALE ROW */}
            <div>  
                <div className="mt-5 collection-budget-tabs">
                    <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
                        <li class="nav-item mr-5" role="presentation">
                            <a class="nav-link" id="pills-invoices-distributor-wise-tab" data-toggle="pill" href="#pills-invoices-distributor-wise" role="tab" aria-controls="pills-invoices-distributor-wise" aria-selected="false" onClick={handleDistributorWiseChange}>Distributor Wise</a>
                        </li>
                        {/* <li class="nav-item" role="presentation">
                            <a class="nav-link" id="pills-invoices-sales-officer-wise-tab" data-toggle="pill" href="#pills-invoices-sales-officer-wise" role="tab" aria-controls="pills-invoices-sales-officer-wise" aria-selected="false" onClick={handleSalesOfficerWiseChange}>Sales Officer Wise</a>
                        </li> */}
                    </ul>
                </div>
            </div>
        </>
    );
}