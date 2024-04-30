import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { CardBody } from "../../../../../../../../../_metronic/_partials/controls";
import { toAbsoluteUrl } from "../../../../../../../../../_metronic/_helpers";
import SVG from "react-inlinesvg";
import { allowOnlyNumeric, handlePasteDisable } from '../../../../../../../Util';
import { showError } from '../../../../../../../../pages/Alert';

export default function ProductsList({ totalCartQty, setTotalCartQty,
    setDeliveryChallanList, deliveryChallanList, productList, setProductList, pickingId }) {
    // const [batchStockData, setBatchStockData] = useState([]);
    const handleResetChange = (pData) => {
        const qtySelectedId = document.getElementById('qtySelected-' + pData.id);
        const batchSelectedId = document.getElementById('batchId-' + pData.id);
        qtySelectedId.value = "";
        batchSelectedId.value = "";
    }
    const handlePlusChange = (pData) => {
        const qtySelectedId = document.getElementById('qtySelected-' + pData.id);
        let qtySelectedValue = parseInt(qtySelectedId.value);
        const temp = [...productList]
        const index = temp.findIndex((obj) => obj.id === pData.id);
        temp[index].selectedQty = qtySelectedValue + 1;
        setProductList(temp);
    }
    const handleMinusChange = (pData) => {
        const qtySelectedId = document.getElementById('qtySelected-' + pData.id);
        let qtySelectedValue = parseInt(qtySelectedId.value);
        if (qtySelectedValue > 0) {
            const temp = [...productList]
            const index = temp.findIndex((obj) => obj.id === pData.id);
            temp[index].selectedQty = qtySelectedValue - 1;
            setProductList(temp);
        }
    }
    const handleAddChange = (pData) => {
        // PRODUCT LIST
        const tempproductList = [...productList]
        const productIndex = tempproductList.findIndex((data) => data.id === pData.id);

        // GET BATCH INFO
        const _batchId = document.getElementById('batchId-' + pData.id);
        const batchIdValue = _batchId.options[_batchId.selectedIndex].value;
        const batchName = _batchId.options[_batchId.selectedIndex].text;

        // GET QTY MODE INFO
        // const _qtyModeId = document.getElementById('qtyMode-' + pData.id);
        // const qtyModeValue = _qtyModeId.options[_qtyModeId.selectedIndex].value;
        // const qtyModeName = _qtyModeId.options[_qtyModeId.selectedIndex].text;

        // SELECTED QTY
        let qtySelectedValue = document.getElementById('qtySelected-' + pData.id).value;

        let stockQuantityValue = document.getElementById('stockQuantityNum-' + pData.id).value;

        const remainOrderQuantity = Number(pData.order_quantity) - (Number(pData.orderProductPickQuantity) +
            Number(pData.order_challan_quantity));

        const remainingPickQtyValue = Number(pData.picking_quantity) - Number(pData.picking_challan_quantity);

        if (batchIdValue === null || batchIdValue === '') {
            showError("Please select product batch");
            return;
        }

        if (Number(qtySelectedValue) === null || Number(qtySelectedValue) <= 0) {
            showError("Please enter quantity");
            return;
        }

        if (Number(qtySelectedValue) > Number(stockQuantityValue)) {
            showError("Quantity can't greater than Stock quantity");
            document.getElementById('qtySelected-' + pData.id).value = "";
            return;
        }

        if (!pickingId) {
            if (qtySelectedValue > remainOrderQuantity) {
                document.getElementById('qtySelected-' + pData.id).value = "";
                showError("Quantity can't greater than remaining quantity");
                return false;
            }
        }

        else {
            if (qtySelectedValue > remainingPickQtyValue) {
                document.getElementById('qtySelected-' + pData.id).value = "";
                showError("Quantity can't greater than remaining quantity");
                return false;
            }
        }

        let qtySelectedValuePicking = 0;
        let qtySelectedValueOrder = 0;

        tempproductList[productIndex].orderQty = tempproductList[productIndex].orderQty - parseInt(qtySelectedValue);
        tempproductList[productIndex].cartQty = tempproductList[productIndex].cartQty + parseInt(qtySelectedValue);
        if (pickingId) {
            qtySelectedValuePicking = qtySelectedValue;
        }
        else {
            qtySelectedValueOrder = qtySelectedValue;
        }
        setProductList(tempproductList)

        // DELIVERY CHALLAN LIST
        const temp = [...deliveryChallanList]
        const index = temp.findIndex((obj) => obj.pId === pData.id);

        if (index > -1) {
           
            if (!pickingId) {
                let itemIndex = temp[index].batch.findIndex((batch) => batch.salesOrderDetailsId === pData.sales_order_details_id);
                let orderIdIndex = temp[index].batch.findIndex((batch) => batch.orderId === pData.order_id);
                let cartProductIndex = 
                temp[index].batch.findIndex((batch) => batch.productId === pData.id 
                && batch.batchId === batchIdValue && batch.pickingId === pData.picking_id);
                    
                if (itemIndex > -1 && cartProductIndex > -1 && orderIdIndex > -1) {
                    showError("This batch already exits")
                    return;
                }

                //if (pData.pick_quantity && pData.pick_quantity > 0) {
                    temp[index].cartQtyOrder = Number(temp[index].cartQtyOrder) + Number(parseInt(qtySelectedValue));
                    console.log("temp[index].cartQtyOrder", temp[index].cartQtyOrder);
                    if (Number(temp[index].cartQtyOrder) > remainOrderQuantity) {
                        document.getElementById('qtySelected-' + pData.id).value = "";
                        showError("Quantity can't greater than remaining quantity");
                        temp[index].cartQtyOrder = Number(temp[index].cartQtyOrder) - Number(parseInt(qtySelectedValue));
                        return;
                    }
                    else {
                        tempproductList[productIndex].cartQtyOrder =
                            tempproductList[productIndex].cartQtyOrder === undefined ? 0
                                : Number(tempproductList[productIndex].cartQtyOrder) + parseInt(qtySelectedValue);
                    }
                //}
            }
            else {
                let itemIndex = temp[index].batch.findIndex((batch) => batch.salesOrderDetailsId === pData.sales_order_details_id);
                let orderIdIndex = temp[index].batch.findIndex((batch) => batch.orderId === pData.order_id);
                let pickingIndex = temp[index].batch.findIndex((batch) => batch.pickingId === pData.picking_id
                    && batch.batchId === batchIdValue);
                if (pickingIndex > -1 && itemIndex > -1 && orderIdIndex > -1) {
                    showError("This batch already exits")
                    return;
                }

                if (!pickingIndex > -1 && itemIndex > -1) {

                    temp[index].cartQtyPicking = Number(temp[index].cartQtyPicking) + Number(parseInt(qtySelectedValue));
                    if (Number(temp[index].cartQtyPicking) > remainingPickQtyValue) {
                        document.getElementById('qtySelected-' + pData.id).value = "";
                        showError("Quantity can't greater than remaining quantity");
                        temp[index].cartQtyPicking = Number(temp[index].cartQtyPicking) - Number(parseInt(qtySelectedValue));
                        return;
                    }
                    else {
                        tempproductList[productIndex].cartQtyPicking =
                            tempproductList[productIndex].cartQtyPicking === undefined ? 0
                                : Number(tempproductList[productIndex].cartQtyPicking) + parseInt(qtySelectedValue);
                    }
                }
            }

            temp[index].cartQty = Number(temp[index].cartQty) + Number(qtySelectedValue);
            totalCartQty = Number(totalCartQty) + Number(qtySelectedValue);

            temp[index].batch.push(
                {
                    "salesOrderDetailsId": pData.sales_order_details_id,
                    "pickingDetailsId": pData.picking_details_id,
                    "productId": pData.id,
                    "batchId": batchIdValue,
                    "batchName": batchName,
                    "quantity": qtySelectedValue,
                    "pickingId": pData.picking_id,
                    "orderId": pData.order_id,
                }
            )

        } else {
            totalCartQty = Number(totalCartQty) + Number(qtySelectedValue);
            temp.push({
                "pId": pData.id,
                "orderNo": pData.order_no,
                "orderAmount": pData.order_amount,
                "productSku": pData.product_sku,
                "productName": pData.product_name,
                "category": pData.category_name,
                "qty": pData.order_quantity,
                "cartQty": qtySelectedValue,
                "cartQtyPicking": qtySelectedValuePicking,
                "cartQtyOrder": qtySelectedValueOrder,
                "productCartQty": tempproductList[productIndex].cartQty,
                "batch": [
                    {
                        "salesOrderDetailsId": pData.sales_order_details_id,
                        "pickingDetailsId": pData.picking_details_id,
                        "productId": pData.id,
                        "batchId": batchIdValue,
                        "batchName": batchName,
                        "quantity": qtySelectedValue,
                        "pickingId": pData.picking_id,
                        "orderId": pData.order_id,
                    }
                ]
            })
        }

        setTotalCartQty(totalCartQty);
        setDeliveryChallanList(temp);
        document.getElementById('qtySelected-' + pData.id).value = "";
    }

    const selectProductBatch = (e, productId) => {

        let id = document.getElementById("product-" + productId + 'batch-' + e.target.value);
        let batchData = [];
        let stockIds = document.querySelectorAll('.stockQuantity-' + productId);
        if (id) {
            batchData = JSON.parse(id.getAttribute("data"));

            for (var n = 0; n < stockIds.length; ++n) {
                stockIds[n].innerHTML = batchData.availableQuantity
                // + '(UOM '
                // + batchData.stock_quantity_in_uom + ' '
                // + batchData.product_uom + ')';
            }
            document.getElementById('qtySelected-' + productId).focus();

            document.getElementById('stockQuantityNum-' + productId).value =
                batchData.availableQuantity !== null ? batchData.availableQuantity : 0;

            document.getElementById('fromStoreId-' + productId).value = batchData.to_store_id;
        }
        else {
            stockIds[0].value = '';
            document.getElementById('stockQuantityNum-' + productId).value = '';
            document.getElementById('fromStoreId-' + productId).value = '';
        }
    }

    const handleQuantity = (product) => {
        let qtySelectedValue = document.getElementById('qtySelected-' + product.id).value;

        if((qtySelectedValue+'').match(/^0/)) {
            document.getElementById('qtySelected-' + product.id).value="";
            return false;
         }

    }

    return (
        <>
            {
                productList.map((product, index) => (
                    <Card className="mt-3" key={product.sales_order_details_id}>
                        <CardBody>

                            {/* PRODUCT INFO ROW */}
                            <div>
                                <span className="float-right">
                                    <span className="text-muted mr-2">Order Qty</span>
                                    <span><strong className="h4">{product.order_quantity}</strong></span><br />
                                    {
                                        pickingId !== "" ?
                                            <span>
                                                <span className="text-muted mr-2">Picking Qty</span>
                                                <span><strong className="h4">{product.picking_quantity}</strong></span>
                                            </span> :
                                            <span>
                                                <span className="text-muted mr-2">At Picking</span>
                                                <span><strong className="h4">{Number(product.orderProductPickQuantity)}</strong></span>
                                                {/* - product.picking_challan_quantity */}
                                            </span>
                                    }
                                </span>
                                <span className="text-muted">{product.product_sku}</span><br />
                                <strong>{product.product_name}</strong><br />
                                <span className="text-muted">{product.category_name}</span>
                            </div>

                            {/* SELECT BATCH AND QTY MODE ROW */}
                            <div className="row mt-5">
                                <div className="col-xl-9">
                                    <div>
                                        <label className='level-title'>Batch</label>
                                        <select
                                            id={"batchId-" + product.id}
                                            name="batchIdArray"
                                            className="form-control"
                                            onChange={(e) => selectProductBatch(e, product.id)}
                                        >
                                            <option value="">Please Select Batch</option>
                                            {product.batchList.map((batch) => (
                                                <option key={batch.batchId} id={"product-" + product.id + "batch-" + batch.batchId}
                                                    value={batch.batchId} data={JSON.stringify(batch)}>
                                                    {batch.batchNo}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                {/* <div className="col-xl-3">
                                    <div>
                                        <label className='level-title'>Qty. Mode</label>
                                        <select
                                            id={"qtyMode-" + product.id}
                                            name="qtyMode"
                                            className="form-control"
                                        >
                                            <option value="1">Inner Pack</option>
                                            <option value="2">Outer Pack</option>
                                        </select>
                                    </div>
                                </div> */}
                            </div>

                            {/* ORDER QTY ADD ROW */}
                            <div className="mt-5 row">
                                <div className="col-xl-3  mt-5">
                                    <span className="text-muted mr-2">Remaining Qty.</span>
                                    {
                                        pickingId === "" ?
                                            <span>
                                                {/* <input id={"remainingQty-" + product.id} type="hidden"
                                                    value={product.order_quantity - product.challan_quantity} /> */}
                                                <strong className="h4">{Number(product.order_quantity) - (Number(product.orderProductPickQuantity)
                                                    + Number(product.order_challan_quantity) + Number(product.picking_challan_quantity))} </strong>
                                            </span> :
                                            <span>
                                                {/* <input id={"remainingQty-" + product.id} type="hidden"
                                                    value={product.picking_quantity - product.challan_quantity} /> */}
                                                <strong className="h4">{Number(product.picking_quantity) - Number(product.picking_challan_quantity)} </strong>
                                            </span>
                                    }
                                </div>
                                <div className="col-xl-5 mt-3 text-center">
                                    {/* <span id={"minusQty-" + product.id} className="pointer border rounded pl-5 pr-5 pt-3 pb-3 mr-5" onClick={() => handleMinusChange(product)}>-</span> */}
                                    <span><input id={"qtySelected-" + product.id} type="text" className="text-center w-75 h4 border rounded pl-5 pr-5 pt-3 pb-3 mr-5"
                                        onKeyPress={(e) => allowOnlyNumeric(e)} 
                                        onChange={(e) => handleQuantity(product)}
                                        value={product.selectedQty} 
                                        onPaste={handlePasteDisable} maxLength={15}/>
                                    </span>
                                    {/* <span id={"plusQty-" + product.id} className="pointer border rounded pl-5 pr-5 pt-3 pb-3 mr-5" onClick={() => handlePlusChange(product)}>+</span> */}
                                </div>
                                <div className="col-xl-4  mt-5">
                                    {
                                        product.order_quantity === 0 ?
                                            <span className="light-gray-bg dark-success-color rounded p-3 float-right">
                                                <strong>
                                                    <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/approved-done.svg")} />
                                                    &nbsp;Added
                                                </strong>
                                            </span> :
                                            <span className="float-right">
                                                {/* <button className="btn text-white mr-3 float-right" style={{ background: "#EB5757" }} onClick={() => handleResetChange(product)}>
                                                    Reset
                                                </button> */}
                                                <button className="btn text-white mr-3 float-right" style={{ background: "#6FCF97" }} onClick={() => handleAddChange(product)}>
                                                    <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/more.svg")} />
                                                    &nbsp;Add
                                                </button>
                                            </span>
                                    }
                                </div>
                            </div>

                            <div className="mt-5" style={{ border: "1px solid #6FCF97", width: "100%" }}></div>

                            {/* STOCK QTY ROW */}
                            <div className="mt-3">

                                <input id={"stockQuantityNum-" + product.id} type="hidden" />
                                <input id={"fromStoreId-" + product.id} type="hidden" />
                                <span className="dark-success-color" >
                                    <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/total-green.svg")} />
                                    <strong> &nbsp;Stock Qty. </strong> <strong className={"stockQuantity-" + product.id} />
                                </span>

                            </div>

                            {/* FREE QTY ROW */}
                            {/*
                                product.free_quantity === "" ? "" :
                                    <div className="mt-3">
                                        <span className="mr-5">
                                            <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/free-gray.svg")} />
                                            <span className="text-muted">&nbsp;Free Qty&nbsp;</span>
                                            <strong>{product.free_quantity}</strong>
                                        </span>
                                    </div>
                             */}
                        </CardBody>
                    </Card>
                ))
            }
        </>
    );
}