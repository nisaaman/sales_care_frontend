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
import {getDaysCount, allowOnlyNumeric, handlePasteDisable, allowOnlyNumericWithPeriodAndRestrictDecimalTwo} from "../../../../../../Util";
import _ from "lodash";

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
    return ['Timeline', 'Set ORD', 'Completed'];
}

export function ORDAdd(props) {
    const routeLocation = useLocation();
    const classes = useStyles();
    const [successImg, setSuccessImg] = useState(toAbsoluteUrl("/images/success2.png"));
    const [activeStep, setActiveStep] = useState(0);
    const steps = getSteps();
    const subsTitle = ["Pick a timeline", "Setup ORD", "Woah, we are here"];
    const [totalDays, setTotalDays] = useState(0)
    const [inputOrdSetupList, setInputOrdSetupList] = useState([{fromDay: '', toDay: '', totalDays: '', ord: ''}]);
    const [inputs, setInputs] = useState({});
    const [companies, setCompanies] = useState([]);
    const [semesterList, setSemesterList] = useState([]);
    const [selectedSemesterInfo, setSelectedSemesterInfo] = useState({});
    const [invoiceNatureList, setInvoiceNatureList] = useState([]);
    const [calculationTypeList, setCalculationTypeList] = useState([]);
    const [responseData, setResponseData] = useState();

    useEffect(() => {
        if (activeStep === 0) {
            document.getElementById('backBtn').style.display = 'none';
        }
        getAllCompaniesByOrganization();
        getAllInvoiceNatureByOrganization();
        getCalculationTypeList();

        if (routeLocation.state) { // edit
            const params = routeLocation.state.params;
            let ordList = [];
            getAllCurrentAndFutureSemesterByCompany(params.company_id);
            setInputs({
                companyId: params.company_id,
                semesterId: params.semester_id,
                invoiceNatureId: params.invoice_nature_id
            });
            params.ordList.map(ord => {
                ordList.push({
                    id: ord.overriding_discount_id,
                    calculationType: ord.calculation_type_code,
                    fromDay: ord.from_day,
                    ord: ord.ord,
                    toDay: ord.to_day
                });
            });
            setInputOrdSetupList(ordList);
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

    const getAllInvoiceNatureByOrganization = () => {
        const URL = `${process.env.REACT_APP_API_URL}/api/invoice-nature`;
        axios.get(URL).then(response => {
            setInvoiceNatureList(response.data.data);
        });
    }

    const getAllCurrentAndFutureSemesterByCompany = (companyId) => {
        const URL = `${process.env.REACT_APP_API_URL}/api/semester/get-all-current-and-future-semester/` + companyId;
        axios.get(URL).then(response => {
            setSemesterList(response.data.data);
        });
    }

    const getCalculationTypeList = () => {
        const URL = `${process.env.REACT_APP_API_URL}/api/constants/calculation-type`;
        axios.get(URL).then(response => {
            setCalculationTypeList(response.data.data);
        });
    }

    const onCompanyChange = (event) => {
        if (event.target.value === '') {
            setSemesterList([]);
        } else {
            getAllCurrentAndFutureSemesterByCompany(event.target.value);
        }
        // setInputs({...inputs, semesterId: ''});  // when company change then no selected semester should be
    }

    const handleChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;
        setInputs(values => ({...values, [name]: value}));
    }

    const handleNext = () => {
        if (activeStep === 0) {
            if (inputs.companyId === undefined || inputs.companyId === null || inputs.companyId === '') {
                showError("Company Field is required");
                return false;
            } else if (inputs.semesterId === undefined || inputs.semesterId === null || inputs.semesterId === '') {
                showError("Semester Field is required");
                return false;
            } else if (inputs.invoiceNatureId === undefined || inputs.invoiceNatureId === null || inputs.invoiceNatureId === '') {
                showError("Invoice Nature Field is required");
                return false;
            } else {
                setActiveStep(prevActiveStep => prevActiveStep + 1);
            }
            // for update, when semester is no change
            if (_.isEmpty(selectedSemesterInfo)) {
                getSemesterInfoFromSemesterListBySemesterId(inputs.semesterId.toString());
            }
        } else if (activeStep === 1) {
            if (isOrdListEmpty()) {
                return false;
            } else if (isOrdListDayRangeOverlap()) {
                return false;
            } else if (isOrdListDaySequenceWrong()) {
                return false;
            } else if (!isTotalDaysValid()) {
                return false;
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

    const handleORDSetupChange = (i, e) => {
        let name = e.target.name;
        let value = e.target.value;
        let newFormValues = [...inputOrdSetupList];
        newFormValues[i][name] = value;

        if (name === 'ord') {
            if (value === '') {
                setInputOrdSetupList(newFormValues);
            } else if (Number(value) > 0) {
                let v = value.split(".")[1];
                if (v === undefined) {
                    setInputOrdSetupList(newFormValues);
                } else if (v.length < 3) {
                    setInputOrdSetupList(newFormValues);
                }
            }
        } else if (name === 'fromDay' || name === 'toDay') {
            if (value === '') {
                newFormValues[i]['totalDays'] = ((isNaN(newFormValues[i].toDay) ? 0 : newFormValues[i].toDay) - (isNaN(newFormValues[i].fromDay) ? 0 : newFormValues[i].fromDay)) + 1;
                setInputOrdSetupList(newFormValues);
            } else if (Number(value.trim()) > -1) {
                newFormValues[i][name] = Number(value.trim()).toString();
                newFormValues[i]['totalDays'] = ((isNaN(newFormValues[i].toDay) ? 0 : newFormValues[i].toDay) - (isNaN(newFormValues[i].fromDay) ? 0 : newFormValues[i].fromDay)) + 1;
                setInputOrdSetupList(newFormValues);
            }
        } else {
            setInputOrdSetupList(newFormValues);
        }
    }


    const addORDSetupFormFields = () => {
        setInputOrdSetupList([...inputOrdSetupList, {
            fromDay: '',
            toDay: '',
            totalDays: '',
            ord: ''
        }])
    }

    const removeORDSetupFormFields = (i) => {
        let newFormValues = [...inputOrdSetupList];
        newFormValues.splice(i, 1);
        setInputOrdSetupList(newFormValues)
    }

    const handleSave = () => {
        let inputList = inputOrdSetupList;
        inputList.map((v) => {
            v.semesterId = inputs.semesterId;
            v.invoiceNatureId = inputs.invoiceNatureId;
            v.companyId = inputs.companyId;
        });

        const URL = `${process.env.REACT_APP_API_URL}/api/overriding-discount/create-all`;
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
        const params = routeLocation.state.params;
        let inputList = inputOrdSetupList;
        inputList.map((v) => {
            v.semesterId = inputs.semesterId;
            v.invoiceNatureId = inputs.invoiceNatureId;
            v.companyId = inputs.companyId;
            // all element will be delete under these ids
            v.previousCompanyIdSemesterIdInvoiceNatureId = params.company_id + '-' + params.semester_id + '-' + params.invoice_nature_id;
        });
        const URL = `${process.env.REACT_APP_API_URL}/api/overriding-discount/update-all`;
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

    const clearForm = () => {
        setInputs({});
        setInputOrdSetupList([{fromDay: '', toDay: '', totalDays: '', ord: ''}]);
    }

    const isOrdListEmpty = () => {
        for (let i = 0; i < inputOrdSetupList.length; i++) {
            if (inputOrdSetupList[i].fromDay === undefined || inputOrdSetupList[i].fromDay === null || inputOrdSetupList[i].fromDay === '') {
                showError("Start Day is required at ORD no. " + (i + 1));
                return true;
            } else if (isNaN(inputOrdSetupList[i].fromDay) || parseInt(inputOrdSetupList[i].fromDay) < 0) {
                showError("Start Day should be positive Number at ORD no. " + (i + 1));
                return true;
            } else if (inputOrdSetupList[i].toDay === undefined || inputOrdSetupList[i].toDay === null || inputOrdSetupList[i].toDay === '') {
                showError("End Day is required at ORD no. " + (i + 1));
                return true;
            } else if (isNaN(inputOrdSetupList[i].toDay) || parseInt(inputOrdSetupList[i].toDay) < 0) {
                showError("End Day should be positive Number at ORD no. " + (i + 1));
                return true;
            } else if (inputOrdSetupList[i].ord === undefined || inputOrdSetupList[i].ord === null || inputOrdSetupList[i].ord === '') {
                showError("ORD is required at ORD no. " + (i + 1));
                return true;
            } else if (isNaN(inputOrdSetupList[i].ord) || parseInt(inputOrdSetupList[i].ord) < 0) {
                showError("ORD should be positive Number at ORD no. " + (i + 1));
                return true;
            } else if (parseInt(inputOrdSetupList[i].fromDay) >= parseInt(inputOrdSetupList[i].toDay)) {
                showError("End Day should be greater than Start Day at ORD no. " + (i + 1));
                return true;
            } else if (inputOrdSetupList[i].calculationType === undefined || inputOrdSetupList[i].calculationType === null || inputOrdSetupList[i].calculationType === '') {
                showError("Sufix is required at ORD no. " + (i + 1));
                return true;
            } else if (inputOrdSetupList[i].calculationType === 'PERCENTAGE' && (parseFloat(inputOrdSetupList[i].ord) > 100 || parseFloat(inputOrdSetupList[i].ord) <= 0)) {
                showError("ORD should be Positive Number and not greater than 100");
                return false;
            }
        }
        return false;
    }

    const isOrdListDayRangeOverlap = () => {
        for (let i = 0; i < inputOrdSetupList.length; i++) {
            for (let j = 0; j < inputOrdSetupList.length; j++) {
                if (i === j) {
                    continue;
                }
                if (parseInt(inputOrdSetupList[j].fromDay) >= parseInt(inputOrdSetupList[i].fromDay) && parseInt(inputOrdSetupList[j].fromDay) <= parseInt(inputOrdSetupList[i].toDay)) {
                    showError("ORD no. " + (j + 1) + "'s Start Day is overlaped with ORD no. " + (i + 1));
                    return true;
                } else if (parseInt(inputOrdSetupList[j].toDay) >= parseInt(inputOrdSetupList[i].fromDay) && parseInt(inputOrdSetupList[j].toDay) <= parseInt(inputOrdSetupList[i].toDay)) {
                    showError("ORD no. " + (j + 1) + "'s End Day is overlaped with ORD no. " + (i + 1));
                    return true;
                } else if (parseInt(inputOrdSetupList[j].fromDay) <= parseInt(inputOrdSetupList[i].fromDay) && parseInt(inputOrdSetupList[j].toDay) >= parseInt(inputOrdSetupList[i].toDay)) {
                    showError("ORD no. " + (j + 1) + "'s Start Day or End Day is overlaped with ORD no. " + (i + 1));
                    return true;
                }
            }
        }
        return false;
    }

    const isOrdListDaySequenceWrong = () => {
        for (let i = 0; i < inputOrdSetupList.length; i++) {
            let j = i + 1
            if (j < inputOrdSetupList.length) {
                if (parseInt(inputOrdSetupList[j].fromDay) - parseInt(inputOrdSetupList[i].toDay) != 1) {
                    showError("Day sequence is not valid between ORD no. " + (j + 1) + "'s Start Day and ORD no. " + (i + 1) + "'s End Day");
                    return true;
                }
            }
        }
        return false;
    }

    const isTotalDaysValid = () => {
        let ordDays = 0;
        for (let i = 0; i < inputOrdSetupList.length; i++) {
            ordDays += (parseInt(inputOrdSetupList[i].toDay) - parseInt(inputOrdSetupList[i].fromDay) + 1);
        }
        let semesterDays = getDaysCount(selectedSemesterInfo.start_date, selectedSemesterInfo.end_date, "YYYY-MM-DD");
        if (semesterDays < ordDays) {
            showError("Total ORD Days cannot be greater than Semester Days");
            return false;
        }
        return true;
    }

    const backToListPage = () => {
        clearForm();
        props.history.push("/salescollection/configure/ord-overdue-setup/ord-list");
    }

    const onSemesterChange = (event) => {
        getSemesterInfoFromSemesterListBySemesterId(event.target.value);
    }

    const getSemesterInfoFromSemesterListBySemesterId = (id) => {
        let found = false;
        for (let i = 0; i < semesterList.length; i++) {
            if (semesterList[i].semester_id.toString() === id) {
                setSelectedSemesterInfo(semesterList[i]);
                found = true;
                break;
            }
        }
        if (!found) {
            setSelectedSemesterInfo({});
        }
    }

    const getStepContent = (step) => {
        switch (step) {
            case 0:
                return <div className='steper-height ml-5'>
                    <div>
                        <span className="create-field-title">Timeline</span>
                        <p style={{color: "#B6B6B6"}}>If you need more info, please check out <NavLink
                            to="/salescollection/configure/ord-overdue-setup/ord-list" className="faq-title"><u>FAQ
                            Page</u></NavLink></p>
                    </div>

                    {/* TIME LINE ROW */}
                    <div className="row mt-5">
                        <label className='level-title'>Pick a Company<i style={{color: "red"}}>*</i></label>
                        <select className="form-control" name="companyId"
                                value={inputs.companyId || ""}
                                onChange={(event) => {
                                    handleChange(event);
                                    onCompanyChange(event);
                                }}>
                            <option value="">Select Company</option>
                            {companies.map((c) => (
                                <option key={c.id} value={c.id}>{c.name}</option>))}
                        </select>
                    </div>
                    <div className="row mt-5">
                        <label className='level-title'>Pick a Timeline<i style={{color: "red"}}>*</i></label>
                        <select className="form-control" name="semesterId" value={inputs.semesterId || ""}
                                onChange={(event) => {
                                    handleChange(event);
                                    onSemesterChange(event);
                                }}>
                            <option value="" className="fs-1">Select Semester</option>
                            {semesterList.map((c) => (
                                <option key={c.semester_id} value={c.semester_id}
                                        className="fs-1">{c.fiscal_year_name}/{c.semester_name}</option>))}
                        </select>
                    </div>
                    <div className="row mt-5">
                        <label className='level-title'>Pick an Invoice Nature<i style={{color: "red"}}>*</i></label>
                        <select className="form-control" name="invoiceNatureId" value={inputs.invoiceNatureId || ""}
                                onChange={handleChange}>
                            <option value="" className="fs-1">Select Invoice Nature</option>
                            {invoiceNatureList.map((c) => (
                                <option key={c.id} value={c.id}
                                        className="fs-1">{c.name}</option>))}
                        </select>
                    </div>
                </div>;
            case 1:
                return <div className='steper-height ml-5'>
                    <div>
                        <span className="create-field-title">ORD Setup</span>
                        <p style={{color: "#B6B6B6"}}>If you need more info, please check out <NavLink
                            to="/salescollection/configure/ord-overdue-setup/ord-list" className="faq-title"><u>FAQ
                            Page</u></NavLink></p>
                    </div>
                    {/* ASIGN PROPRIETOR ROW */}
                    {inputOrdSetupList.map((element, index) => (
                        <div className="row mt-5" key={index}>
                            <div className="col-xl-11 bg-info text-light my-5 mt-1">ORD No. {index + 1}</div>
                            <div className="col-xl-1 mt-2 float-right">
                                {index === 0 ? ""
                                    :
                                    <button type="button" className="btn btn-sm float-right"
                                            onClick={() => removeORDSetupFormFields(index)}
                                    >
                                        <i style={{marginLeft: "-15px", fontSize: "16px"}}
                                           className="bi bi-trash3-fill text-danger"></i>
                                    </button>
                                }
                            </div>

                            {/* START DAY ROW */}
                            <div className='col-xl-2'>
                                <label className='level-title'>Start Day<i style={{color: "red"}}>*</i></label>
                                <input id={"startDay-" + index} type="text" className='form-control' name="fromDay"
                                       value={element.fromDay === undefined || element.fromDay === null || element.fromDay === "" ? "" : element.fromDay}
                                       onChange={e => handleORDSetupChange(index, e)} onKeyPress={e => allowOnlyNumeric(e)} onPaste={handlePasteDisable}/>
                            </div>

                            {/* END DAY ROW */}
                            <div className='col-xl-2'>
                                <label className='level-title'>End Day<i style={{color: "red"}}>*</i></label>
                                <input id="endDay" type="text" className='form-control' name="toDay"
                                       value={element.toDay || ""} onChange={e => handleORDSetupChange(index, e)} onKeyPress={e => allowOnlyNumeric(e)} onPaste={handlePasteDisable}/>
                            </div>

                            {/* TOTAL DAY ROW */}
                            <div className='col-xl-2'>
                                <label className='level-title'>Total Day</label>
                                <span id={"totalDays-" + index} type="text" className='form-control' name="totalDays"
                                      value={element.totalDays || ""}>
                                    {((isNaN(element.toDay) ? 0 : element.toDay) - (isNaN(element.fromDay) ? 0 : element.fromDay)) + 1}
                                </span>
                            </div>

                            {/* ORD ROW */}
                            <div className='col-xl-2'>
                                <label className='level-title'>ORD<i style={{color: "red"}}>*</i></label>
                                <input id="ord" min="1" type="text" className='form-control' name="ord"
                                       value={element.ord || ""} onChange={e => handleORDSetupChange(index, e)} onKeyPress={e => allowOnlyNumericWithPeriodAndRestrictDecimalTwo(e)} onPaste={handlePasteDisable}/>
                            </div>

                            <div className="col-xl-3">
                                <label><strong>Suffix<i style={{color: "red"}}>*</i></strong></label><br/>
                                <select className="form-control" name="calculationType"
                                        value={element.calculationType || ""}
                                        onChange={e => handleORDSetupChange(index, e)}>
                                    <option value="" className="fs-1">Select Suffix</option>
                                    {calculationTypeList.map((c) => (
                                        <option key={c.code} value={c.code} className="fs-1">{c.name}</option>))}
                                </select>
                            </div>
                        </div>
                    ))}
                    <div className="row">
                        <div className='col-xl-12 text-center m-0 auto bg-success mt-5'>
                            <button type="button" className="btn text-light"
                                    onClick={() => addORDSetupFormFields()}>
                                <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/more.svg")}/> Add More ORD
                            </button>
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
                        <div className='thanks-sub-title'><strong style={{fontSize: "17px"}}>ORD Setup Info</strong>
                        </div>
                    </div>
                    <div className='col-lg-12'>
                        <div className='row'>
                            <div className='offset-xl-4 col-xl-4 text-center fiscal-year-thanks-div'>
                                <div><span
                                    className="fiscal-year-title">{selectedSemesterInfo.fiscal_year_name}/{selectedSemesterInfo.semester_name}</span>
                                </div>
                                <div className="mt-1"><span className="daysCount mr-3">ORD Table</span></div>
                                <div className='mt-2'>
                                    {inputOrdSetupList.map((ord) => (
                                        <div>
                                            {/*"Day 1 - 30 ORD 15%",*/}
                                            <span
                                                className="text-muted">Day {ord.fromDay} - {ord.toDay} ORD {ord.ord}{ord.calculationType === 'EQUAL' ? '/=' : '%'}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>;
        }
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
                                <div className="card-div-icon dark-gray-color"><i className="bi bi-chevron-left"></i>
                                </div>
                                <div className="ml-2 mt-1">
                                    <p className="dark-gray-color" style={{fontWeight: "500"}}>
                                        <NavLink to="/salescollection/configure/ord-overdue-setup/ord-list">&nbsp;Back
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
                                    ))}
                                </Stepper>
                            </div>
                        </div>
                        <div className="col-sm-12 col-xl-9 col-lg-9 col-md-9">
                            <Typography>{getStepContent(activeStep)}</Typography>
                            <div className={classes.actionsContainer}>
                                <div className='mt-5'>
                                    <Button id="backBtn" onClick={handleBack} className={classes.button}
                                    >Back
                                    </Button>
                                    <Button
                                        id="nextBtn" disabled={activeStep === steps.length} variant="contained"
                                        color="primary" onClick={handleNext} className="float-right btn-gradient-blue"
                                    >{activeStep === steps.length - 2 ? 'Save' : 'Next'}
                                    </Button>
                                    <div style={{textAlign: 'center', marginTop: '119px', marginLeft: "50px"}}>
                                        <Button
                                            style={{visibility: "hidden"}} className='gotIt-btn' id="gotItBtn"
                                            variant="contained" color="primary" onClick={backToListPage}
                                        >Got it
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