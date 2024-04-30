import React from "react";
import { useHistory } from "react-router-dom";
import {
    Card,
    CardBody,
} from "../../../../../../_metronic/_partials/controls";
import { useIntl } from "react-intl";
export default function BudgetSetupHeader() {
    const intl = useIntl();
    const history = useHistory();
    const handleDistributorWiseChange = () => {
        //history.push("/salescollection/configure/ord-budget-location-wise/ord-list")
    }
    const handleSalesOfficerWiseChange = () => {
        //history.push("/salescollection/configure/ord-budget-location-wise/overdue-list")
    }

    const handleLocationWiseChange = () => {
        //history.push("/salescollection/configure/ord-budget-location-wise/overdue-list")
    }
    return (
        <>
            {/* TODAY SALE ROW */}
            <div className="mt-3">
                <Card>
                    <CardBody style={{ marginBottom: "-36px" }}> 
                        <div>
                            <span className="create-field-title">Sales & Collection Budget Setup</span>
                            {/* <span className="d-flex float-right">
                            <div className="mr-3 mt-3" style={{ color: "rgb(130, 130, 130)" }}>
                                    <label>{intl.formatMessage({ id: "COMMON.COMPANY" })}</label>
                                </div>
                                <div className="create-field-title mr-5">
                                    <select className="form-control company-select" name="company">
                                        <option value="1" className="fs-1">Babylon Resources Ltd. (BRL)</option>
                                        <option value="2" className="fs-1">Newgen Tecnology Ltd. (NTL)</option>
                                        <option value="3" className="fs-1">Babylon Group Ltd. (BGL)</option>
                                    </select>
                                </div>
                            </span> */}
                        </div>
                        {/* <div className="mt-5 ml-2 row">
                            <span className="sales-chip mt-5 mr-5"><i class="bi bi-arrow-up-short text-primary"></i>&nbsp;428,030&nbsp;<span className='text-muted'>Current Sales Budget</span></span>
                            <span className="sales-chip mt-5 mr-5"><i class="bi bi-arrow-down-short text-danger"></i>&nbsp;428,030&nbsp;<span className='text-muted'>Current Collection Budget</span></span>
                        </div> */}
                        <div className="mt-5">
                            <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
                                <li class="nav-item" role="presentation">
                                    <a class="nav-link" id="pills-configure-budget-distributor-wise-tab" data-toggle="pill" href="#pills-configure-budget-distributor-wise" role="tab" aria-controls="pills-configure-budget-distributor-wise" aria-selected="false" onClick={handleDistributorWiseChange}>Distributor Wise</a>
                                </li>
                                {/*<li class="nav-item" role="presentation">
                                    <a class="nav-link" id="pills-configure-budget-sales-officer-wise-tab" data-toggle="pill" href="#pills-configure-budget-sales-officer-wise" role="tab" aria-controls="pills-configure-budget-sales-officer-wise" aria-selected="false" onClick={handleSalesOfficerWiseChange}>Sales Officer Wise</a>
                                </li>
                                <li class="nav-item" role="presentation">
                                    <a class="nav-link" id="pills-configure-budget-location-wise-tab" data-toggle="pill" href="#pills-configure-budget-location-wise" role="tab" aria-controls="pills-configure-budget-location-wise" aria-selected="false" onClick={handleLocationWiseChange}>Location Wise</a>
    </li>  */}
                            </ul>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </>
    );
}
