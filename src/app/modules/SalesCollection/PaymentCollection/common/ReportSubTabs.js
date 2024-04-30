import React from "react";
import { useHistory } from "react-router-dom";

export default function ReportSubTabs() {
    const history = useHistory();
    const handleAcknowledgeReportChange = () => {
        history.push("/salescollection/payment-collection/report/acknowledge-report")
    }
    

    return (
        <>
            <div>  
                <div className="mt-5 collection-budget-tabs">
                    <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
                        <li className="nav-item mr-5" role="presentation">
                            <a className="nav-link" id="pills-acknowledge-report-tab" data-toggle="pill" href="#pills-acknowledge-report" role="tab" aria-controls="pills-acknowledge-report" aria-selected="false" onClick={handleAcknowledgeReportChange}>Acknowledged Invoice Report</a>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    );
}