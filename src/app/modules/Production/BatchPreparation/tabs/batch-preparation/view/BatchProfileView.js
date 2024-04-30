import React, { useState, useEffect } from "react";
import BatchPreparationBreadCrum from '../../../common/BatchPreparationBreadCrum';
import BatchProfileHeader from '../../../common/BatchProfileHeader';
import { useLocation } from "react-router-dom";
import { Card } from "react-bootstrap";
import { CardBody } from "../../../../../../../_metronic/_partials/controls";
import { toAbsoluteUrl } from "../../../../../../../_metronic/_helpers";
import SVG from "react-inlinesvg";
import InventoryBreadCrum from "../../../../../Inventory/bread-crum/InventoryBreadCrum";

export default function BatchProfileView() {
    let [singleAll, setSingleAll] = useState([]);
    const location = useLocation();  
    useEffect(() => {
        document.getElementById('pills-product-view-stock-data-tab').classList.add('active');
        if(!location.state.status){
            document.getElementById('product-profile-dot').classList.add('d-inline');
            document.getElementById('product-profile').classList.remove('d-none');
            document.getElementById('product-profile').classList.add('d-inline');
        }
    }, []);

    const selectProductDiv = (event, number) => {
        let id = "id-" + number;
        const getId = document.getElementById(id);
        const getElements = document.getElementsByClassName('product-div');

        for (var i = 0; i < getElements.length; i++) {
            getElements[i].classList.remove('active-product');
        }

        if (getId) {
            getId.classList.add('active-product');
        }
    }
    const handleAllChange = () => {
        const getId = document.getElementById("regularId");
        const attributrValue = getId.getAttribute("selected");

        if (attributrValue == "true") {
            getId.classList.remove("products-filter-span-change");
            getId.setAttribute("selected", "false");
        } else {
            getId.classList.add("products-filter-span-change");
            getId.setAttribute("selected", "true");
        }
    }
    const handleExport = () => {
        const exportData = [...singleAll]
    }
    return (
        <>
            {/* BREAD CRUM ROW */}
            <div>
                {
                  location.state.status ?
                  <InventoryBreadCrum /> : 
                  <BatchPreparationBreadCrum /> 
                }
                
            </div>

            {/* TABS ROW */}
            <div>
                <BatchProfileHeader status={location.state.status}/>
            </div>

            {/* MAIN CARD ROW */}
            <div>
                <Card>
                    <CardBody>
                        <div className="row">
                            <div className="col-xl-3">
                                <div style={{ borderRight: "1px solid #F2F2F2" }}>
                                    {/* SEARCHING AND FILTERING ROW */}
                                    <div className="row">
                                        <div className="col-xl-3  mt-3">
                                            <span id="regularId" className="products-filter-span" selected="false" onClick={handleAllChange}>
                                                All
                                            </span>
                                        </div>
                                        <div className="col-xl-9 ml-n5">
                                            <div style={{ position: "absolute", padding: "7px", marginTop: "3px" }}>
                                                <img src={toAbsoluteUrl("/images/search.png")} width="20px" height="20px" />
                                            </div>
                                            <form className="form form-label-right">
                                                <input type="text" className="form-control" name="searchText"
                                                    placeholder="Search Batch" style={{ paddingLeft: "28px" }} />
                                            </form>
                                        </div>
                                    </div>
                                    {/* SEARCHING PRODUCT LIST */}
                                    <div className="mt-5 scroll-product-search">
                                        <div className="mt-5 product-div" onClick={(event) => selectProductDiv(event, 0)} id={"id-" + 0}>
                                            <span className="text-muted">Batch</span><br />
                                            <strong>000113 -000005 - 24 – 05 - 2022</strong><br />
                                            <span className="text-muted">Total 5,456,145</span>
                                        </div>
                                        <div className="mt-5 product-div" onClick={(event) => selectProductDiv(event, 1)} id={"id-" + 1}>
                                            <span className="text-muted">Batch</span><br />
                                            <strong>000113 -000005 - 24 – 05 - 2022</strong><br />
                                            <span className="text-muted">Total 5,456,145</span>
                                        </div>
                                        <div className="mt-5 product-div" onClick={(event) => selectProductDiv(event, 2)} id={"id-" + 2}>
                                            <span className="text-muted">Batch</span><br />
                                            <strong>000113 -000005 - 24 – 05 - 2022</strong><br />
                                            <span className="text-muted">Total 5,456,145</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-9">
                                {/* ALL SUMMARY ROW */}
                                <div className="row product-profile-summary">
                                    {/* PRODUCT NAME ROW */}
                                    <div className='col-xl-4' style={{ borderRadius: "5px 0px 0px 5px" }}>
                                        <div className="d-flex">
                                            <div className="dark-gray-color">
                                                <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/product-gray.svg")} width="30px" height="30px" />
                                            </div>
                                            <div className="ml-2">
                                                <span>
                                                    <span className="dark-gray-color"
                                                        style={{ fontWeight: "500" }}>Product Name</span>
                                                    <p><strong>Fix 2 10 ml x 40  </strong></p>
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* BATCH ROW */}
                                    <div className='col-xl-4'>
                                        <div className="d-flex">
                                            <div className="dark-gray-color">
                                                <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/batch-gray.svg")} width="25px" height="25px" />
                                            </div>
                                            <div className="ml-2">
                                                <span>
                                                    <span className="dark-gray-color"
                                                        style={{ fontWeight: "500" }}>Batch</span>
                                                    <p><strong>000113 -000005 - 24 – 05 - 2022</strong></p>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* DHAKA DEPOT CARD ROW */}
                                <div className="p-5 current-vat-inactive mt-5">
                                    <div>
                                        {/* DEPOT TITLE ROW */}
                                        <span className="card-header-title">Dhaka Depot</span>

                                        {/* TOTAL QTY ROW */}
                                        <span className="float-right border border-light p-2 rounded">
                                            <span className="text-muted">
                                                <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/total-gray.svg")} />
                                                &nbsp;Total Qty.</span>&nbsp;
                                            <strong>63,564,465</strong>
                                        </span>
                                    </div>
                                    <div className="mt-2">
                                        {/* LOCATION ROW */}
                                        <span>
                                            <span className="text-muted">
                                                <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/location.svg")} width="20px" height="20px" />
                                                &nbsp;Area</span>&nbsp;
                                            <strong className="dark-gray-color">Mirpur, Savar</strong>
                                        </span>
                                    </div>

                                    <div className="row mt-3">
                                        {/* REGULAR CIRCLE */}
                                        <div className="col-xl-3 col-6 mt-md-3 mt-sm-5">
                                            <div className="row">
                                                <div className="col-2">
                                                    <div className="product-profile-view-circle-main" style={{ border: "3px solid #27AE60"}}>
                                                        <div className="product-profile-view-circle" style={{background:"#27AE60"}}></div>
                                                    </div>
                                                </div>
                                                <div className="col-10 ml-xl-n5">
                                                    <span className="display-inline-block">
                                                        <strong>45,428,030&nbsp;</strong>
                                                        <span className="text-muted">Regular</span>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* TRANSIT CIRCLE */}
                                        <div className="col-xl-3 col-6 mt-md-3 mt-sm-5">
                                            <div className="row">
                                                <div className="col-2">
                                                    <div className="product-profile-view-circle-main" style={{ border: "3px solid #56CCF2"}}>
                                                        <div className="product-profile-view-circle" style={{background:"#56CCF2"}}></div>
                                                    </div>
                                                </div>
                                                <div className="col-10 ml-xl-n5">
                                                    <span className="display-inline-block">
                                                        <strong>428,030&nbsp;</strong>
                                                        <span className="text-muted">In Transit</span>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* QUARANTINE CIRCLE */}
                                        <div className="col-xl-3 col-6 mt-md-3 mt-sm-5">
                                            <div className="row">
                                                <div className="col-2">
                                                    <div className="product-profile-view-circle-main" style={{ border: "3px solid #F2C94C"}}>
                                                        <div className="product-profile-view-circle" style={{background:"#F2C94C"}}></div>
                                                    </div>
                                                </div>
                                                <div className="col-10 ml-xl-n5">
                                                    <span className="display-inline-block">
                                                        <strong>2,030&nbsp;</strong>
                                                        <span className="text-muted">Quarantine</span>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* RESTRICTED CIRCLE */}
                                        <div className="col-xl-3 col-6 mt-md-3 mt-sm-5">
                                            <div className="row">
                                                <div className="col-2">
                                                    <div className="product-profile-view-circle-main" style={{ border: "3px solid #EB5757"}}>
                                                        <div className="product-profile-view-circle" style={{background:"#EB5757"}}></div>
                                                    </div>
                                                </div>
                                                <div className="col-10 ml-xl-n5">
                                                    <span className="display-inline-block">
                                                        <strong>8,030&nbsp;</strong>
                                                        <span className="text-muted">Restricted</span>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>


                                    <div class="progress mt-3 h-5px">
                                        <div class="progress-bar" role="progressbar" style={{ width: "40%", background:"#27AE60" }} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                                        <div class="progress-bar" role="progressbar" style={{ width: "30%", background:"#F2C94C" }} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                                        <div class="progress-bar" role="progressbar" style={{ width: "20%", background:"#56CCF2" }} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                                        <div class="progress-bar" role="progressbar" style={{ width: "10%", background:"#EB5757" }} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                                    </div>
                                </div>

                                {/* CHITTAGONG DEPOT CARD ROW */}
                                <div className="p-5 current-vat-inactive mt-5">
                                    <div>
                                        {/* DEPOT TITLE ROW */}
                                        <span className="card-header-title">Chittagong Depot</span>

                                        {/* TOTAL QTY ROW */}
                                        <span className="float-right border border-light p-2 rounded">
                                            <span className="text-muted">
                                                <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/total-gray.svg")} />
                                                &nbsp;Total Qty.</span>&nbsp;
                                            <strong>63,564,465</strong>
                                        </span>
                                    </div>
                                    <div className="mt-2">
                                        {/* LOCATION ROW */}
                                        <span>
                                            <span className="text-muted">
                                                <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/location.svg")} width="20px" height="20px" />
                                                &nbsp;Area</span>&nbsp;
                                            <strong className="dark-gray-color">Mirpur, Savar</strong>
                                        </span>
                                    </div>

                                    <div className="row mt-3">
                                        {/* REGULAR CIRCLE */}
                                        <div className="col-xl-3 col-6 mt-md-3 mt-sm-5">
                                            <div className="row">
                                                <div className="col-2">
                                                    <div className="product-profile-view-circle-main" style={{ border: "3px solid #27AE60"}}>
                                                        <div className="product-profile-view-circle" style={{background:"#27AE60"}}></div>
                                                    </div>
                                                </div>
                                                <div className="col-10 ml-xl-n5">
                                                    <span className="display-inline-block">
                                                        <strong>45,428,030&nbsp;</strong>
                                                        <span className="text-muted">Regular</span>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* TRANSIT CIRCLE */}
                                        <div className="col-xl-3 col-6 mt-md-3 mt-sm-5">
                                            <div className="row">
                                                <div className="col-2">
                                                    <div className="product-profile-view-circle-main" style={{ border: "3px solid #56CCF2"}}>
                                                        <div className="product-profile-view-circle" style={{background:"#56CCF2"}}></div>
                                                    </div>
                                                </div>
                                                <div className="col-10 ml-xl-n5">
                                                    <span className="display-inline-block">
                                                        <strong>428,030&nbsp;</strong>
                                                        <span className="text-muted">In Transit</span>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* QUARANTINE CIRCLE */}
                                        <div className="col-xl-3 col-6 mt-md-3 mt-sm-5">
                                            <div className="row">
                                                <div className="col-2">
                                                    <div className="product-profile-view-circle-main" style={{ border: "3px solid #F2C94C"}}>
                                                        <div className="product-profile-view-circle" style={{background:"#F2C94C"}}></div>
                                                    </div>
                                                </div>
                                                <div className="col-10 ml-xl-n5">
                                                    <span className="display-inline-block">
                                                        <strong>2,030&nbsp;</strong>
                                                        <span className="text-muted">Quarantine</span>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* RESTRICTED CIRCLE */}
                                        <div className="col-xl-3 col-6 mt-md-3 mt-sm-5">
                                            <div className="row">
                                                <div className="col-2">
                                                    <div className="product-profile-view-circle-main" style={{ border: "3px solid #EB5757"}}>
                                                        <div className="product-profile-view-circle" style={{background:"#EB5757"}}></div>
                                                    </div>
                                                </div>
                                                <div className="col-10 ml-xl-n5">
                                                    <span className="display-inline-block">
                                                        <strong>8,030&nbsp;</strong>
                                                        <span className="text-muted">Restricted</span>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>


                                    <div class="progress mt-3 h-5px">
                                        <div class="progress-bar" role="progressbar" style={{ width: "40%", background:"#27AE60" }} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                                        <div class="progress-bar" role="progressbar" style={{ width: "30%", background:"#F2C94C" }} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                                        <div class="progress-bar" role="progressbar" style={{ width: "20%", background:"#56CCF2" }} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                                        <div class="progress-bar" role="progressbar" style={{ width: "10%", background:"#EB5757" }} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                                    </div>
                                </div>

                                {/* BARISHAL DEPOT CARD ROW */}
                                <div className="p-5 current-vat-inactive mt-5">
                                    <div>
                                        {/* DEPOT TITLE ROW */}
                                        <span className="card-header-title">Barishal Depot</span>

                                        {/* TOTAL QTY ROW */}
                                        <span className="float-right border border-light p-2 rounded">
                                            <span className="text-muted">
                                                <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/total-gray.svg")} />
                                                &nbsp;Total Qty.</span>&nbsp;
                                            <strong>63,564,465</strong>
                                        </span>
                                    </div>
                                    <div className="mt-2">
                                        {/* LOCATION ROW */}
                                        <span>
                                            <span className="text-muted">
                                                <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/location.svg")} width="20px" height="20px" />
                                                &nbsp;Area</span>&nbsp;
                                            <strong className="dark-gray-color">Mirpur, Savar</strong>
                                        </span>
                                    </div>

                                    <div className="row mt-3">
                                        {/* REGULAR CIRCLE */}
                                        <div className="col-xl-3 col-6 mt-md-3 mt-sm-5">
                                            <div className="row">
                                                <div className="col-2">
                                                    <div className="product-profile-view-circle-main" style={{ border: "3px solid #27AE60"}}>
                                                        <div className="product-profile-view-circle" style={{background:"#27AE60"}}></div>
                                                    </div>
                                                </div>
                                                <div className="col-10 ml-xl-n5">
                                                    <span className="display-inline-block">
                                                        <strong>45,428,030&nbsp;</strong>
                                                        <span className="text-muted">Regular</span>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* TRANSIT CIRCLE */}
                                        <div className="col-xl-3 col-6 mt-md-3 mt-sm-5">
                                            <div className="row">
                                                <div className="col-2">
                                                    <div className="product-profile-view-circle-main" style={{ border: "3px solid #56CCF2"}}>
                                                        <div className="product-profile-view-circle" style={{background:"#56CCF2"}}></div>
                                                    </div>
                                                </div>
                                                <div className="col-10 ml-xl-n5">
                                                    <span className="display-inline-block">
                                                        <strong>428,030&nbsp;</strong>
                                                        <span className="text-muted">In Transit</span>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* QUARANTINE CIRCLE */}
                                        <div className="col-xl-3 col-6 mt-md-3 mt-sm-5">
                                            <div className="row">
                                                <div className="col-2">
                                                    <div className="product-profile-view-circle-main" style={{ border: "3px solid #F2C94C"}}>
                                                        <div className="product-profile-view-circle" style={{background:"#F2C94C"}}></div>
                                                    </div>
                                                </div>
                                                <div className="col-10 ml-xl-n5">
                                                    <span className="display-inline-block">
                                                        <strong>2,030&nbsp;</strong>
                                                        <span className="text-muted">Quarantine</span>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* RESTRICTED CIRCLE */}
                                        <div className="col-xl-3 col-6 mt-md-3 mt-sm-5">
                                            <div className="row">
                                                <div className="col-2">
                                                    <div className="product-profile-view-circle-main" style={{ border: "3px solid #EB5757"}}>
                                                        <div className="product-profile-view-circle" style={{background:"#EB5757"}}></div>
                                                    </div>
                                                </div>
                                                <div className="col-10 ml-xl-n5">
                                                    <span className="display-inline-block">
                                                        <strong>8,030&nbsp;</strong>
                                                        <span className="text-muted">Restricted</span>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>


                                    <div class="progress mt-3 h-5px">
                                        <div class="progress-bar" role="progressbar" style={{ width: "40%", background:"#27AE60" }} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                                        <div class="progress-bar" role="progressbar" style={{ width: "30%", background:"#F2C94C" }} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                                        <div class="progress-bar" role="progressbar" style={{ width: "20%", background:"#56CCF2" }} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                                        <div class="progress-bar" role="progressbar" style={{ width: "10%", background:"#EB5757" }} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </>
    );
}