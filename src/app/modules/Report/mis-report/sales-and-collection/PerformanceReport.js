import React, { useEffect, useMemo, useState } from 'react';
import { toAbsoluteUrl } from "../../../../../_metronic/_helpers";
import { Card, CardBody } from "../../../../../_metronic/_partials/controls";
import { useHistory } from 'react-router-dom';
import LocationTreeView from '../../../SalesCollection/CommonComponents/LocationTreeView';
import { showError } from '../../../../pages/Alert';
import axios from "axios";
import { useIntl } from "react-intl";
import { shallowEqual, useSelector } from "react-redux";
import MisReportBreadCrum from '../MisReportBreadCrum';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import IOSSwitch from '../../../../pages/IOSSwitch';
// import ReportsSubTabsHeader from "../../../../../../sub-tabs-header/ReportsSubTabsHeader";


// import InventoryStockHeader from "../../../../../../header/InventoryStockHeader";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { TextField } from "@material-ui/core";
import Button from '@material-ui/core/Button';
import { typeOf } from 'react-is';
import moment from "moment";
import "flatpickr/dist/themes/material_green.css";
import { getDayDiff, getDaysCount } from "../../../Util"
import { format, parse, isValid, parseISO } from 'date-fns';

// IMPORT COMMON COMPONENT FILE
import ReportLocationTreeView from '../../../Common/ReportLocationTreeView';
import SalesOfficeList from "../../../Common/SalesOfficeList";
import DistributorList from "../../../Common/DistributorList";
import CommonDateComponent from '../../../Common/CommonDateComponent';
import CommonReportType from "../../../Common/CommonReportType";
import CommonReportFormat from "../../../Common/CommonReportFormat";


