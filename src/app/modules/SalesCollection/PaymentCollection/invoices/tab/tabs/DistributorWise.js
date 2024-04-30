import React, { useState, useEffect, useMemo } from "react";
import CollectionBreadCrum from '../../../common/CollectionBreadCrum';
import CollectionTodaySales from "../../../common/CollectionTodaySales";
import InvoicesTabs from "../../../common/InvoicesTabs";
import moment from "moment";
import Flatpickr from "react-flatpickr";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../../../_metronic/_helpers";
import { Card, CardBody } from "../../../../../../../_metronic/_partials/controls";
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { showError } from '../../../../../../pages/Alert';
import { useIntl } from "react-intl";
import LocationTreeView from '../../../../CommonComponents/LocationTreeView';
import { DistributorWiseList } from "../../table/distributor-wise-table/DistributorWiseList";
import { shallowEqual, useSelector } from "react-redux";
import { amountFormatterWithoutCurrency } from "../../../../../Util";
import * as XLSX from 'xlsx';

export default function DistributorWise() {

    let history = useHistory();
    const intl = useIntl();
    const companyId = useSelector((state) => state.auth.company, shallowEqual);
    const userLoginId = useSelector((state) => state.auth.user.userId, shallowEqual);
    const [asOnDateStr, setAsOnDateStr] = useState(moment(new Date()).format("YYYY-MM-DD"));
    const [locationId, setLocationId] = useState('');
    const [allAccountingYear, setAllAccountingYear] = useState([]);
    const [elapsedDaysValue, setElapsedDaysValue] = useState('');
    const [fiscalYear, setFiscalYear] = useState({});

    const searchParams = useMemo(() => {
        return {
            userLoginId: userLoginId, companyId: companyId, asOnDateStr: asOnDateStr,
            locationId: locationId, elapsedDaysValue: elapsedDaysValue
        }
    }, [userLoginId, companyId, asOnDateStr, locationId, elapsedDaysValue]);

    const [anchorEl, setAnchorEl] = useState(null);
    const [locationTree, setLocationTree] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState({});
    const [locationTypeNameSelect, setLocationTypeNameSelect] = useState("Area");
    const [distributorWiseSalesInvoiceOverviewList, setDistributorWiseSalesInvoiceOverviewList] = useState([]);
    const [totalReceivable, setTotalRecivable] = useState(0);

    let [singleAll, setSingleAll] = useState([]);
    useEffect(() => {
        document.getElementById('pills-payment-invoices-tab').classList.add('active');
        document.getElementById('pills-invoices-distributor-wise-tab').classList.add('active');
        getLocationTreeList();
        getAccountingYear(companyId);
    }, [userLoginId, companyId]);

    useEffect(() => {
        getDistributorWiseSalesInvoice(searchParams);
    }, [searchParams]);

    const handleClick = (event) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popper' : undefined;

    const handleExport = () => {
        const data = [...singleAll];
        if (data.length === 0) {
            showError("No row is selected for export data");
            return;
        }

        let exportData = [];
        data.map(row => {
            let obj = {};
            obj.distributorName = row.distributorName;
            obj.ledgerBalance = amountFormatterWithoutCurrency(row.ledgerBalance);
            obj.creditInvoice = row.creditInvoice;
            obj.cashInvoice = row.cashInvoice;
            obj.overdueInvoice = row.overdueInvoice;

            exportData.push(obj);
            //setSingleAll([]);
        })
        const workbook = XLSX.utils.book_new();
        const Heading = [
            ["DISTRIBUTOR NAME", "LEDGER BALANCE", "CREDIT INVOICE", "CASH INVOICE", "OVERDUE INVOICE"]
        ];
        const worksheet = XLSX.utils.json_to_sheet(exportData, { origin: 'A2', skipHeader: true });

        XLSX.utils.sheet_add_aoa(worksheet, Heading, { origin: 'A1' });
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, "DistributorWiseInvoiceList.xlsx");
    }

    const getLocationTreeList = () => {
        const URL = `${process.env.REACT_APP_API_URL}/api/location-tree/locationTree/${searchParams.userLoginId}/${searchParams.companyId}`;
        if (searchParams.companyId) {

            axios.get(URL).then(response => {
                const locationTree = response.data.data;
                setLocationTree(locationTree);
            }).catch(err => {
                showError(intl.formatMessage({ id: "COMMON.ERROR_LOCATION_TREE" }));
            });
        }
    }

    const getDistributorWiseSalesInvoice = (params) => {

        let queryString = "?";
        queryString += "companyId=" + params.companyId;
        queryString += params.locationId ? "&locationId=" + params.locationId : "";
        queryString += params.asOnDateStr ? "&asOnDateStr=" + params.asOnDateStr : "";
        queryString += "&userLoginId=" + params.userLoginId;
        queryString += "&dueStatusValue=" + params.elapsedDaysValue;

        const URL = `${process.env.REACT_APP_API_URL}/api/sales-invoice/distributor-wise/over-view` + queryString;
        axios.get(URL).then(response => {
            setDistributorWiseSalesInvoiceOverviewList(response.data.data.salesInvoiceList);
            setTotalRecivable(response.data.data.totalReceivable);
        }).catch(err => {

        });
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
            setLocationId(node.id)
            setSelectedLocation(node);
        }
    }
    const handleElapsedDaysChange = (event) => {
        if (event.target.value == "ALL") {

            setElapsedDaysValue("");
        } else if (event.target.value == "NOTDUES") {

            setElapsedDaysValue(0);
        } else {

            setElapsedDaysValue(1);
        }
    }

    const getAccountingYear = (companyId) => {
        const URL = `${process.env.REACT_APP_API_URL}/api/accounting-year/companyWise/${companyId}`;
        if (companyId) {
            axios.get(URL).then(response => {
                setAllAccountingYear(response.data.data);
            }).catch(err => {

            });
        }
    }

    const setAccountingYearData = (event) => {

        setAsOnDateStr(event.target.value)
    }

    const handleKeyPressChange = (e) => {
        if (e.keyCode === 32) {
            getDistributorWiseSalesInvoice(searchParams);
        } else if (e.keyCode === 8) {
            getDistributorWiseSalesInvoice(searchParams);
        }
    }
    const handleSearchChange = (event) => {
        let value = event.target.value;
        getSearchList(value);
    }
    const getSearchList = (searchText) => {
        let searchTextValue = searchText.toLowerCase();
        let tp = [];
        for (let i = 0; i < distributorWiseSalesInvoiceOverviewList.length; i++) {
            let distributorName = distributorWiseSalesInvoiceOverviewList[i].distributorName.toLowerCase();
            if (distributorName.includes(searchTextValue)) {
                tp.push(distributorWiseSalesInvoiceOverviewList[i]);
            }
        }
        setDistributorWiseSalesInvoiceOverviewList(tp);
    }

    return (
        <>
            <div>
                {/* BREAD CRUM ROW */}
                <CollectionBreadCrum />
                {/* TODAY SALE ROW */}
                <CollectionTodaySales />
            </div>
            <div>
                <InvoicesTabs />
            </div>
            <div className="mt-5">
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
                                                    placeholder="Search Here" style={{ paddingLeft: "28px" }}
                                                    onKeyUp={(e) => handleKeyPressChange(e)}
                                                    onChange={handleSearchChange}
                                                />
                                            </form>
                                        </div>
                                        <div className="col-xl-9 d-flex flex-wrap">
                                            <div className="d-flex w-50">
                                                <div className="mt-3">
                                                    <label className="dark-gray-color">{intl.formatMessage({ id: "COMMON.ELAPSED_DAYS" })}</label>
                                                </div>
                                                <div className="mr-5">
                                                    <select className="form-control border-0 payment-collection-invoices-select" onChange={(event) => handleElapsedDaysChange(event)}>
                                                        <option value="ALL" selected>All</option>
                                                        <option value="NOTDUES">Not Dues</option>
                                                        <option value="OVERDUES">Overdues</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="d-flex w-50">
                                                <div className="mt-3 w-25">
                                                    <label className="dark-gray-color">As on Date<i style={{ color: "red" }}>*</i></label>
                                                </div>
                                                <div className="w-75 mt-1">
                                                    <Flatpickr className="form-control date border-0" id="startDate" placeholder="dd-MM-yyyy"
                                                        options={{ dateFormat: "d-M-Y" }} required
                                                        onChange={(value) => {
                                                            setAsOnDateStr(
                                                                moment(new Date(value)).format("YYYY-MM-DD")
                                                            )
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            {/* <div>
                                                <button className="btn filter-btn">
                                                    <i className="bi bi-funnel mr-1"></i>Filter
                                                </button>
                                            </div> */}
                                        </div>
                                    </div>
                                    {/* ALL SUMMARY ROW */}
                                    <div className='sales-data-chip d-flex flex-wrap justify-content-between'>
                                        <div className='' style={{ borderRadius: "5px 0px 0px 5px" }}>
                                            <div className="d-flex">
                                                <div className="dark-gray-color">
                                                    <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/location.svg")} width="30px" height="30px" />
                                                </div>
                                                <div className="ml-2">
                                                    <span>
                                                        <span className="dark-gray-color"
                                                            style={{ fontWeight: "500" }}>{locationTypeNameSelect}</span>
                                                        <p><strong>{selectedLocation.locationName ? selectedLocation.locationName : 'All'}</strong></p>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className=''>
                                            <div className="d-flex">
                                                <div className="dark-gray-color">
                                                    <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/total-entry.svg")} width="25px" height="25px" />
                                                </div>
                                                <div className="ml-2">
                                                    <span>
                                                        <span className="dark-gray-color"
                                                            style={{ fontWeight: "500" }}>{intl.formatMessage({ id: "COMMON.TOTAL_RECEIVABLE" })}</span>
                                                        <p><strong>{amountFormatterWithoutCurrency(totalReceivable)}</strong></p>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='' style={{ background: "#F9F9F9" }}>
                                            <button className="btn float-right export-btn" onClick={handleExport}>
                                                <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/download.svg")} width="15px" height="15px" />
                                            </button>
                                        </div>
                                    </div>
                                    {/* TABLE ROW */}
                                    <div className='mt-5'>
                                        <DistributorWiseList setSingleAll={setSingleAll}
                                            singleAll={singleAll}
                                            distributorWiseSalesInvoiceOverviewList={distributorWiseSalesInvoiceOverviewList}
                                            asOnDateStr={asOnDateStr} />
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