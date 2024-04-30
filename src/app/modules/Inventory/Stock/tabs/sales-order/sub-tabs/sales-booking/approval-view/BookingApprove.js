import React, { useState } from "react";
import { Card } from "react-bootstrap";
import { CardBody } from "../../../../../../../../../_metronic/_partials/controls";
import { toAbsoluteUrl } from "../../../../../../../../../_metronic/_helpers";
import SVG from "react-inlinesvg";
import { te } from "date-fns/locale";
import axios from "axios";

export default function BookingApprove({setList, list, data, 
    bookingApprovalList, setBookingApprovalList, 
    bookingConfirmedAmount, setBookingConfirmedAmount,
    totalDiscountAmount, setTotalDiscountAmount,  companyId}) {
    const handleRejectChange = (id) => { 
        const temp = [...list]
        const index = temp.findIndex(obj => obj.booking_item_id == id);
        temp[index].pre_status = temp[index].item_status;
        temp[index].item_status= "TICKET_REJECTED";
        setList(temp);
    }
    const handleUndoChange = (id) => { 
        const temp = [...list]
        const index = temp.findIndex(obj => obj.id == id);
        temp[index].item_status = temp[index].pre_status;
        setList(temp);
        
    }
    const handleAddedChange = (data) => {
        data.added = "ADDED"
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
            "added":data.added
        })
        setBookingConfirmedAmount(bookingConfirmedAmount+data.booking_amount);
        setTotalDiscountAmount(totalDiscountAmount+data.discounted_amount);
        setBookingApprovalList(temp);
    }
    
    return (
        <>
        {
            data.added === "ADDED" ?
            <div>
                {/* WITH APPROVED BTN ROW */}
            <Card className="mt-3">
                <CardBody>
                    <div className="row no-gutters">
                        <div className="col-4">
                        <span className="text-muted">{data.product_sku}</span><br />
                        <strong>{data.p_name} </strong><br />
                        <span className="text-muted">{data.category_name}</span>
                        </div>
                        <div className="col-4 text-center">
                            <span className="border rounded pl-5 pr-5 pt-5 pb-5"><strong style={{ fontSize: "1.5rem", fontWeight: "700" }}>{data.booking_quantity}</strong></span>
                        </div>
                        <div className="col-4">
                        <span className="light-gray-bg dark-success-color rounded p-3 float-right">
                            <strong>
                                <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/approved-done.svg")} />
                                &nbsp;Added
                            </strong>
                        </span>
                        </div>
                    </div>
                    <div className="mt-5" style={{ border: "1px solid #6FCF97", width: "100%" }}></div>
                    <div className="mt-3">
                        <span className="dark-success-color">
                            <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/total-green.svg")} />
                            <strong>&nbsp;Stock Qty. {data.stock_quantity} </strong>
                            {/* (UOM {data.stock_quantity_uom !==null ? data.stock_quantity_uom.toFixed(2) : 0.00} {data.uom}) */}
                        </span>
                        <span className="float-right">
                            {
                                // data.free_quantity === "" ? "" : 
                                // <span className="mr-5">
                                //     <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/free-gray.svg")} />
                                //     <span className="text-muted">&nbsp;Free Qty&nbsp;</span>
                                //     <strong>{data.free_quantity}</strong>
                                // </span>
                            }
                            <span>
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
                </CardBody>
            </Card></div>:
            <div>
                 {/* FOR APPROVE ROW stock available */}
            <Card className="mt-3">
                <CardBody>
                    <div className="row no-gutters">
                        <div className="col-4">
                            <span className="text-muted">{data.product_sku}</span><br />
                            <strong>{data.p_name} </strong><br />
                            <span className="text-muted">{data.category_name}</span>
                        </div>
                        <div className="col-4 text-center">
                            <span className="border rounded pl-5 pr-5 pt-5 pb-5"><strong style={{ fontSize: "1.5rem", fontWeight: "700" }}>{data.booking_quantity}</strong></span>
                        </div>
                        <div className="col-4">

                          {
                          data.item_status === "SALES_BOOKED" ? 
                          <div>
                                        {/* <button className="btn float-right" style={{ background: "#6FCF97"}} onClick={()=>handleUndoChange(data.booking_item_id)}>
                                            <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/undo-white.svg")} />
                                        </button> */}
                                        <button className="btn text-white mr-3 float-right" style={{ background: "#6FCF97" }} onClick={()=>handleAddedChange(data)}>
                                            <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/white-approved.svg")} />
                                            &nbsp;Add
                                        </button>
                          </div> :
                          data.item_status === "TICKET_REJECTED" ? 
                          <div>
                                        {/* <button className="btn float-right" style={{ background: "#F9F9F9", color: "#0396FF" }} onClick={()=>handleRejectChange(data.booking_item_id)}>
                                            <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/red-delete.svg")} />
                                        </button> */}
                                        <span className="light-gray-bg dark-danger-color rounded mr-3 p-3 float-right">
                                        <strong>
                                            <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/red-delete.svg")} />
                                            &nbsp;Rejected
                                        </strong>
                                        </span>
                          </div> :"" 
                          }
                        </div>
                    </div>
                    <div className="mt-5" style={{ border: "1px solid #6FCF97", width: "100%" }}></div>
                    <div className="mt-3">
                        <span className="dark-success-color">
                            <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/total-green.svg")} />
                            <strong>&nbsp;Stock Qty. {data.stock_quantity}</strong>
                            {/* (UOM {data.stock_quantity_uom !==null ? data.stock_quantity_uom.toFixed(2) : 0.00} {data.uom}) */}
                        </span>
                        <span className="float-right">
                        {
                                // data.free_quantity === "" ? "" : 
                                // <span className="mr-5">
                                //     <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/free-gray.svg")} />
                                //     <span className="text-muted">&nbsp;Free Qty&nbsp;</span>
                                //     <strong>{data.free_quantity}</strong>
                                // </span>
                            }
                            <span>
                                <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/price-gray.svg")} />
                                <span className="text-muted mr-2">&nbsp;Price</span>
                                    {data.discounted_price === "" || data.discounted_price == 0 ? 
                                    data.trade_price !==null ? data.trade_price.toFixed(2) : 0.00 
                                    :
                                <span>
                                    <del className="mr-2 text-muted">{data.trade_price !==null ? data.trade_price.toFixed(2) : 0.00}</del>
                                    <strong>{data.discounted_price !==null ? data.discounted_price.toFixed(2) : 0.00}</strong>
                                </span>
                                }
                            </span>                            
                        </span>
                    </div>
                    <div className="mt-3">
                        <span className="dark-warning-color">
                            {data.blocked_quantity === "" || data.blocked_quantity === 0  ? "" : 
                            <strong>&nbsp;Blocked Qty. {data.blocked_quantity}</strong>}
                        </span>
                    </div>
                </CardBody>
            </Card> 
            </div>
        }
        </>
    );
}