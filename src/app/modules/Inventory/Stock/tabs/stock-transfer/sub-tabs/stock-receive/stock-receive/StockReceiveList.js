import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { toAbsoluteUrl } from "../../../../../../../../../_metronic/_helpers";
import SVG from "react-inlinesvg";
import { Card } from "react-bootstrap";
import { CardBody } from "../../../../../../../../../_metronic/_partials/controls";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { TextField } from "@material-ui/core";
import InventoryBreadCrum from '../../../../../../bread-crum/InventoryBreadCrum';
import { data } from "jquery";
import axios from "axios";
import { showError, showSuccess } from '../../../../../../../../pages/Alert';

export default function StockReceiveList() {
    let history = useHistory();
    let location = useLocation();
    const transactionInfo = location.state.state;
    const [value, setValue] = React.useState(null);
    const [productList, setProductList] = useState([])
    const [batchList, setBatchList] = useState([]);
    const [storeTypeList, setStoreTypeList] = useState([]);
    const [receiveStatus, setTransferReceiveStatus] = useState({});
    const [receiveStore] = useState(transactionInfo.receiveStore);

    useEffect(() => {
        if (location.state !== undefined) {
            setProductList(location.state.state.productList);
            getStoreType();
            // if(Object.keys(transactionInfo.receivedStatus).length === 0){
            if (transactionInfo.receivedStatus === "Pending") {
                document.getElementById('receive').classList.remove('d-none');
                document.getElementById('received').classList.add('d-none');
            } else {
                document.getElementById('receive').classList.add('d-none');
                document.getElementById('received').classList.remove('d-none');
            }
        }
    }, [])

    const handleBackToListPage = () => {
        history.push('/inventory/stock/stock-transfer/stock-receive');
    }

    const handleSelectProduct = (number, data) => {
        // FOR SELECTED CARD BTN
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
            let index = temp.findIndex((obj) => obj.id === data.id);
            // setBatchList(temp[index].batch);
            setBatchList(temp[index].batchList);
        }
    }

    const handleTransferReceiveSubmit = () => {

        let storeType = document.getElementById('receiveStore').value;
        if (storeType === null || storeType === '') {
            alert("Please select store");
            return false;
        }
        const transferReceive = {
            id: transactionInfo.id,
            companyId: transactionInfo.company_id,
            transactionType: 'TRANSFER_RECEIVE',
            storeType: storeType,
            note: document.getElementById('note').value
        };
        transferReceiveSave(transferReceive);
    }

    const transferReceiveSave = (transferReceive) => {
        if (productList.length == 0) {
            showError("No Product Found");
            return false;
        }
        const URL = `${process.env.REACT_APP_API_URL}/api/inv-transaction`;
        axios.post(URL, JSON.stringify(transferReceive),
            { headers: { "Content-Type": "application/json" } }).then(response => {
                if (response.data.success === true) {
                    document.getElementById('received').classList.remove('d-none')
                    document.getElementById('receive').classList.add('d-none')
                    showSuccess("Transfer received successfully.");
                    //getTransferReceiveStatus();
                }
            }).catch(err => {
                showError(err);
            });
    }

    const handleReceivedChange = (product) => {
        document.getElementById('receive').classList.add('d-none')
        document.getElementById('received').classList.remove('d-none')
    }

    const getStoreType = () => {
        const URL = `${process.env.REACT_APP_API_URL}/api/store/get-store-type-selected/`;
        axios.get(URL).then(response => {
            setStoreTypeList(response.data.data);
        }).catch(err => {
        });
    }

    return (
        <>
            {/* BREAD CRUM ROW */}
            <div>
                <InventoryBreadCrum status={location.state} />
            </div>
            {/* HEADER ROW */}
            <div>
                <Card>
                    <CardBody>
                        {/* BACK AND TITLE ROW */}
                        <div className="row">
                            <div className="col-4">
                                <span>
                                    <button className='btn' onClick={handleBackToListPage}>
                                        <strong>
                                            <i className="bi bi-arrow-left-short sales-booking-view-icon"></i>
                                        </strong>
                                    </button>
                                </span>
                            </div>
                            <div className="col-4 text-center mt-3">
                                <strong>Stock Receive Request</strong>
                            </div>
                        </div>

                        {/* FROM TO AND ADDITIONAL INFO ROW */}
                        <div className="row">
                            {/* FROM ROW */}
                            <div className="col-xl-3 mt-5">
                                <strong className="mt-5 dark-gray-color">From</strong><br />
                                <div className="card mb-3 mt-3 border-radius-20">
                                    <div className="card-body">
                                        <div style={{ fontWeight: "500" }} className="dark-gray-color"><span>Depot</span></div>
                                        <div style={{ fontWeight: "500" }} className="level-title"><strong className="h4">{transactionInfo.depot_name}</strong></div>
                                    </div>
                                </div>
                            </div>

                            {/* AADDITIONAL INFO ROW */}
                            <div className="col-xl-6 mt-5">
                                <strong className="dark-gray-color mt-n5">Store Info</strong><br />
                                <div className="card mb-3 mt-3 border-radius-20">
                                    <div className="card-body">
                                        <span className="">
                                            <div className="row">
                                                <div className="col-3 mt-3">
                                                    <label className="dark-gray-color"><span className="mr-1">Store</span><span className="text-danger">*</span></label>
                                                </div>
                                                <div className="col-9">
                                                    <select id="receiveStore" className="border-0 form-control" name="storeType" >
                                                        {/* <option value={receiveStore.id} className="fs-1">{receiveStore.store_type}</option> */}
                                                        {
                                                            storeTypeList.map((storeType) => (
                                                                <option key={storeType.code} value={storeType.code}
                                                                    className="fs-1">{storeType.name}</option>
                                                            ))
                                                        }
                                                    </select>
                                                </div>
                                            </div>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* TO ROW */}
                            <div className="col-xl-3 mt-5">
                                <strong className="mt-5 dark-gray-color">To</strong><br />
                                <div className="card mb-3 mt-3 border-radius-20">
                                    <div className="card-body">
                                        <div style={{ fontWeight: "500" }} className="dark-gray-color"><span>Depot</span></div>
                                        <div style={{ fontWeight: "500" }} className="level-title"><strong className="h4">{transactionInfo.to_depot_name}</strong></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </div>

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

            {/* PRODUCTION RECEIVE TITLE ROW */}
            <div className="mt-5 row">
                <div className="col-xl-4">
                    <Card style={{ borderTopLeftRadius: "30px", borderTopRightRadius: "30px" }}>
                        <CardBody>
                            <div>
                                <span className="text-muted">Title</span><br />
                                <strong>Product Receive</strong>
                            </div>
                            <div className="mt-5">
                                <span className="text-muted"><strong>PRODUCTS INFO</strong></span>
                            </div>
                        </CardBody>
                    </Card>
                </div>
                <div className="col-xl-5">
                    <Card style={{ borderTopLeftRadius: "30px", borderTopRightRadius: "30px" }}>
                        <CardBody>
                            <div>
                                <span className="text-muted">Title</span><br />
                                <strong>Batch Receive</strong>
                            </div>
                            <div className="mt-5">
                                <span className="text-muted"><strong>BATCH INFO</strong></span>
                            </div>
                        </CardBody>
                    </Card>
                </div>
                <div className="col-xl-3">
                    <Card style={{ borderTopLeftRadius: "30px", borderTopRightRadius: "30px" }}>
                        <CardBody>
                            <div>
                                <span className="text-muted">Title</span><br />
                                <strong>Receive Action</strong>
                            </div>
                            <div className="text-right">
                                <span className="text-muted"><strong>ACTION</strong></span>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </div>
            {/* PRODUCTION RECEIVE LIST DATA */}
            <div className="row mb-5">
                {/* PRODUCTS ROW */}
                <div className="col-xl-4">
                    {
                        productList.map((product, index) => (
                            <div key={product.id} className="order-list-div" style={{ cursor: "pointer" }} onClick={() => handleSelectProduct(index, product)} id={"product-id-" + index}>
                                <Card className="p-3 mt-5">
                                    <CardBody>
                                        <div className="position-absolute" style={{ left: "17px", top: "43px" }}>
                                            <span><input className="all-radio" type="radio" id={"product-radio-id-" + index} /></span>
                                        </div>
                                        <div className="mt-1">
                                            <span className="text-muted">{product.product_sku}</span><br />
                                            <strong>{product.product_name}</strong><br />
                                            <span className="text-muted">{product.category_name}</span><br />
                                        </div>
                                    </CardBody>
                                </Card>
                            </div>
                        ))
                    }
                </div>

                {/* BATCHES ROW */}
                <div className="col-xl-5">
                    <Card className="mt-5">
                        <CardBody>
                            {batchList.map((batch, index) => (
                                <>
                                    <div key={batch.id} className="d-flex">
                                        <div className="ml-n3 mt-3"><span className="rounded light-gray-bg pl-2 pr-2">{index + 1}</span></div>
                                        <div className="d-flex justify-content-between pl-5">

                                            <div className="w-75">

                                                <span>
                                                    <span className="text-muted mr-2">Batch</span><br />
                                                    <strong>{batch.batch_no}</strong>
                                                </span>
                                            </div>
                                            <div className="float-right">
                                                <span>
                                                    <span className="text-muted mr-2">QTY.</span><br />
                                                    <strong>{batch.quantity}</strong>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-5" style={{ border: "1px solid #F2F2F2", width: "100%" }}></div></>
                            ))}
                        </CardBody>
                    </Card>
                </div>
                <div className="col-xl-3">
                    <Card>
                        <CardBody>
                            {/* NOTES ROW */}
                            <div className="mt-3">
                                <label className="dark-gray-color">Note</label>
                                <textarea id="note" type="text" className="form-control" rows="5" placeholder="Write here..." />
                            </div>

                            <div className="mt-5">
                                <button id="receive" className="btn text-white mr-3 float-right d-none" style={{ background: "#6FCF97" }}
                                    onClick={() => handleTransferReceiveSubmit()}>
                                    <SVG className="mr-2" src={toAbsoluteUrl("/media/svg/icons/project-svg/white-receive.svg")} />
                                    <strong>Receive ALL</strong>
                                </button>
                            </div>

                            <div className="mt-5 text-right">
                                <span id="received" className="bg-light p-3 dark-success-color d-none">
                                    <strong>Received</strong></span>
                            </div>

                        </CardBody>
                    </Card>
                </div>
            </div>
        </>
    );
}