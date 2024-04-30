import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { hasAcess } from "../../../../../Util";

export default function ReportsSubTabsHeader() {
    const permissions = useSelector((state) => state.auth.user.permissions, shallowEqual);
    const history = useHistory();
    const handleSalesCollectionReportChange = () => {
        //history.push("/inventory/stock/sales-order/sales-booking-list")
    }
    return (
        <>
            {/* TODAY SALE ROW */}
            <div>  
                <div className="mt-5 collection-budget-tabs">
                    <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist"> 
                        <li className="nav-item" role="presentation">
                            <a className="nav-link" id="pills-inventory-stock-sales-collection-report-tab" data-toggle="pill" href="#pills-inventory-stock-sales-collection-report" role="tab" aria-controls="pills-inventory-stock-sales-collection-report" aria-selected="false" onClick={handleSalesCollectionReportChange}>Sales & Collection Report</a>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    );
}