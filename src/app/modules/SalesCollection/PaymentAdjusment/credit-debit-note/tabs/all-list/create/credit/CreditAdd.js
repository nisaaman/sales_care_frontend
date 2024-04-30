import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import { Card, CardBody } from "../../../../../../../../../_metronic/_partials/controls";
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { NavLink, useLocation } from 'react-router-dom';
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../../../../../_metronic/_helpers";
import PaymentAdjustmentBreadCrum from "../../../../../common/PaymentAdjustmentBreadCrum";
import axios from "axios";
import Flatpickr from "react-flatpickr";
import moment from "moment/moment";
import { showError } from '../../../../../../../../pages/Alert';
import _, { template } from "lodash";
import {handlePasteDisable, allowOnlyNumericWithPeriodAndRestrictDecimalTwo} from "../../../../../../../Util";

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
    return ['Initialize', 'Reason', 'Completed'];
}

export default function CreditAdd(props) {
    let routeLocation = useLocation();
    const classes = useStyles();
    const [successImg, setSuccessImg] = useState(toAbsoluteUrl("/images/success2.png"));
    const [activeStep, setActiveStep] = useState(0);
    const [distributorInfo, setDistributorInfo] = useState({});
    const [locationHierarchyListLowToHigh, setLocationHierarchyListLowToHigh] = useState([]);
    const [invoiceList, setInvoiceList] = useState([]);
    const [transactionTypeList, setTransactionTypeList] = useState([]);
    const steps = getSteps();
    const subsTitle = ["Credit Note Proposal Initialize", "Setup Your Account Settings", "Woah, we are here"];
    const [inputs, setInputs] = useState({});
    const [responseData, setResponseData] = useState({});
    const [distributorLogo, setDistributorLogo] = useState("");
    const [distributorImg, setDistributorImg] = useState(toAbsoluteUrl("/images/copmanylogo.png"));
    const [multipleFileName, setMultipleFileName] = useState([]);
    const [transactionType, setTransactionType] = useState('');
    const [modal, setModal] = useState(false);

    useEffect(() => {
        if (activeStep === 0) {
            document.getElementById('backBtn').style.display = 'none';
        }
        setDistributorInfo(routeLocation.state.state);
        getAllCreditDebitTransactionType();
        locationHierarchyListLowToHighList({
            companyId: routeLocation.state.state.selectedCompany,
            distributorId: routeLocation.state.state.distributor_id
        });
        getAllSalesInvoiceByCompanyAndDistributor({
            companyId: routeLocation.state.state.selectedCompany,
            distributorId: routeLocation.state.state.distributor_id
        });
        getDistributorLogo(routeLocation.state.state.distributor_id);

    }, []);

    useEffect(() => {
        if (activeStep === 0) {
            document.getElementById('nextBtn').style.visibility = 'visible';
            document.getElementById('backBtn').style.display = 'none';
            document.getElementById('gotItBtn').style.visibility = 'hidden';
        } else if (activeStep === 1) {
            document.getElementById('nextBtn').style.visibility = 'visible';
            document.getElementById('backBtn').style.display = 'inline';
            document.getElementById('gotItBtn').style.visibility = 'hidden';
        } else if (activeStep === 2) {
            document.getElementById('nextBtn').style.visibility = 'hidden';
            document.getElementById('backBtn').style.display = 'none';
            document.getElementById('gotItBtn').style.visibility = 'visible';
        }
    }, [activeStep]);

    const getDistributorLogo = (distributorId) => {
        const URL = `${process.env.REACT_APP_API_URL}/api/distributor/logo/${distributorId}`;
        axios.get(URL).then(response => {
            const logo = response.data;
            setDistributorLogo(logo);
        }).catch(err => {

        });
    }

    const locationHierarchyListLowToHighList = (params) => {
        const URL = `${process.env.REACT_APP_API_URL}/api/location/get-down-to-up-location-hierarchy/${params.companyId}/${params.distributorId}`;
        axios.get(URL).then(response => {
            const locationList = response.data.data.reverse();
            setLocationHierarchyListLowToHigh(locationList);
        }).catch(err => {

        });
    }

    const getAllSalesInvoiceByCompanyAndDistributor = (params) => {
        const URL = `${process.env.REACT_APP_API_URL}/api/sales-invoice/get-all/${params.companyId}/${params.distributorId}`;
        axios.get(URL).then(response => {
            setInvoiceList(response.data.data);
        }).catch(err => {

        });
    }

    const getAllCreditDebitTransactionType = (params) => {
        const URL = `${process.env.REACT_APP_API_URL}/api/constants/credit_debit_transaction_type`;
        axios.get(URL).then(response => {
            let removeType = 'ORD'; // it will use from ord settelment
            let ttList = response.data.data;
            ttList = ttList.filter(function (item) {
                return item.code !== removeType;
            })
            setTransactionTypeList(ttList);
        }).catch(err => {

        });
    }

    const handleNext = () => {
        if (activeStep === 0) {
            if (inputs.invoiceId === undefined || inputs.invoiceId === null || inputs.invoiceId === '') {
                showError("Invoice Field is required");
                return false;
            } else if (inputs.amount === undefined || inputs.amount === null || inputs.amount === '') {
                showError("Credit Amount Field is required");
                return false;
            } else if (isNaN(inputs.amount) || inputs.amount < 0) {
                showError("Credit Amount should be positive Number");
                return false;
            } else if (inputs.amount > inputs.invoiceAmount) {
                showError("Credit Amount cannot be greater than Invoice Amount");
                return false;
            } else if (inputs.transactionType === undefined || inputs.transactionType === null || inputs.transactionType === '') {
                showError("Transaction Type Field is required");
                return false;
            } else if (inputs.proposalDate === undefined || inputs.proposalDate === null || inputs.proposalDate === '') {
                showError("Proposal Date Field is required");
                return false;
            } else {
                setActiveStep(prevActiveStep => prevActiveStep + 1);
            }
        } else if (activeStep === 1) {
            if (inputs.reason === undefined || inputs.reason === null || inputs.reason.trim() === '') {
                showError("Reason Field is required");
                return false;
            } else { //save
                handleSave();
            }
        }
    }

    const handleBack = () => {
        setActiveStep(prevActiveStep => prevActiveStep - 1);
    }

    const handleChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;
        
        if (name === 'amount') {
            if((value).match(/^0/)) {
                document.getElementById('creditAmount').value="";
                return false;
            }
            if (value === '') {
                setInputs(values => ({ ...values, [name]: value }));
            } else if(Number(value) > 0){
                let v = value.split('.');
                if (v.length === 2 && v[1].length > 2) {
                    return;
                } else {
                    setInputs(values => ({ ...values, [name]: value }));
                }
            }
            
        } else if (name === 'invoiceId') {
            let selectedInvoiceInfo = invoiceList.find(i => i.id.toString() === value);
              setInputs(values => ({ ...values, [name]: value, proposalDate: "" }));
            if (_.isEmpty(selectedInvoiceInfo)) { // empty select
                setInputs(values => ({ ...values, [name]: value, invoiceAmount: 0 }));
                setInputs(values => ({ ...values, [name]: value, invoiceDate: "" }));
            } else {
                setInputs(values => ({ ...values, [name]: value, invoiceAmount: selectedInvoiceInfo.invoiceAmount,
                    isOpeningBalance: selectedInvoiceInfo.isOpeningBalance, invoiceDate: selectedInvoiceInfo.invoiceDate }));
            }
        } else if (name === 'transactionType') {
            setMultipleFileName([])
            const getId = document.getElementById("transactionType")
            const getName = getId.options[getId.selectedIndex].value;
            setInputs(values => ({ ...values, [name]: value }));
            setTransactionType(getName)
        } else {
            setInputs(values => ({ ...values, [name]: value }));
        }
    }

    const handleFileChange = (event) => {
        let files = event.target.files; // FileList object
        let temp = []
        for (let i = 0, file; file = files[i]; i++) {
            temp.push(file);
            setMultipleFileName(temp)
        }
    }

    const handleSave = () => {
        let data = inputs;
        data.noteType = 'CREDIT'
        data.distributorId = distributorInfo.distributor_id;
        data.companyId = distributorInfo.selectedCompany;

        let formData = new FormData();
        multipleFileName.forEach(file => {
            formData.append("creditDebitNoteFileList", file);
        })
        //formData.append("creditDebitNoteFile", fileData)
        formData.append("creditDebitNoteDto", new Blob([JSON.stringify(data)], { type: "application/json" }));

        const URL = `${process.env.REACT_APP_API_URL}/api/credit-debit-note`;
        axios.post(URL, formData, { headers: { "Content-Type": false } }).then(response => {
            if (response.data.success == true) {
                response.data.data.proposalDate = moment(response.data.data.proposalDate).format('DD-MMM-YYYY')
                setResponseData(response.data);
                setActiveStep(prevActiveStep => prevActiveStep + 1);
            } else {
                showError(response.data.message);
            }
        }).catch(err => {
            showError(err);
        });
    }

    const handlePreview = (file) => {
        let fileExtensionName = file.name.substring(file.name.lastIndexOf('.') + 1, file.name.length)
        if ((fileExtensionName.toLowerCase() === "pdf")||(fileExtensionName.toLowerCase() === "png")||(fileExtensionName.toLowerCase() === "jpeg")||(fileExtensionName.toLowerCase() === "jpg")||(fileExtensionName.toLowerCase() === "gif")) {
            viewPdf(file)
        } else {
            downloadExcel(file)
        }
    }

    const viewPdf = (file) => {
        let fileURL = URL.createObjectURL(file);
        let iframe = document.getElementById("viewer");
        if (iframe?.src) iframe.src = fileURL;
    }

    const downloadExcel = (file) => {
        let fileURL = URL.createObjectURL(file);
        let link = document.createElement('a');
            link.href = fileURL;
            link.setAttribute('download', file.name);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
    }
    
    const handleClosed = () => {
        setModal(false)
        document.getElementById("viewer").setAttribute("src", "");
    }

    const getStepContent = (step) => {
        switch (step) {
            case 0:
                return <div className='steper-height ml-5'>
                    <div>
                        <span className="create-field-title">Initialize</span>
                        <p style={{ color: "#B6B6B6" }}>If you need more info, please check out <NavLink
                            to="/salescollection/payment-adjustment/credit-debit-note/all-list"
                            className="faq-title"><u>FAQ Page</u></NavLink></p>
                    </div>

                    {/* CREDIT AMOUNT ROW */}
                    <div className='row mt-5'>
                        {/* DATE ROW */}
                        <div className='col-6'>
                            <label className='level-title'>Pick a Invoice <span className='text-danger'>*</span></label>
                            <select className="form-control" name="invoiceId"
                                value={inputs.invoiceId || ""}
                                onChange={handleChange}>
                                <option value="">Select Invoice</option>
                                {invoiceList.map((c) => (
                                    <option key={c.id} value={c.id}>{c.invoiceNo}</option>))}
                            </select>
                        </div>

                        {/* PICK A Transaction Type ROW */}
                        <div className='col-6'>
                            <label className='level-title'>Credit
                                Amount <span className='text-danger'>
                                    {inputs.invoiceAmount ? "(Max Amount " + inputs.invoiceAmount.toFixed(0) + ")" : ""}*</span></label>       
                            <input placeholder='Ex. 100' min="1" id="creditAmount" type="text"
                                className='form-control' step='.01'
                                name="amount" value={inputs.amount || ""} onChange={handleChange} 
                                onKeyPress={e => allowOnlyNumericWithPeriodAndRestrictDecimalTwo(e)} onPaste={handlePasteDisable}/>
                        </div>
                    </div>
                    <div className='row mt-5'>
                        <div className='col-6'>
                            <label className='level-title'>Pick a Transaction Type <span
                                className='text-danger'>*</span></label>
                            <select className="form-control" name="transactionType" id="transactionType"
                                value={inputs.transactionType || ""}
                                onChange={handleChange}>
                                <option value="">Select Transaction Type</option>
                                {transactionTypeList.map((c) => (
                                    <option key={c.code} value={c.code}>{c.name}</option>))}
                            </select>
                        </div>
                        {/* DATE ROW */}
                        <div className='col-6'>
                            <label className='level-title'>Proposal Date <span className='text-danger'>*</span></label>
                            <Flatpickr className="form-control date" placeholder="dd-MM-yyyy"
                                value={inputs.proposalDate ? moment(inputs.proposalDate, "YYYY-MM-DD").format("DD-MMM-YYYY") : ''}
                                options={{
                                    dateFormat: "d-M-Y",
                                    minDate: moment(inputs.invoiceDate, "YYYY-MM-DD").toDate()
                                    //minDate: moment(inputs.invoiceDate, "YYYY-MM-DD").add(1, 'days').toDate(), // Set minDate as the day after the provided date
                                }} required
                                onChange={(value) => {
                                    setInputs({
                                        ...inputs,
                                        proposalDate: moment(new Date(value)).format("YYYY-MM-DD")
                                    })
                                }}
                            />
                        </div>

                        {/* PICK A INVOICE ROW */}
                    </div>
                </div>;
            case 1:
                return <div className='steper-height ml-5'>
                    <div>
                        <span className="create-field-title">Reason</span>
                        <p style={{ color: "#B6B6B6" }}>If you need more info, please check out <NavLink
                            to="/salescollection/payment-adjustment/credit-debit-note/all-list"
                            className="faq-title"><u>FAQ Page</u></NavLink></p>
                    </div>

                    {/* REASON ROW */}
                    <div className='mt-5'>
                        <label className='level-title'>Reason <span className='text-danger'>*</span></label>
                        <textarea placeholder='Write Here' type="text" className='form-control'
                            name="reason" row={5} value={inputs.reason || ""}
                            onChange={handleChange} maxLength={150}/>
                    </div>

                    {/* ATTACHMENT ROW */}
                    {
                        transactionType === 'SALES_RETURN' ?
                            <div className='mt-5'>
                                <label className='level-title'>Attachment <b style={{ color: "green" }}>(•Invoice Copy
                                    • Customer Application
                                    • Farmer List
                                    • Damage Product’s Image
                                    • Management Visit Report )</b></label>
                                <div className='border-dash text-center'>
                                    <input id="file" style={{ color: "green" }} type="file" name="file" onChange={handleFileChange} multiple />
                                </div>
                                {
                                    multipleFileName.length ?
                                        multipleFileName.map(file =>
                                            <div className='mt-3'><span className='mr-5' style={{ color: "green" }}>{"File-name: " + file.name}</span>
                                                {
                                                    ((file.name.substring(file.name.lastIndexOf('.') + 1, file.name.length)).toLowerCase() === "pdf") ||
                                                    ((file.name.substring(file.name.lastIndexOf('.') + 1, file.name.length)).toLowerCase() === "gif") ||
                                                    ((file.name.substring(file.name.lastIndexOf('.') + 1, file.name.length)).toLowerCase() === "jpg") ||
                                                    ((file.name.substring(file.name.lastIndexOf('.') + 1, file.name.length)).toLowerCase() === "png") ||
                                                    ((file.name.substring(file.name.lastIndexOf('.') + 1, file.name.length)).toLowerCase() === "jpeg") ?
                                                        <a type="link" id="previewShow" data-toggle="modal" style={{ color: "red" }} data-target='#previewModal' onClick={() => handlePreview(file)}>
                                                            Preview</a> : <a type="link" style={{ color: "red" }} onClick={() => handlePreview(file)}>
                                                            Download</a>
                                                }

                                            </div>
                                        ) : ""
                                }

                                <div class="modal fade" id="previewModal" tabindex="-1" aria-labelledby="previewModalLabel" aria-hidden="true">
                                    <div class="modal-dialog modal-lg">
                                        <div class="modal-content">
                                            <div class="modal-body">
                                                <iframe src="" className='w-100' id="viewer" height="500" />
                                            </div>
                                            <div class="modal-footer">
                                                <button type="button" class="btn btn-secondary" data-dismiss="modal" onClick={handleClosed}>Close</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div> : 
                            <div className='mt-5'>
                            <label className='level-title'>Attachment</label>
                            <div className='border-dash text-center'>
                                <input id="file" style={{ color: "green" }} type="file" name="file" onChange={handleFileChange}  />
                            </div>
                            {
                                multipleFileName.length ?
                                    multipleFileName.map(file =>
                                        <div className='mt-3'><span className='mr-5' style={{ color: "green" }}>{"File-name: " + file.name}</span>
                                            {
                                                ((file.name.substring(file.name.lastIndexOf('.') + 1, file.name.length)).toLowerCase() === "pdf") ||
                                                ((file.name.substring(file.name.lastIndexOf('.') + 1, file.name.length)).toLowerCase() === "gif") ||
                                                ((file.name.substring(file.name.lastIndexOf('.') + 1, file.name.length)).toLowerCase() === "jpg") ||
                                                ((file.name.substring(file.name.lastIndexOf('.') + 1, file.name.length)).toLowerCase() === "png") ||
                                                ((file.name.substring(file.name.lastIndexOf('.') + 1, file.name.length)).toLowerCase() === "jpeg") ?
                                                    <a type="link" id="previewShow" data-toggle="modal" style={{ color: "red" }} data-target='#previewModal' onClick={() => handlePreview(file)}>
                                                        Preview</a> : <a type="link" style={{ color: "red" }} onClick={() => handlePreview(file)}>
                                                        Download</a>
                                            }

                                        </div>
                                    ) : ""
                            }

                            <div class="modal fade" id="previewModal" tabindex="-1" aria-labelledby="previewModalLabel" aria-hidden="true">
                                <div class="modal-dialog modal-lg">
                                    <div class="modal-content">
                                        <div class="modal-body">
                                            <iframe src="" className='w-100' id="viewer" height="500" />
                                        </div>
                                        <div class="modal-footer">
                                            <button type="button" class="btn btn-secondary" data-dismiss="modal" onClick={handleClosed}>Close</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div> 
                    }
                    {/* REMARKs ROW */}
                    <div className='mt-5'>
                        <label className='level-title'>Remarks(If any)</label>
                        <textarea placeholder='Write Here' id="note" type="text" className='form-control'
                            name="note" row={5} value={inputs.note || ""} maxLength={150}
                            onChange={handleChange} />
                    </div>
                </div>;
            default:
                return <div className='row steper-height'>
                    <div className='col-lg-12' style={{ textAlign: "center" }}>
                        <img
                            src={successImg}
                            style={{ width: "84px", height: "84px", textAlign: "center" }} alt='Company Picture' />
                        <div className='mt-5'>
                            <p style={{ marginBottom: "0px" }} className="create-field-title">Thank You</p>
                            <span className='text-muted'>Credit Note has been Created Successfully</span>
                        </div>
                    </div>
                    <div className='col-xl-12'>
                        <div className='thanks-sub-title'>
                            <strong style={{ fontSize: "17px" }}>New Credit Note Proposal Info</strong>
                        </div>
                    </div>
                    <div className='col-lg-12'>
                        <div className='row'>
                            <div className='offset-xl-4 col-xl-4 text-center fiscal-year-thanks-div'>
                                <div>
                                    <span className='fiscal-year-title'>Note No.: {responseData.data.noteNo}</span>
                                </div>
                                <div className="mt-1">
                                    <span
                                        className="daysCount mr-3">Amount: {Number(responseData.data.amount).toFixed(2)} </span>
                                </div>
                                <div className='mt-2'>
                                    <div>
                                        <span className="text-muted">Date: {responseData.data.proposalDate}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>;
        }
    }
    const backToListPage = () => {
        props.history.push("/salescollection/payment-adjustment/credit-debit-note/all-list");
    }
    const handleBackToAllListPage = () => {
        props.history.push('/salescollection/payment-adjustment/credit-debit-note/all-list');
    }
    return (
        <>
            {/* BREAD CRUM ROW */}
            <div>
                <PaymentAdjustmentBreadCrum />
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
                                <strong>Credit Note</strong>
                            </div>
                        </div>

                        {/* HEADER ROW */}
                        <div className='row mt-5'>
                            <div className='col-xl-8'>
                                <div className="row">
                                    {locationHierarchyListLowToHigh.map((location, index) => (
                                        <div key={index} className="col-3">
                                            <span className="dark-gray-color"
                                                style={{ fontWeight: "500" }}>{location.locationType.name}</span><br />
                                            <span><strong>{location.name}</strong></span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className='col-xl-4 d-flex justify-content-end'>
                                <div className="d-flex  mr-5">
                                    <div>
                                        <img className="image-input image-input-circle"
                                            src={distributorLogo === undefined || distributorLogo === "" || distributorLogo === null ? distributorImg : `data:image/png;base64,${distributorLogo}`}
                                            width="35px" height="35px" alt='Distributor’s Picture' />
                                    </div>
                                    <div className="ml-3">
                                        <span>
                                            <span
                                                style={{ fontWeight: "500" }}><strong>{distributorInfo.distributor_name}</strong></span>
                                            <p><SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/phone.svg")}
                                                width="14px" height="14px" />&nbsp;{distributorInfo.contact_no}</p>
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <button className='btn sales-credit-btn'
                                        style={{ padding: "0px 15px", borderRadius: "13px" }}>
                                        <span className='text-white' style={{ fontSize: "0.83rem" }}>
                                            Balance<br />
                                            {distributorInfo.ledger_balance}
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
                        <div
                            className="col-sm-12 col-xl-3  col-lg-3 col-md-3border border-left-0 border border-light border-primary border-bottom-0 border-top-0">
                            <div className={classes.root}>
                                <Stepper activeStep={activeStep} orientation="vertical">
                                    {steps.map((label, index) => (
                                        <Step key={label}>
                                            <StepLabel optional={<Typography
                                                variant="caption">{subsTitle[index]}</Typography>}>{label}</StepLabel>
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
                                        {activeStep === steps.length - 2 ? 'Complete' : 'Next'}
                                    </Button>
                                    <div style={{ textAlign: 'center', marginTop: '119px', marginLeft: "50px" }}>
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


