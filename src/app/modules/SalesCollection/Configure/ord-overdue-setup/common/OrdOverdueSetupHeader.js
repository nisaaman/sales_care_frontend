import React, {useEffect, useState} from "react";
import {useHistory} from "react-router-dom";
import {Card, CardBody} from "../../../../../../_metronic/_partials/controls";
import {useIntl} from "react-intl";
import axios from "axios";

export default function OrdOverdueSetupHeader(props) {
    const intl = useIntl();
    const history = useHistory();
    const [companies, setCompanies] = useState([]);
    const [searchInputs, setSearchInputs] = useState({});

    useEffect(() => {
        getAllCompaniesByOrganization();
    }, []);

    useEffect(() => {

        props.onChangeSearchInputs(searchInputs);
    }, [searchInputs]);

    const handleChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;
        setSearchInputs(values => ({...values, [name]: value}));
    }

    const getAllCompaniesByOrganization = () => {
        const URL = `${process.env.REACT_APP_API_URL}/api/organization/companies-by-login-user-organization`;
        axios.get(URL).then(response => {
            setCompanies(response.data.data);
        });
    }

    const handleORDSetupChange = () => {
        history.push("/salescollection/configure/ord-overdue-setup/ord-list")
    }

    const handleORDApprovalChange = () => {
        //history.push("/salescollection/configure/ord-overdue-setup/overdue-list")
    }

    const handleOverDueSetupChange = () => {
        history.push("/salescollection/configure/ord-overdue-setup/ord-list-overdue")
    }
    return (
        <>
            {/* TODAY SALE ROW */}
            <div className="mt-3">
                <Card>
                    <CardBody style={{marginBottom: "-36px"}}>
                        <div>
                            <span className="create-field-title">Commission & Overdue Setup</span>
                            <span className="d-flex float-right">
                            <div className="mr-3 mt-3" style={{color: "rgb(130, 130, 130)"}}>
                                    <label>{intl.formatMessage({id: "COMMON.COMPANY"})}</label>
                                </div>
                                <div className="create-field-title mr-5">
                                    <select className="form-control company-select" name="companyId"
                                            value={searchInputs.companyId || ""}
                                            onChange={handleChange}>
                                         <option className="fs-1" value="">Select Company</option>
                                        {companies.map((c) => (
                                            <option key={c.id} value={c.id} className="fs-1">{c.name}</option>))}
                                    </select>
                                </div>
                            </span>
                        </div>

                        {/*as per discuss with Amit vai and Liton vai, need to hide this portion*/}
                        {/*<div className="mt-5 ml-2 row">*/}
                        {/*    <span className="sales-chip mt-5 mr-5"><i*/}
                        {/*        className="bi bi-arrow-up-short text-primary"></i>&nbsp;428,030&nbsp;<span*/}
                        {/*        className='text-muted'>ORD</span></span>*/}
                        {/*    <span className="sales-chip mt-5 mr-5"><i*/}
                        {/*        className="bi bi-arrow-down-short text-danger"></i>&nbsp;428,030&nbsp;<span*/}
                        {/*        className='text-muted'>Overdue</span></span>*/}
                        {/*</div>*/}
                        <div className="mt-5">
                            <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
                                <li className="nav-item" role="presentation">
                                    <a className="nav-link" id="pills-configure-ord-setup-tab" data-toggle="pill"
                                       href="#pills-configure-ord-setup" role="tab"
                                       aria-controls="pills-configure-ord-setup" aria-selected="false"
                                       onClick={handleORDSetupChange}>Commission Setup</a>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <a className="nav-link" id="pills-configure-ord-approval-tab" data-toggle="pill"
                                       href="#pills-configure-ord-approval" role="tab"
                                       aria-controls="pills-configure-ord-approval" aria-selected="false"
                                       onClick={handleORDApprovalChange}>Commission Approval(3)</a>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <a className="nav-link" id="pills-configure-overdue-setup-tab" data-toggle="pill"
                                       href="#pills-configure-overdue-setup" role="tab"
                                       aria-controls="pills-configure-overdue-setup" aria-selected="false"
                                       onClick={handleOverDueSetupChange}>Overdue Setup</a>
                                </li>
                            </ul>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </>
    );
}
