import React, {useEffect, useState} from 'react';
import {toAbsoluteUrl} from "../../../../../_metronic/_helpers";
import {Card, CardBody} from "../../../../../_metronic/_partials/controls";
import {showError} from '../../../../pages/Alert';
import axios from "axios";
import {useIntl} from "react-intl";
import {shallowEqual, useSelector} from "react-redux";
import {Button} from '@material-ui/core';
import SalesOfficeList from "../../../Common/SalesOfficeList"
import DistributorList from "../../../Common/DistributorList"
import CommonReportType from "../../../Common/CommonReportType"
import ReportProductCategoryTreeView from '../../../Common/ReportProductCategoryTreeView';
import MisReportBreadCrum from '../MisReportBreadCrum';
import CommonDateComponent from '../../../Common/CommonDateComponent';
import ReportLocationTreeView from '../../../Common/ReportLocationTreeView';
import {FormControlLabel} from '@material-ui/core';
import IOSSwitch from '../../../../pages/IOSSwitch';
import moment from "moment";
import CommonReportFormat from "../../../Common/CommonReportFormat";

export default function SalesReturnReport() {
    const intl = useIntl();
    const selectedCompany = useSelector((state) => state.auth.company, shallowEqual);
    const userLoginId = useSelector((state) => state.auth.user.userId, shallowEqual);
    const [locationTree, setLocationTree] = useState([]);
    const [locationIds, setLocationIds] = useState([]);
    const [nodes, setNodes] = useState([]);
    const [categoryLevel, setCategoryLevel] = useState("");
    const [reportType, setReportType] = useState("");
    const [withSum, setWithSum] = useState(false);

    // for date component
    const [inputsDate, setInputsDate] = useState({});
    const [dateType, setDateType] = useState("Date");

    // for sales officer autocomplete
    const [salesOfficerList, setSalesOfficerList] = useState([]);
    const [salesOfficerIds, setSalesOfficerIds] = useState([]);
    const [salesOfficer, setSalesOfficer] = useState([]);
    // for distributor autocomplete
    const [distributorList, setDistributorList] = useState([]);
    const [distributors, setDistributors] = useState([]);

    const [nationalLocationChecked, setNationalLocationChecked] = useState(false);

    // for product category tree
    const [productCategoryTree, setProductCategoryTree] = useState([]);
    const [productSelect, setProductSelect] = useState([]);
    const [productCategoryIds, setProductCategoryIds] = useState([]);
    const [productCategoryNodes, setProductCategoryNodes] = useState([]);
    const [reportFormat, setReportFormat] = useState("PDF");
    // ALL BUTTON STATE
    const [allChecked, setAllChecked] = useState(false);
    const [disabledChecked, setDisabledChecked] = useState(false);

    const [locationTypeList, setLocationTypeList] = useState([]);
    const [locationTypeData, setLocationTypeData] = useState("");  
    const [isNationalShow, setIsNationalShow] = useState(false);

    useEffect(() => {
        document.getElementById('reportShowIframe').style.display = "none";
    }, [userLoginId, selectedCompany]);

    useEffect(() => {
        if (reportType === 'SUMMARY') {
            setReportFormat('PDF');
        }else {
            setReportFormat('')
        }
        
        if(reportType === 'DETAILS'){
            setDisabledChecked(true)
            setAllChecked(false)
           } else {
            setDisabledChecked(false)
           }
    
    }, [reportType]);

    useEffect(() => {
        getLocationTreeList(selectedCompany)
        getProductCategoryTreeList(selectedCompany);
    }, [selectedCompany]);

    useEffect(() => {
        nodes.map(node => getLocationIds(node))
    }, [nodes]);

    useEffect(() => {
        getSalesOfficerIds(salesOfficer, salesOfficerList)
    }, [salesOfficer, salesOfficerList]);

    useEffect(() => {
        productCategoryNodes.map(node => {
            getProductCategoryIds(node)
        })
    }, [productCategoryNodes]);

    useEffect(() => {
        if(nationalLocationChecked === false){
            setLocationTypeData('')
        }
    }, [nationalLocationChecked]);

    useEffect(() => {
        getLocationTypeList()
    }, []);

    const getLocationTypeList = () => {
        const URL = `${process.env.REACT_APP_API_URL}/api/location-type/getAllLocationType/${selectedCompany}`;
        axios.get(URL).then(response => {
            setLocationTypeList(response.data.data)
        });
    }


    const handleChange = (event) => {
        console.log(event.target.value);
        let name = event.target.name;
        let value = event.target.value;
        setLocationTypeData(value);
    
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

    const findTreeNode = (node, targetNode, productList) => {

        if (node.treeLevel === targetNode.treeLevel) {
            node.productList = productList;
            return;
        }
        node.children.map(obj => {
            findTreeNode(obj, targetNode, productList)
        });
    }


    const getProductCategoryTreeList = (companyId) => {
        const URL = `${process.env.REACT_APP_API_URL}/api/product-category/list-info/` + companyId;
        if (companyId) {
        axios.get(URL).then(response => {
            setProductCategoryTree(response.data.data.childProductCategoryDtoList);
        }).catch(err => {
            showError("Can not get product category tree data.");
        });}
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
                queryString += '&companyId=' + selectedCompany;
                queryString += '&productCategoryId=' + node.id;
                const URL = `${process.env.REACT_APP_API_URL}/api/product/get-product-category-wise-product/` + queryString;
                axios.get(URL).then(response => {
                    let productList = response.data.data
                    let temp = [...productCategoryTree];
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
            showError('Please Select Report Format.');
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
        let productIds = [];
        productSelect.map(d => productIds.push(d.id));
        productIds.sort(function (a, b) {
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
        queryParams += '&productCategoryIds=' + productCategoryIds.join(',');
        queryParams += '&categoryTypeLevel=' + (productCategoryNodes.length > 0 ? productCategoryNodes[0].treeLevel.split('-').length : 0);
        queryParams += '&prodtIds=' + productIds.join(',');
        queryParams += '&soIds=' + soList.join(',');
        queryParams += '&disIds=' + distributorIds.join(',');
        queryParams += '&startDate=' + startDate;
        queryParams += '&endDate=' + endDate;
        queryParams += '&reportType=' + reportType;
        queryParams += '&isWithSum=' + withSum;
        queryParams += '&dateType=' + dateType;
        queryParams += '&allChecked=' + allChecked;
        queryParams += '&locationTypeData=' + locationTypeData;
        const data = `${process.env.REACT_APP_API_URL}/api/report/sales-return` + queryParams;
        axios.get(data, {responseType: 'blob'}).then(response => {
            const file = new Blob([response.data], { type: "application/pdf" });
            const fileURL = URL.createObjectURL(file);
            const iframe = document.querySelector("iframe");
            if (iframe?.src) iframe.src = fileURL;
            document.getElementById('reportShowIframe').style.display = "inline-block";
        }).catch(err => {
            showError('Can not Preview Report.');
        });
    }

    const download = () => {
        //helpful console for all data track.
        // console.log("locationIds====", locationIds);
        // console.log("nodes====", nodes);
        // console.log("inputsDate====", inputsDate);
        // console.log("dateType====", dateType);
        // console.log("nationalLocationChecked====", nationalLocationChecked);
        // console.log("nodes====", nodes.length > 0 ? nodes[0].locationTypeLevel : 0);
        // console.log("salesOfficerList====", salesOfficerList);
        // console.log("distributorList====", distributorList);
        // console.log("productSelect====", productSelect);
        // console.log("productCategoryIds====", productCategoryIds.join(','));
        // console.log("productCategoryNodes====", productCategoryNodes);

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
        let productIds = [];
        productSelect.map(d => productIds.push(d.id));
        productIds.sort(function (a, b) {
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
        queryParams += '&productCategoryIds=' + productCategoryIds.join(',');
        queryParams += '&categoryTypeLevel=' + (productCategoryNodes.length > 0 ? productCategoryNodes[0].treeLevel.split('-').length : 0);
        queryParams += '&prodtIds=' + productIds.join(',');
        queryParams += '&soIds=' + soList.join(',');
        queryParams += '&disIds=' + distributorIds.join(',');
        queryParams += '&startDate=' + startDate;
        queryParams += '&endDate=' + endDate;
        queryParams += '&reportType=' + reportType;
        queryParams += '&isWithSum=' + withSum;
        queryParams += '&dateType=' + dateType;
        queryParams += '&allChecked=' + allChecked;
        queryParams += '&locationTypeData=' + locationTypeData;
        const data = `${process.env.REACT_APP_API_URL}/api/report/sales-return` + queryParams;
        axios.get(data, {responseType: 'blob'}).then(response => {
            if (reportFormat === "PDF") {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', "SalesReturn.pdf");
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', "SalesReturn.xlsx");
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }).catch(err => {
            showError('Can not download Report.');
        });
    }

    return (
        <>
            <div>
                <MisReportBreadCrum menuTitle="Sales Return Report"/>
            </div>
            <div>
                <Card>
                    <CardBody>
                        <div className='row'>
                            {/* LEFT SIDE TREE ROW */}
                            <div className='col-xl-3' style={{borderRight: "1px solid #F2F2F2"}}>
                                <div style={{borderBottom: "1px solid #F2F2F2"}}>
                                    <label>
                                        <img src={toAbsoluteUrl("/images/loc3.png")}
                                             style={{width: "20px", height: "20px", textAlign: "center"}}
                                             alt='Company Picture'/>
                                        <strong style={{
                                            marginLeft: "10px",
                                            color: "#828282"
                                        }}>{intl.formatMessage({id: "COMMON.LOCATION_ALL"})}</strong>
                                    </label>
                                </div>
                                {/* NATIONAL BUTTON */}
                                {isNationalShow && <div div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <div>
                                        <FormControlLabel
                                            control={<IOSSwitch id="nationalId"
                                                checked={nationalLocationChecked}
                                                onClick={handleActive}
                                            />}
                                            label="National"
                                        />
                                    </div>
                                    {nationalLocationChecked === false ? true
                                    : 
                                        <div style={{ margin: '1px' }}>
                                            <select id="locationTypeId" className='form-control' name="locationTypeId" 
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
                                     <FormControlLabel disabled ={disabledChecked}
                                        control={<IOSSwitch id="allId"
                                            checked={allChecked}
                                            onClick={handleAllActive}
                                        />}
                                        label="All"
                                    />
                                </div>
                                {/* TREE */}
                                <ReportLocationTreeView tree={locationTree}
                                                        selectLocationTreeNode={selectLocationTreeNode}/>
                            </div>

                            {/* PRODUCT CATEGORY TREE */}
                            <div className="col-lg-4" style={{borderRight: "1px solid #F2F2F2"}}>
                                <div style={{borderBottom: "1px solid #F2F2F2"}}>
                                    <label>
                                        <img src={toAbsoluteUrl("/images/loc3.png")}
                                             style={{width: "20px", height: "20px", textAlign: "center"}}
                                             alt='Company Picture'/>
                                        <strong style={{marginLeft: "10px", color: "#828282"}}>Product Category (All)</strong>
                                    </label>
                                </div>
                                <ReportProductCategoryTreeView
                                    tree={productCategoryTree}
                                    selectProductCategoryTreeNode={selectTreeNode}
                                    selectProduct={selectProductNode}
                                />
                            </div>

                            {/* RIGHT SIDE LIST ROW */}
                            <div className='col-xl-5'>

                                <SalesOfficeList companyIdPass={selectedCompany} locationsIdsPass={locationIds}
                                                 setSalesOfficerListPass={setSalesOfficerList}
                                                 salesOfficerListPass={salesOfficerList}
                                                 salesOfficer={salesOfficer} setSalesOfficer={setSalesOfficer}
                                                 nationalLocationChecked={nationalLocationChecked}
                                />

                                <DistributorList
                                    companyIdPass={selectedCompany} salesOfficerIdsPass={salesOfficerIds}
                                    setDistributorListPass={setDistributorList} distributorListPass={distributorList}
                                    distributors={distributors} setDistributors={setDistributors}
                                />

                                <div className='mt-5'>
                                    <CommonDateComponent inputs={inputsDate} setInputs={setInputsDate}
                                                         type={dateType} setType={setDateType}/>
                                </div>

                                <div className='mt-5'><CommonReportType setReportType={setReportType}
                                                                        setWithSum={setWithSum}/></div>

                                {reportType === 'SUMMARY'|| reportType === ''? ''
                                    :
                                    <CommonReportFormat
                                        setReportFormat={setReportFormat}
                                    />
                                }
                                <Button className="float-right mt-5" id="gotItBtn" variant="contained"
                                        color="primary" onClick={download}>Download
                                </Button>
                                <div className="float-right">
                                    <Button className="mt-5 mr-5" id="gotItBtn" variant="contained" color="primary"
                                            onClick={preview}>Preview
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className='mt-5'>''
                            <iframe src="" className='w-100' id="reportShowIframe" height="500px" title=""/>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </>
    );
}