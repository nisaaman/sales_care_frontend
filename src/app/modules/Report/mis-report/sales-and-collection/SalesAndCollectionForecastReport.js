import React, { useEffect, useState } from 'react';
import { toAbsoluteUrl } from "../../../../../_metronic/_helpers";
import { Card, CardBody } from "../../../../../_metronic/_partials/controls";
import { showError } from '../../../../pages/Alert';
import axios from "axios";
import { useIntl } from "react-intl";
import { shallowEqual, useSelector } from "react-redux";
import Button from '@material-ui/core/Button';
import moment from "moment";
import MisReportBreadCrum from '../MisReportBreadCrum';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import IOSSwitch from '../../../../pages/IOSSwitch';

// IMPORT COMMON COMPONENT FILE
import ReportLocationTreeView from '../../../Common/ReportLocationTreeView';
import SalesOfficeList from "../../../Common/SalesOfficeList";
import DistributorList from "../../../Common/DistributorList";
import CommonDateComponent from '../../../Common/CommonDateComponent';
import CommonReportType from "../../../Common/CommonReportType";
import CommonReportFormat from "../../../Common/CommonReportFormat";

export default function SalesAndCollectionForecastReport() {

    const fields = {
        locationId: "",
        salesOfficerId: "",
        distributorId: "",
        startDate: "",
        endDate: "",
        report: ""


    };

    const [inputs, setInputs] = useState(fields);
    const companyId = useSelector((state) => state.auth.company, shallowEqual);
    const intl = useIntl();
    const [showReport, setShowReport] = useState('');
    const [reportData, setReportData] = useState([]);

    // NATIONAL BUTTON STATE
    const [nationalLocationChecked, setNationalLocationChecked] = useState(false);

    // LOCATION TREE COMPONENT USE STATE
    const [nodes, setNodes] = useState([]);
    const [categoryLevel, setCategoryLevel] = useState("");
    const [locationTree, setLocationTree] = useState([]);
    const [locationIds, setLocationIds] = useState([]);

    // SALES OFFICER COMPONENT USE STATE
    const [salesOfficer, setSalesOfficer] = useState([]);
    const [salesOfficerList, setSalesOfficerList] = useState([]);
    const [salesOfficerIds, setSalesOfficerIds] = useState([]);

    // DISTRIBUTOR COMPONENT USE STATE
    const [distributors, setDistributors] = useState([]);
    const [distributorList, setDistributorList] = useState([]);

    // FISCAL YEAR COMPONENT USE STATE
    const [accountingYearId, setAccountingYearId] = useState(null);

    // DATE COMPONENT USE STATE
    const [inputsDate, setInputsDate] = useState({});
    const [dateType, setDateType] = useState("Date");

    // REPORT TYPE COMPONENT USE STATE
    const [reportType, setReportType] = useState("");

    // REPORT FORMATE COMPONENT USE STATE
    const [reportFormat, setReportFormat] = useState("");

    const [isNationalShow, setIsNationalShow] = useState(true);

    useEffect(() => {
        //document.getElementById('reportShowIframe').style.display = "none";
        getLocationTreeList(companyId)
    }, [companyId]);

    useEffect(() => {
        nodes.map(node => {
            getLocationIds(node)
        })
    }, [nodes]);

    useEffect(() => {
        getSalesOfficerIds(salesOfficer, salesOfficerList)
    }, [salesOfficer, salesOfficerList]);

    const getLocationTreeList = (companyId) => {
        const URL = `${process.env.REACT_APP_API_URL}/api/location-tree/report-location-tree-info/${companyId}`;
        axios.get(URL).then(response => {
            const locationTree = response.data.data.locationAsTree;
            setIsNationalShow(response.data.data.isNationalShow);
            setLocationTree(locationTree);
        }).catch(err => {
            showError("Cannot get Location Tree data.");
        });
    }

    const getLocationIds = (node) => {
        let temp = [...locationIds]
        let index = temp.findIndex(id => id === node.id)
        if (index === -1) {
            setLocationIds(current => [...current, node.id]);
        }
        node.children.map(nodeChild => {
            getLocationIds(nodeChild)
        })
    }

    const selectLocationTreeNode = (node) => {
        locationIds.length = 0;
        let temp = [...nodes]
        let index = temp.findIndex(data => data.treeLevel == node.treeLevel)
        if (index > -1) {
            temp.splice(index, 1);
            setNodes(temp)
        } else {
            temp.push(node)
            setNodes(temp)
        }
        if (categoryLevel != "") {
            setCategoryLevel(node.treeLevel)
            if (categoryLevel.split('-').length == node.treeLevel.split('-').length) {
                let id = "report-location-tree-view-id-" + node.id;
                const getId = document.getElementById(id);
                if (getId.className == "d-flex justify-content-between tree-nav__item_demo tree-nav__item-title report-location-tree-selected") {
                    getId.classList.remove('report-location-tree-selected');
                    salesOfficer.length = 0;
                    distributors.length = 0;
                } else {
                    getId.classList.add('report-location-tree-selected');
                    setNationalLocationChecked(false)
                }
            } else {
                let id = "report-location-tree-view-id-" + node.id;
                const getId = document.getElementById(id);
                const getElements = document.getElementsByClassName('tree-nav__item_demo tree-nav__item-title');
                for (var i = 0; i < getElements.length; i++) {
                    getElements[i].classList.remove('report-location-tree-selected');
                    salesOfficer.length = 0;
                    distributors.length = 0;
                }
                if (getId) {
                    getId.classList.add('report-location-tree-selected');
                    setNationalLocationChecked(false)
                }
            }

        } else {
            setCategoryLevel(node.treeLevel)
            let id = "report-location-tree-view-id-" + node.id;
            const getId = document.getElementById(id);
            if (getId.className == "d-flex justify-content-between tree-nav__item_demo tree-nav__item-title report-location-tree-selected") {
                getId.classList.remove('report-location-tree-selected');
                salesOfficer.length = 0;
                distributors.length = 0;
            } else {
                getId.classList.add('report-location-tree-selected');
                setNationalLocationChecked(false)
            }
        }
    }

    const handleActive = () => {
        salesOfficerList.length = 0;
        distributorList.length = 0;
        distributors.length = 0;
        let checked = document.getElementById('nationalId').checked;
        setNationalLocationChecked(checked)
        if (checked) {
            nodes.length = 0;
            locationIds.length = 0;
            const getElements = document.getElementsByClassName('tree-nav__item_demo tree-nav__item-title');
            for (let i = 0; i < getElements.length; i++) {
                getElements[i].classList.remove('report-location-tree-selected');
            }
        }
    }

    const getSalesOfficerIds = (salesOfficer, salesOfficerList) => {
        salesOfficerIds.length = 0;

        if (salesOfficerList.length > 0) {
            salesOfficerList.map((data) => {
                let temp = [...salesOfficerIds]
                let index = temp.findIndex(id => id === data.id)
                if (index === -1) {
                    setSalesOfficerIds(current => [...current, data.id]);
                }
            })
        } else {
            salesOfficer.map((data) => {
                let temp = [...salesOfficerIds]
                let index = temp.findIndex(id => id === data.id)
                if (index === -1) {
                    setSalesOfficerIds(current => [...current, data.id]);
                }
            })
        }

    }

    const getParamsDate = () => {
        let startDate = '';
        let endDate = '';
        if (dateType === 'Date') {
            startDate = inputsDate.startDate === 'Invalid date' || inputsDate.startDate === undefined || inputsDate.startDate === null || inputsDate.startDate === '' ? '' : inputsDate.startDate;   // 2023-03-01  yyyy-mm-dd
            endDate = inputsDate.endDate === 'Invalid date' || inputsDate.endDate === undefined || inputsDate.endDate === null || inputsDate.endDate === '' ? '' : inputsDate.endDate;   // 2023-03-01  yyyy-mm-dd
        } else if (dateType === 'Month') {
            if (inputsDate.startMonth !== undefined) {
                let startY = inputsDate.startMonth.getFullYear();
                let startM = inputsDate.startMonth.getMonth() + 1;
                startM = startM <= 9 ? startM = '0' + startM : startM;
                startDate = inputsDate.startMonth === undefined || inputsDate.startMonth === null || inputsDate.startMonth === '' ? '' : (startY + '-' + startM + '-01');
            }
            if (inputsDate.endMonth !== undefined) {
                let endY = inputsDate.endMonth.getFullYear();
                let endM = inputsDate.endMonth.getMonth() + 1;
                endM = endM <= 9 ? endM = '0' + endM : endM;
                let lastDay = new Date(endY, endM, 0).getDate();
                endDate = inputsDate.endMonth === undefined || inputsDate.endMonth === null || inputsDate.endMonth === '' ? '' : (endY + '-' + endM + '-' + lastDay);
            }
        } else if (dateType === 'Year') {
            startDate = inputsDate.fromYear === 'Invalid date' || inputsDate.fromYear === undefined || inputsDate.fromYear === null || inputsDate.fromYear === '' ? '' : (inputsDate.fromYear + '-01-01');
            endDate = inputsDate.toYear === 'Invalid date' || inputsDate.toYear === undefined || inputsDate.toYear === null || inputsDate.toYear === '' ? '' : (inputsDate.toYear + '-12-31');
        }
        return { startDate: startDate, endDate: endDate };
    }

    const validate = () => {
        let dates = getParamsDate();
        let startDate = dates.startDate;
        let endDate = dates.endDate;

        if (nationalLocationChecked === false) {
            if (locationIds.length === 0) {
                showError('Please Select Location.');
                return false;
            } else if (endDate < startDate) {
                showError(`End ${dateType} should be greater than Start ${dateType}.`);
                return false;
            } else if (reportType === '') {
                showError('Please Select Report Type.');
                return false;
            } else if (reportFormat === '') {
                showError('Please Select Report Formate.');
                return false;
            }
        } else if (endDate < startDate) {
            showError(`End ${dateType} should be greater than Start ${dateType}.`);
            return false;
        } else if (reportType === '') {
            showError('Please Select Report Type.');
            return false;
        } else if (reportFormat === '') {
            showError('Please Select Report Formate.');
            return false;
        }
        return true;
    }

    const download = () => {
        if (!validate()) {
            return false;
        }
        let queryString = '?';
        //queryString += 'depotId=' + parseInt(inputs.depotId);
        //queryString += '&companyId=' + companyId;
        //queryString += '&storeId=' + parseInt(inputs.storeId);

        queryString += 'salesOfficerId=' + parseInt(inputs.salesOfficerId);
        queryString += '&startDate=' + inputs.startDate;
        queryString += '&endDate=' + inputs.endDate;
        queryString += '&distributorId=' + parseInt(inputs.distributorId);

        const URL = `${process.env.REACT_APP_API_URL}/api/reports/stock-valuation` + queryString;
        axios.get(URL, { responseType: 'blob' }).then(response => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', "salesAndCollection.pdf");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        }).catch(err => {
            showError();
        });

    }

    const previewValidate = () => {
        let dates = getParamsDate();
        let startDate = dates.startDate;
        let endDate = dates.endDate;
        if (nationalLocationChecked === false) {
            if (locationIds.length === 0) {
                showError('Please Select Location.');
                return false;
            } else if (endDate < startDate) {
                showError(`End ${dateType} should be greater than Start ${dateType}.`);
                return false;
            } else if (reportType === '') {
                showError('Please Select Report Type.');
                return false;
            }
        } else if (endDate < startDate) {
            showError(`End ${dateType} should be greater than Start ${dateType}.`);
            return false;
        } else if (reportType === '') {
            showError('Please Select Report Type.');
            return false;
        }
        return true;
    }

    const preview = () => {
        if (!previewValidate()) {
            return false;
        }
        setShowReport(inputs.reportType);
        // if(!validate()){
        //     return false;
        // }
        // let queryString = "?";
        // queryString += 'salesOfficerId=' + parseInt(inputs.salesOfficerId);
        // queryString += '&startDate=' + inputs.startDate;
        // queryString += '&endDate=' + inputs.endDate;

        axios.get(URL).then((response) => {
            setReportData(response.data.data);
            setShowReport(true);
        }).catch();
    }
    // console.log(inputs)
    return (
        <>
            <div>
                <MisReportBreadCrum menuTitle="Sales And Collection Forecast Report" />
            </div>
            <div>
                {/* BREAD CRUM ROW */}
                {/* <InventoryBreadCrum /> */}
                {/* TODAY SALE ROW */}
                {/* <InventoryStockHeader showStockData={true} /> */}
                {/* <ReportsSubTabsHeader /> */}
            </div>
            <div>
                <Card>
                    <CardBody>
                        <div className='row'>
                            {/* LEFT SIDE TREE ROW */}
                            <div className='col-xl-5' style={{ borderRight: "1px solid #F2F2F2" }}>
                                <div style={{ borderBottom: "1px solid #F2F2F2" }}>
                                    <label>
                                        <img src={toAbsoluteUrl("/images/loc3.png")}
                                            style={{ width: "20px", height: "20px", textAlign: "center" }}
                                            alt='Company Picture' />
                                        <strong style={{ marginLeft: "10px", color: "#828282" }}>{intl.formatMessage({ id: "COMMON.LOCATION_ALL" })}</strong>
                                    </label>
                                </div>
                                {/* NATIONAL BUTTON */}
                                {isNationalShow && <div>
                                    <FormControlLabel
                                        control={<IOSSwitch id="nationalId"
                                            checked={nationalLocationChecked}
                                            onClick={handleActive}
                                        />}
                                        label="National"
                                    />
                                </div>}
                                {/* LOCATION TREE */}
                                <ReportLocationTreeView tree={locationTree} selectLocationTreeNode={selectLocationTreeNode} />
                            </div>
                            {/* RIGHT SIDE LIST ROW */}
                            <div className='col-xl-7'>
                                {/* SALES OFFICER COMPONENT */}
                                <SalesOfficeList
                                    companyIdPass={companyId}
                                    locationsIdsPass={locationIds}
                                    setSalesOfficerListPass={setSalesOfficerList}
                                    salesOfficerListPass={salesOfficerList}
                                    salesOfficer={salesOfficer}
                                    setSalesOfficer={setSalesOfficer}
                                    nationalLocationChecked={nationalLocationChecked}
                                />

                                {/* DISTRIBUTOR COMPONENT */}
                                <DistributorList
                                    companyIdPass={companyId}
                                    salesOfficerIdsPass={salesOfficerIds}
                                    setDistributorListPass={setDistributorList}
                                    distributorListPass={distributorList}
                                    distributors={distributors} setDistributors={setDistributors}
                                />

                                {/* DATE COMPONENT */}
                                <CommonDateComponent
                                    inputs={inputsDate}
                                    setInputs={setInputsDate}
                                    type={dateType}
                                    setType={setDateType}
                                />

                                {/* REPORT TYPE COMPONENT */}
                                <CommonReportType
                                    setReportType={setReportType}
                                />

                                {/* REPORT FORMATE COMPONENT */}
                                <CommonReportFormat
                                    setReportFormat={setReportFormat}
                                />

                                <Button className="float-right mt-5" id="gotItBtn" variant="contained"
                                    color="primary"
                                    onClick={download}
                                >
                                    Download
                                </Button>

                                <div className="float-right">
                                    <Button className="mt-5 mr-5" id="gotItBtn" variant="contained" color="primary" onClick={preview}>
                                        Preview
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </>
    );
}