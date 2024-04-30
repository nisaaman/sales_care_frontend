import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from "react-router-dom";
import { toAbsoluteUrl } from "../../../../../../../../../_metronic/_helpers";
import SVG from "react-inlinesvg";
import { Card } from "react-bootstrap";
import { CardBody } from "../../../../../../../../../_metronic/_partials/controls";
import BookingApprove from "./BookingApprove";
import TicketsGenerate from "./TicketsGenerate";
import NoNeedTickets from "./NoNeedTickets";
import NeedTickets from "./NeedTickets";
import axios from 'axios';
import { data } from 'jquery';
import { showError, showSuccess } from '../../../../../../../../pages/Alert';
import { shallowEqual, useSelector } from 'react-redux';
import { hasCreateAccess } from "../../../../../../../Util";

export default function SalesBooking() {
    let history = useHistory();
    let location = useLocation();
    const permissions = useSelector((state) => state.auth.user.permissions, shallowEqual);
    const bookingInfo = location.state.state;
    //console.log(bookingInfo);
    const [list, setList] = useState([])
    const [bookingApprovalList, setBookingApprovalList] = useState([]);
    let [bookingConfirmedAmount, setBookingConfirmedAmount] = useState(0.00);
    let [totalDiscountAmount, setTotalDiscountAmount] = useState(0.00);
    const [distributorAndDepot, setDistributorAndDepot] = useState([]);
    const [distributorLogo, setDistributorLogo] = useState();
    const [bookingLifeCycleStatus, setBookingLifeCycleStatus] = useState([]);
    const [ticketDetails, setTicketDetails] = useState([]);

    useEffect(() => {
        getSalesBookingDetails();
        //getConfirmedBookingItemList();
        //getDistributorAndDepot();
        //getSalesBookingLifeCycleStatus();
        
    }, []);

    const handleBackToAllListPage = () => {
        history.push('/inventory/stock/sales-order/sales-booking-list');
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
    const handleRemovetoAdd = (data) =>{
        const temp = [...list]
        const index = temp.findIndex(obj => obj.booking_item_id === data.booking_item_id);
        temp[index].added = "";
        temp[index].item_status=data.item_status;
        setList(temp);
        const tempBookingApproval = [...bookingApprovalList] 
        const bookingApprovalIndex = tempBookingApproval.findIndex(obj => obj.booking_item_id === data.booking_item_id);
        tempBookingApproval.splice(bookingApprovalIndex, 1);
        setBookingApprovalList(tempBookingApproval);
        setBookingConfirmedAmount(bookingConfirmedAmount-data.booking_amount);
        setTotalDiscountAmount(totalDiscountAmount-data.discounted_amount);
    }

    const handleStockConfirm = (bookingApprovalList) => {
        stockConfirm(bookingApprovalList);
    }

    const handleCardClear = () => {
        setBookingApprovalList([]);
        setBookingConfirmedAmount(0.00);
        setTotalDiscountAmount(0.00);

        bookingApprovalList.map((cartProduct)=>{
            list.map((product)=>{
                if(product.booking_item_id === cartProduct.booking_item_id){
                    product.added = "";
                }
            })
        })
  
        // let obj ={
        //     "id":bookingInfo.booking_id,
        //     "approvalStatus":"REJECTED"
        // }
        // bookingReject(obj);
    }

    const stockConfirm = (bookingApprovalList) => {  
        if(bookingApprovalList.length == 0) {
            showError("Please Add Product ");
            return false;
        }       
        const URL = `${process.env.REACT_APP_API_URL}/api/sales-booking/update-sales-booking-item`;
        axios.put(URL, JSON.stringify(bookingApprovalList), { headers: { "Content-Type": "application/json" } }).then(response => {
        if (response.data.success === true) {
            showSuccess("Booking updated successfully.");
            setBookingApprovalList([]);
            setBookingConfirmedAmount(0.00);
            setTotalDiscountAmount(0.00);
        }
        }).catch(err => {
            showError(err);
        });
    }
    
    const bookingReject = (obj) => {
        const URL = `${process.env.REACT_APP_API_URL}/api/sales-booking/update-sales-booking`;
        axios.put(URL, JSON.stringify(obj), { headers: { "Content-Type": "application/json" } }).then(response => {
        if (response.data.success === true) {
            showSuccess("Booking rejected successfully.");
        }
        }).catch(err => {
            showError(err);
        });
    }

    const getSalesBookingDetails = () => {    
        const URL = `${process.env.REACT_APP_API_URL}/api/sales-booking/get-booking-to-stock-confirm/${bookingInfo.booking_id}`;
        axios.get(URL, JSON.stringify(), { headers: { "Content-Type": "application/json" } }).then(response => {
            let salesBookingDetails = response.data.data.salesBookingDetails;
            setList(salesBookingDetails);
            console.log(salesBookingDetails);
        });
    }

    const getDistributorAndDepot = () => {    
        let queryString = '?';
        queryString += '&companyId=' + bookingInfo.company_id;
        queryString += '&distributorId=' + bookingInfo.distributor_id;
        const URL = `${process.env.REACT_APP_API_URL}/api/distributor/details-info-with-depot-location`+queryString;
        axios.get(URL, JSON.stringify(), { headers: { "Content-Type": "application/json" } }).then(response => {
            if (response.data.success === true) {
                let distributorAndDepot = response.data.data.depotAndLocation;
                let distributorLogo = response.data.data.distributorLogo;
                setDistributorAndDepot(distributorAndDepot);
                setDistributorLogo(distributorLogo);
            }            
        });
    }

    const getConfirmedBookingItemList = () => {    
        const URL = `${process.env.REACT_APP_API_URL}/api/sales-booking/get-confirmed-booking-item-list/${bookingInfo.booking_id}`;
        axios.get(URL, JSON.stringify(), { headers: { "Content-Type": "application/json" } }).then(response => {
            //setBookingApprovalList(response.data.data.resultList);
            //setBookingConfirmedAmount(response.data.data.totalBookingAmount);
            //setTotalDiscountAmount(response.data.data.totalDiscountAmount);
        });
    }

    const getSalesBookingLifeCycleStatus = () => {    
        const URL = `${process.env.REACT_APP_API_URL}/api/sales-booking/get-booking-life-cycle-status/${bookingInfo.company_id}/${bookingInfo.booking_id}`;
        axios.get(URL, JSON.stringify(), { headers: { "Content-Type": "application/json" } }).then(response => {
            let bookingLifeCycleStatus = response.data.data;
            setBookingLifeCycleStatus(bookingLifeCycleStatus);
        });
      }

      return (
        <>
            <div  className="container-fluid" id="myvideo" style={{ background: "#f3f6f9"}}>
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
                            <strong>Sales Booking Proposal Approval</strong>
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
                        <div className="d-flex justify-content-between">
                            {/* FROM ROW */}
                            <div className="w-xl-25 mt-5">
                                <strong className="mt-5 dark-gray-color">From</strong><br />
                                <div className="card mb-3 mt-3 border-radius-20">
                                    <div className="row no-gutters">
                                        <div className="col-xl-3">
                                            <SVG style={{ marginTop: "15px" }} className="p-5" src={toAbsoluteUrl("/media/svg/icons/project-svg/Avatar.svg")} width="100px" height="100px" />
                                            {/* distributorLogo */}
                                        </div>
                                        <div className="col-xl-9">
                                            <div className="card-body">
                                            <div style={{ fontWeight: "500" }} className="dark-gray-color"><strong>{bookingInfo.depot_name}</strong></div>
                                                <div className="mt-1"><SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/phone.svg")} 
                                                width="12px" height="12px" />&nbsp;<small className="text-muted">+{bookingInfo.contact_number}</small></div>
                                                <div className="mt-2"><SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/location.svg")}  width="15px" height="15px" />
                                                <small className="text-muted">{bookingInfo.address}
                                                </small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            {/* TO ROW */}
                            <div className="w-xl-25 mt-5">
                                <strong className="mt-5 dark-gray-color">To</strong><br />
                                <div className="card mb-3 mt-3 border-radius-20">
                                    <div className="">
                                        {/* <div className="col-xl-3">
                                            <SVG style={{ marginTop: "15px" }} className="p-5" src={toAbsoluteUrl("/media/svg/icons/project-svg/Lays.svg")} width="100px" height="100px" />
                                        </div> */}
                                        <div className="">
                                            <div className="card-body">
                                                
                                            <div style={{ fontWeight: "500" }} className="dark-gray-color"><strong>{bookingInfo.distributor_name}</strong></div>
                                                <div className="mt-1"><SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/phone.svg")} 
                                                    width="12px" height="12px" />&nbsp;<small className="text-muted">+{bookingInfo.distributor_contact_no}</small></div>
                                                <div className="mt-2"><SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/location.svg")} width="15px" height="15px" />
                                                <small className="text-muted">{bookingInfo.bill_to_address}
                                                </small>
                                                </div>
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
                        <div className="col-xl-9">
                            {/* TITLE ROW */}
                            <div className="d-flex">
                                <div className="w-100">
                                    {/* BOOKING SUMMARY TITLE CARD */}
                                    <Card className="h-100" style={{ borderTopLeftRadius: "30px" }}>
                                        <CardBody>
                                            <div className="row no-gutters">
                                                <div className="col-4">
                                                    <span className="text-muted">Title</span><br />
                                                    <strong>Booking Summary</strong><br />
                                                    <strong>{bookingInfo.booking_no}</strong>
                                                </div>
                                                <div className="col-4">
                                                    <span className="text-muted">Payment Nature</span><br />
                                                    <strong>{bookingInfo.invoice_nature}</strong>
                                                </div>
                                                <div className="col-4">
                                                    <span className="text-muted float-right">Proposed Booking Amount</span><br />
                                                    <strong className="float-right">{bookingInfo.booking_amount !==null ? bookingInfo.booking_amount.toFixed(2) : 0.00}</strong>
                                                </div>
                                            </div>
                                            <div className="row no-gutters mt-5">
                                                <div className="col-4">
                                                    <span className="text-muted"><strong>Products</strong></span>
                                                </div>
                                                <div className="col-4 text-center">
                                                    <span className="text-muted"><strong>Proposed Qty.</strong></span>
                                                </div>
                                                <div className="col-4">
                                                    <span className="text-muted float-right"><strong>Action</strong></span>
                                                </div>
                                            </div>
                                        </CardBody>
                                    </Card>
                                </div>
                                <div className="w-xl-50 w-100">
                                    {/* TICKETS TITLE CARD */}
                                    <Card className="h-100" style={{ borderTopRightRadius: "30px" }}>
                                        <CardBody>
                                            <div className="row no-gutters">
                                                <div className="col-6">
                                                    <span className="text-muted">Title</span><br />
                                                    <strong>Tickets</strong>
                                                </div>
                                                {/* <div className="col-6">
                                                    <span className="text-muted float-right">Amount</span><br />
                                                    <strong className="float-right">530,000</strong>
                                                </div> */}
                                            </div>
                                            <div className="row no-gutters mt-5">
                                                <div className="col-6">
                                                    <span className="text-muted"><strong>Details</strong></span>
                                                </div>
                                                <div className="col-6">
                                                    <span className="text-muted float-right"><strong>Action</strong></span>
                                                </div>
                                            </div>
                                        </CardBody>
                                    </Card>
                                </div>
                            </div>
                            
                            {/* DATA ROW */}
                            {
                                list.map((data) => (
                                   
                                    <div className="d-flex" key={data.booking_item_id}>
                                        <div className="w-100 h-100">
                                        {/* { 
                                        data.stock_quantity === 1553 ? 
                                        data.stock_quantity = 1553 :
                                        data.stock_quantity === 185 ? data.stock_quantity = 20 :data.stock_quantity === 280 ? data.stock_quantity = 90: data.stock_quantity = 0 } */}
                                            {/* BOOKING SUMMARY DATA CARD */}
                                            {
                                                data.atp_quantity >= data.booking_quantity ?
                                                    <BookingApprove 
                                                    setList={setList} 
                                                    list={list} 
                                                    data={data} 
                                                    setBookingApprovalList = {setBookingApprovalList} 
                                                    bookingApprovalList={bookingApprovalList}
                                                    bookingConfirmedAmount={bookingConfirmedAmount}
                                                    setBookingConfirmedAmount={setBookingConfirmedAmount}
                                                    totalDiscountAmount={totalDiscountAmount}
                                                    setTotalDiscountAmount={setTotalDiscountAmount}
                                                    companyId={bookingInfo.company_id}
                                                    /> :
                                                    <TicketsGenerate 
                                                    setList={setList} 
                                                    list={list} 
                                                    data={data}
                                                    setBookingApprovalList = {setBookingApprovalList} 
                                                    bookingApprovalList={bookingApprovalList}
                                                    companyId={bookingInfo.company_id}
                                                    setTicketDetails = {setTicketDetails}                                                
                                                    />
                                            }
                                        </div>
                                        <div className="w-50 h-100">
                                            {/* TICKETS DATA CARD */}
                                            {
                                                data.atp_quantity > data.booking_quantity && data.item_status === "SALES_BOOKED" ?
                                                    <NoNeedTickets /> :
                                                    <NeedTickets 
                                                    data={data}
                                                    setBookingApprovalList = {setBookingApprovalList} 
                                                    bookingApprovalList={bookingApprovalList}
                                                    bookingConfirmedAmount={bookingConfirmedAmount}
                                                    setBookingConfirmedAmount={setBookingConfirmedAmount}
                                                    totalDiscountAmount={totalDiscountAmount}
                                                    setTotalDiscountAmount={setTotalDiscountAmount}
                                                    ticketDetails={ticketDetails}
                                                    />
                                            }
                                        </div>
                                    </div>
                                ))
                            }
                        </div>

                        {/* LEFT SIDE CONTENT */}
                        <div className="col-xl-3">
                            {/* BOOKING APPROVAL TITLE CARD */}
                            <Card style={{ borderTopRightRadius: "30px", borderTopLeftRadius: "30px" }}>
                                <CardBody>
                                    <div className="row no-gutters">
                                        <div className="col-6">
                                            <span className="text-muted">Title</span><br />
                                            <strong>Booking Approval</strong>
                                        </div>
                                        <div className="col-6">
                                            <span className="text-muted float-right">Amount</span><br />
                                            <strong className="float-right">{bookingConfirmedAmount !==null ? bookingConfirmedAmount.toFixed(2) : 0.00}</strong>
                                        </div>
                                    </div>
                                    <div className="row no-gutters mt-5">
                                        <div className="col-6">
                                            <span className="text-muted"><strong>Details</strong></span>
                                        </div>
                                        <div className="col-6">
                                            <span className="text-muted float-right"><strong>Action</strong></span>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>

                            {/* BOOKING APPROVAL DATA  CARD */}
                            <div className="mt-4">
                            {
                                bookingApprovalList.map((obj, index)=>(
                                
                                <Card key={obj.booking_item_id}>
                                <CardBody key={obj.booking_item_id}>
                                    <div className="d-flex">
                                        <div className="ml-n3 mt-3"><span className="rounded light-gray-bg pl-2 pr-2">{index + 1}</span></div>
                                        <div className="w-100 pl-5">
                                            <div>
                                            {obj.item_status === "STOCK_CONFIRMED" ? "":
                                                <button className="btn float-right" style={{ background: "#F9F9F9", color: "#0396FF" }} onClick={()=>handleRemovetoAdd(obj)}>
                                                    <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/red-delete.svg")} />
                                                </button>
                                            }
                                            </div>
                                            <div>
                                                <span className="text-muted">{obj.product_sku}</span><br />
                                                <strong>{obj.p_name}</strong><br />
                                                <span className="text-muted">{obj.category_name}</span><br />
                                                {
                                                    // data.free_quantity === "" ? "" : 
                                                    // <span className="mr-5">
                                                    //     <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/free-gray.svg")} />
                                                    //     <span className="text-muted">&nbsp;Free Qty&nbsp;</span>
                                                    //     <strong className='text-muted'>{obj.free_quantity}</strong>
                                                    // </span>
                                                }
                                                <span className="text-muted">
                                                    <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/price-gray.svg")} />&nbsp;Price&nbsp;
                                                        {obj.discounted_price === "" || obj.discounted_price == 0 ? 
                                                        <strong>{obj.trade_price !==null ? obj.trade_price.toFixed(2) : 0.00} </strong>
                                                        :
                                                        <span>
                                                            <del className="mr-2 text-muted">{obj.trade_price !==null ? obj.trade_price.toFixed(2) : 0.00}</del>
                                                            <strong>{obj.discounted_price !==null ? obj.discounted_price.toFixed(2) : 0.00}</strong>
                                                        </span>
                                                        }
                                                </span>
                                            </div>
                                            <div className="mt-5" style={{ border: "1px solid #F2F2F2", width: "100%" }}></div>

                                            {/* TOTAL QTY ROW */}
                                            <div className="mt-3">
                                                <span>Qty.
                                                    {
                                                        obj.item_status === "TICKET_CONFIRMED"?
                                                        <strong>
                                                        &nbsp;{obj.total_confirm_quantity}&nbsp;
                                                        <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/full-screen-close.svg")} width="10px" height="10px" />
                                                        &nbsp;{obj.trade_price !==null ? obj.trade_price.toFixed(2) : 0.00}&nbsp;
                                                    </strong>:
                                                    <strong>
                                                    &nbsp;{obj.booking_quantity}&nbsp;
                                                    <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/full-screen-close.svg")} width="10px" height="10px" />
                                                    &nbsp;{obj.trade_price !==null ? obj.trade_price.toFixed(2) : 0.00}&nbsp;
                                                </strong>
                                                    }
                                                </span>
                                                <span className="float-right">
                                                    {
                                                      obj.item_status === "TICKET_CONFIRMED"?  
                                                      <strong>
                                                        {obj.confirm_amount !==null ? obj.confirm_amount.toFixed(2) : 0.00}
                                                    </strong>:
                                                    <strong>
                                                    {obj.booking_amount !==null ? obj.booking_amount.toFixed(2) : 0.00}
                                                </strong>
                                                    }
                                                    
                                                </span>
                                            </div>

                                            {/* DISCOUNT ROW */}
                                            <div className="mt-3">
                                                <span>Discount</span>
                                                {
                                                    obj.item_status==="TICKET_CONFIRMED"?
                                                    <span className="float-right dark-success-color">
                                                    <strong>
                                                        -{obj.confirm_discounted_amount !==null ? obj.confirm_discounted_amount.toFixed(2) : 0.00}
                                                    </strong>
                                                </span>:
                                                <span className="float-right dark-success-color">
                                                <strong>
                                                    -{obj.discounted_amount !==null ? obj.discounted_amount.toFixed(2) : 0.00}
                                                </strong>
                                            </span>
                                                }
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
                                        <strong className="float-right">{bookingConfirmedAmount !==null ? bookingConfirmedAmount.toFixed(2) : 0.00}</strong>
                                    </div>

                                    {/* DISCOUNT ROW */}
                                    <div className="mt-3">
                                        <span>Discount</span>
                                        <span className="float-right dark-success-color">
                                            <strong>
                                                -{totalDiscountAmount !==null ? totalDiscountAmount.toFixed(2) : 0.00}
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

                                    <div className="mt-5" style={{ border: "1px solid #4F4F4F", width: "100%" }}></div>

                                    {/* TOTAL ROW */}
                                    <div className="mt-3">
                                        <strong>Total</strong>
                                        <strong className="float-right">{(bookingConfirmedAmount-totalDiscountAmount).toFixed(2)}</strong>
                                    </div>
                                    {hasCreateAccess(permissions, "SALES_BOOKING_CONFIRMATION") ?
                                    <div className="mt-5">
                                        {
                                        bookingLifeCycleStatus.bookingOrderStatus!=="Pending"?"":
                                        <button className="btn dark-danger-color" style={{ background: "#F9F9F9", color: "#0396FF" }}
                                            onClick={()=>handleCardClear()}>
                                            <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/reject.svg")} />
                                            &nbsp;<strong>Cancel</strong>
                                        </button>
                                        }
                                         {bookingInfo.stock_confirmed==="Y"?
                                        <span className="light-gray-bg dark-success-color rounded mr-3 p-3 float-right">
                                            <strong>
                                                <SVG classNAme="mr-1" src={toAbsoluteUrl("/media/svg/icons/project-svg/ok.svg")} />
                                                Confirmed
                                            </strong>
                                        </span>:
                                        <button className="btn text-white mr-3 float-right" style={{ background: "#6FCF97" }}
                                            onClick={()=>handleStockConfirm(bookingApprovalList)}>
                                            <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/white-approved.svg")} />
                                            {/* &nbsp;<strong>Approve Booking</strong> */}
                                            &nbsp;<strong>Stock Confirm</strong>
                                        </button>
                                        }
                                    </div>:""}
                                </CardBody>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}