export default function PerformanceReport() {

    const fields = {
        locationId: "",
        salesOfficerId: "",
        distributorId: "",
        startDate: "",
        endDate: "",
        report: "",
        reportType: ""
    };

    const [inputs, setInputs] = useState(fields);
    const userId = useSelector((state) => state.auth.user.userId, shallowEqual);
    const companyId = useSelector((state) => state.auth.company, shallowEqual);
    const selectedCompany = useSelector((state) => state.auth.company, shallowEqual);
    const userLoginId = useSelector((state) => state.auth.user.userId, shallowEqual);
    const intl = useIntl();
    const [sessionData, setSessionData] = useState({ userLoginId: userId, companyId: companyId });
    //const [company, setCompany] = useState([]);
    const [accountingYearId, setAccountingYearId] = useState('');
    const [locationId, setLocationId] = useState('');
    //const [childCategoryList, setChildCategoryList] = useState([]);
    const [productCategoryId, setProductCategoryId] = useState('');
    // const [allAccountingYear, setAllAccountingYear] = useState([]);
    // const [categoryName, setCategoryName] = useState('All');
    // const [inputs, setInputs] = useState({});
    const [salesOfficerValue, setSalesOfficerValue] = useState(null);
    const [distributorValue, setDistributorValue] = useState(null);
    const [showReport, setShowReport] = useState('');
    const [reportData, setReportData] = useState([]);
    const [withSum, setWithSum] = useState(false);

    // NATIONAL BUTTON STATE
    const [nationalLocationChecked, setNationalLocationChecked] = useState(false);

    // ALL BUTTON STATE
    const [allChecked, setAllChecked] = useState(false);
    const [disabledChecked, setDisabledChecked] = useState(false);

    const [locationTypeList, setLocationTypeList] = useState([]);
    const [locationTypeData, setLocationTypeData] = useState("");

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

    // DATE COMPONENT USE STATE
    const [inputsDate, setInputsDate] = useState({});
    const [dateType, setDateType] = useState("Date");

    // REPORT TYPE COMPONENT USE STATE
    const [reportType, setReportType] = useState("");

    // REPORT FORMATE COMPONENT USE STATE
    const [reportFormat, setReportFormat] = useState("");

    const searchParams = useMemo(() => {
        return {
            userLoginId: userLoginId, companyId: selectedCompany, accountingYearId: accountingYearId
            , locationId: locationId, productCategoryId: productCategoryId
        }
    }, [userLoginId, selectedCompany, accountingYearId, locationId, productCategoryId]);

    const [selectedLocation, setSelectedLocation] = useState({});
    const [total, setTotal] = useState({ totalQuantity: 0, totlaSalesAmount: 0 });
    const [salesDataList, setOrderToCashCycleList] = useState([]);

    let history = useHistory();
    const [anchorEl, setAnchorEl] = React.useState(null);
    let [singleAll, setSingleAll] = React.useState([]);

    const handleClick = (event) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    };
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popper' : undefined;
    // useEffect(() => {
    //     // document.getElementById('pills-inventory-stock-report-tab').classList.add('active')
    //     // document.getElementById('pills-inventory-stock-sales-collection-report-tab').classList.add('active')
    // }, []);

    const [isNationalShow, setIsNationalShow] = useState(false);

    useEffect(() => {
        document.getElementById('reportShowIframe').style.display = "none";
        getLocationTreeList(companyId)
    }, [companyId]);


    useEffect(() => {
        nodes.map(node => getLocationIds(node))
    }, [nodes]);

    useEffect(() => {
        getSalesOfficerIds(salesOfficer, salesOfficerList)
    }, [salesOfficer, salesOfficerList]);

    useEffect(() => {
       if(reportType === 'DETAILS'){
        setDisabledChecked(true)
        setAllChecked(false)
       } else {
        setDisabledChecked(false)
       }

       if(reportType === 'SUMMARY'){
        setReportFormat('PDF')
       } else {
            setReportFormat('')
       }
    }, [reportType]);

    useEffect(() => {
        getLocationTypeList()
    }, [companyId]);

    const getLocationTypeList = () => {
        const URL = `${process.env.REACT_APP_API_URL}/api/location-type/getAllLocationType/${companyId}`;
        axios.get(URL).then(response => {
            setLocationTypeList(response.data.data)
        });
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
        if (categoryLevel != "") {
            setCategoryLevel(node.treeLevel)
            if (categoryLevel.split('-').length == node.treeLevel.split('-').length) {
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

                let id = "report-location-tree-view-id-" + node.id;
                const getId = document.getElementById(id);
                if (getId.className == "d-flex justify-content-between tree-nav__item_demo tree-nav__item-title report-location-tree-selected") {
                    getId.classList.remove('report-location-tree-selected');
                } else {
                    getId.classList.add('report-location-tree-selected');
                    setNationalLocationChecked(false)
                }
            } else {
                nodes.length = 0;
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
                let id = "report-location-tree-view-id-" + node.id;
                const getId = document.getElementById(id);
                const getElements = document.getElementsByClassName('tree-nav__item_demo tree-nav__item-title');
                for (var i = 0; i < getElements.length; i++) {
                    getElements[i].classList.remove('report-location-tree-selected');
                }
                if (getId) {
                    getId.classList.add('report-location-tree-selected');
                    setNationalLocationChecked(false)
                }
            }
            //getLocationIds(node);

        } else {
            //getLocationIds(node);
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
            setCategoryLevel(node.treeLevel)
            let id = "report-location-tree-view-id-" + node.id;
            const getId = document.getElementById(id);
            if (getId.className == "d-flex justify-content-between tree-nav__item_demo tree-nav__item-title report-location-tree-selected") {
                getId.classList.remove('report-location-tree-selected');
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

    const handleAllActive = () => {
            let checked = document.getElementById('allId').checked;
            setAllChecked(checked);
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

    const getSalesOfficerListByLocation = (locationId, companyId) => {
        const URL = `${process.env.REACT_APP_API_URL}/auth/get-sales-officer-location/${locationId}/${companyId}`;
        axios.get(URL).then(response => {
            console.log(response.data.data)
            if (response.data.data != undefined) {
                console.log(response.data.data)
                setSalesOfficer(response.data.data);
            }
        }).catch(err => {
            showError("Cannot get Company data.");
        });
    }

    const getAllDistributorList = (userLoginId, locationId, companyId) => {
        const URL = `${process.env.REACT_APP_API_URL}/api/distributor/distributorList/${userLoginId}/${locationId}/${companyId}`;//API call from backend
        axios.get(URL).then(response => {//get data in response
            if (response.data.data != undefined && response.data.data.length != 0) {
                console.log('hi' + response.data.data)
                setDistributors(response.data.data);
            }
            else{
                setDistributors([]);
                setDistributorValue('');
            }
        }).catch(err => {
            showError(intl.formatMessage({ id: "COMMON.ERROR_LOCATION_TREE" }));
        });
    }

    const handleChangeDistributor = (e, dis) => {
        if (dis.distributorId !== null || dis.distributorId !== "") {
            setInputs({ ...inputs, distributorId: parseInt(dis.distributorId) });
        }
    }

    const handleChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;
        if ('locationTypeId' === name) {
            setLocationTypeData(value)
        }
        setInputs(values => ({ ...values, [name]: value }))
    }

    const validate = () => {
        let dates = getParamsDate();
        let startDate = dates.startDate;
        let endDate = dates.endDate;

        if (nationalLocationChecked === false) {
            if (locationIds.length === 0) {
                showError('Please Select Location.');
                return false;
            }
        }
        if ((startDate && moment(startDate).isValid()) && (endDate && moment(startDate).isValid())) {
            if (endDate < startDate) {
                showError(`End ${dateType} should be greater than Start ${dateType}.`);
                return false;
            }

        }
        if (reportType === '') {
            showError('Please Select Report Type.');
            return false;
        }
        if (reportFormat === '' && reportType === 'DETAILS') {
            showError('Please Select Report Formate.');
            return false;
        }
        return true;
    }
    const previewValidate = () => {
        let dates = getParamsDate();
        let startDate = dates.startDate;
        let endDate = dates.endDate;

        if (nationalLocationChecked === false) {
            if (locationIds.length === 0) {
                showError('Please Select Location.');
                return false;
            }
        }
        if ((startDate && moment(startDate).isValid()) && (endDate && moment(startDate).isValid()) ) {
            if (endDate < startDate) {
                showError(`End ${dateType} should be greater than Start ${dateType}.`);
                return false;
            }

        } 
        if (reportType === '') {
            showError('Please Select Report Type.');
            return false;
        }
        return true;
    }
    const download = () => {
        if (!validate()) {
            return false;
        }
        let soList = [];
        salesOfficerList.map(s => soList.push(s.id));
        soList.sort(function (a, b) {
            return a - b
        });
        let distributorIds = [];
        distributorList.map(d => distributorIds.push(d.id));
        distributorIds.sort(function (a, b) {
            return a - b
        });

        let dates = getParamsDate();
        let startDate = dates.startDate;
        let endDate = dates.endDate;

        let queryParams = '?nationalLocationChecked=' + nationalLocationChecked;
        queryParams += '&locationTypeLevel=' + (nodes.length > 0 ? nodes[0].locationTypeLevel : 0);
        queryParams += '&reportFormat=' + reportFormat;
        queryParams += '&companyId=' + selectedCompany;
        queryParams += '&locationIds=' + locationIds;
        queryParams += '&soIds=' + soList.join(',');
        queryParams += '&disIds=' + distributorIds.join(',');
        queryParams += '&startDate=' + startDate;
        queryParams += '&endDate=' + endDate;
        queryParams += '&reportType=' + reportType;
        queryParams += '&isWithSum=' + withSum;
        queryParams += '&dateType=' + dateType;
        queryParams += '&allChecked=' + allChecked;
        queryParams += '&locationTypeData=' + locationTypeData;
        const URL = `${process.env.REACT_APP_API_URL}/api/report/performance-report` + queryParams;
        axios.get(URL, { responseType: 'blob' }).then(response => {
            if (reportFormat === "PDF") {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', "PerformanceReport.pdf");
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', "PerformanceReport.xlsx");
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }).catch(err => {
            showError();
        });
    }

    const preview = () => {
        if (!previewValidate()) {
            return false;
        }
        let soList = [];
        salesOfficerList.map(s => soList.push(s.id));
        soList.sort(function (a, b) {
            return a - b
        });
        let distributorIds = [];
        distributorList.map(d => distributorIds.push(d.id));
        distributorIds.sort(function (a, b) {
            return a - b
        });

        let dates = getParamsDate();
        let startDate = dates.startDate;
        let endDate = dates.endDate;

        let queryParams = '?nationalLocationChecked=' + nationalLocationChecked;
        queryParams += '&locationTypeLevel=' + (nodes.length > 0 ? nodes[0].locationTypeLevel : 0);
        queryParams += '&reportFormat=' + "PDF";
        queryParams += '&companyId=' + selectedCompany;
        queryParams += '&locationIds=' + locationIds;
        queryParams += '&soIds=' + soList.join(',');
        queryParams += '&disIds=' + distributorIds.join(',');
        queryParams += '&startDate=' + startDate;
        queryParams += '&endDate=' + endDate;
        queryParams += '&reportType=' + reportType;
        queryParams += '&isWithSum=' + withSum;
        queryParams += '&dateType=' + dateType;
        queryParams += '&allChecked=' + allChecked;
        queryParams += '&locationTypeData=' + locationTypeData;
        const dataURL = `${process.env.REACT_APP_API_URL}/api/report/performance-report` + queryParams;
        axios.get(dataURL, { responseType: 'blob' }).then(response => {
            const file = new Blob([response.data], { type: "application/pdf" });
            const fileURL = URL.createObjectURL(file);
            const iframe = document.querySelector("iframe");
            if (iframe?.src) iframe.src = fileURL;
            document.getElementById('reportShowIframe').style.display = "inline-block";
        }).catch(err => {
            showError();
        });
    }

    const previewSalesAndCollection = () => {
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

    const getReportData = () => {   
        if(!validate()){
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
                <MisReportBreadCrum menuTitle="Performance Report"/>
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
                            <div className='col-xl-3' style={{ borderRight: "1px solid #F2F2F2" }}>
                                <div style={{ borderBottom: "1px solid #F2F2F2" }}>
                                    <label>
                                        <img src={toAbsoluteUrl("/images/loc3.png")}
                                            style={{ width: "20px", height: "20px", textAlign: "center" }}
                                            alt='Company Picture' />
                                        <strong style={{ marginLeft: "10px", color: "#828282" }}>{intl.formatMessage({ id: "COMMON.LOCATION_ALL" })}</strong>
                                    </label>
                                </div>
                               {/* NATIONAL BUTTON */}
                               {isNationalShow &&  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <FormControlLabel
                                        control={<IOSSwitch id="nationalId"
                                            checked={nationalLocationChecked}
                                            onClick={handleActive}
                                        />}
                                        label="National"
                                    />
                                    {nationalLocationChecked === false ? true
                                    : 
                                        <div style={{ margin: '1px' }}>
                                            <select id="locationTypeId" className='form-control' name="locationTypeId" 
                                           // value={locationTypeData.locationTypeId || ""} 
                                              value={locationTypeData || ""} 

                                            onChange={handleChange}
                                            >
                                                <option value="">Location Type</option>
                                                {
                                                    locationTypeList.map((locationTypeList) => (
                                                        <option key={locationTypeList.locationName} value={locationTypeList.locationName}>{locationTypeList.locationName}</option>
                                                    ))}
                                            </select>
                                        </div>
                                    }
                                </div>}
                                {/* ALL BUTTON */}
                                <div>
                                    <FormControlLabel  disabled ={disabledChecked}
                                            control={<IOSSwitch id="allId"
                                                checked={allChecked}
                                                onClick={handleAllActive}
                                            />}
                                            label="All"
                                    />
                                        {/* disabled={disabledChecked} */}
                                </div>
                                {/* LOCATION TREE */}
                                <ReportLocationTreeView tree={locationTree} selectLocationTreeNode={selectLocationTreeNode} />
                            </div>
                            {/* RIGHT SIDE LIST ROW */}
                            <div className='col-xl-9'>

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
                                    setWithSum={setWithSum}
                                />

                                {/* REPORT FORMATE COMPONENT */}

                                {reportType === 'SUMMARY' ? ''
                                : 
                                <CommonReportFormat
                                    setReportFormat={setReportFormat}
                                />
                                }


                                <Button className="float-right mt-5" id="gotItBtn" variant="contained"
                                    color="primary"
                                    onClick={download}
                                >
                                    Download
                                </Button>
                                <div className="float-right">
                                    <Button className="mt-5 mr-5" id="gotItBtn" variant="contained" color="primary"
                                        onClick={preview}>Preview
                                    </Button>
                                </div>
                            </div> 
                            </div>
                            <div className='mt-5'>
                            <iframe src="" className='w-100' id="reportShowIframe" height="500px" />
                        </div>
                    </CardBody>
                </Card>
            </div>
        </>
    );
}