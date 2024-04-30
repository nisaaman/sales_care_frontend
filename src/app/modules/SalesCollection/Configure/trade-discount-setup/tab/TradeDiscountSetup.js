import React, { useEffect, useState } from "react";
import TradeDiscountSetupBreadCrum from "../common/TradeDiscountSetupBreadCrum";
import TradeDiscountSetupHeader from "../common/TradeDiscountSetupHeader";
import { toAbsoluteUrl } from "../../../../../../_metronic/_helpers";
import SVG from "react-inlinesvg";
import { Card, CardBody } from "../../../../../../_metronic/_partials/controls";
import { showError, showSuccess } from '../../../../../pages/Alert';
import axios from 'axios';
import ProductCategoryTreeView from '../../../CommonComponents/ProductCategoryTreeView';
import { useIntl } from "react-intl";
import DiscountSetup from "./DiscountSetup";
import _ from "lodash";

export default function TradeDiscountSetup() {
    const invoiceNature = { credit: 1, cash: 2 }  // will be hardcoded as per discuss nisa apu and this value also used in mobile app
    const intl = useIntl();
    const [singleAll, setSingleAll] = useState([]);
    const [producCategoryTree, setLocationProductCategory] = useState([]);
    const [selectedProductCategory, setSelectedProductCategory] = useState({});
    const [searchParams, setSearchParams] = useState({});
    const [categoryIds, setCategoryIds] = useState([]);
    const [productList, setProductList] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState({});
    const [searchInputs, setSearchInputs] = useState({});
    const [searchProductList, setSearchProductList] = useState([]);
    const [selectedInvoiceNature, setSelectedInvoiceNature] = useState(1); // 1= credit id in invoice nature database
    const [currentDiscount, setCurrentDiscount] = useState({});


    useEffect(() => {
        document.getElementById('pills-configure-trade-discount-setup-tab').classList.add('active')
    }, []);

    useEffect(() => {
        if (_.isEmpty(selectedProduct)) {
            setCurrentDiscount({});
        } else {
            getCurrentDiscount({
                companyId: selectedProduct.company_id,
                productId: selectedProduct.id,
                invoiceNatureId: selectedInvoiceNature
            });
        }
    }, [selectedProduct, selectedInvoiceNature]);

    const getProductCategoryTreeList = (params) => {
        const URL = `${process.env.REACT_APP_API_URL}/api/product-category/list-info/${params}`;
        axios.get(URL).then(response => {
            setLocationProductCategory(response.data.data.childProductCategoryDtoList);
        }).catch(err => {
            showError("Can not get product category tree data.");
        });
    }

    const getProductCategoryNameTrace = (node) => {
        let level = ''
        const breadCrumTemp = new Array()
        const treeLevels = node.treeLevel.split('-')
        const treeLength = treeLevels.length

        if (treeLength > 1) {
            level = treeLevels[0]
            let rootNode = producCategoryTree.find(obj => obj.treeLevel === level)
            breadCrumTemp.push(rootNode)

            for (let i = 1; i < treeLength - 1; i++) {
                level += '-' + treeLevels[i]
                rootNode = rootNode.children.find(obj => obj.treeLevel === level)
                breadCrumTemp.push(rootNode)
            }
        }
        breadCrumTemp.push(node)
        let categoryNameTrace = breadCrumTemp.map((c) => c.name).join(" / ");
        return categoryNameTrace;
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
            let categoryNameTrace = getProductCategoryNameTrace(node);
            const getElements = document.getElementsByClassName('product-div');

            for (var i = 0; i < getElements.length; i++) {
                getElements[i].classList.remove('active-product');
            }
            setSelectedProductCategory({ ...node, productCategoryNameTrace: categoryNameTrace });
            if (node !== '') {
                getProductCategoryIds(node);
                getAllProductByCategoryId();
                setSelectedProduct({});
            }
            setSearchParams({ ...searchParams, productCategoryId: node.id });

        }

    }

    const getAllProductByCategoryId = () => {
        const URL = `${process.env.REACT_APP_API_URL}/api/product-category/get-all-product?ids=${categoryIds}`
        axios.get(URL).then(response => {
            if (response.data.success === true) {
                let pl = response.data.data;
                for (let i = 0; i < pl.length; i++) {
                    pl[i].name = pl[i].name + ' ' + pl[i].item_size + ' ' + pl[i].uom_name + '*' + pl[i].pack_size;
                    pl[i].tradePrice = "Trade Price " + pl[i].trade_price;
                }
                setProductList(pl);
                setSearchProductList(pl);
                setCategoryIds([]);
            }
        });
    }

    const getProductCategoryIds = (node) => {
        let temp = [...categoryIds]
        let index = temp.findIndex(id => id === node.id)
        if (index === -1) {
            categoryIds.push(node.id)
        }

        node.children.map(nodeChild => {
            getProductCategoryIds(nodeChild)
        })
    }


    const selectProductDiv = (event, number, product) => {
        setSelectedProduct({ ...product, productCategoryNameTrace: selectedProductCategory.productCategoryNameTrace })
        let id = "id-" + number;
        const getId = document.getElementById(id);
        const getElements = document.getElementsByClassName('product-div');

        for (var i = 0; i < getElements.length; i++) {
            getElements[i].classList.remove('active-product');
        }

        if (getId) {
            getId.classList.add('active-product');
        }
    }

    const onChangeDiscountHeaderSearchInputs = (searchParams) => {
        if (searchParams.companyId === undefined || searchParams.companyId === '') {
            setLocationProductCategory([]);
        } else {
            getProductCategoryTreeList(searchParams.companyId);
        }
        setProductList([]);
        setSearchProductList([]);
        setSelectedProduct({});
        setSelectedProductCategory({});
    }

    const onChangeDiscountTab = (invNature) => {
        setSelectedInvoiceNature(invNature);
    }

    const getCurrentDiscount = (params) => {
        let queryString = 'companyId=' + params.companyId;
        queryString += '&productId=' + params.productId;
        queryString += '&invoiceNatureId=' + params.invoiceNatureId;
        const URL = `${process.env.REACT_APP_API_URL}/api/trade-discount/get-current-discount-by-invoice-nature?` + queryString;
        axios.get(URL).then(response => {
            if (response.data.success === true) {
                setCurrentDiscount(response.data.data === null ? {} : response.data.data);
            }
        });
    }

    const handleSearchChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;
        setSearchInputs(values => ({ ...values, [name]: value }));
        getSearchListFromProductList(value);
    }

    const getSearchListFromProductList = (searchText) => {
        let tp = [];
        for (let i = 0; i < productList.length; i++) {
            if (productList[i].name.includes(searchText) || productList[i].product_sku.includes(searchText) || productList[i].tradePrice.includes(searchText)) {
                tp.push(productList[i]);
            }
        }
        setSearchProductList(tp);
    }

    return (
        <>
            {/* BREADCRUM ROW */}
            <div>
                <TradeDiscountSetupBreadCrum />
                <TradeDiscountSetupHeader onChangeSearchInputs={onChangeDiscountHeaderSearchInputs} />
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
                            {/* MIDDLE SIDE LIST ROW */}
                            <div className='col-xl-3' style={{ borderRight: "1px solid #F2F2F2" }}>
                                {/* SEARCHING AND FILTERING ROW */}
                                <div style={{ position: "absolute", padding: "7px", marginTop: "3px" }}>
                                    <img src={toAbsoluteUrl("/images/search.png")} width="20px" height="20px" />
                                </div>
                                <form className="form form-label-right">
                                    <input type="text" className='form-control' name="searchText"
                                        placeholder="Search Product" style={{ paddingLeft: "28px" }}
                                        value={searchInputs.searchText || ""} onChange={handleSearchChange}></input>
                                </form>
                                {/* SEARCHING PRODUCT LIST */}
                                <div className="mt-5 pr-1 scroll-product-search">
                                    {searchProductList.map((element, index) => (
                                        <div key={index} className="mt-5 product-div"
                                            onClick={(event) => selectProductDiv(event, index, element)}
                                            id={"id-" + index}>
                                            <span className="text-muted">{element.product_sku}</span><br />
                                            <strong>{element.name}</strong><br />
                                            <span className="text-muted">{element.tradePrice}</span>
                                        </div>

                                    ))}
                                </div>
                            </div>
                            {/* RIGHT SIDE LIST ROW */}
                            <div className="col-xl-6">
                                {/* PRODUCT INFO ROW */}
                                <div className="mt-3">
                                    <span className="text-muted">{selectedProduct.product_sku}</span><br />
                                    <strong
                                        hidden={_.isEmpty(selectedProduct) ? 'hidden' : ''}>
                                        {selectedProduct.name}</strong><br />
                                    <span hidden={_.isEmpty(selectedProduct) ? 'hidden' : ''}
                                        className="text-muted">{selectedProduct.productCategoryNameTrace}</span><br />
                                    <span className="d-flex float-right three-dot-hr">
                                        <button className="three-dot-hr-btn"><SVG
                                            src={toAbsoluteUrl("/media/svg/icons/project-svg/vertical-dot.svg")}
                                            width="10px" height="13px" /></button>
                                    </span>
                                </div>

                                {/* PRICE INFO ROW */}
                                <div hidden={_.isEmpty(selectedProduct) ? 'hidden' : ''}>
                                    <span className="mfg-price-span mt-1">
                                        Trade Price:&nbsp;
                                        <strong className="text-color-black">
                                            {selectedProduct.trade_price} {selectedProduct.vat_included === null ? '' : selectedProduct.vat_included === true ? '(Inc. VAT ' + selectedProduct.vat + '%)' : '(Exc. VAT ' + selectedProduct.vat + '%)'}
                                        </strong>
                                    </span>
                                    <span className="mfg-price-span mt-1">
                                        Current Discount: <strong className="text-color-black">
                                            {currentDiscount.discountValue ? currentDiscount.discountValue : 0}{currentDiscount.calculationType === 'EQUAL' ? '/=' : '%'}
                                        </strong>
                                    </span>
                                </div>
                                {/* TAB ROW */}
                                <div className="mt-5">
                                    <ul className="nav nav-pills mb-3" id="pills-tab-trade-discount-new" role="tablist">
                                        <li className="nav-item" role="presentation">
                                            <a className="nav-link active" id="pills-trade-discount-credit-setup-tab"
                                                data-toggle="pill" onClick={(event) => onChangeDiscountTab(1)}
                                                href="#pills-trade-discount-credit-setup" role="tab"
                                                aria-controls="pills-trade-discount-credit-setup"
                                                aria-selected="true">Credit</a>
                                        </li>
                                        <li className="nav-item" role="presentation">
                                            <a className="nav-link" id="pills-trade-discount-cash-setup-new-tab"
                                                data-toggle="pill" onClick={(event) => onChangeDiscountTab(2)}
                                                href="#pills-trade-discount-cash-setup-new" role="tab"
                                                aria-controls="pills-trade-discount-cash-setup-new"
                                                aria-selected="false">Cash</a>
                                        </li>                                      
                                    </ul>
                                    <div className="tab-content ml-3" id="pills-tab-tradePriceSetupContent">
                                        {/* ORDER SUMMARY */}
                                        <div className="tab-pane fade show active"
                                            id="pills-trade-discount-cash-setup-new" role="tabpanel"
                                            aria-labelledby="pills-trade-discount-cash-setup-new-tab">
                                        </div>

                                        {/* ACTIVITIES AND REPORTS */}
                                        <div className="tab-pane fade" id="pills-trade-discount-credit-setup"
                                            role="tabpanel" aria-labelledby="pills-trade-discount-credit-setup-tab">
                                            {/*<DiscountSetup/>*/}
                                        </div>
                                        <DiscountSetup selectedProduct={selectedProduct}
                                            selectedInvoiceNature={selectedInvoiceNature} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </>
    )
}