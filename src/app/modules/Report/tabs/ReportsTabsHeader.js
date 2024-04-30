import React from "react";
import { useHistory } from "react-router-dom";
import { Card, CardBody } from "../../../../_metronic/_partials/controls";

export default function ReportTabsHeader() {
    const history = useHistory();
    const handleReceivableInvoiceStatement = () => {
        history.push("/report/mis-report/finance-report/ReceivableInvoiceStatement")
    }

    return (
        <>
            <div>
                <div className="mt-3">
                    <Card>
                        <CardBody style={{ marginBottom: "-36px" }}>
                            <div className="mt-5">
                                <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
                                    <li className="nav-item" role="presentation">
                                        <a className="nav-link" id="pills-receivable-invoice-statement-cash-tab" 
                                        data-toggle="pill" href="#pills-receivable-invoice-statement-cash" role="tab" 
                                        aria-controls="pills-receivable-invoice-statement-cash" aria-selected="false" 
                                        onClick={handleReceivableInvoiceStatement}>Receivable Invoice Statement</a>
                                    </li>
                                </ul>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </>
    );
}