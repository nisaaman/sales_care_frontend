import React from "react";
import { toAbsoluteUrl } from "../../../../../../../../../_metronic/_helpers";
import SVG from "react-inlinesvg";
import { Card } from "react-bootstrap";
import { CardBody } from "../../../../../../../../../_metronic/_partials/controls";
import CircularProgress from '@material-ui/core/CircularProgress';
import axios from "axios";
import { format, parseISO } from 'date-fns';

export default function OrderList({orderCount, orderList, 
    setOrderNo, productList, setProductList, depot, pickingId}) {
    const handleSelectOrderList = (data, number) => {
        let id = "id-" + number;
        const getId = document.getElementById(id);
        const getElements = document.getElementsByClassName('order-list-div');

        for (var i = 0; i < getElements.length; i++) {
            getElements[i].classList.remove('select-order-list');
        }
        // FOR RADIO BTN
        let radioId = "radio-id-" + number;
        const getRadioId = document.getElementById(radioId);
        var cbs = document.getElementsByClassName("all-radio");
        for (var i = 0; i < cbs.length; i++) {
            cbs[i].checked = false;
        }

        if (getId) {
            getId.classList.add('select-order-list');
            getRadioId.checked = true;
            setProductList(productList);
            setOrderNo(data.order_no);
             if(pickingId === ""){
                getProductListWithoutPickingId(data.id, depot.id);
             }else{
                getProductListWithPickingId(data, depot.id);
            }
        }
    }
    
    const getProductListWithoutPickingId = (order_id, depot_id) => {
        const URL = `${process.env.REACT_APP_API_URL}/api/delivery-challan/order-product-list/${order_id}/${depot_id}`
        axios.get(URL, JSON.stringify(), { headers: { "Content-Type": "application/json" } }).then(response => {
            setProductList(response.data.data);
        }).catch(err => {
            console.log(err);
        });
    }
    const getProductListWithPickingId = (data, depot_id) => {
        let queryParams = '?pickingId=' + data.picking_id;
        queryParams += '&orderId=' + data.id;
        queryParams += '&depotId=' + depot_id;
        const URL = `${process.env.REACT_APP_API_URL}/api/delivery-challan/picking-order-product-list`+ queryParams
        axios.get(URL, JSON.stringify(), { headers: { "Content-Type": "application/json" } }).then(response => {
            setProductList(response.data.data);
        }).catch(err => {
            console.log(err);
        });
    }
    return (
        <>
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
                                    <CircularProgress className="mt-2" variant="static" value={100}/>
                            </div>
                        </div>
                        <div>
                            <span className="text-muted"><strong>ORDER LIST</strong></span>
                        </div>
                    </CardBody>
                </Card>
            </div>

            {/* ORDER LIST VIEW ROW */}
          {
              pickingId === null ?
              
                orderList.map((order,index)=>(
                    order.deliverable_quantity > 0 ?
                    <div className="mt-5 order-list-div" key={order.id} 
                        style={{ cursor: "pointer" }} onClick={() => handleSelectOrderList(order, index)} 
                        id={"id-" + index}>
                    <Card className="p-3" >
                    <CardBody>
                        <div className="position-absolute" style={{left:"17px"}}>
                            <span>
                                <input type="radio" id={"radio-id-" + index} className="all-radio" value= {order.order_no}/>
                            </span>
                        </div>
                        <div>
                            {
                                order.orderStatus === "NOT_DELIVERY" ? 
                                <span className="float-right mt-1"><SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/delivery.svg")} /></span> :
                                <span className="float-right mt-1"><SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/green-car.svg")} /></span>
                            }
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
            :''
                ))
            :
            orderList.map((order,index)=>(
                <div className="mt-5 order-list-div" key={order.id} 
                    style={{ cursor: "pointer" }} onClick={() => handleSelectOrderList(order, index)} 
                    id={"id-" + index}>
                <Card className="p-3" >
                <CardBody>
                    <div className="position-absolute" style={{left:"17px"}}>
                        <span>
                            <input type="radio" id={"radio-id-" + index} className="all-radio" value= {order.order_no}/>
                        </span>
                    </div>
                    <div>
                        {
                            order.orderStatus === "NOT_DELIVERY" ? 
                            <span className="float-right mt-1"><SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/delivery.svg")} /></span> :
                            <span className="float-right mt-1"><SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/green-car.svg")} /></span>
                        }
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
        </>
    )
}