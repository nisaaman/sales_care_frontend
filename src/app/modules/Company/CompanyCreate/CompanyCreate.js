import React, {useEffect, useRef, useState} from 'react';
import {NavLink, Route, useLocation} from "react-router-dom";
import {Card, CardBody,} from "../../../../_metronic/_partials/controls";
import {useSubheader} from "../../../../_metronic/layout";
//stepper
import {makeStyles} from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import {toAbsoluteUrl} from "../../../../_metronic/_helpers";
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import {showError} from "../../../pages/Alert";
import LevelTreeModal from '../../Location/location-create/LevelTreeModal'
import LevelSetup from '../../Location/location-create/LevelSetup'
import LocationTree from '../../Location/location-create/LocationTree'
import axios from "axios";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { validateEmail} from '../../Util';

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
function getSteps() {
  return ['Logo & Name', 'Contact & Address', 'Location Tree', 'Completed'];
}

export function CompanyCreate(props) {
  // Subheader
  const subheader = useSubheader();
  const [profileImg, setProfileImg] = useState(toAbsoluteUrl("/images/copmanylogo.png"));
  const [successImg, setSuccessImg] = useState(toAbsoluteUrl("/images/success2.png"));
  //stepper wit metronic
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();
  const [fileList, setFileList] = useState([]);
  const [inputs, setInputs] = useState({});
  const [value, setValue] = useState();
  const routeLocation = useLocation();
  const [imageText, setImageText] = useState('');
  const [compantyId, setCompantyId] = useState('');
  const [responseData, setResponseData] = useState();

  //start location tree related
  const [locationTreeName, setLocationTreeName] = useState({name: ""});
  const [locationTypes, setLocationTypes] = useState([]);
  const [locationTree, setLocationTree] = useState([]);
  const [locationTreeDepth, setLocationTreeDepth] = useState(0);
  const initialLocationTypes = useRef([{name: '', level: 0}]);
  const [isNewLocation, setIsNewLocation] = useState(false);
  //end location tree related

  const subTitle = ["Add company logo & name", "Insert Company other Info", "Set Business Location Tree", "Woah, we are here"];
  const locationUIEvents = {
    newLocationButtonClick: () => {
      props.history.push("/company/new/new-company-location");
    },
  };
  const [locationTreeList, setLocationTreeList] = useState();
  const [organizationId, setOrganizationId] = useState(1);

  const [checkBoxStatus, setCheckBoxStatus] = useState(false);
  const [locationDropdownDisable, setLocationDropdownDisable] = useState(true);

  useEffect(() => {
    let _title = "Company | List of Company  -Create New";
    // setTitle(_title);
    subheader.setTitle(_title);
    if (routeLocation.state) { // edit
      getProps();
    }
    getAllLocationTree();
  }, []);

  useEffect(() => {
    setLocationDropdownDisable(checkBoxStatus === true ? true : false);
  }, [checkBoxStatus]);

  const getAllLocationTree = () => {
    const URL = `${process.env.REACT_APP_API_URL}/api/location-tree/get-by-organization-id/${organizationId}`;
    axios.get(URL).then(response => {
      if (response.data.success === true) {
        setLocationTreeList(response.data.data);
      }
    }).catch(err => {
      showError(err);
    });
  }

  const getProps = () => {
    const editObj = routeLocation.state.row;
    getCompanyInfoById(editObj.id);
  }
  //for file/image
  const imageHandler = (e) => {

    var x = document.getElementById("demoImg");
    x.style.display = "block";

    setImageText('');

    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setProfileImg(reader.result);
      }
    }
    reader.readAsDataURL(e.target.files[0])

    const tempFile = [...fileList]
    var input = document.getElementById('fileUploader');
    if (input.files.length < 1)
      return false;

    let count = 0;
    for (var i = 0; i < input.files.length; i++) {
      if (fileValidation(input.files.item(i))) {
        tempFile.push(input.files.item(i));
      } else {
        count++;
        continue;
      }
    }

    if (count > 0) {
      showError('Some files are not supported due to file extention or file size.');
    }
    setFileList(tempFile);
  }

  const fileValidation = (file) => {
    const regex = /^([a-zA-Z0-9\s_\\.\-:])+(.jpg|.png|.jpeg)$/;
    const isCorrectFormat = regex.test(file.name.toLowerCase());
    const fileSize = 1; //MB

    if (!isCorrectFormat) {
      return false;
    }

    if ((file.size / 1024 / 1024) > fileSize) {
      return false;
    }

    return true;
  }

  const handleCheckBoxChange = (event) => {
    setCheckBoxStatus(event.target.checked);
    if (event.target.checked === true) {
      setIsNewLocation(true);
      document.getElementById('customLocationTree').style.visibility = 'visible';
      setInputs(values => ({ ...values, ['locationTreeId']: '' }));
      document.getElementById('locationTreeId').disabled = true;
    } else {
      document.getElementById('customLocationTree').style.visibility = 'hidden';
      setIsNewLocation(false);
      document.getElementById('locationTreeId').disabled = false;
    }
  }

  const getCompanyInfoById = (id) => {
    setCompantyId(id);
    const URL = `${process.env.REACT_APP_API_URL}/api/organization/${id}`;
    axios.get(URL).then(response => {
      const obj = response.data.organization;
      if (response.data.imageString !== undefined) {
        setImageText(response.data.imageString);
      }

      setInputs({
        id: obj.id,
        email: obj.email,
        contactPerson: obj.contact_person,
        name: obj.name,
        parentId: obj.parent_id,
        remarks: obj.remarks,
        shortName: obj.short_name,
        subscriptionPackageId: obj.subscription_package_id,
        webAddress: obj.web_address,
        address: obj.address,
        contactNumber: obj.contact_number,
        isActive: obj.is_active,
        documentId: obj.documentId,
        locationTreeId: obj.location_tree_id
      });
    });
  }

  const handleInputsChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs(values => ({ ...values, [name]: value }));
  }

  function handleNext() {
    if (activeStep >= 0) {
      document.getElementById('backBtn').style.visibility = 'visible';
    }
    if (activeStep === 0) {
      if (inputs.name === undefined || inputs.name === null || inputs.name.trim() === '') {
        document.getElementById('backBtn').style.visibility = 'hidden';
        showError("Company Name is required.");
        return false;
      }
      else if (inputs.shortName === undefined || inputs.shortName === null || inputs.shortName.trim() === '') {
        document.getElementById('backBtn').style.visibility = 'hidden';
        showError("Short Name is required.");
        return false;
      }

      setActiveStep(prevActiveStep => prevActiveStep + 1);
    }
    else if (activeStep === 1) {
      if (inputs.email === undefined || inputs.email === null || inputs.email.trim() === '') {              
        showError("Email is required.");
        return false;
      } 
      else if (!validateEmail(inputs.email)) {
        showError("Invalid Email.");
        return false;
      }
      else if ((inputs.contactNumber === undefined || inputs.contactNumber === null || inputs.contactNumber === '') && (value === undefined || value === null || value === '')) {
        showError("Contact Number is required.");
        return false;
      }
      else if (inputs.contactPerson === undefined || inputs.contactPerson === null || inputs.contactPerson.trim() === '') {
        showError("Contact Person is required.");
        return false;
      }
      else if (inputs.address === undefined || inputs.address === null || inputs.address.trim() === '') {
        showError("Address is required.");
        return false;
      }

      setInputs(values => ({ ...values, "parentId": 1 }));
      setInputs(values => ({ ...values, "subscriptionPackageId": 1 }));
      if (value) {
        const name = "contactNumber";
        setInputs(values => ({ ...values, [name]: value }));
      }
      if(inputs.webAddress === undefined || inputs.webAddress === null || inputs.webAddress.trim() === '' ){
        setInputs(values => ({ ...values, "webAddress": null }));
      }

      setActiveStep(prevActiveStep => prevActiveStep + 1);
    }
    else if (activeStep === 2) {
      //location tree validation would be here in if condition and below all code would be else block.
      if (!isNewLocation) {
        if (inputs.locationTreeId === undefined || inputs.locationTreeId === null || inputs.locationTreeId === '') {
          showError("Location Tree is required.");
          return false;
        } else {
          if (routeLocation.state) {  // update
            updateCompany();
          } else { //save
            saveCompany();
          }
        }
      } else {

        if (routeLocation.state) {  // update
          updateCompany();
        } else { //save
          saveCompany();
        }
        
      }
     
    }
  }

  function handleBack() {
    if (activeStep === 1) {
      document.getElementById('backBtn').style.visibility = 'hidden';
    }
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  }

  const hideButton = () => {
    document.getElementById('nextBtn').style.visibility = 'hidden';
    document.getElementById('backBtn').style.visibility = 'hidden';
    document.getElementById('gotItBtn').style.visibility = 'visible';
  }

  const saveCompany = () => {
    let formData = new FormData();
    let requestObject = inputs;
    requestObject.isNewLocation = isNewLocation;
    if (isNewLocation) {
      if (!isValidateLocationTree()) {
        return 0;
      }
      const masterLocationObject = getLocationNameObject();
      masterLocationObject.locationTypeList = getLocationTypeList();
      masterLocationObject.locationTree = getLocationTree();
      requestObject.locationTreeDto = masterLocationObject;
    }

    formData.append("organization", new Blob([JSON.stringify(requestObject)], { type: "application/json" }));
    fileList.forEach(file => {
      formData.append("logo", file);
    })

    const URL = `${process.env.REACT_APP_API_URL}/api/organization`;
    axios.post(URL, formData, { headers: { "Content-Type": false } }).then(response => {
      setResponseData(response.data);
      if (response.data.success === true) {
        //resetInputsData();
        setActiveStep(prevActiveStep => prevActiveStep + 1);
        hideButton();
        setFormRelatedStateToEmpty();
      }else{
        showError(response.data.message);
      }
    }).catch(err => {
      showError(err);
    });
  }

  const updateCompany = () => {
    let formData = new FormData();
    let requestObject = inputs;
    requestObject.isNewLocation = isNewLocation;
    if (isNewLocation) {
      if (!isValidateLocationTree()) {
        return 0;
      }
      const masterLocationObject = getLocationNameObject();
      masterLocationObject.locationTypeList = getLocationTypeList();
      masterLocationObject.locationTree = getLocationTree();
      requestObject.locationTreeDto = masterLocationObject;
    }

    formData.append("organization", new Blob([JSON.stringify(requestObject)], { type: "application/json" }));
    fileList.forEach(file => {
      formData.append("logo", file);
    })
    const URL = `${process.env.REACT_APP_API_URL}/api/organization`;
    axios.put(URL, formData, { headers: { "Content-Type": false } }).then(response => {
      setResponseData(response.data);
      if (response.data.success === true) {
        //resetInputsData();
        setActiveStep(prevActiveStep => prevActiveStep + 1);
        hideButton();
        setFormRelatedStateToEmpty();
      }else{
        showError(response.data.message);
      }
    }).catch(err => {
      showError(err);
    });
  }

  // =========================start location tree related function ========================
  const getLocationNameObject = () => {
    return {
      name: locationTreeName.name,
      description: null,
      organizationId: 2
    };
  }

  const getLocationTypeList = () => {
    let locationTypeList = [];
    for (let i = 0; i < locationTypes.length; i++) {
      locationTypeList[i] = {
        id: locationTypes[i].id,
        name: locationTypes[i].name,
        level: i + 1,
        organizationId: 2,
      }
    }
    return locationTypeList;
  }

  const getLocationTree = () => {
    return locationTree;
  }

  const setFormRelatedStateToEmpty = () => {
    setLocationTreeName("");
    setLocationTypes([]);
    setLocationTree([]);
  }

  function getLocationTreeDepth(treeArray) {
    if (treeArray.length === 0) {
      return 0;
    } else {
      let max = 0;
      for (let i = 0; i < treeArray.length; i++) {
        max = Math.max(max, getLocationTreeDepth(treeArray[i].children));
      }
      return 1 + max;
    }
  }

  const isValidateLocationTree = () => {
    let valid = true;
    if (isLocationTreeNameFieldEmpty()) {
      valid = false;
      return valid;
    }
    if (isAnyLocationTypeFieldEmpty(locationTypes)) {
      valid = false;
      return valid;
    }
    if (isLocationTreeEmpty()) {
      valid = false;
      return valid;
    }
    return valid;
  }

  const isLocationTreeNameFieldEmpty = () => {
    let empty = false;
    if (typeof (locationTreeName.name) === "undefined" || locationTreeName.name.trim() === '') {
      empty = true;
      showError("Location Tree Name is empty");
    }
    return empty;
  }

  const isAnyLocationTypeFieldEmpty = (listOfFields = []) => {
    let empty = false;
    let length = listOfFields.length;
    if (length === 0) {
      showError("Location Type is empty at Level 1");
      empty = true;
    }
    for (let i = 0; i < length; i++) {
      if (typeof (listOfFields[i].name) === "undefined" || listOfFields[i].name.trim() === '') {
        empty = true;
        showError("Location Type is empty at Level " + (i + 1)); // level is start from 1 , not from 0
        break;
      }
    }
    return empty;
  }

  const isLocationTreeEmpty = () => {
    let empty = false;
    if (locationTree.length === 0) {
      showError("Location Tree is empty");
      empty = true;
    }
    return empty;
  }

  const addNode = (locTree, treeLevel, locationNode) => {
    locTree.map((node) => {  // traverse every node to find match
      if (node.treeLevel === treeLevel) {
        node.children.push(locationNode);
        return;
      } else {
        addNode(node.children, treeLevel, locationNode);
        return;
      }
    });
  }

  const updateNode = (locTree, treeLevel, locationParams) => {
    locTree.map((node) => {  // traverse every node to find match
      if (node.treeLevel === treeLevel) {
        node.name = locationParams.locationName;
        return;
      } else {
        updateNode(node.children, treeLevel, locationParams);
        return;
      }
    });
  }

  const deleteNode = (locTree, treeLevel) => {
    for (let i = 0; i < locTree.length; i++) {
      if (locTree[i].treeLevel === treeLevel) {
        locTree.splice(i, 1); //remove that node
        return;
      } else {
        deleteNode(locTree[i].children, treeLevel);
      }
    }
  }

  const addTreeNode = (node) => {
    if (locationTypes.length == 0) {
      showError("Please Add Location Type");
      return;
    } else if (isAnyLocationTypeFieldEmpty(locationTypes)) {
      return;
    }
    props.history.push({pathname: '/company/new/new-company-location', state: node});
  }

  const updateTreeNode = (node) => {
    node.action = 'update';
    props.history.push({pathname: '/company/new/new-company-location', state: node});
  }

  const deleteTreeNode = (node) => {
    let locTree = locationTree;
    deleteNode(locTree, node.treeLevel);
    props.history.push("/company/new");
  }
  // =========================end location tree related function =======================

  function getStepContent(step) {
    switch (step) {
      case 0:
        return <div className='steper-height ml-5'>
          <div style={{ marginTop: "60px" }}>
            <p style={{ marginBottom: "0px" }} className="create-field-title">Company Logo & Name</p>
            <span style={{ color: "#B6B6B6" }}>If you need more info, please check out <NavLink to="/company-create" className="faq-title"><u>FAQ Page</u></NavLink></span>
          </div>
          <div className='row'>
            <div className='col-lg-12' style={{ textAlign: "center" }}>
              <div className='row'>
                <div className='col-lg-12' style={{ textAlign: "center", marginBottom: "50px" }}>
                  <div className="image-input image-input-circle" data-kt-image-input="true">
                    <div className="image-input-wrapper w-125px h-125px"></div>
                    <label className="btn btn-icon btn-circle btn-color-muted btn-active-color-primary w-25px h-25px bg-body shadow"
                           data-kt-image-input-action="change"
                           data-bs-toggle="tooltip"
                           data-bs-dismiss="click"
                           title="Change Company Picture">
                      <div id="demoImg">
                        <img className="image-input image-input-circle"
                             src={imageText === "" ? profileImg : `data:image/jpeg;base64,${imageText}`}
                             style={{ width: "150px", height: "150px", textAlign: "center" }} alt='Company Picture' />
                      </div>
                      <div className='imgUploadDiv'>
                        <i className="bi bi-pencil-fill fs-7" style={{ fontSize: "12px", padding: "7px", color: "white" }}></i>
                      </div>
                      <input id="fileUploader" type="file" name="profileImage" multiple
                             onChange={imageHandler} accept=".png, .jpg, .jpeg" />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='row mt-6'>
            <div className='col-lg-12' style={{ textAlign: "center" }}>
              <label className='level-title'>Upload new company logo</label>
            </div>
          </div>
          <div className='row mt-5'>
            <div className='form-group col-lg-7'>
              <label className='level-title'>Company Name<span className="text-danger">*</span></label>
              <input id="name" type="text" className='form-control' name="name" value={inputs.name || ""} onChange={handleInputsChange}></input>
            </div>
            <div className='form-group col-lg-5'>
              <label className='level-title'>Short Name<span className="text-danger">*</span></label>
              <input id="shortName" type="text" className='form-control' name="shortName" value={inputs.shortName || ""} onChange={handleInputsChange}></input>
            </div>
          </div>
        </div>;
      case 1:
        return <div className='steper-height ml-5'>
          <div style={{ marginTop: "60px" }}>
            <p style={{ marginBottom: "0px" }} className="create-field-title">Company Contact & Address</p>
            <span style={{ color: "#B6B6B6" }}>If you need more info, please check out <NavLink to="/company-create" className="faq-title"><u>FAQ Page</u></NavLink></span>
          </div>
          <div className='row mt-17'>
            <div className='form-group col-lg-12'>
              <label className='level-title'>Company Email<span className="text-danger">*</span></label>
              <input id="email" type="text" className='form-control' name="email" value={inputs.email || ""} onChange={handleInputsChange}></input>
            </div>
          </div>
          <div className='row'>
            <div className='form-group col-lg-12'>
              <label className='level-title'>Company Website</label>
              <input id="webAddress" type="text" className='form-control' name="webAddress" value={inputs.webAddress || ""} onChange={handleInputsChange}></input>
            </div>
          </div>
          <div className='row'>
            <div className='form-group col-lg-12'>
              <label className='level-title'>Contact<span className="text-danger">*</span></label>
              <PhoneInput
                  international
                  countryCallingCodeEditable={false}
                  defaultCountry="BD"
                  value={inputs.contactNumber || ""}
                  className='form-control'
                  onChange={setValue}
              />
            </div>
          </div>
          <div className='row'>
            <div className='form-group col-lg-12'>
              <label className='level-title'>Contact Person<span className="text-danger">*</span></label>
              <input id="contactPerson" type="text" className='form-control' name="contactPerson" value={inputs.contactPerson || ""} onChange={handleInputsChange}></input>
            </div>
          </div>
          <div className='row'>
            <div className='form-group col-lg-12'>
              <label className='level-title'>Address<span className="text-danger">*</span></label>
              <textarea rows="5" id="address" type="text" className='form-control' name="address" value={inputs.address || ""} onChange={handleInputsChange} placeholder='Ex. mirpur, dhaka'></textarea>
            </div>
          </div>
          <div className='row'>
            <div className='form-group col-lg-12'>
              <label className='level-title'>Remarks</label>
              <textarea rows="5" id="remarks" type="text" className='form-control' name="remarks" value={inputs.remarks || ""} onChange={handleInputsChange} placeholder='Software Development Company'></textarea>
            </div>
          </div>
        </div>;
      case 2:
        return <div className='steper-height ml-5'>
          <div style={{ marginTop: "60px" }}>
            <p style={{ marginBottom: "0px" }} className="create-field-title">Business Location Tree</p>
            <span style={{ color: "#B6B6B6" }}>If you need more info, please check out <NavLink to="/company-create" className="faq-title"><u>FAQ Page</u></NavLink></span>
          </div>
          <div className='row' style={{ marginTop: "40px" }}>
            <div className='col-lg-12'>
              <label className='level-title'>Choose a location tree<span className="text-danger">*</span></label>
              <select
                  id="locationTreeId"
                  name="locationTreeId"
                  className="form-control"
                  onChange={handleInputsChange}
                  value={inputs.locationTreeId || ""}
                  disabled={locationDropdownDisable}
              >
                <option value="">Choose a location tree</option>
                {locationTreeList.map((data) => (
                    <option key={data.id} value={data.id}>
                      {data.name}
                    </option>
                ))}
              </select>
            </div>
          </div>
          <div className='row'>
            <div className='form-group col-lg-12' style={{ marginTop: "20px" }}>
              <FormGroup aria-label="position" name="position"
                         value=""
                         row>
                <FormControlLabel
                    value="end"
                    control={<Checkbox color="primary" />}
                    label="Create new custom business location tree"
                    labelPlacement="end"
                    checked={checkBoxStatus}
                    onChange={handleCheckBoxChange}
                />
              </FormGroup>
            </div>
          </div>
          <div id='customLocationTree' style={{ visibility: "hidden" }}>
            <div className='row'>
              <div className='form-group col-lg-12'>
                <label className='level-title'>Name the business location tree<span className="text-danger">*</span></label>
                <input type="text" className='form-control'
                       value={locationTreeName.name}
                       onChange={(event) => setLocationTreeName({
                         ...locationTreeName,
                         name: event.target.value
                       })}
                       maxLength={100}
                ></input>
              </div>
            </div>
            <p className='level-title'>Custom Business Location Tree Setup<span className="text-danger">*</span></p>
            <div className='row'>
              <div className='form-group col-lg-6 border border-left-0 border border-light border-primary border-bottom-0 border-top-0'>
                <label>
                  <img src={toAbsoluteUrl("/images/loc2.png")}
                       style={{ width: "12px", height: "10px", textAlign: "center" }} alt='Company Picture' />
                  <strong style={{ marginLeft: "10px", color: "#828282" }}>Location Type Setup</strong>
                </label>
                <div style={{ paddingLeft: "30px" }}>
                  <LevelSetup setLocationTypes={setLocationTypes}
                              maxDepthOfLocationTree={locationTreeDepth}
                              locationTypes={initialLocationTypes.current}/>
                </div>
              </div>
              <div className='form-group col-lg-6'>
                <label>
                  <img src={toAbsoluteUrl("/images/loc3.png")}
                       style={{ width: "14px", height: "14px", textAlign: "center" }} alt='Company Picture' />
                  <strong style={{ marginLeft: "10px", color: "#828282" }}>Location Tree</strong>
                </label>
                <div style={{ paddingLeft: "30px" }}>
                  <img src={toAbsoluteUrl("/images/loc1.png")}
                       style={{ width: "20px", height: "20px", textAlign: "center" }} alt='Company Picture' />
                  <button
                      type="button"
                      className="btn ml-0 btn-sm"
                      onClick={(event) => {
                        event.preventDefault();
                        addTreeNode(); //most top level
                    }}
                  >
                    <i className="bi bi-plus-circle-fill text-primary" style={{ fontSize: "18px", marginLeft: "-4px" }}></i>
                  </button>
                  <nav className="tree-nav">
                  <LocationTree tree={locationTree} addTreeNode={addTreeNode}
                                                  updateTreeNode={updateTreeNode} deleteTreeNode={deleteTreeNode}
                                                  maxDepth={locationTypes.length}/>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>;
      default:
        return <div className='row steper-height ml-5'>
          <div className='col-lg-12' style={{ textAlign: "center", marginTop: "10px" }}>
            <img
                src={successImg}
                style={{ width: "84px", height: "84px", textAlign: "center", marginTop: "80px" }} alt='Company Picture' />
            <div className='mt-5'>
              <p style={{ marginBottom: "0px" }} className="create-field-title">Thank You</p>
              <span>{compantyId ? "Company has been Updated Successfully" : "New Company has been Created Successfully"}</span>
            </div>
            <div className='thanks-sub-title mt-12'>
              <strong style={{ fontSize: "17px", fontWeight: "bold" }}>Company Name</strong>
            </div>
            <div className='mt-5'>
              <span className="chip thanks-chip-title" style={{ padding: "10px 20px" }}>{inputs.name}</span>
            </div>
          </div>
        </div>;
    }
  }

  const backToListPage = () => {
    props.history.push("/company");
  }

  return (
      <>
        <div style={{ marginTop: "-30px", marginLeft: "-18px" }}>
          <nav aria-label="breadcrumb">
            <ol className="breadCrum-bg-color">
              <li aria-current="page" className='breadCrum-main-title'>Company</li>
              <li aria-current="page" className='mt-1 breadCrum-sub-title'>&nbsp;List of Company&nbsp;&nbsp;&nbsp;&nbsp;</li>
              <li aria-current="page" className='mt-1 breadCrum-sub-title text-primary'><span className='font-weight-bolder'>.</span>&nbsp;{compantyId ? "Update" : "Create New"}</li>
            </ol>
          </nav>
        </div>
        <Route path="/company/new/new-company-location">
          {({ history, match }) => (
              <LevelTreeModal
                  node={routeLocation.state}
                  show={match != null}
                  onHide={() => {
                    history.push("/company/new");
                  }}
                  handleSubmit={(locationParams) => {
                    let locTree = locationTree;
                    if (typeof routeLocation.state !== 'undefined' && routeLocation.state.action === 'update') {  // for update existing
                      updateNode(locTree, routeLocation.state.treeLevel, locationParams);
                    } else { // for add new
                      let treeLevel = ''
                      let locationNode = {
                        id: null,
                        name: locationParams.locationName,
                        treeLevel: treeLevel,
                        children: []
                      };
                      if (typeof routeLocation.state === 'undefined') {  //  top layer node add
                        treeLevel = '' + (locationTree.length + 1);
                        locationNode.treeLevel = treeLevel;
                        locTree.push(locationNode);
                      } else {  // any child node add
                        treeLevel = routeLocation.state.treeLevel + '-' + (routeLocation.state.children.length + 1);
                        locationNode.treeLevel = treeLevel;
                        addNode(locTree, routeLocation.state.treeLevel, locationNode);
                      }
                    }
                    history.push("/company/new");
                  }}
              />
          )}
        </Route>
        <Card>
          <CardBody>
            <div className="row">
              <div className="col-lg-3 border border-left-0 border border-light border-primary border-bottom-0 border-top-0">
                <NavLink to="/company">
                  <span><i className="bi bi-chevron-left"></i></span> &nbsp; Back to List of Company
                </NavLink>
                <div className={classes.root}>
                  <Stepper activeStep={activeStep} orientation="vertical">
                    {steps.map((label, index) => (
                        <Step key={label}>
                          <StepLabel optional={<Typography component={"span"} variant="caption">{subTitle[index]}</Typography>}>{label}</StepLabel>
                        </Step>
                    ))
                    }
                  </Stepper>
                </div>
              </div>
              <div className="col-lg-9">
                <Typography component={"span"}>{getStepContent(activeStep)}</Typography>
                <div className={classes.actionsContainer}>
                  <div>
                    <Button
                        style={{ visibility: "hidden" }}
                        id="backBtn"
                        disabled={activeStep === 0}
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
                          visibility="hidden"
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