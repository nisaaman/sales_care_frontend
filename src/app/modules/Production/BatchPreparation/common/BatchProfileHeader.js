import React from "react";
import { useHistory, useLocation } from "react-router-dom";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../_metronic/_helpers";
import {
    Card,
    CardBody,
} from "../../../../../_metronic/_partials/controls";
import { useIntl } from "react-intl";
export default function BatchProfileHeader(props) {
    const intl = useIntl();
    const history = useHistory();
    const product = props.product;

    const handleOverviewChange = () => {
        //history.push("/salescollection/configure/trade-discount-setup/list")
    }
    // const handleStockDataChange = () => {
    //     history.push("/production/production-batch-preparation/production-batch-preparation-product-stock")
    // }
    const handleBatchesQRCodeChange = () => {
        history.push("/production/production-batch-preparation/production-batch-preparation-product-qr", { state: props.product })
    }
    const handleClose = ()=>{
        history.push("/production/production-batch-preparation/production-batch-preparation-product")
    }
    return (
        <>
            {/* TODAY SALE ROW */}
            <div className="mt-3">
                <Card>
                    <CardBody style={{ marginBottom: "-36px" }}>
                        <div className="row">
                            <div className="col-2">
                                {/**<div>
                                    <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/Lays.svg")} width="70%" height="70%" />
                                </div> */}
                            </div>
                            <div className="col-10 ml-n5">
                                <div className="d-flex flex-wrap justify-content-between"> 
                                    <div className="create-field-title">{product.productName}</div>
                                    {/* <span
                                        className="card-div-icon dark-gray-color edit-icon mr-5"
                                        style={{ marginLeft: "10px" }}
                                        data-toggle="tooltip" data-placement="bottom" title="Edit"
                                    >
                                        <SVG 
                                       className="pen-edit-icon"
                                        src={toAbsoluteUrl("/media/svg/icons/project-svg/eva_edit.svg")} data-toggle="tooltip" data-placement="bottom" title="Edit"/>
                                    </span> */}
                                    <div className="mt-4">
                                        
                                        <div>
                                            <span className="bg-danger-close" onClick={handleClose}>
                                            <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/reject.svg")} width="15px" height="15px" />&nbsp;
                                            Close
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-5">
                                    <span className="display-inline-block">
                                        <span className="text-muted">
                                        <SVG 
                                       className="pen-edit-icon"
                                        src={toAbsoluteUrl("/media/svg/icons/project-svg/category-gray.svg")}/>
                                            &nbsp;Category
                                        </span>&nbsp;
                                        <strong>
                                           {product.productCategory}
                                        </strong>&nbsp;&nbsp;&nbsp;
                                    </span>
                                    <span className="display-inline-block">
                                        <span className="text-muted">
                                        <SVG 
                                       className="pen-edit-icon"
                                        src={toAbsoluteUrl("/media/svg/icons/project-svg/pack-size-gray.svg")}/>
                                            &nbsp;
                                            Pack Size
                                        </span>&nbsp;
                                        <strong>
                                           {product.itemSize}
                                        </strong>&nbsp;&nbsp;&nbsp;
                                    </span>
                                    <span className="display-inline-block">
                                        <span className="text-muted">
                                        <SVG 
                                       className="pen-edit-icon"
                                        src={toAbsoluteUrl("/media/svg/icons/project-svg/outer-size-gray.svg")}/>
                                            &nbsp;
                                            Outer Pack Size
                                        </span>&nbsp;
                                        <strong>
                                            {product.packSize}
                                        </strong>&nbsp;&nbsp;&nbsp;
                                    </span>
                                </div>
                                {/**<div className="mt-3 row">
                                    <span className="sales-chip mt-5 mr-5"><i class="bi bi-arrow-up-short text-primary"></i>&nbsp;999,428,030<br /><span className='text-muted'>Regular Store Qty.</span></span>
                                    <span className="sales-chip mt-5"><i class="bi bi-arrow-down-short text-danger"></i>&nbsp;115.23<br /><span className='text-muted'>W.A Rate</span></span>
                                </div> */}
                            </div>
                        </div>
                        <div className="mt-5">
                            <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
                                <li class="nav-item" role="presentation">
                                    <a class="nav-link" id="pills-product-view-overview-tab" data-toggle="pill" href="#pills-product-view-overview" role="tab" aria-controls="pills-product-view-overview" aria-selected="false" onClick={handleOverviewChange}>Overview</a>
                                </li>
                                {/* <li class="nav-item" role="presentation">
                                    <a class="nav-link" id="pills-product-view-stock-data-tab" data-toggle="pill" href="#pills-product-view-stock-data" role="tab" aria-controls="pills-product-view-stock-data" aria-selected="false" onClick={handleStockDataChange}>Stock Data</a>
                                </li> */}
                                <li class="nav-item" role="presentation">
                                    <a class="nav-link" id="pills-product-view-batch-qr-code-tab" data-toggle="pill" href="#pills-product-view-batch-qr-code" role="tab" aria-controls="pills-product-view-batch-qr-code" aria-selected="false" onClick={handleBatchesQRCodeChange}>Batches & QR Code</a>
                                </li>
                            </ul>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </>
    );
}