import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { toAbsoluteUrl } from "../../../../../../../../../_metronic/_helpers";
import SVG from "react-inlinesvg";
import { Card } from "react-bootstrap";
import { CardBody } from "../../../../../../../../../_metronic/_partials/controls";
import CircularProgress from '@material-ui/core/CircularProgress';
import BookingApprove from "./BookingApprove";
import moment from "moment";
import axios from "axios";
import { showError, showSuccess } from "../../../../../../../../pages/Alert";
import { amountFormatterWithoutCurrency, dateFormatPattern } from "../../../../../../../Util";

export default function AddSalesOrder() {
    let history = useHistory();
    const location = useLocation();
    const companyId = location.state.companyId;
    const accountingYearId = location.state.accountingYearId;
    const semesterId = location.state.semesterId;
    
    // const [companyIdDetails, setCompanyIdDetails] = useState("")
    const salesBooking = location.state.state;
    const [salesBookingDetails, setSalesBookingDetails] = useState([])
    const [undeliveredSalesOrders, setUndeliveredSalesOrders] = useState([])
    const [salesBookingId, setSalesBookingId] = useState(salesBooking.bookingId);
    const [salesOrderCart, setSalesOrderCart] = useState([])
    const [updateOrderList, setUpdateOrderList] = useState(false)
    const [deliveryOrderList, setDeliveryOrderList] = useState(false)
    const [salesOrder, setSalesorder] = useState({salesOrderId:"",deliveryDate:salesBooking.tentativeDeliveryDate, companyId: companyId, salesBookingId: salesBookingId});
    const [isUpdateData, setIsUpdateData] = useState(false);
    const [salesOrderId, setSalesOrderId] = useState('');
    //const [salesOrderDetails, setSalesOrderDetails] = useState({salesOrderDetails:salesOrderCart});
    const [indexData, setIndexData] = useState(0)
    let subTotal = 0;
    let totalDiscount = 0;
    let total = 0
    useEffect(() => {
        getUndeliveredSalesOrders(companyId, accountingYearId, semesterId)
    },[companyId, accountingYearId, semesterId]);

    useEffect(() => {
       getSalesBookingAndSalesOrderDetails(salesBookingId);
    },[salesBookingId]);

    
    const handleBackToAllListPage = () => {
        history.push('/inventory/stock/sales-order/sales-order-list');
    }
    const openFullscreen = () => {
        const elem = document.getElementById("myvideo");
        elem.classList.add("scroll-product-search");
        elem.requestFullscreen();
    }
    const closeFullscreen = () => {
        const elem = document.getElementById("myvideo");
        elem.classList.remove("scroll-product-search");
        document.exitFullscreen();
    }
    const handleRemovetoAdd = (data) => {
        const temp = [...salesBookingDetails]
        const index = temp.findIndex(obj => obj.bookingDetailsId == data.salesBookingDetailsId);
        temp[index].added = ""
        //temp[index].orderQty = parseInt(temp[index].preQty) + parseInt(temp[index].orderQty);
        setSalesBookingDetails(temp)
        const tempBookingApproval = [...salesOrderCart]
        const bookingApprovalIndex = tempBookingApproval.findIndex(obj => obj.salesBookingDetailsId == data.salesBookingDetailsId);
        tempBookingApproval.splice(bookingApprovalIndex, 1);
        setSalesOrderCart(tempBookingApproval)
    }
    const handleNewOrder = () => {
        setSalesBookingDetails([]);
        setIsUpdateData(false);
        getSalesBookingAndSalesOrderDetails(salesBookingId)
        setSalesOrderCart([])
        //handleSelectOrderList();
    }
    const handleSelectOrderList = (event, number, salesBookingId, salesOrderId) => {
        let id = "id-" + number;
        const getId = document.getElementById(id);
        const getElements = document.getElementsByClassName('order-list-div');

        for (var i = 0; i < getElements.length; i++) {
            getElements[i].classList.remove('select-order-list');
        }

        if (getId) {
            if (deliveryOrderList) {
                setDeliveryOrderList(true)
                setUpdateOrderList(false)
                getId.classList.add('select-order-list');
            } else {
                setUpdateOrderList(true)
                setDeliveryOrderList(false)
                getId.classList.add('select-order-list');
            }
        }
        setIsUpdateData(true)
        getSalesBookingDetailsInSalesOrder(salesBookingId, salesOrderId);
        let updateSalesOrder = {...salesOrder, salesOrderId:salesOrderId}
        setSalesorder(updateSalesOrder);
    }
    const handleCancelChange = () =>{
       
        salesBookingDetails.map((salesBooking,index) => {
           
            salesBooking.added = ""

        })
        setSalesOrderCart([])
    }

    const getSalesBookingAndSalesOrderDetails = (salesBookingId) => {
       
        const URL = `${process.env.REACT_APP_API_URL}/api/sales-order/booking-data/${salesBookingId}`;
        axios.get(URL).then(response => {
            setSalesBookingDetails(response.data.data);
            //console.log("response.data.data", response.data.data);
        }).catch(err => {
           
        });
    }

    const getSalesBookingDetailsInSalesOrder = (salesBookingId, salesOrderId) => {
        
        const URL = `${process.env.REACT_APP_API_URL}/api/sales-order/booking-data/${salesBookingId}/${salesOrderId}`;
        axios.get(URL).then(response => {
            setSalesBookingDetails([])
            setSalesBookingDetails(response.data.data);
        }).catch(err => {
           
        });
    }

    const getUndeliveredSalesOrders = (companyId, accountingYearId, semesterId) => {
       
        let queryString = "?";
        queryString += "companyId="+companyId;
        queryString += "&accountingYearId="+accountingYearId;
        queryString += semesterId? "&semesterId="+semesterId : '';

        if (accountingYearId) {          
            const URL = `${process.env.REACT_APP_API_URL}/api/sales-order/undelivered-list`+queryString;
            axios.get(URL).then(response => {
                setUndeliveredSalesOrders(response.data.data);
            
            }).catch(err => {
            
            }); 
        }
        else {
            //showError("Please select accounting year to Continue");
        }
    }

    const saveSalesOrder = () => {
        
        if(salesOrderCart.length == 0) {
            showError("Please Add Product to Continue...");
            return false;
        }
        const URL = `${process.env.REACT_APP_API_URL}/api/sales-order`;
        axios.post(URL, JSON.stringify({
            ...salesOrder,
            salesOrderDetailsDto: salesOrderCart
        }), {headers: {"Content-Type": "application/json"}}).then(response => {
           
            if (response.data.success === true) {
                showSuccess(response.data.message)
                setSalesOrderCart([]);
                getUndeliveredSalesOrders(companyId, accountingYearId, semesterId);
            } else {
                showError(response.data.message);
            }
        }).catch(err => {
            showError("Cannot be Submitted");
        });
    }

    const updateSalesOrder = () => {
        
        if(salesOrderCart.length == 0) {
            showError("Please Add Product to Continue...");
            return false;
        }
        const URL = `${process.env.REACT_APP_API_URL}/api/sales-order`;
        axios.put(URL, JSON.stringify({
            ...salesOrder,
            salesOrderDetailsDto: salesOrderCart
        }), {headers: {"Content-Type": "application/json"}}).then(response => {
           
            if (response.data.success === true) {
                showSuccess(response.data.message)
                setSalesOrderCart([]);
                getUndeliveredSalesOrders(companyId, accountingYearId, semesterId);
            } else {
                showError(response.data.message);
            }
        }).catch(err => {
            showError("Cannot be Submitted");
        });
    }

    return (
        <>
            <div className="container-fluid" id="myvideo" style={{ background: "#f3f6f9" }}>
                {/* HEADER ROW */}
                <div className="approval-view-header">
                    {/* BACK AND TITLE ROW */}
                    <div className="row">
                        <div className="col-3">
                            <span>
                                <button className='btn' onClick={handleBackToAllListPage}>
                                    <strong>
                                        <i className="bi bi-arrow-left-short" style={{ fontSize: "30px" }}></i>
                                    </strong>
                                </button>
                            </span>
                        </div>
                        <div className="col-6 text-center mt-4">
                            <strong>Sales Order</strong>
                        </div>
                        <div className="col-3 text-right text-muted">
                            <button className="btn text-white" onClick={openFullscreen}>
                                <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/full-screen.svg")} />
                            </button>
                            <button className="btn text-white" onClick={closeFullscreen}>
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
                                <strong class="mt-5 dark-gray-color">From</strong><br />
                                <div class="card mb-3 mt-3 border-radius-20">
                                    <div class="row no-gutters">
                                        <div class="col-xl-3">
                                            {/* <SVG style={{ marginTop: "15px" }} className="p-5" src={toAbsoluteUrl("/media/svg/icons/project-svg/group-logo.svg")} width="100px" height="100px" /> */}
                                        </div>
                                        <div class="col-xl-9">
                                            <div class="card-body">
                                                <div style={{ fontWeight: "500" }} className="dark-gray-color"><strong>{salesBooking.distributorName}</strong></div>
                                                <div className="mt-1"><SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/phone.svg")} width="12px" height="12px" />&nbsp;<small className="text-muted">{salesBooking.distributorContactNo}</small></div>
                                                <div className="mt-2"><SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/location.svg")} width="15px" height="15px" /><small className="text-muted">{salesBooking.distributorAddress}</small></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* AADDITIONAL INFO ROW */}
                            <div className="col-xl-6 mt-5">
                                <strong class="dark-gray-color mt-n5">Additional Info</strong><br />
                                <div class="card mb-3 mt-3 border-radius-20">

                                    <div class="card-body">
                                        <div className="row">
                                            {/* APPLIED BY ROW */}
                                            <div className="col-xl-4">
                                                <div className="mt-xl-n4"><span class="dark-gray-color">Applied By</span></div>
                                                <div class="row no-gutters mt-3">
                                                    <div class="col-xl-3">
                                                        <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/group-logo.svg")} />
                                                    </div>
                                                    <div class="col-xl-9">
                                                        <div style={{ fontWeight: "500" }} className="dark-gray-color"><strong>{salesBooking.salesOfficerName}</strong></div>
                                                        <div className="mt-1">
                                                            {/* <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/phone.svg")} width="12px" height="12px" />&nbsp; */}
                                                            <small className="text-muted">{salesBooking.designation +", "+salesBooking.soLocationName}</small></div>

                                                    </div>
                                                </div>
                                            </div>

                                            {/* Booking Info row */}
                                            <div className="col-xl-4">
                                                <div className="mt-xl-n4"><span class="dark-gray-color">Booking Info</span></div>
                                                <div class="row no-gutters mt-3">
                                                    <div class="col-xl-3">
                                                        <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/group-logo.svg")} />
                                                    </div>
                                                    <div class="col-xl-9">
                                                        <div style={{ fontWeight: "500" }} className="dark-gray-color"><strong>{"Booking No. "+ salesBooking.bookingNo}</strong></div>
                                                        <div className="mt-1">
                                                            {/* <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/phone.svg")} width="12px" height="12px" />&nbsp; */}
                                                            <small className="text-muted">{moment(salesBooking.bookingDate).format(dateFormatPattern()) + "(Booking Date)"}</small></div>

                                                    </div>
                                                </div>
                                            </div>

                                            {/* Delivery Info row */}
                                            <div className="col-xl-4">
                                                <div className="mt-xl-n4"><span class="dark-gray-color">Delivery Info</span></div>
                                                <div class="row no-gutters mt-3">
                                                    <div class="col-xl-3">
                                                        <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/group-logo.svg")} />
                                                    </div>
                                                    <div class="col-xl-9">
                                                        <div style={{ fontWeight: "500" }} className="dark-gray-color"><strong>{salesBooking.daysLeft +" Days Left"}</strong></div>
                                                        <div className="mt-1">
                                                            {/* <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/phone.svg")} width="12px" height="12px" />&nbsp; */}
                                                            <small className="text-muted">{moment(salesBooking.tentativeDeliveryDate).format(dateFormatPattern()) + " (Delivery Date)"}</small></div>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>


                            {/* TO ROW */}
                            <div className="col-xl-3 mt-5">
                                <strong class="mt-5 dark-gray-color">To</strong><br />
                                <div class="card mb-3 mt-3 border-radius-20">
                                    <div class="row no-gutters">
                                        <div class="col-xl-3">
                                            <SVG style={{ marginTop: "15px" }} className="p-5" src={toAbsoluteUrl("/media/svg/icons/project-svg/group-logo.svg")} width="100px" height="100px" />
                                        </div>
                                        <div class="col-xl-9">
                                            <div class="card-body">
                                                <div style={{ fontWeight: "500" }} className="dark-gray-color"><strong>{salesBooking.depotName}</strong></div>
                                                <div className="mt-1"><SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/phone.svg")} width="12px" height="12px" />&nbsp;<small className="text-muted">{salesBooking.depotContactNo}</small></div>
                                                <div className="mt-2"><SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/location.svg")} width="15px" height="15px" /><small className="text-muted">{salesBooking.depotAddress}</small></div>
                                            </div>
                                        </div>
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
                                            {/* <div className="col-2">
                                                <div className="position-absolute font-12" style={{ left: "10px", top: "30px" }}><strong>85%</strong></div>
                                                <CircularProgress className="mt-5" variant="static" value={85} />
                                            </div> */}
                                        </div>
                                        <div>
                                            <span className="text-muted"><strong>ORDER LIST</strong></span>
                                        </div>
                                    </CardBody>
                                </Card>
                            </div>

                            {/* NEW SALES ORDER ROW */}
                            <div className="bg-info text-white text-center p-5 rounded mt-5" onClick={handleNewOrder} style={{ cursor: "pointer" }}>
                                <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/more.svg")} width="30px" height="30px" />
                                <strong>&nbsp;New Sales Order</strong>
                            </div>

                            {/* ORDER LIST VIEW ROW */}

                            <div className="scroll-product-search">
                                {undeliveredSalesOrders.map((so, index) => 
                                    (<div className="mt-5 order-list-div" style={{ cursor: "pointer" }} onClick={(event) => handleSelectOrderList(event, index,so.salesBookingId,so.salesOrderId)} id={"id-" + index}>
                                    <Card>
                                        <CardBody>
                                            <div>
                                                <span className="text-muted">Order No.</span><br />
                                                <strong>{so.salesOrderNo} ({moment(so.salesOrderDate).format(dateFormatPattern())})</strong>
                                            </div>
                                            <div className="mt-5">
                                                <span className="text-muted">Amount</span><br />
                                                <strong>{amountFormatterWithoutCurrency(so.orderAmount)} ({so.quantity + " Qty"})</strong>
                                            </div>
                                            
                                        </CardBody>
                                    </Card>
                                </div>)
                                )}
                            </div>
                            
                            
                        </div>

                        {/* MIDDLE SIDE CONTENT */}
                        <div className="col-xl-6">
                            {/* TITLE ROW */}
                            <div>
                                {/* BOOKING SUMMARY TITLE CARD */}
                                <Card className="h-100" style={{ borderTopLeftRadius: "30px", borderTopRightRadius: "30px" }}>
                                    <CardBody>
                                        <div className="row no-gutters">
                                            <div className="col-4">
                                                <span className="text-muted">Title</span><br />
                                                <strong>Booking List</strong>
                                            </div>
                                            {/* <div className="col-4 text-center">
                                                <span className="text-muted">Available Order Amount</span><br />
                                                <strong>980,530</strong>
                                            </div> */}
                                            {/* <div className="col-4">
                                                <span className="text-muted float-right">Booking Amount</span><br />
                                                <strong className="float-right">980,530,000(CREDIT)</strong>
                                            </div> */}
                                        </div>
                                        <div className="row no-gutters mt-5">
                                            <div className="col-3">
                                                <span className="text-muted"><strong>PRODUCTS</strong></span>
                                            </div>
                                            <div className="col-3">
                                                <span className="text-muted"><strong>REMAINING BOOKING QTY.</strong></span>
                                            </div>
                                            <div className="col-3 text-center">
                                                <span className="text-muted"><strong>SALES ORDER QTY.</strong></span>
                                            </div>
                                            <div className="col-3 text-right">
                                                <span className="text-muted"><strong>ACTION</strong></span>
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                            </div>

                            {/* DATA ROW */}
                            {
                                salesBookingDetails.map((data) => (
                                    <div>
                                        <BookingApprove
                                            setSalesBookingDetails={setSalesBookingDetails}
                                            salesBookingDetails={salesBookingDetails}
                                            data={data}
                                            salesOrderCart={salesOrderCart}
                                            setSalesOrderCart={setSalesOrderCart}
                                            isUpdateData= {isUpdateData}
                                        />
                                    </div>
                                ))
                            }

                        </div>

                        {/* LEFT SIDE CONTENT */}
                        <div className="col-xl-3">
                            {/* NEW SALES ORDER ADD TITLE CARD */}
                            <Card style={{ borderTopRightRadius: "30px", borderTopLeftRadius: "30px" }}>
                                <CardBody>
                                    <div className="row no-gutters">
                                        <div className="col-6">
                                            <span className="text-muted">Sales Order No.</span><br />
                                            {/* <strong>New Order</strong> */}
                                        </div>
                                        <div className="col-6">
                                            <span className="text-muted float-right">System Generated...</span><br />
                                            {/* <strong className="float-right">530,000</strong> */}
                                        </div>
                                    </div>
                                    <div className="row no-gutters mt-5">
                                        <div className="col-6">
                                            <span className="text-muted"><strong>PRODUCTS</strong></span>
                                        </div>
                                        <div className="col-6">
                                            <span className="text-muted float-right"><strong>ACTION</strong></span>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>

                            {/* NEW SALES ORDER ADD DATA  CARD */}
                            <div className="mt-4">
                                {
                                    salesOrderCart.map((cartData, index) => (
                                        console.log("cartData++++++++++++++++",cartData),
                                        <Card>
                                            <CardBody>
                                                <div className="d-flex">
                                                    <div className="ml-n3 mt-3"><span className="rounded light-gray-bg pl-2 pr-2">{index + 1}</span></div>
                                                    <div className="w-100 pl-5">
                                                        <div>
                                                            <button className="btn float-right" style={{ background: "#F9F9F9", color: "#0396FF" }} onClick={() => handleRemovetoAdd(cartData)}>
                                                                <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/red-delete.svg")} />
                                                            </button>
                                                        </div>
                                                        <div>
                                                            <span className="text-muted">{cartData.productSku}</span><br />
                                                            <strong>{cartData.productName}</strong><br />
                                                            <span className="text-muted">{cartData.productCategory}</span><br />
                                                            <span className="text-muted">
                                                                <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/price-gray.svg")} />&nbsp;Price&nbsp;
                                                                {cartData.discountedPrice ? 
                                                                <>
                                                                    <del>&nbsp;{(cartData.tradePrice).toFixed(2)}&nbsp;</del>
                                                                    <strong>&nbsp;{cartData.discountedPrice.toFixed(2)}&nbsp;</strong>
                                                                </> 
                                                                : <strong>&nbsp;{(cartData.tradePrice).toFixed(2)}&nbsp;</strong>}
                                                            </span>
                                                        </div>
                                                        <div className="mt-5" style={{ border: "1px solid #F2F2F2", width: "100%" }}></div>

                                                        {/* TOTAL QTY ROW */}
                                                        <div className="mt-3">
                                                            <span>Qty.
                                                                <strong>
                                                                    &nbsp;{cartData.orderQuantity}&nbsp;
                                                                    <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/full-screen-close.svg")} width="10px" height="10px" />
                                                                    &nbsp;{(cartData.tradePrice).toFixed(2)}&nbsp;
                                                                </strong>
                                                            </span>
                                                            <span className="float-right">
                                                                <strong>
                                                                    {(cartData.orderQuantity * cartData.tradePrice).toFixed(2)}
                                                                </strong>
                                                            </span>
                                                        </div>

                                                        {/* DISCOUNT ROW */}
                                                        <div className="mt-3">
                                                            <span>Discount
                                                            <strong>
                                                                    &nbsp;{cartData.orderQuantity}&nbsp;
                                                                    <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/full-screen-close.svg")} width="10px" height="10px" />
                                                                    &nbsp;{(cartData.tradeDiscount).toFixed(2)}&nbsp;
                                                                </strong>
                                                            </span>
                                                            <span className="float-right dark-success-color">
                                                                <strong>
                                                                    -{(cartData.orderQuantity * (cartData.tradeDiscount.toFixed(4))).toFixed(2)}
                                                                </strong>
                                                            </span>
                                                        </div>

                                                        {/* VAT ROW */}
                                                        {/* <div className="mt-3">
                                                            <span>VAT (15%)</span>
                                                            <span className="float-right">
                                                                <strong>
                                                                    166,920
                                                                </strong>
                                                            </span>
                                                        </div> */}
                                                    </div>
                                                    <div className="d-none">
                                                      { subTotal += (cartData.orderQuantity * cartData.tradePrice)}
                                                      { totalDiscount += cartData.orderQuantity * cartData.tradeDiscount.toFixed(4)}
                                                    </div>
                                                    
                                                </div>
                                            </CardBody>
                                        </Card>
                                    ))
                                }
                            </div>

                            {/* SUB TOTAL CARD */}
                            <Card className="mt-4" style={{ borderBottomRightRadius: "30px", borderBottomLeftRadius: "30px" }}>
                                <CardBody>
                                    {/* SUB TOTAL ROW */}
                                    <div className="mt-3">
                                        <strong>Sub Total</strong>
                                        <strong className="float-right">{subTotal.toFixed(2)}</strong>
                                    </div>

                                    {/* DISCOUNT ROW */}
                                    <div className="mt-3">
                                        <span>Total Discount</span>
                                        <span className="float-right dark-success-color">
                                            <strong>
                                                -{totalDiscount.toFixed(2)}
                                            </strong>
                                        </span>
                                    </div>

                                    {/* VAT ROW */}
                                    {/* <div className="mt-3">
                                        <span>Total VAT (15%)</span>
                                        <span className="float-right">
                                            <strong>
                                                166,920
                                            </strong>
                                        </span>
                                    </div> */}

                                    <div className="mt-5" style={{ border: "1px solid #4F4F4F", width: "100%" }}></div>

                                    {/* TOTAL ROW */}
                                    <div className="mt-3">
                                        <strong>Total</strong>
                                        <strong className="d-none">{
                                            total = subTotal.toFixed(4) - totalDiscount.toFixed(4)
                                        }</strong>
                                        <strong className="float-right">{
                                            total.toFixed(2)
                                        }</strong>
                                    </div>
                                        {
                                            updateOrderList ? 
                                                 <div className="mt-5">
                                                 <button className="btn dark-danger-color" style={{ background: "#F9F9F9", color: "#0396FF" }} onClick={()=>handleCancelChange()}>
                                                     <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/reject.svg")} />
                                                     &nbsp;<strong>Cancel Order</strong>
                                                 </button>
                                                 <button className="btn text-white mr-3 float-right" style={{ background: "#6FCF97" }} onClick={() => updateSalesOrder()}>
                                                     <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/white-approved.svg")} />
                                                     &nbsp;<strong>Modify Sales Order</strong>
                                                 </button>
                                             </div>:
                                                deliveryOrderList ?
                                                <div className="pt-5 d-flex justify-content-between">
                                                    <div>
                                                    <span className="dark-gray-color rounded p-3 light-gray-bg">
                                                        <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/full-screen-close.svg")} />
                                                        &nbsp;<strong>Cancel Order</strong>
                                                    </span>
                                                    </div>
                                                    <div>
                                                    <span className="dark-success-color rounded light-gray-bg p-3">
                                                        <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/green-car.svg")} />
                                                        &nbsp;<strong>Already Delivered</strong>
                                                    </span>
                                                    </div>
                                                </div> :
                                                <div className="mt-5">
                                                    <button className="btn dark-danger-color" style={{ background: "#F9F9F9", color: "#0396FF" }} onClick={()=>handleCancelChange()}>
                                                        <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/reject.svg")} />
                                                        &nbsp;<strong>Cancel Order</strong>
                                                    </button>
                                                    <button className="btn text-white mr-3 float-right" style={{ background: "#6FCF97" }} onClick={() => saveSalesOrder()}>
                                                        <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/more.svg")} />
                                                        &nbsp;<strong>Create  Sales Order</strong>
                                                    </button>
                                                </div>
                                        }
                                </CardBody>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}