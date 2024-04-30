import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import { Card, CardBody } from "../../../../../../../_metronic/_partials/controls";
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { NavLink } from 'react-router-dom';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import IOSSwitch from '../../../../../../pages/IOSSwitch';
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../../../_metronic/_helpers";
import PaymentBookSetupBreadCrum from "../../common/PaymentBookSetupBreadCrum";
import axios from "axios";
import { showSuccess, showError } from '../../../../../../pages/Alert';
import moment from 'moment';
import { allowOnlyNumeric } from '../../../../../Util';
import Flatpickr from "react-flatpickr";
import { id } from 'date-fns/locale';

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
    return ['Location', 'Payment Book', 'Completed'];
}

export function PaymentBookAdd(props) {

    const [allCompany, setAllCompany] = useState([]);
    const [allLocation, setAllLocation] = useState([]);
    const classes = useStyles();
    const [successImg, setSuccessImg] = useState(toAbsoluteUrl("/images/success2.png"));
    const [activeStep, setActiveStep] = useState(0);
    const steps = getSteps();
    const subsTitle = ["Insert company info", "Insert book info", "Woah, we are here"];
    const [ordCount, setORDCount] = useState(["Day 1 - 30 ORD 15%", "Day 31 - 60 ORD 10%", "Day 61 - 90 ORD 5%"])
    const [totalDays, setTotalDays] = useState(0)
    const [preIndex, setPreIndex] = useState(0)
    const [paymentBookId, setPaymentBookId] = useState("");

    const [inputs, setInputs] = useState({
        companyId: "",
        paymentBookLocationId: "",
        bookNumber: "",
        fromMrNo: "",
        toMrNo: "",
        issueDate: "",
        status: false,

    });
    const [bookNumber, setBookNumber] = useState("")
    const [toMrNo, setToMrNo] = useState("");
    const [fromMrNo, setFromMrNo] = useState("");
    const [issueDate, setIssueDate] = useState("");
    const [message, setMessage] = useState("");
    const [active, setActive] = useState(" ");

    useEffect(() => {
        if (activeStep === 0) {
            document.getElementById('backBtn').style.display = 'none';
        }
        getAllCompanyByOrganization();
        if (props.location.state != undefined) {
            let params = props.location.state.row;
            setPaymentBookId(params.id);
            //console.log("props.location.state.row=", props.location.state.row)
            getLastLocationByCompany(params.companyId);
            setInputs({
                id: params.id,
                companyId: params.companyId,
                paymentBookLocationId: params.locationId,
                bookNumber: params.bookNumber,
                fromMrNo: params.fromMrNo,
                toMrNo: params.toMrNo,
                issueDate: params.issueDate,
                status: params.status,

            });
            //openEditPage(props.location.state.row.id);
        }
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


    const getAllCompanyByOrganization = () => {
        const URL = `${process.env.REACT_APP_API_URL}/api/organization/get-all-company-by-organization`;
        axios.get(URL).then(response => {
            setAllCompany(response.data.data)
        });
    }
    const getLastLocationByCompany = (companyId) => {
        const URL = `${process.env.REACT_APP_API_URL}/api/location/get-last-location-by-company/` + companyId;
        if (companyId) {
            axios.get(URL).then(response => {
                setAllLocation([]);
                if (response.data.data) {
                    setAllLocation(response.data.data)
                }
            });
        }
    }

    const savePaymentBook = () => {
        //alert("hi")
        let obj = {};
        obj.companyId = inputs.companyId;
        obj.paymentBookLocationId = inputs.paymentBookLocationId;
        obj.bookNumber = inputs.bookNumber;
        obj.fromMrNo = inputs.fromMrNo;
        obj.toMrNo = inputs.toMrNo;
        obj.issueDate = inputs.issueDate;
        obj.status = inputs.status;
        //console.log(obj);
        const URL = `${process.env.REACT_APP_API_URL}/api/payment-book`;
        axios.post(URL, obj).then(response => {
            if (response.data.success === true) {
                setActiveStep(prevActiveStep => prevActiveStep + 1);
                setBookNumber(inputs.bookNumber);
                setToMrNo(inputs.toMrNo);
                setFromMrNo(inputs.fromMrNo);
                setIssueDate(inputs.issueDate);
                setActive(inputs.active);
                setMessage(response.data.message);

            } else {
                showError(response.data.message);
            }
        }).catch(err => {
            showError(err);
        });
    }

    const updatePaymentBook = () => {
        const URL = `${process.env.REACT_APP_API_URL}/api/payment-book`;
        axios.put(URL, JSON.stringify(inputs), { headers: { "Content-Type": "application/json" } }).then(response => {
            if (response.data.success === true) {
                setActiveStep(prevActiveStep => prevActiveStep + 1);
                setBookNumber(inputs.bookNumber);
                setToMrNo(inputs.toMrNo);
                setFromMrNo(inputs.fromMrNo);
                setIssueDate(inputs.issueDate);
                setActive(inputs.active);
                setMessage(response.data.message);

            } else {
                showError(response.data.message);
            }
        }).catch(err => {
            showError(err);
        });
    }

    const handleNext = () => {
        if (activeStep == 0) {

            if (inputs.companyId === undefined || inputs.companyId === null || inputs.companyId === '') {
                showError("Company is required.");
                return false;
            }
            else if (inputs.paymentBookLocationId === undefined || inputs.paymentBookLocationId === null || inputs.paymentBookLocationId === '') {
                showError("Location is required.");
                return false;
            } else {
                setActiveStep(prevActiveStep => prevActiveStep + 1);
            }
        } else if (activeStep === 1) {
            //console.log("date",inputs.issueDate)
            if (inputs.bookNumber === undefined || inputs.bookNumber === null || inputs.bookNumber === '') {
                showError("Payment Book Number is required");
                return false;
            }
            if (inputs.bookNumber.length > 10) {
                showError("Book Number can not greater than 10 charecter");
                return false;
            }
            if (inputs.fromMrNo === undefined || inputs.fromMrNo === null || inputs.fromMrNo === '') {
                showError("From MR No is required.");
                return false;
            }
            else if (inputs.toMrNo === undefined || inputs.toMrNo === null || inputs.toMrNo === '') {
                showError("To MR No is required.");
                return false;
            }
            else if (Number(inputs.toMrNo) <= Number(inputs.fromMrNo)) {

                showError("To MR No must be greater than From MR No");
                return false;
            }
            else if (inputs.issueDate === undefined || inputs.issueDate === null || inputs.issueDate === '' || inputs.issueDate === "Invalid date") {
                showError("Issue Date is required.");
                return false;
            }
            if (props.location.state !== undefined) {  // update
                updatePaymentBook();
            } else { //save
                savePaymentBook();
            }
        }

        // if (activeStep === 1) {
        //     if (props.location.state !== undefined) {
        //         updatePaymentBook(props.location.state);
        //     } else {
        //         savePaymentBook();
        //     }
        // }

        //setActiveStep(prevActiveStep => prevActiveStep + 1);
    }

    const handleBack = () => {
        if (activeStep === 1) {
            document.getElementById('backBtn').style.visibility = 'hidden';
        }
        setActiveStep(prevActiveStep => prevActiveStep - 1);
    }

    const handleChange = (event) => {

        let name = event.target.name;
        let value = event.target.value;
        // console.log("name=", name)
        // console.log("value=", value)
        setInputs(values => ({ ...values, [name]: value }));

        if (name === 'companyId') {
            if (value !== '') {
                getLastLocationByCompany(value);
            } else {
                setAllLocation([]);
            }
        }

    }

    const handleStatusChange = (event) => {
        //console.log("event.target.checked",event.target.checked);
        if (event.target.checked === true) {
            setActive("Active")
            setInputs({ ...inputs, status: true });
        } else {
            setActive("Inactive")
            setInputs({ ...inputs, status: false });
        }
    }

    const getStepContent = (step) => {
        switch (step) {
            case 0:
                return <div className='steper-height ml-5'>
                    <div>
                        <span className="create-field-title">Location Info</span>
                        <p style={{ color: "#B6B6B6" }}>If you need more info, please check out <NavLink to="/salescollection/configure/payment-book/payment-book-setup" className="faq-title"><u>FAQ Page</u></NavLink></p>
                    </div>


                    {/* COMPANY ROW */}

                    <div>
                        <label className='level-title'>Company<i style={{ color: "red" }}>*</i></label>
                        <select className='form-control' id="companyId" name="companyId" value={inputs.companyId || ""} onChange={handleChange}>
                            <option value="">Please select company</option>
                            {allCompany.map((company) => (
                                <option key={company.id} value={company.id}>{company.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* LOCATION ROW */}
                    <div className='mt-5'>
                        <label className='level-title'>Location<i style={{ color: "red" }}>*</i></label>
                        <select id="paymentBookLocationId" className='form-control' name="paymentBookLocationId"
                            value={inputs.paymentBookLocationId || ""} onChange={handleChange} >
                            <option value="">Please select Location</option>
                            {
                                allLocation.map((location) => (
                                    <option key={location.id} value={location.id}>{location.name}</option>
                                ))}
                        </select>
                    </div>
                </div>;
            case 1:
                return <div className='steper-height ml-5'>
                    <div>
                        <span className="create-field-title">Payment Book</span>
                        <p style={{ color: "#B6B6B6" }}>If you need more info, please check out <NavLink to="/salescollection/configure/payment-book/payment-book-setup" className="faq-title"><u>FAQ Page</u></NavLink></p>
                    </div>

                    {/* PAYMENT BOOK NUMBER ROW */}
                    <div className='mt-5'>
                        <label className='level-title'>Payment Book Number<i style={{ color: "red" }}>*</i></label>
                        <input placeholder='Ex. PB994' id="bookNumber" type="text" className='form-control' name="bookNumber" value={inputs.bookNumber || ""} onChange={(event) => handleChange(event)}></input>
                    </div>

                    <div className='mt-5 row'>
                        {/* FROM MPR NO ROW */}
                        <div className='col-xl-6'>
                            <label className='level-title'>From MR No<i style={{ color: "red" }}>*</i></label>
                            <input placeholder='Ex. 994650' id="fromMrNo" type="text" className='form-control' name="fromMrNo" value={inputs.fromMrNo || ""} onKeyPress={(e) => allowOnlyNumeric(e)} onChange={(event) => handleChange(event)}></input>
                        </div>

                        {/* TO MPR NO ROW */}
                        <div className='col-xl-6'>
                            <label className='level-title'>TO MR No<i style={{ color: "red" }}>*</i></label>
                            <input placeholder='Ex. 994700' id="toMrNo" type="text" className='form-control' name="toMrNo" value={inputs.toMrNo || ""} onKeyPress={(e) => allowOnlyNumeric(e)} onChange={(event) => handleChange(event)}></input>
                        </div>
                    </div>

                    <div className='mt-5 row'>
                        {/* ISSUE DATE ROW */}
                        <div className='col-xl-6'>
                            <label className='level-title'>Issue Date<i style={{ color: "red" }}>*</i></label>
                            {/* <input placeholder='Ex. 994' id="issueDate" type="date" className='form-control' name="issueDate" value={inputs.issueDate || ""} onChange={(event) => handleChange(event)}></input> */}
                            <Flatpickr className="form-control issueDate" placeholder="dd-MM-yyyy" id="issueDate"
                                value={inputs.issueDate ? moment(inputs.issueDate, "YYYY-MM-DD").format("DD-MMM-YYYY") : ''}
                                options={{
                                    dateFormat: "d-M-Y"
                                }} required
                                onChange={(value) => {
                                    inputs.issueDate = moment(new Date(value)).format("YYYY-MM-DD");
                                }}
                            />
                        </div>
                        <div className="col-xl-6">
                            <label><strong>Active</strong></label><br />
                            <FormControlLabel
                                label={active}
                                labelPlacement="end"
                                control={
                                    <IOSSwitch id="status" name="status" checked={inputs.status}
                                        value={inputs.status} onChange={(event) => handleStatusChange(event)} />
                                }
                            />
                        </div>
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
                            <span className='text-muted'>{message}</span>
                        </div>
                    </div>
                    <div className='col-xl-12'>
                        <div className='thanks-sub-title'>
                            <strong style={{ fontSize: "17px" }}>Payment Book Info</strong>
                        </div>
                    </div>
                    <div className='col-lg-12'>
                        <div className='row'>
                            <div className='offset-xl-4 col-xl-4 text-center fiscal-year-thanks-div'>
                                <div>
                                    <span className="fiscal-year-title">Payment Book No. {bookNumber}</span>
                                </div>
                                <div className="mt-1">
                                    <span className="daysCount mr-3">MR No. {fromMrNo} - {toMrNo} ({toMrNo - fromMrNo + 1})</span>
                                </div>
                                <div className='mt-2'>
                                    <div>
                                        <span className="text-muted">Issue Date - {moment(issueDate, "YYYY-MM-DD").format("DD MMM YYYY")}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>;
        }
    }
    const backToListPage = () => {
        props.history.push("/salescollection/configure/payment-book/payment-book-setup");
    }
    return (
        <>
            {/* BREAD CRUM ROW */}
            <div>
                <PaymentBookSetupBreadCrum />
            </div>
            <Card>
                <CardBody>
                    <div className="row">
                        <div className="col-sm-12 col-xl-3  col-lg-3 col-md-3border border-left-0 border border-light border-primary border-bottom-0 border-top-0">
                            <div className="d-flex">
                                <div className="card-div-icon dark-gray-color">
                                    <i className="bi bi-chevron-left"></i>
                                </div>
                                <div className="ml-2 mt-1">
                                    <p className="dark-gray-color" style={{ fontWeight: "500" }}>
                                        <NavLink to="/salescollection/configure/payment-book/payment-book-setup">&nbsp; Back to Payment Book Setup
                                        </NavLink>
                                    </p>
                                </div>
                            </div>

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
                                        {activeStep === steps.length - 2 ? 'Save' : 'Next'}
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