import React, { useState, useEffect } from 'react';
import Popper from '@material-ui/core/Popper';
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../../_metronic/_helpers";
import { TradeDiscountList } from '../table/TradeDiscountList';
import { Card, CardBody } from "../../../../../../_metronic/_partials/controls";
import { useHistory } from 'react-router-dom';
import { showError } from '../../../../../pages/Alert';
import axios from 'axios';
import ProductCategoryTreeView from '../../../CommonComponents/ProductCategoryTreeView';
import { shallowEqual, useSelector } from "react-redux";
import SalesTabsHeader from "../../common/SalesTabsHeader";
import { BreadCrum } from "../../common/BreadCrum";
import XLSX from 'sheetjs-style';
import { useIntl } from "react-intl";
import {dateFormatPattern} from "../../../../Util";
import moment from "moment";

export function TradeDiscount() {
    const selectedCompany = useSelector((state) => state.auth.company, shallowEqual);
    const intl = useIntl();
    const [producCategoryTree, setProductCategoryTree] = useState([]);
    const [selectedProductCategory, setSelectedProductCategory] = useState({});
    const [categoryIds, setCategoryIds] = useState([]);
    const [sessionData, setSessionData] = useState({ userLoginId: 1, companyId: selectedCompany, accountingYearId: '', categoryIds: [] });
    const [searchParams, setSearchParams] = useState(sessionData);
    const [tradeDiscountList, setTradeDiscountList] = useState([]);
    const [tradeDiscountListSearch, setTradeDiscountListSearch] = useState([]);
    const [breadCrumParentProductCategoryTypeName, setBreadCrumParentProductCategoryTypeName] = useState("");
    const [breadCrumParentProductCategoryName, setBreadCrumParentProductCategoryName] = useState("");
    let [singleAll, setSingleAll] = useState([]);
    const [allFiscalYear, setAllFiscalYear] = useState([]);
    const [rendered, setRendered] = useState(false);

    useEffect(() => {
        document.getElementById('pills-trade-discount-tab').classList.add('active')
        getProductCategoryTreeList(sessionData);
    }, []);

    useEffect(() => {
        setSearchParams({ ...searchParams, companyId: selectedCompany });
        getProductCategoryTreeList({ companyId: selectedCompany });
        getFiscalYear(selectedCompany);
    }, [selectedCompany]);

    useEffect(() => {
        getTradeDiscountList(searchParams);
    }, [searchParams]);

    const handleExport = () => {
        const data = [...singleAll];
        if (data.length === 0) {
            showError("No row is selected for export data");
            return;
        }
    
        let exportData = [];
        data.map(row => {
            let obj = {};
            obj.SKU = row.productSku;
            obj.Category = row.productCategory;
            obj.Name = row.p_name;//+" "+row.item_size+" "+row.abbreviation+" * "+row.pack_size;
            obj.TradePrice = row.tradePrice;
            obj.Date = moment(row.date, "DD/MM/YYYY").format(dateFormatPattern());
            if (row.cashAmount != "" || row.cashValue != "" || row.cashType != "" || row.discountCashType != "") {
                obj.CashAmount = row.cashAmount
                obj.CashDiscountValue = (row.cashValue === undefined ? '' : row.cashValue) + " " + (row.cashType === undefined ? '' : row.cashType)
            }
            if (row.creditAmount != "" || row.creditValue != "" || row.creditType != "" || row.discountCreditType != "") {
                obj.CreditAmount = row.creditAmount
                obj.CreditDiscountValue =(row.creditValue === undefined ? '' : row.creditValue) + " " + (row.creditType === undefined ? '' : row.creditType)
            }
            obj.semesterName = row.semesterName+", "+row.fiscalYearName;
            exportData.push(obj);
        })
        const workbook = XLSX.utils.book_new();
        const Heading = [
            ["SKU", "CATEGORY", "NAME", "TRADE PRICE", "DATE", "CASH AMOUNT", "CASH DISCOUNT VALUE", "CREDIT AMOUNT", "CREDIT DISCOUNT VALUE", "SEMESTER NAME"]
        ];
        const worksheet = XLSX.utils.json_to_sheet(exportData, {origin: 'A2', skipHeader: true});

        XLSX.utils.sheet_add_aoa(worksheet, Heading, {origin: 'A1'});
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, "TradeDiscountData.xlsx");
    }

    const getFiscalYear = (companyId) => {
        const URL = `${process.env.REACT_APP_API_URL}/api/accounting-year/companyWise/${companyId}`;
        if (companyId) {

            axios.get(URL).then(response => {
                setAllFiscalYear(response.data.data);
            }).catch(err => {
                showError(intl.formatMessage({ id: "COMMON.ERROR_STATUS" }));
            });

        }
    }
    const selectFiscalYear = (e) => {
        let searchObj = { ...searchParams, accountingYearId: e.target.value };
        setSearchParams(searchObj);
    }
    const getProductCategoryTreeList = (params) => {
        const URL = `${process.env.REACT_APP_API_URL}/api/product-category/list-info/${params.companyId}`;
        if (params.companyId) {
        axios.get(URL).then(response => {
            if (response.data.data.childProductCategoryDtoList != "") {
                setProductCategoryTree(response.data.data.childProductCategoryDtoList);
            }
        }).catch(err => {
            showError("Can not get product category tree data.");
        });
        }
    }

    const selectProductCategoryTreeNode = (node) => {
        let id = "summary-id-" + node.id;
        const getId = document.getElementById(id);
        const getElements = document.getElementsByClassName('tree-nav__item_demo tree-nav__item-title');

        for (var i = 0; i < getElements.length; i++) {
            getElements[i].classList.remove('tree-nav-item');
        }
        if (getId) {
            getId.classList.add('tree-nav-item');
            setSelectedProductCategory(node);
            setBreadCrumParentProductCategoryTypeName(node.typeName);
            setBreadCrumParentProductCategoryName(node.name);
            getCategoryIdList(node);
            getTradeDiscountList({ ...searchParams, categoryIds: categoryIds });

            // remove selected ids
            setCategoryIds([]);
        }
    }

    const getCategoryIdList = (node) => {
        // push in categoryIds state
        categoryIds.push(node.id)
        let searchObj = { ...searchParams, categoryIds: categoryIds };
        setSearchParams(searchObj);
        node.children.map(nodeChild => {
            getCategoryIdList(nodeChild)
        })
    }

    const getTradeDiscountList = (params) => {
        console.log("params", params.accountingYearId)
        let queryString = '?';
        queryString += 'categoryIds=' + params.categoryIds;
        queryString += '&accYearId=' + Number(params.accountingYearId);
        const URL = `${process.env.REACT_APP_API_URL}/api/trade-discount/get-all-product` + queryString;
        axios.get(URL).then(response => {
            if (response.data.data) {
                //console.log("queryString", response.data.data)
                setTradeDiscountList(response.data.data);
                setTradeDiscountListSearch(response.data.data);

            }
        });
    }

    const handleSearchChange = (event) => {
        let value = event.target.value;
        getSearchList(value);
    }
    const getSearchList = (searchText) => {
        let searchTextValue = searchText.toLowerCase();
        let tp = [];
        for (let i = 0; i < tradeDiscountListSearch.length; i++) {
            let name = tradeDiscountListSearch[i].p_name.toLowerCase();
            let productSku = tradeDiscountListSearch[i].productSku.toLowerCase();
            if (name.includes(searchTextValue) || productSku.includes(searchTextValue)) {
                
                tp.push(tradeDiscountListSearch[i]);
            }
        }
        setTradeDiscountList(tp);
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
                                        <strong style={{ marginLeft: "10px", color: "#828282" }}>{intl.formatMessage({ id: "COMMON.PRODUCTS_ALL" })}</strong>
                                    </label>
                                </div>
                                {/* TREE */}
                                <ProductCategoryTreeView tree={producCategoryTree}
                                    selectProductCategoryTreeNode={selectProductCategoryTreeNode}
                                />
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
                                                onChange={handleSearchChange}
                                            />
                                        </form>
                                    </div>
                                    <div className="col-xl-9 d-flex flex-wrap justify-content-end">
                                        <div className='mr-3'>
                                            <div className="row">
                                                <div className="col-3 mt-3">
                                                    <label className="dark-gray-color">Timeline</label>
                                                </div>
                                                <div className="col-9">
                                                    <select className="border-0 form-control" name="fiscalYear" onChange={(e) => selectFiscalYear(e)}>
                                                        <option value="" className="fs-1">Select Fiscal Year</option>
                                                        {
                                                            allFiscalYear.map((fiscalYear) => (
                                                                <option key={fiscalYear.id} value={fiscalYear.id}
                                                                    className="fs-1">{fiscalYear.fiscalYearName}</option>
                                                            ))
                                                        }
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <button className="btn" style={{ background: "rgba(130, 130, 130, 0.05)", color: "#828282" }}>
                                                <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/filter.svg")} width="15px" height="15px" />&nbsp;{intl.formatMessage({ id: "COMMON.FILTER" })}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                {/* ALL SUMMARY ROW */}
                                <div className='row ml-2'>
                                    <div className='col-xl-8 sales-data-chip' style={{ background: "#F9F9F9", borderRadius: "5px 0px 0px 5px" }}>
                                        <div className="d-flex">
                                            <div className="dark-gray-color">
                                                <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/location.svg")} width="35px" height="35px" />
                                            </div>
                                            <div className="ml-2">
                                                <span>
                                                    <span className="dark-gray-color" style={{ fontWeight: "500" }}>
                                                        {selectedProductCategory.typeName ? selectedProductCategory.typeName : "All"}
                                                    </span>
                                                    <p><strong>{selectedProductCategory.name ? selectedProductCategory.name : "All"}</strong></p>
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='col-xl-4 sales-data-chip' style={{ background: "#F9F9F9" }}>
                                        <button className="btn float-right export-btn" onClick={handleExport}
                                         style={{ background: "white", boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.03)", color: "#828282" }}>
                                            <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/export.svg")} width="15px" height="15px" />
                                        </button>
                                    </div>
                                </div>
                                {/* TABLE ROW */}
                                <div className='mt-5'>
                                    <TradeDiscountList setSingleAll={setSingleAll} singleAll={singleAll} tradeDiscountList={tradeDiscountList}
                                    />
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </>
    );
}