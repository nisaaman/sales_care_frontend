import React from "react";
import { useHistory } from "react-router-dom";

export default function SalesBudgetTabs() {
    const history = useHistory();
    const handleProductWiseChange = () => {
        history.push("/salescollection/sales/sales-budget/product-wise")
    }
    const handleDistributorWiseChange = () => {
        history.push("/salescollection/sales/sales-budget/distributor-wise")
    }
    const handleSalesOfficerWiseChange = () => {
        history.push("/salescollection/sales/sales-budget/sales-officer-wise")
    }

    return (
        <>
            {/* TODAY SALE ROW */}
            <div>  
                <div className="mt-5 collection-budget-tabs">
                    <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
                        <li class="nav-item mr-5" role="presentation">
                            <a class="nav-link" id="pills-sales-budget-product-wise-tab" data-toggle="pill" href="#pills-sales-budget-product-wise" role="tab" aria-controls="pills-sales-budget-product-wise" aria-selected="false" onClick={handleProductWiseChange}>Product Wise</a>
                        </li>
                        <li class="nav-item mr-5" role="presentation">
                            <a class="nav-link" id="pills-sales-budget-distributor-wise-tab" data-toggle="pill" href="#pills-sales-budget-distributor-wise" role="tab" aria-controls="pills-sales-budget-distributor-wise" aria-selected="false" onClick={handleDistributorWiseChange}>Distributor Wise</a>
                        </li>
                        <li class="nav-item" role="presentation">
                            <a class="nav-link" id="pills-sales-budget-sales-officer-wise-tab" data-toggle="pill" href="#pills-sales-budget-sales-officer-wise" role="tab" aria-controls="pills-sales-budget-sales-officer-wise" aria-selected="false" onClick={handleSalesOfficerWiseChange}>Sales Officer Wise</a>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    );
}