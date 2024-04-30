import React from 'react';
import BatchPreparationBreadCrum from "../../common/BatchPreparationBreadCrum";
import BatchPreparationTabs from "../../common/BatchPreparationTabs";
export default function ProductionOverview() {    
    return (
        <>
           <div>
                <BatchPreparationBreadCrum />
                <BatchPreparationTabs />
           </div>
        </>
    );
}