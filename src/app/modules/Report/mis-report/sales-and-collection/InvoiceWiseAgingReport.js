import React, { useEffect, useState } from 'react';
import { toAbsoluteUrl } from "../../../../../_metronic/_helpers";
import { Card, CardBody } from "../../../../../_metronic/_partials/controls";
import { showError } from '../../../../pages/Alert';
import axios from "axios";
import { useIntl } from "react-intl";
import { shallowEqual, useSelector } from "react-redux";
import MisReportBreadCrum from '../MisReportBreadCrum';
import Button from '@material-ui/core/Button';
import moment from "moment";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import IOSSwitch from '../../../../pages/IOSSwitch';

// IMPORT COMMON COMPONENT FILE
import ReportLocationTreeView from '../../../Common/ReportLocationTreeView';
import ReportProductCategoryTreeView from '../../../Common/ReportProductCategoryTreeView';
import SalesOfficeList from "../../../Common/SalesOfficeList";
import DistributorList from "../../../Common/DistributorList";
import CommonDateComponent from '../../../Common/CommonDateComponent';
import CommonReportType from "../../../Common/CommonReportType";
import CommonReportFormat from "../../../Common/CommonReportFormat";
import CommonFilterType from '../../../Common/CommonFilterType';

export default function InvoiceWiseAgingReport() {

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

    const [producCategoryTree, setProductCategoryTree] = useState([]);
    const [productCategoryIds, setProductCategoryIds] = useState([]);
    const [productCategoryNodes, setProductCategoryNodes] = useState([]);
    const [productSelect, setProductSelect] = useState([]);

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

    const [withSum, setWithSum] = useState(false);
    const [allChecked, setAllChecked] = useState(false);
    const [disabledChecked, setDisabledChecked] = useState(false);


    const [locationTypeList, setLocationTypeList] = useState([]);
    const [locationTypeData, setLocationTypeData] = useState("");
    const [allFilterType, setAllFilterType] = useState("");
    const [isNationalShow, setIsNationalShow] = useState(false);

    useEffect(() => {
        document.getElementById('reportShowIframe').style.display = "none";
        getLocationTreeList(companyId);
        getProductCategoryTreeList(companyId);
    }, [companyId]);

    useEffect(() => {
        nodes.map(node => {
            getLocationIds(node)
        })
    }, [nodes]);

    useEffect(() => {
    }, [producCategoryTree]);

    useEffect(() => {
        getSalesOfficerIds(salesOfficer, salesOfficerList)
    }, [salesOfficer, salesOfficerList]);

    useEffect(() => {
        productCategoryNodes.map(node => {
            getProductCategoryIds(node)
        })
    }, [productCategoryNodes]);

    useEffect(() => {
        if (reportType === 'SUMMARY') {
            setReportFormat('PDF');
        }
        if(reportType === 'DETAILS'){
            setDisabledChecked(true)
            setAllChecked(false)
           } else {
            setDisabledChecked(false)
        }
    
    }, [reportType]);

    useEffect(() => {
        if(nationalLocationChecked === false){
            setLocationTypeData('')
        }
    }, [nationalLocationChecked]);

    useEffect(() => {
        getLocationTypeList()
    }, [companyId]);

    const getLocationTypeList = () => {
        const URL = `${process.env.REACT_APP_API_URL}/api/location-type/getAllLocationType/${companyId}`;
        axios.get(URL).then(response => {
            setLocationTypeList(response.data.data)
        });
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

    const getProductCategoryIds = (node) => {

        let temp = [...productCategoryIds]
        let index = temp.findIndex(id => id === node.id)
        if (index === -1) {
            setProductCategoryIds(current => [...current, node.id]);
        }
        node.children.map(nodeChild => {
            getProductCategoryIds(nodeChild)
        })
    }

    const selectLocationTreeNode = (node) => {
        locationIds.length = 0;

        let temp = [...nodes]
        let index = temp.findIndex(data => data.treeLevel == node.treeLevel)

        if (index > -1) {
            temp.splice(index, 1);
            setNodes(temp)
        } else if (nodes.length != 0 && nodes[0].treeLevel.split('-').length !== node.treeLevel.split('-').length) {
            nodes.length = 0;
            temp.length = 0;
            temp.push(node);
            setNodes(temp);
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
            setAllChecked(false);
        }
    }

    const handleAllActive = () => {
        let checked = document.getElementById('allId').checked;
        setAllChecked(checked);
        if(checked) {
            setNationalLocationChecked(false);
        }
    }

    const handleChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;
        setLocationTypeData(value);
    }

    const getProductCategoryTreeList = (params) => {
        const URL = `${process.env.REACT_APP_API_URL}/api/product-category/list-info/` + params;
        if (params) {
            axios.get(URL).then(response => {
                setProductCategoryTree(response.data.data.childProductCategoryDtoList);
            }).catch(err => {
                showError("Can not get product category tree data.");
            });
        }
    }

    const selectTreeNode = (node) => {
        productCategoryIds.length = 0;
        let temp = [...productCategoryNodes]
        let index = temp.findIndex(data => data.treeLevel == node.treeLevel)
        if (index > -1) {
            temp.splice(index, 1);
            setProductCategoryNodes(temp)
        }
        else if (productCategoryNodes.length != 0
            && productCategoryNodes[0].treeLevel.split('-').length !== node.treeLevel.split('-').length) {
            productCategoryNodes.length = 0;
            temp.length = 0;
            temp.push(node);
            setProductCategoryNodes(temp);
        }
        else {
            temp.push(node)
            setProductCategoryNodes(temp)
        }
        if (node.children.length == 0) {
            let id = "product-list-id-" + node.id;
            const getId = document.getElementById(id);
            if (getId.className == "product-list d-none") {
                getId.classList.remove('d-none');
                let queryString = '?';
                queryString += 'companyId=' + companyId;
                queryString += '&productCategoryId=' + node.id;
                const URL = `${process.env.REACT_APP_API_URL}/api/product/get-product-category-wise-product/` + queryString;
                axios.get(URL).then(response => {
                    let productList = response.data.data
                    let temp = [...producCategoryTree];
                    temp.map(obj => {
                        findTreeNode(obj, node, productList)
                    });
                    setProductCategoryTree(temp);
                }).catch(err => {
                    showError("Can not get product list.");
                });
            } else {
                getId.classList.add('d-none');
            }
        }
        if (categoryLevel != "") {
            setCategoryLevel(node.treeLevel)
            if (categoryLevel.split('-').length == node.treeLevel.split('-').length) {
                let id = "report-product-category-tree-id-" + node.id;
                const getId = document.getElementById(id);

                if (getId.className == "tree-nav__item_demo tree-nav__item-title report-product-category-tree-selected") {
                    getId.classList.remove('report-product-category-tree-selected');
                } else {
                    getId.classList.add('report-product-category-tree-selected');
                    if (node.children.length == 0) {
                        let id = "product-list-id-" + node.id;
                        const getId = document.getElementById(id);
                        getId.classList.remove('d-none')
                    }

                }

            } else {
                let id = "report-product-category-tree-id-" + node.id;
                const getId = document.getElementById(id);
                const getElements = document.getElementsByClassName('tree-nav__item_demo tree-nav__item-title');
                for (var i = 0; i < getElements.length; i++) {
                    getElements[i].classList.remove('report-product-category-tree-selected');
                }

                let productListId = "product-list-id-" + node.id;
                //const getProductListId = document.getElementById(productListId);
                const getProductListIdElements = document.getElementsByClassName('product-list');
                for (var i = 0; i < getProductListIdElements.length; i++) {
                    getProductListIdElements[i].classList.add('d-none');
                }

                if (getId) {
                    getId.classList.add('report-product-category-tree-selected');
                    if (node.children.length == 0) {
                        let id = "product-list-id-" + node.id;
                        const getId = document.getElementById(id);
                        getId.classList.remove('d-none')
                    }
                }
            }

        } else {
            setCategoryLevel(node.treeLevel)
            let id = "report-product-category-tree-id-" + node.id;
            const getId = document.getElementById(id);
            if (getId.className == "tree-nav__item_demo tree-nav__item-title report-product-category-tree-selected") {
                getId.classList.remove('report-product-category-tree-selected');
            } else {
                getId.classList.add('report-product-category-tree-selected');
                if (node.children.length == 0) {
                    let id = "product-list-id-" + node.id;
                    const getId = document.getElementById(id);
                    getId.classList.remove('d-none')
                }
            }
        }
    }

    const selectProductNode = (node) => {
        let temp = [...productSelect]
        let index = temp.findIndex(obj => obj.id == node.id)
        if (index > -1) {
            temp.splice(index, 1);
            setProductSelect(temp)
        } else {
            temp.push(node)
            setProductSelect(temp)
        }
    }
    const findTreeNode = (node, targetNode, productList) => {
        if (node.treeLevel === targetNode.treeLevel) {
            node.productList = productList;
            return;
        }
        node.children.map(obj => {
            findTreeNode(obj, targetNode, productList)
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

    const getParamsDate = () => {
        let startDate = '';
        let endDate = '';
        if (dateType === 'Date') {
            startDate = inputsDate.startDate === 'Invalid date' || inputsDate.startDate === undefined || inputsDate.startDate === null || inputsDate.startDate === '' ? '' : inputsDate.startDate;   // 2023-03-01  yyyy-mm-dd
            endDate = inputsDate.endDate === 'Invalid date' || inputsDate.endDate === undefined || inputsDate.endDate === null || inputsDate.endDate === '' ? '' : inputsDate.endDate;   // 2023-03-01  yyyy-mm-dd
        } else if (dateType === 'Month') {
            let startY = inputsDate.startMonth.getFullYear();
            let startM = inputsDate.startMonth.getMonth() + 1;
            startM = startM <=9 ? startM = '0'+startM : startM;
            let endY = inputsDate.endMonth.getFullYear();
            let endM = inputsDate.endMonth.getMonth() + 1;
            endM = endM <=9 ? endM = '0'+endM : endM;
            let lastDay = new Date(endY, endM, 0).getDate()
            startDate = inputsDate.startMonth === undefined || inputsDate.startMonth === null || inputsDate.startMonth === '' ? '' : (startY+'-'+startM + '-01');
            endDate = inputsDate.endMonth === undefined || inputsDate.endMonth === null || inputsDate.endMonth === '' ? '' : (endY+'-'+endM + '-'+lastDay);
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
            }
            else
                if ((startDate && moment(startDate).isValid()) && (endDate && moment(startDate).isValid())) {
                    if (endDate < startDate) {
                        showError(`End ${dateType} should be greater than Start ${dateType}.`);
                        return false;
                    }

                }
                else if (reportType === '') {
                    showError('Please Select Report Type.');
                    return false;
                }
                else if (reportFormat === '' && reportType === 'DETAILS') {
                    showError('Please Select Report Format.');
                    return false;
                }
        }
        else if ((startDate && moment(startDate).isValid()) && (endDate && moment(startDate).isValid())) {
            if (endDate < startDate) {
                showError(`End ${dateType} should be greater than Start ${dateType}.`);
                return false;
            }
        } else if (reportType === '') {
            showError('Please Select Report Type.');
            return false;
        }
        else if (reportFormat === '' && reportType === 'DETAILS') {
            showError('Please Select Report Format.');
            return false;
        }
        return true;
    }

    const download = () => {

        if (!validate()) {
            return false;
        }

        let productIds = [];
        productSelect.map(d => productIds.push(d.id));
        productIds.sort(function (a, b) {
            return a - b
        });
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

        let queryParams = '?';
        queryParams += 'companyId=' + companyId;
        queryParams += '&nationalLocationChecked=' + nationalLocationChecked;
        queryParams += '&locationTypeLevel=' + (nodes.length > 0 ? nodes[0].locationTypeLevel : 0);
        queryParams += '&locationIds=' + locationIds;
        queryParams += productCategoryIds.length !== 0 ? '&categoryIds=' + productCategoryIds.join(',') : '';
        queryParams += '&categoryTypeLevel=' + (productCategoryNodes.length > 0 ? productCategoryNodes[0].treeLevel.split('-').length : 0);
        queryParams += '&salesOfficerIds=' + soList.join(',');
        queryParams += '&distributorIds=' + distributorIds.join(',');
        queryParams += '&productIds=' + productIds.join(',');
        queryParams += '&startDate=' + startDate;
        queryParams += '&endDate=' + endDate;
        queryParams += '&reportType=' + reportType;
        queryParams += '&isWithSum=' + withSum;
        queryParams += '&reportFormat=' + reportFormat;
        queryParams += '&dateType=' + dateType;
        queryParams += '&allChecked=' + allChecked;
        queryParams += '&locationTypeData=' + locationTypeData;
        queryParams += '&allFilterType=' + allFilterType;
        
        const URL = `${process.env.REACT_APP_API_URL}/api/reports/invoice-wise-aging-report` + queryParams;
        axios.get(URL, { responseType: 'blob' }).then(response => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            if (reportFormat == "PDF") {
                link.setAttribute('download', "invoiceWiseAgingReport.pdf");
            }
            else {
                link.setAttribute('download', "invoiceWiseAgingReport.xlsx");
            }
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
            }
            else
                if ((startDate && moment(startDate).isValid()) && (endDate && moment(startDate).isValid())) {
                    if (endDate < startDate) {
                        showError(`End ${dateType} should be greater than Start ${dateType}.`);
                        return false;
                    }

                }
                else if (reportType === '') {
                    showError('Please Select Report Type.');
                    return false;
                }
        }
        else if ((startDate && moment(startDate).isValid()) && (endDate && moment(startDate).isValid())) {
            if (endDate < startDate) {
                showError(`End ${dateType} should be greater than Start ${dateType}.`);
                return false;
            }
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
        let productIds = [];
        productSelect.map(d => productIds.push(d.id));
        productIds.sort(function (a, b) {
            return a - b
        });
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

        let queryParams = '?';
        queryParams += 'companyId=' + companyId;
        queryParams += '&nationalLocationChecked=' + nationalLocationChecked;
        queryParams += '&locationTypeLevel=' + (nodes.length > 0 ? nodes[0].locationTypeLevel : 0);
        queryParams += '&locationIds=' + locationIds;
        queryParams += productCategoryIds.length !== 0 ? '&categoryIds=' + productCategoryIds.join(',') : '';
        queryParams += '&categoryTypeLevel=' + (productCategoryNodes.length > 0 ? productCategoryNodes[0].treeLevel.split('-').length : 0);
        queryParams += '&salesOfficerIds=' + soList.join(',');
        queryParams += '&distributorIds=' + distributorIds.join(',');
        queryParams += '&productIds=' + productIds.join(',');
        queryParams += '&startDate=' + startDate;
        queryParams += '&endDate=' + endDate;
        queryParams += '&reportType=' + reportType;
        queryParams += '&isWithSum=' + withSum;
        queryParams += '&reportFormat=' + reportFormat;
        queryParams += '&dateType=' + dateType;
        queryParams += '&allChecked=' + allChecked;
        queryParams += '&locationTypeData=' + locationTypeData;
        queryParams += '&allFilterType=' + allFilterType;

        const data = `${process.env.REACT_APP_API_URL}/api/reports/invoice-wise-aging-report` + queryParams;

        axios.get(data, { responseType: 'blob' }).then(response => {

            const file = new Blob([response.data], { type: "application/pdf" });
            const fileURL = URL.createObjectURL(file);
            const iframe = document.querySelector("iframe");
            if (iframe?.src) iframe.src = fileURL;
            document.getElementById('reportShowIframe').style.display = "inline-block";
        }).catch(err => {
            showError();
        });
    }


    return (
        <>
            <div>
                <MisReportBreadCrum menuTitle="Invoice Wise Aging Report" />
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
                                {isNationalShow && <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <div>
                                        <FormControlLabel
                                            control={<IOSSwitch id="nationalId"
                                                checked={nationalLocationChecked}
                                                onClick={handleActive}
                                            />}
                                            label="National"
                                        />
                                    </div>
                                    {allChecked === false && nationalLocationChecked === true ? 
                                    <div style={{ margin: '1px' }}>
                                        <select id="locationTypeId" className='form-control' name="locationTypeId"
                                            // value={locationTypeData.locationTypeId || ""} 
                                            value={locationTypeData || ""}
                                            onChange={handleChange}>
                                            <option value="">Location Type</option>
                                            {
                                                locationTypeList.map((locationTypeList) => (
                                                    <option key={locationTypeList.locationName} value={locationTypeList.locationName}>{locationTypeList.locationName}</option>
                                                ))}
                                        </select>
                                        </div>                                    
                                        :
                                        true 
                                    }
                                </div>}
                                   {/* ALL BUTTON */}
                                   <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    {/* disabled={disabledChecked} */}
                                    <div>
                                    <FormControlLabel  disabled ={disabledChecked}
                                            control={<IOSSwitch id="allId"
                                                checked={allChecked}
                                                onClick={handleAllActive}
                                            />}
                                            label="All"
                                    />
                                    </div>
                                    {allChecked === true && nationalLocationChecked === false ? 
                                    <CommonFilterType
                                        setAllFilterType={setAllFilterType} />
                                        : true
                                    }   
                                </div>

                                {/* LOCATION TREE */}
                                <ReportLocationTreeView tree={locationTree} selectLocationTreeNode={selectLocationTreeNode} />
                            </div>

                            {/* PRODUCT CATEGORY TREE */}
                            {/* <div className="col-lg-4" style={{ borderRight: "1px solid #F2F2F2" }}>
                                <div style={{ borderBottom: "1px solid #F2F2F2" }}>
                                    <label>
                                        <img src={toAbsoluteUrl("/images/loc3.png")}
                                            style={{ width: "20px", height: "20px", textAlign: "center" }}
                                            alt='Company Picture' />
                                        <strong style={{ marginLeft: "10px", color: "#828282" }}>Product Category (All)</strong>
                                    </label>
                                </div>
                                <ReportProductCategoryTreeView
                                    tree={producCategoryTree}
                                    selectProductCategoryTreeNode={selectTreeNode}
                                    selectProduct={selectProductNode}
                                />
                            </div> */}

                            {/* RIGHT SIDE LIST ROW */}
                            <div className='col-xl-5'>
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
                                    setReportType={setReportType} setWithSum={setWithSum}
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
                                        onClick={preview}>
                                        Preview
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