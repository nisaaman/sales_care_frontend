import React, { useState, useEffect, useMemo, useRef } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { toAbsoluteUrl } from "../../../../../../../../../_metronic/_helpers";
import SVG from "react-inlinesvg";
import { Card } from "react-bootstrap";
import { CardBody } from "../../../../../../../../../_metronic/_partials/controls";
import axios from 'axios';
import { showError, showSuccess } from '../../../../../../../../pages/Alert';
import ProductCategoryTreeView from '../../../../../../../SalesCollection/CommonComponents/ProductCategoryTreeView';
import Autocomplete from "@material-ui/lab/Autocomplete";
import { TextField } from "@material-ui/core";
import { shallowEqual, useSelector } from "react-redux";
import { allowOnlyNumeric, allowOnlyNumericWithPeriodAndRestrictDecimalTwo, handlePasteDisable } from "../../../../../../../Util";
import BarcodeReader from 'react-barcode-reader';


export default function NewProductionReceive() {

    const location = useLocation();
    const batchRegex = /(\d+-[a-zA-Z\d]+-\d+-\d+-\d+)/;
    const rcvQtyRegex = /IQR:\s*(\w+)/;

    let history = useHistory();
    const companyId = location.state.companyId;
    const userLoginId = location.state.userLoginId;
    const [value, setValue] = React.useState(null);
    const [selectedProductCategory, setSelectedProductCategory] = useState('');
    const [searchParams, setSearchParams] = useState({ companyId: companyId, selectedProductCategory: selectedProductCategory });
    const [productList, setProductList] = useState([])
    const [searchProductList, setSearchProductList] = useState([])
    const [producCategoryTree, setProductCategoryTree] = useState([]);
    const [selectedProductId, setSelectedProductedId] = useState('');
    const [batchNoList, setBatchNoList] = useState([]);
    const [batchId, setBatchId] = React.useState('');
    const [batchInfo, setBatchInfo] = useState([]);
    const [invReceive, setInvReceive] = useState({ remarks: "", companyId: companyId, depotId: '' });
    const [invTransactionDto, setInvTransactionDto] = useState({ transactionType: "PRODUCTION_RECEIVE" });
    const [centralDepotList, setCentralDepotList] = useState([]);
    const [quantity, setQuantity] = useState('');
    const [rate, setRate] = useState('');
    const [remarks, setRemarks] = useState('');
    const [batchQuantity, setBatchQuantity] = useState('');
    const [batchNo, setBatchNo] = useState('');
    const [storeList, setStoreList] = useState([]);
    const [toStoreId, setToStoreId] = useState('');
    const [receivedQuantity, setReceivedQuantity] = useState(0);
    const [qrCode, setQRCode] = useState('');
    const [redirect, setRedirect] = useState(false);
    const [receiveQuantity, setReceiveQuantity] = useState('');
    const [iqrQty, setIqrQty] = useState(0);
    const rcvQuantityRef = useRef(null);
    const [depotId, setDepotId] = useState();

    //  const [invTransactionDetails, setInvTransactionDetails] = useState([{quantity:'', rate:'', 
    //              batchId: '', toStoreId:2, productId:''}]);

    const [invTransactionDetails, setInvTransactionDetails] = useState([]);

    useEffect(() => {
        document.getElementById('full-screen-close-icon').style.display = "none";
        getProductCategoryTreeList(companyId);
        getCompanyCentralWareHouse(companyId, userLoginId);
        getProductionStoreList(companyId);
        //getAllProductsOfACompany(searchParams);
    }, [companyId])

    useEffect(() => {
        setValue('')
        setBatchId('')
        setBatchInfo([])
        setBatchNoList([]);
        setBatchQuantity('');
        setBatchNo('');
        setReceiveQuantity('');
        setReceivedQuantity('');
        setSelectedProductedId('');
        document.getElementById("manuFacCost").value = '';
    }, [selectedProductCategory])

    const handleBackToListPage = () => {
        history.push('/inventory/stock/stock-transfer/production-receive');
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

    const getProductionStoreList = (companyId) => {
        const URL = `${process.env.REACT_APP_API_URL}/api/inv-receive/store/list/` + companyId;
        axios.get(URL).then(response => {
            setStoreList(response.data.data);
        }).catch(err => {

        });
    }

    const getCompanyCentralWareHouse = (companyId, userLoginId) => {
        const URL = `${process.env.REACT_APP_API_URL}/api/depot/central-warehouse/${companyId}/${userLoginId}`;
        axios.get(URL).then(response => {
            setCentralDepotList(response.data.data);
            var dptId = response.data.data[0].id;
            setDepotId(dptId);
            setInvReceive({ ...invReceive, depotId: Number(dptId) });
        }).catch(err => {
            showError("Can not get central depot");
        });
    }

    const getProductCategoryTreeList = (params) => {
        const URL = `${process.env.REACT_APP_API_URL}/api/product-category/list-info/` + params;
        axios.get(URL).then(response => {
            setProductCategoryTree(response.data.data.childProductCategoryDtoList);
        }).catch(err => {
            showError("Can not get product category tree data.");
        });
    }
    const selectTreeNode = (node) => {
        document.getElementById('searchText').value = ''
        const getElements = document.getElementsByClassName('order-list-div');
        for (var i = 0; i < getElements.length; i++) {
            getElements[i].classList.remove('select-order-list');
        }

        const cbs = document.getElementsByClassName("all-radio");
        for (var i = 0; i < cbs.length; i++) {
            cbs[i].checked = false;
        }
        setProductList([])

        setSelectedProductCategory(node)

        const paramsData = { ...searchParams, selectedProductCategory: node.id }
        const temp = getAllProductsOfACompany(paramsData)

        //setProductList(temp)
    }

    const getAllProductsOfACompany = (searchParams) => {
        let queryString = "?";
        queryString += "companyId=" + searchParams.companyId;
        queryString += searchParams.selectedProductCategory ? "&productCategoryId=" + searchParams.selectedProductCategory : "";

        const URL = `${process.env.REACT_APP_API_URL}/api/product/all/production-receivable` + queryString;

        axios.get(URL).then(response => {
            setProductList(response.data.data);
            setSearchProductList(response.data.data)
        }).catch(err => {
            showError("Products not available...")
        });
    }

    const getProductLatestBatchInfo = (productId) => {

        const URL = `${process.env.REACT_APP_API_URL}/api/batch/product-wise-latest-batch-info/${productId}`;
        axios.get(URL).then(response => {
            setBatchInfo(response.data.data);
            setBatchQuantity(response.data.data.batchQuantity);
            setBatchId(response.data.data.batchId);
            setBatchNo(response.data.data.batchNo);
            setReceivedQuantity(response.data.data.receivedQuantity)
        }).catch(err => {
            //showError("Products not available...")
        });
    }

    const handleSelectProduct = (number, productId) => {
        // FOR SELECTED CARD BTN
        setBatchNoList([]);
        setValue('')
        setBatchId('')
        setBatchInfo([])
        setReceiveQuantity('');
        setReceivedQuantity('');
        document.getElementById("manuFacCost").value = '';

        const getClassName = document.getElementById('received');
        if (getClassName.getAttribute('select') === "true") {
            getClassName.setAttribute("select", "false")
            document.getElementById('received').classList.add('d-none')
            document.getElementById('receive').classList.remove('d-none')
        }
        //console.log(getClassName.getAttribute('select') === "true")

        //
        setSelectedProductedId(productId);
        //setInvTransactionDetails([{...invTransactionDetails, productId: productId}])
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
            setBatchInfo([])
        } else {
            getId.classList.add('select-order-list');
            getRadioId.checked = true;
            //let temp = [...productList]
            //let index = temp.findIndex((obj) => obj.id === data.id);
            getProductLatestBatchInfo(productId);
        }
        batchNoDataSource(productId); //for autocomplete data
    }

    const handleSelectBatch = (data) => {
        let temp = [...batchInfo]
        let index = temp.findIndex((obj) => obj.id === data.id);
        setBatchInfo(temp[index])
    }
    const handleSearch = (event) => {
        if (event.target.value !== "" || event.target.value !== undefined) {
            document.getElementById('autocomplete-id').classList.add('d-none')
        }
    }
    const handleReceivedChange = () => {
        const getClassName = document.getElementById('received');
        getClassName.setAttribute("select", "true")
        //const quantity = document.getElementById('receiveQuantity').value
        const receveData = { ...invReceive, remarks: remarks }
        const transactionDetails = [...invTransactionDetails]
        transactionDetails.push({
            batchId: batchId, productId: selectedProductId,
            toStoreId: toStoreId, quantity: quantity, rate: rate
        })
        //const temp = [...invTransactionDetails]

        if (invReceive.depotId === "") {
            showError("Please Select Receive Warehouse")
            return false;
        }

        if (toStoreId === "") {
            showError("Please Select Receive Store")
            return false;
        }
        if (quantity === "") {
            showError("Please Enter Receive Qantity")
            return false;
        }
        // if (rate === "") {
        //     showError("Please Enter Manufacturing Cost")
        //     return false;
        // } && rate #NGLSC-2444
        if (invReceive.depotId && toStoreId && quantity ) {
            saveProductionReceive(receveData, invTransactionDto, transactionDetails)
        }
    }

    const handleQuantity = (event) => {

        const inputQuantity = event.target.value ? parseInt(event.target.value) : "";

        if (inputQuantity === 0) {
            document.getElementById("receiveQuantity").value = '';
            showError("Invalid Receive Quantity...")
            return false;
        }
        //  alert(inputQuantity);
        //  alert(batchQuantity - receivedQuantity)
        if (inputQuantity > (batchQuantity - receivedQuantity)) {
            document.getElementById("receiveQuantity").value = '';
            showError("Receive Quantity Exceeded...")
            return false;
        }
        if (inputQuantity.length === 0)
            rcvQuantityRef.current.blur();
        setQuantity(inputQuantity);
        setReceiveQuantity(inputQuantity)
        //setInvTransactionDetails([{...invTransactionDetails, quantity:event.target.value}])
    }

    const handleManFacCost = event => {
        if (parseInt(event.target.value) === 0) {
            document.getElementById("manuFacCost").value = '';
            showError("Invalid Manufacturing Cost...")
            return false;
        }
        setRate(event.target.value);
        //setInvTransactionDetails([{...invTransactionDetails, rate:event.target.value}])
    }

    const handleNote = event => {
        setRemarks(event.target.value);
        //setInvTransactionDetails([{...invTransactionDetails, remarks:event.target.value}])
    }

    const setStoreInfo = event => {
        setToStoreId(event.target.value);
    }

    const setWareHouseDepot = event => {
        setInvReceive({ ...invReceive, depotId: event.target.value })
        //setDepotId(event.target.value);
    }

    const batchNoDataSource = (productId) => {
        if (productId) {
            let queryString = "?";
            queryString += productId ? "productId=" + productId : '';
            queryString += "&searchString=" + '';

            const URL = `${process.env.REACT_APP_API_URL}/api/batch/auto-complete-data` + queryString;
            axios.get(URL).then(response => {
                setBatchNoList(response.data.data);
            }).catch(err => {

            });
        }
        else {
            setSelectedProductedId('');
            setBatchNoList([]);
        }
    }

    const saveProductionReceive = (invReceive, invTransactionDto, invTransactionDetails) => {

        const URL = `${process.env.REACT_APP_API_URL}/api/inv-receive`;
        axios.post(URL, JSON.stringify({
            ...invReceive,
            invTransactionDto: invTransactionDto,
            invTransactionDetails: invTransactionDetails
        }), { headers: { "Content-Type": "application/json" } }).then(response => {

            if (response.data.success === true) {
                showSuccess(response.data.message)
                setBatchNo('');
                setBatchQuantity('');
                document.getElementById('receive').classList.add('d-none')
                document.getElementById('received').classList.remove('d-none')
                document.getElementById("receiveQuantity").value = '';
                setReceiveQuantity('');
                setReceivedQuantity('');
                document.getElementById("manuFacCost").value = '';
                document.getElementById('receiveQuantity').value = '';
                setQRCode('');
                setRemarks('');
                setQuantity('');
                setRate('');
                document.getElementById('note').value = '';                

            } else {
                showError(response.data.message);
            }
        }).catch(err => {
            showError("Cannot be Submitted");
        });
    }

    const setProductionReceiveInformation = (batch, batchId) => {
        setBatchNo(batch.batchNo);
        setBatchQuantity(batch.batchQuantity);

        const URL = `${process.env.REACT_APP_API_URL}/api/batch/product-and-batch-wise-batch-info/${selectedProductId}/${batchId}`;
        axios.get(URL).then(response => {

            setReceivedQuantity(response.data.data.receivedQuantity);

        }).catch(err => {

        });
    }

    const handleScan = (data) => {
        const getClassName = document.getElementById('received');
        if (getClassName.getAttribute('select') === "true") {
            getClassName.setAttribute("select", "false")
            document.getElementById('received').classList.add('d-none')
            document.getElementById('receive').classList.remove('d-none')
        }
        const scanQty = parseInt(data.match(rcvQtyRegex)[1]);
        setQuantity(data.match(rcvQtyRegex)[1]);
        setQRCode(data.match(batchRegex)[0]);

        if (batchQuantity - (receivedQuantity ? parseInt(receivedQuantity) : 0) - (receiveQuantity ? parseInt(receiveQuantity) : 0) - scanQty >= 0) {
            const newRcvQty = (receiveQuantity ? parseInt(receiveQuantity) : 0) + scanQty;
            setReceiveQuantity(newRcvQty);
            setQuantity(newRcvQty)
        } else {
            showError("Product Already Received Against This Batch");
        }
    }

    useEffect(() => {
        if (qrCode)
            setProductionReceiveInformationFromBatchNo(qrCode);
    }, [qrCode]);

    const setProductionReceiveInformationFromBatchNo = (qrCode) => {

        const URL = `${process.env.REACT_APP_API_URL}/api/batch/batch-wise-batch-info/` + qrCode;
        axios.get(URL).then(response => {
            setBatchId(response.data.data.batchId);
            setSelectedProductedId(response.data.data.productId);
            setBatchNo(response.data.data.batchNo);
            setBatchQuantity(response.data.data.batchQuantity);
            const rcvedQty = response.data.data.receivedQuantity;
            setReceivedQuantity(rcvedQty);

            if (response.data.data.batchQuantity - (rcvedQty ? rcvedQty : 0) >= quantity)
                setReceiveQuantity(prvIqrQty => prvIqrQty + quantity);
            else
                showError("Product Already Received Against This Batch");
            //setQRCode('');      
        }).catch(err => {

        });
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
                            <strong>Production Receive</strong>
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
                            <select className="border-0 h4 form-control" onChange={setWareHouseDepot}
                                defaultValue={depotId}>
                                {centralDepotList.map((centralDepot) => (
                                    <option key={centralDepot.depotName} value={centralDepot.id}>
                                        {centralDepot.depotName}
                                    </option>
                                ))}
                            </select>
                            {/* <span class="h2 dark-gray-color">{centralDepotList.depotName}</span><br />
                    <strong className="h4">{centralDepotList.depotAddress}</strong> */}
                        </div>
                    </div>
                </div>

                {/* PRODUCTION RECEIVE ROW */}
                {/* PRODUCTION RECEIVE TITLE ROW */}
                <div className="mt-5">
                    <Card style={{ borderTopLeftRadius: "30px", borderTopRightRadius: "30px" }}>
                        <CardBody>
                            <div>
                                <span className="text-muted">Title</span><br />
                                <strong>Production Receive</strong>
                            </div>
                            <div className="row no-gutters mt-5">
                                <div className="col-xl-3">
                                    <span className="text-muted"><strong>CATEGORY</strong></span>
                                </div>
                                <div className="col-xl-4 text-xl-center">
                                    <span className="text-muted"><strong>PRODUCTS</strong></span>
                                </div>
                                <div className="col-xl-5">
                                    <span className="text-muted"><strong className="ml-xl-5">BATCHES</strong></span>
                                    <span className="text-muted float-right"><strong>ACTION</strong></span>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </div>

                {/* SEARCH OR QR SCAN ROW */}
                <div className="mt-5">

                    <BarcodeReader onScan={handleScan} />



                    {/* <div>
                            <div style={{ position: "absolute", padding: "7px", marginTop: "7px" }}>
                        <img src={toAbsoluteUrl("/images/search.png")} width="20px" height="20px" />
                    </div>
                    <form className="form form-label-right">
                        <input  type="text" className="form-control h-50px" name="searchText"
                            placeholder="Scan/Search Product by QR Code or Name" style={{ paddingLeft: "28px" }} onChange={(event)=>handleSearch(event)}/>
                    </form>
                    <div style={{ float: "right", padding: "7px", marginTop: "-42px" }}>
                        <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/barcode.svg")} width="20px" height="20px" />
                    </div>
                            </div> */}


                    <p><strong>Note: To scan Barcode do not focus on any Input field.</strong></p>
                </div>

                {/* PRODUCTION RECEIVE LIST DATA */}
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
                                // onKeyUp={(e) => handleKeyPressChange(e)} 
                                />
                            </form>
                        </div>
                        {
                            productList.map((product, index) => (
                                <div className="order-list-div" style={{ cursor: "pointer" }} onClick={() => handleSelectProduct(index, product.id)} id={"product-id-" + index}>
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
                                        </CardBody>
                                    </Card>
                                </div>
                            ))
                        }
                    </div>

                    {/* BATCHES ROW */}
                    <div className="col-xl-5">
                        <Card className="mt-5" id="autocomplete-id">
                            <CardBody>
                                <Autocomplete
                                    options={batchNoList}
                                    freeSolo
                                    //autoSelect
                                    //onKeyDown={batchNoDataSource}
                                    getOptionLabel={(option) => option.batchNo}
                                    value={value}
                                    onChange={(event, newValue) => {
                                        if (newValue) {
                                            setValue(newValue)
                                            setBatchId(newValue.batchId)
                                            setReceiveQuantity('');
                                            setProductionReceiveInformation(newValue, newValue.batchId);

                                            const getClassName = document.getElementById('received');
                                            if (getClassName.getAttribute('select') === "true") {
                                                getClassName.setAttribute("select", "false")
                                                document.getElementById('received').classList.add('d-none')
                                                document.getElementById('receive').classList.remove('d-none')
                                            }
                                        }
                                    }}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Batch" />
                                    )}
                                />
                            </CardBody>
                        </Card>
                        {/* {batchInfo.map((batch, index) => ( */}
                        <Card className="mt-5  pt-3">
                            <CardBody>
                                {/* BATCH INFO ROW */}
                                <div>
                                    <span className="float-right">
                                        <span id="received"
                                            select="false"
                                            className="float-right light-success-bg dark-success-color p-3 mt-n3 rounded d-none">Received</span>
                                        <span id="receive" className="float-right" >
                                            <button className="btn text-white float-right mt-n3" style={{ background: "#6FCF97" }} onClick={() => handleReceivedChange()}>
                                                <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/white-receive.svg")} />
                                                &nbsp;Receive
                                            </button>
                                        </span>

                                    </span>
                                    <span>
                                        <span className="text-muted mr-2">Batch Name:</span>
                                        <strong>{batchNo}</strong>
                                    </span><br />
                                </div>
                                {/* PROPOSED QTY ROW */}
                                <div className="mt-5 d-flex flex-wrap">
                                    <div className="mt-5 mr-5">
                                        <span className="text-muted mr-2">Batch Qty:</span>
                                        <strong>{batchQuantity}</strong>
                                    </div>
                                    <div className="mt-5 mr-5">
                                        <span className="text-muted mr-2">Received Qty:</span>
                                        <strong>{receivedQuantity ? receivedQuantity : ''}</strong>
                                    </div>
                                    <div className="mt-5 mr-5">
                                        {/* <span>
                                                <strong>{receivedQuantity}</strong>
                                            </span> */}
                                        <span>
                                            <input type="text" ref={rcvQuantityRef} value={receiveQuantity} placeholder="Receive Quantity" id="receiveQuantity" name="receiveQuantity"
                                                onChange={(e) => handleQuantity(e)}
                                                onKeyPress={e => allowOnlyNumeric(e)}
                                                onPaste={handlePasteDisable}
                                                className="mt-n5 border w-50 rounded p-3 mr-2" />
                                            <span className="text-danger">*</span>
                                        </span>
                                    </div>
                                    {/* hidden attr set for this issue #NGLSC-2444 */}
                                    <div className="float-right" hidden>
                                        <div className="d-flex flex-wrap">
                                            <div className="mt-5">
                                                <span>
                                                    <SVG className="mr-2" src={toAbsoluteUrl("/media/svg/icons/project-svg/price-gray.svg")} />
                                                    <span className="text-muted mr-2">MC.<span className="text-danger">*</span></span>
                                                </span>
                                            </div>
                                            <div className="mt-5">
                                                <input type="text" id="manuFacCost" onChange={(e) => handleManFacCost(e)}
                                                    maxLength={20} onKeyPress={e => allowOnlyNumericWithPeriodAndRestrictDecimalTwo(e)}
                                                    onPaste={handlePasteDisable}
                                                    className="mt-n5 border w-75 rounded p-3" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-5">
                                    <div className="row">
                                        <div className="col-1 mt-3">
                                            <label className="dark-gray-color">Store<span className="text-danger">*</span></label>
                                        </div>
                                        <div className="col-4">
                                            <select className="border-0 form-control" onChange={setStoreInfo}>
                                                <option value="" selected>Select Store </option>
                                                {storeList.map((store) => (
                                                    <option key={store.name} value={store.id}>
                                                        {store.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* NOTES ROW */}
                                <div className="mt-3">
                                    <label className="dark-gray-color">Note</label>
                                    <textarea type="text" onChange={(e) => handleNote(e)} className="form-control"
                                        id="note" maxLength={255} rows="5" placeholder="Write here..." />
                                </div>
                            </CardBody>
                        </Card>
                        {/* ))} */}
                    </div>
                </div>
            </div>
        </>
    );
}