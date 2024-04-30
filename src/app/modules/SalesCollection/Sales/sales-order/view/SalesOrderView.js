import React, { useState, useEffect } from 'react';
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../../_metronic/_helpers";
import { useHistory, useLocation } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import { SalesOrderSummary } from './tabs/SalesOrderSummary';
import { SalesOrderSummayList } from './tabs/SalesOrderSummaryList';
import { SalesOrderActivies } from './tabs/SalesOrderActivities';
import clsx from 'clsx';
import NoteIcon from '@material-ui/icons/Note';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import SalesTabsHeader from "../../common/SalesTabsHeader";
import { BreadCrum } from "../../common/BreadCrum";
import {
   Card,
   CardBody,
} from "../../../../../../_metronic/_partials/controls";
import axios from 'axios';
import moment from 'moment';
import { dateFormatPattern } from '../../../../Util';

const useStyles = makeStyles(theme => ({
   root: {
      backgroundColor: 'white',
      boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.03)",
      padding: 8,
      borderRadius: '50%'
   },
}));


export default function SalesOrderView(props) {

   const location = useLocation();    
   const history = useHistory();
   const [salesOrderLifeCycle, setSalesOrderLifeCycle] = useState('');
   const [salesOrderDetails, setSalesOrderDetails] = useState([]);
   const [salesOrderSummary, setSalesOrderSummary] = useState('');
   const [distributorInfo, setDistributorInfo] = useState('');
   const [salesOrderNo, setSalesOrderNo] = useState();
   const [depot, setDepot] = useState();
 
   const [activeStep, setActiveStep] = React.useState(0);
   let booking = ""
   let approval = ""
   let order = ""
   let delivery = "active"
   let payment = "inactive"
   
   const handleOrderChange = () => {
      history.push("/salescollection/sales/sales-order")
   }

   const salesOrderData = location.state.state;

   useEffect(() => {
      document.getElementById('pills-sales-order-tab').classList.add('active')
      getSalesOrderDetails();
      
   },[]);

   const getSalesOrderDetails = () => {
     
      const URL = `${process.env.REACT_APP_API_URL}/api/sales-order-data/details-view/${salesOrderData.salesOrderId}`;
        axios.get(URL).then(response => {

            setSalesOrderLifeCycle(response.data.data.salesOrderLifeCycle);
            setSalesOrderDetails(response.data.data.salesOrderDetails);
            setSalesOrderSummary(response.data.data.salesOrderSummary);
            setDistributorInfo(response.data.data.distributorInfo);

            setSalesOrderNo(response.data.data.salesOrderSummary.orderNo);
            setDepot(response.data.data.salesOrderSummary.depotName);
        }).catch(err => {
            
        });
      
   }
   const CustomStepIcon = (props) => {
      const classes = useStyles();
      const stepIcons = {
         1: booking === "inactive" ? <NoteIcon width="15px" height="15px" style={{ color: "#828282" }} /> : booking === "active" ? <NoteIcon width="15px" height="15px" style={{ color: "blue" }} /> : <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/ok.svg")} width="15px" height="15px" />,
         2: approval === "inactive" ? <NoteIcon width="15px" height="15px" style={{ color: "#828282" }} /> : approval === "active" ? <NoteIcon width="15px" height="15px" style={{ color: "blue" }} /> : <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/ok.svg")} width="15px" height="15px" />,
         3: order === "inactive" ? <NoteIcon width="15px" height="15px" style={{ color: "#828282" }} /> : order === "active" ? <NoteIcon width="15px" height="15px" style={{ color: "blue" }} /> : <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/ok.svg")} width="15px" height="15px" />,
         4: delivery === "inactive" ? <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/delivery.svg")} width="15px" height="15px" /> : delivery === "active" ? <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/car.svg")} width="15px" height="15px" /> : <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/ok.svg")} width="15px" height="15px" />,
         // 5: payment == "inactive" ? <AttachMoneyIcon width="15px" height="15px" style={{ color: "#828282" }} /> : payment == "active" ? <AttachMoneyIcon width="15px" height="15px" style={{ color: "blue" }} /> : <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/ok.svg")} width="15px" height="15px" />,
      };

      return (
         <div className={clsx(classes.root)}>
            {stepIcons[String(props.icon)]}
         </div>
      );
   };

   const salesBooking = <div className='text-center' style={{ fontSize: "0.83rem" }}>
      <span style={{ color: "#828282" }}>Sales Booking</span><br />
      <span className='text-muted'>Applied On</span>&nbsp;<strong>{moment(salesOrderLifeCycle.salesBookingAppliedDate).format(dateFormatPattern())}</strong><br />
      <span style={{ color: "#828282" }}>Payment</span>&nbsp;<strong>{salesOrderLifeCycle.paymentMethod}</strong>
   </div>;

   const salesBookingApproval = <div className='text-center' style={{ fontSize: "0.83rem" }}>
      <span style={{ color: "#828282" }}>Sales Booking Approval</span><br />
      <span className='text-muted'>Applied On</span>&nbsp;<strong>{moment(salesOrderLifeCycle.approvalDate).format(dateFormatPattern())}</strong><br />
   </div>;

   const salesOrder = <div className='text-center' style={{ fontSize: "0.83rem" }}>
      <span style={{ color: "#828282" }}>Sales Order</span><br />
      <span className='text-muted'>Status</span>&nbsp;<strong style={{ color: "#27AE60" }}>Done</strong><br />
   </div>;

   const salesDelivery = <div className='text-center' style={{ fontSize: "0.83rem" }}>
      <span style={{ color: "#828282" }}>Delivery</span><br />
      <span className='text-muted'>Sales Delivery Chalan</span>&nbsp;<strong style={{ color: "#0396FF" }}>{salesOrderLifeCycle.deliveryStatus}</strong><br />
      <span className='text-muted'>Sales Invoice</span>&nbsp;<strong style={{ color: "#0396FF" }}>{salesOrderLifeCycle.invoiceStatus}</strong><br />
      <span className='text-muted'>Invoice Acknowledgement</span>&nbsp;<strong style={{ color: "#0396FF" }}>{salesOrderLifeCycle.invoiceAcknowledgementStatus}</strong><br />
      {/* <span className='text-muted'>Status</span>&nbsp;<strong>Pending(20 April 2022)</strong><br /> */}
   </div>;

   const salesPayment = <div className='text-center' style={{ fontSize: "0.83rem" }}>
      {/* <span style={{ color: "#828282" }}>Payment Collection</span><br />
      <span className='text-muted'>Payment Adjustment</span>&nbsp;<strong>Pending</strong><br /> */}
   </div>;

   const getSteps = () => {
      return [salesBooking, salesBookingApproval, salesOrder, salesDelivery, salesPayment];
   }
   const steps = getSteps();

   return (
      <>
        <div>
                {/* BREAD CRUM ROW */}
                <BreadCrum />
                {/* TODAY SALE ROW */}
                <SalesTabsHeader />
            </div>
         <div>
            <Card>
               <CardBody>
                  {/* HEADER ROW */}
                  <div className='row'>
                     <div className='col-xl-8 row'>
                        <span className=" mr-5">
                           <button className='btn' onClick={handleOrderChange}
                           >
                              <strong>
                                 <i class="bi bi-arrow-left-short sales-booking-view-icon"></i></strong>
                           </button>
                        </span>
                        <span className="sales-booking-view-span mr-5">
                           <span className="dark-gray-color"
                              style={{ fontWeight: "500" }}>Order No.</span>
                           <p><strong>{salesOrderNo}</strong></p>
                        </span>
                        <span className="sales-booking-view-span  mr-5">
                           <span className="dark-gray-color"
                              style={{ fontWeight: "500" }}>Depot</span>
                           <p><strong>{depot}</strong></p>
                        </span>
                        {/* <span className="sales-booking-view-span mr-5">
                           <span className="dark-gray-color"
                              style={{ fontWeight: "500" }}>Teritory</span>
                           <p><strong>{distributorInfo.distributorLocation}</strong></p>
                        </span> */}
                     </div>
                     <div className='col-xl-4 d-flex justify-content-end'>
                        <div className="d-flex  mr-5">
                           <div>
                              <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/Avatar.svg")} width="35px" height="35px" />
                           </div>
                           <div className="ml-3">
                              <span>
                                 <span style={{ fontWeight: "500" }}><strong>{distributorInfo.distributorName}</strong></span>
                                 <p><SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/phone.svg")} width="14px" height="14px" />&nbsp;{distributorInfo.distributorContactNo}</p>
                              </span>
                           </div>
                        </div>
                        <div>
                           <button className='btn sales-credit-btn' style={{ padding: "0px 15px", borderRadius: "13px" }}>
                              <span className='text-white' style={{ fontSize: "0.83rem" }}>
                                 Balance<br />
                                 {Number(distributorInfo.ledgerBalance).toLocaleString('en-US', {minimumFractionDigits: 2})}
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
                                 <StepLabel
                                    StepIconComponent={CustomStepIcon}
                                 >{label}</StepLabel>
                              </Step>
                           ))}
                        </Stepper>
                     </div>
                  </div>
                  {/* ORDER SUMMARY */}
                  <div className="mt-5">
                     <ul class="nav nav-pills mb-3" id="pills-tab-order" role="tablist">
                        <li class="nav-item" role="presentation">
                           <a class="nav-link active" id="pills-order-summary-tab" data-toggle="pill" href="#pills-order-summary" role="tab" aria-controls="pills-order-summary" aria-selected="true">Order Summary</a>
                        </li>
                        <li class="nav-item" role="presentation">
                           <a class="nav-link" id="pills-activities-reports-tab" data-toggle="pill" href="#pills-activities-reports" role="tab" aria-controls="pills-activities-reports" aria-selected="false">Activities & Reports</a>
                        </li>
                     </ul>
                     <div class="tab-content" id="pills-tab-orderContent">
                        <div class="tab-pane fade show active" id="pills-order-summary" role="tabpanel" aria-labelledby="pills-order-summary-tab">
                           <div className='row order-table'>
                              <div className='col-xl-4'>
                                 <SalesOrderSummary salesOrderSummary = {salesOrderSummary}/>
                              </div>
                              <div className='col-xl-8 mt-1'>
                                 <Card style={{ borderRadius: "25px" }}>
                                    <CardBody>
                                       <SalesOrderSummayList salesOrderDetails = {salesOrderDetails}/>
                                    </CardBody>
                                 </Card>
                              </div>
                           </div>
                        </div>
                        <div class="tab-pane fade" id="pills-activities-reports" role="tabpanel" aria-labelledby="pills-activities-reports-tab">
                           <div className='order-table row p-5'>
                              <div className='col-xl-6'>
                                 <SalesOrderActivies />
                              </div>
                              <div className='col-xl-6'>
                                 <div>
                                    <div className='mt-3'>
                                       <p className='report-title'>Reports</p>
                                    </div>
                                    <Card className="reports-card-delivery">
                                       <CardBody>
                                          <div>
                                             <p className='report-sales-booking-title'>
                                                Delivery 4
                                             </p>
                                          </div>

                                          <div className='report-booking-bg row'>
                                             <div className='col-xl-6 mt-3'>
                                                <span className='report-booking-title'>Chalan FF124568</span>
                                             </div>
                                             <div className='col-xl-6 d-flex justify-content-end'>
                                                <button className='btn'><SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/share.svg")} width="15px" height="15px" /></button>
                                                <button className='btn'><SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/view.svg")} width="15px" height="15px" /></button>
                                                <button className='btn'><SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/download.svg")} width="15px" height="15px" /></button>
                                             </div>
                                          </div>
                                          <div className='report-booking-bg row mt-2'>
                                             <div className='col-xl-6 mt-3'>
                                                <span className='report-booking-title'>Inoice FF124568</span>
                                             </div>
                                             <div className='col-xl-6 d-flex justify-content-end'>
                                                <button className='btn'><SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/share.svg")} width="15px" height="15px" /></button>
                                                <button className='btn'><SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/view.svg")} width="15px" height="15px" /></button>
                                                <button className='btn'><SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/download.svg")} width="15px" height="15px" /></button>
                                             </div>
                                          </div>
                                          <div className='report-booking-bg row mt-2'>
                                             <div className='col-xl-8 mt-3'>
                                                <span className='report-booking-title'>Inoice FF124568 Aknowledgement</span>
                                             </div>
                                             <div className='col-xl-4 d-flex justify-content-end'>
                                                <button className='btn'><SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/share.svg")} width="15px" height="15px" /></button>
                                                <button className='btn'><SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/view.svg")} width="15px" height="15px" /></button>
                                                <button className='btn'><SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/download.svg")} width="15px" height="15px" /></button>
                                             </div>
                                          </div>
                                       </CardBody>
                                    </Card>

                                    <Card className="reports-card-delivery">
                                       <CardBody>
                                          <div>
                                             <p className='report-sales-booking-title'>
                                                Delivery 3
                                             </p>
                                          </div>

                                          <div className='report-booking-bg row'>
                                             <div className='col-xl-6 mt-3'>
                                                <span className='report-booking-title'>Chalan FF124568</span>
                                             </div>
                                             <div className='col-xl-6 d-flex justify-content-end'>
                                                <button className='btn'><SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/share.svg")} width="15px" height="15px" /></button>
                                                <button className='btn'><SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/view.svg")} width="15px" height="15px" /></button>
                                                <button className='btn'><SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/download.svg")} width="15px" height="15px" /></button>
                                             </div>
                                          </div>
                                          <div className='report-booking-bg row mt-2'>
                                             <div className='col-xl-6 mt-3'>
                                                <span className='report-booking-title'>Inoice FF124568</span>
                                             </div>
                                             <div className='col-xl-6 d-flex justify-content-end'>
                                                <button className='btn'><SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/share.svg")} width="15px" height="15px" /></button>
                                                <button className='btn'><SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/view.svg")} width="15px" height="15px" /></button>
                                                <button className='btn'><SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/download.svg")} width="15px" height="15px" /></button>
                                             </div>
                                          </div>
                                          <div className='report-booking-bg row mt-2'>
                                             <div className='col-xl-8 mt-3'>
                                                <span className='report-booking-title'>Inoice FF124568 Aknowledgement</span>
                                             </div>
                                             <div className='col-xl-4 d-flex justify-content-end'>
                                                <button className='btn'><SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/share.svg")} width="15px" height="15px" /></button>
                                                <button className='btn'><SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/view.svg")} width="15px" height="15px" /></button>
                                                <button className='btn'><SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/download.svg")} width="15px" height="15px" /></button>
                                             </div>
                                          </div>
                                       </CardBody>
                                    </Card>
                                    <Card className="reports-card-delivery">
                                       <CardBody>
                                          <div>
                                             <p className='report-sales-booking-title'>
                                                Delivery 2
                                             </p>
                                          </div>

                                          <div className='report-booking-bg row'>
                                             <div className='col-xl-6 mt-3'>
                                                <span className='report-booking-title'>Chalan FF124568</span>
                                             </div>
                                             <div className='col-xl-6 d-flex justify-content-end'>
                                                <button className='btn'><SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/share.svg")} width="15px" height="15px" /></button>
                                                <button className='btn'><SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/view.svg")} width="15px" height="15px" /></button>
                                                <button className='btn'><SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/download.svg")} width="15px" height="15px" /></button>
                                             </div>
                                          </div>
                                          <div className='report-booking-bg row mt-2'>
                                             <div className='col-xl-6 mt-3'>
                                                <span className='report-booking-title'>Inoice FF124568</span>
                                             </div>
                                             <div className='col-xl-6 d-flex justify-content-end'>
                                                <button className='btn'><SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/share.svg")} width="15px" height="15px" /></button>
                                                <button className='btn'><SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/view.svg")} width="15px" height="15px" /></button>
                                                <button className='btn'><SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/download.svg")} width="15px" height="15px" /></button>
                                             </div>
                                          </div>
                                          <div className='report-booking-bg row mt-2'>
                                             <div className='col-xl-8 mt-3'>
                                                <span className='report-booking-title'>Inoice FF124568 Aknowledgement</span>
                                             </div>
                                             <div className='col-xl-4 d-flex justify-content-end'>
                                                <button className='btn'><SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/share.svg")} width="15px" height="15px" /></button>
                                                <button className='btn'><SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/view.svg")} width="15px" height="15px" /></button>
                                                <button className='btn'><SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/download.svg")} width="15px" height="15px" /></button>
                                             </div>
                                          </div>
                                       </CardBody>
                                    </Card>
                                    <Card className="reports-card-delivery">
                                       <CardBody>
                                          <div>
                                             <p className='report-sales-booking-title'>
                                                Delivery 1
                                             </p>
                                          </div>

                                          <div className='report-booking-bg row'>
                                             <div className='col-xl-6 mt-3'>
                                                <span className='report-booking-title'>Chalan FF124568</span>
                                             </div>
                                             <div className='col-xl-6 d-flex justify-content-end'>
                                                <button className='btn'><SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/share.svg")} width="15px" height="15px" /></button>
                                                <button className='btn'><SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/view.svg")} width="15px" height="15px" /></button>
                                                <button className='btn'><SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/download.svg")} width="15px" height="15px" /></button>
                                             </div>
                                          </div>
                                          <div className='report-booking-bg row mt-2'>
                                             <div className='col-xl-6 mt-3'>
                                                <span className='report-booking-title'>Inoice FF124568</span>
                                             </div>
                                             <div className='col-xl-6 d-flex justify-content-end'>
                                                <button className='btn'><SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/share.svg")} width="15px" height="15px" /></button>
                                                <button className='btn'><SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/view.svg")} width="15px" height="15px" /></button>
                                                <button className='btn'><SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/download.svg")} width="15px" height="15px" /></button>
                                             </div>
                                          </div>
                                          <div className='report-booking-bg row mt-2'>
                                             <div className='col-xl-8 mt-3'>
                                                <span className='report-booking-title'>Inoice FF124568 Aknowledgement</span>
                                             </div>
                                             <div className='col-xl-4 d-flex justify-content-end'>
                                                <button className='btn'><SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/share.svg")} width="15px" height="15px" /></button>
                                                <button className='btn'><SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/view.svg")} width="15px" height="15px" /></button>
                                                <button className='btn'><SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/download.svg")} width="15px" height="15px" /></button>
                                             </div>
                                          </div>
                                       </CardBody>
                                    </Card>
                                    <Card className="reports-card-order">
                                       <CardBody>
                                          <div>
                                             <p className='report-sales-booking-title'>
                                                Sales Order
                                             </p>
                                          </div>

                                          <div className='report-booking-bg row'>
                                             <div className='col-xl-6 mt-3'>
                                                <span className='report-booking-title'>Order No. FF124568</span>
                                             </div>
                                             <div className='col-xl-6 d-flex justify-content-end'>
                                                <button className='btn'><SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/share.svg")} width="15px" height="15px" /></button>
                                                <button className='btn'><SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/view.svg")} width="15px" height="15px" /></button>
                                                <button className='btn'><SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/download.svg")} width="15px" height="15px" /></button>
                                             </div>
                                          </div>
                                       </CardBody>
                                    </Card>
                                    <Card className="booking-reports-card">
                                       <CardBody>
                                          <div>
                                             <p className='report-sales-booking-title'>
                                                Sales Booking
                                             </p>
                                          </div>

                                          <div className='report-booking-bg row'>
                                             <div className='col-xl-6 mt-3'>
                                                <span className='report-booking-title'>Booking No. FF124568</span>
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