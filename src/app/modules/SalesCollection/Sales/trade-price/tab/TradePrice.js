import React, { useEffect, useState } from 'react';
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../../_metronic/_helpers";
import { TradePriceList } from '../table/TradePriceList';
import { Card, CardBody } from "../../../../../../_metronic/_partials/controls";
import { showError, showSuccess } from '../../../../../pages/Alert';
import axios from 'axios';
import ProductCategoryTreeView from '../../../CommonComponents/ProductCategoryTreeView';
import { shallowEqual, useSelector } from "react-redux";
import SalesTabsHeader from "../../common/SalesTabsHeader";
import { BreadCrum } from "../../common/BreadCrum";
import { useHistory } from "react-router-dom";
import * as XLSX from 'xlsx';
import { useIntl } from "react-intl";

export function TradePrice() {
    const selectedCompany = useSelector((state) => state.auth.company, shallowEqual);
    const intl = useIntl();
    const [producCategoryTree, setLocationProductCategory] = useState([]);
    const [selectedProductCategory, setSelectedProductCategory] = useState({});
    const [singleAll, setSingleAll] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [tradePriceList, setTradePriceList] = useState([]);
    const [selectedCategoryList, setSelectedCategoryList] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [searchPriceList, setSearchPriceList] = useState([]);
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popper' : undefined;
    let history = useHistory();

    useEffect(() => {
        document.getElementById('pills-trade-price-tab').classList.add('active');
    }, []);

    useEffect(() => {
        getTradePriceList({ companyId: selectedCompany, productCategoryIds: [] });
        getProductCategoryTreeList({ companyId: selectedCompany });
        setSelectedProductCategory("All");
        setSelectedCategoryList([]);
        setSearchText("");
    }, [selectedCompany]);

    const handleClick = (event) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    }

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
            obj.CategoryName = row.productCategoryName;
            obj.name = '' + row.productName + ' ' + row.itemSize + ' ' + row.uomAbbreviation + ' * ' + row.packSize;
            obj.MfgPrice = row.mfgRate;
            obj.mfgDate = row.mfgDate;
            obj.TradePrice = row.tradePrice;
            obj.TradePriceDate = row.productTradePriceCreatedDate;
            if (row.vat && row.vatIncluded === true) {
                obj.vat = row.vat + '%' + '(Incl.)';
            } else if (row.vat && row.vatIncluded === false) {
                obj.vat = row.vat + '%' + '(Excl.)';
            }
            obj.vatDate = row.vatFromDate;
            exportData.push(obj);
            setSingleAll([]);
        })
        const workbook = XLSX.utils.book_new();
        const Heading = [
            ["SKU", "Category", "Name", "Mfg. Price", "Mfg. Date", "Trade Price", "Trade Price Date", "VAT", "VAT Date"],
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
                    sz: 11,
                    bold: true,
                    color: "#F2F2F2"
                },
            }
        }
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, "Trade_Price_Data.xlsx");
    }

    const getProductCategoryTreeList = (params) => {
        const URL = `${process.env.REACT_APP_API_URL}/api/product-category/list-info/${params.companyId}`;
        if (params.companyId) {

            axios.get(URL).then(response => {
                setLocationProductCategory(response.data.data.childProductCategoryDtoList);
            }).catch(err => {
                showError("Can not get product category tree data.");
            });
        }
    }

    const selectTreeNode = (node) => {
        let id = "summary-id-" + node.id;
        const getId = document.getElementById(id);
        const getElements = document.getElementsByClassName('tree-nav__item_demo tree-nav__item-title');

        for (var i = 0; i < getElements.length; i++) {
            getElements[i].classList.remove('tree-nav-item');
        }
        if (getId) {
            getId.classList.add('tree-nav-item');
            if (node !== '') {
                getProductCategoryIds(node);
            }
            setSelectedProductCategory(node);
            getTradePriceList({ companyId: selectedCompany, productCategoryIds: selectedCategoryList });
        }
    }

    const getProductCategoryIds = (node) => {
        let temp = [...selectedCategoryList]
        let index = temp.findIndex(id => id === node.id)
        if (index === -1) {
            selectedCategoryList.push(node.id)
        }

        node.children.map(nodeChild => {
            getProductCategoryIds(nodeChild)
        })
    }

    const getTradePriceList = (params) => {
        let queryString = '?';
        queryString += '&companyId=' + params.companyId;
        queryString += '&productCategoryIds=' + params.productCategoryIds;
        const URL = `${process.env.REACT_APP_API_URL}/api/product-trade-price/get-trade-price-list-view` + queryString;
        if (params.companyId) {
        axios.get(URL).then(response => {
            const dataList = response.data.data.tradePrices;
            setTradePriceList(dataList);
            setSearchPriceList(dataList);
            setSelectedCategoryList([]);
        }).catch(err => {
            showError("Cannot get Trade Price Data.");
        });}
    }

    const deleteSingleRow = (id) => {
        const URL = `${process.env.REACT_APP_API_URL}/api/product-trade-price/${id}`;
        if (selectedCompany) {
        axios.delete(URL).then(response => {
            if (response.data.success == true) {
                showSuccess(response.data.message);
                getTradePriceList({ companyId: selectedCompany, productCategoryIds: selectedCategoryList });
            } else {
                showError(response.data.message);
            }
        }).catch(err => {
            showError(err);
        });
        history.push('/salescollection/sales/trade-price');
    }
    }

    const handleSearchTextChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;
        setSearchText(value);
        getSearchListFromTradePriceList(value);
    }

    const getSearchListFromTradePriceList = (searchText) => {
        let tp = [];
        for (let i = 0; i < tradePriceList.length; i++) {
            if (tradePriceList[i].productSku.includes(searchText)
                || tradePriceList[i].productCategoryName.includes(searchText)
                || tradePriceList[i].productName.includes(searchText)) {
                tp.push(tradePriceList[i]);
            }
        }
        setSearchPriceList(tp);
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
                                        <img src={toAbsoluteUrl("/images/loc3.png")} alt='Company Picture'
                                            style={{ width: "20px", height: "20px", textAlign: "center" }} />
                                        <strong style={{
                                            marginLeft: "10px",
                                            color: "#828282"
                                        }}>{intl.formatMessage({ id: "COMMON.PRODUCTS_ALL" })}</strong>
                                    </label>
                                </div>
                                {/* TREE */}
                                <ProductCategoryTreeView tree={producCategoryTree}
                                    selectProductCategoryTreeNode={selectTreeNode} />
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
                                                value={searchText || ""} onChange={handleSearchTextChange} />
                                        </form>
                                    </div>
                                    <div className="col-xl-9 d-flex justify-content-end">
                                        <div>
                                            <button className="btn"
                                                style={{ background: "rgba(130, 130, 130, 0.05)", color: "#828282" }}>
                                                <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/filter.svg")}
                                                    width="15px"
                                                    height="15px" />&nbsp;{intl.formatMessage({ id: "COMMON.FILTER" })}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                {/* ALL SUMMARY ROW */}
                                <div className='row ml-2'>
                                    <div className='col-xl-8 sales-data-chip'
                                        style={{ background: "#F9F9F9", borderRadius: "5px 0px 0px 5px" }}>
                                        <div className="d-flex">
                                            <div className="dark-gray-color">
                                                <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/category-gray.svg")}
                                                    width="35px" height="35px" />
                                            </div>
                                            <div className="ml-2">
                                                <span>
                                                    <span className="dark-gray-color" style={{ fontWeight: "500" }}>
                                                        {selectedProductCategory.typeName ? selectedProductCategory.typeName : "All"}</span>
                                                    <p><strong>{selectedProductCategory.name ? selectedProductCategory.name : "All"}</strong></p>
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='col-xl-4 sales-data-chip' style={{ background: "#F9F9F9" }}>
                                        <button onClick={handleExport} className="btn float-right"
                                            style={{
                                                background: "white", color: "#828282",
                                                boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.03)"
                                            }}>
                                            <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/export.svg")}
                                                width="15px" height="15px" />
                                        </button>
                                    </div>
                                </div>
                                {/* TABLE ROW */}
                                <div className='mt-5'>
                                    <TradePriceList setSingleAll={setSingleAll} singleAll={singleAll}
                                        deleteSingleRow={deleteSingleRow} tradePriceList={searchPriceList} />
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </>
    );
}