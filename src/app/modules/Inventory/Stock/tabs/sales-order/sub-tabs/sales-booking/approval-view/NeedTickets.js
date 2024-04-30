import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card } from "react-bootstrap";
import { CardBody } from "../../../../../../../../../_metronic/_partials/controls";
import { toAbsoluteUrl } from "../../../../../../../../../_metronic/_helpers";
import SVG from "react-inlinesvg";
import { format, parseISO } from 'date-fns';

export default function NeedTickets({ bookingApprovalList, 
    setBookingApprovalList, data, bookingConfirmedAmount, setBookingConfirmedAmount,
    totalDiscountAmount, setTotalDiscountAmount,  ticketDetails}) {

    const [confirmTicketDetails, setTicketDetails] = useState([]);  
    
     useEffect(() => {
         getTicketsData(); 
     }, [data.booking_item_id]);

    const handleAddedChange = (data) => {
        console.log("data", data);
        data.added="ADDED"
        //data.pre_ticket_status = data.item_status;
        const temp = [...bookingApprovalList]
        temp.push({
            "booking_item_id":data.booking_item_id,
            "product_sku":data.product_sku,
            "p_name": data.p_name,
            "category_name": data.category_name,
            "stock_quantity": data.stock_quantity,
            "booking_quantity": data.booking_quantity,
            "discounted_price": data.discounted_price,
            "discounted_amount": data.discounted_amount,
            "trade_price": data.trade_price,
            "free_quantity": data.free_quantity,
            "booking_amount": data.booking_amount,
            "pre_status": data.pre_status,
            "item_status": data.item_status,
            "booking_id":data.booking_id,            
            "confirm_quantity": data.confirm_quantity,
            "confirm_amount": data.confirm_amount,
            "confirm_discounted_amount": data.confirm_discounted_amount,
            "total_confirm_quantity": data.total_confirm_quantity,
            "added":data.added
        })
        setBookingApprovalList(temp);
        setBookingConfirmedAmount(bookingConfirmedAmount+data.confirm_amount);
        setTotalDiscountAmount(totalDiscountAmount+data.confirm_discounted_amount);
    }

     const getTicketsData = () => {   
         const URL = `${process.env.REACT_APP_API_URL}/api/material-receive-plan/get-ticket/${data.booking_item_id}`;
         axios.get(URL, JSON.stringify(), { headers: { "Content-Type": "application/json" } }).then(response => {
             let confirmTicketDetails = response.data.dataticketDetails!==null ? response.data.data.ticketDetails : null;
             setTicketDetails(confirmTicketDetails);
             console.log("confirmTicketDetails", confirmTicketDetails);
         });
       }

    return (
        <>
            {
                data.item_status === "" ?
                    <div>
                        {/* FOR TICKETS ROW */}
                        <Card className="mt-3 h-100 pt-5">
                            <CardBody>
                                <div>
                                    <span>REQUESTED QTY.&nbsp;</span>
                                    <strong>{Number(data.ticket_quantity)}</strong><br />
                                    {
                                        data.confirm_quantity == 0 ?"":
                                    <span>
                                    <span>CONFIRM QTY.&nbsp;</span>
                                    <strong>{Number(data.confirm_quantity)}</strong><br />
                                    </span>
                                    }
                                    
                                    <small className="text-muted"> {data.booking_amount !==null ? (data.booking_amount - data.discounted_amount).toFixed(2) : 0.00} {data.uom}</small>
                                </div>
                                <div className="mt-5" style={{ border: "1px solid #F2C94C", width: "100%" }}></div>
                                <div className="mt-3">
                                    <div>
                                        <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/waiting-tickets.svg")} />&nbsp;
                                        <small className="dark-warning-color">Need To Apply For Tickets.</small>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </div> :
                    data.item_status === "TICKET_REQUESTED" ?
                        <div>
                            {/* FOR TICKETS ROW */}
                            <Card className="mt-3 h-100 pt-5">
                                <CardBody>
                                    <div>
                                        <span>QTY.&nbsp;</span>
                                        <strong>
                                            {ticketDetails.length>0 && ticketDetails.quantity !== null ? ticketDetails.quantity :  
                                            (Number(data.short_quantity) >= Number(data.booking_quantity) 
                                            ? Number(data.booking_quantity) : Number(data.short_quantity))} 
                                        </strong><br />
                                        {/* <small className="text-muted">
                                            {data.booking_amount !==null ? (data.booking_amount - data.discounted_amount).toFixed(2) : 0.00}
                                        </small>  */}
                                    </div>
                                    <div className="mt-5" style={{ border: "1px solid #F2C94C", width: "100%" }}></div>
                                    <div className="mt-3">
                                        <div>
                                            <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/waiting-tickets.svg")} />&nbsp;
                                            <small className="dark-warning-color">Waiting for response&nbsp; 
                                            {/* <span className="bg-warning text-white p-1 rounded">{ticketDetails.ticket_date}</span> */}
                                            </small>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </div> :
                        data.item_status === "TICKET_CONFIRMED"?
                            <div>
                                {/* FOR TICKETS ROW */}
                                <Card className="mt-3 h-100 pt-5">
                                    <CardBody>
                                        <div>
                                            {
                                                data.added === "ADDED"?
                                                <span className="light-gray-bg dark-success-color rounded p-3 float-right">
                                                <strong>
                                                    <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/approved-done.svg")} />
                                                    &nbsp;Added
                                                </strong>
                                            </span>:
                                            <button className="btn text-white mr-3 float-right" style={{ background: "#6FCF97" }} onClick={()=>handleAddedChange(data)}>
                                            <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/white-approved.svg")} />
                                            &nbsp;Add
                                            </button>
                                                
                                            }
                                            
                                            <span>REQUESTED QTY.&nbsp;</span>
                                            <strong>{Number(data.ticket_quantity)}</strong><br />
                                            {
                                        data.confirm_quantity == 0 ?"":
                                    <span>
                                    <span>CONFIRM QTY.&nbsp;</span>
                                    <strong>{Number(data.confirm_quantity)}</strong><br />
                                    </span>
                                    }
                                        {/* <small className="text-muted">
                                            {data.booking_amount !==null ? (data.booking_amount - data.discounted_amount).toFixed(2) : 0.00} 
                                        </small> */}
                                        </div>
                                        <div className="mt-5" style={{ border: "1px solid #6FCF97", width: "100%" }}></div>
                                        <div className="mt-3">
                                            <div>
                                                <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/ok.svg")} />&nbsp;
                                                <small className="dark-success-color"><strong>Ticket Accepted</strong></small>&nbsp;
                                                {confirmTicketDetails!==null && confirmTicketDetails!==undefined || confirmTicketDetails!==""? 
                                                <small className="dark-success-color"><strong>{confirmTicketDetails.ticket_days_left} Days({confirmTicketDetails.commitment_date})</strong></small>
                                                : ""} 
                                                {/*  */}
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                            </div> :
                            data.item_status === "TICKET_REJECTED" ?
                                <div>
                                    {/* FOR TICKETS ROW */}
                                    <Card className="mt-3 h-100 pt-5">
                                        <CardBody>
                                            <div>
                                                <span>REQUESTED QTY.&nbsp;</span>
                                                <strong>{Number(data.ticket_quantity)}</strong><br />
                                                {
                                        data.confirm_quantity == 0 ?"":
                                    <span>
                                    <span>CONFIRM QTY.&nbsp;</span>
                                    <strong>{Number(data.confirm_quantity)}</strong><br />
                                    </span>
                                    }
                                            {/* <small className="text-muted">
                                                {data.booking_amount !==null ? (data.booking_amount - data.discounted_amount).toFixed(2) : 0.00} {data.uom}
                                            </small> */}
                                            </div>
                                            <div className="mt-5" style={{ border: "1px solid rgba(235, 87, 87, 0.45)", width: "100%" }}></div>
                                            <div className="mt-3">
                                                <div>
                                                <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/reject.svg")} />&nbsp;
                                                <small className="dark-danger-color"><strong>Ticket Rejected</strong></small>&nbsp;
                                                <small className="dark-danger-color"><strong>({confirmTicketDetails.ticket_status_date})</strong></small>
                                                </div>
                                            </div>
                                        </CardBody>
                                    </Card>
                                </div> : ""
            }

        </>
    );
}