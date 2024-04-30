import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { toAbsoluteUrl } from "../../../../../../../../../_metronic/_helpers";
import SVG from "react-inlinesvg";
import { Card } from "react-bootstrap";
import { CardBody } from "../../../../../../../../../_metronic/_partials/controls";
import CircularProgress from '@material-ui/core/CircularProgress';
import { allowOnlyNumeric } from '../../../../../../../Util';
import { showError, showSuccess } from "../../../../../../../../pages/Alert";
import axios from "axios";
import { format, parseISO } from 'date-fns';

export default function NewPickingList() {
    let history = useHistory();
    const location = useLocation();
    const [orderList, setOrderList] = useState([])
    const [productList, setProductList] = useState([])
    const [cartList, setCartList] = useState([]);
    const [depot, setdepot] = useState("");
    const [distributor, setDistributor] = useState("");

    useEffect(() => {
        document.getElementById('full-screen-close-icon').style.display = "none";
        if (location.state != undefined) {
            setdepot(location.state.state.depot);
            setOrderList(location.state.state.orderList)
            setDistributor(location.state.state);
        }
    }, [])

    const handleBackToListPage = () => {
        history.push('/inventory/stock/sales-order/picking-list');
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

    const handleSelectOrderList = (data, number) => {
        setProductList([])
        let id = "id-" + number;
        const getId = document.getElementById(id);
        const getElements = document.getElementsByClassName('order-list-div');
        for (var i = 0; i < getElements.length; i++) {
            getElements[i].classList.remove('select-order-list');
        }

        let radioId = "radio-id-" + number;
        const getRadioId = document.getElementById(radioId);
        var radioElements = document.getElementsByClassName("all-radio");
        for (var i = 0; i < radioElements.length; i++) {
            radioElements[i].checked = false;
        }
        if (getId) {
            getId.classList.add('select-order-list');
            getRadioId.checked = true;
            getProductList(data.id);
        }
    }

    const handleAddToCart = (pData) => {
        if (!addToCartValidate(pData)) {
            return false;
        }
        if (cartList.length === 0) {
            const getPickingQty = document.getElementById("pickingQty-id-" + pData.sales_order_details_id)
            const tempCart = [...cartList]
            tempCart.push(
                {
                    "pickingQty": parseInt(getPickingQty.value),
                    // "productId":pData.batchList[0].product_id,
                    "productId": pData.id,
                    "quantity": parseInt(getPickingQty.value),
                    "salesOrderId": pData.order_id,
                    "salesOrderDetailsId": pData.sales_order_details_id,
                    "companyId": pData.company_id,
                    "sales_order_details_id": pData.sales_order_details_id,
                    "orderQty": pData.order_quantity,
                    "stockQty": pData.stockQuantity,
                    "atpQty": pData.atpQuantity,
                    "freeQty": pData.free_quantity,
                    "category_name": pData.category_name,
                    "product_name": pData.product_name,
                    "product_sku": pData.product_sku,
                }
            )
            setCartList(tempCart)
        } else {
            const getPickingQty = document.getElementById("pickingQty-id-" + pData.sales_order_details_id)
            const tempCart = [...cartList]
            const index = tempCart.findIndex(obj => obj.sales_order_details_id === pData.sales_order_details_id)

            if (index > -1) {
                showError('This product already added to cart');
                return false;
            } else {
                const productIndex = tempCart.findIndex(obj => obj.productId === pData.id);
                let totalPickQty = 0;
                const atpQuantity = document.getElementById("atpQuantity-id-" + pData.sales_order_details_id).value;
                const stockQuantity = document.getElementById("stockQty-id-" + pData.sales_order_details_id).value;

                if (index == -1 && productIndex == 0) {
                    for (var i = 0; i < tempCart.length; i++) {
                        totalPickQty = totalPickQty + Number(tempCart[i].quantity);
                    }
                    totalPickQty = Number(totalPickQty) + Number(getPickingQty.value);
                }

                if (totalPickQty > parseInt(atpQuantity)) {
                    showError('Picking quantity is always less or equal of ATP Stock Qty.');
                    return false;
                }

                tempCart.push(
                    {
                        "pickingQty": parseInt(getPickingQty.value),
                        // "productId":pData.batchList[0].product_id,
                        "productId": pData.id,
                        "quantity": parseInt(getPickingQty.value),
                        "salesOrderId": pData.order_id,
                        "salesOrderDetailsId": pData.sales_order_details_id,
                        "companyId": pData.company_id,
                        "sales_order_details_id": pData.sales_order_details_id,
                        "orderQty": pData.order_quantity,
                        "stockQty": pData.stockQuantity,
                        "atpQty": pData.atpQuantity,
                        "freeQty": pData.free_quantity,
                        "category_name": pData.category_name,
                        "product_name": pData.product_name,
                        "product_sku": pData.product_sku,
                    }
                )
                setCartList(tempCart)
            }
        }
    }

    const addToCartValidate = (pData) => {
        const getStockQty = document.getElementById("stockQty-id-" + pData.sales_order_details_id);
        const getOrderQty = document.getElementById("orderQty-id-" + pData.sales_order_details_id);
        const getPickingQty = document.getElementById("pickingQty-id-" + pData.sales_order_details_id);
        const remainingQuantity = pData.remainingQuantity;
        const atpQty = document.getElementById("atpQuantity-id-" + pData.sales_order_details_id);

        if (!getPickingQty.value) {
            showError('Picking quantity is required.');
            return false;
        }
        if (getPickingQty.value < 1) {
            showError('Picking quantity must be greater than zero.');
            return false;
        }
        if (parseInt(getPickingQty.value) > parseInt(getOrderQty.value)) {
            showError('Picking quantity is always less or equal of Order Qty.');
            return false;
        }
        if (parseInt(getPickingQty.value) > parseInt(atpQty.value)) {
            showError('Picking quantity is always less or equal of ATP Stock Qty.');
            return false;
        }
        if (parseInt(getPickingQty.value) > parseInt(remainingQuantity)) {
            showError('Remaining Order quantity ' + remainingQuantity + '.');
            return false;
        }
        return true;
    }

    const handleRemoveToCart = (pData) => {
        const cartTemp = [...cartList]
        const index = cartTemp.findIndex((cart) => cart.sales_order_details_id === pData.sales_order_details_id)
        cartTemp.splice(index, 1)
        setCartList(cartTemp)
    }

    const handleCancelPicking = () => {
        setCartList([])
    }

    const getProductList = (order_id) => {
        const URL = `${process.env.REACT_APP_API_URL}/api/delivery-challan/order-product-list/${order_id}/${depot.id}`
        axios.get(URL, JSON.stringify(), { headers: { "Content-Type": "application/json" } }).then(response => {
            setProductList(response.data.data)
        }).catch(err => {

        });
    }

    const handleSave = () => {
        if (cartList.length <= 0) {
            showError('No Product is selected.');
            return false;
        }
        const note = document.getElementById("note").value;
        let obj = new Object();
        obj.companyId = cartList[0].companyId;
        obj.reason = note.trim();
        obj.pickingDetailsDtoList = cartList;

        const URL = `${process.env.REACT_APP_API_URL}/api/picking`;
        axios.post(URL, obj).then(response => {
            if (response.data.success === true) {
                showSuccess(response.data.message);
                history.push('/inventory/stock/sales-order/picking-list');
            } else {
                showError(response.data.message);
                history.push('/inventory/stock/sales-order/picking-list');
            }
        }).catch(err => {
            showError(err);
        });
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
                            <strong>Picking List</strong>
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
                <div className="bg-white">
                    <div className="container-fluid">
                        {/* FROM AND TO ROW */}
                        <div className="row">
                            {/* FROM ROW */}
                            <div className="col-xl-3 mt-5">
                                <strong className="mt-5 dark-gray-color">From</strong><br />
                                <div className="card mb-3 mt-3 border-radius-20">
                                    <div className="card-body">
                                        <div style={{ fontWeight: "500" }} className="dark-gray-color"><strong>{depot.depot_name}</strong></div>
                                        <div className="mt-1"><SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/phone.svg")}
                                            width="12px" height="12px" />&nbsp;<small className="text-muted">{depot.contact_number}</small></div>
                                        <div className="mt-2"><SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/location.svg")} width="15px" height="15px" />
                                            <small className="text-muted">{depot.address}
                                            </small>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            {/* TO ROW */}
                            <div className="offset-xl-6 col-xl-3 mt-5">
                                <strong className="mt-5 dark-gray-color">To</strong><br />
                                <div className="card  mb-3 mt-3 border-radius-20">
                                    <div className="card-body">
                                        <div style={{ fontWeight: "500" }} className="dark-gray-color"><strong>{distributor.distributor_name}</strong></div>
                                        <div className="mt-1"><SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/phone.svg")}
                                            width="12px" height="12px" />&nbsp;<small className="text-muted">{distributor.contact_no}</small></div>
                                        <div className="mt-2"><SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/location.svg")}
                                            width="15px" height="15px" /><small className="text-muted">{distributor.ship_to_address}</small></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-5 mb-5">
                    {/* MAIN CONTENT BODY ROW */}
                    <div className="row">
                        {/* RIGHT SIDE CONTENT */}
                        <div className="col-xl-3">
                            {/* TITLE ROW */}
                            <div>
                                {/* SALES ORDER LIST TITLE CARD */}
                                <Card style={{ borderTopRightRadius: "30px", borderTopLeftRadius: "30px" }}>
                                    <CardBody>
                                        <div className="row no-gutters">
                                            <div className="col-10">
                                                <span className="text-muted">Title</span><br />
                                                <strong>Sales Order</strong>
                                            </div>
                                            <div className="col-2">
                                                <div className="position-absolute font-12" style={{ left: "15px", top: "20px" }}>
                                                    <strong>{orderList.length}</strong></div>
                                                <CircularProgress className="mt-2" variant="static" value={100} />
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-muted"><strong>ORDER LIST</strong></span>
                                        </div>
                                    </CardBody>
                                </Card>
                            </div>
                            {/* ORDER LIST VIEW ROW */}
                            <div className="scroll-product-search">
                                {
                                    orderList.map((order, index) => (
                                        <div className="mt-5 order-list-div"
                                            style={{ cursor: "pointer" }} onClick={() => handleSelectOrderList(order, index)} id={"id-" + index}>
                                            <Card className="p-3" >
                                                <CardBody>
                                                    <div className="position-absolute" style={{ left: "17px" }}>
                                                        <span>
                                                            <input className="all-radio" id={"radio-id-" + index} type="radio" />
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className="float-right mt-1"><SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/delivery.svg")} /></span>
                                                        <span className="text-muted">Order No</span><br />
                                                        <strong>{order.order_no}</strong><br />
                                                        <span className="text-muted">Order Date: <strong>{format(parseISO(order.order_date), 'dd-MMM-yyyy')}</strong></span>
                                                        <br />
                                                    </div>
                                                    <div className="mt-5">
                                                        <span className="text-muted">Booking No</span><br />
                                                        <strong>{order.booking_no}</strong><br />
                                                        <span className="text-muted">Booking Date: <strong>{format(parseISO(order.booking_date), 'dd-MMM-yyyy')}</strong></span>
                                                    </div>
                                                </CardBody>
                                            </Card>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>

                        {/* MIDDLE SIDE CONTENT */}
                        <div className="col-xl-6">
                            {/* TITLE ROW */}
                            <Card style={{ borderTopLeftRadius: "30px", borderTopRightRadius: "30px" }}>
                                <CardBody>
                                    <div>
                                        <span className="text-muted">Title</span><br />
                                        <strong>Product List</strong>
                                    </div>
                                    <div className="mt-5">
                                        <span className="text-muted float-right"><strong>ACTION</strong></span>
                                        <span className="text-muted"><strong>PRODUCTS INFO</strong></span>
                                    </div>
                                </CardBody>
                            </Card>
                            <div className="scroll-product-search">
                                {
                                    productList.map((product, index) => (
                                        <Card className="mt-3">
                                            <CardBody>
                                                <div>
                                                    {/* PRODUCT INFO ROW */}
                                                    <span className="float-right">
                                                        <button className="btn text-white mr-3 float-right" style={{ background: "#6FCF97" }} onClick={() => handleAddToCart(product)}>
                                                            <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/more.svg")} />
                                                            &nbsp;Add
                                                        </button>
                                                    </span>
                                                    <span className="text-muted">{product.product_sku}</span><br />
                                                    <strong>{product.product_name}</strong><br />
                                                    <span className="text-muted">{product.category_name}</span><br />
                                                    <span className="float-right dark-success-color mt-n2">
                                                        <span>Remaining Qty.</span>
                                                        <strong>{product.remainingQuantity}</strong>
                                                    </span>
                                                </div>

                                                {/* PICKING QTY ADD ROW */}
                                                <div className="mt-5 row">
                                                    <div className="col-xl-3">
                                                        <label className='level-title'>Picking Qty.</label><br />
                                                        <span><input placeholder="Write here..." id={"pickingQty-id-" + product.sales_order_details_id} type="text" className="text-center border p-2 w-75 rounded" onKeyPress={(e) => allowOnlyNumeric(e)} value={product.selectedQty} /></span>
                                                    </div>
                                                    <div className="col-xl-3">
                                                        <label className='level-title'>Order Qty.</label><br />
                                                        <span><input readOnly type="text" id={"orderQty-id-" + product.sales_order_details_id} className="text-center border p-2 w-75 rounded" value={product.order_quantity} /></span>
                                                    </div>
                                                    <div className="col-xl-3">
                                                        <label className='level-title'>Stock Qty.</label><br />
                                                        <span><input readOnly type="text" id={"stockQty-id-" + product.sales_order_details_id} className="text-center border p-2 w-75 rounded" value={product.stockQuantity} /></span>
                                                    </div>
                                                    <div className="col-xl-3">
                                                        <label className='level-title'>ATP Qty.</label><br />
                                                        <span><input readOnly type="text" id={"atpQuantity-id-" + product.sales_order_details_id} className="text-center border p-2 w-75 rounded" value={product.atpQuantity} /></span>
                                                    </div>

                                                    {/* {
                                                        product.free_quantity === 0 ? "" :
                                                            <div className="col-xl-3">
                                                                <label className='level-title'>Free Qty.</label><br />
                                                                <span><input readOnly type="text" className="text-center border p-2 w-75 rounded" value={product.free_quantity} /></span>
                                                            </div>
                                                    } */}

                                                </div>
                                            </CardBody>
                                        </Card>
                                    ))
                                }
                            </div>
                        </div>

                        {/* LEFT SIDE CONTENT */}
                        <div className="col-xl-3">
                            {/* NEW PICKING LIST TITLE CARD */}
                            <Card style={{ borderTopRightRadius: "30px", borderTopLeftRadius: "30px" }}>
                                <CardBody>
                                    <div>
                                        <span className="text-muted">Title</span><br />
                                        <strong>New Picking List</strong>
                                    </div>
                                    <div className="mt-5">
                                        <span className="text-muted"><strong>PRODUCTS</strong></span>
                                        <span className="text-muted float-right"><strong>ACTION</strong></span>
                                    </div>
                                </CardBody>
                            </Card>

                            {/* ADD DATA INTO CART ROW */}
                            {
                                cartList.map((obj, index) => (
                                    <Card className="mt-5">
                                        <CardBody>
                                            <div className="d-flex">
                                                <div className="ml-n3 mt-3"><span className="rounded light-gray-bg pl-2 pr-2">{index + 1}</span></div>
                                                <div className="w-100 pl-5">
                                                    <div>
                                                        <button className="btn float-right" style={{ background: "#F9F9F9", color: "#0396FF" }} onClick={() => handleRemoveToCart(obj)}
                                                        >
                                                            <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/red-delete.svg")} />
                                                        </button>
                                                    </div>
                                                    <div>
                                                        <span className="text-muted">{obj.product_sku}</span><br />
                                                        <strong>{obj.product_name}</strong><br />
                                                        <span className="text-muted">{obj.category_name}</span><br />
                                                    </div>
                                                    <div className="mt-5">
                                                        <span className="dark-blue-color">
                                                            <span className="mr-2">Order Qty.</span>
                                                            <strong>{obj.orderQty}</strong>
                                                        </span>
                                                        <span className="float-right dark-success-color">
                                                            <span className="mr-2">Picking Qty.</span>
                                                            <strong className="dark-success-color">{obj.pickingQty}</strong>
                                                        </span>
                                                    </div>
                                                    <div className="mt-2" style={{ border: "1px solid #F2F2F2", width: "100%" }}></div>

                                                    {/* TOTAL QTY ROW */}
                                                    <div className="mt-2">
                                                        <span className="dark-purple-color">
                                                            <span className="mr-2">Stock Qty.</span>
                                                            <strong>{obj.stockQty}</strong>
                                                        </span>
                                                        <span className="float-right dark-gray-color">
                                                            {/* <span className="mr-2 text-muted">Free Qty.</span>
                                                            <strong>{obj.freeQty}</strong> */}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardBody>
                                    </Card>
                                ))
                            }

                            {/* PICKING LIST CREATE CART ROW */}
                            <Card className="mt-5">
                                <CardBody>
                                    {/* NOTES ROW */}
                                    <div className="mt-3">
                                        <label className="dark-gray-color">Note</label>
                                        <textarea id="note" type="text" className="form-control" rows="5" placeholder="Write here..." />
                                    </div>
                                </CardBody>
                            </Card>
                            <Card className="mt-5" style={{ borderBottomRightRadius: "30px", borderBottomLeftRadius: "30px" }}>
                                <CardBody>
                                    {/* CREATE OR CANCEL BTN ROW */}
                                    <div className="d-flex justify-content-between">
                                        <div className="font-12">
                                            <button className="btn dark-danger-color mt-2" style={{ background: "#F9F9F9", color: "#0396FF" }} onClick={handleCancelPicking}>
                                                <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/reject.svg")} width="13px" height="13px" />
                                                &nbsp;<strong>Cancel Picking</strong>
                                            </button>
                                        </div>
                                        <div className="font-12">
                                            <button className="btn text-white mt-2" style={{ background: "#6FCF97" }} onClick={handleSave}>
                                                <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/more.svg")} width="13px" height="13px" />
                                                &nbsp;<strong>Create Picking List</strong>
                                            </button>
                                        </div>
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