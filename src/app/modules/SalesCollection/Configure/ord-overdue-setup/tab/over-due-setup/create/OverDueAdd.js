import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import {Card, CardBody} from "../../../../../../../../_metronic/_partials/controls";
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import {NavLink, useLocation} from 'react-router-dom';
import SVG from "react-inlinesvg";
import {toAbsoluteUrl} from "../../../../../../../../_metronic/_helpers";
import OrdOverdueSetupBreadCrum from "../../../common/OrdOverdueSetupBreadCrum";
import axios from "axios";
import {showError} from '../../../../../../../pages/Alert';
import {allowOnlyNumeric, handlePasteDisable} from "../../../../../../Util";


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
    return ['Company', 'Set Overdue', 'Completed'];
}

export function OverDueAdd(props) {
    const routeLocation = useLocation();
    const classes = useStyles();
    const [successImg, setSuccessImg] = useState(toAbsoluteUrl("/images/success2.png"));
    const [activeStep, setActiveStep] = useState(0);
    const steps = getSteps();
    const subsTitle = ["Pick a Company", "Setup Overdue", "Woah, we are here"];
    const [cashInputs, setCashInputs] = useState({invoiceNatureId: 2});  // this will be fixed as db invoice_nature table
    const [creditInputs, setCreditInputs] = useState({invoiceNatureId: 1}); // this will be fixed
    const [inputs, setInputs] = useState({});
    const [companies, setCompanies] = useState([]);
    const [responseData, setResponseData] = useState({});

    useEffect(() => {
        if (activeStep === 0) {
            document.getElementById('backBtn').style.display = 'none';
        }
        getAllCompaniesByOrganization();

        if (routeLocation.state) { // edit
            const params = routeLocation.state.params;
            setInputs({
                companyId: params.cash.company.id,
                companyText: params.cash.company.name    // it will use at thank you state
            });
            setCashInputs({...cashInputs, ...params.cash});
            setCreditInputs({...creditInputs, ...params.credit});
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

    const getAllCompaniesByOrganization = () => {
        const URL = `${process.env.REACT_APP_API_URL}/api/organization/companies-by-login-user-organization`;
        axios.get(URL).then(response => {
            setCompanies(response.data.data);
        });
    }

    const handleNext = () => {
        if (activeStep === 0) {
            if (inputs.companyId === undefined || inputs.companyId === null || inputs.companyId === '') {
                showError("Company Field is required");
                return false;
            } else {
                setActiveStep(prevActiveStep => prevActiveStep + 1);
            }
        } else if (activeStep === 1) {
            if (cashInputs.startDay === undefined || cashInputs.startDay === null || cashInputs.startDay === '') {
                showError("Start Day Field is required at Cash");
                return false;
            } else if (cashInputs.endDay === undefined || cashInputs.endDay === null || cashInputs.endDay === '') {
                showError("End Day Field is required at Cash");
                return false;
            } else if (parseInt(cashInputs.startDay) < 0) {
                showError("Start Day should be positive Number at Cash");
                return true;
            } else if (parseInt(cashInputs.endDay) < 0) {
                showError("End Day should be positive Number at Cash");
                return true;
            } else if ((parseInt(cashInputs.endDay) - parseInt(cashInputs.startDay)) < 0) {
                showError("End Day should be greater than Start Day at Cash");
                return true;
            } else if (creditInputs.startDay === undefined || creditInputs.startDay === null || creditInputs.startDay === '') {
                showError("Start Day Field is required at Credit");
                return false;
            } else if (creditInputs.endDay === undefined || creditInputs.endDay === null || creditInputs.endDay === '') {
                showError("End Day Field is required at Credit");
                return false;
            } else if (parseInt(creditInputs.startDay) < 0) {
                showError("Start Day should be positive Number at Credit");
                return true;
            } else if (parseInt(creditInputs.endDay) < 0) {
                showError("End Day should be positive Number at Credit");
                return true;
            } else if ((parseInt(creditInputs.endDay) - parseInt(creditInputs.startDay)) < 0) {
                showError("End Day should be greater than Start Day at Credit");
                return true;
            }

            if (routeLocation.state) {  // update
                handleUpdate();
            } else { //save
                handleSave();
            }
        }
    }

    const handleBack = () => {
        setActiveStep(prevActiveStep => prevActiveStep - 1);
    }

    const handleCashChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;

        let notDueDays = 0;
        if (name === 'startDay') {
            notDueDays = ((isNaN(cashInputs.toDay) ? 0 : cashInputs.toDay) - (isNaN(value) ? 0 : value)) + 1;
        } else {
            notDueDays = ((isNaN(value) ? 0 : value) - (isNaN(cashInputs.startDay) ? 0 : cashInputs.startDay)) + 1;
        }

        setCashInputs(values => ({...values, [name]: value, notDueDays: notDueDays}));
    }

    const handleCreditChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;
        let notDueDays = 0;
        if (name === 'startDay') {
            notDueDays = ((isNaN(creditInputs.toDay) ? 0 : creditInputs.toDay) - (isNaN(value) ? 0 : value)) + 1;
        } else {
            notDueDays = ((isNaN(value) ? 0 : value) - (isNaN(creditInputs.startDay) ? 0 : creditInputs.startDay)) + 1;
        }

        setCreditInputs(values => ({...values, [name]: value, notDueDays: notDueDays}));
    }

    const handleChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;
        if (name === "companyId") {
            let index = event.target.selectedIndex;
            let text = event.target[index].text;    // company name
            setInputs(values => ({...values, [name]: value, companyText: text}));
        } else {
            // for future use
        }
    }

    const handleSave = () => {
        let inputList = [{...cashInputs, companyId: inputs.companyId},
            {...creditInputs, companyId: inputs.companyId}];
        const URL = `${process.env.REACT_APP_API_URL}/api/invoice-overdue/create-all`;
        axios.post(URL, JSON.stringify(inputList), {headers: {"Content-Type": "application/json"}}).then(response => {
            setResponseData(response.data);
            if (response.data.success == true) {
                setActiveStep(prevActiveStep => prevActiveStep + 1);
            } else {
                showError(response.data.message);
            }
        }).catch(err => {
            showError(err);
        });
    }

    const handleUpdate = () => {
        let previousCompanyId = routeLocation.state.params.cash.company.id;

        let inputList = [{...cashInputs, companyId: inputs.companyId, previousCompanyId: previousCompanyId},
            {...creditInputs, companyId: inputs.companyId, previousCompanyId: previousCompanyId}];

        const URL = `${process.env.REACT_APP_API_URL}/api/invoice-overdue/update-all`;
        axios.post(URL, JSON.stringify(inputList), {headers: {"Content-Type": "application/json"}}).then(response => {
            setResponseData(response.data);
            if (response.data.success === true) {
                setActiveStep(prevActiveStep => prevActiveStep + 1);
            } else {
                showError(response.data.message);
            }
        }).catch(err => {
            showError(err);
        });
    }

    const getStepContent = (step) => {
        switch (step) {
            case 0:
                return <div className='steper-height ml-5'>
                    <div>
                        <span className="create-field-title">Company</span>
                        <p style={{color: "#B6B6B6"}}>If you need more info, please check out <NavLink
                            to="/salescollection/configure/ord-overdue-setup/ord-list-overdue" className="faq-title"><u>FAQ
                            Page</u></NavLink></p>
                    </div>

                    {/* TIME LINE ROW */}
                    <div>
                        <label className='level-title'>Pick a Company<i style={{color: "red"}}>*</i></label>
                        <select className="form-control" name="companyId"
                                value={inputs.companyId || ""}
                                onChange={handleChange}>
                            <option value="">Select Company</option>
                            {companies.map((c) => (
                                <option key={c.id} value={c.id}>{c.name}</option>))}
                        </select>
                    </div>
                </div>;
            case 1:
                return <div className='steper-height ml-5'>
                    <div>
                        <span className="create-field-title">Overdue Setup</span>
                        <p style={{color: "#B6B6B6"}}>If you need more info, please check out <NavLink
                            to="/salescollection/configure/ord-overdue-setup/ord-list-overdue" className="faq-title"><u>FAQ
                            Page</u></NavLink></p>
                    </div>
                    <div className="row mt-5">

                        {/* CASH ROW */}
                        <div className='col-xl-3 p-0'> 
                            <span id="cash" className='form-control bg-success text-white text-center' name="cash"
                                  style={{marginTop: "26px"}}>
                                <b>Cash</b>
                            </span>
                        </div>

                        {/* START DAY ROW */}
                        <div className='col-xl-3'>
                            <label className='level-title'>Start Day<i style={{color: "red"}}>*</i></label>
                            <input min={1} type="text" className='form-control' name="startDay"
                                   value={cashInputs.startDay || ""}
                                   onChange={handleCashChange} onKeyPress={e => allowOnlyNumeric(e)} onPaste={handlePasteDisable}/>
                        </div>

                        {/* END DAY ROW */}
                        <div className='col-xl-3'>
                            <label className='level-title'>End Day<i style={{color: "red"}}>*</i></label>
                            <input min={1} type="text" className='form-control' name="endDay"
                                   value={cashInputs.endDay || ""} onChange={handleCashChange} onKeyPress={e => allowOnlyNumeric(e)} onPaste={handlePasteDisable}/>
                        </div>

                        {/* NOT DUE DAY ROW */}
                        <div className='col-xl-3'>
                            <label className='level-title'>Not Due Days<i style={{color: "red"}}>*</i></label>
                            <span type="text" className='form-control' name="notDueDays"> {cashInputs.notDueDays || ""}
                            </span>
                        </div>
                    </div>

                    <div className="row mt-5">

                        {/* CREDIT DAY ROW */}
                        <div className='col-xl-3 p-0'> 
                            <span id="credit" className='form-control bg-primary text-white text-center' name="credit"
                                  style={{marginTop: "26px"}}>
                                <b>Credit</b>
                            </span>
                        </div>

                        {/* START DAY ROW */}
                        <div className='col-xl-3'>
                            <label className='level-title'>Start Day<i style={{color: "red"}}>*</i></label>
                            <input min={1} type="text" className='form-control' name="startDay"
                                   value={creditInputs.startDay || ""}
                                   onChange={handleCreditChange} onKeyPress={e => allowOnlyNumeric(e)} onPaste={handlePasteDisable}/>
                        </div>

                        {/* END DAY ROW */}
                        <div className='col-xl-3'>
                            <label className='level-title'>End Day<i style={{color: "red"}}>*</i></label>
                            <input id="endDayCredit" min={1} type="text" className='form-control' name="endDay"
                                   value={creditInputs.endDay || ""} onChange={handleCreditChange} onKeyPress={e => allowOnlyNumeric(e)} onPaste={handlePasteDisable}/>
                        </div>

                        {/* NOT DUE DAY ROW */}
                        <div className='col-xl-3'>
                            <label className='level-title'>Not Due Days<i style={{color: "red"}}>*</i></label>
                            <span id="notDueDaysCredit" type="text" className='form-control'
                                  name="notDueDays">{creditInputs.notDueDays || ""}
                            </span>
                        </div>
                    </div>
                </div>;
            default:
                return <div className='row steper-height'>
                    <div className='col-lg-12' style={{textAlign: "center"}}>
                        <img
                            src={successImg}
                            style={{width: "84px", height: "84px", textAlign: "center"}} alt='Company Picture'/>
                        <div className='mt-5'>
                            <p style={{marginBottom: "0px"}} className="create-field-title">Thank You</p>
                            <span className='text-muted'>{responseData ? responseData.message : ""}</span>
                        </div>
                    </div>
                    <div className='col-xl-12'>
                        <div className='thanks-sub-title'>
                            <strong style={{fontSize: "17px"}}>New Overdue Setup Info</strong>
                        </div>
                    </div>
                    <div className='col-lg-12'>
                        <div className='row'>
                            <div className='offset-xl-3 col-xl-6 text-center fiscal-year-thanks-div'>
                                <div>
                                    <span className="fiscal-year-title">{inputs.companyText}</span>
                                </div>
                                <div className="mt-1">
                                    <span className="daysCount mr-3">Overdue Table</span>
                                </div>
                                <div className='mt-2'>
                                    <div>
                                        <span
                                            className="text-muted">{'Cash -> Day ' + cashInputs.startDay + ' - ' + cashInputs.endDay + ' (Not Due days ' + cashInputs.notDueDays + ')'}
                                        </span>
                                    </div>
                                    <div>
                                        <span
                                            className="text-muted">{'Credit -> Day ' + creditInputs.startDay + ' - ' + creditInputs.endDay + ' (Not Due days ' + creditInputs.notDueDays + ')'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>;
        }
    }
    const backToListPage = () => {
        props.history.push("/salescollection/configure/ord-overdue-setup/ord-list-overdue");
    }
    return (
        <>
            {/* BREAD CRUM ROW */}
            <div>
                <OrdOverdueSetupBreadCrum/>
            </div>
            <Card>
                <CardBody>
                    <div className="row">
                        <div
                            className="col-sm-12 col-xl-3  col-lg-3 col-md-3border border-left-0 border border-light border-primary border-bottom-0 border-top-0">
                            <div className="d-flex">
                                <div className="card-div-icon dark-gray-color">
                                    <i className="bi bi-chevron-left"></i>
                                </div>
                                <div className="ml-2 mt-1">
                                    <p className="dark-gray-color" style={{fontWeight: "500"}}>
                                        <NavLink
                                            to="/salescollection/configure/ord-overdue-setup/ord-list-overdue">&nbsp; Back
                                            to ORD & Overdue Setup
                                        </NavLink>
                                    </p>
                                </div>
                            </div>

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
                                    <Button id="backBtn" onClick={handleBack} className={classes.button}>Back</Button>
                                    <Button id="nextBtn" disabled={activeStep === steps.length} variant="contained"
                                            color="primary" onClick={handleNext}
                                            className="float-right btn-gradient-blue">
                                        {activeStep === steps.length - 2 ? 'Save' : 'Next'}
                                    </Button>
                                    <div style={{textAlign: 'center', marginTop: '119px', marginLeft: "50px"}}>
                                        <Button
                                            style={{visibility: "hidden"}} className='gotIt-btn' id="gotItBtn"
                                            variant="contained" color="primary" onClick={backToListPage}>Got it
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