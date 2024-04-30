import React, {useEffect, useState} from "react";
import {useHistory, useLocation} from "react-router-dom";
import {toAbsoluteUrl} from "../../../../../../../../../_metronic/_helpers";
import SVG from "react-inlinesvg";
import {Card} from "react-bootstrap";
import {CardBody} from "../../../../../../../../../_metronic/_partials/controls";
import axios from "axios";
import {showError, showSuccess} from '../../../../../../../../pages/Alert';
import { format, parseISO} from 'date-fns';
import { Autocomplete } from "@material-ui/lab";
import { TextField } from "@material-ui/core";
import ProductReturnInfo from "./ProductReturnInfo";

export default function ProposalReceived() {
    let history = useHistory();
    const routeLocation = useLocation();
    const [productsList, setProductsList] = useState([]);
    const [proposalInfo, setProposalInfo] = useState({});
    const [breadCrumbInfos, setBreadCrumbInfos] = useState({});
    const [locationOfDepot, setLocationOfDepot] = useState({});
    const [distributorLogo, setDistributorLogo] = useState("");
    const [returnNote, setReturnNote] = useState("");
    const [distributorImg, setDistributorImg] = useState(toAbsoluteUrl("/images/copmanylogo.png"));
    
    const [batchNoList, setBatchNoList] = useState([]);
    const [batchInfo, setBatchInfo] = useState({});
    const [batchValue, setBatchValue] = useState(null);
    
    const [invoiceValue, setInvoiceValue] = useState(null);
    const [invoiceInfo, setInvoiceInfo] = useState({});
    const [challanValue, setChallanValue] = useState(null);
    const [challanInfo, setChallanInfo] = useState({});

    const [selectedProductInfo, setSelectedProductInfo] = useState({});
    const [cartList, setCartList] = useState([]);
    const [selectedProductId, setSelectedProductId] = useState('');
    const [productReturnCartQty, setProductReturnCartQty] = useState(0);

    useEffect(() => {
        document.getElementById('full-screen-close-icon').style.display = "none";
        setProposalInfo(routeLocation.state.state);
        getReturnProposalSummaryAndDetails(routeLocation.state.state.sales_return_proposal_id
            ,routeLocation.state.state.invoice_from_date
            ,routeLocation.state.state.invoice_to_date
            ,routeLocation.state.state.distributor_id);
    }, []);

    const handleSave = () => { 
        if (cartList.length === 0) {
            showError("Please add product to cart");
            return false;
        }
        if (cartList.length !== productsList.length) {
            showError("Please add all product");
            return false;
        }

        let returnObj = {
            salesReturnProposalId: proposalInfo.sales_return_proposal_id,
            salesReturnProposalTotalAmount: proposalInfo.price,
            returnNote: returnNote.trim()
        };
        const returnItemList = [];
        cartList.forEach((cart) => {
                let returnItem = {};
                returnItem['salesReturnProposalDetailsId'] = cart.srpd_id;
                returnItem['batchId'] = Number(cart.batchId);
                returnItem['salesInvoiceId'] = cart.invoiceId;
                returnItem['deliveryChallanId'] = cart.challanId;                
                returnItem['quantity'] = cart.returnQuantity;
                returnItemList.push(returnItem);
        });
        const URL = `${process.env.REACT_APP_API_URL}/api/sales-return`;
        axios.post(URL, JSON.stringify({ ...returnObj, salesReturnDetailsDtoList: returnItemList }), { headers: { "Content-Type": "application/json" } }).then(response => {
            if (response.data.success === true) {
                showSuccess(response.data.message + ' Return No.: ' + response.data.data.returnNo);
                handleBackToListPage();
            } else {
                showError(response.data.message);
            }
        }).catch(err => {
            showError("Cannot Save Sales Return");
        });
    }

    const getReturnProposalSummaryAndDetails = (salesReturnProposalId, invoiceFromDate, invoiceToDate, distributorId) => {
        let queryParams = '?salesReturnProposalId=' + salesReturnProposalId;
        queryParams += '&invoiceFromDate=' + invoiceFromDate;
        queryParams += '&invoiceToDate=' + invoiceToDate;
        queryParams += '&distributorId=' + distributorId;
        const URL = `${process.env.REACT_APP_API_URL}/api/sales-return-proposal/get-summary-and-details` + queryParams;
        axios.get(URL).then(response => {
            let map = response.data.data;
            setProductsList(map.detailsList);
            setBreadCrumbInfos(map.proposalInfosForBreadCrumb);
            setLocationOfDepot(map.locationOfDepot);
            getDistributorLogo(map.proposalInfosForBreadCrumb.distributor_id);
        }).catch(err => {

        });
    }    

    const handleBackToListPage = () => {
        history.push('/inventory/stock/sales-return/sales-return-list');
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

    const getDistributorLogo = (distributorId) => {
        const URL = `${process.env.REACT_APP_API_URL}/api/distributor/logo/${distributorId}`;
        axios.get(URL).then(response => {
            setDistributorLogo(response.data);
        }).catch(err => {

        });
    }

    const onChangeReturnNote = (event) => {
        let value = event.target.value;
        value = value.trimStart();
        if (value.length <= 250) {
            setReturnNote(value.trimStart());
        }
    }

    const handleSelectProduct = (number, product) => {
        // FOR SELECTED CARD BTN
        if (selectedProductId !== product.id) {
            setBatchNoList([]);
            setBatchInfo({});
            setInvoiceInfo({});
            setChallanInfo({});
            setSelectedProductId(product.id);
            setSelectedProductInfo({
                srpd_id: product.srpd_id, product_id: product.id, product_sku: product.product_sku, product_name: product.product_name,
                item_size: product.item_size, abbreviation: product.abbreviation, pack_size: product.pack_size,
                trade_price: product.trade_price, propose_quantity: product.propose_quantity,
                product_category_name: product.product_category_name
            })
        }

        document.getElementById('return-qty-id').value = '';

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
        if (getId.className === "select-order-list") {
            getId.classList.remove('select-order-list');
            getRadioId.checked = false;
            setBatchNoList([])
        } else {
            getId.classList.add('select-order-list');
            getRadioId.checked = true;
             //let temp = [...productsList]
             //let index = temp.findIndex((obj) => obj.id === product.id);

        }
         setBatchInfo({
             batch_id: product.batch_id, batch_no: product.batch_no,
             batch_quantity: product.batch_quantity
         });
         setInvoiceInfo({
            challan_id: proposalInfo.challan_id, invoice_no: proposalInfo.invoice_no,
            invoice_date: proposalInfo.invoice_date, invoice_amount : proposalInfo.invoice_amount
        });
         setChallanInfo({
            challan_id: proposalInfo.challan_id, challan_no: proposalInfo.challan_no,
            challan_date: proposalInfo.challan_date
        });

        getBatchNoList(product.id);
        setBatchValue(null);
        setInvoiceValue(null);
        setChallanValue(null);
    }

    
    const handleAddToCart = (batch, selectedProductInfo, event) => {

        const obj = {}
        const temp = [...cartList]        
       
        if (!batchValue) {
            showError("Please select batch");
            return;
        }
        if (!invoiceValue) {
            showError("Please select invoice");
            return;
        }
        if (!challanValue) {
            showError("Please select challan");
            return;
        }
        if (temp.findIndex(obj => obj.batch.batchId === batch.batch_id) !== -1
            && temp.findIndex(obj => obj.batch.invoiceId === invoiceInfo.invoice_id) !== -1
            && temp.findIndex(obj => obj.batch.challanId === challanValue.challan_id) !== -1) {
            showError("Already Added Into Cart");
            return;
        }

        if (temp.findIndex(obj => obj.productId === selectedProductInfo.product_id) !== -1) {
            if (Number(productReturnCartQty) > Number(selectedProductInfo.propose_quantity)) {
                showError("Quantity can't be greater than propose quantity");
                return false;
            }
        }      

        if (batch.returnQuantity && batch.returnQuantity !== undefined 
            && parseInt(batch.returnQuantity) !== 0) {            
            obj.srpd_id = selectedProductInfo.srpd_id;    
            obj.productId = selectedProductInfo.product_id;
            obj.productSku = selectedProductInfo.product_sku;
            obj.productName = selectedProductInfo.product_name;
            obj.trade_price = selectedProductInfo.trade_price;
            obj.productCategory = selectedProductInfo.product_category_name;
            obj.batch =
            {
                "batchId": batch.batch_id,
                "batchNo": batch.batch_no,
                "batchQuantity": batch.batch_quantity,
                "returnQuantity": parseInt(batch.returnQuantity),
                "invoiceId": invoiceInfo.invoice_id,
                "challanId": challanValue.challan_id
            }
            obj.invoice =
            {
                "invoiceNo": invoiceInfo.invoice_no,
                "invoiceDate": invoiceInfo.invoice_date
            }
            obj.challan =
            {
                "challanNo": challanValue.challan_no,
                "challanDate": challanValue.challan_date
            }

            obj.batchId= batch.batch_id;
            obj.invoiceId= invoiceInfo.invoice_id;
            obj.challanId= challanValue.challan_id;
            obj.returnQuantity = parseInt(batch.returnQuantity);
            obj.cartQuantity = productReturnCartQty;

            temp.push(obj)
            batch.addToCart = true;
            setCartList(temp);

            document.getElementById('return-qty-id').value = "";
            setBatchValue(null);
            setInvoiceValue(null);
            setChallanValue(null);
        }
        else {
            showError("Please enter quantity");
            return;
        }
    }

    const getBatchNoList = (productId) => {
        let queryParams = '?productId=' + productId;
        queryParams += '&companyId=' + routeLocation.state.state.company_id;
        queryParams += '&invoiceFromDate=' + routeLocation.state.state.invoice_from_date;
        queryParams += '&invoiceToDate=' + routeLocation.state.state.invoice_to_date;
        queryParams += '&distributorId=' + routeLocation.state.state.distributor_id;
        const URL = `${process.env.REACT_APP_API_URL}/api/sales-return-proposal/get-customer-received-batch-list-product` + queryParams;
        axios.get(URL).then(response => {
            setBatchNoList(response.data.data);
        }).catch(err => {})
    }

    const handleRemovetoCart = (data) => {
        const batchIndex = cartList.findIndex(obj => obj.batchId === data.batchId);
        const removeCartObject = cartList[batchIndex];
        const batchTemp = { ...removeCartObject }
        batchTemp.addToCart = false;
        setBatchInfo(batchTemp)
        const temp = [...cartList]
        const index = temp.findIndex(obj => obj.batchId === data.batchId);
        temp.splice(index, 1);
        setCartList(temp);

        if (temp.findIndex(obj => obj.productId === selectedProductInfo.product_id) !== -1) {
            setProductReturnCartQty(productReturnCartQty - data.returnQuantity);
        }  
    }

    return (
        <>
            <div className="container-fluid" id="myFullScreen" style={{background: "#f3f6f9"}}>
                {/* HEADER ROW */}
                <div className="approval-view-header">
                    {/* BACK AND TITLE ROW */}
                    <div className="row">
                        <div className="col-3">
                            <span>
                                <button className='btn' onClick={handleBackToListPage}>
                                    <strong>
                                        <i className="bi bi-arrow-left-short" style={{fontSize: "30px"}}></i>
                                    </strong>
                                </button>
                            </span>
                        </div>
                        <div className="col-6 text-center mt-4">
                            <strong>Sales Return Receive</strong>
                        </div>
                        <div className="col-3 text-right text-muted">
                            <button id="full-screen-icon" className="btn text-white" onClick={openFullscreen}>
                                <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/full-screen.svg")}/>
                            </button>
                            <button id="full-screen-close-icon" className="btn text-white" onClick={closeFullscreen}>
                                <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/full-screen-close.svg")}/>
                            </button>
                        </div>
                    </div>
                </div>

                {/* FROM TO AND ADDITIONAL INFO ROW */}
                <div className="bg-white">
                    <div className="container-fluid">
                        <div className="row">
                            {/* FROM ROW */}
                            <div className="col-xl-3 mt-5">
                                <strong className="mt-5 dark-gray-color">Distributor</strong><br/>
                                <div className="card mb-3 mt-3 border-radius-20">
                                    <div className="row no-gutters">
                                        <div className="col-xl-3">
                                            <img className="image-input image-input-circle p-5"
                                                 style={{marginTop: "15px"}}
                                                 src={distributorLogo === undefined || distributorLogo === "" || distributorLogo === null ? distributorImg : `data:image/png;base64,${distributorLogo}`}
                                                 width="100px" height="100px" alt='Distributor’s Picture'/>
                                        </div>
                                        <div className="col-xl-9">
                                            <div className="card-body">
                                                <div style={{fontWeight: "500"}} className="dark-gray-color">
                                                    <strong>{breadCrumbInfos.distributor_name}</strong></div>
                                                <div className="mt-1">
                                                    <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/phone.svg")}
                                                         width="12px" height="12px"/>&nbsp;
                                                    <small
                                                        className="text-muted">{breadCrumbInfos.distributor_contact_no}
                                                    </small>
                                                </div>
                                                <div className="mt-2"><SVG
                                                    src={toAbsoluteUrl("/media/svg/icons/project-svg/location.svg")}
                                                    width="15px" height="15px"/>
                                                    <small
                                                        className="text-muted">{breadCrumbInfos.sales_officer_location}
                                                    </small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* AADDITIONAL INFO ROW */}
                            <div className="col-xl-6 mt-5">
                                <strong className="dark-gray-color">Additional Info</strong><br/>
                                <div className="card mt-3 border-radius-20">
                                    <div className="card-body">
                                        <div className="row">
                                            {/* APPLIED BY ROW */}
                                            <div className="col-xl-6">
                                                <div className="mt-xl-n2"><span
                                                    className="dark-gray-color">Applied By</span></div>
                                                <div className="row no-gutters mt-3">
                                                    <div className="col-xl-3">
                                                        <SVG
                                                            src={toAbsoluteUrl("/media/svg/icons/project-svg/group-logo.svg")}/>
                                                    </div>
                                                    <div className="col-xl-9">
                                                        <div style={{fontWeight: "500"}} className="dark-gray-color">
                                                            <strong>{breadCrumbInfos.sales_officer_name}</strong></div>
                                                        <div className="mt-1"><SVG
                                                            src={toAbsoluteUrl("/media/svg/icons/project-svg/phone.svg")}
                                                            width="12px" height="12px"/>&nbsp;<small
                                                            className="text-muted">{breadCrumbInfos.sales_officer_designation}, {breadCrumbInfos.sales_officer_location}</small>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Return Proposal Info row */}
                                            <div className="col-xl-6">
                                                <div className="mt-xl-n2">
                                                <span className="dark-gray-color">Return Proposal Info</span></div>
                                                <div className="row no-gutters mt-3">
                                                    <div className="col-xl-3">
                                                        <SVG
                                                            src={toAbsoluteUrl("/media/svg/icons/project-svg/group-logo.svg")}/>
                                                    </div>
                                                    <div className="col-xl-9">
                                                        <div style={{fontWeight: "500"}} className="dark-gray-color">
                                                            <strong>{breadCrumbInfos.proposal_no}(Amount: {Number(proposalInfo.price).toFixed(2)})</strong>
                                                        </div>
                                                        <div className="mt-1">&nbsp;
                                                            <small
                                                                className="text-muted">{breadCrumbInfos.proposal_date}
                                                            </small>
                                                        </div>

                                                        <div style={{fontWeight: "500"}} className="dark-gray-color">
                                                            <strong>Invoice Filter Date</strong>
                                                        </div>
                                                        <small
                                                            className="text-muted">
                                                            From  &nbsp; 
                                                            {proposalInfo.invoice_from_date !=null ?format(parseISO(proposalInfo.invoice_from_date), 'dd-MMM-yyyy'): ""}
                                                            &nbsp;To &nbsp;
                                                            {proposalInfo.invoice_to_date !=null ?format(parseISO(proposalInfo.invoice_to_date), 'dd-MMM-yyyy'): ""}
                                                        </small>
                                                    </div>
                                                </div>                                                
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* TO ROW */}
                            <div className="col-xl-3 mt-5">
                                <strong className="mt-5 dark-gray-color">Depot</strong><br/>
                                <div className="card mb-3 mt-3 border-radius-20">
                                    <div className="row no-gutters">
                                        <div className="col-xl-3">
                                            <SVG style={{marginTop: "15px"}} className="p-5"
                                                 src={toAbsoluteUrl("/media/svg/icons/project-svg/group-logo.svg")}
                                                 width="100px" height="100px"/>
                                        </div>
                                        <div className="col-xl-9">
                                            <div className="card-body">
                                                <div style={{fontWeight: "500"}} className="dark-gray-color">
                                                    <strong>{breadCrumbInfos.depot_name}</strong></div>
                                                <div className="mt-1">
                                                    <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/phone.svg")}
                                                         width="12px" height="12px"/>&nbsp;
                                                    <small
                                                        className="text-muted">{breadCrumbInfos.depot_contact_number}</small>
                                                </div>
                                                <div className="mt-2">
                                                    <SVG
                                                        src={toAbsoluteUrl("/media/svg/icons/project-svg/location.svg")}
                                                        width="15px" height="15px"/>
                                                    <small className="text-muted">{locationOfDepot?.name}</small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* MAIN CONTENT ROW */}
                <div className="row mt-5">
                    {/* PRODUCTS ROW */}
                    <div className="col-xl-4">                            
                        {
                            productsList.map((p, index) => (
                                <div key={index} className="order-list-div" style={{ cursor: "pointer" }} 
                                    onClick={() => handleSelectProduct(index, p)} id={"product-id-" + index}>
                                    {/* only load regular stock available products for send */}
                                        <Card className="p-3 mt-5">
                                            <CardBody>
                                                <div className="position-absolute" style={{ left: "17px", top: "43px" }}>
                                                    <span><input className="all-radio" type="radio" id={"product-radio-id-" + index} /></span>
                                                </div>
                                                <div className="mt-1">
                                                <span className="text-muted">{p.product_sku}</span><br/>
                                                <strong>{p.product_name} {p.item_size} {p.abbreviation} * {p.pack_size} </strong><br/>
                                                <span className="text-muted">{p.product_category_name}</span>
                                                </div>
                                                <div className="text-right">
                                                    <span>
                                                        <span className="dark-gray-color mr-2">
                                                            <SVG className="mr-2"
                                                                src={toAbsoluteUrl("/media/svg/icons/project-svg/total-gray.svg")}/>
                                                            Proposed Qty.
                                                        </span>
                                                        <strong>{p.propose_quantity} (UOM: {p.propose_quantity * p.item_size * p.pack_size} {p.abbreviation})</strong>
                                                    </span>
                                                    <div className="mt-2">
                                                        <span>
                                                            <SVG className="mr-2"
                                                                src={toAbsoluteUrl("/media/svg/icons/project-svg/price-gray.svg")}
                                                                width="20px" height="20px"/>
                                                            <span className="text-muted mr-2">Price</span>
                                                            <span><strong>{Number(p.propose_quantity * p.prodcut_price).toFixed(2)}</strong></span>
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="mt-5" style={{ border: "1px solid #F2F2F2", width: "100%" }}></div>
                                            </CardBody>
                                        </Card>
                                </div>
                            ))
                        }
                    </div>

                    {/* BATCHES ROW */}
                    <div className="col-xl-4">
                        <ProductReturnInfo selectedProductInfo={selectedProductInfo}
                            handleAddToCart={handleAddToCart}
                            batchValue={batchValue} setBatchValue={setBatchValue} 
                            batchInfo={batchInfo} setBatchInfo={setBatchInfo} batchNoList={batchNoList}
                            invoiceValue={invoiceValue} setInvoiceValue={setInvoiceValue}
                            invoiceInfo={invoiceInfo} setInvoiceInfo={setInvoiceInfo}
                            challanValue={challanValue} setChallanValue={setChallanValue}
                            challanInfo={challanInfo} setChallanInfo={setChallanInfo}
                            productReturnCartQty ={productReturnCartQty} setProductReturnCartQty={setProductReturnCartQty}
                            proposalInfo = {proposalInfo}
                            cartList = {cartList}/>
                    </div>

                    {/* RETURN RECEIVE ROW */}
                    <div className="col-xl-3 mb-5">
                    <div className="mt-5">
                        {/* RETURN RECEIVE TITLE ROW */}
                        <Card style={{borderTopRightRadius: "30px", borderTopLeftRadius: "30px"}}>
                            <CardBody>
                                <div>
                                    <span className="text-muted">Title</span><br/>
                                    <strong>Return Receive</strong>
                                </div>
                                <div className="mt-5">
                                    <span className="text-muted float-right"><strong>ACTION</strong></span>
                                </div>
                            </CardBody>
                        </Card>


                        {/* CART LIST DATA ROW */}
                        <div className="mt-5">
                            {
                                cartList.map((obj, index) => (
                                    <Card key={index} className="mt-5">
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
                                                        {/* <span className="text-muted">
                                                            <SVG className="mr-1" src={toAbsoluteUrl("/media/svg/icons/project-svg/price-gray.svg")} width="15px" height="15px" />Current W.A. Rate
                                                            <strong>{" " + obj.rate}</strong>
                                                        </span> */}
                                                    </div>
                                                    <div className="mt-5" style={{ border: "1px solid #F2F2F2", width: "100%" }}></div>
                                                    {
                                                        <div className="mt-5">
                                                            <strong className="dark-gray-color mr-5">{obj.batch.batchNo}</strong>
                                                            <span className="bg-light dark-gray-color p-1 rounded mr-3">{obj.batch.batchQuantity}</span>
                                                            <br/>
                                                            <span><span>Return Qty.&nbsp;</span><strong>{obj.batch.returnQuantity}</strong></span>
                                                            <br/>
                                                            <span><span>Invoice No.&nbsp;</span><strong>{obj.invoice.invoiceNo}</strong></span>
                                                            <br/><span><span>Challan No.&nbsp;</span><strong>{obj.challan.challanNo}</strong></span>
                                                        </div>
                                                    }
                                                    <div className="mt-5" style={{ border: "1px solid #F2F2F2", width: "100%" }}></div>
                                                </div>
                                            </div>
                                        </CardBody>
                                    </Card>
                                ))
                            }
                        </div>


                        {/* ALL RECEIVED ACTION ROW */}
                        <Card className="mt-5"
                              style={{borderBottomRightRadius: "30px", borderBottomLeftRadius: "30px"}}>
                            <CardBody>
                                {/* NOTES ROW */}
                                <div className="mt-3">
                                    <label className="dark-gray-color">Note</label>
                                    <textarea id="note" type="text" className="form-control" rows="5"
                                              value={returnNote} onChange={onChangeReturnNote}
                                              placeholder="Write here in 250 characters"/>
                                </div>
                                <div className="mt-5">
                                    <button className="btn text-white mr-3 float-right" style={{background: "#6FCF97"}}
                                            onClick={handleSave}>
                                        <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/white-receive.svg")}/>
                                        &nbsp;<strong>Receive Sales Return</strong>
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