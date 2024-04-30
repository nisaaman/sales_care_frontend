import React from "react";
import { useHistory } from "react-router-dom";

export default function SalesReturnSubTabs() {
    const history = useHistory();
    const handleProposalChange = () => {
        history.push("/inventory/stock/sales-return/sales-return-list")
    }
    const handleReceivedQAChange = () => {
        history.push("/inventory/stock/sales-return/received-qa-list")
    }
    return (
        <>
            {/* TODAY SALE ROW */}
            <div>  
                <div className="mt-5 collection-budget-tabs">
                    <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
                        <li className="nav-item" role="presentation">
                            <a className="nav-link" id="pills-inventory-stock-sales-return-proposal-tab" data-toggle="pill" href="#pills-inventory-stock-sales-return-proposal" role="tab" aria-controls="pills-inventory-stock-sales-return-proposal" aria-selected="false" onClick={handleProposalChange}>Proposal</a>
                        </li>
                        {/* <li className="nav-item" role="presentation">
                            <a className="nav-link" id="pills-inventory-stock-sales-return-received-qa-tab" data-toggle="pill" href="#pills-inventory-stock-sales-return-received-qa" role="tab" aria-controls="pills-inventory-stock-sales-return-received-qa" aria-selected="false" onClick={handleReceivedQAChange}>Received & QA</a>
                        </li> */}
                    </ul>
                </div>
            </div>
        </>
    );
}