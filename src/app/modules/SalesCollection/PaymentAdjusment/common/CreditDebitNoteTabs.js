import React from "react";
import {useHistory} from "react-router-dom";

export default function CreditDebitNoteTabs(props) {

    const history = useHistory();

    const handleAllChange = () => {
        history.push("/salescollection/payment-adjustment/credit-debit-note/all-list")
    }
    const handleApprovalChange = () => {
        history.push("/salescollection/payment-adjustment/credit-debit-note/approval-list")
    }

    return (
        <>
            {/* TODAY SALE ROW */}
            <div>
                <div className="mt-5 collection-budget-tabs">
                    <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
                        <li className="nav-item mr-5" role="presentation">
                            <a className="nav-link" id="pills-payment-adjustment-credit-debit-note-all-tab"
                               data-toggle="pill" href="#pills-payment-adjustment-credit-debit-note-all" role="tab"
                               aria-controls="pills-payment-adjustment-credit-debit-note-all" aria-selected="false"
                               onClick={handleAllChange}>All</a>
                        </li>
                        <li className="nav-item" role="presentation">
                            <a className="nav-link" id="pills-payment-adjustment-credit-debit-note-approval-tab"
                               data-toggle="pill" href="#pills-payment-adjustment-credit-debit-note-approval" role="tab"
                               aria-controls="pills-payment-adjustment-credit-debit-note-approval" aria-selected="false"
                               onClick={handleApprovalChange}>Approval{props.totalApprovalNo === undefined ? '' : '(' + props.totalApprovalNo + ')'}</a>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    );
}