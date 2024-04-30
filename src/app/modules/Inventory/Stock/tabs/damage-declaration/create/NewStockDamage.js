import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../../../_metronic/_helpers"
import { Card } from "react-bootstrap";
import { CardBody } from "../../../../../../../_metronic/_partials/controls";
import ProductCategoryTreeView from '../../../../../SalesCollection/CommonComponents/ProductCategoryTreeView';
import { shallowEqual, useSelector } from "react-redux";
import axios from "axios";
import { showError, showSuccess } from '../../../../../../pages/Alert';
import Autocomplete from "@material-ui/lab/Autocomplete";
import { TextField } from "@material-ui/core";
import { allowOnlyNumeric } from "../../../../../Util";

export default function NewStockDamage() {
    const companyId = useSelector((state) => state.auth.company, shallowEqual);
    const userId = useSelector((state) => state.auth.user.userId, shallowEqual);
    let history = useHistory();
    const [productsList, setProductsList] = useState([]);
    const [producCategoryTree, setProductCategoryTree] = useState([]);
    const [batchNoList, setBatchNoList] = useState([]);
    const [batchInfo, setBatchInfo] = useState({});
    const [batchValue, setBatchValue] = useState(null)
    const [cartList, setCartList] = useState([]);
    const [categoryIds, setCategoryIds] = useState([]);
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [totalQuantity, setTotalQuantity] = useState(0);
    const [storeType, setStoreType] = useState('RESTRICTED');

    useEffect(() => {
        document.getElementById('full-screen-close-icon').style.display = "none";
    }, [])
    useEffect(() => {
        getProductCategoryTreeList(companyId);
    }, [companyId])

    const handleBackToListPage = () => {
        history.push('/inventory/stock/stock-damage/stock-damage-declaration');
    }
    const openFullscreen = () => {
        const elem = document.getElementById("myFullScreen");
        elem.classList.add("scroll-product-search");
        elem.requestFullscreen();
        document.getElementById('full-screen-icon').style.display = "none"
        document.getElementById('full-screen-close-icon').style.display = "inline-block"
    }
    const closeFullscreen = () => {
        const elem = document.getElementById("myFullScreen");
        elem.classList.remove("scroll-product-search");
        document.exitFullscreen();
        document.getElementById('full-screen-icon').style.display = "inline-block"
        document.getElementById('full-screen-close-icon').style.display = "none"
    }

    const getProductCategoryTreeList = (params) => {
        const URL = `${process.env.REACT_APP_API_URL}/api/product-category/list-info/` + params;
        axios.get(URL).then(response => {
            setProductCategoryTree(response.data.data.childProductCategoryDtoList);
        }).catch(err => {
            showError("Can not get product category tree data.");
        });
    }

    // Get category id recursively
    const getProductCategoryIds = (node) => {
        let temp = [...categoryIds]
        let index = temp.findIndex(id => id === node.id)
        if (index === - 1) {
            categoryIds.push(node.id)
        }
        
        node.children.map(nodeChild => {
            getProductCategoryIds(nodeChild)
        })    
    }

    const selectTreeNode = (node) => {
        let URL = `${process.env.REACT_APP_API_URL}/api/stock/depot-wise-stock-data`
        URL += '?companyId=' + companyId 
        URL += '&userLoginId=' + userId 
        URL += '&productCategoryId=' + node.id;
        axios.get(URL).then(response => {
            setProductsList(response.data.data);
            setBatchNoList([]);
            setBatchInfo({}); 
            document.getElementById('damage-qty-id').value = "";
            setBatchValue(null)
        }).catch(err => {
            setProductsList([]);
            setBatchNoList([]);
            setBatchInfo({}); 
            showError("Product not found.");
            document.getElementById('damage-qty-id').value = "";
            setBatchValue(null)
        });
    }

    const handleSelectProduct = (number, productId) => {
        setSelectedProductId(productId);
        let id = "product-id-" + number;
        const getId = document.getElementById(id);
        const getElements = document.getElementsByClassName('order-list-div');
        for (var i = 0; i < getElements.length; i++) {
            getElements[i].classList.remove('select-order-list');
        }
        // FOR RADIO BTN
        let radioId = "product-radio-id-" + number;
        const getRadioId = document.getElementById(radioId);
        var cbs = document.getElementsByClassName("all-radio");
        for (var i = 0; i < cbs.length; i++) {
            cbs[i].checked = false;
        }
        if (getId.className == "select-order-list") {
            getId.classList.remove('select-order-list');
            getRadioId.checked = false;
            setBatchNoList([])
        } else {
            getId.classList.add('select-order-list');
            getRadioId.checked = true;
            document.getElementById('damage-qty-id').value = "";
            setBatchValue(null)
            getProductLatestBatchInfo(productId);
        }

    }
    const getProductLatestBatchInfo = (productId) => {
        let URL = `${process.env.REACT_APP_API_URL}/api/stock/product-wise-batch-stock-info`
        URL += '?companyId=' + companyId 
        URL += '&productId=' + productId 
        URL += '&storeType=' + storeType;
        axios.get(URL).then(response => {
            setBatchNoList(response.data.data)
            if(response.data.data.length > 0){
                setBatchInfo(response.data.data[0]);
            }
            else {
                setBatchInfo({});
            }
            
        }).catch(err => {
            setBatchNoList([]);
            setBatchInfo({}); 
            showError("Product not found.");
        });

    }

    const handleChangeBatch = () => {
        document.getElementById('damage-qty-id').value = "";
    }
    const handleDamageQty = (e) => {
        //console.log(e.target.value)
    }

    const handleAddCart = (data) => { 
        const damageValue = document.getElementById('damage-qty-id').value;
        if(damageValue === "" || damageValue === null || damageValue === undefined) {
            showError('Damage QTY. is required.');
            return false;
        } else {
            const index = productsList.findIndex(obj => obj.productId === selectedProductId);
            if(index > -1) {

                const pName = productsList[index].productName;
                const pSku = productsList[index].productSku;
                const pCategory = productsList[index].productCategory;
                const WAR = productsList[index].weightedAverageRate;

                // ADD TO CART LIST ARRAY
                const tempCart = [...cartList];
                const batchIndex = tempCart.findIndex(obj=> obj.productId == selectedProductId && obj.batchId == data.batchId);
                if(batchIndex > -1){
                    showError('This product and batch already added!');
                    return;
                }

                if(damageValue > data.availableQuantity){
                    showError('Damage quantity cannot greater than stock quantity!');
                    return;
                }

                tempCart.push({
                    ...data,
                    "pSku": pSku,
                    "pName": pName,
                    "pCategory": pCategory,
                    "war": WAR,
                    "damageQty": damageValue,
                    "productId": selectedProductId
                })
                setCartList(tempCart)
                setTotalQuantity(value => value + Number(damageValue));
                document.getElementById('damage-qty-id').value = "";
            }
        }
    }
    const handleCartRemove = (batchId) =>{
        const tempCart = [...cartList]
        const tempObj = tempCart.find(obj => obj.batchId === batchId);
        const index = tempCart.findIndex(obj => obj.batchId === batchId);
    
        setTotalQuantity(value => value - Number(tempObj.damageQty));           
        if(index >-1){                
            tempCart.splice(index, 1);
        }        
       
        setCartList(tempCart)
    }

    const handleSearch = (event) =>{
        if(event.target.value !== "" || event.target.value !== undefined){
            document.getElementById('autocomplete-id').classList.add('d-none')
        }
    }

    const submitAllDamage = () => {
        let data = {};
        data.reason = document.getElementById('allDamageReason').value;
        data.notes = document.getElementById('allDamageNote').value;
        data.storeType = storeType;
        data.companyId = companyId;
        data.damageDetailsList = cartList

        if(!data.reason){
            showError('Please provide reason.');
            return;
        }
        
        if(data.reason.length > 255){
            showError('Reason is too long. Please provide within 250 character.');
            return;
        }
        
        if(!data.damageDetailsList.length > 0){
            showError('Please add item to damage.');
            return;
        }

        const URL = `${process.env.REACT_APP_API_URL}/api/inv-damage`
        
        axios.post(URL, data).then(response => {
            if (response.data.success == true) {
                showSuccess(response.data.message)
                clearAllDamage();
            } else {
                showError(response.data.message);
            }
            
        }).catch(err => { 
            showError(err);
        });
        
        console.log(data);
    }

    const clearAllDamage = () => {
        setProductsList([]);
        setBatchNoList([]);
        setBatchInfo({}); 
        document.getElementById('damage-qty-id').value = "";
        document.getElementById('allDamageReason').value = "";
        document.getElementById('allDamageNote').value = "";
        setBatchValue(null)
        setCartList([]);
    }
    
    return (
        <>
            <div className="container-fluid" id="myFullScreen" style={{ background: "#f3f6f9" }}>
                {/* HEADER ROW */}
                <div className="approval-view-header">
                    {/* BACK AND TITLE ROW */}
                    <div className="row">
                        <div className="col-3">
                            <span>
                                <button className='btn' onClick={handleBackToListPage}>
                                    <strong>
                                        <i className="bi bi-arrow-left-short" style={{ fontSize: "30px" }}></i>
                                    </strong>
                                </button>
                            </span>
                        </div>
                        <div className="col-6 text-center mt-4">
                            <strong>Inter Store Stock Damage</strong>
                        </div>
                        <div className="col-3 text-right text-muted">
                            <button id="full-screen-icon" className="btn text-white" onClick={openFullscreen}>
                                <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/full-screen.svg")} />
                            </button>
                            <button id="full-screen-close-icon" className="btn text-white" onClick={closeFullscreen}>
                                <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/full-screen-close.svg")} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* FROM TO AND ADDITIONAL INFO ROW */}
                <div className="bg-white">
                    <div className="row">
                    <div className="offset-xl-4 col-xl-4 text-center pt-0 p-5">
                        <span className="level-title h4 mt-5">Restricted Store</span>
                    </div>
                    </div>
                </div>

                {/* MAIN CONTENT ROW */}
                <div className="row mt-5">
                    <div className="col-xl-9">
                        {/*TITLE ROW */}
                        <div>
                            <Card className="h-100" style={{ borderTopLeftRadius: "30px", borderTopRightRadius: "30px" }}>
                                <CardBody>
                                    <div>
                                        <span className="text-muted">Title</span><br />
                                        <strong>Inter Store Stock Damage</strong>
                                    </div>
                                    <div className="row no-gutters mt-5">
                                        <div className="col-3">
                                            <span className="text-muted"><strong>CATEGORY</strong></span>
                                        </div>
                                        <div className="col-4">
                                            <span className="text-muted"><strong>PRODUCTS</strong></span>
                                        </div>
                                        <div className="col-5">
                                            <span className="text-muted ml-5"><strong>BATCHES</strong></span>
                                            <span className="text-muted float-right"><strong>ACTION</strong></span>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </div>
                        {/* SEARCH OR SCAN ROW */}
                        <div className="mt-5">
                            <div style={{ position: "absolute", padding: "7px", marginTop: "7px" }}>
                                <img src={toAbsoluteUrl("/images/search.png")} width="20px" height="20px" />
                            </div>
                            <form className="form form-label-right">
                                <input type="text" className="form-control h-50px" name="searchText"
                                    placeholder="Scan/Search Product by QR Code or Name" style={{ paddingLeft: "28px" }} onChange={(event)=>handleSearch(event)}/>
                            </form>
                            <div style={{ float: "right", padding: "7px", marginTop: "-42px" }}>
                                <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/barcode.svg")} width="20px" height="20px" />
                            </div>
                        </div>
                        <div className="row mb-5">
                            {/* CATEGORY ROW */}
                            <div className="col-xl-3">
                                <Card className="mt-5">
                                    <CardBody>
                                        <ProductCategoryTreeView
                                            tree={producCategoryTree}
                                            selectProductCategoryTreeNode={selectTreeNode}
                                        />
                                    </CardBody>
                                </Card>
                            </div>

                            {/* PRODUCTS ROW */}
                            <div className="col-xl-4">
                                {
                                    productsList.map((product, index) => (
                                        <div key={product.productId} className="order-list-div" style={{ cursor: "pointer" }} onClick={() => handleSelectProduct(index, product.productId)} id={"product-id-" + index}>
                                            <Card className="p-3 mt-5">
                                                <CardBody>
                                                    {/* RADIO BTN ROW */}
                                                    <div className="position-absolute" style={{ left: "17px", top: "43px" }}>
                                                        <span><input className="all-radio" type="radio" id={"product-radio-id-" + index} /></span>
                                                    </div>
                                                    {/* PRODUCT INFO ROW */}
                                                    <div className="mt-1">
                                                        <span className="float-right">
                                                            <span className="text-muted mr-1">Rate</span>
                                                            <strong>{product.weightedAverageRate}</strong>
                                                        </span>
                                                        <span className="text-muted">{product.productSku}</span><br />
                                                        <strong>{product.productName}</strong><br />
                                                        <span className="text-muted">{product.productCategory}</span><br />
                                                    </div>
                                                    <div className="mt-5" style={{ border: "1px solid #F2F2F2", width: "100%" }}></div>
                                                    {/* STOCK QTY ROW */}
                                                    <div className="mt-3">
                                                        <span className="dark-gray-color mr-2">
                                                            <SVG className="mr-2" src={toAbsoluteUrl("/media/svg/icons/project-svg/total-gray.svg")} />
                                                            Stock Qty.
                                                        </span>
                                                        <strong>{product.restrictedStock}</strong>
                                                    </div>
                                                </CardBody>
                                            </Card>
                                        </div>
                                    ))
                                }
                            </div>

                            {/* BATCHES ROW */}
                            <div className="col-xl-5">
                                {/* SEARCH BATCH */}
                                <Card className="mt-5" id="autocomplete-id">
                                    <CardBody>
                                        <Autocomplete
                                            options={batchNoList}
                                            getOptionLabel={(option) => option.batchNo}
                                            value={batchValue}
                                            onChange={(event, newValue) => {
                                                if (newValue) {
                                                    handleChangeBatch();
                                                    setBatchValue(newValue)
                                                    setBatchInfo(newValue);
                                                }
                                            }}
                                            renderInput={(params) => (
                                                <TextField {...params} label="Batch" id="batch-search" />
                                            )}
                                        />
                                    </CardBody>
                                </Card>
                                {/* BATCH INFO ROW */}
                                
                                <Card className="mt-5  pt-3 ">
                                    <CardBody>
                                        <div>
                                        <span className="float-right">
                                                {
                                                    Object.keys(batchInfo).length === 0 ? "" :
                                                        batchInfo.confirm ?
                                                            <span id="transferred" select="false" className="float-right light-danger-bg dark-danger-color p-3 mt-n3 rounded">Damaged</span> :
                                                            <span id="transfer" className="float-right" >
                                                                <button className="btn text-white float-right mt-n3" style={{ background: "#EB5757" }} onClick={() => handleAddCart(batchInfo)}>
                                                                    <SVG className="mr-2" src={toAbsoluteUrl("/media/svg/icons/project-svg/white-receive.svg")} />
                                                                    Damage
                                                                </button>
                                                            </span>
                                                }

                                            </span>
                                            <span>
                                                <span className="text-muted mr-2">Batch No:</span>
                                                <strong>{batchInfo.batchNo}</strong>
                                            </span><br />
                                            <span>
                                                <span className="text-muted mr-2">Batch Qty:</span>
                                                <strong>{batchInfo.batchQuantity}</strong>
                                            </span><br />
                                            <span>
                                                <span className="text-muted mr-2">Stock Qty:</span>
                                                <strong>{batchInfo.availableQuantity}</strong>
                                            </span>
                                        </div>
                                        {/* QTY ROW */}
                                        <div className="mt-5 row">
                                            <div className="col-6 mt-5">
                                                <span>
                                                    <input type="text" required id={"damage-qty-id"} onKeyPress={(e) => allowOnlyNumeric(e)} onChange={(e)=>handleDamageQty(e)}  className="mt-n5 border w-100 rounded p-3" placeholder="Damage QTY." />
                                                </span>
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                            </div>
                        </div>
                    </div>

                    {/*CART ROW */}
                    <div className="col-xl-3">
                        {/* CART TITLE ROW */}
                        <Card style={{ borderTopRightRadius: "30px", borderTopLeftRadius: "30px" }}>
                            <CardBody>
                                <div>
                                    <span className="text-muted">Title</span><br />
                                    <strong>Restricted Store</strong>
                                </div>
                                <div className="mt-5">
                                    <span className="text-muted"><strong>PRODUCTS</strong></span>
                                    <span className="text-muted float-right"><strong>ACTION</strong></span>
                                </div>
                            </CardBody>
                        </Card>
                        {/* ADD DATA INTO CART ROW */}
                        <div className="mt-4">
                            {
                                cartList.map((obj, index) => (
                                    <Card className="mt-5" key={index}>
                                        <CardBody>
                                            <div className="d-flex">
                                                <div className="ml-n3 mt-3"><span className="rounded light-gray-bg pl-2 pr-2">{index + 1}</span></div>
                                                <div className="w-100 pl-5">
                                                    <div>
                                                        <button className="btn float-right" style={{ background: "#F9F9F9", color: "#0396FF" }} onClick={()=>handleCartRemove(obj.batchId)}>
                                                            <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/red-delete.svg")} />
                                                        </button>
                                                    </div>
                                                    <div>
                                                        <span className="text-muted">{obj.pSku}</span><br />
                                                        <strong>{obj.pName}</strong><br />
                                                        <span className="text-muted">{obj.pCategory}</span><br />
                                                    </div>
                                                    <div className="mt-5">
                                                        <span>
                                                            <span className="mr-2 text-muted">Batch</span>
                                                            <strong>{obj.batchNo}</strong>
                                                        </span>
                                                        <span className="float-right">
                                                            <span className="mr-2 text-muted">Stock Qty.</span>
                                                            <strong>{obj.availableQuantity}</strong>
                                                        </span>
                                                    </div>
                                                    <div className="mt-5" style={{ border: "1px solid #F2F2F2", width: "100%" }}></div>

                                                    {/* TOTAL QTY ROW */}
                                                    <div className="mt-3">
                                                        <span>
                                                            <SVG className="mr-1" src={toAbsoluteUrl("/media/svg/icons/project-svg/price-gray.svg")} />
                                                            <span className="mr-2 text-muted">Current W.A. Rate</span>
                                                            <strong>{obj.war}</strong>
                                                        </span>
                                                        <span className="float-right">
                                                            <span className="mr-2 text-muted">Damage Qty.</span>
                                                            <strong>{obj.damageQty}</strong>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardBody>
                                    </Card>
                                ))
                            }
                        </div>
                        {/* REASON AND NOTES CART */}
                        <Card className="mt-4">
                            <CardBody>
                                {/* REASON ROW */}
                                <div className="mt-3">
                                    <label className="dark-gray-color">Reason<strong className="text-danger">*</strong></label>
                                    <textarea type="text" name="allDamageReason" id="allDamageReason" className="form-control" rows="5" placeholder="Write here..." />
                                </div>
                                {/* NOTES ROW */}
                                <div className="mt-3">
                                    <label className="dark-gray-color">Note</label>
                                    <textarea type="text" name="allDamageNote" id="allDamageNote" className="form-control" rows="5" placeholder="Write here..." />
                                </div>
                                <div className="mt-5" style={{ border: "1px solid #F2F2F2", width: "100%" }}></div>
                                <div className="mt-5">
                                    <strong>Total Qty.</strong>
                                    <strong className="float-right">{totalQuantity}</strong>
                                </div>
                            </CardBody>
                        </Card>
                        {/* TOTAL QTY CART ROW */}
                        <Card className="mt-5 mb-5" style={{ borderBottomRightRadius: "30px", borderBottomLeftRadius: "30px" }}>
                            <CardBody>
                                <div>
                                    <button onClick={clearAllDamage} className="btn dark-danger-color" style={{ background: "#F9F9F9", color: "#0396FF" }}>
                                        <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/reject.svg")} />
                                        &nbsp;<strong>Cancel</strong>
                                    </button>
                                    <button onClick={submitAllDamage} className="btn text-white mr-3 float-right" style={{ background: "#EB5757" }}>
                                        <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/white-receive.svg")} />
                                        &nbsp;<strong>All Damage</strong>
                                    </button>
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}