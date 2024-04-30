import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { CardBody } from "../../../../../../../../../_metronic/_partials/controls";
import { toAbsoluteUrl } from "../../../../../../../../../_metronic/_helpers";
import SVG from "react-inlinesvg";
import { allowOnlyNumeric } from "../../../../../../../Util";
import { showError } from "../../../../../../../../pages/Alert";

export default function BookingApprove({ setSalesBookingDetails, salesBookingDetails, data,
    salesOrderCart, setSalesOrderCart, isUpdateData }) {
    const [preOrderQty, setPreOrderQty] = useState(data.orderQty)
    const [orderQuantity, setOrderQuantity] = useState(data.remainingBookingQuantity);
    const [maxOrderQuantity, setMaxOrderQuantity] = useState(data.remainingBookingQuantity);
    const [bookingQuantity, setBookingQuantity] = useState(data.bookingQuantity);

    const handleRejectChange = (id) => {
        const temp = [...salesBookingDetails]
        const index = temp.findIndex(obj => obj.id == id);
        temp[index].preStatus = temp[index].status;
        temp[index].status = "REJECTED";
        setSalesBookingDetails(temp)
    }
    const handleUndoChange = (id) => {
        const temp = [...salesBookingDetails]
        const index = temp.findIndex(obj => obj.id == id);
        temp[index].status = temp[index].preStatus;
        setSalesBookingDetails(temp)
    }
    const handleAddedChange = (data) => {

        if (!isUpdateData && (orderQuantity == 0 || orderQuantity > maxOrderQuantity)) {
            return false;
        } else if (isUpdateData && (orderQuantity == 0 || orderQuantity > bookingQuantity)) {
            return false;
        }
        data.added = "ADDED"
        const temp = [...salesOrderCart]
        temp.push({
            "salesBookingDetailsId": data.bookingDetailsId,
            "salesOrderDetailsId": data.salesOrderDetailsId,
            "productId": data.productId,
            "productTradePriceId": data.productTradePriceId,
            "tradeDiscountId": data.tradeDiscountId,
            "bookingQuantity": data.bookingQuantity,
            "productSku": data.productSku,
            "productName": data.productName,
            "category": data.productCategory,
            "remainingBookingQuantity": data.remainingBookingQuantity,
            "orderQty": data.remainingBookingQuantity,
            "orderQuantity": orderQuantity,
            "orderConvertedQuantity": data.orderConvertedQuantity,
            "tradePrice": data.tradePrice,
            "tradeDiscount": data.tradeDiscount,
            "currentPrice": data.currentPrice,
            "freeQty": data.freeQuantity,
            "discountedPrice":data.discountedPrice

        })
        setSalesOrderCart(temp)
        // if(data.preQty === 0){
        //     const preQtyVal = data.orderQty
        //     const tempList = [...salesBookingDetails]
        //     const index = tempList.findIndex(obj => obj.id === data.id);
        //     tempList[index].preQty = preQtyVal - data.orderQty;
        //     setSalesBookingDetails(tempList)
        //     const temp = [...salesOrderCart]
        //     temp.push({
        //         "id":data.id,
        //         "orderNo":"54123697",
        //         "orderAmount":"500,000",
        //         "productSku":"SKU X1253689",
        //         "productName":"Seaconazole 5SC 50 ml * 40",
        //         "category":"Fungicide/",
        //         "remainingBookingQuantity": data.remainingBookingQuantity,
        //         "orderQty": data.orderQty,
        //         "prePrice": data.prePrice,
        //         "currentPrice": data.currentPrice,
        //         "freeQty": data.freeQty,
        //         "vat":"15%",
        //         "status":""
        //     })
        //     setSalesOrderCart(temp)
        // }else{
        //     const temp = [...salesOrderCart]
        //     temp.push({
        //         "id":data.id,
        //         "orderNo":"54123697",
        //         "orderAmount":"500,000",
        //         "productSku":"SKU X1253689",
        //         "productName":"Seaconazole 5SC 50 ml * 40",
        //         "category":"Fungicide/",
        //         "remainingBookingQuantity": data.remainingBookingQuantity,
        //         "orderQty": data.orderQty,
        //         "prePrice": data.prePrice,
        //         "currentPrice": data.currentPrice,
        //         "freeQty": data.freeQty,
        //         "vat":"15%",
        //         "status":""
        //     })
        //     setSalesOrderCart(temp)
        // }

    }

    const changeOrderQuantity = (e) => {

        if (!isUpdateData && (e.target.value == 0 || e.target.value > maxOrderQuantity)) {

            showError("Invalid Order Quantity")

        } else if (isUpdateData && (e.target.value == 0 || e.target.value > bookingQuantity)) {
            showError("Invalid Order Quantity")
        }
        setOrderQuantity(e.target.value);
    }
    const handleMinusChange = (data) => {
        const temp = [...salesBookingDetails]
        const index = temp.findIndex(obj => obj.id === data.id);
        if (temp[index].orderQty > 0) {
            temp[index].orderQty = parseInt(temp[index].orderQty) - 1;
            temp[index].preQty = parseInt(preOrderQty) - parseInt(data.orderQty);
            console.log(temp[index])
            setSalesBookingDetails(temp)
        }
    }

    const handlePlusChange = (data) => {
        if (parseInt(preOrderQty) > parseInt(data.orderQty)) {
            const temp = [...salesBookingDetails]
            const index = temp.findIndex(obj => obj.id == data.id);
            temp[index].preQty = parseInt(preOrderQty) - parseInt(data.orderQty);
            temp[index].orderQty = parseInt(data.orderQty) + 1;
            setSalesBookingDetails(temp)
        }
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
                                    <div className="col-3">
                                        <span className="text-muted">{data.productSku}</span><br />
                                        <strong>{data.productName}</strong><br />
                                        <span className="text-muted">{data.productCategory}</span>
                                    </div>
                                    <div className="col-3 text-center">
                                        <span><input readOnly type="text" className="text-center w-75 h4 border rounded pl-5 pr-5 pt-3 pb-3 mr-5" defaultValue={data.remainingBookingQuantity} /></span>
                                    </div>

                                    <div className="col-3">
                                        {/* <span className="border rounded pl-5 pr-5 pt-5 pb-5 mr-5" onClick={() => handleMinusChange(data)}><strong style={{ fontSize: "1.5rem", fontWeight: "700", cursor: "pointer" }}>-</strong></span> */}
                                        {/* <span className="border rounded pl-5 pr-5 pt-5 pb-5 mr-5"><strong style={{ fontSize: "1.5rem", fontWeight: "700" }} id="counting">{parseInt(data.remainingBookingQuantity)}</strong></span> */}
                                        <span><input id={"qtySelected-" + data.id} type="text" className="text-center w-75 h4 border rounded pl-5 pr-5 pt-3 pb-3 mr-5" onKeyPress={(e) => allowOnlyNumeric(e)} defaultValue={isUpdateData ? data.orderConvertedQuantity : data.remainingBookingQuantity} /></span>
                                        {/* <span className="border rounded pl-5 pr-5 pt-5 pb-5" onClick={() => handlePlusChange(data)}><strong style={{ fontSize: "1.5rem", fontWeight: "700", cursor: "pointer" }}>+</strong></span> */}
                                    </div>
                                    {
                                        // parseInt(data.remainingBookingQuantity) === 0 ?
                                        //     <div className="col-3">
                                        //         <span className="border rounded pl-5 pr-5 pt-5 pb-5 mr-5"><strong style={{ fontSize: "1.5rem", fontWeight: "700" }}>-</strong></span>
                                        //         <span className="border rounded pl-5 pr-5 pt-5 pb-5 mr-5"><strong style={{ fontSize: "1.5rem", fontWeight: "700" }} id="counting">{parseInt(isUpdateData ? data.orderConvertedQuantity : data.remainingBookingQuantity)}</strong></span>
                                        //         <span className="border rounded pl-5 pr-5 pt-5 pb-5"><strong style={{ fontSize: "1.5rem", fontWeight: "700" }}>+</strong></span>
                                        //     </div> :
                                        //     <div className="col-3">
                                        //         {/* <span className="border rounded pl-5 pr-5 pt-5 pb-5 mr-5" onClick={() => handleMinusChange(data)}><strong style={{ fontSize: "1.5rem", fontWeight: "700", cursor: "pointer" }}>-</strong></span> */}
                                        //         {/* <span className="border rounded pl-5 pr-5 pt-5 pb-5 mr-5"><strong style={{ fontSize: "1.5rem", fontWeight: "700" }} id="counting">{parseInt(data.remainingBookingQuantity)}</strong></span> */}
                                        //         <span><input id={"qtySelected-" + data.id} type="text" className="text-center w-75 h4 border rounded pl-5 pr-5 pt-3 pb-3 mr-5" onKeyPress={(e) => allowOnlyNumeric(e)} defaultValue={isUpdateData ? data.orderConvertedQuantity : data.remainingBookingQuantity} /></span>
                                        //         {/* <span className="border rounded pl-5 pr-5 pt-5 pb-5" onClick={() => handlePlusChange(data)}><strong style={{ fontSize: "1.5rem", fontWeight: "700", cursor: "pointer" }}>+</strong></span> */}
                                        //     </div>
                                    }

                                    <div className="col-3">
                                        <span className="light-gray-bg dark-success-color rounded p-3 float-right">
                                            <strong>
                                                <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/approved-done.svg")} />
                                                &nbsp;Added
                                            </strong>
                                        </span>

                                        {
                                            // parseInt(data.preQty) === 0 ?
                                            //     <span className="light-gray-bg dark-success-color rounded p-3 float-right">
                                            //         <strong>
                                            //             <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/approved-done.svg")} />
                                            //             &nbsp;Added
                                            //         </strong>
                                            //     </span> :
                                            //     data.status === "PENDING" ?
                                            //         <div>
                                            //             <button className="btn float-right" style={{ background: "#F9F9F9", color: "#0396FF" }} onClick={() => handleRejectChange(data.id)}>
                                            //                 <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/red-delete.svg")} />
                                            //             </button>
                                            //             <button className="btn text-white mr-3 float-right" style={{ background: "#6FCF97" }} onClick={() => handleAddedChange(data)}>
                                            //                 <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/more.svg")} />
                                            //                 &nbsp;Add to Order List
                                            //             </button>
                                            //         </div> :
                                            //         data.status === "REJECTED" ?
                                            //             <div>
                                            //                 <button className="btn float-right" style={{ background: "#6FCF97" }} onClick={() => handleUndoChange(data.id)}>
                                            //                     <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/undo-white.svg")} />
                                            //                 </button>
                                            //                 <span className="light-gray-bg dark-danger-color rounded mr-3 p-3 float-right">
                                            //                     <strong>
                                            //                         <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/red-delete.svg")} />
                                            //                         &nbsp;Rejected
                                            //                     </strong>
                                            //                 </span>
                                            //             </div> : ""
                                        }
                                    </div>
                                </div>
                                <div className="mt-5" style={{ border: "1px solid #6FCF97", width: "100%" }}></div>
                                <div className="mt-3">
                                    <span className="dark-success-color">
                                        <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/total-green.svg")} />
                                        {/* <strong>&nbsp;Qty. 152,456,147  (UOM 124,556,448,578 Kg)</strong> */}
                                    </span>
                                    <span className="float-right">
                                        {/* {
                                            data.freeQuantity === "" ? "" :
                                                <span className="mr-5">
                                                    <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/free-gray.svg")} />
                                                    <span className="text-muted">&nbsp;Free Qty&nbsp;</span>
                                                    <strong>{data.freeQuantity}</strong>
                                                </span>
                                        } */}
                                        {/* <span>
                                            <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/price-gray.svg")} />
                                            <span className="text-muted">&nbsp;Price&nbsp;</span>
                                            <strong>{data.tradePrice}</strong>
                                        </span> */}
                                        {data.tradeDiscount === "" || data.tradeDiscount == 0 ?
                                            data.tradePrice !== null ? data.tradePrice.toFixed(2) : 0.00
                                            :
                                            <span>
                                                <del className="mr-2 text-muted">{data.tradePrice !== null ? data.tradePrice.toFixed(2) : 0.00}</del>
                                                <strong>{data.discountedPrice !== null ? data.discountedPrice.toFixed(2) : 0.00}</strong>
                                            </span>
                                        }
                                    </span>
                                </div>
                            </CardBody>
                        </Card>
                    </div> :
                    <div>
                        {/* FOR APPROVE ROW */}
                        <Card className="mt-3">
                            <CardBody>
                                <div className="row no-gutters">
                                    <div className="col-3">
                                        <span className="text-muted">{data.productSku}</span><br />
                                        <strong>{data.productName}</strong><br />
                                        <span className="text-muted">{data.productCategory}</span>
                                    </div>
                                    <div className="col-3 text-center">
                                        <span><input readOnly type="text" className="text-center w-75 h4 border rounded pl-5 pr-5 pt-3 pb-3 mr-5" defaultValue={data.remainingBookingQuantity} /></span>
                                        {/* <span className=""><strong style={{ fontSize: "1.5rem", fontWeight: "700" }}>{data.remainingBookingQuantity}</strong></span> */}
                                    </div>
                                    <div className="col-3">
                                        {/* <span className="border rounded pl-5 pr-5 pt-5 pb-5 mr-5" onClick={() => handleMinusChange(data)}><strong style={{ fontSize: "1.5rem", fontWeight: "700", cursor: "pointer" }}>-</strong></span> */}
                                        {/* <span className="border rounded pl-5 pr-5 pt-5 pb-5 mr-5"><strong style={{ fontSize: "1.5rem", fontWeight: "700" }} id="counting">{data.remainingBookingQuantity}</strong></span>
                                         */}
                                        <span><input id={"qtySelected-" + data.id} type="text" className="text-center w-75 h4 border rounded pl-5 pr-5 pt-3 pb-3 mr-5" onChange={(e) => changeOrderQuantity(e)} onKeyPress={(e) => allowOnlyNumeric(e)} defaultValue={isUpdateData ? data.orderConvertedQuantity : data.remainingBookingQuantity} /></span>
                                        {/* <span className="border rounded pl-5 pr-5 pt-5 pb-5" onClick={() => handlePlusChange(data)}><strong style={{ fontSize: "1.5rem", fontWeight: "700", cursor: "pointer" }}>+</strong></span> */}
                                    </div>
                                    <div className="col-3">

                                        <div>
                                            <button className="btn text-white mr-3 float-right" style={{ background: "#6FCF97" }} onClick={() => handleAddedChange(data)}>
                                                <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/more.svg")} />
                                                &nbsp;Add to Order List
                                            </button>
                                        </div>

                                        {/* {
                            data.status === "PENDING" ? 
                            <div>
                                <button className="btn float-right" style={{ background: "#F9F9F9", color: "#0396FF" }} onClick={()=>handleRejectChange(data.id)}>
                                                <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/red-delete.svg")} />
                                            </button>
                                            <button className="btn text-white mr-3 float-right" style={{ background: "#6FCF97" }} onClick={()=>handleAddedChange(data)}>
                                                <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/more.svg")} />
                                                &nbsp;Add to Order List
                                            </button>
                            </div> :
                            data.status === "REJECTED" ? 
                            <div>
                                <button className="btn float-right" style={{ background: "#6FCF97"}} onClick={()=>handleUndoChange(data.id)}>
                                                <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/undo-white.svg")} />
                                            </button>
                                            <span className="light-gray-bg dark-danger-color rounded mr-3 p-3 float-right">
                                            <strong>
                                                <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/red-delete.svg")} />
                                                &nbsp;Rejected
                                            </strong>
                                            </span>
                            </div> :"" 
                            } */}
                                    </div>
                                </div>
                                <div className="mt-5" style={{ border: "1px solid #6FCF97", width: "100%" }}></div>
                                <div className="mt-3">
                                    <span className="dark-success-color">
                                        <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/total-green.svg")} />
                                        {/* <strong>&nbsp;Qty. 152,456,147  (UOM 124,556,448,578 Kg)</strong> */}
                                    </span>
                                    <span className="float-right">
                                        {/* {
                                            data.freeQuantity === "" ? "" :
                                                <span className="mr-5">
                                                    <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/free-gray.svg")} />
                                                    <span className="text-muted">&nbsp;Free Qty&nbsp;</span>
                                                    <strong>{data.freeQuantity}</strong>
                                                </span>
                                        } */}
                                        <span className="text-muted mr-2">&nbsp;Price</span>
                                        {data.tradeDiscount === "" || data.tradeDiscount == 0 ?
                                            data.tradePrice !== null ? data.tradePrice.toFixed(2) : 0.00
                                            :
                                            <span>
                                                <del className="mr-2 text-muted">{data.tradePrice !== null ? data.tradePrice.toFixed(2) : 0.00}</del>
                                                <strong>{data.discountedPrice !== null ? data.discountedPrice.toFixed(2) : 0.00}</strong>
                                            </span>
                                        }
                                        {/* <span>
                                            <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/price-gray.svg")} />
                                            <span className="text-muted">&nbsp;Price&nbsp;</span>
                                            <strong>{data.discountedPrice.toFixed(2)}</strong>
                                        </span> */}
                                    </span>
                                </div>
                            </CardBody>
                        </Card>
                    </div>
            }
        </>
    );
}