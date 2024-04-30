import React, { useEffect, useMemo, useState } from 'react';
import Popper from '@material-ui/core/Popper';
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../../_metronic/_helpers";
import { SalesList } from "../table/SalesList";
import { Card, CardBody } from "../../../../../../_metronic/_partials/controls";
import { useHistory } from 'react-router-dom';
import LocationTreeView from '../../../CommonComponents/LocationTreeView';
import { showError } from '../../../../../pages/Alert';
import axios from "axios";
import { useIntl } from "react-intl";
import { shallowEqual, useSelector } from "react-redux";
import SalesTabsHeader from "../../common/SalesTabsHeader";
import { BreadCrum } from "../../common/BreadCrum";
import * as XLSX from 'xlsx';
import { amountFormatterWithoutCurrency } from '../../../../Util';

export function SalesData() {
    const selectedCompany = useSelector((state) => state.auth.company, shallowEqual);
    const userLoginId = useSelector((state) => state.auth.user.userId, shallowEqual);
    const intl = useIntl();
    const [locationTree, setLocationTree] = useState([]);
    const [accountingYearId, setAccountingYearId] = useState('');
    const [locationId, setLocationId] = useState('');
    const [childCategoryList, setChildCategoryList] = useState([]);
    const [productCategoryId, setProductCategoryId] = useState('');
    const [allAccountingYear, setAllAccountingYear] = useState([]);
    const [categoryName, setCategoryName] = useState('All');

    const searchParams = useMemo(() => {
        return {
            userLoginId: userLoginId, companyId: selectedCompany, accountingYearId: accountingYearId
            , locationId: locationId, productCategoryId: productCategoryId
        }
    }, [userLoginId, selectedCompany, accountingYearId, locationId, productCategoryId]);

    const [selectedLocation, setSelectedLocation] = useState({});
    const [total, setTotal] = useState({ totalQuantity: 0, totlaSalesAmount: 0 });
    const [salesDataList, setSalesDataList] = useState([]);

    let history = useHistory();
    const [anchorEl, setAnchorEl] = React.useState(null);
    let [singleAll, setSingleAll] = React.useState([]);

    const handleClick = (event) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    };
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popper' : undefined;

    useEffect(() => {
        document.getElementById('pills-sales-data-tab').classList.add('active')
        getLocationTreeList(searchParams);
        getAllChildCategoryOfACompany()
        getAccountingYear(selectedCompany);
    }, [userLoginId, selectedCompany]);

    useEffect(() => {
        getSalesDataList(searchParams);
    }, [searchParams]);

    const handleExport = () => {
        const data = [...singleAll]
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, "SalesOrderData.xlsx");
    }

    const getSalesDataList = (params) => {
        let queryString = '?';
        queryString += 'userLoginId=' + params.userLoginId;
        queryString += '&companyId=' + params.companyId;
        queryString += '&accountingYearId=' + params.accountingYearId;
        queryString += '&productCategoryId=' + params.productCategoryId;
        queryString += params.locationId ? '&locationId=' + params.locationId : '';
        const URL = `${process.env.REACT_APP_API_URL}/api/sales-data/location-wise` + queryString;
        if (params.companyId) {
        axios.get(URL).then(response => {
            const dataList = response.data.data.salesData;
            getTotal(dataList);
            setSalesDataList(dataList);
        }).catch(err => {
            showError("Cannot get Sales Data.");
        });}
    }

    const getLocationTreeList = (params) => {
        const URL = `${process.env.REACT_APP_API_URL}/api/location-tree/locationTree/${params.userLoginId}/${params.companyId}`;
        if (params.companyId) { 
        axios.get(URL).then(response => {
            const locationTree = response.data.data;
            setLocationTree(locationTree);
        }).catch(err => {
            showError("Cannot get Location Tree data.");
        });}
    }

    const getAllChildCategoryOfACompany = () => {
        let queryString = "?";
        queryString += "companyId=" + searchParams.companyId;

        const URL = `${process.env.REACT_APP_API_URL}/api/product-category/child` + queryString;
        if (searchParams.companyId) {
        axios.get(URL).then(response => {
            setChildCategoryList(response.data.data);
        }).catch(err => {

        });
    }
    }

    const handleCategoryChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;
        var index = event.nativeEvent.target.selectedIndex;
        setProductCategoryId(value);
        if (value !== "") {
            setCategoryName(event.nativeEvent.target[index].text);
        } else {
            setCategoryName("All");
        }
    }

    const getAccountingYear = (companyId) => {
        const URL = `${process.env.REACT_APP_API_URL}/api/accounting-year/companyWise/${companyId}`;
        if (companyId) {
        axios.get(URL).then(response => {
            setAllAccountingYear(response.data.data);
        }).catch(err => {
            //showError(intl.formatMessage({ id: "COMMON.ERROR_STATUS" }));
        });}
    }

    const setAccountingYearData = (event) => {

        setAccountingYearId(event.target.value)

    }

    const getTotal = (dataList) => {
        let totalQuantity = 0;
        let totlaSalesAmount = 0;
        dataList.map(sale => {
            totalQuantity += sale.quantity;
            totlaSalesAmount += sale.sale_amount;
        });
        setTotal({ totalQuantity: totalQuantity, totlaSalesAmount: totlaSalesAmount })
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
            setSelectedLocation(node);
            setLocationId(node.id);
        }

    }
    const handleKeyPressChange = (e) => {
        if (e.keyCode === 32) {
            getSalesDataList(searchParams);
        } else if (e.keyCode === 8) {
            getSalesDataList(searchParams);
        }
    }
    const handleSearchChange = (event) => {
        let value = event.target.value;
        getSearchList(value);
    }
    const getSearchList = (searchText) => {
        let searchTextValue = searchText.toLowerCase();
        let tp = [];
        for (let i = 0; i < salesDataList.length; i++) {
            let productName = salesDataList[i].productName.toLowerCase();
            let productSku = salesDataList[i].productSku.toLowerCase();
            let productCategory = salesDataList[i].productCategory.toLowerCase();
            if (productName.includes(searchTextValue)
                || productSku.includes(searchTextValue)
                || productCategory.includes(searchTextValue)
            ) {
                tp.push(salesDataList[i]);
            }
        }
        setSalesDataList(tp);
    }

    return (
        <>
            <div>
                {/* BREAD CRUM ROW */}
                <BreadCrum />
                {/* TODAY SALE ROW */}
                <SalesTabsHeader />
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
                                {/* TREE */}
                                <LocationTreeView tree={locationTree} selectLocationTreeNode={selectLocationTreeNode} />
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
                                                onKeyUp={(e) => handleKeyPressChange(e)}
                                                onChange={handleSearchChange}
                                            />
                                        </form>
                                    </div>
                                    <div className="col-xl-9 d-flex flex-wrap justify-content-end">
                                        <div className='mr-3'>
                                            <div className="row">
                                                <div className="col-3 mt-3">
                                                    <label className="dark-gray-color">Categories</label>
                                                </div>
                                                <div className="col-9">
                                                    <select className="form-control border-0" name="categoryName" onChange={handleCategoryChange}>
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
                                        <div className="mr-3">
                                            <div className="row">
                                                <div className="col-3 mt-3">
                                                    <label className="dark-gray-color">Timeline</label>
                                                </div>
                                                <div className="col-9">
                                                    <select className="border-0 form-control" onChange={setAccountingYearData}>
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
                                        <div>
                                            <button className="btn"
                                                style={{ background: "rgba(130, 130, 130, 0.05)", color: "#828282" }}>
                                                <i className="bi bi-funnel"></i>&nbsp;{intl.formatMessage({ id: "COMMON.FILTER" })}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                {/* ALL SUMMARY ROW */}
                                <div className='row ml-2'>
                                    <div className='col-xl-3 sales-data-chip'
                                        style={{ background: "#F9F9F9", borderRadius: "5px 0px 0px 5px" }}>
                                        <div className="d-flex">
                                            <div className="dark-gray-color">
                                                <i className="bi bi-geo-alt"></i>
                                            </div>
                                            <div className="ml-2">
                                                <span>
                                                    <span className="dark-gray-color"
                                                        style={{ fontWeight: "500" }}>{intl.formatMessage({ id: "COMMON.AREA" })}</span>
                                                    <p><strong>{selectedLocation.locationName ? selectedLocation.locationName : 'All'}</strong></p>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col-xl-3 sales-data-chip' style={{ background: "#F9F9F9" }}>
                                        <div className="d-flex">
                                            <div className="dark-gray-color">
                                                <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/box.svg")}
                                                    width="15px" height="15px" />
                                            </div>
                                            <div className="ml-2">
                                                <span>
                                                    <span className="dark-gray-color"
                                                        style={{ fontWeight: "500" }}>{categoryName + " (QTY)"}</span>
                                                    <p><strong>{total.totalQuantity}</strong></p>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col-xl-3 sales-data-chip'
                                        style={{ background: "#F9F9F9", borderRadius: "0px 5px 5px 0px" }}>
                                        <div className="d-flex">
                                            <div className="dark-gray-color">
                                                <img src={toAbsoluteUrl("/images/LineChart.png")} width="24px"
                                                    height="24px" />
                                            </div>
                                            <div className="ml-2">
                                                <span>
                                                    <span className="dark-gray-color"
                                                        style={{ fontWeight: "500" }}>{intl.formatMessage({ id: "SALES_DATA.TOTAL_SALE_AMOUNT" })}</span>
                                                    <p><strong>{amountFormatterWithoutCurrency(total.totlaSalesAmount)}</strong></p>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col-xl-3 sales-data-chip' style={{ background: "#F9F9F9" }}>
                                        <button className="btn float-right export-btn" onClick={handleExport}>
                                            <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/up-arrow.svg")}
                                                width="15px" height="15px" />
                                        </button>
                                    </div>
                                </div>
                                {/* TABLE ROW */}
                                <div className='mt-5'>
                                    <SalesList setSingleAll={setSingleAll} singleAll={singleAll} salesDataList={salesDataList} />
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </>
    );
}