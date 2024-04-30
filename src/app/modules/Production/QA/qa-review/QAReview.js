import React, { useState, useEffect, useMemo } from "react";
import { Card } from "react-bootstrap";
import { CardBody } from "../../../../../_metronic/_partials/controls";
import BatchPreparationBreadCrum from '../../BatchPreparation/common/BatchPreparationBreadCrum';
import { toAbsoluteUrl } from "../../../../../_metronic/_helpers";
import SVG from "react-inlinesvg";
import QAReviewList from "./table/QAReviewList";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { event } from "jquery";
import * as XLSX from "xlsx";
import { showError, showSuccess } from "../../../../pages/Alert"
import { hasCreateAccess } from "../../../Util";

export default function QAReview() {
    const history = useHistory();
    const permissions = useSelector((state) => state.auth.user.permissions, shallowEqual);
    let [singleAll, setSingleAll] = useState([]);
    const [allAccountingYear, setAllAccountingYear] = useState([]);
    const [qaInspectionData, setQAInspectionData] = useState([]);
    const [childCategoryList, setChildCategoryList] = useState([]);
    const [depotId, setDepotId] = useState('');
    const [depots, setDepots] = useState([]);
    const [status, setStatus] = useState('');
    const [accountingYearId, setAccountingYearId] = useState('');
    const [productCategoryId, setProductCategoryId] = useState('');
    const companyId = useSelector((state) => state.auth.company, shallowEqual);
    const userLoginId = useSelector((state) => state.auth.user.userId, shallowEqual);
    const searchParams = useMemo(() => {
        return {
            userLoginId: userLoginId, companyId: companyId, depotId: depotId, status: status,
            accountingYearId: accountingYearId, productCategoryId: productCategoryId
        }
    }, [userLoginId, companyId, depotId, status, accountingYearId, productCategoryId]);

    useEffect(() => {
        getAccountingYear(companyId)
        getAllChildCategoryOfACompany(companyId)
    }, [companyId]);

    useEffect(() => {
        getQADepotOrAllQADepotInfo(userLoginId);
    }, [userLoginId]);

    useEffect(() => {
        getQAInspectionData(searchParams)
    }, [searchParams])
    const handleExport = () => {
        const data = [...singleAll]

        if (data.length === 0) {
            showError("No row is selected for export data");
            return;
        }
        let exportData = [];
        data.map(row => {
            let obj = {};
            obj.productSku = row.productSku;
            obj.productName = row.productName;
            obj.productCategory = row.productCategory;
            obj.batchNo = row.batchNo;
            obj.salesOfficer = row.salesOfficer;
            obj.designation = row.designation;
            obj.quantity = row.quantity;
            obj.qaStatus = row.qaStatus;

            exportData.push(obj);
            //setSelectedRows([]);
        })
        const workbook = XLSX.utils.book_new();
        const Heading = [
            ["PRODUCT SKU", "PRODUCT NAME", "PRODUCT CATEGORY", "BATCH NO", "SALES OFFICER", "DESIGNATION", "QUANTITY", "STATUS"]
        ];
        const worksheet = XLSX.utils.json_to_sheet(exportData, { origin: 'A2', skipHeader: true });

        // creating sheet and adding data from 2nd row of column A.
        // Leaving first row to add Heading
        XLSX.utils.sheet_add_aoa(worksheet, Heading, { origin: 'A1' });

        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, "QA Review List.xlsx");
    }
    const handleNewQAReceive = () => {
        history.push("/production-qa-setup-new", { companyId: companyId, userLoginId: userLoginId, depotId: depotId })
    }

    const handleStatus = (event) => {
        setQAInspectionData([])
        setStatus(event.target.value)
    }

    const handleProductCategory = (event) => {
        setQAInspectionData([])
        setProductCategoryId(event.target.value)
    }

    const getAccountingYear = (companyId) => {
        const URL = `${process.env.REACT_APP_API_URL}/api/accounting-year/companyWise/${companyId}`;
        if (companyId) {
            axios.get(URL).then(response => {
                setAllAccountingYear(response.data.data);
            }).catch(err => {
                //showError(intl.formatMessage({ id: "COMMON.ERROR_STATUS" }));
            });
        }
    }

    const getQADepotOrAllQADepotInfo = (userLoginId) => {

        const URL = `${process.env.REACT_APP_API_URL}/api/depot-quality-assurance-map/qa-depot-or-all/${userLoginId}`;

        axios.get(URL).then(response => {

            if (response.data.data[0] !== undefined)
                setDepotId((current) => response.data.data[0].id);
            setDepots(response.data.data);
        }).catch(err => {

        });
    }

    const getAllChildCategoryOfACompany = (companyId) => {
        let queryString = "?";
        queryString += "companyId=" + companyId;

        const URL = `${process.env.REACT_APP_API_URL}/api/product-category/child` + queryString;
        if (companyId) {
        axios.get(URL).then(response => {
            setChildCategoryList(response.data.data);
        }).catch(err => {

        });}
    }

    const getQAInspectionData = (searchParams) => {

        let queryString = "?";
        queryString += "companyId=" + searchParams.companyId;
        queryString += searchParams.depotId ? "&depotId=" + searchParams.depotId : "";
        queryString += searchParams.productCategoryId ? "&productCategoryId=" + searchParams.productCategoryId : "";
        queryString += searchParams.accountingYearId ? "&accountingYearId=" + searchParams.accountingYearId : "";
        queryString += searchParams.status ? "&qaStatus=" + searchParams.status : "";

        const URL = `${process.env.REACT_APP_API_URL}/api/quality-inspection/info` + queryString;
        if (searchParams.companyId) {

            axios.get(URL).then((response) => {

                setQAInspectionData(response.data.data);

            }).catch();
        }
    }
    return (
        <>
            {/* BREAD CRUM ROW */}
            <div>
                <BatchPreparationBreadCrum />
            </div>
            <div>
                <Card className="mt-5">
                    <CardBody>
                        <span className="text-muted mt-3 display-inline-block">
                            In this program concern Quality Assurance personnel can receive the Product Quarantine store after production.
                        </span>
                        {hasCreateAccess(permissions, 'QUALITY_ASSURANCE') &&
                        <span>
                            <button onClick={handleNewQAReceive} className="float-right btn light-blue-bg dark-blue-color rounded">
                                <SVG className="mr-2" src={toAbsoluteUrl("/media/svg/icons/project-svg/blue-add.svg")} />
                                New QA Inspection
                            </button>
                        </span>
                        }
                    </CardBody>
                </Card>
            </div>

            {/* MAIN CARD ROW */}
            <div>
                <Card className="mt-5">
                    <CardBody>
                        {/* SEARCH AND FILTER ROW */}
                        <div className="row">
                            {/* SEARCH BOX ROW */}
                            <div className="col-xl-3 mt-5">
                                <div style={{ position: "absolute", padding: "7px", marginTop: "3px" }}>
                                    <img src={toAbsoluteUrl("/images/search.png")} width="20px" height="20px" />
                                </div>
                                <form className="form form-label-right">
                                    <input type="text" className="form-control" name="searchText"
                                        placeholder="Search Here" style={{ paddingLeft: "28px" }} />
                                </form>
                            </div>

                            {/* SELECTED ROW */}
                            <div className="col-xl-8">
                                <div className="d-flex flex-wrap">
                                    {/* STATUS DROPDOWN */}
                                    <div className="mr-5 mt-5">
                                        <div className="row">
                                            <div className="col-4 mt-3">
                                                <label style={{ color: "rgb(130, 130, 130)" }}>Status</label>
                                            </div>
                                            <div className="col-8">
                                                <select className="form-control border-0" onChange={handleStatus} name="categoryName">
                                                    <option value="" selected>Select Status</option>
                                                    <option value="PASS">PASS</option>
                                                    <option value="FAILED">FAILED</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* DEPOT DROPDOWN */}
                                    <div className="mr-5 mt-5">
                                        <div className="row">
                                            <div className="col-4 mt-3">
                                                <label style={{ color: "rgb(130, 130, 130)" }}>Depot</label>
                                            </div>
                                            <div className="col-8">
                                                <select className="form-control border-0" onChange={(event) => setDepotId(event.target.value)} name="categoryName">

                                                    {depots.map((depot) => (
                                                        <option key={depot.depotName} value={depot.id}>
                                                            {depot.depotName}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* TIMELINE DROPDOWN */}
                                    <div className="mr-5 mt-5">
                                        <div className="row">
                                            <div className="col-4 mt-3">
                                                <label style={{ color: "rgb(130, 130, 130)" }}>Timeline</label>
                                            </div>
                                            <div className="col-8">
                                                <select className="form-control border-0" onChange={(event) => { setAccountingYearId(event.target.value) }} name="categoryName">
                                                    <option value="" selected>Select Fiscal Year</option>
                                                    {allAccountingYear.map((accYear) => (
                                                        <option key={accYear.fiscalYearName} value={accYear.id}>
                                                            {accYear.fiscalYearName}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    {/* SEMESTER DROPDOWN */}
                                    <div className="mt-5">
                                        <div className="row">
                                            <div className="col-5 mt-3">
                                                <label style={{ color: "rgb(130, 130, 130)" }}>Product Category</label>
                                            </div>
                                            <div className="col-7">
                                                <select className="form-control border-0" onChange={handleProductCategory} name="categoryName">
                                                    <option value="" selected>Select Product Category</option>
                                                    {childCategoryList.map((childCat) => (
                                                        <option key={childCat.childCategory} value={childCat.productCategoryId}>
                                                            {childCat.childCategory}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* FILTER BUTTON ROW */}
                            <div className="col-xl-1 mt-5">
                                <button className="btn filter-btn">
                                    <i className="bi bi-funnel" style={{ fontSize: "11px" }}></i>&nbsp;Filter
                                </button>
                            </div>
                        </div>

                        {/* ALL SUMMARY ROW */}
                        <div className='d-flex justify-content-between sales-data-chip'>
                            <div className="d-flex">
                                <div className="dark-gray-color">
                                    <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/dark-gray-category.svg")} width="15px" height="15px" />
                                </div>
                                <div className="ml-2">
                                    <span>
                                        <span className="dark-gray-color"
                                            style={{ fontWeight: "500" }}>Depot</span>
                                        <p><strong>All</strong></p>
                                    </span>
                                </div>
                            </div>
                            <div style={{ background: "#F9F9F9" }}>
                                <button className="btn float-right export-btn" onClick={handleExport}>
                                    <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/download.svg")} width="15px" height="15px" />
                                </button>
                            </div>
                        </div>
                        {/* TABLE ROW */}
                        <div className='mt-5'>
                            <QAReviewList setSingleAll={setSingleAll} singleAll={singleAll} qaInspectionData={qaInspectionData} />
                        </div>
                    </CardBody>
                </Card>
            </div>
        </>
    );
}