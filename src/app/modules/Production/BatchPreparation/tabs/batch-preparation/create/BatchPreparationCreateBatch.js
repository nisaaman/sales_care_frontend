import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import { Card, CardBody } from "../../../../../../../_metronic/_partials/controls";
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { NavLink, useHistory, useLocation } from 'react-router-dom';
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../../../_metronic/_helpers";
import BatchPreparationBreadCrum from "../../../common/BatchPreparationBreadCrum";
import { now } from 'lodash';
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_green.css";
import moment from 'moment';
import { Today } from '@material-ui/icons';
import { showError, showSuccess } from '../../../../../../pages/Alert';
import { shallowEqual, useSelector } from 'react-redux';
import axios from 'axios';
import { allowOnlyNumeric, handlePasteDisable } from '../../../../../Util';
import { event } from 'jquery';
const useStyles = makeStyles(theme => ({
    root: {
        width: '90%',
    },
    button: {
        marginTop: theme.spacing(1),
        marginRight: theme.spacing(1),
    },
    actionsContainer: {
        marginBottom: theme.spacing(2),
    },
    resetContainer: {
        padding: theme.spacing(3),
    },
}));

const getSteps = () => {
    return ['Product Info', 'Completed'];
}

export default function BatchPreparationCreateBatch(props) {

    const today = new Date();
    const location = useLocation();
    const product = location.state.state;
    const batchId = location.state.batchId;
    const classes = useStyles();
    const companyId = useSelector((state) => state.auth.company, shallowEqual);
    const userLoginId = useSelector((state) => state.auth.user.userId, shallowEqual);
    const [successImg, setSuccessImg] = useState(toAbsoluteUrl("/images/success2.png"));
    const [activeStep, setActiveStep] = useState(0);
    const [expiryDate, setExpiryDate] = useState(moment(new Date(today.setDate(today.getDate() + product.productExpiryDays)), "YYYY-MM-DD").format("YYYY-MM-DD"));
    const [currentDate, setCurrentDate] = useState(moment(new Date()).format("YYYY-MM-DD"));
    const [productionDate, setProductionDate] = useState(currentDate);
    const [creationDate, setCreationDate] = useState(currentDate);
    const [consignmentNo, setConsignmentNo] = useState('');
    const [batchQuantity, setBatchQuantity] = useState('');
    const [remarks, setRemarks] = useState('');    
    const [batch, setBatch] = useState({
        id: batchId,
        productionDate: productionDate, 
        consignmentNo: consignmentNo, 
        remarks: remarks,
        companyId: companyId });
    const [batchDetails, setBatchDetails] = useState({ productId: product.id, 
        supervisorId: userLoginId, 
        companyId: companyId, 
        expiryDate: expiryDate });        

    const [responseData, setResponseData] = useState('');
    const steps = getSteps();
    const subsTitle = ["Insert Product Info", "Woah, we are here"];

    useEffect(() => {
        document.getElementById('create-batch-dot').classList.remove('d-none');
        document.getElementById('create-batch-dot').classList.add('d-inline');
        document.getElementById('create-batch').classList.remove('d-none');
        document.getElementById('create-batch').classList.add('d-inline');
        if (activeStep === 0) {
            document.getElementById('backBtn').style.visibility = 'hidden';
        }
        getBatchInfo(batchId);
    }, []);

    const handleNext = () => {
        if (activeStep === 0) {
            const consignmentNo = document.getElementById('consignmentNo').value;
            const batchQuantity = document.getElementById('batchQuantity').value;
            const remarks = document.getElementById('remarks').value;
            setRemarks(remarks);
            setConsignmentNo(consignmentNo);
            setBatchQuantity(batchQuantity);

            if (consignmentNo === "") {
                showError("Material Consignment No. is Required");
                return false;
            }
            if (batchQuantity === "") {
                showError("Batch Quantity is Required");
                return false;
            }
            if ((batch.productionDate  < productionDate) && (remarks === null || remarks === '')) {
                showError("Remarks required when production date less than batch creation date");
                return false;
            }

            saveBatch(consignmentNo, batchQuantity, remarks);

            // document.getElementById('nextBtn').style.visibility = 'hidden';
            // document.getElementById('backBtn').style.display = 'none';
            // document.getElementById('gotItBtn').style.visibility = 'hidden';
        }

        if (activeStep >= 0) {
            document.getElementById('backBtn').style.visibility = 'none';
        }
        //setActiveStep(prevActiveStep => prevActiveStep + 1);
    }

    const handleBack = () => {
        if (activeStep === 1) {
            document.getElementById('backBtn').style.visibility = 'hidden';
        }
        setActiveStep(prevActiveStep => prevActiveStep - 1);
    }

    const backToListPage = () => {
        props.history.push("/production/production-batch-preparation/production-batch-preparation-product");
    }

    const handleQRCodePage = (data) => {
        props.history.push("/production/production-batch-preparation/production-batch-preparation-product-qr", { state: data });
    }

    const saveBatch = (consignmentNo, batchQuantity, remarks) => {
        const URL = `${process.env.REACT_APP_API_URL}/api/batch`;
        axios.post(URL, JSON.stringify({
            ...batch, consignmentNo: consignmentNo, batchQuantity: batchQuantity, remarks: remarks,
            batchDetailsDto: batchDetails
        }), { headers: { "Content-Type": "application/json" } }).then(response => {

            if (response.data.success === true) {
                setResponseData(response.data.data);
                setActiveStep(prevActiveStep => prevActiveStep + 1);
                document.getElementById('nextBtn').style.visibility = 'hidden';
                document.getElementById('gotItBtn').style.visibility = 'hidden';
            } else {
                showError(response.data.message);
            }
        }).catch(err => {
            showError("Cannot be Submitted");
        });
    }

    const getBatchInfo = (batchId) => {
        const URL = `${process.env.REACT_APP_API_URL}/api/batch/product-and-batch-wise-batch-info/${product.id}/${batchId}`;
        if (batchId) {
            axios.get(URL).then(response => {
                setBatchQuantity(response.data.data.batchQuantity);
                setConsignmentNo(response.data.data.consignmentNo);
                setRemarks(response.data.data.remarks);
                setProductionDate(response.data.data.productionDate);
                setExpiryDate(response.data.data.expiryDate);
                setCreationDate(response.data.data.createdDate);
            }).catch();
        }        
    }

    // const checkProductBatchAvailability = (productId) => {
    //     const URL = `${process.env.REACT_APP_API_URL}/api/batch/availability-check/${productId}`;
    //     axios.get(URL).then(response => {
    //         if(response.data.success === true) {
    //             showSuccess("Batch has already crested...");
    //             document.getElementById('nextBtn').style.visibility = 'hidden';
    //         }
    //     }).catch(err => {
    //     });
    // }

    const handleBatchQuantity = event => {
        if (parseInt(event.target.value) === 0) {
            document.getElementById('batchQuantity').value = '';
            showError("Invalid Batch Quantity...");
            return false;
        }
        else 
            setBatchQuantity(event.target.value);
    }    

    const getStepContent = (step) => {
        switch (step) {
            case 0:
                return <div className='steper-height ml-5'>
                    <div>
                        <span className="create-field-title">Production Info</span>
                        <p style={{ color: "#B6B6B6" }}>If you need more info, please check out <NavLink to="/production/batch-preparation/batch-preparation-list" className="faq-title"><u>FAQ Page</u></NavLink></p>
                    </div>

                    {/* CONSIGNMENT ROW */}
                    <div className='row mt-5'>
                        <div className='col-6'>
                            <label className='level-title'>Enter Material Consignment No.<span className='text-danger'>*</span></label>
                            <input placeholder='55E06X521' id="consignmentNo" required type="text" className='form-control' 
                            name="consignmentNo" maxLength={25} value={consignmentNo || ""}
                            onChange={(e) => setConsignmentNo(e.target.value)}/>
                        </div>
                        <div className='col-6'>
                            <label className='level-title'>Batch Quantity.<span className='text-danger'>*</span></label>
                            <input id="batchQuantity" required type="text" className='form-control'
                                onChange={handleBatchQuantity}
                                onKeyPress={(e) => allowOnlyNumeric(e)}
                                onPaste={handlePasteDisable}
                                name="batchQuantity" maxLength={9}
                                value={batchQuantity || ""}/>
                        </div>

                    </div>

                    <div className='row mt-5'>
                        {/* PRODUCTION DATE ROW */}
                        <div className='col-6'>
                            <label className='level-title'>Production Date <span className='text-danger'>*</span></label>
                            <Flatpickr className="form-control date" id="productionDate" name="productionDate"
                                value={moment(productionDate, "YYYY-MM-DD").format("DD-MMM-YYYY")}
                                options={{

                                    dateFormat: "d-M-Y"
                                }} required
                                onChange={(value) => {
                                    setBatch({ ...batch, productionDate: moment(new Date(value[0])).format("YYYY-MM-DD") });
                                    setExpiryDate(moment(new Date(value[0]).fp_incr(product.productExpiryDays)).format("YYYY-MM-DD"));
                                    setBatchDetails({ ...batchDetails, expiryDate: moment(new Date(value[0]).fp_incr(product.productExpiryDays)).format("YYYY-MM-DD") });
                                }}

                            />
                        </div>

                        {/* EXPIRE ROW */}
                        <div className='col-6'>
                            <label className='level-title'>Expire Date <span className='text-danger'>*</span></label>
                            <Flatpickr className="form-control date" id="expiryDate" name='expiryDate'
                                value={moment(expiryDate, "YYYY-MM-DD").format("DD-MMM-YYYY")} disabled
                                options={{

                                    dateFormat: "d-M-Y"
                                }} required


                            />
                        </div>
                    </div>
                    <div className='row mt-5'>
                        {/* PRODUCTION CREATE and remarks ROW */}
                        <div className='col-6'>
                            <label className='level-title'>Batch Creation Date <span className='text-danger'>*</span></label>
                            <Flatpickr className="form-control date" id="batchCreationDate" name="batchCreationDate"
                                value={moment(creationDate, "YYYY-MM-DD").format("DD-MMM-YYYY")} disabled
                                options={{
                                    dateFormat: "d-M-Y"
                                }}
                            />
                        </div>

                        {/* Remarks ROW */}
                        <div className='col-6'>
                            <label className='level-title'>Remarks(If any)</label>
                            <textarea placeholder='Write Here' id="remarks" type="text" className='form-control' 
                                name="remarks" row={5} maxLength={125} value={remarks || ""}
                                onChange={(e) => setRemarks(e.target.value)}/>
                        </div>
                    </div>
                </div>;

                return <div className='steper-height ml-5'>
                    <div>
                        <span className="create-field-title">Reason</span>
                        <p style={{ color: "#B6B6B6" }}>If you need more info, please check out <NavLink to="/salescollection/payment-adjustment/credit-debit-note/all-list" className="faq-title"><u>FAQ Page</u></NavLink></p>
                    </div>

                    {/* REASON ROW */}
                    <div className='mt-5'>
                        <label className='level-title'>Reason <span className='text-danger'>*</span></label>
                        <textarea placeholder='Write Here' id="reason" type="text" className='form-control' name="reason" row={5} />
                    </div>

                    {/* ATTACHMENT ROW */}
                    <div className='mt-5'>
                        <label className='level-title'>Attachment</label>
                        <div className='border-dash text-center'>
                            <input id="file" type="file" name="file" />
                        </div>
                    </div>

                    {/* REMARKs ROW */}
                    <div className='mt-5'>
                        <label className='level-title'>Remarks(If any)</label>
                        <textarea placeholder='Write Here' id="reason" type="text" className='form-control' name="reason" row={5} />
                    </div>
                </div>;
            default:
                return <div className='steper-height'>
                    <div className='mt-5' style={{ textAlign: "center" }}>
                        <img
                            src={successImg}
                            style={{ width: "84px", height: "84px", textAlign: "center" }} alt='Company Picture' />
                        <div className='mt-5'>
                            <p style={{ marginBottom: "0px" }} className="create-field-title">Thank You</p>
                            {batchId ? 
                                <span className='text-muted'>Batch Updated Successfully.</span>
                                :
                                <span className='text-muted'>New Batch Generated Successfully.</span>
                            }
                            
                        </div>
                    </div>
                    <div className='mt-5'>
                        <div className='thanks-sub-title'>
                        {batchId ? 
                            <strong style={{ fontSize: "17px" }}>Product Batch No.</strong>
                            :
                            <strong style={{ fontSize: "17px" }}>New Product Batch No.</strong>
                        }
                        </div>
                    </div>
                    <div className='mt-5'>
                        <div className='row'>
                            <div className='offset-xl-4 col-xl-4 text-center fiscal-year-thanks-div'>
                                <div>
                                    <span className="daysCount mr-3">{responseData}</span>
                                </div>
                                <div className='mt-2'>
                                    <div>
                                        <span className="text-muted"></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='text-center mt-5'>
                        <button onClick={backToListPage} className='product-list-back-btn mr-5'><i class="bi bi-chevron-left mt-2"></i> Back to Product List</button>
                        <button onClick={() => handleQRCodePage(product)} className='qr-generation-btn'>QR Generation</button>
                    </div>
                </div>;
        }
    }

    const handleBackToAllListPage = () => {
        props.history.push('/production/production-batch-preparation/production-batch-preparation-product');
    }
    return (
        <>
            {/* BREAD CRUM ROW */}
            <div>
                <BatchPreparationBreadCrum />
            </div>
            <div>
                <Card>
                    <CardBody>
                        {/* BACK AND TITLE ROW */}
                        <div className="row">
                            <div className="col-4">
                                <span>
                                    <button className='btn' onClick={handleBackToAllListPage}>
                                        <strong>
                                            <i className="bi bi-arrow-left-short sales-booking-view-icon"></i>
                                        </strong>
                                    </button>
                                </span>
                            </div>
                            <div className="col-4 text-center mt-3">
                                <strong>Product Batch Generation </strong>
                            </div>
                            <div className="col-4 text-xl-right text-muted mt-3">
                                <strong></strong>
                            </div>
                        </div>

                        {/* HEADER ROW */}
                        <div className='row mt-5'>
                            <div className='col-xl-8'>
                                <div className="row">
                                    <div className="col-3">
                                        <span className="dark-gray-color"
                                            style={{ fontWeight: "500" }}>SKU</span><br />
                                        <span><strong>{product.productSku}</strong></span>
                                    </div>
                                    <div className="col-3">
                                        <span className="dark-gray-color"
                                            style={{ fontWeight: "500" }}>Outer Pack Size</span><br />
                                        <span><strong>{product.packSize}</strong></span>
                                    </div>
                                    <div className="col-3">
                                        <span className="dark-gray-color"
                                            style={{ fontWeight: "500" }}>Minimum Stock</span><br />
                                        <span><strong>{product.minimumStock}</strong></span>
                                    </div>
                                    <div className="col-3">
                                        <span className="dark-gray-color"
                                            style={{ fontWeight: "500" }}>Category</span><br />
                                        <span><strong>{product.productCategory}</strong></span>
                                    </div>
                                </div>
                            </div>
                            <div className='col-xl-4 d-flex justify-content-end'>
                                <div className="d-flex  mr-5">
                                    {/**<div>
                                        <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/Lays.svg")} width="35px" height="35px" />
                                    </div> */}
                                    <div className="ml-3">
                                        <span>
                                            <span style={{ fontWeight: "500" }}><strong>{product.productName}</strong></span>
                                            <p><SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/dark-gray-um.svg")} width="14px" height="14px" />&nbsp;</p>
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <button className='btn sales-credit-btn' style={{ padding: "0px 15px", borderRadius: "13px" }}>
                                        <span className='text-white' style={{ fontSize: "0.83rem" }}>
                                            Expiry Days<br />
                                            {product.productExpiryDays}
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>

                    </CardBody>
                </Card>
            </div>
            <Card>
                <CardBody>
                    <div className="row">
                        <div className="col-sm-12 col-xl-3  col-lg-3 col-md-3border border-left-0 border border-light border-primary border-bottom-0 border-top-0">
                            <div className={classes.root}>
                                <Stepper activeStep={activeStep} orientation="vertical">
                                    {steps.map((label, index) => (
                                        <Step key={label}>
                                            <StepLabel optional={<Typography variant="caption">{subsTitle[index]}</Typography>}>{label}</StepLabel>
                                        </Step>
                                    ))
                                    }
                                </Stepper>
                            </div>
                        </div>
                        <div className="col-sm-12 col-xl-9 col-lg-9 col-md-9">
                            <Typography>{getStepContent(activeStep)}</Typography>
                            <div className={classes.actionsContainer}>
                                <div className='mt-5'>
                                    <Button
                                        id="backBtn"
                                        onClick={handleBack}
                                        className={classes.button}
                                    >
                                        Back
                                    </Button>
                                    <Button
                                        id="nextBtn"
                                        disabled={activeStep === steps.length}
                                        variant="contained"
                                        color="primary"
                                        onClick={handleNext}
                                        className="float-right btn-gradient-blue"
                                    >
                                        {batchId ? 'Update' : 'Save'}
                                        {/* {activeStep === steps.length - 2 ? 'Save' : 'Next'} */}
                                    </Button>
                                    <div style={{ textAlign: 'center', marginTop: '45px', marginLeft: "50px" }}>
                                        <Button
                                            style={{ visibility: "hidden" }}
                                            className='gotIt-btn'
                                            id="gotItBtn"
                                            variant="contained"
                                            color="primary"
                                            onClick={backToListPage}
                                        >
                                            Got it
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardBody>
            </Card>
        </>
    );
}