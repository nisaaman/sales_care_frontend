import React,{useEffect} from "react";
import CollectionBreadCrum from '../../common/CollectionBreadCrum'
import CollectionTodaySales from '../../common/CollectionTodaySales'
export  function PaymentCollectionOverview() {
    useEffect(() => {
        document.getElementById('pills-payment-collection-overview-tab').classList.add('active')
    }, []);
    return (
        <>
            {/* BREAD CRUM ROW */}
            <CollectionBreadCrum />
            {/* TODAY SALE ROW */}
            <CollectionTodaySales />
        </>
    );
}