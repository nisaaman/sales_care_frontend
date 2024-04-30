import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { toAbsoluteUrl } from "../../../../../../../../../../_metronic/_helpers";
import SVG from "react-inlinesvg";
import { Card } from "react-bootstrap";
import { CardBody } from "../../../../../../../../../../_metronic/_partials/controls";
import { allowOnlyNumeric } from '../../../../../../../../Util';
import axios from "axios";
import InventoryBreadCrum from '../../../../../../../bread-crum/InventoryBreadCrum';
import { showError, showSuccess } from '../../../../../../../../../pages/Alert';
import { id } from "date-fns/locale";

export default function ConfirmView() {
    let history = useHistory();
    const location = useLocation();
    const [pickingInfo, setPickingInfo] = useState({})
    const [productList, setProductList] = useState([])

    useEffect(() => {
        if (location.state != undefined) {
            setPickingInfo(location.state.state)
            getProductListByPickingId(location.state.state.picking_id)
            // if (location.state.state.status === "PENDING") {
            //     getProductListByPickingId(location.state.state.picking_id)
            // }
        }
    }, [])

    const getProductListByPickingId = (pickingId) => {

        const URL = `${process.env.REACT_APP_API_URL}/api/picking/get-product-list-picking-id-wise/${pickingId}`;
        axios.get(URL).then(response => {
            if (response.data.data !== null) {
                setProductList(response.data.data);
                //console.log(response.data.data);
            }
        }).catch(err => { });
    }

    const handleBack = () => {
        history.push('/inventory/stock/sales-order/picking-list-view', { state: pickingInfo });
    }

    const handleSave = (status) => {
        let totalGoodQtyValue =0;
        let temp = []
        productList.map(product => {
            let goodQtyValue = document.getElementById("good-qty-id-" + product.picking_details_id).value;
            
            let badQtyValue = document.getElementById("bad-qty-id-" + product.picking_details_id).value;
            let reason = document.getElementById("reason-id-" + product.picking_details_id).value
            if (!validate(product)) {
                return false;
            } else {
                temp.push({
                    "pickingDetailsId": product.picking_details_id,
                    "goodQty": !goodQtyValue ? null : parseInt(goodQtyValue),
                    "badQty": !badQtyValue ? null : parseInt(badQtyValue),
                    "reason": reason
                })                
            }            
        })

        temp.map(tempobj => {
            totalGoodQtyValue = (Number(totalGoodQtyValue) + (tempobj.goodQty !=null ? parseInt(tempobj.goodQty) : 0) );
        })
        
        if (productList.length === temp.length) {

            if(!totalGoodQtyValue || totalGoodQtyValue <=0) {
                showError('Please enter good qty or cancel');
                return false;
             }

            save(temp, status)
        }        
    }

    const handleCancelSave = (status) => {
        let reason = document.getElementById("reason-id").value;
        if (!validateCancel()) {
            return false;
        }

        let obj = {}
        obj.id = pickingInfo.picking_id;
        obj.reason = reason;
        obj.status = status;
        const URL = `${process.env.REACT_APP_API_URL}/api/picking/cancel-picking`;
        axios.post(URL, JSON.stringify(obj), { headers: { "Content-Type": "application/json" } }).then(response => {
            if (response.data.success === true) {
                setProductList([])
                showSuccess(response.data.message)
            }
            else {
                showError(response.data.message); 
            }
        }).catch(err => {
            showError(err);
        });
    }

    const validateCancel = () => {
        let reason = document.getElementById("reason-id");
        if (!reason.value) {
            showError("Please type  reason.");
            document.getElementById("reason-id").focus();
            return false;
        }
        return true;
    }

    const validate = (product) => {
        let goodQtyValue = document.getElementById("good-qty-id-" + product.picking_details_id).value
        let goodQtyLongValue = parseInt(goodQtyValue)

        let badQtyValue = document.getElementById("bad-qty-id-" + product.picking_details_id).value
        let badQtyLongValue = parseInt(badQtyValue)

        let reason = document.getElementById("reason-id-" + product.picking_details_id);
         
         if (!goodQtyValue && !badQtyValue && !reason.value) {
             showError(`Please enter good qty or bad qty or reason for ${product.product_name} product.`);
             document.getElementById("good-qty-id-" + product.picking_details_id).focus();
             return false;
         }
       
        else {
            if (goodQtyLongValue <= 0) {
                showError(`Good qty can not be zero for ${product.product_name} product.`);
                document.getElementById("good-qty-id-" + product.picking_details_id).focus();
                return false;
            }
            if (badQtyLongValue <= 0) {
                showError(`Bad qty can not be zero for ${product.product_name} product.`);
                document.getElementById("good-qty-id-" + product.picking_details_id).focus();
                return false;
            }
        }

        let totalQty = Number(goodQtyLongValue) + (badQtyLongValue > 0 ? Number(badQtyLongValue) : 0);
        //  let remainingQuantity = Number(product.order_challan_quantity) > Number(product.picking_quantity) ? 0
        //  : Number(product.picking_quantity) - Number(product.order_challan_quantity);// remaing chalan quantity
         let remainingQuantity = Number(product.remainingQuantity) > Number(product.picking_quantity) ? Number(product.picking_quantity) : Number(product.remainingQuantity);

         if (Number(remainingQuantity) < product.picking_quantity) {
             if (goodQtyLongValue > Number(remainingQuantity)) {
                 showError(`Good qty can not be greater than remaining qty for ${product.product_name} product.`);
                 document.getElementById("good-qty-id-" + product.picking_details_id).focus();
                 return false;
             }
             if (totalQty > Number(remainingQuantity)) {
                 showError(`Total qty can not be greater than remaining qty for ${product.product_name} product.`);
                   document.getElementById("good-qty-id-" + product.picking_details_id).focus();
                 return false;
             }
             if (Number(remainingQuantity) > totalQty) {
                 if (!reason.value) {
                     showError(`Please type reason for ${product.product_name} product.`);
                     document.getElementById("reason-id-" + product.picking_details_id).focus();
                     return false;
                 }
             }
         }

        else {
            if (product.picking_quantity > totalQty) {
                if (!reason.value) {
                    showError(`Please type reason for ${product.product_name} product.`);
                    document.getElementById("reason-id-" + product.picking_details_id).focus();
                    return false;
                }
            }
            if (product.picking_quantity < totalQty) {
                showError(`Good and bad qty can not be greater than picking qty for ${product.product_name} product.`);
                document.getElementById("good-qty-id-" + product.picking_details_id).focus();
                return false;
            }

            if (product.picking_quantity > goodQtyLongValue) {
                if (!reason.value && !badQtyValue) {
                    showError(`Please type reason or bad qty for ${product.product_name} product.`);
                    document.getElementById("reason-id-" + product.picking_details_id).focus();
                    return false;
                }
            }
            if (product.picking_quantity < goodQtyLongValue) {
                showError(`Good qty can not be greater than picking qty for ${product.product_name} product.`);
                document.getElementById("good-qty-id-" + product.picking_details_id).focus();
                return false;
            }

            if (product.picking_quantity < badQtyLongValue) {
                showError(`Bad qty can not be greater than picking qty for ${product.product_name} product`);
                document.getElementById("bad-qty-id-" + product.picking_details_id).focus();
                return false;
            }
        }

        return true;
    }

    const save = (data, status) => {
        if (data.length <= 0) {
            showError('No Product is selected.');
            return false;
        }
        let obj = {}
        obj.pickingId = pickingInfo.picking_id;
        obj.pickingDetailsSingletDtoList = data;
        obj.status = status;
        const URL = `${process.env.REACT_APP_API_URL}/api/picking/confirm-picking`;
        axios.post(URL, JSON.stringify(obj), { headers: { "Content-Type": "application/json" } }).then(response => {
            if (response.data.success === true) {
                setProductList([])
                showSuccess(response.data.message)
            }
        }).catch(err => {
            showError(err);
        });
    }

    return (
        <>
            <div>
                <InventoryBreadCrum />
            </div>
            <div>
                {/* HEADER ROW */}
                <Card className="mt-5">
                    <CardBody>
                        {/* BACK AND TITLE ROW */}
                        <div className="row">
                            <div className="col-3">
                                <span>
                                    <button className='btn' onClick={handleBack}>
                                        <strong>
                                            <i className="bi bi-arrow-left-short" style={{ fontSize: "30px" }}></i>
                                        </strong>
                                    </button>
                                </span>
                            </div>
                            <div className="col-6 text-center">
                                <strong>Confirm Picking List</strong>
                            </div>
                            <div className="col-3 text-right">
                                <span className="text-muted">Picking No</span><br />
                                <strong>{pickingInfo.picking_no}</strong>
                            </div>
                        </div>

                        <div className="mt-5 mb-5">
                            {/* MAIN CONTENT BODY ROW */}
                            <div className="row">
                                {/* MIDDLE SIDE CONTENT */}
                                <div className="col-xl-8">
                                    {/* TITLE ROW */}
                                    <Card style={{ borderTopLeftRadius: "30px", borderTopRightRadius: "30px" }}>
                                        <CardBody>
                                            <div>
                                                <span className="text-muted">Title</span><br />
                                                <strong>Product List</strong>
                                            </div>
                                            <div className="mt-5">
                                                <span className="text-muted"><strong>PRODUCTS INFO</strong></span>
                                            </div>
                                        </CardBody>
                                    </Card>
                                    <div className="scroll-product-search">
                                        {
                                            productList.map((product, index) => (
                                                <Card className="mt-5">
                                                    <CardBody>
                                                        <div>
                                                            <span className="float-right dark-success-color mt-n2">
                                                                {/* <strong>{product.order_challan_quantity > product.picking_quantity ? 0 : product.picking_quantity - product.order_challan_quantity}</strong> */}
                                                                {/* <span className="text-muted">{product.order_no}</span><br /> */}
                                                                
                                                                {product.status === "PENDING" ? 
                                                                <div>
                                                                <span>Remaining Qty. </span>
                                                                <strong>{Number(product.remainingQuantity) > Number(product.picking_quantity) 
                                                                ? Number(product.picking_quantity) : Number(product.remainingQuantity)}
                                                                </strong>
                                                                </div>
                                                                :
                                                                ""
                                                                }
                                                            </span>
                                                        </div>

                                                        <div>
                                                            {/* PRODUCT INFO ROW */}
                                                            <span className="text-muted">{product.product_sku}</span><br />
                                                            <strong>{product.product_name}</strong><br />
                                                            <span className="text-muted">{product.product_category_name}</span><br />
                                                            <span className="text-muted">{product.order_no}</span>
                                                        </div>

                                                        {/* PICKING QTY ADD ROW */}
                                                        <div className="mt-5 row">
                                                            <div className="col-xl-4">
                                                                <label className='level-title'>Picking Qty.</label><br />
                                                                <span><input readOnly type="text" id={"picking-qty-id-" + product.picking_details_id} className="text-center border p-2 w-75 rounded" value={product.picking_quantity} /></span>
                                                            </div>
                                                            <div className="col-xl-4">
                                                                <label className='level-title'>Good Qty.</label><br />
                                                                <span><input placeholder="Write here..." id={"good-qty-id-" + product.picking_details_id} type="text"
                                                                    className="text-center border p-2 w-75 rounded" onKeyPress={(e) => allowOnlyNumeric(e)}
                                                                    value={location.state.state.status === "PENDING" && product.good_qty <= 0 ? product.selectedQty : product.good_qty} /></span>
                                                                {/* product.selectedQty */}
                                                            </div>
                                                            <div className="col-xl-3">
                                                                <label className='level-title'>Bad Qty.</label><br />
                                                                <span><input placeholder="Write here..." id={"bad-qty-id-" + product.picking_details_id}
                                                                    type="text" className="text-center border p-2 w-75 rounded"
                                                                    onKeyPress={(e) => allowOnlyNumeric(e)} value={location.state.state.status === "PENDING" && product.bad_qty <= 0 ? product.selectedQty : product.bad_qty} /></span>
                                                            </div>
                                                        </div>
                                                        <div className="mt-5">
                                                            <label className="level-title">Reason for bad Qty</label>
                                                            <textarea id={"reason-id-" + product.picking_details_id} type="text" className="form-control" rows="2"
                                                                placeholder="Write here..." value={product.reason} />
                                                        </div>
                                                    </CardBody>
                                                </Card>
                                            ))
                                        }
                                    </div>
                                </div>

                                {/* LEFT SIDE CONTENT */}
                                <div className="col-xl-4">
                                    {/* NEW PICKING LIST TITLE CARD */}
                                    <Card style={{ borderTopRightRadius: "30px", borderTopLeftRadius: "30px" }}>
                                        <CardBody>
                                            <div>
                                                <span className="text-muted">Title</span><br />
                                                <strong>Confirm Picking List</strong>
                                            </div>
                                            <div className="mt-5">
                                                <span className="text-muted"><strong>ACTION</strong></span>
                                            </div>

                                        </CardBody>
                                    </Card>

                                    {/* PICKING LIST CREATE CART ROW */}
                                    {/* REASON FOR CANCEL   "reason-id-" + product.picking_details_id*/}

                                    <div className="mt-5">
                                        <label className="level-title">Reason for Cancel</label>
                                        <textarea id="reason-id" type="text" className="form-control" rows="2" placeholder="Write here..." />
                                    </div>
                                    {/* CONFIRM */}
                                    {pickingInfo.status === "CONFIRMED" ?
                                        <div className="font-12">
                                            <button className="btn w-100 text-white mt-5 float-right" style={{ background: "red" }}
                                                onClick={() => handleCancelSave("CANCELLED")} id="reject-btn"
                                            >
                                                <SVG className="mr-2" src={toAbsoluteUrl("/media/svg/icons/project-svg/more.svg")} width="13px" height="13px" />
                                                <strong>Cancel</strong>
                                            </button>
                                        </div>

                                        : pickingInfo.status === "CANCELLED" ? "" :
                                            <>
                                                <div className="font-12">
                                                    <button className="btn w-100 text-white mt-5 float-right" style={{ background: "#6FCF97" }}
                                                        onClick={() => handleSave("CONFIRMED")} id="confirm-btn"
                                                    >
                                                        <SVG className="mr-2" src={toAbsoluteUrl("/media/svg/icons/project-svg/more.svg")} width="13px" height="13px" />
                                                        <strong>Confirm</strong>
                                                    </button>
                                                </div>
                                                <div className="font-12">
                                                    <button className="btn w-100 text-white mt-5 float-right" style={{ background: "red" }}
                                                        onClick={() => handleCancelSave("CANCELLED")} id="reject-btn"
                                                    >
                                                        <SVG className="mr-2" src={toAbsoluteUrl("/media/svg/icons/project-svg/more.svg")} width="13px" height="13px" />
                                                        <strong>Cancel</strong>
                                                    </button>
                                                </div>

                                            </>
                                    }
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </Card>

            </div>
        </>
    );
}