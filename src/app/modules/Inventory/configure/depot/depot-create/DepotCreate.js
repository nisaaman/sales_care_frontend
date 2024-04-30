import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import SVG from "react-inlinesvg";
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import { Card, CardBody } from "../../../../../../_metronic/_partials/controls";
import { useSubheader } from "../../../../../../_metronic/layout";
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { NavLink } from 'react-router-dom';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { toAbsoluteUrl } from "../../../../../../_metronic/_helpers";
import axios from "axios";
import { showError } from '../../../../../pages/Alert';
import IOSSwitch from '../../../../../pages/IOSSwitch';
import { useLocation } from "react-router-dom";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import Autocomplete from "@material-ui/lab/Autocomplete";
import { TextField } from "@material-ui/core";
import { set } from 'lodash';
import { shallowEqual, useSelector } from 'react-redux';
import { boolean } from 'yup';

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
    return [`Depot Name`, 'Contact & Address', 'Add Area', 'Status', 'Completed'];
}

export function DepotCreate(props) {
    const classes = useStyles();
    const location = useLocation();
    const [successImg, setSuccessImg] = useState(toAbsoluteUrl("/images/success2.png"));
    const [responseData, setResponseData] = useState();
    const [activeStep, setActiveStep] = useState(0);
    const [title, setTitle] = useState("Depot Configure");
    const [subTitle, setSubTitle] = useState("Depot Configure");
    const [depotManager, setDepotManager] = useState([]);
    const [depotManagerValue, setDepotManagerValue] = useState(null);
    const steps = getSteps();
    const [depotIncharges, setDepotIncharges] = useState([]);
    const [qAList, setQAList] = useState([]);
    const [companyList, setCompanyList] = useState([]);
    const [companyIds, setCompanyIds] = useState([]);
    const [values, setValues] = useState(null);
    // const [companyId, setCompanyId] = useState();
    const [inputs, setInputs] = useState({});
    
    const [qaMap, setQaMap] = useState("");
    const [depotInchargeMap, setDepotInchargeMap] = useState("");
    const [value, setValue] = useState();
    const subsTitle = ["Insert Depot Name", "Depot Contact & Address Info", "Set Your Company and Location", "Review your information", "Woah, we are here"];
    // Subheader
    const subheader = useSubheader();
    const parentCompany = useSelector((state) => state.auth.user.parentCompany, shallowEqual);
    const [depotCompanyLocationList, setDepotCompanyLocationList] = useState([
        {
            companyId: '',
            companyName: '',
            areaIdArray: [],
            areaList: []
        },
    ]);
    const addDepotAreaFields = (i) => {

        setDepotCompanyLocationList([...depotCompanyLocationList, {
            companyId: '',
            companyName: '',
            areaIdArray: [],
            areaList: []
        },])

    }
    useEffect(() => {
        subheader.setTitle(title);
        subheader.setSubTitle(subTitle);
        getApplicationUserList();
        if (activeStep === 0) {
            document.getElementById('backBtn').style.visibility = 'hidden';
        }
        getAllCompany();
        if (location.state) { // edit
            getProps();
        } else {             //create
            setInputs({ isActive: true, isCentralWarehouse: false });
        }

    }, []);
    const getApplicationUser = () =>{
        let companyIdsTemp = [...companyIds]
        depotCompanyLocationList.map((obj)=>{
            companyIdsTemp.push(parseInt(obj.companyId))
        })
        setCompanyIds(companyIdsTemp)
        getApplicationUserList()
    }
    const getApplicationUserList = () => {
        let queryString = "?";
        queryString += "companyIds="+companyIds;
        const URL = `${process.env.REACT_APP_API_URL}/auth/get-user-list-company-wise`+ queryString;
        axios.get(URL).then(response => {
            console.log(response.data.data)
            setDepotManager(response.data.data);
        });
    }
    
    const removeDepotArea = (i) => {
        let newFormValues = [...depotCompanyLocationList];
        newFormValues.splice(i, 1);
        setDepotCompanyLocationList(newFormValues)
    }
    const getProps = () => {
        const editObj = location.state.row;
        getDepotInfoById(editObj.id);
    }
    const handleNext = () => {
        let isForwardNextStep = true;
        if (activeStep >= 0) {
            document.getElementById('backBtn').style.visibility = 'visible';
        }
        if (activeStep === 0) {
            if (inputs.depotName === undefined || inputs.depotName === null || inputs.depotName === '') {
                document.getElementById('backBtn').style.visibility = 'hidden';
                showError("Depot Name is required.");
                isForwardNextStep = false;
            }
        } else if (activeStep === 1) {
            if (value === undefined || value === null || value === '') {
                showError("Contact Number is required.");
                isForwardNextStep = false;
            } else if (inputs.address === undefined || inputs.address === null || inputs.address === '') {
                showError("Address is required.");
                isForwardNextStep = false;
            } else if (value) {
                const name = "contactNumber";
                setInputs(values => ({ ...values, [name]: value }));
            }
        } else if (activeStep === 2) {
            if (depotCompanyLocationList.length > 0) {
                depotCompanyLocationList.map((company) => {
                    if (company.companyId === undefined || company.companyId === null || company.companyId === "") {
                        showError("Company Field Is Required.");
                        isForwardNextStep = false;
                    } else if (company.areaList.length === 0) {
                        showError("Area Field Is Required.");
                        isForwardNextStep = false;
                    }
                })
            }
        } else if (activeStep === 3) {
            document.getElementById('nextBtn').style.visibility = 'hidden';
            document.getElementById('backBtn').style.visibility = 'hidden';
            document.getElementById('gotItBtn').style.visibility = 'visible';
            if(inputs.depotManagerId === undefined || inputs.depotManagerId === null || inputs.depotManagerId === ""){
                showError("User Field Is Required");
                isForwardNextStep = false; 
            }
            if (location.state) {  // update
                updateDepot();
            } else { //save
                saveDepot();
            }
        }
        if (isForwardNextStep) {
            setActiveStep(prevActiveStep => prevActiveStep + 1);
        }
    }

    const saveDepot = () => {
        let obj = {}
        obj = { ...inputs };
        obj.depotCompanyLocationList = depotCompanyLocationList;
        obj.depotQualityAssuranceMapDtoList = qAList;
        obj.contactNumber = value;
        const URL = `${process.env.REACT_APP_API_URL}/api/depot`;
        axios.post(URL, JSON.stringify(obj), { headers: { "Content-Type": "application/json" } }).then(response => {
            setResponseData(response.data);
            if (response.data.success === true) {
                resetInputsData();
            }
        }).catch(err => {
            showError(err);
        });
    }

    const updateDepot = () => {
        let obj = { ...inputs };
        obj.depotCompanyLocationList = depotCompanyLocationList;
        obj.depotQualityAssuranceMapDtoList = qAList;
        obj.contactNumber = value;
        const URL = `${process.env.REACT_APP_API_URL}/api/depot`;
        axios.put(URL, JSON.stringify(obj), { headers: { "Content-Type": "application/json" } }).then(response => {
            setResponseData(response.data);
            if (response.data.success === true) {
                resetInputsData();
            }
        }).catch(err => {
            showError(err);
        });
    }

    const handleBack = () => {
        if (activeStep === 1) {
            document.getElementById('backBtn').style.visibility = 'hidden';
        }
        setActiveStep(prevActiveStep => prevActiveStep - 1);
    }

    const handleReset = () => {
        setActiveStep(0);
    }

    const handleChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;

        if (name === 'isActive') {   // value comes as string
            value = value === 'true' ? false : true;
        } else if (name === 'isCentralWarehouse') {   // value comes as string
            value = value === 'true' ? false : true;
        }
        setInputs(values => ({ ...values, [name]: value }));
    }

    const getAllCompany = () => {
        const URL = `${process.env.REACT_APP_API_URL}/api/organization/companies-by-login-user-organization`;
        axios.get(URL).then(response => {
            setCompanyList(response.data.data);
        });
    }

    const resetInputsData = () => {
        //setInputs({ isActive: true, depotManagerId: 1 });
    }

    const getDepotInfoById = (id) => {
        const URL = `${process.env.REACT_APP_API_URL}/api/depot/depot-info/${id}`;
        axios.get(URL).then(response => {
            console.log(response.data.data)
            const depot = response.data.data.depot;
            const areas = response.data.data.locations;
            const dropdownAreas = response.data.data.dropdownLocations;
            setInputs({
                id: depot.id,
                address: depot.address,
                //contactNumber: depot.contactNumber,
                depotName: depot.depotName,
                areaIds: areas.map(a => a.id),
                depotManagerId: depot.depotManager.id,
                isActive: depot.isActive,
                isCentralWarehouse: depot.isCentralWarehouse,
            });
            setValue(depot.contactNumber)
            setDepotManagerValue(depot.depotManager);
            setQAList(response.data.data.qaList)
            setDepotCompanyLocationList(dropdownAreas);
        });
    }
    const handleCompanyChange = (e, i) => {
        const getId = document.getElementById("companyId-id-" + i)
        const getCompanyName = getId.options[getId.selectedIndex].text;
        if (depotCompanyLocationList.length > 1) {
            const temp = [...depotCompanyLocationList]
            const index = temp.findIndex((obj) => obj.companyId === e.target.value)
            if (index > -1) {
                showError("This company already used");
                return;
            } else {
                let newFormValues = [...depotCompanyLocationList];
                newFormValues[i][e.target.name] = e.target.value;
                newFormValues[i].companyName = getCompanyName;
                const URL = `${process.env.REACT_APP_API_URL}/api/location/get-all-depot-level-location-with-out-depot-location-map/` + e.target.value;
                axios.get(URL).then(response => {
                    newFormValues[i].areaIdArray = response.data.data
                    return setDepotCompanyLocationList(newFormValues);
                });
            }
        } else {
            let newFormValues = [...depotCompanyLocationList];
            newFormValues[i][e.target.name] = e.target.value;
            newFormValues[i].companyName = getCompanyName;
            const URL = `${process.env.REACT_APP_API_URL}/api/location/get-all-depot-level-location-with-out-depot-location-map/` + e.target.value;
            axios.get(URL).then(response => {
                newFormValues[i].areaIdArray = response.data.data
                return setDepotCompanyLocationList(newFormValues);
            });
        }
    }
    const handleAreaChange = (i) => {
        const _areaIdVal = document.getElementById("areaId-id-" + i);
        let id = _areaIdVal.options[_areaIdVal.selectedIndex].value;
        let areaName = _areaIdVal.options[_areaIdVal.selectedIndex].text;
        if (id !== "") {
            const temp = [...depotCompanyLocationList]
            temp[i].areaList.push({ "id": id, "name": areaName })
            setDepotCompanyLocationList(temp)
            const index = temp[i].areaIdArray.findIndex(data => data.id === parseInt(id));
            temp[i].areaIdArray.splice(index, 1);
            setDepotCompanyLocationList(temp);
            //setInputs({ ...inputs, areaIds: temp.map(obj => parseInt(obj.id)) });  // only array of integer id
        }
    }
    const deleteArea = (i, data) => {
        const temp = [...depotCompanyLocationList]
        temp[i].areaIdArray.push(data)
        setDepotCompanyLocationList(temp)
        const index = temp[i].areaList.findIndex(obj => obj.id === parseInt(data.id));
        temp[i].areaList.splice(index, 1);
        setDepotCompanyLocationList(temp)
        // setInputs({ ...inputs, areaIds: tempAreaIds.map(obj => parseInt(obj.id)) }); // only array of integer id
    }
    const getApplicationQA = () =>{
        let companyIdsTemp = [...companyIds]
        depotCompanyLocationList.map((obj)=>{
            companyIdsTemp.push(parseInt(obj.companyId))
        })
        setCompanyIds(companyIdsTemp)
        getApplicationQAList()
    }

    const getApplicationQAList = () => {
        let queryString = "?";
        queryString += "companyIds="+companyIds;
        const URL = `${process.env.REACT_APP_API_URL}/auth/get-user-list-company-wise`+ queryString;
        axios.get(URL).then(response => {
            setDepotIncharges(response.data.data)
        });
    }

    const deleteDepotIncharge = (data) => {
        const temp = [...qAList]
        const index = temp.findIndex(obj => obj.depotInchargeId === data.depotInchargeId);
        temp.splice(index, 1);
        setQAList(temp)
    }

    const checkUserAlreadyAssignedForDepotIncharge = (user) => {
        if (user) {          
            let queryString = "?";
            queryString += "companyId="+user.company_id;
            queryString += "&userId="+user.user_id;
            queryString += inputs.id !=null ? "&depotId="+inputs.id : "";
            const URL = `${process.env.REACT_APP_API_URL}/api/depot/check-user-assigned-for-depot-incharge`+ queryString;
            axios.get(URL).then(response => {
                setDepotInchargeMap(response.data.data.depotInchargeAssigned)

                if (response.data.data.depotInchargeAssigned == true) {
                    showError("User already assigned as a Depot Incharge");
                    setDepotManagerValue(null);
                    return;
                } else {
                    if(user !== null){
                        setDepotManagerValue(user)
                        setInputs({ ...inputs, depotManagerId: user.user_id });// user_id depot manager id
                    }
                }                
            });  
        }
    }
    
    const checkUserAlreadyAssignedForQa = (user) => {
        console.log("user", user);
        console.log("inputs", inputs);
        if (user) {          
            let queryString = "?";
            queryString += "companyId="+user.company_id;
            queryString += "&userId="+user.user_id;
            queryString += inputs.id !=null ? "&depotId="+inputs.id : "";
            const URL = `${process.env.REACT_APP_API_URL}/api/depot/check-user-assigned-for-qa`+ queryString;
            axios.get(URL).then(response => {
                setQaMap(response.data.data.qaAssigned)
                if (response.data.data.qaAssigned == true) {
                    showError("User already assigned as a QA");
                    return;
                } else {
                    if(user !== null) {
                        if(qAList.length > 0){
                            let temp = [...qAList]
                            const index = temp.findIndex(data => data.depotInchargeId === user.user_id);  
                            if(index > -1){
                                showError("This user already used");
                                return;
                            }else{
                                temp.push({
                                    "depotInchargeId":user.user_id,
                                    "name":user.name,
                                    "email":user.email
                                })
                                setQAList(temp)
                            }   
                        } else {
                            const temp = [...qAList]
                            temp.push({
                                "depotInchargeId":user.user_id,
                                "name":user.name,
                                "email":user.email
                                
                            })
                            setQAList(temp)
                        }
                    }
                }                
            });  
        }
    }

    const getStepContent = (step) => {
        switch (step) {
            case 0:
                return <div className='steper-height ml-5'>
                    <div>
                        <span className="create-field-title">Depot Name</span>
                        <p style={{ color: "#B6B6B6" }}>If you need more info, please check out <NavLink
                            to="/inventory/configure/depot-configure/list" className="faq-title"><u>FAQ
                                Page</u></NavLink></p>
                    </div>
                    <div className='row'>
                        <div className='form-group col-lg-12 first-level-top'>
                            <label className='level-title'>Name<i style={{ color: "red" }}>*</i></label>
                            <input id="name" placeholder='Depot Name' type="text" className='form-control'
                                name="depotName" value={inputs.depotName || ""} onChange={handleChange}></input>
                        </div>
                    </div>
                </div>;
            case 1:
                return <div className='steper-height ml-5'>
                    <div>
                        <span className="create-field-title">Depot Contact & Address</span>
                        <p style={{ color: "#B6B6B6" }}>If you need more info, please check out <NavLink
                            to="/inventory/configure/depot-configure/list" className="faq-title"><u>FAQ
                                Page</u></NavLink></p>
                    </div>
                    <div className='row'>
                        <div className='form-group col-lg-12 first-level-top'>
                            <label className='level-title'>Contact<i style={{ color: "red" }}>*</i></label>
                            <PhoneInput
                                international
                                countryCallingCodeEditable={false}
                                defaultCountry="BD"
                                value={value}
                                className='form-control'
                                onChange={setValue}
                            />
                        </div>
                    </div>
                    <div className='row mt-5'>
                        <div className='form-group col-lg-12'>
                            <label className='level-title mt-5'>Address<i style={{ color: "red" }}>*</i></label>
                            <textarea id="address" type="text" rows="5" placeholder='Ex. mirpur, dhaka'
                                className='form-control' name="address" value={inputs.address || ""}
                                onChange={handleChange}></textarea>
                        </div>
                    </div>
                </div>;
            case 2:
                return <div className='steper-height ml-5'>
                    <div>
                        <span className="create-field-title">Depot Area</span>
                        <p style={{ color: "#B6B6B6" }}>If you need more info, please check out <NavLink
                            to="/inventory/configure/depot-configure/list" className="faq-title"><u>FAQ
                                Page</u></NavLink></p>
                    </div>
                    {depotCompanyLocationList.map((element, index) => (
                        <div className="row" key={index}>
                            <div className="form-group col-xl-12 float-right">
                                {
                                    index === 0 ?
                                        <button
                                            id="more-btn-id"
                                            type="button"
                                            className="btn float-right"
                                            onClick={() => addDepotAreaFields(index)}
                                        >
                                            <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/blue-add.svg")} />
                                        </button>
                                        :
                                        <div className="text-right">
                                            <button
                                                type="button"
                                                className="btn"
                                                onClick={() => removeDepotArea(index)}
                                            >
                                                <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/red-delete.svg")} />
                                            </button>
                                            <button
                                                id="more-btn-id"
                                                type="button"
                                                className="btn"
                                                onClick={() => addDepotAreaFields(index)}
                                            >
                                                <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/blue-add.svg")} />
                                            </button>
                                        </div>

                                }
                            </div>
                            <div className='col-xl-12 guarantee-cheque-div'>
                                <span>Depot Area to({index + 1})</span>
                            </div>

                            <div className="col-xl-12 mt-5">
                                <div className='row mt-5'>
                                    <div className='col-xl-9'>
                                        <div>
                                            <label className='level-title'>Company</label>
                                            <select className="form-control" id={"companyId-id-" + index} name="companyId"
                                                value={element.companyId || ""}
                                                onChange={(event) => handleCompanyChange(event, index)}>
                                                <option value="">Please Select Company</option>
                                                {companyList.map((c) => (
                                                    <option key={c.id} value={c.id}>{c.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="row mt-5">
                                    <div className='form-group col-xl-9 mt-5'>
                                        <div>
                                            <label className='level-title'>Location</label>
                                            <select id={"areaId-id-" + index} name="areaIdArray" className="form-control">
                                                <option value="">Please Select Location</option>
                                                {
                                                    element.areaIdArray.map((area) => (
                                                        <option key={area.id} value={area.id}>{area.name}</option>
                                                    ))
                                                }
                                            </select>
                                        </div>
                                        <div
                                            id={"divFiles-id-" + index}
                                            className="mt-3"
                                            value={element.areaList || ""} style={{ border: "none", padding: "0 3px 3px 3px" }}>
                                            {element.areaList.map(data => {
                                                return (
                                                    <>
                                                        {
                                                            data.id !== "" ?
                                                                <span className='mt-3 mr-5 areaLevel'
                                                                >
                                                                    {data.name}
                                                                    <span className='deleteIcon'>
                                                                        <a
                                                                            className='fa fa-times text-white delete-file'
                                                                            onClick={() => deleteArea(index, data)}
                                                                        ></a>
                                                                    </span>
                                                                </span> : ""
                                                        }
                                                    </>
                                                )
                                            })}
                                        </div>
                                    </div>
                                    <div className='form-group col-xl-3' style={{ marginTop: "43px" }}>
                                        <button type="button" className="btn btn-primary" data-toggle="tooltip"
                                            data-placement="bottom" title="Add Location" onClick={() => handleAreaChange(index)}>+ Add Area
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>;
            case 3:
                return <div className='steper-height ml-5'>
                    <div>
                        <span className="create-field-title">Depot Status</span>
                        <p style={{ color: "#B6B6B6" }}>If you need more info, please check out <NavLink
                            to="/inventory/configure/depot-configure/list" className="faq-title"><u>FAQ
                                Page</u></NavLink></p>
                    </div>
                    <div style={{ marginTop: "50px" }}>
                        <label className='level-title'>Active Status<i style={{ color: "red" }}>*</i></label>
                        <br />
                        <FormControlLabel
                            control={<IOSSwitch name="isActive" checked={inputs.isActive} value={inputs.isActive}
                                onChange={(event) => handleChange(event)} />}
                            label={inputs.isActive ? 'Active' : 'Inactive'}
                        />
                    </div>
                    <div style={{ marginTop: "30px" }}>
                        <label className='level-title mr-3'>Is Central Warehouse</label>
                        <input className="form-check-input ml-0" type="checkbox" name="isCentralWarehouse"
                            value={inputs.isCentralWarehouse} checked={inputs.isCentralWarehouse} onChange={handleChange} />
                    </div>

                    <div className='mt-5 row'>
                        <div className='col-xl-8'>
                            <div style={{ marginTop: "30px" }}>
                                <label className='level-title'>Depot Manager</label><br />
                                <Autocomplete
                                    name="depotManagerId"
                                    options={depotManager}
                                    onKeyDown={getApplicationUser}
                                    getOptionLabel={(option) => option.name + " -[" + option.email + "]"}
                                    value={depotManagerValue}
                                    onChange={(event, newValue) => {                                        
                                        checkUserAlreadyAssignedForDepotIncharge(newValue);
                                        // setDepotManagerValue(newValue)
                                        // if(newValue !== null){
                                        //     setInputs({ ...inputs, depotManagerId: newValue.id });
                                        // }
                                    }}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Select Depot Manager*" />
                                    )}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="row mt-5">
                        <div className='form-group col-xl-9 mt-5'>
                            <div>
                                <label className='level-title'>Quality Assurance</label>
                                <Autocomplete
                                    id="depotIncharges"
                                    name="depotInchargesId"
                                    onKeyUp={getApplicationQA}
                                    value={values}
                                    options={depotIncharges}
                                    getOptionLabel={(option) => option.name + " -[" + option.email + "]"}
                                    onChange={(event, newValue) => {
                                        setValues(newValue)
                                        checkUserAlreadyAssignedForQa(newValue)
                                        //if (qaMap === false) {
                                        // if(newValue !== null) {
                                        //     if(qAList.length > 0){
                                        //         let temp = [...qAList]
                                        //         const index = temp.findIndex(data => data.depotInchargeId === newValue.id);  
                                        //         if(index > -1){
                                        //             showError("This user already used");
                                        //             return;
                                        //         }else{
                                        //             temp.push({
                                        //                 "depotInchargeId":newValue.id,
                                        //                 "name":newValue.name,
                                        //                 "email":newValue.email
                                        //             })
                                        //             setQAList(temp)
                                        //         }   
                                        //     }else{
                                        //         const temp = [...qAList]
                                        //         temp.push({
                                        //             "depotInchargeId":newValue.id,
                                        //             "name":newValue.name,
                                        //             "email":newValue.email
                                                    
                                        //         })
                                        //         setQAList(temp)
                                        //     }
                                        // }
                                       
                                   //}
                                    }}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Select Quality Assurance*" />
                                    )}
                                />
                            </div>
                            <div
                                id="divFiles"
                                className="mt-3"
                                style={{ border: "none", padding: "0 3px 3px 3px" }}>
                                {qAList.length > 0?qAList.map(data => {
                                    return (
                                        <>
                                            {
                                                data.id !== "" ?
                                                    <span className='mt-3 mr-5 areaLevel'
                                                    >
                                                        {data.name + " - [" + data.email + "]"}
                                                        <span className='deleteIcon'>
                                                            <a
                                                                className='fa fa-times text-white delete-file'
                                                                onClick={() => deleteDepotIncharge(data)}
                                                            ></a>
                                                        </span>
                                                    </span> : ""
                                            }
                                        </>
                                    )
                                }):""}
                            </div>
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
                            <p style={{ marginBottom: "0px" }}
                                className="create-field-title">{responseData && responseData.success === true ? "Thank You" : "Sorry"}</p>
                            <span className='text-muted'>{responseData ? responseData.message : ""}</span>
                        </div>
                        <div className='thanks-sub-title mt-12'>
                            <strong style={{ fontSize: "17px" }}>Depot Profile</strong>
                        </div>
                        <div className='mt-5'>
                            <span className="chip thanks-chip-title"
                                style={{ padding: "10px 20px" }}>{inputs.depotName}</span>
                        </div>
                    </div>
                </div>;
        }
    }
    const backToListPage = () => {
        props.history.push("/inventory/configure/depot-configure");
    }
    return (
        <>
            <div style={{ marginTop: "-30px", marginLeft: "-18px" }}>
                <nav aria-label="breadcrumb">
                    <ol className="breadCrum-bg-color">
                        <li aria-current="page" className='breadCrum-main-title'>{parentCompany?.name}</li>
                        <li aria-current="page"
                            className='mt-1 breadCrum-sub-title'>&nbsp;Inventory&nbsp;&nbsp;&nbsp;&nbsp;</li>
                        <li aria-current="page" className='mt-1 breadCrum-sub-title text-primary'><span
                            className='font-weight-bolder'>.</span>&nbsp; Configure &nbsp;&nbsp;</li>
                        <li aria-current="page" className='mt-1 breadCrum-sub-title text-primary'><span
                            className='font-weight-bolder'>.</span>&nbsp; Depot Configure
                        </li>
                    </ol>
                </nav>
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
                                    <p className="dark-gray-color" style={{ fontWeight: "500" }}>
                                        <NavLink to="/inventory/configure/depot-configure/list">&nbsp; Back to depot
                                            configure menu
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
                                <div>
                                    <Button
                                        id="backBtn"
                                        //disabled={activeStep === 0}
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
                                        className="float-right"
                                    >
                                        {activeStep === steps.length - 2 ? 'Save' : 'Next'}
                                    </Button>
                                    <div style={{ textAlign: 'center' }}>
                                        <Button
                                            style={{ visibility: "hidden", marginLeft: '20px', width: '140px' }}
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