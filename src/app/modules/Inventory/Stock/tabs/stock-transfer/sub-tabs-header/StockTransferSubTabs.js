import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { hasAcess } from "../../../../../Util";

export default function StockTransferSubTabs() {
    const permissions = useSelector((state) => state.auth.user.permissions, shallowEqual);
    const history = useHistory();
    const handleProductionReceive = () => {
        history.push("/inventory/stock/stock-transfer/production-receive")
    }
    const handleStockReceive = () => {
        history.push("/inventory/stock/stock-transfer/stock-receive")
    }
    const handleStockSend = () => {
        history.push("/inventory/stock/stock-transfer/stock-send")
    }
    
    return (
        <>
            {/* TODAY SALE ROW */}
            <div>  
                <div className="mt-5 collection-budget-tabs">
                    <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
                        {hasAcess(permissions, 'PRODUCTION_RECEIVE') &&
                        <li className="nav-item" role="presentation">
                            <a className="nav-link" id="pills-inventory-stock-stock-transfer-production-receive-tab" data-toggle="pill" href="#pills-inventory-stock-stock-transfer-production-receive" role="tab" aria-controls="pills-inventory-stock-stock-transfer-production-receive" aria-selected="false" onClick={handleProductionReceive}>Production Receive</a>
                        </li>}

                        {hasAcess(permissions, 'STOCK_SEND') &&
                        <li className="nav-item" role="presentation">
                            <a className="nav-link" id="pills-inventory-stock-stock-transfer-stock-send-tab" data-toggle="pill" href="#pills-inventory-stock-stock-transfer-stock-send" role="tab" aria-controls="pills-inventory-stock-stock-transfer-stock-send" aria-selected="false" onClick={handleStockSend}>Stock Send</a>
                        </li>}
                        
                        {hasAcess(permissions, 'STOCK_RECEIVE') &&
                        <li className="nav-item" role="presentation">
                            <a className="nav-link" id="pills-inventory-stock-stock-transfer-stock-receive-tab" data-toggle="pill" href="#pills-inventory-stock-stock-transfer-stock-receive" role="tab" aria-controls="pills-inventory-stock-stock-transfer-stock-receive" aria-selected="false" onClick={handleStockReceive}>Stock Receive</a>
                        </li>}
                    </ul>
                </div>
            </div>
        </>
    );
}