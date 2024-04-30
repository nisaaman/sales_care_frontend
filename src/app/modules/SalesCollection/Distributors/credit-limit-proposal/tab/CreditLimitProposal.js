import React, { useState, useEffect } from 'react';
import axios from "axios";
import { showError } from '../../../../../pages/Alert';
import DistributorsBreadCrum from "../../common/DistributorsBreadCrum";
import DistributorsHeader from "../../common/DistributorsHeader";
import { useIntl } from "react-intl";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../../_metronic/_helpers";
import Popper from '@material-ui/core/Popper';
import LocationTreeView from '../../../CommonComponents/LocationTreeView';
import { shallowEqual, useSelector } from "react-redux";
import { Card, CardBody } from "../../../../../../_metronic/_partials/controls";
import { CreditLimitProposalList } from "../table/CreditLimitProposalList";
import * as XLSX from "xlsx";

export default function CreditLimitProposal() {
    const intl = useIntl();
    const userId = useSelector((state) => state.auth.user.userId, shallowEqual);
    const companyId = useSelector((state) => state.auth.company, shallowEqual)
    const [searchParams, setSearchParams] = useState({ userLoginId: userId, semesterId: '', status: '', fiscalYearId: '' });
    const [locationTree, setLocationTree] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState({});
    const [allStatus, setAllStatus] = useState([]);
    const [allFiscalYear, setAllFiscalYear] = useState([]);
    const [creditLimitProposalList, setCreditLimitProposalList] = useState([]);
    const [locationTypeNameSelect, setLocationTypeNameSelect] = useState("Area");
    const [locationNameSelect, setLocationNameSelect] = useState("All");
    const [searchInputs, setSearchInputs] = useState({});
    let [singleAll, setSingleAll] = useState([]);
    useEffect(() => {
        document.getElementById('pills-distributors-credit-limit-proposal-tab').classList.add('active');
        getStatus();
    }, [companyId]);

    useEffect(() => {
        getDistributorsList(searchParams)
    }, [searchParams]);

    const handleExport = () => {
        //const exportData = [...singleAll]

        const data = [...singleAll];
        if (data.length === 0) {
            showError("No row is selected for export data");
            return;
        }
        let exportData = [];
        data.map(row => {
            let obj = {};
            obj.distributor_name = row.distributor_name;
            obj.currentBalance = row.currentBalance;
            obj.sales_officer = row.sales_officer;
            obj.designation = row.designation;
            obj.location = row.location.locationName;
            obj.proposed_amount = row.proposed_amount;
            obj.approval_status = row.approval_status;
            obj.date = row.date;
            exportData.push(obj);
            setSingleAll([]);
        })
        const workbook = XLSX.utils.book_new();
        const Heading = [
            ["Distributor", "Current Limit", "Sales Officer", "Designation", "Location", "Proposed Limit", "Status", "Date"]
        ];
        const worksheet = XLSX.utils.json_to_sheet(exportData, { origin: 'A2', skipHeader: true });

        // creating sheet and adding data from 2nd row of column A.
        // Leaving first row to add Heading
        XLSX.utils.sheet_add_aoa(worksheet, Heading, { origin: 'A1' });
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        for (let i = 0; i < Heading.length; i++) {
            worksheet[letters.charAt(i).concat('1')].s = {
                font: {
                    name: 'arial',
                    fontWeight: 900,
                    sz: 11,
                    bold: true,
                    color: "#F2F2F2"
                },
            }
        }
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, "Credit_Limit_Proposal.xlsx");
    }
    const getStatus = () => {
        const URL = `${process.env.REACT_APP_API_URL}/api/constants/approval-status`;
        axios.get(URL).then(response => {
            setAllStatus(response.data.data);
        }).catch(err => {
            showError(intl.formatMessage({ id: "COMMON.ERROR_STATUS" }));
        });
    }
    const getCompanySelect = (row) => {//getCompanySelect is passed in DistributorHeader using props.getSearchInputs
        setSearchParams({ ...searchParams, companyId: row.companyId });
        getLocationTreeList({ userLoginId: userId, companyId: row.companyId });
        getFiscalYear({ companyId: row.companyId })
    }
    const getLocationTreeList = (params) => {
        if(params.companyId) {

            const URL = `${process.env.REACT_APP_API_URL}/api/location-tree/locationTree/${params.userLoginId}/${params.companyId}`;
            axios.get(URL).then(response => {
                const locationTree = response.data.data;
                setLocationTree(locationTree);
            }).catch(err => {
                //showError(intl.formatMessage({ id: "COMMON.ERROR_LOCATION_TREE" }));
            });
        }
    }
    const selectLocationTreeNode = (node) => {
        let id = "summary-id-" + node.id;
        const getId = document.getElementById(id);
        const getElements = document.getElementsByClassName('tree-nav__item_demo tree-nav__item-title');

        for (var i = 0; i < getElements.length; i++) {
            getElements[i].classList.remove('tree-nav-item');
        }
        if (getId) {
            getId.classList.add('tree-nav-item');
            let searchObj = { ...searchParams, locationId: node.id.toString() };
            setSearchParams(searchObj);
            setSelectedLocation(node);
            setLocationNameSelect(node.locationName)
        }
    }
    const getFiscalYear = (params) => {
        if(params.companyId) {
            const URL = `${process.env.REACT_APP_API_URL}/api/accounting-year/companyWise/${params.companyId}`;
            axios.get(URL).then(response => {
                setAllFiscalYear(response.data.data);
            }).catch(err => {
            });
        }
    }

    const selectFiscalYear = (e) => {
        let searchObj = { ...searchParams, fiscalYearId: e.target.value };
        setSearchParams(searchObj)
    }

    const selectStatus = (e) => {
        let searchObj = { ...searchParams, status: e.target.value };
        setSearchParams(searchObj)
    }
    const handleSearchChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;
        setSearchInputs(values => ({ ...values, [name]: value }));
        getSearchListFromCreditLimitProposalList(value);
    }
    const getSearchListFromCreditLimitProposalList = (searchText) => {
        let tp = [];
        for (let i = 0; i < creditLimitProposalList.length; i++) {
            if (creditLimitProposalList[i].distributor_name.includes(searchText) || creditLimitProposalList[i].sales_officer.includes(searchText)) {
                tp.push(creditLimitProposalList[i]);
            }
        }
        setCreditLimitProposalList(tp);
    }
    const getDistributorsList = (obj) => {
        let queryString = '?';
        queryString += 'userLoginId=' + obj.userLoginId;
        queryString += '&companyId=' + obj.companyId;
        queryString += '&locationId=' + obj.locationId;
        queryString += obj.semesterId ? '&accountingYearId=' + obj.fiscalYearId : '';
        queryString += obj.semesterId ? '&semesterId=' + obj.semesterId : '';
        queryString += obj.status ? '&status=' + obj.status : '';
        const URL = `${process.env.REACT_APP_API_URL}/api/credit-limit-proposal/get-list` + queryString;
        axios.get(URL).then(response => {
            if (response.data.success) {
                setCreditLimitProposalList(response.data.data)
            }
        }).catch(err => {
            showError();
        });
    }

    return (
        <>
            <div>
                <DistributorsBreadCrum />
                <DistributorsHeader getSearchInputs={getCompanySelect} />
            </div>
            <div>
                <Card>
                    <CardBody>
                        <div>
                            <div className='row'>
                                {/* LEFT SIDE TREE ROW */}
                                <div className='col-xl-3' style={{ borderRight: "1px solid #F2F2F2" }}>
                                    <div style={{ borderBottom: "1px solid #F2F2F2" }}>
                                        <label>
                                            <img src={toAbsoluteUrl("/images/loc3.png")}
                                                style={{ width: "20px", height: "20px", textAlign: "center" }}
                                                alt='Company Picture' />
                                            <strong style={{ marginLeft: "10px", color: "#828282" }}>Location (All)</strong>
                                        </label>
                                    </div>
                                    {/* TREE */}
                                    <LocationTreeView tree={locationTree}
                                        selectLocationTreeNode={selectLocationTreeNode} />
                                </div>
                                {/* RIGHT SIDE LIST ROW */}
                                <div className='col-xl-9'>
                                    {/* SEARCHING AND FILTERING ROW */}
                                    <div className="row">
                                        <div className="col-xl-3">
                                            <div style={{ position: "absolute", padding: "7px", marginTop: "3px" }}>
                                                <img src={toAbsoluteUrl("/images/search.png")} width="20px" height="20px" />
                                            </div>
                                            <form className="form form-label-right">
                                                <input type="text" className="form-control" name="searchText"
                                                    placeholder="Search Here"
                                                    style={{ paddingLeft: "28px" }}
                                                    value={searchInputs.searchText || ""}
                                                    onChange={handleSearchChange}
                                                />
                                            </form>
                                        </div>
                                        <div className="col-xl-9 d-flex flex-wrap justify-content-end">
                                            <div className="mr-3">
                                                <div className="row">
                                                    <div className="col-3 mt-3">
                                                        <label className="dark-gray-color">Status</label>
                                                    </div>
                                                    <div className="col-9">
                                                        <select className="form-control company-select" name="status" onChange={(e) => selectStatus(e)}>
                                                            <option value="" className="fs-1">All</option>
                                                            {
                                                                allStatus.map((status) => (
                                                                    <option value={status.code} className="fs-1">{status.name}</option>
                                                                ))
                                                            }
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mr-3">
                                                <div className="row">
                                                    <div className="col-4 mt-3">
                                                        <label className="dark-gray-color">Timeline</label>
                                                    </div>
                                                    <div className="col-8">
                                                        <select className="form-control company-select" name="company" onChange={(e) => selectFiscalYear(e)}>
                                                            <option value="" className="fs-1">Select Fiscal Year</option>
                                                            {
                                                                allFiscalYear.map((fiscalYear) => (
                                                                    <option value={fiscalYear.id} className="fs-1">{fiscalYear.fiscalYearName}</option>
                                                                ))
                                                            }
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <button className="btn filter-btn">
                                                    <i className="bi bi-funnel"></i>&nbsp;Filter
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    {/* ALL SUMMARY ROW */}
                                    <div className='row ml-2'>
                                        <div className='col-xl-3 sales-data-chip' style={{ borderRadius: "5px 0px 0px 5px" }}>
                                            <div className="d-flex">
                                                <div className="dark-gray-color">
                                                    <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/location.svg")} width="25px" height="25px" />
                                                </div>
                                                <div className="ml-2">
                                                    <span>
                                                        <span className="dark-gray-color"
                                                            style={{ fontWeight: "500" }}>{locationTypeNameSelect}</span>
                                                        <p><strong>{locationNameSelect}</strong></p>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-xl-3 sales-data-chip'>
                                            <div className="d-flex">
                                                <div className="dark-gray-color">
                                                    <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/Duotone.svg")} width="22px" height="22px" />
                                                </div>
                                                <div className="ml-2">
                                                    <span>
                                                        <span className="dark-gray-color"
                                                            style={{ fontWeight: "500" }}>{intl.formatMessage({ id: "COMMON.DISTRIBUTORS" })}</span>
                                                        <p><strong>{creditLimitProposalList.length}</strong></p>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-xl-3 sales-data-chip'>
                                            <div className="d-flex">
                                                <div className="dark-gray-color">
                                                    <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/gen016.svg")} width="22px" height="22px" />
                                                </div>
                                                <div className="ml-2">
                                                    <span>
                                                        <span className="dark-gray-color"
                                                            style={{ fontWeight: "500" }}>{intl.formatMessage({ id: "COMMON.PROPOSAL" })}</span>
                                                        <p><strong>{creditLimitProposalList.length}</strong></p>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-xl-3 sales-data-chip' style={{ background: "#F9F9F9" }}>
                                            <button className="btn float-right export-btn" onClick={handleExport}>
                                                <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/export.svg")} width="15px" height="15px" />
                                            </button>
                                        </div>
                                    </div>
                                    {/* TABLE ROW */}
                                    <div className='mt-5'>
                                        <CreditLimitProposalList setSingleAll={setSingleAll} singleAll={singleAll} creditLimitProposalList={creditLimitProposalList} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </>
    );
}
