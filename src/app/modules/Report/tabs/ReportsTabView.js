import React, { useEffect } from "react";
import ReportTabsHeader from "./ReportsTabsHeader";
export function ReportsTabView() {
    useEffect(() => {
        document.getElementById('pills-receivable-invoice-statement-cash-tab').classList.add('active')
    }, []);
    return (
        <>
           <div>                
                {/* Reports Tab */}
                <ReportTabsHeader />
            </div>
        </>
    );
}