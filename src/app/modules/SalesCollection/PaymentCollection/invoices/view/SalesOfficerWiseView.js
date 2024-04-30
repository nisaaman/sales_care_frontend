import React, { useState, useEffect } from "react";
import CollectionBreadCrum from '../../common/CollectionBreadCrum';
import CollectionTodaySales from "../../common/CollectionTodaySales";
import FilterTabs from "../../common/FilterTabs";
import InvoicesTabs from "../../common/InvoicesTabs";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../../_metronic/_helpers";
import InventoryBreadCrum from '../../../../Inventory/bread-crum/InventoryBreadCrum';
import { Card, CardBody } from "../../../../../../_metronic/_partials/controls";
import { useHistory, useLocation } from 'react-router-dom';
import { useIntl } from "react-intl";
import { shallowEqual, useSelector } from "react-redux";
import { SalesOfficerWiseViewList } from "../table/sales-officer-wise-view-table/SalesOfficerWiseViewList";

export default function SalesOfficerWiseView() {
    let history = useHistory();
    let useLocationState = useLocation();
    const intl = useIntl();
    const companyId = useSelector((state) => state.auth.company, shallowEqual);
    const userLoginId = useSelector((state) => state.auth.user.userId, shallowEqual);

    const [sessionData, setSessionData] = useState({ userLoginId: userLoginId, companyId: companyId });
    const [searchParams, setSearchParams] = useState({ ...sessionData, locationId: '', semesterId: '' , accountingYearId: ''});
    const [region, setRegion] = useState("East");
    const [area, setArea] = useState("Chittagong");
    const [teritory, setTeritory] = useState("Cox’s Bazar");
    const [soName, setSoName] = useState("Hasibul Hasan Hasib");
    const [designation, setDesignation] = useState("Sales Officer"); 
    const [location, setLocation] = useState("Cox’s Bazar");
    const [collection, setCollection] = useState("55,606,521");
    let [singleAll, setSingleAll] = useState([]);

    useEffect(() => {  
    if(!useLocationState.state.status){       
        document.getElementById('pills-payment-invoices-tab').classList.add('active');
        document.getElementById('pills-invoices-sales-officer-wise-tab').classList.add('active');
    }
    }, []);

    const handleExport = () => {
        const exportData = [...singleAll]
        // console.log(exportData);
    }

    const handleBackToSalesOfficerWisePage = () => {
        history.push('/salescollection/payment-collection/invoices/sales-officer-wise');

    }

    const handleBackToStockInvoicePage = () => {
        history.push('/inventory/stock/sales-order/invoice-list');
    }
    return (
        <>
            
            {
                useLocationState.state.status ? 
                <div>
                    <InventoryBreadCrum />
                </div> :
                <>
                <div>
                    {/* BREAD CRUM ROW */}
                    <CollectionBreadCrum />
                    {/* TODAY SALE ROW */}
                    <CollectionTodaySales />
                </div>
                <div>
                    <InvoicesTabs />
                </div>
                </>
            }
            
            <div className="mt-5">
                <Card>
                    <CardBody>
                        {/* BACK AND TITLE ROW */}
                        <div className="row">
                            <div className="col-xl-4">
                                <span>
                                    <button className='btn' onClick={useLocationState.state.status ? handleBackToStockInvoicePage:handleBackToSalesOfficerWisePage}>
                                        <strong>
                                            <i className="bi bi-arrow-left-short sales-booking-view-icon"></i>
                                        </strong>
                                    </button>
                                </span>
                            </div>
                            <div className="col-xl-4 text-center mt-3">
                                <strong>{intl.formatMessage({ id: "COMMON.INVOICES_CAPITAL" })}</strong>
                            </div>
                        </div>
                        {/* HEADER ROW */}
                        <div className='row'>
                            {/* HEADER LEFT SIDE ROW START */}
                            <div className='col-xl-8 row'>
                                <span className="sales-booking-view-span mr-5">
                                    <span className="dark-gray-color"
                                        style={{ fontWeight: "500" }}>{intl.formatMessage({ id: "COMMON.REGION" })}</span>
                                    <p><strong>{region}</strong></p>
                                </span>
                                <span className="sales-booking-view-span  mr-5">
                                    <span className="dark-gray-color"
                                        style={{ fontWeight: "500" }}>{intl.formatMessage({ id: "LOCATION.AREA" })}</span>
                                    <p><strong>{area}</strong></p>
                                </span>
                                <span className="sales-booking-view-span mr-5">
                                    <span className="dark-gray-color"
                                        style={{ fontWeight: "500" }}>{intl.formatMessage({ id: "LOCATION.TERITORY" })}</span>
                                    <p><strong>{teritory}</strong></p>
                                </span>
                            </div>
                            {/* HEADER LEFT SIDE ROW END */}

                            {/* HEADER RIGHT SIDE ROW START */}
                            <div className='col-xl-4 d-flex justify-content-end'>
                                <div className="d-flex  mr-5">
                                    <div>
                                        <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/Avatar.svg")} width="35px" height="35px" />
                                    </div>
                                    <div className="ml-3">
                                        <span>
                                            <span style={{ fontWeight: "500" }}><strong>{soName}</strong></span><br/>
                                            <span className="text-muted">
                                            <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/designation.svg")} width="13px" height="13px" />&nbsp;
                                            {designation + "," + location}
                                            </span>
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <button className='btn sales-credit-btn' style={{ padding: "0px 15px", borderRadius: "13px" }}>
                                        <span className='text-white' style={{ fontSize: "0.83rem" }}>
                                            {intl.formatMessage({ id: "COMMON.COLLECTION" })}<br />
                                             {collection}
                                        </span>
                                    </button>
                                </div>
                            </div>
                            {/* HEADER RIGHT SIDE ROW END */}
                        </div>
                        {/* FITER ROW */}
                         <FilterTabs />
                        {/* ALL SUMMARY ROW */}
                        <div className='row'>
                            <div className='col-xl-2 sales-data-chip'>
                                <div className="d-flex">
                                    <div className="dark-gray-color">
                                        <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/list.svg")} width="25px" height="25px" />
                                    </div>
                                    <div className="ml-2">
                                        <span>
                                            <span className="dark-gray-color"
                                                style={{ fontWeight: "500" }}>{intl.formatMessage({ id: "COMMON.INVOICES" })}</span>
                                            <p><strong>28,030(All)</strong></p>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className='col-xl-2 sales-data-chip'>
                                <div className="d-flex">
                                    <div className="dark-gray-color">
                                        <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/listAmount.svg")} width="25px" height="25px" />
                                    </div>
                                    <div className="ml-2">
                                        <span>
                                            <span className="dark-gray-color"
                                                style={{ fontWeight: "500" }}>{intl.formatMessage({ id: "COMMON.INVOICES.AMOUNT" })}</span>
                                            <p><strong> 457,622,000</strong></p>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className='col-xl-2 sales-data-chip' style={{ borderRadius: "0px 5px 5px 0px" }}>
                                <div className="d-flex">
                                    <div className="dark-gray-color">
                                        <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/listAmount.svg")} width="25px" height="25px" />
                                    </div>
                                    <div className="ml-2">
                                        <span>
                                            <span className="dark-gray-color"
                                                style={{ fontWeight: "500" }}>{intl.formatMessage({ id: "COMMON.INVOICES.BALANCE" })}</span>
                                            <p><strong> 457,622,000</strong></p>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className='col-xl-3 sales-data-chip' style={{ borderRadius: "0px 5px 5px 0px" }}>
                                <div className="d-flex">
                                    <div className="dark-gray-color">
                                        <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/listAmount.svg")} width="25px" height="25px" />
                                    </div>
                                    <div className="ml-2">
                                        <span>
                                            <span className="dark-gray-color"
                                                style={{ fontWeight: "500" }}>{intl.formatMessage({ id: "PAYMENT.ORD.CALCULATOR.ORD" })}</span>
                                            <p><strong> 457,622</strong></p>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className='col-xl-3 sales-data-chip' style={{ background: "#F9F9F9" }}>
                                <button className="btn float-right export-btn" onClick={handleExport}>
                                    <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/download.svg")} width="15px" height="15px" />
                                </button>
                            </div>
                        </div>
                        {/* FITER LIST TABLE */}
                        <div className="mt-5">
                        <SalesOfficerWiseViewList setSingleAll={setSingleAll} singleAll={singleAll} />
                        </div>
                    </CardBody>
                </Card>
            </div>
        </>
    );
}