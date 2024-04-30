import React, { useState, useEffect } from "react";
import { toAbsoluteUrl } from "../../../../../../_metronic/_helpers";
import SVG from "react-inlinesvg";
import { Card } from "react-bootstrap";
import { CardBody } from "../../../../../../_metronic/_partials/controls";
import axios from 'axios';
import { showError, showSuccess } from '../../../../../pages/Alert';
import ProductCategoryTreeView from '../../../../SalesCollection/CommonComponents/ProductCategoryTreeView';
import NewQAHeader from "./NewQAHeader";
import NewQAFromToSend from "./NewQAFromToSend";
import NewQATitle from "./NewQATitle";
import { useLocation } from "react-router-dom";
import { Autocomplete } from "@material-ui/lab";
import { TextField } from "@material-ui/core";
import { allowOnlyNumeric } from "../../../../Util";
import { set } from "lodash";

export default function NewQA() {

    const location = useLocation();
    const companyId = location.state.companyId;
    const userLoginId = location.state.userLoginId;
    const [batchInfo, setBatchInfo] = useState({});
    const [file, setFile] = useState();
    const [value, setValue] = useState(null);
    const [storeId, setStoreId] = useState();
    const [depotId, setDepotId] = useState('');
    const [storeType, setStoreType] = useState('');
    const [batchNoList, setBatchNoList] = useState([]);
    const [fromDepots, setFromDepots] = useState([]);
    const [stores, setStores] = useState([]);
    const [vehicleList, setVehicleList] = useState([]);
    const [selectedProductId, setSelectedProductedId] = useState('');
    const [selectedProductCategory, setSelectedProductCategory] = useState('');
    const [searchParams, setSearchParams] = useState({
        userLoginId: userLoginId,
        companyId: companyId, selectedProductCategory: selectedProductCategory
    });
    const [productList, setProductList] = useState([])
    const [producCategoryTree, setLocationProductCategory] = useState([]);
    const [batchList, setBatchList] = useState([]);
    const [cartList, setCartList] = useState([]);
    const [fromDepotInfo, setFromDepotInfo] = useState({});
    const [fromDepotId, setFromDepotId] = useState('');
    const [toDepotId, setToDepotId] = useState('');
    // const [changeStore, setChangeStore] = useState('');
    const [selectedProductInfo, setSelectedProductInfo] = useState({});
    const [qaInspection, setQAInspection] = useState({
        storeId: storeId, companyId: companyId, depotId: depotId, qaBy: userLoginId
    });

    const [batchAvailableQcStock, setBatchAvailableQcStock] = useState({});
    
    useEffect(() => {
        document.getElementById('full-screen-close-icon').style.display = "none";
        getProductCategoryTreeList(companyId)
        getFromDepotInfo(companyId, userLoginId);
        getToStore(companyId);
    }, [companyId])

    useEffect(() => {
        setBatchList([]);
        setBatchNoList([]);
        setSelectedProductedId('');
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

    useEffect(() => {
        setBatchNoList([]);
        setBatchInfo({});
        setValue(null);     
    }, [storeId])

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
        });}
    }
    const selectTreeNode = (node) => {
        if (!storeId) {
            showError("Please select store");
            return;
        }
        setSelectedProductCategory(node)
        const paramsData = { ...searchParams, selectedProductCategory: node.id }
        //getAllProductsOfACompany(paramsData)
        getDepotWiseStockDetails(paramsData);
        setBatchInfo({});
        setBatchNoList([]);
        setValue('');
        document.getElementById('qa-qty-id').value = '';
        document.getElementById('pass-qty-id').value = '';
        document.getElementById('fail-qty-id').value = '';
    }

    const getDepotWiseStockDetails = (params) => {

        let queryString = "?";
        queryString += "&companyId=" + params.companyId;
        queryString += "&userLoginId=" + params.userLoginId;
        queryString += depotId ? "&depotId=" + depotId : "";
        queryString += params.selectedProductCategory ? "&productCategoryId=" + params.selectedProductCategory : '';

        const URL = `${process.env.REACT_APP_API_URL}/api/stock/depot-wise-stock-data` + queryString;
        axios.get(URL).then((response) => {
            setProductList(response.data.data);

        }).catch();
    }

    const handleSelectProduct = (number, product) => {
        if (!storeId) {
            showError("Please select store");
            return;
        }
        // FOR SELECTED CARD BTN
        if (selectedProductId !== product.productId) {
            setBatchInfo({});
            setValue(null);
            setBatchNoList([]);
            setSelectedProductedId(product.productId);
            setSelectedProductInfo({
                productSku: product.productSku, productName: product.productName,
                productCategory: product.productCategory
            })
        }

        //batchList.map((batch, index) => {
        document.getElementById('qa-qty-id').value = '';
        document.getElementById('pass-qty-id').value = '';
        document.getElementById('fail-qty-id').value = '';

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
        
        storeWiseBatchDataSource(product.productId); //for autocomplete data
    }

    const getProductAllBatchInfo = (companyId, productId, depotId) => {

        const URL = `${process.env.REACT_APP_API_URL}/api/inv-transfer/product-wise-batch-stock-info/${companyId}/${productId}/${depotId}`;
        axios.get(URL).then(response => {
            setBatchList(response.data.data);
        }).catch(err => {
        });
    }

    const getProductsBatchAvailableQcInfo = (productId, batchId) => {
        if (companyId) {
            const URL = `${process.env.REACT_APP_API_URL}/api/quality-inspection/product-batch-available-qc-stock/${companyId}/${productId}/${batchId}/${fromDepotId}`;
            axios.get(URL).then(response => {
                setBatchAvailableQcStock(response.data.data);
            }).catch(err => {
            });
        }
    }


    const handleTransfer = (batch, selectedProductInfo, i, event) => {
        let qaQty = document.getElementById('qa-qty-id').value;
        let passQty = document.getElementById('pass-qty-id').value;
        let failQty = document.getElementById('fail-qty-id').value;

        let totalQty = (passQty > 0 ? Number(passQty) : 0) + (failQty > 0 ? Number(failQty) : 0);

        if (parseInt(passQty) > batch.availableStockQuantityForQC) {
            showError("Invalid Pass or Failed Quantity");
            return false;
        }
        const temp = []
        let obj = {}
        if (passQty !== "") {
            obj.productId = batch.productId;
            obj.productSku = selectedProductInfo.productSku;
            obj.productName = selectedProductInfo.productName;
            obj.productCategory = selectedProductInfo.productCategory;
            obj.batchId = batch.batchId;
            obj.batchNo = batch.batchNo;
            obj.batchQuantity = batch.batchQuantity;
            obj.availableStockQuantityForQC = batch.availableStockQuantityForQC;
            obj.qaQuantity = parseInt(qaQty);
            obj.passQty = parseInt(passQty);
            obj.quantity = parseInt(passQty);
            obj.status = "PASS";
            temp.push(obj);
        }
        let data = {}
        if (failQty !== "") {
            data.productId = batch.productId;
            data.productSku = selectedProductInfo.productSku;
            data.productName = selectedProductInfo.productName;
            data.productCategory = selectedProductInfo.productCategory;
            data.batchId = batch.batchId;
            data.batchNo = batch.batchNo;
            data.batchQuantity = batch.batchQuantity;
            data.availableStockQuantityForQC = batch.availableStockQuantityForQC;
            data.qaQuantity = parseInt(qaQty);
            data.failQty = parseInt(failQty);
            data.quantity = parseInt(failQty);
            data.status = "FAILED";
            temp.push(data);
        }
        if (selectedProductId === "") {
            showError("Select A Product")
            return false;
        }
        if (batch.batchId === undefined) {
            showError("Select Provide Batch Info")
            return false;
        }
        if (qaQty === "") {
            showError("Enter your qa qty.")
            return false;
        }
        if (passQty === "" && failQty === "") {
            showError("Enter your pass or fail qty.")
            return false;
        }
        if (parseInt(totalQty) != parseInt(qaQty)) {
            showError("Invalid Pass or Failed Quantity");
            return false;
        }
        if (cartList.length === 0) {
            batch.addToCart = true;
            setCartList(temp)
        } else {
            let index = cartList.findIndex((obj) => obj.productId == batch.productId && obj.batchId == batch.batchId)
            if (index > -1) {
                if (cartList[index].status === obj.status || cartList[index].status === data.status) {
                    showError(`Delete ${cartList[index].status} Quantity From Cart`)
                    return false;
                } else {
                    let newCart = [...cartList, ...temp]
                    batch.addToCart = true;
                    setCartList(newCart)
                }
            } else {
                let newCart = [...cartList, ...temp]
                batch.addToCart = true;
                setCartList(newCart)
            }
        }

    }
    const handleRemovetoCart = (data, index) => {
        if (selectedProductId !== data.productId) {
            setBatchInfo({});
            setValue(null);
            setBatchNoList([]);
            setSelectedProductedId(data.productId);
            setSelectedProductInfo({
                productSku: data.productSku, productName: data.productName,
                productCategory: data.productCategory
            })
        }
        document.getElementById('qa-qty-id').value = data.qaQuantity;
        document.getElementById('pass-qty-id').value = data.passQty === "" || data.passQty === undefined ? "" : data.passQty;
        document.getElementById('fail-qty-id').value = data.failQty === "" || data.failQty === undefined ? "" : data.failQty;
        data.addToCart = false;
        console.log("when cart remove data", data);
        setBatchInfo(data)
        let id = "product-id-" + data.productId;
        const getId = document.getElementById(id);
        const getElements = document.getElementsByClassName('order-list-div');
        for (var i = 0; i < getElements.length; i++) {
            getElements[i].classList.remove('select-order-list');
        }
        // FOR RADIO BTN
        let radioId = "product-radio-id-" + data.productId;
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
            let index = temp.findIndex((obj) => obj.id === data.productId);
            getProductAllBatchInfo(companyId, data.productId, fromDepotId);
        }
        const temp = [...cartList]
        temp.splice(index, 1);
        setCartList(temp)
    }

    const getFromDepotInfo = (companyId, userLoginId) => {

        const URL = `${process.env.REACT_APP_API_URL}/api/depot-quality-assurance-map/qa-depot/${userLoginId}`;
        axios.get(URL).then(response => {

            setFromDepotInfo(response.data.data)
            setFromDepotId(response.data.data.id);
            setDepotId(response.data.data.id);
            setQAInspection({ ...qaInspection, depotId: response.data.data.id })

        }).catch(err => {
        });
    }

    const getToStore = (companyId) => {
        const storeTypes = ['QUARANTINE', 'RESTRICTED'];
        let queryString = "?";
        queryString += "storeTypes=" + storeTypes;
        const URL = `${process.env.REACT_APP_API_URL}/api/store/store-type-wise` + queryString;
        axios.get(URL).then(response => {

            setStores(response.data.data);

        }).catch(err => {
        });
    }


    const handleCancelChange = () => {
        batchInfo.addToCart = false;
        setCartList([])
    }

    const storeWiseBatchDataSource = (productId) => {

        if (depotId === undefined) {
            showError("Depot Not Found for This User");
            return false;
        }
        let queryString = "?";
        queryString += "companyId=" + companyId;
        queryString += "&depotId=" + depotId;
        queryString += productId ? "&productId=" + productId : '';
        queryString += "&storeType=" + storeType;
        queryString += "&searchString=" + '';
        //queryString += "&searchString=" + productId;
        if (productId) {
          
        const URL = `${process.env.REACT_APP_API_URL}/api/batch/depot-and-product-and-store-wise-info` + queryString;
        axios.get(URL).then(response => {
            setBatchNoList(response.data.data);
            console.log("batchInfo", response.data.data);
            document.getElementById('qa-qty-id').value = '';
            document.getElementById('pass-qty-id').value = '';
            document.getElementById('fail-qty-id').value = '';
        }).catch(err => {

        });  
    }
    }
    const qaFileUpload = (event) => {
        setFile(event.target.files[0]);
        const fileName = event.target.files[0].name;
        const setId = document.getElementById('qaFileName');
        setId.innerHTML = fileName;
    }

    const qaInspectionSubmit = (event) => {

        if (cartList.length == 0) {
            showError("Add Product to Inspect Quality")
            return false;
        }

        const qualityInspectionDetails = [...cartList]

        const qaInspectData = { ...qaInspection, storeId: storeId, qualityInspectionDetails: qualityInspectionDetails }
        let formData = new FormData();

        if (file != undefined) {
            formData.append("file", file);
        }

        formData.append("qualityInspectionData", new Blob([JSON.stringify(qaInspectData)], { type: "application/json" }));

        saveQAInspection(formData)
    }

    const handleQAQtyChange = (event) => {
        const availableQcQty = parseInt(batchInfo.availableStockQuantityForQC) -
            parseInt(batchInfo.availableStockQuantity);

        if (parseInt(event.target.value) > availableQcQty) {

            showError("Invalid QA Quantity");
            document.getElementById("qa-qty-id").value = '';
            return false;
        }

    }

    const handlePassQtyChange = (event) => {
        const failQty = document.getElementById("fail-qty-id").value;
        const validFailQty = isNaN(parseInt(failQty)) ? 0 : parseInt(failQty);

        if (parseInt(event.target.value) + validFailQty > batchInfo.availableStockQuantityForQC) {

            showError("Invalid Pass Quantity");
            document.getElementById("pass-qty-id").value = '';
            return false;
        }

    }

    const handleFailQtyChange = (event) => {

        const failQty = document.getElementById("fail-qty-id").value;

        if (parseInt(failQty) === 0) {
            showError("Invalid Fail Quantity");
            document.getElementById("fail-qty-id").value = '';
            return;
        }
        const passQty = document.getElementById("pass-qty-id").value;
        const validPassQty = isNaN(parseInt(passQty)) ? 0 : parseInt(passQty);

        if (parseInt(event.target.value) + validPassQty > batchInfo.availableStockQuantityForQC) {

            showError("Invalid Fail Quantity");
            document.getElementById("fail-qty-id").value = '';
            return false;
        }

    }

    const saveQAInspection = (formData) => {
        const URL = `${process.env.REACT_APP_API_URL}/api/quality-inspection`;
        axios.post(URL, formData, { headers: { "Content-Type": false } }).then(response => {

            if (response.data.success === true) {
                showSuccess(response.data.message)
                setCartList([]);
                setBatchInfo({});
                setValue(null);
                setBatchNoList([]);
                setToDepotId('');
                setQAInspection({ ...qaInspection });
                document.getElementById("qa-qty-id").value = '';
                document.getElementById("pass-qty-id").value = '';
                document.getElementById("fail-qty-id").value = '';
                document.getElementById("qaFile").value = '';
                // document.getElementById('batch-qty-id').value = '';
                // FOR product card deselect      
                const getElements = document.getElementsByClassName('order-list-div');
                for (var i = 0; i < getElements.length; i++) {
                    getElements[i].classList.remove('select-order-list');
                }
                // FOR RADIO BTN            
                var cbs = document.getElementsByClassName("all-radio");
                for (var i = 0; i < cbs.length; i++) {
                    cbs[i].checked = false;
                }

            } else {
                showError(response.data.message);
            }
        }).catch(err => {
            showError("Cannot be Submitted");
        });
    }

    return (
        <>
            <div className="container-fluid" id="myFullScreen" style={{ background: "#f3f6f9" }}>
                {/* HEADER ROW */}
                <NewQAHeader openFullscreen={openFullscreen} closeFullscreen={closeFullscreen} />

                {/* FROM TO AND ADDITIONAL INFO ROW */}
                <NewQAFromToSend fromDepotInfo={fromDepotInfo} stores={stores}
                    setToDepotId={setToDepotId}
                    fromDepotId={fromDepotId}
                    setStoreId={setStoreId}
                    setStoreType={setStoreType} />

                <div className="row">
                    {/* LEFT SIDE PRODUCT ROW  */}
                    <div className="col-xl-9">
                        {/* TITLE ROW */}
                        <NewQATitle />

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

                        {/* DATA LIST */}
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
                                    productList.map((product, index) => (
                                        storeType==='QUARANTINE' && product.quarantineStock !== null ?
                                        <div className="order-list-div" style={{ cursor: "pointer" }} onClick={() => handleSelectProduct(product.productId, product)} id={"product-id-" + product.productId}>
                                            <Card className="p-3 mt-5">
                                                <CardBody>
                                                    <div className="position-absolute" style={{ left: "17px", top: "43px" }}>
                                                        <span><input className="all-radio" type="radio" id={"product-radio-id-" + product.productId} /></span>
                                                    </div>
                                                    <div className="mt-1">
                                                        <span className="text-muted">{product.productSku}</span><br />
                                                        <strong>{product.productName}</strong><br />
                                                        <span className="text-muted">{product.productCategory}</span><br />
                                                    </div>
                                                </CardBody>
                                            </Card>
                                        </div>
                                        :
                                        storeType==='RESTRICTED' && product.restrictedStock !== null ?
                                        <div className="order-list-div" style={{ cursor: "pointer" }} onClick={() => handleSelectProduct(product.productId, product)} id={"product-id-" + product.productId}>
                                            <Card className="p-3 mt-5">
                                                <CardBody>
                                                    <div className="position-absolute" style={{ left: "17px", top: "43px" }}>
                                                        <span><input className="all-radio" type="radio" id={"product-radio-id-" + product.productId} /></span>
                                                    </div>
                                                    <div className="mt-1">
                                                        <span className="text-muted">{product.productSku}</span><br />
                                                        <strong>{product.productName}</strong><br />
                                                        <span className="text-muted">{product.productCategory}</span><br />
                                                    </div>
                                                </CardBody>
                                            </Card>
                                        </div>
                                        : ''
                                    ))
                                }
                            </div>

                            {/* BATCHES ROW */}
                            <div className="col-xl-5">
                                <div>
                                    <Card className="mt-5" id="autocomplete-id">
                                        <CardBody>
                                            <Autocomplete
                                                options={batchNoList}
                                                freeSolo
                                                //onKeyUp={storeWiseBatchDataSource}
                                                getOptionLabel={(option) => option.batchNo}
                                                value={value}
                                                onChange={(event, newValue) => {
                                                    if (newValue) {
                                                        setValue(newValue)
                                                        setBatchInfo(newValue);
                                                    }
                                                }}
                                                renderInput={(params) => (
                                                    <TextField {...params} label="Batch" id="batch-search" />
                                                )}
                                            />
                                        </CardBody>
                                    </Card>
                                    <Card className="mt-5  pt-3 ">
                                        <CardBody>
                                            {/* BATCH INFO ROW */}
                                            <div>
                                                <span className="float-right">
                                                    {
                                                        batchInfo.addToCart ?
                                                            <span id="transferred-id-" className="float-right light-success-bg dark-success-color p-3 mt-n3 rounded">Received</span> :
                                                            <span id="transfer-id-" className="float-right">
                                                                <button className="btn text-white float-right mt-n3" style={{ background: "#6FCF97" }} onClick={(e) => handleTransfer(batchInfo, selectedProductInfo, e)}>
                                                                    <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/white-receive.svg")} />
                                                                    &nbsp;Receive
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
                                                    <strong>{batchInfo.availableStockQuantityForQC}</strong>
                                                </span><br />
                                                <span>
                                                    <span className="text-muted mr-2">Available QC Qty:</span>
                                                    
                                                    <strong>{Object.keys(batchInfo).length !== 0 
                                                    ?  batchInfo.remainingQcQuantity 
                                                    : ""}</strong>
                                                </span>
                                            </div>
                                            {/* QA QTY ROW */}
                                            <div className="d-flex flex-wrap">
                                                <div className="mt-5 mr-5">
                                                    <div>QA Qty.</div>
                                                    <div className="mt-5">
                                                        <input type="text" required id="qa-qty-id" onChange={handleQAQtyChange} onKeyPress={(e) => allowOnlyNumeric(e)} className="mt-n5 border w-100 rounded p-3" placeholder="QA QTY." />
                                                    </div>
                                                </div>
                                                <div className="mt-5 mr-5">
                                                    <div className="dark-success-color">Pass Qty.</div>
                                                    <div className="mt-5">
                                                        <input type="text" required id="pass-qty-id" onChange={handlePassQtyChange} onKeyPress={(e) => allowOnlyNumeric(e)} className="mt-n5 border w-100 rounded p-3" placeholder="Pass QTY." />
                                                    </div>
                                                </div>
                                                <div className="mt-5">
                                                    <div className="dark-danger-color">Fail Qty.</div>
                                                    <div className="mt-5">
                                                        <input type="text" required id="fail-qty-id" onChange={handleFailQtyChange} onKeyPress={(e) => allowOnlyNumeric(e)} className="mt-n5 border w-100 rounded p-3" placeholder="Fail QTY." />
                                                    </div>
                                                </div>
                                            </div>
                                        </CardBody>
                                    </Card>
                                </div>
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
                                        <strong>QA Receive</strong>
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
                                                            <button className="btn float-right" style={{ background: "#F9F9F9", color: "#0396FF" }} onClick={() => handleRemovetoCart(obj, index)}>
                                                                <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/red-delete.svg")} />
                                                            </button>
                                                        </div>
                                                        <div>
                                                            <span className="text-muted">{obj.productSku}</span><br />
                                                            <strong>{obj.productName}</strong><br />
                                                            <span className="text-muted">{obj.productCategory}</span>
                                                        </div>
                                                        <div className="mt-5" style={{ border: "1px solid #F2F2F2", width: "100%" }}></div>
                                                        <div className="mt-5">
                                                            <div className="d-flex flex-wrap justify-content-between">
                                                                <div><strong className="dark-gray-color mr-5">{obj.batchNo}</strong></div>
                                                                {
                                                                    obj.status === "PASS" ?
                                                                        <div>
                                                                            <span className="float-right light-success-bg dark-success-color p-2 rounded">{obj.status}</span>
                                                                        </div> :
                                                                        obj.status === "FAILED" ?
                                                                            <div><span className="float-right light-danger-bg dark-danger-color p-2 rounded">{obj.status}</span></div> : ""
                                                                }
                                                            </div>
                                                            <div className="mt-5 d-flex flex-wrap justify-content-between">
                                                                <div><span className="bg-light dark-gray-color p-1 rounded mr-3">{"Batch Qty. " + obj.batchQuantity}</span></div>
                                                                <div><span className="float-right bg-light dark-gray-color p-1 rounded mr-3">{"Stock Qty. " + obj.availableStockQuantityForQC}</span></div>
                                                            </div>
                                                            <div className="mt-2"><span><span>{obj.status === "PASS" ? "Pass Qty." : obj.status === "FAILED" ? "Fail Qty." : ""}</span><strong>{obj.status === "PASS" ? obj.passQty : obj.status === "FAILED" ? obj.failQty : ""}</strong></span></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardBody>
                                        </Card>
                                    ))
                                }
                            </div>

                            {/* QA REPORT ATTACHMENT INFO ROW */}
                            <Card className="mt-4">
                                <CardBody>
                                    <div className="mt-3">
                                        <span className="display-inline-block rounded light-gray-bg pl-2 pt-1 pb-1 pr-2 mr-5">
                                            <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/gray-attach-file.svg")} />
                                        </span>
                                        <strong className="display-inline-block">QA Report Attachment</strong>
                                    </div>
                                    <div className="mt-5">
                                        <button className="btn-warning-test mt-3 sales-chip border-success text-success text-center" style={{ width: "100%" }}>
                                            <span>
                                                <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/blue-up-arrow.svg")} width="15px" height="15px" />
                                                &nbsp;
                                                <span id="qaFileName">Upload Attachment File(Format doc, PDF)</span>
                                            </span>
                                            <input type="file" accept="doc,pdf" id="qaFile" onChange={qaFileUpload}></input>
                                        </button>
                                    </div>
                                </CardBody>
                            </Card>
                            {/* SUBMIT CART ROW */}
                            <Card className="mt-4" style={{ borderBottomRightRadius: "30px", borderBottomLeftRadius: "30px" }}>
                                <CardBody>
                                    <div className="mt-5">
                                        <button className="btn dark-danger-color" onClick={() => handleCancelChange()} style={{ background: "#F9F9F9", color: "#0396FF" }}>
                                            <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/reject.svg")} />
                                            &nbsp;<strong>Cancel</strong>
                                        </button>
                                        <button className="btn text-white mr-3 float-right"
                                            onClick={qaInspectionSubmit}
                                            style={{ background: "#6FCF97" }}>
                                            <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/white-receive.svg")} />
                                            &nbsp;<strong>QA Inspection Submit</strong>
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