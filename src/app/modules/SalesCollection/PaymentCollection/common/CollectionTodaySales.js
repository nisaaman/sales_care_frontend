import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import {
    Card,
    CardBody,
} from "../../../../../_metronic/_partials/controls";
import { hasAcess } from "../../../Util";
export default function CollectionTodaySales() {
    const permissions = useSelector((state) => state.auth.user.permissions, shallowEqual);
    const history = useHistory();
    const handleOverviewChange = () => {
        history.push("/salescollection/payment-collection/overview")
    }
    const handleCollectionDataChange = () => {
        history.push("/salescollection/payment-collection/collection-data")
    }
    const handleInvoicesChange = () => {
        history.push("/salescollection/payment-collection/invoices")
    }
    const handleOrdChange = () => {
        history.push("/salescollection/payment-collection/ord")
    }
    const handleOrdCalculatorChange = () => {
        history.push("/salescollection/payment-collection/ord-calculator")
    }
    const handleCollectionBudgetChange = () =>{
        history.push("/salescollection/payment-collection/collection-budget")
    }
    const handleReportChange = () =>{
        history.push("/salescollection/payment-collection/report")
    }

    return (
        <>
            {/* TODAY SALE ROW */}
            <div className="mt-3">
                <Card>
                    <CardBody style={{ marginBottom: "-36px" }}> 
                        {/* <div>
                            <p className="create-field-title">Today’s Payment Collection</p>
                        </div>
                        <div className="mt-5 ml-2 row">
                            <span className="sales-chip mt-5 mr-5"><i className="bi bi-arrow-up-short text-primary"></i>&nbsp;428,030&nbsp;<span className='text-muted'>Collection</span></span>
                            <span className="sales-chip mt-5 mr-5"><i className="bi bi-arrow-down-short text-danger"></i>&nbsp;428,030&nbsp;<span className='text-muted'>ORD</span></span>
                            <span className="sales-chip mt-5 mr-5"><i className="bi bi-arrow-up-short text-primary"></i>&nbsp;99,567,428,030&nbsp;<span className='text-muted'>Receivable</span></span>
                        </div> */}
                        <div className="mt-5">
                            <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
                                <li className="nav-item" role="presentation">
                                    <a className="nav-link" id="pills-payment-collection-overview-tab" data-toggle="pill" href="#pills-payment-collection-overview" role="tab" aria-controls="pills-payment-collection-overview" aria-selected="false" onClick={handleOverviewChange}>Overview</a>
                                </li>
                                {hasAcess(permissions, 'COLLECTION_DATA_VIEW') &&
                                <li className="nav-item" role="presentation">
                                    <a className="nav-link" id="pills-payment-collection-data-tab" data-toggle="pill" href="#pills-payment-collection-data" role="tab" aria-controls="pills-payment-collection-data" aria-selected="false" onClick={handleCollectionDataChange}>Collection Data</a>
                                </li>}
                                {hasAcess(permissions, 'INVOICES_VIEW') &&
                                <li className="nav-item" role="presentation">
                                    <a className="nav-link" id="pills-payment-invoices-tab" data-toggle="pill" href="#pills-payment-invoices" role="tab" aria-controls="pills-payment-invoices" aria-selected="false" onClick={handleInvoicesChange}>Invoices</a>
                                </li>}
                                {hasAcess(permissions, 'ORD_VIEW') &&
                                <li className="nav-item" role="presentation">
                                    <a className="nav-link" id="pills-payment-ord-tab" data-toggle="pill" href="#pills-payment-ord" role="tab" aria-controls="pills-payment-ord" aria-selected="false" onClick={handleOrdChange}>Commission</a>
                                </li>}
                                {hasAcess(permissions, 'ORD_CALCULATOR_VIEW') &&
                                <li className="nav-item" role="presentation">
                                    <a className="nav-link" id="pills-payment-ord-calculator-tab" data-toggle="pill" href="#pills-payment-ord-calculator" role="tab" aria-controls="pills-payment-ord-calculator" aria-selected="false" onClick={handleOrdCalculatorChange}>Commission Calculator</a>
                                </li>}
                                {hasAcess(permissions, 'COLLECTION_BUDGET_VIEW') &&
                                <li className="nav-item" role="presentation">
                                    <a className="nav-link" id="pills-payment-collection-budget-tab" data-toggle="pill" href="#pills-payment-collection-budget" role="tab" aria-controls="pills-payment-collection-budget" aria-selected="false" onClick={handleCollectionBudgetChange}>Collection Budget</a>
                                </li>}

                                <li className="nav-item" role="presentation">
                                    <a className="nav-link" id="pills-payment-collection-reports-tab" data-toggle="pill" href="#pills-payment-collection-reports" role="tab" aria-controls="pills-payment-collection-reports" aria-selected="false" onClick={handleReportChange}>Report</a>
                                </li>
                            </ul>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </>
    );
}