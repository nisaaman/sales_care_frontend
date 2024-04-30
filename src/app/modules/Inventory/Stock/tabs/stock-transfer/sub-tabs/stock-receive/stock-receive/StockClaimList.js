import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { toAbsoluteUrl } from "../../../../../../../../../_metronic/_helpers";
import SVG from "react-inlinesvg";
import { Card } from "react-bootstrap";
import { CardBody } from "../../../../../../../../../_metronic/_partials/controls";
import { allowOnlyNumeric, allowOnlyNumericWithPeriod, handlePasteDisable } from '../../../../../../../Util';
import InventoryBreadCrum from '../../../../../../bread-crum/InventoryBreadCrum';
import axios from "axios";
import { showError, showSuccess } from '../../../../../../../../pages/Alert';

export default function StockClaimList() {
    let history = useHistory();
    let location = useLocation();
    const [productList, setProductList] = useState([])
    const [batchList, setBatchList] = useState([]);
    const [cartList, setCartList] = useState([]);
    const [claimTypeList, setClaimTypeList] = useState([]);
    const data = location.state.state;

    useEffect(() => {
        if (location.state !== undefined) {
            setProductList(location.state.state.productList);
            getAllClaimType();
        }
    }, [])

    const handleBackToListPage = () => {
        history.push('/inventory/stock/stock-transfer/stock-receive');
    }

    const handleSelectProduct = (number, data) => {

        batchList.map((obj, index) => {
            document.getElementById('claim-type-id' + index).value = ""
            document.getElementById('claim-qty-id' + index).value = ""
        })
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
            //setBatchList(temp[index].batch);
            setBatchList(temp[index].batchList);
        }
    }

    const handleClaimChange = (data, i) => {
        let getIdValue = document.getElementById('claim-type-id' + i);
        let claimTypeId = document.getElementById('claim-type-id' + i).value;
        let claimTypeName = getIdValue.options[getIdValue.selectedIndex].text;
        let claimQty = document.getElementById('claim-qty-id' + i).value;

        if (claimTypeId === null || claimTypeId ==='') {
            showError("Please select claim type");
            return;
        }
        if (Number(claimQty) === null|| Number(claimQty) <= 0) {
            showError("Please enter claim quantity");
            return;
        }
        if (claimTypeId == 'EXCESS') {

        }
        else {
            if (data.quantity < claimQty) {
                showError("Claim quantity can't be greater than receive quantity");
                return;
            }
        }
        
        //BATCH ARRAY
        const temp = [...batchList]
        const index = temp.findIndex((obj) => obj.id === data.id)
        temp[index].confirm = true;
        setBatchList(temp);

        // PRODUCT ARRAY
        const pTemp = [...batchList]
        
        const pIndex = pTemp.findIndex((obj) => obj.id === data.id);
        let productName = pTemp[pIndex].product_name;
        let productSku = pTemp[pIndex].product_sku;
        let productCategory = pTemp[pIndex].category;
        let obj = {}
        obj = {
            ...data,
            // productName: productName,
            // productSku: productSku,
            //productCategory: productCategory,
            claimTypeId: claimTypeId,
            claimTypeName: claimTypeName,
            claimQty: claimQty,
        }

        // CART ARRAY 
        const cartTemp = [...cartList]
        cartTemp.push(obj)
        setCartList(cartTemp)
    }

    const handleRemoveCart = (data) => {
        const productTemp = [...productList]
        const productIndex = productTemp.findIndex((product)=>product.id === data.product_id)
        if(productIndex > -1){ 
            const batchIndex = productTemp[productIndex].batchList.findIndex((batch)=> batch.batch_id === data.batch_id) 
            //console.log(productTemp[productIndex].batch[batchIndex])
            productTemp[productIndex].batchList[batchIndex].confirm = false;
            setBatchList(productTemp[productIndex].batchList)
        }
        setProductList(productTemp)

        const cartTemp = [...cartList]
        const cartIndex = cartTemp.findIndex((cart)=>cart.batch_id === data.batch_id)
        cartTemp.splice(cartIndex, 1)
        setCartList(cartTemp)
    }

    const getAllClaimType = () => {        
        const URL = `${process.env.REACT_APP_API_URL}/api/inv-transaction/claim-type-list/`;
        axios.get(URL).then(response => {
            setClaimTypeList(response.data.data);
        }).catch(err => {
            console.log(err);
        });
    }

    const handleClaimSubmit = (cartList) => {
        const claimItemList = [];
        const claimObj = {
            invTransactionId: data.transaction_receive_id, 
            invTransferId: data.transfer_rcv_id, 
            companyId: data.company_id,
            notes: document.getElementById('notes').value
        };
        cartList.forEach((cart) => {
                let claimItem ={ };
                claimItem['id'] = cart.id; //inv_transaction_details_id
                claimItem['batchId'] = Number(cart.batch_id);
                claimItem['productId'] = cart.product_id;
                claimItem['claimQuantity'] = cart.claimQty;
                claimItem['claimTypeId'] = cart.claimTypeId;
                
                claimItemList.push(claimItem);

          });
        invClaimSave(claimObj, claimItemList);
    }

    const invClaimSave = (claimObj, claimItemList) => {
        if(cartList.length == 0) {
            showError("Please add product");
            return false;
        }        
        const URL = `${process.env.REACT_APP_API_URL}/api/inv-claim`;
        axios.post(URL, JSON.stringify({...claimObj, invClaimDetailsDto: claimItemList}), { headers: { "Content-Type": "application/json" } }).then(response => {
        if (response.data.success === true) {
            showSuccess("Claimed successfully.");
            // cart set empty
            setCartList([]); 
        }
        }).catch(err => {
            showError(err);
        });
    }

    const handleClaimCardClear = () => {
        setCartList([]); 
        setBatchList([]);
        var cbs = document.getElementsByClassName("all-radio");
        for (var i = 0; i < cbs.length; i++) {
            cbs[i].checked = false;
        }
        const productTemp = [...productList]
        productTemp.map((product)=>{
            product.batchList.map((batch)=>{
                batch.confirm=false;
            })
        })
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
                                <strong>Stock Claim Request</strong>
                            </div>
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
                    </CardBody>
                </Card>
            </div>


            {/* PRODUCTION RECEIVE TITLE ROW */}
            <div className="mt-5 row">
                <div className="col-xl-3">
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
                <div className="col-xl-4">
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
                <div className="col-xl-5">
                    <Card style={{ borderTopLeftRadius: "30px", borderTopRightRadius: "30px" }}>
                        <CardBody>
                            <div>
                                <span className="text-muted">Title</span><br />
                                <strong>Claim Action</strong>
                            </div>
                            <div className="text-right mt-5">
                                <span className="text-muted"><strong>ACTION</strong></span>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </div>
            {/* PRODUCTION RECEIVE LIST DATA */}
            <div className="row mb-5">
                {/* PRODUCTS ROW */}
                <div className="col-xl-3">
                    {
                        productList.map((product, index) => (
                            <div className="order-list-div" style={{ cursor: "pointer" }} onClick={() => handleSelectProduct(index, product)} id={"product-id-" + index}>
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
                <div className="col-xl-4">
                    {batchList.map((batch, index) => (
                        <Card className="mt-5">
                            <CardBody>
                                <div className="row mt-5">
                                    <div className="col-1"><span className="rounded light-gray-bg pl-2 pr-2">{index + 1}</span></div>
                                    <div className="col-11">
                                        <div className="row justify-content-between">
                                            <div className="col-xl-9">
                                                <span className="text-muted mr-2">Batch</span><br />
                                                <strong>{batch.batch_no}</strong>
                                            </div>
                                            <div className="col-xl-3 text-right">
                                                <span className="text-muted">QTY.</span><br />
                                                <strong>{batch.quantity}</strong>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row mt-5 justify-content-between">
                                    <div className="offset-xl-1 col-xl-7">
                                        <div>
                                            <label className="dark-gray-color">Claim Type<span className="text-danger h3">*</span></label>
                                        </div>
                                        <div className="ml-n5">
                                            <select id={"claim-type-id" + index} className="border-0 form-control" name="claimType" >
                                                <option value="" className="fs-1">Please Select</option>
                                                {
                                                    claimTypeList.map((claimType)=>(
                                                        <option key={claimType.code} value={claimType.code}
                                                            className="fs-1">{claimType.name}</option>
                                                    ))
                                                }
                                            </select>
                                            {/* <select id={"claim-type-id" + index} className="border-0 form-control">
                                                <option value="">Please Select</option>
                                                <option value="1">Excess Receive</option>
                                                <option value="2">Short</option>
                                                <option value="3">Missing</option>
                                            </select> */}
                                        </div>
                                    </div>
                                    <div className="col-xl-4 text-right">
                                        <div>
                                            <label className="dark-gray-color">Claim QTY.<span className="text-danger h3">*</span></label>
                                        </div>
                                        <div>
                                            <input id={"claim-qty-id" + index} className="form-control" type="text" 
                                                onKeyPress={(e) => allowOnlyNumeric(e)} onPaste={handlePasteDisable} maxLength={9}/>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right mt-5">
                                    {
                                        batch.confirm ?
                                            <span className="light-gray-bg dark-danger-color rounded p-3 float-right">
                                                <strong>
                                                    Claimed
                                                </strong>
                                            </span>
                                            :
                                            <button className="btn text-white mr-3 float-right all-claim-btn" style={{ background: "#EB5757" }} onClick={() => handleClaimChange(batch, index)}>
                                                <strong>Claim</strong>
                                            </button>
                                    }

                                </div>
                            </CardBody>
                        </Card>
                    ))}
                </div>
                <div className="col-xl-5">
                    {
                        cartList.map((batchIntoCart, index) => (
                            <Card className="mt-5">
                                <CardBody>
                                    <div className="d-flex">
                                        <div className="ml-n3"><span className="rounded light-gray-bg pl-2 pr-2">{index + 1}</span></div>
                                        <div className="w-100 pl-5">
                                            <div>
                                                <button className="btn float-right" style={{ background: "#F9F9F9", color: "#0396FF" }} onClick={()=>handleRemoveCart(batchIntoCart)}>
                                                    <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/red-delete.svg")} />
                                                </button>
                                            </div>
                                            <div>
                                                <span className="text-muted">{batchIntoCart.product_sku}</span><br />
                                                <strong>{batchIntoCart.product_name}</strong><br />
                                                <span className="text-muted">{batchIntoCart.category_name}</span><br />
                                            </div>
                                            <div className="mt-5">
                                                <span className="text-muted mr-1">Batch</span><strong>{batchIntoCart.batch_no}</strong>
                                                <span className="float-right"><span className="text-muted mr-1">QTY.</span><strong>{batchIntoCart.quantity}</strong></span>
                                            </div>
                                            <div className="mt-5" style={{ border: "1px solid #F2F2F2", width: "100%" }}></div>

                                            {/* CLAIM QTY ROW */}
                                            <div className="mt-3">
                                                <span className="text-muted mr-1">Claim Type:</span><strong>{batchIntoCart.claimTypeName}</strong>
                                                <span className="float-right">
                                                    <span className="text-muted mr-1">Claim QTY:</span><strong>{batchIntoCart.claimQty}</strong>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        ))
                    }
                    <Card className="mt-5">
                        <CardBody>
                            {/* NOTES ROW */}
                            <div className="mt-3">
                                <label className="dark-gray-color">Note</label>
                                <textarea id="notes" type="text" className="form-control" rows="5" maxLength={255} placeholder="Write here..." />
                            </div>
                            <div className="mt-5">
                                <button className="btn light-gray-bg dark-danger-color mr-3"
                                    onClick={()=>handleClaimCardClear()}>
                                    <SVG className="mr-2" src={toAbsoluteUrl("/media/svg/icons/project-svg/reject.svg")} />
                                    <strong>Cancel</strong>
                                </button>
                                <button className="btn text-white mr-3 float-right" style={{ background: "#EB5757" }}
                                    onClick={()=>handleClaimSubmit(cartList)}>
                                        {/*  */}
                                    <SVG className="mr-2" src={toAbsoluteUrl("/media/svg/icons/project-svg/white-receive.svg")} 
                                    />
                                    <strong>Claim All</strong>
                                </button>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </>
    );
}