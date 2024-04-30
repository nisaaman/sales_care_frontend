
import React, { useEffect, useState } from "react";
import ReportTabsHeader from "../../tabs/ReportsTabsHeader";
import { Card } from "react-bootstrap";
import Button from '@material-ui/core/Button';
import { CardBody } from "../../../../../_metronic/_partials/controls";
import ReportProductCategoryTreeView from '../../../Common/ReportProductCategoryTreeView';
import CommonDateComponent from '../../../Common/CommonDateComponent';
import { shallowEqual, useSelector } from 'react-redux';
import { showError, showSuccess } from "../../../../pages/Alert";
import axios from "axios";
import MisReportBreadCrum from "../MisReportBreadCrum";
import { toAbsoluteUrl } from "../../../../../_metronic/_helpers";
import ReportLocationTreeView from '../../../Common/ReportLocationTreeView';
import moment from "moment";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import IOSSwitch from '../../../../pages/IOSSwitch';
import SalesOfficeList from "../../../Common/SalesOfficeList"
import DistributorList from "../../../Common/DistributorList"
import DepotList from "../../../Common/DepotList"
import CommonReportType from "../../../Common/CommonReportType"
import CommonReportFormat from "../../../Common/CommonReportFormat"

const fields = {
    distributorId: "",
    storeId: "",
    depotId: "",
    companyId: "",
    startDate: "",
    endDate: "",
    startMonth: "",
    endMonth: "",
    fromYear: "",
    toYear: ""
}
export default function StockValuation() {
    const depotId = useSelector((state) => state.auth.company, shallowEqual);
    const userId = useSelector((state) => state.auth.user.userId, shallowEqual);
    const companyId = useSelector((state) => state.auth.company, shallowEqual);
    const [inputs, setInputs] = useState(fields);
    const [inputsDate, setInputsDate] = useState({});
    const [allDepot, setDepot] = useState([]);
    const [allStore, setStore] = useState([]);
    const [producCategoryTree, setProductCategoryTree] = useState([]);

    const [categoryLevel, setCategoryLevel] = useState("");

    const [locationTree, setLocationTree] = useState([]);
    const [allAccountingYear, setAllAccountingYear] = useState([]);

    const [salesOfficerList, setSalesOfficerList] = useState([]);
    const [distributorList, setDistributorList] = useState([]);
    const [depotList, setDepotList] = useState([]);

    const [reportType, setReportType] = useState("");
    const [reportFormat, setReportFormat] = useState("PDF");

    const [locationIds, setLocationIds] = useState([]);
    const [nodes, setNodes] = useState([]);

    const [dateType, setDateType] = useState("");
    const [salesOfficerIds, setSalesOfficerIds] = useState([]);
    const [salesOfficer, setSalesOfficer] = useState([]);

    const [fiscalYearId, setFiscalYearId] = useState();

    const [locationIdsWithLevel, setLocationIdsWithLevel] = useState([]);
    const [locationIdsWithKey, setLocationIdsWithKey] = useState([]);

    const [distributors, setDistributors] = useState([]);
    const [nationalLocationChecked, setNationalLocationChecked] = useState(false);

    const [depots, setDepots] = useState([]);
    const [depotShow, setDepotShow] = useState("ONLY_COMPANY");
    const [productSelect, setProductSelect] = useState([]);
    const [withSum, setWithSum] = useState(false);

    const [productCategoryIds, setProductCategoryIds] = useState([]);
    const [productCategoryNodes, setProductCategoryNodes] = useState([]);
    const [dateComponentDisable, setDateComponentDisable] = useState(false);

    useEffect(() => {
        document.getElementById('reportShowIframe').style.display = "none";
        getAllDepot(companyId);
        getStore();
        getProductCategoryTreeList(companyId);
        getAccountingYear(companyId)
        //getLocationTreeList(companyId)
    }, [companyId]);

    useEffect(() => {
    }, [producCategoryTree]);

    // useEffect(() => {
    //     getSalesOfficerIds(salesOfficer, salesOfficerList)
    // }, [salesOfficer, salesOfficerList]);


    // useEffect(() => {
    //     nodes.map(node => {
    //         getLocationIds(node)
    //         getLocationIdsWithLevel(node)
    //     })
    // }, [nodes]);

    // useEffect(() => {
    //     locationIdsWithKey.length = 0;
    //     let arr = [...locationIdsWithKey]
    //     locationIdsWithLevel.map(locationObj => {
    //         let index = arr.findIndex(obj => obj.key === locationObj.level);
    //         if (index === -1) {
    //             arr.push({
    //                 key: locationObj.level,
    //                 ids: [locationObj.id]
    //             });
    //         } else {
    //             arr[index].ids.push(locationObj.id);
    //         }
    //         setLocationIdsWithKey(arr)
    //     });
    // }, [locationIdsWithLevel]);

    useEffect(() => {
        productCategoryNodes.map(node => {
            getProductCategoryIds(node)
        })
    }, [productCategoryNodes]);

    useEffect(() => {
        setDateComponentDisable(fiscalYearId ? true : false);
    }, [fiscalYearId]);

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

    const getLocationIdsWithLevel = (node) => {
        let temp = [...locationIdsWithLevel]
        let index = temp.findIndex(obj => obj.id === node.id)

        if (index === -1) {
            setLocationIdsWithLevel(current => [...current, {
                "id": node.id,
                "level": node.locationTypeLevel
            }]);
        }

        node.children.map(nodeChild => {
            getLocationIdsWithLevel(nodeChild)
        })
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

    const getStore = () => {
        const URL = `${process.env.REACT_APP_API_URL}/api/store`;
        axios.get(URL).then(response => {
            setStore(response.data.data);
        });
    }

    const getAllDepot = (companyId) => {
        const URL = `${process.env.REACT_APP_API_URL}/api/depot/all-of-a-company/${companyId}`;
        axios.get(URL).then(response => {
            setDepot(response.data.data);
        });
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
            // if (locationIds.length === 0) {
            //     showError('Please Select Location.');
            //     return false;
            // }else 
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
            else if (reportFormat === '') {
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
        else if (reportFormat === '') {
            showError('Please Select Report Format.');
            return false;
        }
        return true;
    }
    const download = () => {

        if (!validate()) {
            return false;
        }
        let dptList = [];
        depotList.map(d => dptList.push(d.id));
        dptList.sort(function (a, b) {
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

        let queryParams = '?';
        queryParams += 'companyId=' + companyId;
        queryParams += '&startDate=' + startDate;
        queryParams += '&endDate=' + endDate;
        queryParams += fiscalYearId != null ? '&fiscalYearId=' + fiscalYearId : '';
        queryParams += productCategoryIds.length !== 0 ? '&categoryIds=' + productCategoryIds.join(',') : '';
        queryParams += depotList.length !== 0 ? '&depotIds=' + dptList.join(',') : '';
        queryParams += productSelect.length !== 0 ? '&productIds=' + productIds.join(',') : '';
        queryParams += '&reportType=' + reportType;
        queryParams += '&isWithSum=' + withSum;
        queryParams += '&reportFormat=' + reportFormat;
        queryParams += '&dateType=' + dateType;
        const URL = `${process.env.REACT_APP_API_URL}/api/reports/stock-valuation` + queryParams;
        axios.get(URL, { responseType: 'blob' }).then(response => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;

            let fileName = "";
            if (reportFormat === "PDF") {
                if ("SUMMARY" === reportType)
                    fileName = "StockValuationSummary.pdf";
                else
                    fileName = "StockValuationDetails.pdf"; 
            }
            else {
                if ("SUMMARY" === reportType)
                    fileName = "StockValuationSummary.xlsx";
                else
                    fileName = "StockValuationDetails.xlsx";
            }

            link.setAttribute('download', fileName);
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
            // if (locationIds.length === 0) {
            //     showError('Please Select Location.');
            //     return false;
            // }else 
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
        } else if ((startDate && moment(startDate).isValid()) && (endDate && moment(startDate).isValid())) {
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

        let dptList = [];
        depotList.map(d => dptList.push(d.id));
        dptList.sort(function (a, b) {
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

        let queryParams = '?';
        queryParams += 'companyId=' + companyId;
        queryParams += '&startDate=' + startDate;
        queryParams += '&endDate=' + endDate;
        queryParams += fiscalYearId != null ? '&fiscalYearId=' + fiscalYearId : '';
        queryParams += productCategoryIds.length !== 0 ? '&categoryIds=' + productCategoryIds.join(',') : '';
        queryParams += depotList.length !== 0 ? '&depotIds=' + dptList.join(',') : '';
        queryParams += productSelect.length !== 0 ? '&productIds=' + productIds.join(',') : '';
        queryParams += '&reportType=' + reportType;
        queryParams += '&isWithSum=' + withSum;
        queryParams += '&reportFormat=' + reportFormat;
        queryParams += '&dateType=' + dateType;

        const data = `${process.env.REACT_APP_API_URL}/api/reports/stock-valuation` + queryParams;
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

    const handlePaste = (e) => {
        e.preventDefault()
        return false;
    }

    const getLocationTreeList = (companyId) => {
        const URL = `${process.env.REACT_APP_API_URL}/api/location-tree/report-location-tree-info/${companyId}`;
        axios.get(URL).then(response => {
            const locationTree = response.data.data.locationAsTree;
            setLocationTree(locationTree);
        }).catch(err => {
            showError("Cannot get Location Tree data.");
        });
    }

    // const selectLocationTreeNode = (node) => {
    //     locationIds.length = 0;
    //     let temp = [...nodes]
    //     let index = temp.findIndex(data=> data.treeLevel==node.treeLevel)
    //     if(index > -1){
    //         temp.splice(index, 1);
    //         setNodes(temp)
    //     }else{
    //         temp.push(node)
    //         setNodes(temp)
    //     }
    //     if (categoryLevel != "") {
    //         setCategoryLevel(node.treeLevel)
    //         if (categoryLevel.split('-').length == node.treeLevel.split('-').length) {
    //             let id = "report-location-tree-view-id-" + node.id;
    //             const getId = document.getElementById(id);
    //             if (getId.className == "d-flex justify-content-between tree-nav__item_demo tree-nav__item-title report-location-tree-selected") {
    //                 getId.classList.remove('report-location-tree-selected');
    //                 salesOfficer.length = 0;
    //                 distributors.length = 0;
    //                 depots.length = 0 ;
    //             } else {
    //                 getId.classList.add('report-location-tree-selected');
    //                 setNationalLocationChecked(false)
    //             }
    //         } else {
    //             let id = "report-location-tree-view-id-" + node.id;
    //             const getId = document.getElementById(id);
    //             const getElements = document.getElementsByClassName('tree-nav__item_demo tree-nav__item-title');
    //             for (var i = 0; i < getElements.length; i++) {
    //                 getElements[i].classList.remove('report-location-tree-selected');
    //                 salesOfficer.length = 0;
    //                 distributors.length = 0;
    //                 depots.length = 0 ;
    //             }
    //             if (getId) {
    //                 getId.classList.add('report-location-tree-selected');
    //                 setNationalLocationChecked(false)
    //             }
    //         }

    //     } else {
    //         setCategoryLevel(node.treeLevel)
    //         let id = "report-location-tree-view-id-" + node.id;
    //         const getId = document.getElementById(id);
    //         if (getId.className == "d-flex justify-content-between tree-nav__item_demo tree-nav__item-title report-location-tree-selected") {
    //             getId.classList.remove('report-location-tree-selected');
    //             salesOfficer.length = 0;
    //             distributors.length = 0;
    //             depots.length = 0 ;
    //         } else {
    //             getId.classList.add('report-location-tree-selected');
    //             setNationalLocationChecked(false)
    //         }
    //     }
    // }


    // const getCompanySelect = (row) => {
    //   getAllDepot(depotId);
    // }

    const findTreeNode = (node, targetNode, productList) => {

        if (node.treeLevel === targetNode.treeLevel) {
            node.productList = productList;
            return;
        }
        node.children.map(obj => {
            findTreeNode(obj, targetNode, productList)
        });
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
            setProductSelect([])
            var cbs = document.getElementsByClassName("product-select");
            for (var i = 0; i < cbs.length; i++) {
                cbs[i].checked = false;
            }
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

    const handleActive = () => {
        salesOfficerList.length = 0;
        distributorList.length = 0;
        distributors.length = 0;
        depots.length = 0;
        depotList.length = 0;
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

    const selectFiscalYear = (e) => {
        setFiscalYearId(e.target.value != null ? e.target.value : null);
    }

    return (
        <>
            <div>
                <MisReportBreadCrum menuTitle="Stock Valuation" />
            </div>
            <div>
                <Card>
                    <CardBody>
                        <div className="row">
                            {/* LOCATION TREE */}
                            {/* <div className="col-lg-3" style={{ borderRight: "1px solid #F2F2F2" }}> */}
                            {/* <div style={{ borderBottom: "1px solid #F2F2F2" }}>
                                    <label>
                                        <img src={toAbsoluteUrl("/images/loc3.png")}
                                            style={{ width: "20px", height: "20px", textAlign: "center" }}
                                            alt='Company Picture' />
                                        <strong style={{ marginLeft: "10px", color: "#828282" }}>Location (All)</strong>
                                    </label>
                                </div>
                                <div>
                                    <FormControlLabel
                                            control={<IOSSwitch id="nationalId"
                                                checked={nationalLocationChecked}
                                                onClick={handleActive}
                                            />}
                                            label="National"
                                        />
                                </div> */}
                            {/* TREE */}
                            {/* <ReportLocationTreeView tree={locationTree} selectLocationTreeNode={selectLocationTreeNode} /> */}
                            {/* </div> */}
                            {/* PRODUCT CATEGORY TREE */}
                            <div className="col-lg-4" style={{ borderRight: "1px solid #F2F2F2" }}>
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
                            </div>
                            <div className="col-lg-5">
                                <span className="create-field-title">Stock Valuation Report</span>
                                {/* <div className='row'>
                                    <div className='form-group col-lg-8 first-level-top'>
                                        <label className='level-title'>Start Date<i style={{ color: "red" }}>*</i></label>
                                        <Flatpickr className="form-control" id="startDate" placeholder="dd-MM-yyyy"
                                            name='startDate'
                                            value={inputs.startDate ? moment(inputs.startDate, "YYYY-MM-DD").format("DD-MMM-YYYY") : ''}
                                            options={{ dateFormat: "Y" }}
                                            onChange={(value) => {
                                                setInputs({
                                                    ...inputs, "startDate": moment(new Date(value)).format("YYYY-MM-DD")
                                                })

                                            }}
                                        />
                                    </div>
                                </div>
                                

                                <div className='row'>
                                    <div className='form-group col-lg-8 first-level-top'>
                                        <label className='level-title'>End Date<i style={{ color: "red" }}>*</i></label>
                                        <Flatpickr className="form-control" id="endDate" placeholder="dd-MM-yyyy"
                                            name='endDate'
                                            value={inputs.endDate ? moment(inputs.endDate, "YYYY-MM-DD").format("DD-MMM-YYYY") : ''}
                                            options={{ dateFormat: "d-M-Y" }} required
                                            onChange={(value) => {
                                                setInputs({
                                                    ...inputs, "endDate": moment(new Date(value)).format("YYYY-MM-DD")
                                                })
                                            }}
                                        />
                                    </div>
                                </div> */}

                                {/* <SalesOfficeList
                                companyIdPass = {companyId}
                                locationsIdsPass = {locationIds}
                                setSalesOfficerListPass = {setSalesOfficerList}
                                salesOfficerListPass = {salesOfficerList}
                                salesOfficer = {salesOfficer}
                                setSalesOfficer= {setSalesOfficer}
                                nationalLocationChecked = {nationalLocationChecked}
                                />

                                <DistributorList 
                                companyIdPass = {companyId}
                                salesOfficerIdsPass = {salesOfficerIds}
                                setDistributorListPass = {setDistributorList}
                                distributorListPass = {distributorList}
                                distributors={distributors} setDistributors={setDistributors}
                                /> */}

                                <DepotList
                                    companyIdPass={companyId}
                                    setDepotListPass={setDepotList}
                                    depotListPass={depotList}
                                    salesOfficerIdsDepotPass={salesOfficerIds}
                                    depots={depots} setDepots={setDepots}
                                    depotShow={depotShow}
                                />

                                <div className="mt-5 first-level-top">
                                    <label className='level-title'><span className="mr-1">Timeline</span></label>
                                    <select className="form-control" name="fiscalYearId" onChange={(e) => selectFiscalYear(e)}>
                                        <option value="" selected>Select Fiscal Year</option>
                                        {allAccountingYear.map((accYear) => (
                                            <option key={accYear.fiscalYearName} value={accYear.id}>
                                                {accYear.fiscalYearName}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {dateComponentDisable ?
                                    <div className='mt-5' style={{ opacity: 0.5, pointerEvents: "none" }} disabled>
                                        <CommonDateComponent
                                            inputs={inputsDate}
                                            setInputs={setInputsDate}
                                            type={dateType}
                                            setType={setDateType}
                                        />
                                    </div>
                                    :
                                    <div className='mt-5'>
                                        <CommonDateComponent
                                            inputs={inputsDate}
                                            setInputs={setInputsDate}
                                            type={dateType}
                                            setType={setDateType}
                                        />
                                    </div>
                                }

                                <div className='mt-5'>
                                    <CommonReportType
                                        setReportType={setReportType} setWithSum={setWithSum}
                                    />
                                </div>
                                <div className='mt-5'>
                                    <CommonReportFormat
                                        setReportFormat={setReportFormat}
                                    />
                                </div>

                                <div>
                                    <Button className="float-right mt-5" id="gotItBtn" variant="contained"
                                        color="primary"
                                        onClick={download}
                                    >
                                        Download
                                    </Button>
                                    <div className="float-right">
                                        <Button className="mt-5 mr-5" id="gotItBtn" variant="contained" color="primary"
                                            onClick={preview}
                                        >
                                            Preview
                                        </Button>
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div className='mt-5'>
                            <iframe src="" className='w-100' id="reportShowIframe" height="500px" />
                        </div>
                    </CardBody>
                </Card>
            </div>
        </>);
}