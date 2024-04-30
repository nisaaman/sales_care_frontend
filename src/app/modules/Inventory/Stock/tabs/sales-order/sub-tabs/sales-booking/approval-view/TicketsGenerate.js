import React, { useState, useEffect } from "react";
import { Card } from "react-bootstrap";
import { CardBody } from "../../../../../../../../../_metronic/_partials/controls";
import { toAbsoluteUrl } from "../../../../../../../../../_metronic/_helpers";
import SVG from "react-inlinesvg";
import { data } from "jquery";
import axios from "axios";
import { showError, showSuccess } from '../../../../../../../../pages/Alert';
import { shallowEqual, useSelector } from 'react-redux';
import { hasCreateAccess } from "../../../../../../../Util";

export default function TicketsGenerate({ setList, list, data, 
    bookingApprovalList, setBookingApprovalList, 
    totalDiscountAmount, setTotalDiscountAmount, addBookingCard, companyId, setTicketDetails }) {
    
    const permissions = useSelector((state) => state.auth.user.permissions, shallowEqual);
   
    const handleTicketsGenerate = (id) => { 
        const temp = [...list]
        const index = temp.findIndex(obj => obj.booking_item_id == id);
        temp[index].item_status= "TICKET_REQUESTED";
        setList(temp);

        let ticketQuantity = 0;
        if (data.short_quantity > data.booking_quantity) {
            ticketQuantity = data.booking_quantity;
        } else {
            ticketQuantity = data.short_quantity;
        }

        let obj ={
            "salesBookingDetailsId":data.booking_item_id,
            "ticketStatus":"REQUESTED",
            "quantity":ticketQuantity,
            "itemStatus": "TICKET_REQUESTED",
            "companyId":companyId
        }
        requestTicket(obj);
    }
    
    const handleRejectChange = (id) => { 
        const temp = [...list]
        const index = temp.findIndex(obj => obj.booking_item_id == id);
        temp[index].pre_status = temp[index].item_status;
        temp[index].item_status = "TICKET_REJECTED"
        //temp[index].pre_ticket_status = temp[index].item_status;
        //temp[index].item_status= "TICKET_REJECTED";
        setList(temp)
    }

    const handleUndoChange = (id) => { 
        const temp = [...list]
        const index = temp.findIndex(obj => obj.booking_item_id == id);
        temp[index].item_status = temp[index].pre_status;
        //temp[index].ticket_status=temp[index].pre_ticket_status
        setList(temp)
    }

    const requestTicket = (inputs) => {
        const URL = `${process.env.REACT_APP_API_URL}/api/material-receive-plan`;
        axios.post(URL, JSON.stringify(inputs), { headers: { "Content-Type": "application/json" } }).then(response => {
        
        if (response.data.success === true) {    
            setTicketDetails(response.data.data);        
            showSuccess("Ticket created successfully.");  
        }
        }).catch(err => {
            showError(err);
        });
    }

    // const getTicketsData = () => {   
    //     const URL = `${process.env.REACT_APP_API_URL}/api/material-receive-plan/get-ticket/${data.booking_item_id}`;
    //     axios.get(URL, JSON.stringify(), { headers: { "Content-Type": "application/json" } }).then(response => {
    //         let ticketDetails = response.data.data.ticketDetails;
    //         if (ticketDetails) {
    //             setTicketDetails(ticketDetails);
    //         }
    //     });
    // }

    return (
        <>
            {/* FOR TICKETS ROW */}
            <Card className="mt-3">
                <CardBody>
                    <div className="row no-gutters">
                        <div className="col-4">
                            <span className="text-muted">{data.product_sku}</span><br />
                            <strong>{data.p_name} </strong><br />
                            <span className="text-muted">{data.category_name}</span>
                        </div>
                        <div className="col-4 text-center">
                            <span className="border rounded pl-5 pr-5 pt-5 pb-5">
                                <strong style={{ fontSize: "1.5rem", fontWeight: "700" }}>{data.booking_quantity}</strong>
                            </span>
                        </div>
                        <div className="col-4">
                            {
                                data.item_status === "SALES_BOOKED" ? 
                                <div>
                                    {
                                        // data.added === "ADDED"? "":
                                        // <button className="btn float-right" style={{ background: "#F9F9F9", color: "#0396FF" }} onClick={()=>handleRejectChange(data.booking_item_id)}>
                                        // <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/red-delete.svg")} />
                                        // </button>
                                    }
                                    {/* ticket generate */}
                                    
                                    {
                                    
                                    data.item_status === "TICKET_CONFIRMED" || data.item_status === "TICKET_REQUESTED" ? "" :
                                    hasCreateAccess(permissions, "SALES_BOOKING_CONFIRMATION") ?
                                     <button className="btn float-right mr-5" style={{ background: "#F9F9F9", color: "#0396FF" }} onClick={()=>handleTicketsGenerate(data.booking_item_id)}>
                                     <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/blue-ticket.svg")} />
                                     &nbsp;Tickets
                                    </button> : 
                                    <button className="btn float-right mr-5" style={{ background: "#F9F9F9", color: "#0396FF" }}>
                                    <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/blue-ticket.svg")} />
                                    &nbsp;Tickets
                                   </button>
                                    }
                                       
                                </div> :
                                data.item_status === "TICKET_REJECTED"?
                                <div>
                                {/* <button className="btn float-right" style={{ background: "#6FCF97" }} onClick={()=>handleUndoChange(data.booking_item_id)}>
                                    <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/undo-white.svg")} />
                                </button> */}
                                <span className="light-gray-bg dark-danger-color rounded mr-3 p-3 float-right">
                                    <strong>
                                        <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/red-delete.svg")} />
                                        &nbsp;Rejected
                                    </strong>
                                </span>
                            </div>:""
                            }    
                        </div>
                    </div>
                    <div className="mt-5" style={{ border: "1px solid rgba(235, 87, 87, 0.45)", width: "100%" }}></div>
                    <div className="mt-3">
                        <span className="dark-success-color">
                            <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/total-gray.svg")} />&nbsp;
                            <span className="text-muted mr-3">Stock </span>
                            <span className="text-danger mr-3"><strong>Qty {data.stock_quantity}</strong></span>
                            {/* (UOM {data.stock_quantity_uom !==null ? data.stock_quantity_uom.toFixed(2) : 0.00} {data.uom}) */}
                            <span className="text-warning"><strong>{data.item_status === "SALES_BOOKED" ? 'Short Qty' : "" } {data.item_status === "SALES_BOOKED" ? data.short_quantity  : "" }</strong></span>
                        </span>
                        <span className="float-right">
                            <span>
                                {
                                    // data.free_quantity === "" ? "" : 
                                    // <span className="mr-5">
                                    //     <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/free-gray.svg")} />
                                    //     <span className="text-muted">&nbsp;Free Qty&nbsp;</span>
                                    //     <strong>{data.free_quantity}</strong>
                                    // </span>
                                }
                                <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/price-gray.svg")} />
                                <span className="text-muted mr-2">&nbsp;Price</span>
                                    {data.discounted_price === "" || data.discounted_amount == 0 ? 
                                    data.trade_price !==null ? data.trade_price.toFixed(2) : 0.00 
                                    :
                                <span>
                                    <del className="mr-2 text-muted">{data.trade_price !==null ? data.trade_price.toFixed(2) : 0.00}</del>
                                    <strong>{data.discounted_amount !==null ? data.discounted_price.toFixed(2) : 0.00}</strong>
                                </span>
                                }
                                
                            </span>     
                        </span>
                    </div>

                    <div className="mt-3">
                        <span className="dark-warning-color">
                            {data.blocked_quantity === "" || data.blocked_quantity === 0  ? "" : 
                            <strong>&nbsp;Blocked Qty {data.blocked_quantity}</strong>}
                        </span>
                    </div>
                </CardBody>
            </Card>
        </>
    );
}