import React from "react";
import { toAbsoluteUrl } from "../../../../../../../../../_metronic/_helpers";
import SVG from "react-inlinesvg";
import { Card } from "react-bootstrap";
import { CardBody } from "../../../../../../../../../_metronic/_partials/controls";
export default function BatchList({ handleRemovetoCart, cartList }) {
    return (
        <>
            <div className="mt-5">
                {/* CART TITLE ROW */}
                <Card style={{ borderTopRightRadius: "30px", borderTopLeftRadius: "30px" }}>
                    <CardBody>
                        <div>
                            <span className="text-muted">Title</span><br />
                            <strong>Stock Transfer</strong>
                        </div>
                        <div className="mt-5">
                            <span className="text-muted"><strong>PRODUCTS</strong></span>
                            <span className="text-muted float-right"><strong>ACTION</strong></span>
                        </div>
                    </CardBody>
                </Card>

                {/* CART LIST DATA ROW */}
                <div className="mt-5">
                    {
                        cartList.map((obj, index) => (
                            
                            <Card className = "mt-5">
                                <CardBody>
                                    <div className="d-flex">
                                        <div className="ml-n3 mt-3"><span className="rounded light-gray-bg pl-2 pr-2">{index + 1}</span></div>
                                        <div className="w-100 pl-5">
                                            <div>
                                                <button className="btn float-right" style={{ background: "#F9F9F9", color: "#0396FF" }} onClick={() => handleRemovetoCart(obj)}>
                                                    <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/red-delete.svg")} />
                                                </button>
                                            </div>
                                            <div>
                                                <span className="text-muted">{obj.productSku}</span><br />
                                                <strong>{obj.productName}</strong><br />
                                                <span className="text-muted">{obj.productCategory}</span><br />
                                                <span className="text-muted">
                                                    <SVG className="mr-1" src={toAbsoluteUrl("/media/svg/icons/project-svg/price-gray.svg")} width="15px" height="15px"/>Current W.A. Rate
                                                    <strong>500</strong>
                                                </span>
                                            </div>
                                            <div className="mt-5" style={{ border: "1px solid #F2F2F2", width: "100%" }}></div>
                                            {
                                                obj.batch.map((batchData,index)=>(
                                                        
                                                    <div className="mt-5">
                                                        <strong className="dark-gray-color mr-5">{batchData.batchNo}</strong>
                                                        <span className="bg-light dark-gray-color p-1 rounded mr-3">{batchData.batchQuantity}</span>
                                                        <span className="bg-light dark-gray-color p-1 rounded">{batchData.batchTp}</span>
                                                    </div>
                                                ))
                                                
                                            }
                                            <div className="mt-5" style={{ border: "1px solid #F2F2F2", width: "100%" }}></div>
                                            {/* TOTAL QTY ROW */}
                                            <div className="mt-3">
                                                <span><span>Transfer Qty.</span><strong>{obj.transferQuantity}</strong></span>
                                                {/* <span className="float-right">
                                                    <span className="mr-1">Qty. UOM</span><strong>2,948,920</strong>
                                                </span> */}
                                            </div>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        ))
                    }
                </div>

                {/* TRANSPORT INFO ROW */}
                <Card className="mt-4">
                    <CardBody>
                        <div className="mt-3">
                            <span className="display-inline-block rounded light-gray-bg pl-2 pt-1 pb-1 pr-2 mr-5">
                                <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/delivery.svg")} />
                            </span>
                            <strong className="display-inline-block">ADD Transport</strong>
                        </div>
                        <div className="mt-5 ml-5">
                            <span className="dark-blue-color">From</span><br />
                            <small className="text-muted">
                                Flat- 7B, Plot No- 3/1, Block- F, Lalmatia 1207 Dhaka, Dhaka Division, Bangladesh
                            </small><br />
                            <span className="dark-purple-color">To</span><br />
                            <small className="text-muted">
                                Flat- 7B, Plot No- 3/1, Block- F, Lalmatia 1207 Dhaka, Dhaka Division, Bangladesh
                            </small>
                        </div>
                        <div className="mt-5 ml-5">
                            <span>
                                <label className="level-title">Vehicle No<span className="text-danger">*</span></label>
                                <select className="form-control">
                                    <option value="">Choose Vehicle No</option>
                                    <option value="1">111</option>
                                    <option value="2">222</option>
                                </select>
                            </span><br />

                            <span className="mt-5">
                                <label className="level-title">Driver Name<span className="text-danger">*</span></label>
                                <input placeholder="Enter Driver Name" type="text" className="form-control" />
                            </span><br />

                            <span className="mt-5">
                                <label className="level-title">Driver Contact No<span className="text-danger">*</span></label>
                                <input placeholder="Enter Driver Contact No." type="text" className="form-control" />
                            </span>
                        </div>
                    </CardBody>
                </Card>


                {/* TOTAL CART ROW */}
                <Card className="mt-4" style={{ borderBottomRightRadius: "30px", borderBottomLeftRadius: "30px" }}>
                    <CardBody>
                        {/* TOTAL W.A. RATE ROW */}
                        <div className="mt-3">
                            <span>Total W.A. Rate</span>
                            <strong className="float-right">6,530</strong>
                        </div>

                        {/* TOTAL PRODUCT LIST ROW */}
                        <div className="mt-3">
                            <span>Total Product List</span>
                            <span className="float-right">
                                <strong>
                                    4
                                </strong>
                            </span>
                        </div>

                        {/* TOTAL PRODUCT QTY ROW */}
                        <div className="mt-3">
                            <strong className="level-title">Total Product Qty.</strong>
                            <span className="float-right">
                                <strong>
                                    6,920
                                </strong>
                            </span>
                        </div>

                        <div className="mt-5">
                            <button className="btn dark-danger-color" style={{ background: "#F9F9F9", color: "#0396FF" }}>
                                <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/reject.svg")} />
                                &nbsp;<strong>Cancel</strong>
                            </button>
                            <button className="btn text-white mr-3 float-right" style={{ background: "#6FCF97" }}>
                                <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/white-receive.svg")} />
                                &nbsp;<strong>Submit Transfer</strong>
                            </button>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </>
    );
}