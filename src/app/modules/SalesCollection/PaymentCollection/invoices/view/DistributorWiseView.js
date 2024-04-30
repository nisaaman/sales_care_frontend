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
import { DistributorWiseViewList } from "../table/distributor-wise-view-table/DistributorWiseViewList";
import { shallowEqual, useSelector } from "react-redux";
import axios from "axios";
import { amountFormatterWithoutCurrency, dateFormatPattern } from "../../../../Util";
import moment from "moment";
import {showError} from '../../../../../pages/Alert';
import * as XLSX from 'xlsx';

export default function DistributorWiseView() {
    let history = useHistory();
    const intl = useIntl();
    const location = useLocation();
    const distributorInvoice = location.state.state;
    const asOnDateStr = location.state.asOnDateStr;

    const companyId = useSelector((state) => state.auth.company, shallowEqual);
    const userLoginId = useSelector((state) => state.auth.user.userId, shallowEqual);
    const [sessionData, setSessionData] = useState({ userLoginId: userLoginId, companyId: companyId, accountingYearId: 1 });
    const [searchParams, setSearchParams] = useState({ ...sessionData, locationId: '', semesterId: '' });
    const [overDueParams, setOverDueParams] = useState([]);
    const [invoiceSearchParams, setInvoiceSearchParams] = 
        useState({companyId:companyId, asOnDate:asOnDateStr,allData:'', invoiceNature: '', 
        notDues:0, overDueParams:[], isAcknowledged: ''});
    const [region, setRegion] = useState("East");
    const [area, setArea] = useState("Chittagong");
    const [teritory, setTeritory] = useState("Cox’s Bazar");
    const [distributorName, setDistributorName] = useState("Lay’s Seed Enterprize");
    const [contactNo, setContactNo] = useState("+880 1779 911 488")
    const [balance, setBalance] = useState("55,606,521")
    const [invoiceDetails, setInvoiceDetails] = useState([]);
    const [totalInvoiceAmount, setTotalInvoiceAmount] = useState(0);
    const [totalInvoiceBalance, setTotalInvoiceBalance] = useState(0);
    const [totalOrdAmount, setTotalOrdAmount] = useState(0);

    let [singleAll, setSingleAll] = useState([]);

    useEffect(() => {
        if(!location.state.status){       
            document.getElementById('pills-payment-invoices-tab').classList.add('active');
            document.getElementById('pills-invoices-distributor-wise-tab').classList.add('active');
        }
    }, []);

    const handleExport = () => {
        const data = [...singleAll];
        if (data.length === 0) {
            showError("Please select rows to export data.");
            return;
        }
        let exportData = [];
        data.map(row => {
            let obj = {};           
            obj.invoiceNo = row.invoiceNo;
            obj.invoiceNature = row.invoiceNature;
            obj.invoiceDate = moment(row.invoiceDate).format(dateFormatPattern());
            obj.salesOfficer = row.salesOfficer;
            obj.designation = row.designation;
            obj.overDueDays = row.overDueDays;
            obj.invoiceBalance = amountFormatterWithoutCurrency(row.invoiceBalance);
            obj.ordAmount = amountFormatterWithoutCurrency(row.ordAmount);
            obj.invoiceAmount = amountFormatterWithoutCurrency(row.invoiceAmount);
          
            exportData.push(obj);
        })
        const workbook = XLSX.utils.book_new();
        const Heading = [
            ["INVOICE NO", "INVOICE NATURE", "INVOICE DATE", "SALES OFFICER", "DESIGNATION", "OVERDUE DAYS", "INVOICE BALANCE", "ORD AMOUNT", "INVOICE AMOUNT"]
        ];
        const worksheet = XLSX.utils.json_to_sheet(exportData, { origin: 'A2', skipHeader: true });
        XLSX.utils.sheet_add_aoa(worksheet, Heading, { origin: 'A1' });
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, "InvoiceViewList.xlsx");
    }

    const handleBackToDistributorWisePage = () => {
        history.push('/salescollection/payment-collection/invoices/distributor-wise');
    }

    const handleBackToStockInvoicePage = () => {
        history.push('/inventory/stock/sales-order/invoice-list');
    }
    

    useEffect(() => {
        getDistributorseSalesInvoiceDetails(invoiceSearchParams);
      },[invoiceSearchParams]);
    
      
      const getDistributorseSalesInvoiceDetails = (invoiceSearchParams) => {
        let queryString = "?";
        queryString += "distributorId="+distributorInvoice.distributorId;
        queryString += "&companyId="+invoiceSearchParams.companyId;
        queryString += invoiceSearchParams.invoiceNature ? "&invoiceNature="+invoiceSearchParams.invoiceNature : "";
        queryString += invoiceSearchParams.overDueParams ? "&overDueIntervals="+invoiceSearchParams.overDueParams : "";
        queryString += "&asOnDate="+invoiceSearchParams.asOnDate;
        queryString += "&notDueStatus="+invoiceSearchParams.notDues;
        queryString += "&isAcknowledged="+invoiceSearchParams.isAcknowledged;
            
        const URL = `${process.env.REACT_APP_API_URL}/api/sales-invoice/distributor/invoice/details`+queryString;
        axios.get(URL).then(response => {
            setInvoiceDetails(response.data.data.salesInvoicesDetails);
            setTotalInvoiceAmount(response.data.data.totalInvoiceAmount);
            setTotalInvoiceBalance(response.data.data.totalInvoiceBalance);
            setTotalOrdAmount(response.data.data.totalOrdAmount);
        }).catch(err => {
    
        });
      }

    return (
        <>
            {
                location.state.status ? 
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
                                    <button className='btn' onClick={location.state.status ? handleBackToStockInvoicePage:handleBackToDistributorWisePage}>
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
                                {/* <span className="sales-booking-view-span mr-5">
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
                                </span> */}
                            </div>
                            {/* HEADER LEFT SIDE ROW END */}

                            {/* HEADER RIGHT SIDE ROW START */}
                            <div className='col-xl-4 d-flex justify-content-end'>
                                <div className="d-flex  mr-5">
                                    {/*<div>
                                        <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/Lays.svg")} width="35px" height="35px" />
    </div>*/}
                                    <div className="ml-3">
                                        <span>
                                            <span style={{ fontWeight: "500" }}><strong>{distributorInvoice.distributorName}</strong></span>
                                            <p className="dark-gray-color">
                                                <i className="bi bi-telephone-fill" style={{ fontSize: "10px" }}></i>&nbsp;{contactNo}
                                            </p>
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <button className='btn sales-credit-btn' style={{ padding: "0px 15px", borderRadius: "13px" }}>
                                        <span className='text-white' style={{ fontSize: "0.83rem" }}>
                                            {intl.formatMessage({ id: "SALES.RETURN.BALANCE" })}<br />
                                            {amountFormatterWithoutCurrency(distributorInvoice.ledgerBalance)}
                                        </span>
                                    </button>
                                </div>
                            </div>
                            {/* HEADER RIGHT SIDE ROW END */}
                        </div>
                        {/* FITER ROW */}
                        <FilterTabs  invoiceSearchParams = {invoiceSearchParams} setInvoiceSearchParams = {setInvoiceSearchParams}/>
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
                                            <p><strong>{invoiceDetails?.length }</strong></p>
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
                                            <p><strong>{amountFormatterWithoutCurrency(totalInvoiceAmount)}</strong></p>
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
                                            <p><strong>{amountFormatterWithoutCurrency(totalInvoiceBalance)}</strong></p>
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
                                            <p><strong>{amountFormatterWithoutCurrency(totalOrdAmount)}</strong></p>
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
                            <DistributorWiseViewList setSingleAll={setSingleAll} singleAll={singleAll} invoiceDetails={invoiceDetails} />
                        </div>
                    </CardBody>
                </Card>
            </div>
        </>
    );
}