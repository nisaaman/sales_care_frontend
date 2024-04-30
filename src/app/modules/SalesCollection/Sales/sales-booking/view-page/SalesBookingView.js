import React, { useState, useEffect } from 'react';
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../../_metronic/_helpers";
import { useHistory, useLocation } from "react-router-dom";
import {
    Card,
    CardBody,
} from "../../../../../../_metronic/_partials/controls";
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import clsx from 'clsx';
import NoteIcon from '@material-ui/icons/Note';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import { useIntl } from 'react-intl';
import axios from 'axios';
import { format, parse, isValid, parseISO } from 'date-fns';
import { enGB } from 'date-fns/locale';
import { BookingInformation } from './BookingInformation';
import { BookingOrderList } from './BookingOrderList';
import { BookingActivies } from './BookingActivies';

const useStyles = makeStyles(() => ({
    root: {
        backgroundColor: 'white',
        boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.03)",
        padding: 8,
        borderRadius: '50%'
    },
}));
export function SalesBookingView() {
    const history = useHistory();
    const location = useLocation();    
    const [activeStep, setActiveStep] = React.useState(0);
    const intl = useIntl();
    const [creditLimit, setCreditLimit] = useState();
    const [salesBookingDetails, setSalesBookingDetails] = useState([]);
    const [bookingLifeCycleStatus, setBookingLifeCycleStatus] = useState([]);
    const bookingInfo = location.state.state;

    useEffect(() => {
        getSalesBookingDetails();
        getSalesBookingLifeCycleStatus();
    }, []);

    let booking = ""
    let approval = bookingInfo.approval_status !== "APPROVED" ? "active" : "inactive";
    let order = bookingInfo.approval_status === "APPROVED" 
        && bookingLifeCycleStatus.bookingOrderStatus !== "Completed" ? "active" : "inactive";
    let delivery = bookingLifeCycleStatus.bookingOrderStatus === "Completed"
        && (bookingLifeCycleStatus.bookingDeliveryStatus !== "Completed"
        || bookingLifeCycleStatus.bookingInvoiceStatus !== "Completed") ? "active" : "inactive";
    let payment = bookingLifeCycleStatus.bookingInvoiceAcknowledgeStatus === "Completed"
        && bookingLifeCycleStatus.bookingPaymentAdjustmentStatus !== "Completed" ? "active" : "inactive";

    const handleSalesDataChange = () => {
        history.push("/salescollection/sales/slaes-data")
    }
    const handleBookingChange = () => {
        history.push("/salescollection/sales/sales-booking")
    }
    const handleOrderChange = () => {
        history.push("/salescollection/sales/slaes-order")
    }

    const CustomStepIcon = (props) => {
        const classes = useStyles();
        const stepIcons = {
            1: booking === "inactive" ? <NoteIcon width="15px" height="15px" style={{ color: "#828282" }} /> : booking === "active" ? <NoteIcon width="15px" height="15px" style={{ color: "blue" }} /> : <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/ok.svg")} width="15px" height="15px" />,
            2: approval === "inactive" ? <NoteIcon width="15px" height="15px" style={{ color: "#828282" }} /> : approval === "active" ? <NoteIcon width="15px" height="15px" style={{ color: "blue" }} /> : <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/ok.svg")} width="15px" height="15px" />,
            3: order === "inactive" ? <NoteIcon width="15px" height="15px" style={{ color: "#828282" }} /> : order === "active" ? <NoteIcon width="15px" height="15px" style={{ color: "blue" }} /> : <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/ok.svg")} width="15px" height="15px" />,
            4: delivery === "inactive" ? <LocalShippingIcon width="15px" height="15px" style={{ color: "#828282" }} /> : delivery === "active" ? <LocalShippingIcon width="15px" height="15px" style={{ color: "blue" }} /> : <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/ok.svg")} width="15px" height="15px" />,
            5: payment === "inactive" ? <AttachMoneyIcon width="15px" height="15px" style={{ color: "#828282" }} /> : payment === "active" ? <AttachMoneyIcon width="15px" height="15px" style={{ color: "blue" }} /> : <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/ok.svg")} width="15px" height="15px" />,
        };

        return (
            <div className={clsx(classes.root)}>
                {stepIcons[String(props.icon)]}
            </div>
        );
        
    };

    let bookingApprovedDate = bookingInfo.approval_date;
    let parsedBookingApprovedDate = "";
    const parsedBookingDate = format(parseISO(bookingInfo.booking_date), 'dd-MMM-yyyy HH:mm a');
    if (bookingApprovedDate) {
        parsedBookingApprovedDate = format(parseISO(bookingInfo.approval_date), 'dd-MMM-yyyy');
    }
    // const parsedBookingTentativeDeliveryDate = format(parseISO(bookingInfo.tentative_delivery_date), 'dd MMM yyyy');
    
    const salesBooking = <div className='text-center' style={{ fontSize: "0.83rem" }}>
        <span style={{ color: "#828282" }}>{intl.formatMessage({id: "SALES_BOOKING.SALES_BOOKING"})}</span><br />
        <span className='text-muted'>{intl.formatMessage({id: "COMMON.APPLIED_ON"})}</span>&nbsp;<strong>{parsedBookingDate}</strong><br />
        <span style={{ color: "#828282" }}>Payment</span>&nbsp;<strong>{bookingInfo.invoice_nature}</strong>
    </div>;
    const salesBookingApproval = <div className='text-center' style={{ fontSize: "0.83rem" }}>
        <span style={{ color: "#828282" }}>{intl.formatMessage({id: "SALES_BOOKING.SALES_BOOKING_APPROVAL"})}</span><br />
        {
        bookingInfo.approval_status === "APPROVED" 
        ? 
            <span className='text-muted'>{intl.formatMessage({id: "COMMON.APPROVED_ON"})}&nbsp;
            <strong> {parsedBookingApprovedDate} </strong><br /></span>
        :
            <span className='text-muted'><strong> {bookingInfo.approval_status} </strong><br /></span>
         }
    </div>;
    const salesOrder = <div className='text-center' style={{ fontSize: "0.83rem" }}>
        <span style={{ color: "#828282" }}>{intl.formatMessage({id: "SALES_ORDER.SALES_ORDER"})}</span><br />
        <span className='text-muted'>{intl.formatMessage({id: "COMMON.STATUS"})}</span>&nbsp;
        {bookingInfo.approval_status === "REJECTED" 
        ? <strong style={{ color: "#828282" }}> {bookingLifeCycleStatus.bookingOrderStatus} </strong>
        :<strong style={{ color: "#828282" }}> {bookingLifeCycleStatus.bookingOrderStatus} </strong>}
        <br />
    </div>;
    const salesDelivery = <div className='text-center' style={{ fontSize: "0.83rem" }}>
        <span style={{ color: "#828282" }}>{intl.formatMessage({id: "DELIVERY_CHALLAN.DELIVERY"})}</span><br />
        <span className='text-muted'>{intl.formatMessage({id: "DELIVERY_CHALLAN.SALES_DELIVERY_CHALLAN"})}
        </span>&nbsp;<strong>{bookingLifeCycleStatus.bookingDeliveryStatus}</strong>
        <br />
        <span className='text-muted'>{intl.formatMessage({id: "SALES_INVOICE.SALES_INVOICE"})}
        </span>&nbsp;<strong>{bookingLifeCycleStatus.bookingInvoiceStatus}</strong>
        <br />
        <span className='text-muted'>{intl.formatMessage({id: "SALES_INVOICE.SALES_INVOICE_ACKNOWLEDGE"})}
        </span>&nbsp;<strong>{bookingLifeCycleStatus.bookingInvoiceAcknowledgeStatus}</strong>
        <br />
        <span className='text-muted'>{intl.formatMessage({id: "COMMON.STATUS"})}
        </span>&nbsp;<strong>{bookingLifeCycleStatus.bookingDeliveryStatus} 
        {bookingInfo.parsedBookingTentativeDeliveryDate}</strong><br />
    </div>;
    const salesPayment = <div className='text-center' style={{ fontSize: "0.83rem" }}>
        <span style={{ color: "#828282" }}>{intl.formatMessage({id: "PAYMENT.PAYMENT_COLLECTION"})}</span><br />
        <span className='text-muted'>{intl.formatMessage({id: "PAYMENT.PAYMENT_ADJUSTMENT"})}
        </span>&nbsp;<strong>{bookingLifeCycleStatus.bookingPaymentAdjustmentStatus}</strong><br />
    </div>;
    const getSteps = () => {
        return [salesBooking, salesBookingApproval, salesOrder, salesDelivery, salesPayment];
    }
    const steps = getSteps();

    const getSalesBookingDetails = () => {    
        const URL = `${process.env.REACT_APP_API_URL}/api/sales-booking/get-booking-details/${bookingInfo.booking_id}`;
        axios.get(URL, JSON.stringify(), { headers: { "Content-Type": "application/json" } }).then(response => {
            let creditLimit = response.data.data.creditLimit;
            let salesBookingDetails = response.data.data.salesBookingDetails;
            setCreditLimit(creditLimit);
            setSalesBookingDetails(salesBookingDetails);
        });
      }

      const getSalesBookingLifeCycleStatus = () => {    
        const URL = `${process.env.REACT_APP_API_URL}/api/sales-booking/get-booking-life-cycle-status/${bookingInfo.company_id}/${bookingInfo.booking_id}`;
        // console.log(URL);
        axios.get(URL, JSON.stringify(), { headers: { "Content-Type": "application/json" } }).then(response => {
            let bookingLifeCycleStatus = response.data.data;
            setBookingLifeCycleStatus(bookingLifeCycleStatus);
        });
      }
   
    return (
        <>
            <div>
                {/* BREAD CRUM ROW */}
                {/* <div className="row" style={{ marginTop: "-30px", marginLeft: "-18px" }}>
                    <div className="col-xl-6">
                        <nav aria-label="breadcrumb">
                            <ol className="breadCrum-bg-color">
                                <li aria-current="page" className='breadCrum-main-title'>Google</li>
                                <li aria-current="page" className='mt-1 breadCrum-sub-title'>&nbsp; {intl.formatMessage({id: "COMMON.APPROVAL_PATH_CONFIG"})} &nbsp;&nbsp;&nbsp;&nbsp;</li>
                                <li aria-current="page" className='mt-1 breadCrum-sub-title text-primary'><span className='font-weight-bolder'>.</span>&nbsp; {intl.formatMessage({id: "COMMON.SALES"})} &nbsp;&nbsp;</li>
                            </ol>
                        </nav>
                    </div>
                    <div className="col-xl-6 d-flex justify-content-end">
                        <div className="mr-5">
                            <button
                                type="button"
                                className="btn approval-config-btn"
                                data-toggle="tooltip" data-placement="bottom" title="Approval Path Config"
                            >
                                <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/approval.svg")} width="15px" height="15px" />
                                &nbsp;&nbsp;Approval Path Config
                            </button>
                        </div>
                        <div>
                            <button
                                type="button"
                                className="btn approval-config-btn"
                                data-toggle="tooltip" data-placement="bottom" title="Product Configure"
                            >
                                <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/configure.svg")} width="15px" height="15px" />
                                &nbsp;&nbsp;Product Configure
                            </button>
                        </div>
                    </div>
                </div> */}
                {/* TODAY SALE ROW */}
                {/* <div className="mt-3">
                    <Card>
                        <CardBody style={{ marginBottom: "-36px" }}>
                            <div>
                                <p className="create-field-title">Today’s Sale</p>
                            </div>
                            <div className="mt-5 ml-2 row">
                                 <span className="sales-chip mt-5 mr-5"><i className="bi bi-arrow-up-short text-primary"></i>&nbsp;৳428,030&nbsp;<span className='text-muted'>Sale</span></span>
                            <span className="sales-chip mt-5 mr-5"><i className="bi bi-arrow-down-short text-danger"></i>&nbsp;৳428,030&nbsp;<span className='text-muted'>Booking</span></span>
                            <span className="sales-chip mt-5 mr-5"><i className="bi bi-arrow-up-short text-primary"></i>&nbsp;৳428,030&nbsp;<span className='text-muted'>Sales Order</span></span>
                            <span className="sales-chip mt-5 mr-5"><i className="bi bi-arrow-up-short text-primary"></i>&nbsp;QTY. 428&nbsp;<span className='text-muted'>Sales Return</span></span>
                            </div>
                            <div className="mt-5">
                                <ul className="nav nav-pills mb-3" id="pills-tab-sales" role="tablist">
                                    <li className="nav-item" role="presentation">
                                        <a className="nav-link" id="pills-overview-tab" data-toggle="pill" href="#pills-overview" role="tab" aria-controls="pills-overview" aria-selected="true">Overview</a>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                        <a className="nav-link" id="pills-sales-data-tab" data-toggle="pill" href="#pills-sales-data" role="tab" aria-controls="pills-sales-data" aria-selected="false" onClick={handleSalesDataChange}>Sales Data</a>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                        <a className="nav-link active" id="pills-sales-booking-tab" data-toggle="pill" href="#pills-sales-booking" role="tab" aria-controls="pills-sales-booking" aria-selected="false" onClick={handleBookingChange}>Sales Booking</a>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                        <a className="nav-link" id="pills-sales-order-tab" data-toggle="pill" href="#pills-sales-order" role="tab" aria-controls="pills-sales-order" aria-selected="false" onClick={handleOrderChange}>Sales Order</a>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                        <a className="nav-link" id="pills-sales-return-tab" data-toggle="pill" href="#pills-sales-return" role="tab" aria-controls="pills-sales-return" aria-selected="false">Sales Return</a>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                        <a className="nav-link" id="pills-trade-price-tab" data-toggle="pill" href="#pills-trade-price" role="tab" aria-controls="pills-trade-price" aria-selected="false">Trade Price</a>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                        <a className="nav-link" id="pills-trade-discount-tab" data-toggle="pill" href="#pills-trade-discount" role="tab" aria-controls="pills-trade-discount" aria-selected="false">Trade Discount</a>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                        <a className="nav-link" id="pills-sales-budget-tab" data-toggle="pill" href="#pills-sales-budget" role="tab" aria-controls="pills-sales-budget" aria-selected="false">Sales Budget</a>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                        <a className="nav-link" id="pills-report-tab" data-toggle="pill" href="#pills-report" role="tab" aria-controls="pills-report" aria-selected="false">Report</a>
                                    </li>
                                </ul>
                            </div>
                        </CardBody>
                    </Card>
                </div> */}
            </div>
            {/* CONTENT ROW */}
            <div>
                <Card>
                    <CardBody>
                        {/* HEADER ROW */}
                        <div className='d-flex flex-wrap justify-content-between'>
                            <div className='d-flex'>
                                <span className=" mr-5">
                                    <button className='btn' onClick={handleBookingChange}>
                                        <strong>
                                            <i className="bi bi-arrow-left-short sales-booking-view-icon"></i></strong>
                                    </button>
                                </span>
                                <span className="sales-booking-view-span mr-5">
                                    <span className="dark-gray-color"
                                        style={{ fontWeight: "500" }}>{intl.formatMessage({id: "SALES_BOOKING.BOOKING_NO"})}</span>
                                    <p><strong>{bookingInfo.booking_no}</strong></p>
                                </span>
                                <span className="sales-booking-view-span  mr-5">
                                    <span className="dark-gray-color"
                                        style={{ fontWeight: "500" }}>{intl.formatMessage({id: "DEPOT.DEPOT"})}</span>
                                    <p><strong>{bookingInfo.depot_name}</strong></p>
                                </span>
                                <span className="sales-booking-view-span mr-5">
                                    <span className="dark-gray-color"
                                        style={{ fontWeight: "500" }}>{intl.formatMessage({id: "LOCATION.TERITORY"})}</span>
                                    <p><strong>{bookingInfo.location_name}</strong></p>
                                </span>
                            </div>
                            <div className='d-flex'>
                                <div className="d-flex  mr-5">
                                    <div className='mr-1'>
                                        <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/Avatar.svg")} width="35px" height="35px" />
                                    </div>
                                    <div>
                                        
                                            <span style={{ fontWeight: "500" }}><strong>{bookingInfo.distributor_name}</strong></span><br />
                                            <span className="dark-gray-color display-inline-block font-12">
                                            <SVG className="mr-1" src={toAbsoluteUrl("/media/svg/icons/project-svg/phone.svg")} width="7px" height="7px" />{bookingInfo.distributor_contact_no}
                                            </span>
                                        
                                    </div>
                                </div>
                                <div>
                                    <button className='btn sales-credit-btn' style={{ padding: "0px 15px", borderRadius: "13px" }}>
                                        <span className='text-white' style={{ fontSize: "0.83rem" }}>
                                        {intl.formatMessage({id: "DISTRIBUTOR.CREDIT_LIMIT"})}<br />
                                            {creditLimit !== null ? Number(creditLimit).toLocaleString('en-US', {minimumFractionDigits: 2}) : 0.00}
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        {/* STEPPER ROW */}
                        <div className='sales-booking-view-stepper row'>
                            <div className='col-xl-12'>
                                <Stepper activeStep={activeStep} alternativeLabel>
                                    {steps.map(label => (
                                        <Step key={label}>
                                            <StepLabel StepIconComponent={CustomStepIcon}>{label}</StepLabel>
                                        </Step>
                                    ))}
                                </Stepper>
                            </div>
                        </div>
                        <div className="mt-5">
                            <ul className="nav nav-pills mb-3" id="pills-tab-order" role="tablist">
                                <li className="nav-item" role="presentation">
                                    <a className="nav-link active" id="pills-order-summary-tab" data-toggle="pill" 
                                        href="#pills-order-summary" role="tab" aria-controls="pills-order-summary" 
                                        aria-selected="true">{intl.formatMessage({id: "SALES_BOOKING.BOOKING_SUMMARY"})}</a>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <a className="nav-link" id="pills-activities-reports-tab" data-toggle="pill" 
                                        href="#pills-activities-reports" role="tab" aria-controls="pills-activities-reports" 
                                        aria-selected="false">{intl.formatMessage({id: "COMMON.ACTIVITIES_AND_REPORTS"})}</a>
                                </li>
                            </ul>
                            <div className="tab-content" id="pills-tab-orderContent">
                                 {/* ORDER SUMMARY */}
                                <div className="tab-pane fade show active" id="pills-order-summary" role="tabpanel" aria-labelledby="pills-order-summary-tab">
                                    <div className='row order-table'>
                                        <div className='col-xl-4'>
                                            <BookingInformation bookingInfo={bookingInfo}/>
                                        </div>
                                        <div className='col-xl-8 mt-5'>
                                            <Card style={{borderRadius:"25px"}}>
                                                <CardBody>
                                                    <BookingOrderList bookingDetails={salesBookingDetails}/>
                                                </CardBody>
                                            </Card>
                                        </div>
                                    </div>
                                </div>

                                 {/* ACTIVITIES AND REPORTS */}
                                <div className="tab-pane fade" id="pills-activities-reports" role="tabpanel" aria-labelledby="pills-activities-reports-tab">
                                    <div className='order-table row p-5'>
                                        <div className='col-xl-6'>
                                            <BookingActivies bookingActivityInfo={bookingInfo}/>
                                        </div>
                                        <div className='col-xl-6'>
                                            <div>
                                                <div className='mt-3'>
                                                    <p className='report-title'>Reports</p>
                                                </div>
                                                <Card className="booking-reports-card">
                                                    <CardBody>
                                                        <div>
                                                            <p className='report-sales-booking-title'>
                                                                Sales Booking
                                                            </p>
                                                        </div>

                                                        <div className='report-booking-bg row'>
                                                            <div className='col-xl-6 mt-3'>
                                                                <span className='report-booking-title'>Booking No. {bookingInfo.booking_no}</span>
                                                            </div>
                                                            <div className='col-xl-6 d-flex justify-content-end'>
                                                                <button className='btn'><SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/share.svg")} width="15px" height="15px" /></button>
                                                                <button className='btn'><SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/view.svg")} width="15px" height="15px" /></button>
                                                                <button className='btn'><SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/download.svg")} width="15px" height="15px" /></button>
                                                            </div>
                                                        </div>
                                                    </CardBody>
                                                </Card>
                                            </div>
                                        </div>
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