import React, { useEffect } from "react";
import SalesTabsHeader from "../../common/SalesTabsHeader";
import { BreadCrum } from "../../common/BreadCrum";

export function SalesOverView() {
    useEffect(() => {
        document.getElementById('pills-overview-tab').classList.add('active')
    }, []);
    return (
        <>
           <div>
                {/* BREAD CRUM ROW */}
                <BreadCrum />
                {/* TODAY SALE ROW */}
                <SalesTabsHeader />
            </div>
        </>
    );
}