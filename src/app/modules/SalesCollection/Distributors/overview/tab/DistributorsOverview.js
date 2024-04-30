import React, { useEffect } from 'react';
import DistributorsBreadCrum from "../../common/DistributorsBreadCrum";
import DistributorsHeader from "../../common/DistributorsHeader";
export default function DistributorsOverview() { 
    useEffect(() => {
        document.getElementById('pills-distributors-overview-tab').classList.add('active');
    }, []);    
    return (
        <>
           <div>
                <DistributorsBreadCrum />
                <DistributorsHeader />
           </div>
        </>
    );
}