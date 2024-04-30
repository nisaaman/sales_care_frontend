import React, { useState, useEffect } from "react";
import InventoryBreadCrum from '../../../../../bread-crum/InventoryBreadCrum';
import InventoryStockHeader from "../../../../header/InventoryStockHeader";
import SalesReturnSubTabs from "../../sub-tabs-header/SalesReturnSubTabs";
import { Card, CardBody } from "../../../../../../../../_metronic/_partials/controls";
import { toAbsoluteUrl } from "../../../../../../../../_metronic/_helpers";
import SVG from "react-inlinesvg";
import ReceivedAndQAList from "./table/ReceivedAndQAList";

export default function ReceivedAndQA() {
    let [singleAll, setSingleAll] = useState([]);
    useEffect(() => {
        document.getElementById('pills-inventory-stock-sales-return-tab').classList.add('active');
        document.getElementById('pills-inventory-stock-sales-return-received-qa-tab').classList.add('active');
    }, []);
    const handleExport = () => {
        const exportData = [...singleAll]
    }
    return (
        <>
            {/* BREAD CRUM ROW */}
            <div>
                <InventoryBreadCrum />
            </div>
            
            {/* HEADER ROW */}
            <div>
               <InventoryStockHeader  showStockData={false}/>
            </div>

            {/*SUB TABS ROW */}
            <div>
                <SalesReturnSubTabs />
            </div>

            {/* MAIN CARD ROW */}
            <div>
                <Card>
                    <CardBody>
                        {/* SEARCH AND FILTER ROW */}
                        <div className="row">
                            {/* SEARCH BOX ROW */}
                            <div className="col-xl-3">
                                <div style={{ position: "absolute", padding: "7px", marginTop: "3px" }}>
                                    <img src={toAbsoluteUrl("/images/search.png")} width="20px" height="20px" />
                                </div>
                                <form className="form form-label-right">
                                    <input type="text" className="form-control" name="searchText"
                                    placeholder="Search Here" style={{ paddingLeft: "28px" }} />
                                </form>
                            </div>

                            {/* SELECTED ROW */}
                            <div className="col-xl-8 text-right">
                                {/* STATUS DROPDOWN */}
                                <span className="mr-3 display-inline-block">
                                        <div className="row">
                                            <div className="col-3 mt-3">
                                                <label className="dark-gray-color">Status</label>
                                            </div>
                                            <div className="col-9">
                                                <select className="border-0 form-control">
                                                    <option value="1" selected>Pending</option>
                                                    <option value="2">Pending</option>
                                                    <option value="3">Pending</option>
                                                </select>
                                            </div>
                                        </div>
                                    </span>
                                    {/* LOCATION DROPDOWN */}
                                    <span className="mr-3 display-inline-block">
                                        <div className="row">
                                            <div className="col-3 mt-3">
                                                <label className="dark-gray-color">Location</label>
                                            </div>
                                            <div className="col-9">
                                                <select className="border-0 form-control">
                                                    <option value="1" selected>Chittangong</option>
                                                    <option value="2">Chittangong</option>
                                                    <option value="3">Chittangong</option>
                                                </select>
                                            </div>
                                        </div>
                                    </span>
                                    {/* TIMELINE DROPDOWN */}
                                    <span className="mr-3 display-inline-block">
                                        <div className="row">
                                            <div className="col-3 mt-3">
                                                <label className="dark-gray-color">Timeline</label>
                                            </div>
                                            <div className="col-9">
                                                <select className="border-0 form-control">
                                                    <option value="1" selected>Fiscal Year 2022-23</option>
                                                    <option value="2">Fiscal Year 2022-23</option>
                                                    <option value="3">Fiscal Year 2022-23</option>
                                                </select>
                                            </div>
                                        </div>
                                    </span>
                            </div>

                            {/* FILTER BUTTON ROW */}
                            <div className="col-xl-1">
                                <button className="btn filter-btn">
                                    <i className="bi bi-funnel" style={{ fontSize: "11px" }}></i>&nbsp;Filter
                                </button>
                            </div>
                        </div>

                        {/* ALL SUMMARY ROW */}
                        <div className="row">
                            {/* NO. OF BOOKING ROW */}
                            <div className='col-xl-3 sales-data-chip'>
                                <div className="d-flex">
                                    <div className="dark-gray-color">
                                        <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/location.svg")} width="30px" height="30px" />
                                    </div>
                                    <div className="ml-2">
                                        <span>
                                            <span className="dark-gray-color"
                                                style={{ fontWeight: "500" }}>Location</span>
                                            <p><strong>Chittagong</strong></p>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* NO. OF BOOKING ROW */}
                            <div className='col-xl-3 sales-data-chip'>
                                <div className="d-flex">
                                    <div className="dark-gray-color">
                                        <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/history.svg")} width="25px" height="25px" />
                                    </div>
                                    <div className="ml-2">
                                        <span>
                                            <span className="dark-gray-color"
                                                style={{ fontWeight: "500" }}>No. Of Return</span>
                                            <p><strong>50(Pending)</strong></p>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* BOOKING AMOUNT ROW */}
                            <div className='col-xl-3 sales-data-chip'>
                                <div className="d-flex">
                                    <div className="dark-gray-color">
                                        <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/gray-doller.svg")} width="25px" height="25px" />
                                    </div>
                                    <div className="ml-2">
                                        <span>
                                            <span className="dark-gray-color"
                                                style={{ fontWeight: "500" }}>Return Amount</span>
                                            <p><strong>5,168,000</strong></p>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* EXPORT ROW */}
                            <div className='col-xl-3 sales-data-chip' style={{ background: "#F9F9F9" }}>
                                <button className="btn float-right export-btn" onClick={handleExport}>
                                    <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/download.svg")} width="15px" height="15px" />
                                </button>
                            </div>
                        </div>

                        {/* TABLE ROW */}
                        <div className='mt-5'>
                            <ReceivedAndQAList setSingleAll={setSingleAll} singleAll={singleAll} />
                        </div>
                    </CardBody>
                </Card>
            </div>
        </>
    );
}