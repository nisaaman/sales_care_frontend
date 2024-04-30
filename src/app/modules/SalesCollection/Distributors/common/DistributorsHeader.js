import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { Card, CardBody } from "../../../../../_metronic/_partials/controls";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../_metronic/_helpers";
import { useIntl } from "react-intl";
import axios from "axios";
import { shallowEqual, useSelector } from 'react-redux';
import { hasAcess, hasCreateAccess } from '../../../Util';


export default function DistributorsHeader(props) {// when a component is pass from another component then we use props 
    const permissions = useSelector((state) => state.auth.user.permissions, shallowEqual);
    const intl = useIntl();
    const history = useHistory();
    const [companies, setCompanies] = useState([]);
    const [searchInputs, setSearchInputs] = useState({});

    const handleOverviewChange = () => {
        history.push("/salescollection/distributors/overview")
    }
    const handleDistributorListChange = () => {
        history.push("/salescollection/distributors/distributors-list")
    }
    const handleCreditLimitProposalChange = () => {
        history.push("/salescollection/distributors/credit-limit-proposal")
    }
    const handleActivityChange = () => {
        history.push("/salescollection/distributors/activity")
    }
    const handleReportChange = () => {
        history.push("/salescollection/distributors/reports")
    }
    const handleOpeningBalanceChange = () => {
        history.push("/salescollection/distributors/opening-balance")
    }

    const handleDistributorUploadChange = () => {
        history.push("/salescollection/distributors/upload")
    }

    const handleAddNewDistributor = () => {
        history.push("/salescollection/distributors/add-new-distributor")
    }

    useEffect(() => {
        getAllCompaniesByOrganization();
    }, []);

    useEffect(() => {// useEffect() is call when search input is changed
        //console.log(searchInputs)
        props.getSearchInputs(searchInputs);
    }, [searchInputs]);


    const getAllCompaniesByOrganization = () => {
        const URL = `${process.env.REACT_APP_API_URL}/api/organization/get-all-company-by-organization`;
        axios.get(URL).then(response => {
            setCompanies(response.data.data);
        });
    }


    const handleChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;
        setSearchInputs(values => ({ ...values, [name]: value }));
    }
    return (
        <>
            {/* TODAY SALE ROW */}
            <div className="mt-3">
                <Card>
                    <CardBody style={{ marginBottom: "-36px" }}>
                        <div className="row">
                            <div className="col-xl-6">
                                <p className="create-field-title">{intl.formatMessage({ id: "COLLECTIONSUMMARYTABLE.DISTRIBUTOR" })}</p>
                            </div>

                            <div className="col-xl-6 d-flex justify-content-end">
                                <div className="mr-3 mt-3" style={{ color: "rgb(130, 130, 130)" }}>
                                    <label>Company</label>
                                </div>
                                <div className="create-field-title mr-5">
                                    <select placeholder='Ex. Bangladesh Islami Bank' id="company" className='form-control company-select'
                                        name="companyId" value={searchInputs.companyId || ""} onChange={handleChange}>
                                        <option value="">Select Company</option>
                                        {companies.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {hasCreateAccess(permissions, 'DISTRIBUTOR_LIST') &&
                                    <div className="create-field-title">
                                        <button type="button" className="btn btn-gradient-blue" data-toggle="tooltip" data-placement="bottom" title="Add New Distributor" style={{ color: "white" }} onClick={handleAddNewDistributor}>
                                            <SVG
                                                className="svg-icon svg-icon-md svg-icon-primary"
                                                src={toAbsoluteUrl("/media/svg/icons/project-svg/add-user.svg")}
                                            />Add New Distributor
                                        </button>
                                    </div>}
                            </div>
                        </div>

                        {/* <div className="row mt-5">
                            <div className="col-xl-7">
                                <span className="mt-5">
                                    <i class="bi bi-arrow-up-short text-primary"></i>
                                    &nbsp;45,428,030&nbsp;
                                    <span className='text-muted'>{intl.formatMessage({ id: "COMMON.TOTAL_DISTRIBUTOR" })}</span>
                                </span>
                            </div>
                            <div className="col-xl-5">
                                <span className="mt-5 mr-3">
                                    <span className='text-muted mr-2'>New</span>
                                    <span className='mr-2 text-success'>24</span>
                                    <span className='text-muted mr-2'>(year 2020-22)</span>
                                </span>
                                <span className='text-muted mr-3'>|</span>
                                <span className="mt-5 mr-2">
                                    <span className='text-muted mr-3'>{intl.formatMessage({ id: "COMMON.ACTIVE" })}</span>
                                    <span className='text-primary mr-3'>428,030</span>
                                </span>
                                <span className='text-muted mr-3'>|</span>
                                <span className="mt-5 mr-5">
                                    <span className='text-muted'>{intl.formatMessage({ id: "COMMON.INACTIVE" })}</span>
                                    &nbsp;428,030&nbsp;
                                </span>
                            </div>
                        </div> */}

                        {/* <div class="distributor-progress mt-5">
                            <div class="progress">
                                <div class="progress-bar bg-success" role="progressbar" style={{ width: "10%" }} aria-valuenow="15" aria-valuemin="0" aria-valuemax="100"></div>
                                <div class="progress-bar" role="progressbar" style={{ width: "80%" }} aria-valuenow="30" aria-valuemin="0" aria-valuemax="100"></div>
                            </div>
                        </div> */}
                        <div className="mt-5">
                            <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist" style={{ marginLeft: "-18px" }}>
                                {/* <li class="nav-item" role="presentation">
                                    <a class="nav-link" id="pills-distributors-overview-tab" data-toggle="pill" href="#pills-distributors-overview" role="tab" aria-controls="pills-distributors-overview" aria-selected="false" onClick={handleOverviewChange}>Overview</a>
                                </li> */}
                                {hasAcess(permissions, 'DISTRIBUTOR_LIST') &&
                                    <li className="nav-item" role="presentation">
                                        <a className="nav-link" id="pills-distributors-list-tab" data-toggle="pill" href="#pills-distributors-list" role="tab" aria-controls="pills-distributors-list" aria-selected="false" onClick={handleDistributorListChange}>Distributor List</a>
                                    </li>}
                                {hasAcess(permissions, 'CREDIT_LIMIT_PROPOSAL') &&
                                    <li className="nav-item" role="presentation">
                                        <a className="nav-link" id="pills-distributors-credit-limit-proposal-tab" data-toggle="pill" href="#pills-distributors-credit-limit-proposal" role="tab" aria-controls="pills-distributors-credit-limit-proposal" aria-selected="false" onClick={handleCreditLimitProposalChange}>Credit Limit Proposal</a>
                                    </li>}
                                
                                {hasAcess(permissions, 'DISTRIBUTOR_OPENING_BALANCE') &&
                                <li className="nav-item" role="presentation">
                                    <a className="nav-link" id="pills-distributors-opening-balance-tab" data-toggle="pill" href="#pills-distributors-opening-balance" role="tab" aria-controls="pills-distributors-opening-balance" aria-selected="false" onClick={handleOpeningBalanceChange}>Opening Balance</a>
                                </li>
                                }

                                {/* ONLY FOR DEVELOPER USE */}
                                 {hasAcess(permissions, 'DISTRIBUTOR_UPLOAD') &&
                                <li className="nav-item" role="presentation">
                                    <a className="nav-link" id="pills-distributors-upload-tab" data-toggle="pill" href="#pills-distributors-upload" role="tab" aria-controls="pills-distributors-upload" aria-selected="false" onClick={handleDistributorUploadChange}>Distributor Upload</a>
                                </li>
                                }

                                {/*<li className="nav-item" role="presentation">
                                    <a className="nav-link" id="pills-distributors-activity-tab" data-toggle="pill" href="#pills-distributors-activity" role="tab" aria-controls="pills-distributors-activity" aria-selected="false" onClick={handleActivityChange}>Activity</a>
                                </li> */}
                                {hasAcess(permissions, 'DISTRIBUTOR_LEDGER_REPORT') &&
                                    <li className="nav-item" role="presentation">
                                        <a className="nav-link" id="pills-distributors-reports-tab" data-toggle="pill" href="#pills-distributors-reports" role="tab" aria-controls="pills-distributors-reports" aria-selected="false" onClick={handleReportChange}>Report</a>
                                    </li>}
                            </ul>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </>
    );
}