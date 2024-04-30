import "flatpickr/dist/themes/material_green.css";
import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import {Card, CardBody} from "../../../../../../_metronic/_partials/controls";
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import {NavLink, useLocation} from 'react-router-dom';
import SVG from "react-inlinesvg";
import {toAbsoluteUrl} from "../../../../../../_metronic/_helpers";
import TimeLineSetupBreadCrum from "../common/TimeLineSetupBreadCrum";
import axios from "axios";
import moment from "moment";
import {getDayDiff, getDaysCount} from "../../../../Util"
import {showError} from '../../../../../pages/Alert';
import Flatpickr from "react-flatpickr";


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
    return [`Fiscal Year`, 'Semester', 'Completed'];
}

export function TimeLineAdd(props) {
    const classes = useStyles();
    const routeLocation = useLocation();
    const [successImg, setSuccessImg] = useState(toAbsoluteUrl("/images/success2.png"));
    const [activeStep, setActiveStep] = useState(0);
    const steps = getSteps();
    const subsTitle = ["Setup Fiscal Year", "Setup Semester", "Woah, we are here"];
    const [companies, setCompanies] = useState([]);
    const [fiscalYear, setFiscalYear] = useState({});
    const [responseData, setResponseData] = useState();
    const [totalFiscalYearDays, setTotalFiscalYearDays] = useState(0);
    const [semesterList, setSemesterList] = useState([{}]);
    const [semesterDaysList, setSemesterDaysList] = useState([0]);

    useEffect(() => {
        if (activeStep === 0) {
            // document.getElementById('backBtn').style.visibility = 'hidden';
        }
        if (routeLocation.state) { // edit
            getAllCompaniesByOrganization();
            getTimeLineInfoById(routeLocation.state.row);
        } else {             //create
            getAllCompaniesByOrganization();
        }
    }, []);

    useEffect(() => {
        if (fiscalYear.startDate !== undefined && fiscalYear.endDate !== undefined) {
            let days = getDaysCount(fiscalYear.startDate, fiscalYear.endDate, "YYYY-MM-DD");
            setTotalFiscalYearDays(days > 0 ? days : 0);
        } else {
            setTotalFiscalYearDays(0);
        }
    }, [fiscalYear]);

    useEffect(() => {
        let totalSemesterDays = 0;
        let days = [];
        semesterList.map((s, index) => {
            let d = getDaysCount(s.startDate, s.endDate, "YYYY-MM-DD");
            totalSemesterDays += isNaN(d) ? 0 : d;
            days[index] = totalSemesterDays;
        });
        setSemesterDaysList(days);
    }, [semesterList]);

    useEffect(() => {
        if (activeStep == 1) {
            document.getElementById('backBtn').style.visibility = 'visible';
        } else if (activeStep == 2) {
            document.getElementById('nextBtn').style.visibility = 'hidden';
            document.getElementById('gotItBtn').style.visibility = 'visible';
            document.getElementById('backBtn').style.visibility = 'hidden';
        } else {
            document.getElementById('backBtn').style.visibility = 'hidden';
        }
    }, [activeStep]);

    const getTimeLineInfoById = (id) => {
        const URL = `${process.env.REACT_APP_API_URL}/api/accounting-year/get-with-semesters-by-id/${id}`;
        axios.get(URL).then(response => {
            const accountingYear = response.data.data.accountingYear;
            const semesterList = response.data.data.semesterList;
            setFiscalYear({...accountingYear, companyId: accountingYear.company.id});
            setSemesterList(semesterList);
        });
    }

    const handleNext = () => {
        if (activeStep === 0) {
            if (fiscalYear.companyId === undefined || fiscalYear.companyId === null || fiscalYear.companyId === '') {
                showError("Company is required.");
            } else if (fiscalYear.fiscalYearName === undefined || fiscalYear.fiscalYearName === null || fiscalYear.fiscalYearName === '') {
                showError("Fiscal Year Name is required.");
            } else if (fiscalYear.startDate === undefined || fiscalYear.startDate === null || fiscalYear.startDate === '') {
                showError("Start Date is required.");
            } else if (fiscalYear.endDate === undefined || fiscalYear.endDate === null || fiscalYear.endDate === '') {
                showError("End Date is required.");
            } else if (getDaysCount(fiscalYear.startDate, fiscalYear.endDate, "YYYY-MM-DD") <= 1) {  //should not be same date
                showError("End Date should be greater than Start Date.");
            } else {
                setActiveStep(prevActiveStep => prevActiveStep + 1);
            }
        } else if (activeStep === 1) {
            if (isSemesterListValidate()) {
                if (routeLocation.state) {  // update
                    updateTimeline();
                } else { //save
                    saveTimeline();
                }
            }
        }
    }

    const isSemesterListValidate = () => {
        let valid = true;
        let totalSemesterDays = 0;
        for (let index = 0; index < semesterList.length; index++) {
            let s = semesterList[index];
            if (s.semesterName === undefined || s.semesterName === null || s.semesterName === '') {
                showError("Semester Name is required at Semester Index(" + (index + 1) + ")");
                valid = false;
                return false;
            } else if (s.startDate === undefined || s.startDate === null || s.startDate === '') {
                showError("Start Date is required at " + s.semesterName);
                valid = false;
                return false;
            } else if (s.endDate === undefined || s.endDate === null || s.endDate === '') {
                showError("End Date is required at " + s.semesterName);
                valid = false;
                return false;
            } else if (getDaysCount(fiscalYear.startDate, s.startDate, "YYYY-MM-DD") < 1) {
                showError(s.semesterName + "'s Start Date cannot be less than Fiscal Year Start Date");
                valid = false;
                return false;
            } else if (getDayDiff(s.endDate, fiscalYear.endDate, "YYYY-MM-DD") < 0) {
                showError(s.semesterName + "'s End Date cannot be greater than Fiscal Year End Date");
                valid = false;
                return false;
            } else if (getDayDiff(s.startDate, s.endDate, "YYYY-MM-DD") <= 1) {
                showError("End Date should be greater than Start Date at " + s.semesterName);
                valid = false;
                return false;
            }
            totalSemesterDays += getDaysCount(s.startDate, s.endDate, "YYYY-MM-DD");

            for (let i = 0; i < semesterList.length; i++) {  // semester name duplicate check
                if (i === index) {
                    continue;
                }
                if (semesterList[i].semesterName.split(' ').filter(s => s).join(' ').toLowerCase() === s.semesterName.split(' ').filter(s => s).join(' ').toLowerCase()) {
                    showError(semesterList[i].semesterName + " and " + s.semesterName + " are same name!");
                    return false;
                }
            }
        }
        if (valid === true && totalSemesterDays !== totalFiscalYearDays) {
            showError("Total Semester Days should be equal to Fiscal Year Days");
            valid = false;
            return false;
        }
        return valid;
    }

    const handleBack = () => {
        setActiveStep(prevActiveStep => prevActiveStep - 1);
    }

    const handleSemesterChange = (i, e) => {
        if (e.target.name === 'semesterName') {
            let newFormValues = [...semesterList];
            newFormValues[i][e.target.name] = e.target.value.trimStart();
            setSemesterList(newFormValues);
        } else {
            let newFormValues = [...semesterList];
            newFormValues[i][e.target.name] = e.target.value;
            setSemesterList(newFormValues);
        }
    }

    const addFormFields = () => {
        setSemesterList([...semesterList, {}]);
    }

    const removeFormFields = (i) => {
        let newFormValues = [...semesterList];
        newFormValues.splice(i, 1);
        setSemesterList(newFormValues)
    }

    const getAllCompaniesByOrganization = () => {
        const URL = `${process.env.REACT_APP_API_URL}/api/organization/companies-by-login-user-organization`;
        axios.get(URL).then(response => {
            setCompanies(response.data.data);
        });
    }

    const handleChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;
        if (name === 'fiscalYearName') {
            setFiscalYear(values => ({...values, [name]: value.trimStart()}));
        } else {
            setFiscalYear(values => ({...values, [name]: value}));
        }
    }

    const setDateDiff = (startDate, endDate) => {
        if (startDate !== undefined && endDate !== undefined) {
            let days = getDaysCount(startDate, endDate, "YYYY-MM-DD");
            setTotalFiscalYearDays(days > 0 ? days : 0);
        } else {
            setTotalFiscalYearDays(0);
        }
    }

    const saveTimeline = () => {
        const URL = `${process.env.REACT_APP_API_URL}/api/accounting-year`;
        axios.post(URL, JSON.stringify({
            ...fiscalYear, semesterList: semesterList
        }), {headers: {"Content-Type": "application/json"}}).then(response => {
            setResponseData(response.data);
            if (response.data.success === true) {
                setActiveStep(prevActiveStep => prevActiveStep + 1);
                document.getElementById('nextBtn').style.visibility = 'hidden';
                document.getElementById('gotItBtn').style.visibility = 'visible';
            } else {
                showError(response.data.message);
            }
        }).catch(err => {
            showError("Cannot be Submitted");
        });
    }

    const updateTimeline = () => {
        const URL = `${process.env.REACT_APP_API_URL}/api/accounting-year`;
        axios.put(URL, JSON.stringify({
            ...fiscalYear, semesterList: semesterList
        }), {headers: {"Content-Type": "application/json"}}).then(response => {
            setResponseData(response.data);
            if (response.data.success === true) {
                setActiveStep(prevActiveStep => prevActiveStep + 1);
            } else {
                showError(response.data.message);
            }
        }).catch(err => {
            showError("Cannot be Submitted");
        });
    }

    const getStepContent = (step) => {
        switch (step) {
            case 0:
                return <div className='steper-height ml-5'>
                    <div>
                        <span className="create-field-title">Fiscal Year</span>
                        <p style={{color: "#B6B6B6"}}>If you need more info, please check out <NavLink
                            to="/salescollection/configure/time-line-setup/list" className="faq-title"><u>FAQ
                            Page</u></NavLink></p>
                    </div>

                    {/* COMPANY ROW */}
                    <div>
                        <label className='level-title'>Company<i style={{color: "red"}}>*</i></label>
                        <select placeholder='Ex. Bangladesh Islami Bank' id="company" className='form-control'
                                name="companyId" value={fiscalYear.companyId || ""} onChange={handleChange}>
                            <option value="">Select Company</option>
                            {companies.map((c) => (<option key={c.id} value={c.id}>
                                {c.shortName + '-' + c.name}
                            </option>))}
                        </select>
                    </div>

                    {/* FISCAL YEAR NAME ROW */}
                    <div className='row mt-5'>
                        <div className='col-lg-12'>
                            <label className='level-title'>Fiscal Year Name<i style={{color: "red"}}>*</i></label>
                            <input id="fiscalYearName" type="text" className='form-control' name="fiscalYearName"
                                   value={fiscalYear.fiscalYearName || ""} onChange={handleChange}></input>
                        </div>
                    </div>

                    {/* START DATE AND END DATE ROW */}
                    <div className='row mt-5'>
                        <div className='col-xl-6'>
                            <label className='level-title'>Start Date<i style={{color: "red"}}>*</i></label>
                            <Flatpickr className="form-control date" id="startDate" placeholder="dd-MM-yyyy"
                                       value={fiscalYear.startDate ? moment(fiscalYear.startDate, "YYYY-MM-DD").format("DD-MMM-YYYY") : ''}
                                       options={{dateFormat: "d-M-Y"}} required
                                       onChange={(value) => {
                                           setFiscalYear({
                                               ...fiscalYear,
                                               startDate: (value.length === 0 ? '' : moment(new Date(value)).format("YYYY-MM-DD"))
                                           })
                                       }}
                            />
                        </div>
                        <div className='col-xl-6'>
                            <label className='level-title'>End Date<i style={{color: "red"}}>*</i></label>
                            <Flatpickr className="form-control date" id="endDate" placeholder="dd-MM-yyyy"
                                       value={fiscalYear.endDate ? moment(fiscalYear.endDate, "YYYY-MM-DD").format("DD-MMM-YYYY") : ''}
                                       options={{dateFormat: "d-M-Y"}} required
                                       onChange={(value) => {
                                           setFiscalYear({
                                               ...fiscalYear,
                                               endDate: (value.length === 0 ? '' : moment(new Date(value)).format("YYYY-MM-DD"))
                                           })
                                       }}
                            />
                        </div>
                    </div>

                    {/* TOTAL DAYS COUNT  ROW */}
                    <div className='mt-5 guarantee-cheque-div pt-5 text-center'>
                        <strong className='pt-5'>
                            {totalFiscalYearDays > 1 ? totalFiscalYearDays + " days" : totalFiscalYearDays + " day"}
                        </strong>
                    </div>
                </div>;
            case 1:
                return <div className='steper-height ml-5'>
                    <div>
                        <span className="create-field-title">Semester</span>
                        <p style={{color: "#B6B6B6"}}>If you need more info, please check out
                            <NavLink to="/salescollection/configure/time-line-setup/list" className="faq-title">
                                <u>FAQ Page</u>
                            </NavLink>
                        </p>
                    </div>
                    {/* ASIGN PROPRIETOR ROW */}
                    {semesterList.map((element, index) => (<div className="row mt-5" key={index}>
                        <div className='col-xl-12 guarantee-cheque-div'>
                            <span>{semesterDaysList[index]} days out of {totalFiscalYearDays} days with Semester: {element.semesterName || ""} </span>
                        </div>
                        <div className="form-group col-xl-12 mt-5 float-right">
                            {index === 0 ? "" : <button type="button" className="btn btn-sm float-right"
                                                        onClick={() => removeFormFields(index)}>
                                <i style={{marginLeft: "-15px", fontSize: "16px"}}
                                   class="bi bi-trash3-fill text-danger"></i>
                            </button>}
                        </div>

                        {/* FISCAL YEAR NAME ROW */}
                        <div className='col-xl-12 mt-5'>
                            <label className='level-title'>Semester Name<i style={{color: "red"}}>*</i></label>
                            <input id="semesterName" type="text" className='form-control' name="semesterName"
                                   value={element.semesterName || ""}
                                   onChange={e => handleSemesterChange(index, e)}/>
                        </div>

                        {/* START DATE AND END DATE ROW */}
                        <div className='col-xl-12 mt-5'>
                            <div className='row'>
                                <div className='col-xl-6'>
                                    <label className='level-title'>Start Date<i style={{color: "red"}}>*</i></label>
                                    <Flatpickr className="form-control date" placeholder="dd-MM-yyyy"
                                               value={element.startDate ? moment(element.startDate, "YYYY-MM-DD").format("DD-MMM-YYYY") : ''}
                                               options={{dateFormat: "d-M-Y"}} required
                                               onChange={(value) => {
                                                   let newFormValues = [...semesterList];
                                                   newFormValues[index]['startDate'] = (value.length === 0 ? '' : moment(new Date(value)).format("YYYY-MM-DD"));
                                                   setSemesterList(newFormValues);
                                               }}
                                    />

                                </div>
                                <div className='col-xl-6'>
                                    <label className='level-title'>End Date<i style={{color: "red"}}>*</i></label>
                                    <Flatpickr className="form-control date" placeholder="dd-MM-yyyy"
                                               value={element.endDate ? moment(element.endDate, "YYYY-MM-DD").format("DD-MMM-YYYY") : ''}
                                               options={{dateFormat: "d-M-Y"}} required
                                               onChange={(value) => {
                                                   let newFormValues = [...semesterList];
                                                   newFormValues[index]['endDate'] = (value.length === 0 ? '' : moment(new Date(value)).format("YYYY-MM-DD"));
                                                   setSemesterList(newFormValues);
                                               }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>))}
                    <div className='col-xl-12 text-center m-0 auto bg-success mt-5'>
                        <button
                            style={{color: "white"}} type="button" className="btn" onClick={() => addFormFields()}>
                            <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/more.svg")}/> Add More Semester
                        </button>
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
                            <strong style={{fontSize: "17px"}}>New Timeline Info</strong>
                        </div>
                    </div>
                    <div className='col-lg-12'>
                        <div className='row'>
                            <div className='offset-xl-4 col-xl-4 text-center fiscal-year-thanks-div'>
                                <div>
                                    <span className="fiscal-year-title">{fiscalYear.fiscalYearName}</span>
                                </div>
                                <div className="mt-1">
                                    <span
                                        className="daysCount mr-3">{totalFiscalYearDays > 1 ? totalFiscalYearDays + " days" : totalFiscalYearDays + " day"}</span>
                                    <span
                                        className="text-muted">{moment(new Date(fiscalYear.startDate)).format('D MMMM YYYY') + " - "}</span>
                                    <span
                                        className="text-muted">{moment(new Date(fiscalYear.endDate)).format('D MMMM YYYY')}</span>
                                </div>
                                <div className='mt-2'>
                                    {semesterList.map((s) => (
                                        <span
                                            className="text-muted">{s.id === (semesterList[semesterList.length - 1]).id ? s.semesterName : s.semesterName + ", "
                                        }</span>))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>;
        }
    }
    const backToListPage = () => {
        props.history.push("/salescollection/configure/time-line-setup/list");
    }
    return (<>
        {/* BREAD CRUM ROW */}
        <div>
            <TimeLineSetupBreadCrum/>
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
                                    <NavLink to="/salescollection/configure/time-line-setup/list">&nbsp; Back to
                                        Timeline Setup
                                    </NavLink>
                                </p>
                            </div>
                        </div>

                        <div className={classes.root}>
                            <Stepper activeStep={activeStep} orientation="vertical">
                                {steps.map((label, index) => (<Step key={label}>
                                    <StepLabel optional={<Typography
                                        variant="caption">{subsTitle[index]}</Typography>}>{label}</StepLabel>
                                </Step>))}
                            </Stepper>
                        </div>
                    </div>
                    <div className="col-sm-12 col-xl-9 col-lg-9 col-md-9">
                        <Typography>{getStepContent(activeStep)}</Typography>
                        <div className={classes.actionsContainer}>
                            <div className='mt-5'>
                                <Button id="backBtn" onClick={handleBack} className={classes.button}>
                                    Back
                                </Button>
                                <Button id="nextBtn" disabled={activeStep === steps.length} variant="contained"
                                        color="primary" onClick={handleNext}
                                        className="float-right btn-gradient-blue">
                                    {activeStep === steps.length - 2 ? (routeLocation.state ? 'Update' : 'Submit') : 'Next'}
                                </Button>
                                <div style={{textAlign: 'center', marginTop: '119px', marginLeft: "50px"}}>
                                    <Button style={{visibility: "hidden"}} className='gotIt-btn' id="gotItBtn"
                                            variant="contained" color="primary" onClick={backToListPage}>
                                        Got it
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </CardBody>
        </Card>
    </>);
}