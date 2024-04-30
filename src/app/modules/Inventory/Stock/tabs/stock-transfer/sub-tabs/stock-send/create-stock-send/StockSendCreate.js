import React, { useState, useEffect, useCallback } from "react";
import { toAbsoluteUrl } from "../../../../../../../../../_metronic/_helpers";
import SVG from "react-inlinesvg";
import { Card } from "react-bootstrap";
import { CardBody } from "../../../../../../../../../_metronic/_partials/controls";
import axios from 'axios';
import { showError, showSuccess } from '../../../../../../../../pages/Alert';
import ProductCategoryTreeView from '../../../../../../../SalesCollection/CommonComponents/ProductCategoryTreeView';
import StockSendHeader from "./StockSendHeader";
import StockFromToSend from "./StockFromToSend";
import StockTransferProductTitle from "./StockTransferProductTitle";
import BatchList from "./BatchList";
import Cart from "./Cart";
import { useLocation } from "react-router-dom";
import { allowOnlyNumeric, handlePasteDisable } from "../../../../../../../Util";

export default function StockSendCreate() {


    const location = useLocation();
    const companyId = location.state.companyId;
    const userLoginId = location.state.userLoginId;
    const [batchInfo, setBatchInfo] = useState({});
    const [value, setValue] = useState(null);
    const [batchNoList, setBatchNoList] = useState([]);
    const [fromDepots, setFromDepots] = useState([]);
    const [toDepots, setToDepots] = useState([]);
    const [vehicleList, setVehicleList] = useState([]);
    const [selectedProductId, setSelectedProductId] = useState('');
    const [selectedProductCategory, setSelectedProductCategory] = useState('');
    const [searchParams, setSearchParams] = useState({ userLoginId: userLoginId, companyId: companyId, selectedProductCategory: selectedProductCategory });
    const [productList, setProductList] = useState([])
    const [producCategoryTree, setLocationProductCategory] = useState([]);
    const [batchList, setBatchList] = useState([]);
    const [cartList, setCartList] = useState([]);
    const [fromDepotInfo, setFromDepotInfo] = useState({});
    const [fromDepotId, setFromDepotId] = useState('');
    const [toDepotId, setToDepotId] = useState('');
    const [selectedProductInfo, setSelectedProductInfo] = useState({});
    const [invTransfer, setInvTransfer] = useState({
        driverName: "", driverContactNo: "", fromDepotId: "",
        toDepotId: "", vehicleId: "", companyId: companyId, depotId: ''
    });
    const [invTransactionDto, setInvTransactionDto] = useState({ transactionType: "TRANSFER_SENT" });
    const [blockedQuantity, setBlockedQuantity] = useState();
    const [regularQuantity, setRegularQuantity] = useState();
    const [searchProductList, setSearchProductList] = useState([])

    useEffect(() => {
        document.getElementById('full-screen-close-icon').style.display = "none";
        getProductCategoryTreeList(companyId)
        getVehicleInfo();
        getFromDepotInfo(companyId, userLoginId);
        getToDepotInfo(companyId);
    }, [companyId])

    useEffect(() => {
        setBatchList([]);
        setBatchNoList([]);
        setSelectedProductId('');
        const getElements = document.getElementsByClassName('order-list-div');
        for (var i = 0; i < getElements.length; i++) {
            getElements[i].classList.remove('select-order-list');
        }
        // FOR RADIO BTN
        var cbs = document.getElementsByClassName("all-radio");
        for (var i = 0; i < cbs.length; i++) {
            cbs[i].checked = false;
        }
    }, [selectedProductCategory])

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
        if (params) {
            axios.get(URL).then(response => {
                setLocationProductCategory(response.data.data.childProductCategoryDtoList);
            }).catch(err => {
                showError("Can not get product category tree data.");
            });
        }
    }
    const selectTreeNode = (node) => {

        setSelectedProductCategory(node)
        const paramsData = { ...searchParams, selectedProductCategory: node.id }
        //getAllProductsOfACompany(paramsData)
        getDepotWiseStockDetails(paramsData);
        setBatchInfo({});
        setBatchNoList([]);
        setValue('');
        document.getElementById('batch-qty-id').value = '';
    }

    // const getAllProductsOfACompany = (searchParams) => {
    //     let queryString = "?";
    //     queryString += "companyId="+searchParams.companyId;
    //     queryString += searchParams.selectedProductCategory ? "&productCategoryId="+searchParams.selectedProductCategory : "";

    //     const URL = `${process.env.REACT_APP_API_URL}/api/product/all/company-wise`+queryString;

    //     axios.get(URL).then(response => {
    //         setProductList(response.data.data);
    //     }).catch(err => {
    //         showError("Products not available...")
    //     });
    // }

    const getDepotWiseStockDetails = (params) => {

        let queryString = "?";
        queryString += "&companyId=" + params.companyId;
        queryString += "&userLoginId=" + params.userLoginId;
        queryString += params.selectedProductCategory ? "&productCategoryId=" + params.selectedProductCategory : '';

        const URL = `${process.env.REACT_APP_API_URL}/api/stock/depot-wise-stock-data` + queryString;
        axios.get(URL).then((response) => {
            setProductList(response.data.data);
            // to filter product
            setSearchProductList(response.data.data);
        }).catch();
    }

    const handleSelectProduct = (number, product) => {
        // FOR SELECTED CARD BTN

        if (selectedProductId !== product.productId) {
            setBatchInfo({});
            setValue(null);
            setBatchNoList([]);
            setSelectedProductId(product.productId);
            setSelectedProductInfo({
                productSku: product.productSku, productName: product.productName,
                productCategory: product.productCategory
            })
        }

        //batchList.map((batch, index) => {
        document.getElementById('batch-qty-id').value = '';

        //})

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
            setBatchList([])
        } else {
            getId.classList.add('select-order-list');
            getRadioId.checked = true;
            let temp = [...productList]
            let index = temp.findIndex((obj) => obj.id === product.productId);
            getProductAllBatchInfo(companyId, product.productId, fromDepotId);

        }
        getProductBlockedQuantity(companyId, product.productId, fromDepotId);
        storeWiseBatchDataSource(product.productId);
    }

    const getProductAllBatchInfo = (companyId, productId, depotId) => {
        if (productId) {

            const URL = `${process.env.REACT_APP_API_URL}/api/inv-transfer/product-wise-batch-stock-info/${companyId}/${productId}/${depotId}`;
            axios.get(URL).then(response => {
                setBatchList(response.data.data);
                // setBatchQuantity(response.data.data.batchQuantity);
                // setBatchId(response.data.data.batchId);
                // setBatchNo(response.data.data.batchNo);
                // setReceivedQuantity(response.data.data.receivedQuantity)
            }).catch(err => {
                //showError("Products not available...")
            });
        }
    }

    const getProductBlockedQuantity = useCallback((companyId, selectedProductId, fromDepotId) => {

        const URL = `${process.env.REACT_APP_API_URL}/api/stock/product-blocked-quantity/${companyId}/${fromDepotId}/${selectedProductId}`;
        axios.get(URL).then(response => {
            setBlockedQuantity(response.data.data.blockedQuantity);
            setRegularQuantity(response.data.data.regularQuantity)
        }).catch(err => {

        });

    }, [getProductBlockedQuantity])

    const getProductWeightedAverageRate = (temp, object, batch) => {

        const index = temp.findIndex(obj => obj.productId == object.productId);
        const productRate = temp[index].rate
        if (productRate == "") {
            if (object.productId) {

                const URL = `${process.env.REACT_APP_API_URL}/api/inv-transaction/product-wise-weighted-avg-rate/${companyId}/${object.productId}`;
                axios.get(URL).then(response => {

                    temp[index].rate = response.data.data;
                    batch.addToCart = true;
                    setCartList(temp)
                }).catch(err => {

                });
            }
        } else {
            const index = temp.findIndex(obj => obj.batchId == object.batchId);
            temp[index].rate = productRate;
            batch.addToCart = true;
            setCartList(temp)
        }
    }

    const handleTransfer = (batch, selectedProductInfo, i, event) => {
        const obj = {}
        const temp = [...cartList]

        if (temp.findIndex(obj => obj.batchId == batch.batchId) != -1) {
            showError("Already Added Into Cart");
            return;
        }
        if (!value) {
            showError("Please select batch");
            return;
        }
        if (batch.transferQuantity && batch.transferQuantity !== undefined && parseInt(batch.transferQuantity) !== 0) {

            //batch.addToCart = true;
            obj.batchId = batch.batchId;
            obj.productId = batch.productId;
            obj.productSku = selectedProductInfo.productSku;
            obj.productName = selectedProductInfo.productName;
            obj.productCategory = selectedProductInfo.productCategory;

            //const addToCart = batch.transferQuantity != "" ? true : false;
            // if(batch.transferQuantity !== "") {
            //     addToCart = true;
            // }
            obj.batch =
            {
                "batchId": batch.batchId,
                "batchNo": batch.batchNo,
                "batchQuantity": batch.batchQuantity,
                "batchTp": '',
                //"addToCart":batch.addToCart,
                "transferQuantity": batch.transferQuantity
            }

            obj.batchNo = batch.batchNo;
            obj.batchQuantity = batch.batchQuantity;
            obj.availableStockQuantity = batch.availableStockQuantity
            obj.quantity = parseInt(batch.transferQuantity);
            obj.rate = "";
            obj.batchTp = '';
            temp.push(obj)
            getProductWeightedAverageRate(temp, obj, batch);
        }
        else {
            showError("Please enter quantity");
            return;
        }

        // const temp = [...cartList]

        // const index = temp.findIndex(obj => obj.batchId == batch.id);

        // if(index > -1){
        //    temp[index].batch.push(
        //     {   
        //         "batchId":batch.id,
        //         "batchNo": batch.batch_no,
        //         "batchQty": batch.batchQuantity,
        //         "batchTp": '',
        //         "addToCart":true,
        //         "transferQuantity":batch.transferQuantity

        //     }
        //    )
        // }else{
        //     obj.batchId = batch.id;
        //     obj.productSku = selectedProductInfo.productSku;
        //     obj.productName = selectedProductInfo.productName;
        //     obj.productCategory = selectedProductInfo.productCategory;
        //     obj.batch = [
        //         {   
        //         "batchId":batch.id,
        //         "batchNo": batch.batch_no,
        //         "batchQuantity": batch.batchQuantity,
        //         "batchTp": '',
        //         "addToCart":true,
        //         "transferQuantity":batch.transferQuantity
        //         }
        //     ]
        //     obj.batchNo = batch.batch_no;
        //     obj.batchQuantity = batch.batchQuantity;
        //     obj.transferQuantity = event.target.value;
        //     obj.batchTp = '';
        //     temp.push(obj)
        //     console.log("Tmp",temp)
        // }
        //setCartList(temp)

    }
    const handleRemovetoCart = (data) => {
        //const productListTemp = [...cartList]
        //const proListIndex = productListTemp.findIndex((obj)=> obj.batchId === data.batchId)
        //for(let i = 0; i<data.batch.length;  i++){
        //let batchIndex = productListTemp[proListIndex].batch.findIndex((objId)=>objId.batchId === data.batchId)
        //let batchIndex = productListTemp.findIndex((objId)=>objId.batchId === data.batchId)
        //if(proListIndex > -1){
        // productListTemp[proListIndex].addToCart =false; 
        // }
        //}

        const batchIndex = cartList.findIndex(obj => obj.batchId == data.batchId);
        const removeCartObject = cartList[batchIndex];
        // if(batchTemp[batchIndex]) {
        //     batchTemp[batchIndex].addToCart = false;
        // }

        const batchTemp = { ...removeCartObject }
        batchTemp.addToCart = false;
        setBatchInfo(batchTemp)
        const temp = [...cartList]
        const index = temp.findIndex(obj => obj.batchId == data.batchId);
        //temp[index].batch.addToCart = false;
        temp.splice(index, 1);
        setCartList(temp)
    }

    const transferSubmit = () => {

        const transferData = { ...invTransfer, toDepotId: toDepotId }
        // const transactionDetails = [...invTransactionDetails]
        const transactionDetails = [...cartList]

        //const temp = [...invTransactionDetails]

        if (transferData.toDepotId === "") {
            showError("Please Select Transfer Depot")
            return false;
        }

        if (transactionDetails.length === 0) {
            showError("Please Add Product To Cart to Continue...")
            return false;
        }

        if (transferData.vehicleId === "") {
            showError("Please Select Vehicle...")
            return false;
        }
        //if(invReceive.depotId && toStoreId && quantity && rate) {
        saveStockTransfer(transferData, invTransactionDto, transactionDetails)
        //}
    }
    const saveStockTransfer = (transferData, invTransactionDto, invTransactionDetails) => {

        const URL = `${process.env.REACT_APP_API_URL}/api/inv-transfer`;
        axios.post(URL, JSON.stringify({
            ...transferData,
            invTransactionDto: invTransactionDto,
            invTransactionDetailsDtoList: invTransactionDetails
        }), { headers: { "Content-Type": "application/json" } }).then(response => {

            if (response.data.success === true) {
                showSuccess(response.data.message)
                setCartList([]);
                setBatchInfo({});
                setValue(null);
                setBatchNoList([]);
                setToDepotId('');
                setInvTransfer({ ...invTransfer, vehicleId: '' });
                document.getElementById("driverNameId").value = '';
                document.getElementById("toStoreId").value = '';
                document.getElementById("vehicleId").value = '';
                document.getElementById("driverContactNoId").value = '';
                document.getElementById('batch-qty-id').value = '';
                var cbs = document.getElementsByClassName("all-radio");
                for (var i = 0; i < cbs.length; i++) {
                    cbs[i].checked = false;
                }
                const getElements = document.getElementsByClassName('order-list-div');
                for (var i = 0; i < getElements.length; i++) {
                    getElements[i].classList.remove('select-order-list');
                }

            } else {
                showError(response.data.message);
            }
        }).catch(err => {
            showError("Cannot be Submitted");
        });
    }

    const getFromDepotInfo = (companyId, userLoginId) => {

        const URL = `${process.env.REACT_APP_API_URL}/api/depot/user-depot/${companyId}/${userLoginId}`;
        axios.get(URL).then(response => {

            setFromDepotInfo(response.data.data)
            setFromDepotId(response.data.data.id);
            setInvTransfer({ ...invTransfer, fromDepotId: response.data.data.id })

        }).catch(err => {
            //showError("Products not available...")
        });
    }

    const getToDepotInfo = (companyId) => {

        const URL = `${process.env.REACT_APP_API_URL}/api/depot/all-of-a-company/${companyId}`;
        axios.get(URL).then(response => {

            setToDepots(response.data.data);

        }).catch(err => {
            //showError("Products not available...")
        });
    }

    const getVehicleInfo = () => {

        const URL = `${process.env.REACT_APP_API_URL}/api/vehicle/all-active`;
        axios.get(URL).then(response => {
            setVehicleList(response.data.data);

        }).catch(err => {
            //showError("Products not available...")
        });
    }

    const handleTruckInfo = (event) => {
        setInvTransfer({ ...invTransfer, vehicleId: event.target.value })
    }

    const setDriverName = (event) => {
        setInvTransfer({ ...invTransfer, driverName: event.target.value })
    }

    const setDriverContactNo = (event) => {
        setInvTransfer({ ...invTransfer, driverContactNo: event.target.value })
    }

    const handleCancelChange = () => {

        // batchList.map((batch,index) => {

        //     batch.addToCart = false

        // })
        batchInfo.addToCart = false;
        setCartList([])
    }

    const storeWiseBatchDataSource = (productId) => {
        if (fromDepotId) {
            let queryString = "?";
            queryString += "companyId=" + companyId;
            queryString += "&depotId=" + fromDepotId;
            queryString += productId ? "&productId=" + productId : '';
            queryString += "&storeType=" + "REGULAR";
            queryString += "&searchString=" + '';
            if (productId) {
                const URL = `${process.env.REACT_APP_API_URL}/api/batch/depot-and-product-and-store-wise-info` + queryString;
                axios.get(URL).then(response => {

                    setBatchNoList(response.data.data);
                    document.getElementById('batch-qty-id').value = '';
                }).catch(err => {

                });
            }

        } else {
            showError("Depot is not found!");
        }


    }

    const checkPhoneValidation = (event) => {
        const phoneValidatorReg = /^(?:\+?88)?01[13-9]\d{0,8}$/;
        const phoneNo = event.target.value;
        alert(phoneNo)
        if (!phoneValidatorReg.test(phoneNo)) {

            event.preventDefault();
        } else {

        }
    }

    const handleSearchChange = (event) => {
        let value = event.target.value;
        getSearchList(value);
    }

    const getSearchList = (searchText) => {
        let searchTextValue = searchText.toLowerCase();
        let tp = [];
        for (let i = 0; i < searchProductList.length; i++) {
            let productSku = searchProductList[i].productSku.toLowerCase();
            let productName = searchProductList[i].productName.toLowerCase();
            if (productSku.includes(searchTextValue)
                || productName.includes(searchTextValue)
            ) {
                tp.push(searchProductList[i]);
            }
        }
        setProductList(tp);
    }

    return (
        <>
            <div className="container-fluid" id="myFullScreen" style={{ background: "#f3f6f9" }}>
                {/* HEADER ROW */}
                <StockSendHeader openFullscreen={openFullscreen} closeFullscreen={closeFullscreen} />

                {/* FROM TO AND ADDITIONAL INFO ROW */}
                <StockFromToSend fromDepotInfo={fromDepotInfo} toDepots={toDepots}
                    setToDepotId={setToDepotId}
                    fromDepotId={fromDepotId} />

                <div className="row">
                    {/* LEFT SIDE PRODUCT ROW  */}
                    <div className="col-xl-9">
                        {/* STOCK SEND TITLE ROW */}
                        <StockTransferProductTitle />

                        {/* SEARCH OR QR SCAN ROW */}
                        <div className="mt-5">
                            <div style={{ position: "absolute", padding: "7px", marginTop: "7px" }}>
                                <img src={toAbsoluteUrl("/images/search.png")} width="20px" height="20px" />
                            </div>
                            <form className="form form-label-right">
                                <input type="text" className="form-control h-50px" name="searchText"
                                    placeholder="Scan/Search Product by QR Code or Name" style={{ paddingLeft: "28px" }} />
                            </form>
                            <div style={{ float: "right", padding: "7px", marginTop: "-42px" }}>
                                <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/barcode.svg")} width="20px" height="20px" />
                            </div>
                        </div>

                        {/* STOCK SEND LIST DATA */}
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
                            <div className="mt-5">
                                <div style={{ position: "absolute", padding: "7px", marginTop: "3px" }}>
                                    <img src={toAbsoluteUrl("/images/search.png")} width="20px" height="20px" />
                                </div>
                                <form className="form form-label-right">
                                    <input type="text" className="form-control" id="searchText" name="searchText"
                                        placeholder="Search Here" style={{ paddingLeft: "28px" }}
                                        onChange={handleSearchChange}
                                    />
                                </form>
                            </div>
                                {
                                    productList.map((product, index) => (
                                        <div className="order-list-div" style={{ cursor: "pointer" }} onClick={() => handleSelectProduct(index, product)} id={"product-id-" + index}>
                                            {/* only load regular stock available products for send */}
                                            {product.regularStock > 0 ?
                                                <Card className="p-3 mt-5">
                                                    <CardBody>
                                                        <div className="position-absolute" style={{ left: "17px", top: "43px" }}>
                                                            <span><input className="all-radio" type="radio" id={"product-radio-id-" + index} /></span>
                                                        </div>
                                                        <div className="mt-1">
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
                                                            <strong>
                                                                {product.regularStock}
                                                                
                                                                {/* {product.regularStock ? product.regularStock : 0}(Pcs) */}
                                                            </strong>
                                                        </div>
                                                    </CardBody>
                                                </Card>
                                                : ""}
                                        </div>
                                    ))
                                }
                            </div>

                            {/* BATCHES ROW */}
                            <div className="col-xl-5">
                                <BatchList selectedProductInfo={selectedProductInfo}
                                    handleTransfer={handleTransfer}
                                    batchInfo={batchInfo} setBatchInfo={setBatchInfo}
                                    value={value} setValue={setValue} batchNoList={batchNoList}
                                    storeWiseBatchDataSource={storeWiseBatchDataSource}
                                    blockedQuantity={blockedQuantity}
                                    regularQuantity={regularQuantity} />
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDE CART ROW  */}
                    <div className="col-xl-3 mb-5">
                        <div className="mt-5">
                            {/* CART TITLE ROW */}
                            <Card style={{ borderTopRightRadius: "30px", borderTopLeftRadius: "30px" }}>
                                <CardBody>
                                    <div>
                                        <span className="text-muted">Title</span><br />
                                        <strong>Stock Transfer</strong>
                                    </div>
                                    <div className="mt-5">
                                        <span className="text-muted"><strong>PRODUCTS</strong></span>
                                        <span className="text-muted float-right"><strong>ACTION</strong></span>
                                    </div>
                                </CardBody>
                            </Card>

                            {/* CART LIST DATA ROW */}
                            <div className="mt-5">
                                {
                                    cartList.map((obj, index) => (

                                        <Card className="mt-5">
                                            <CardBody>
                                                <div className="d-flex">
                                                    <div className="ml-n3 mt-3"><span className="rounded light-gray-bg pl-2 pr-2">{index + 1}</span></div>
                                                    <div className="w-100 pl-5">
                                                        <div>
                                                            <button className="btn float-right" style={{ background: "#F9F9F9", color: "#0396FF" }} onClick={() => handleRemovetoCart(obj)}>
                                                                <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/red-delete.svg")} />
                                                            </button>
                                                        </div>
                                                        <div>
                                                            <span className="text-muted">{obj.productSku}</span><br />
                                                            <strong>{obj.productName}</strong><br />
                                                            <span className="text-muted">{obj.productCategory}</span><br />
                                                            <span className="text-muted">
                                                                <SVG className="mr-1" src={toAbsoluteUrl("/media/svg/icons/project-svg/price-gray.svg")} width="15px" height="15px" />Current W.A. Rate
                                                                <strong>{" " + obj.rate}</strong>
                                                            </span>
                                                        </div>
                                                        <div className="mt-5" style={{ border: "1px solid #F2F2F2", width: "100%" }}></div>
                                                        {
                                                            //obj.batch.map((batchData,index)=>(

                                                            <div className="mt-5">
                                                                <strong className="dark-gray-color mr-5">{obj.batch.batchNo}</strong>
                                                                <span className="bg-light dark-gray-color p-1 rounded mr-3">{obj.batch.batchQuantity}</span>
                                                                <span className="bg-light dark-gray-color p-1 rounded">{obj.batch.batchTp}</span><br />
                                                                <span><span>Transfer Qty.</span><strong>{obj.batch.transferQuantity}</strong></span>
                                                            </div>
                                                            //))

                                                        }
                                                        <div className="mt-5" style={{ border: "1px solid #F2F2F2", width: "100%" }}></div>
                                                        {/* TOTAL QTY ROW */}
                                                        <div className="mt-3">
                                                            {/* <span><span>Transfer Qty.</span><strong>{obj.transferQuantity}</strong></span> */}
                                                            {/* <span className="float-right">
                                                    <span className="mr-1">Qty. UOM</span><strong>2,948,920</strong>
                                                </span> */}
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardBody>
                                        </Card>
                                    ))
                                }
                            </div>

                            {/* TRANSPORT INFO ROW */}
                            <Card className="mt-4">
                                <CardBody>
                                    <div className="mt-3">
                                        <span className="display-inline-block rounded light-gray-bg pl-2 pt-1 pb-1 pr-2 mr-5">
                                            <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/delivery.svg")} />
                                        </span>
                                        <strong className="display-inline-block">ADD Transport</strong>
                                    </div>
                                    {/* <div className="mt-5 ml-5">
                            <span className="dark-blue-color">From</span><br />
                            <small className="text-muted">
                                Flat- 7B, Plot No- 3/1, Block- F, Lalmatia 1207 Dhaka, Dhaka Division, Bangladesh
                            </small><br />
                            <span className="dark-purple-color">To</span><br />
                            <small className="text-muted">
                                Flat- 7B, Plot No- 3/1, Block- F, Lalmatia 1207 Dhaka, Dhaka Division, Bangladesh
                            </small>
                        </div> */}
                                    <div className="mt-5 ml-5">
                                        <span>
                                            <label className="level-title">Vehicle No<span className="text-danger">*</span></label>
                                            <select className="form-control" id="vehicleId" onChange={handleTruckInfo}>
                                                <option value="">Choose Vehicle No</option>
                                                {vehicleList.map((vehicle) => (
                                                    <option key={vehicle.registrationNo} value={vehicle.id}>
                                                        {vehicle.registrationNo}
                                                    </option>
                                                ))}
                                            </select>
                                        </span><br />

                                        <span className="mt-5">
                                            <label className="level-title">Driver Name<span className="text-danger"></span></label>
                                            <input maxLength={40} id="driverNameId" placeholder="Enter Driver Name" onChange={setDriverName} type="text" className="form-control" />
                                        </span><br />

                                        <span className="mt-5">
                                            <label className="level-title">Driver Contact No<span className="text-danger"></span></label>
                                            <input maxLength={13} type="tel"
                                                onKeyPress={e => allowOnlyNumeric(e)} onPaste={handlePasteDisable}
                                                id="driverContactNoId" placeholder="Enter Driver Contact No." onChange={setDriverContactNo} className="form-control" />
                                        </span>
                                    </div>
                                </CardBody>
                            </Card>


                            {/* TOTAL CART ROW */}
                            <Card className="mt-4" style={{ borderBottomRightRadius: "30px", borderBottomLeftRadius: "30px" }}>
                                <CardBody>
                                    {/* TOTAL W.A. RATE ROW */}
                                    {/* <div className="mt-3">
                            <span>Total W.A. Rate</span>
                            <strong className="float-right">{cartList.reduce((total, cart) => total = total + cart.rate,0)}</strong>
                        </div> */}

                                    {/* TOTAL PRODUCT LIST ROW */}
                                    {/* <div className="mt-3">
                            <span>Total Product List</span>
                            <span className="float-right">
                                <strong>
                                    4
                                </strong>
                            </span>
                        </div> */}

                                    {/* TOTAL PRODUCT QTY ROW */}
                                    <div className="mt-3">
                                        <strong className="level-title">Total Transfer Qty.</strong>
                                        <span className="float-right">
                                            <strong>
                                                {cartList.reduce((total, cart) => total = total + cart.quantity, 0)}
                                            </strong>
                                        </span>
                                    </div>

                                    <div className="mt-5">
                                        <button className="btn dark-danger-color" onClick={() => handleCancelChange()} style={{ background: "#F9F9F9", color: "#0396FF" }}>
                                            <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/reject.svg")} />
                                            &nbsp;<strong>Cancel</strong>
                                        </button>
                                        <button className="btn text-white mr-3 float-right" onClick={transferSubmit} style={{ background: "#6FCF97" }}>
                                            <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/white-receive.svg")} />
                                            &nbsp;<strong>Submit Transfer</strong>
                                        </button>
                                    </div>
                                </CardBody>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}