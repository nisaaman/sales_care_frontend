import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
} from "../../../../../../_metronic/_partials/controls";
import { useSubheader } from "../../../../../../_metronic/layout";
import { toAbsoluteUrl } from "../../../../../../_metronic/_helpers";
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { NavLink, useHistory } from 'react-router-dom';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import axios from "axios";
import { showError } from '../../../../../pages/Alert';
import { shallowEqual, useSelector } from 'react-redux';
import { allowOnlyNumeric, handlePasteDisable } from "../../../../Util";
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
  return ['Product Name', 'Unit of Measure', 'Pack Size', 'Outer Size', 'Completed'];
}
function numberValidator(e) {
  const regex = /[0-9.]/;
  // If the input is empty and the key pressed is "0" nothing is printed
  if (!e.target.value && e.key == 0) {
    e.preventDefault();
  } else {
    // If the key pressed is not a number or a period, nothing is printed
    if (!regex.test(e.key)) {
      e.preventDefault();
    }
  }
}

export function ProductProfileCreate({history, location}) {
  const companyId = useSelector((state) => state.auth.company, shallowEqual);
  const childCompanyList = useSelector((state) => state.auth.user.companies, shallowEqual);
  const selectedCompany = childCompanyList.find(it => it.id == companyId);
  const [profileImg, setProfileImg] = useState(toAbsoluteUrl("/images/success2.png"));
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();
  const [title, setTitle] = useState("");
  const [inputs, setInputs] = useState({});
  const [getUOM, setUOM] = useState([]);
  const [getPackSize, setPackSize] = useState([]);
  const [productSku, setProductSku] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [checkBoxStatus, setCheckBoxStatus] = useState(false);
  const [customUOMShow, setCustomUOMShow] = useState(true);
  const [uomDropdownDisable, setUomDropdownDisable] = useState(true);
  const [breadCrumb, setBreadCrumb] = useState([]);
  const rcvQuantityRef = useRef(null);
  

  const subTitle = ["Insert product description", "Setup Unit", "Set Your Payment Methods", "Review your information", "Woah, we are here"];

  // Subheader
  const suhbeader = useSubheader();
  useEffect(() => {
    let _title = "NTL |";
    setTitle(_title);
    suhbeader.setTitle(_title);
    getAllUOM();
    getAllPackSize();
    setBreadCrumb(location.state.breadCrum);

    if(location.state.data){
      let tempInputs = {
        "id": location.state.data.id, 
        "name": location.state.data.name.trim(),
        "expiryDays": location.state.data.expiry_days,
        "uomId": location.state.data.uom_id,
        "itemSize": location.state.data.item_size,
        "minimumStock": location.state.data.minimum_stock,
        "packSizeId": location.state.data.pack_size_id,
      }

      setInputs(tempInputs)
    }
    
  }, []);

  useEffect(() => {
    setCustomUOMShow(checkBoxStatus === true ? false : true);
    setUomDropdownDisable(checkBoxStatus === true ? true : false);
  }, [checkBoxStatus]);

  const getAllUOM = () => {
    const URL = `${process.env.REACT_APP_API_URL}/api/unit-of-measurement/getAllActiveUOM`;
    axios.get(URL).then(response => {
      return setUOM(response.data.data);
    });
  }

  const getAllPackSize = () => {
    const URL = `${process.env.REACT_APP_API_URL}/api/pack-size`;
    axios.get(URL).then(response => {
      return setPackSize(response.data.data);
    });
  }

  const handleCustomUnitChange = (event) => {
    setCheckBoxStatus(event.target.checked);
    handleCustomUnitSelect(event.target.checked);
  }

  const handleCustomUnitSelect = (checkValue) => {
    if (checkValue === true) {
      setInputs(values => ({ ...values, ['uomId']: '' }));
      document.getElementById('uomId').disabled = true;
    } else {
      setInputs(values => ({ ...values, ['customUOMName']: '' }));
      setInputs(values => ({ ...values, ['customUOMDescription']: '' }));
      document.getElementById('uomId').disabled = false;
    }
  }

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs(values => ({ ...values, [name]: value }));
  }

  const handleQuantity = (event) => {   
    const inputQuantity = event.target.value ? parseInt(event.target.value) : "";
    const name = event.target.name;
    if(inputQuantity === 0) {
       //document.getElementById("expiryDays").value = '';
      // showError("Invalid Expiry Days...")
     
       return false;
    }
    setInputs(values => ({ ...values, [name]: inputQuantity }));
     
}

  function handleNext() {
    let isForwardNextStep = true;
    if (activeStep >= 0) {
      document.getElementById('backBtn').style.visibility = 'visible';
    }
    if (activeStep === 0) {
      if (inputs.name === undefined || inputs.name === null || inputs.name.trim() === '') {
        document.getElementById('backBtn').style.visibility = 'hidden';
        showError("Product Name is required.");
        isForwardNextStep = false;
      }
      else if (inputs.expiryDays === undefined || inputs.expiryDays === null || inputs.expiryDays === '') {
        document.getElementById('backBtn').style.visibility = 'hidden';
        showError("Expiry Days is required.");
        isForwardNextStep = false;
      }
    }
    else if (activeStep === 1) {
      if ((inputs.uomId === undefined || inputs.uomId === null || inputs.uomId === '' || inputs.uomId === "null") && (inputs.customUOMName === undefined || inputs.customUOMName.trim() === null || inputs.customUOMName.trim() === "" || inputs.customUOMName === "null")) {
        showError("Unit of Measurement is required.");
        isForwardNextStep = false;
      }
    }
    else if (activeStep === 2) {
      if (inputs.itemSize === undefined || inputs.itemSize === null || inputs.itemSize === '') {
        showError("Item Size is required.");
        isForwardNextStep = false;
      }
      else if (inputs.minimumStock === undefined || inputs.minimumStock === null || inputs.minimumStock === '') {
        showError("Minimum Stock is required.");
        isForwardNextStep = false;
      }
      setInputs(values => ({ ...values, "companyId": companyId }));
      setInputs(values => ({ ...values, "productCategoryId": (breadCrumb.length>0) ? breadCrumb[breadCrumb.length-1].id : null }));      
    }
    else if (activeStep === 3) {
      if (inputs.packSizeId === undefined || inputs.packSizeId === null || inputs.packSizeId === '') {
        showError("Carton Size is required.");
        isForwardNextStep = false;
      } else {
        document.getElementById('nextBtn').style.visibility = 'hidden';
        document.getElementById('backBtn').style.visibility = 'hidden';
        document.getElementById('gotItBtn').style.visibility = 'visible';

        if(inputs.id){
          updateProduct();
        }else{
          saveProduct();
        }
        
      }
    }
    if (isForwardNextStep) {
      setActiveStep(prevActiveStep => prevActiveStep + 1);
    }
  }

  const saveProduct = () => {
    const URL = `${process.env.REACT_APP_API_URL}/api/product`;
    axios.post(URL, JSON.stringify(inputs), { headers: { "Content-Type": "application/json" } }).then(response => {
      //setResponseData(response.data);
      if (response.data.success == true) {
        setProductSku(response.data.data.productSku);
        setResponseMessage(response.data.message);
        //resetInputsData();
      }else{
        showError(response.data.message);
      }
    }).catch(err => {
      showError(err);
    });
  }
  
  const updateProduct = () => {
    const URL = `${process.env.REACT_APP_API_URL}/api/product`;
    axios.put(URL, JSON.stringify(inputs), { headers: { "Content-Type": "application/json" } }).then(response => {
      if (response.data.success == true) {
        setProductSku(response.data.data.productSku);
        setResponseMessage(response.data.message);
      }else{
        showError(response.data.message);
      }
    }).catch(err => {
      showError(err);
    });
  }

  function handleBack() {
    if (activeStep == 1) {
      document.getElementById('backBtn').style.visibility = 'hidden';
    }
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  }

  function getStepContent(step) {
    switch (step) {
      case 0:
        return <div>
          <div className="product-profile-breadcrum">
            <nav aria-label="breadcrumb">
              <ol class="breadCrum-bg-color">

                {breadCrumb && breadCrumb.length>0 && breadCrumb.map(row => {
                  return (
                    <>
                      <li aria-current="page" className='mt-1 breadCrum-sub-title' style={{ fontSize: "13px" }}>
                        <span><i class="bi bi-chevron-right"></i></span>&nbsp;
                        <span>{row.typeName} &nbsp;</span>
                        <span className="text-primary">{row.name} &nbsp;</span>
                      </li>
                    </>
                  )
                })}
                
              </ol>
            </nav>
          </div>
          <div className='steper-height ml-5'>
            <div>
              <p style={{ marginBottom: "0px" }} className="create-field-title">Product Description</p>
              <span style={{ color: "#B6B6B6", marginTop: "-10px" }}>If you need more info, please check out <NavLink to="/inventory/configure/product-configure/list" className="faq-title"><u>FAQ Page</u></NavLink></span>
            </div>
            <div className='row mt-10'>
              <div className='form-group col-lg-12'>
                <label className='level-title'>Name<i style={{color: "red"}}>*</i></label>
                <input id="name" type="text" className='form-control' name="name" value={inputs.name} 
                onChange={handleChange} maxlength="255"></input>
              </div>
            </div>
            <div className='row mt-5'>
              <div className='form-group col-lg-4'>
                <label className='level-title'>Expiry days<i style={{color: "red"}}>*</i></label>
                <input id="expiryDays" type="text" className='form-control' name="expiryDays" 
                value={inputs.expiryDays} onKeyPress={e => allowOnlyNumeric(e)} onChange={(e) => handleQuantity(e)} 
                onPaste={handlePasteDisable} maxlength="9"></input>
              </div>
              <div className='form-group col-lg-2'>
                <label style={{ marginTop: "35px" }} className='level-title'>Days</label>
              </div>
            </div>
          </div>
        </div>;
      case 1:
        return <div>
          <div className="product-profile-breadcrum ">
            <nav aria-label="breadcrumb">
              <ol class="breadCrum-bg-color">
              {breadCrumb && breadCrumb.length>0 && breadCrumb.map(row => {
                  return (
                    <>
                      <li aria-current="page" className='mt-1 breadCrum-sub-title' style={{ fontSize: "13px" }}>
                        <span><i class="bi bi-chevron-right"></i></span>&nbsp;
                        <span>{row.typeName} &nbsp;</span>
                        <span className="text-primary">{row.name} &nbsp;</span>
                      </li>
                    </>
                  )
                })}
              </ol>
            </nav>
          </div>
          <div className='steper-height ml-5'>
            <div>
              <p style={{ marginBottom: "0px" }} className="create-field-title">Product Unit</p>
              <span style={{ color: "#B6B6B6" }}>If you need more info, please check out <NavLink to="/inventory/configure/product-configure/list" className="faq-title"><u>FAQ Page</u></NavLink></span>
            </div>
            <div className='row mt-10'>
              <div className='form-group col-lg-6'>
                <label className='level-title'>Choose a Unit of Measurement<i style={{color: "red"}}>*</i></label>
                <select
                  id="uomId"
                  name="uomId"
                  className="form-control"
                  disabled={uomDropdownDisable}
                  onChange={handleChange}
                  value={inputs.uomId || ""}
                >
                  <option value="">Choose a Unit</option>
                  {getUOM.map((data) => (
                    <option key={data.id} value={data.id}>
                      {data.abbreviation}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className='row'>
              <div className='form-group col-lg-12'>
                <FormGroup aria-label="position" name="position"
                  value=""
                  row>
                  <FormControlLabel
                    control={<Checkbox color="primary"
                      id='customUOMCheckBox' checked={checkBoxStatus} />}
                    label="Can’t find unit. Need to create new custom unit"
                    labelPlacement="end"
                    onChange={handleCustomUnitChange}
                  />
                </FormGroup>
              </div>
            </div>
            <div className='row' id="customUOMId" hidden={customUOMShow}>
              <div className='form-group col-lg-6'>
                <label className='level-title'>Name<i style={{color: "red"}}>*</i></label>
                <input id="customUOMName" type="text" className='form-control' name="customUOMName" 
                value={inputs.customUOMName || ""} onChange={handleChange} maxlength="20"></input>
              </div>
              <div className='form-group col-lg-6'>
                <label className='level-title'>Description</label>
                <input id="customUOMDescription" type="text" className='form-control' name="customUOMDescription" 
                value={inputs.customUOMDescription || ""} onChange={handleChange} maxlength="80"></input>
              </div>
            </div>
          </div>
        </div>;
      case 2:
        return <div>
          <div className="product-profile-breadcrum ">
            <nav aria-label="breadcrumb">
              <ol class="breadCrum-bg-color">
              {breadCrumb && breadCrumb.length>0 && breadCrumb.map(row => {
                  return (
                    <>
                      <li aria-current="page" className='mt-1 breadCrum-sub-title' style={{ fontSize: "13px" }}>
                        <span><i class="bi bi-chevron-right"></i></span>&nbsp;
                        <span>{row.typeName} &nbsp;</span>
                        <span className="text-primary">{row.name} &nbsp;</span>
                      </li>
                    </>
                  )
                })}
              </ol>
            </nav>
          </div>
          <div className='steper-height ml-5'>
            <div>
              <p style={{ marginBottom: "0px" }} className="create-field-title">Product Carton Size</p>
              <span style={{ color: "#B6B6B6" }}>If you need more info, please check out <NavLink to="/inventory/configure/product-configure/list" className="faq-title"><u>FAQ Page</u></NavLink></span>
            </div>
            <div className='row mt-10'>
              <div className='form-group col-lg-6'>
                <label className='level-title'>Item Size<i style={{color: "red"}}>*</i></label>
                <input id="itemSize" type="text" className='form-control' name="itemSize" value={inputs.itemSize || ""} 
                onKeyPress={e => allowOnlyNumeric(e)} onChange={(e) => handleQuantity(e)} onPaste={handlePasteDisable} 
                maxlength="9"></input>
              </div>
              <div className='form-group col-lg-6'>
                <label className='level-title'>Unit of Measurement</label>
                {/* <input id="uomText" type="text" className='form-control' name="uomText" disabled value={getUOM[inputs.uomId] === undefined ? inputs.customUOMName : getUOM[inputs.uomId - 1].abbreviation}></input> */}
                <input id="uomText" type="text" className='form-control' name="uomText" disabled 
                value={(inputs.uomId === undefined || inputs.uomId === '') ? inputs.customUOMName.trim() : getUOM.find(obj => obj.id == inputs.uomId).abbreviation}></input>
              </div>
            </div>
            <div className='row mt-5'>
              <div className='form-group col-lg-6'>
                <label className='level-title'>Minimum Stock<i style={{color: "red"}}>*</i></label>
                <input id="minimumStock" type="text" className='form-control' name="minimumStock" 
                value={inputs.minimumStock || ""} onKeyPress={e => allowOnlyNumeric(e)} 
                onChange={(e) => handleQuantity(e)} onPaste={handlePasteDisable} maxlength="9"></input>
              </div>
            </div>
          </div>
        </div >;
      case 3:
        return <div>
          <div className="product-profile-breadcrum ">
            <nav aria-label="breadcrumb">
              <ol class="breadCrum-bg-color">
              {breadCrumb && breadCrumb.length>0 && breadCrumb.map(row => {
                  return (
                    <>
                      <li aria-current="page" className='mt-1 breadCrum-sub-title' style={{ fontSize: "13px" }}>
                        <span><i class="bi bi-chevron-right"></i></span>&nbsp;
                        <span>{row.typeName} &nbsp;</span>
                        <span className="text-primary">{row.name} &nbsp;</span>
                      </li>
                    </>
                  )
                })}
              </ol>
            </nav>
          </div>
          <div className='steper-height ml-5'>
            <div>
              <p style={{ marginBottom: "0px" }} className="create-field-title">Product Outer Size</p>
              <span style={{ color: "#B6B6B6" }}>If you need more info, please check out <NavLink to="/inventory/configure/product-configure/list" className="faq-title"><u>FAQ Page</u></NavLink></span>
            </div>
            <div className='row mt-10'>
              <div className='form-group col-lg-12'>
                <label className='level-title'>Name</label>
                
                {/* <input id="nameText" type="text" className='form-control' name="nameText" value={inputs.name + " " + inputs.itemSize + " " + (getUOM[inputs.uomId] === undefined ? inputs.customUOMName : getUOM[inputs.uomId - 1].abbreviation)} disabled></input> */}
                <input id="nameText" type="text" className='form-control' name="nameText" value={inputs.name.trim() + " " + inputs.itemSize + " " + ((inputs.uomId === undefined || inputs.uomId === '') ? inputs.customUOMName.trim() : getUOM.find(obj => obj.id == inputs.uomId).abbreviation)} disabled></input>
              </div>
            </div>
            <div className='row mt-5'>
              <div className='form-group col-lg-6'>
                <label className='level-title'>Qty. Per Carton<i style={{color: "red"}}>*</i></label>
                <select
                  id="packSizeId"
                  name="packSizeId"
                  className="form-control"
                  onChange={handleChange}
                  value={inputs.packSizeId || ""}
                >
                  <option value="">Choose Carton Size</option>
                  {getPackSize.map((data) => (
                    <option key={data.id} value={data.id}>
                      {data.packSize} {data.uom.abbreviation}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>;
      default:
        return <div>
          <div className="product-profile-breadcrum ">
            <nav aria-label="breadcrumb">
              <ol class="breadCrum-bg-color">
              {breadCrumb && breadCrumb.length>0 && breadCrumb.map(row => {
                  return (
                    <>
                      <li aria-current="page" className='mt-1 breadCrum-sub-title' style={{ fontSize: "13px" }}>
                        <span><i class="bi bi-chevron-right"></i></span>&nbsp;
                        <span>{row.typeName} &nbsp;</span>
                        <span className="text-primary">{row.name} &nbsp;</span>
                      </li>
                    </>
                  )
                })}
              </ol>
            </nav>
          </div>
          <div className='row steper-height ml-5'>
            <div className='col-lg-12' style={{ textAlign: "center", marginTop: "10px" }}>
              <img
                src={profileImg}
                style={{ width: "84px", height: "84px", textAlign: "center", marginTop: "80px" }} alt='Success Picture' />
              <div className='mt-4'>
                <p style={{ marginBottom: "0px" }} className="create-field-title">Thank You</p>
                <span className='text-muted'>{responseMessage}</span>
              </div>
              <div className='thanks-sub-title mt-12'>
                <strong style={{ fontSize: "17px", fontWeight: "bold" }}>Product Profile</strong>
              </div>
              <div style={{ padding: "10px 20px" }}>
                <span className="chip thanks-chip-title" style={{ padding: "10px 20px" }}>
                  <span className=" chip nested-span">{"SKU " + productSku}</span>
                  <span>{inputs.name.trim() + " " + inputs.itemSize + " " + ((inputs.uomId === undefined || inputs.uomId === '') ? inputs.customUOMName : getUOM.find(obj => obj.id == inputs.uomId).abbreviation) + " * " + getPackSize.find(obj => obj.id == inputs.packSizeId).packSize}</span>
                </span>
              </div>
            </div>
          </div>
        </div>;
    }
  }

  const backToListPage = () => {
    history.push("/inventory/configure/product-configure");
  }
   const backtoProductConfigurepage = () => {
    history.push("/inventory/configure/product-configure/list");
   }
  return (
    <>
      <div style={{ marginTop: "-30px", marginLeft: "-18px" }}>
        <nav aria-label="breadcrumb">
          <ol class="breadCrum-bg-color">
            <li aria-current="page" className='breadCrum-main-title'>{selectedCompany?.name}</li>
            <li aria-current="page" className='mt-1 breadCrum-sub-title'>&nbsp;Inventory&nbsp;&nbsp;&nbsp;&nbsp;</li>
            <li aria-current="page" className='mt-1 breadCrum-sub-title text-primary'><span className='font-weight-bolder'>.</span>&nbsp; Configure &nbsp;&nbsp;</li>
            <li aria-current="page" className='mt-1 breadCrum-sub-title text-primary'><span className='font-weight-bolder'>.</span>&nbsp; Product Configure</li>
          </ol>
        </nav>
      </div>
      <Card>
        <CardBody>
          <div className="row">
            <div className="col-lg-3 border border-left-0 border border-light border-primary border-bottom-0 border-top-0">
              <a onClick={backtoProductConfigurepage} style={{color:"#1BC5BD"}}>
                <span><i className="bi bi-chevron-left"></i></span> &nbsp; Back to product configure menu
              </a>
              <div className={classes.root} style={{ marginTop: "50px" }}>
                <Stepper activeStep={activeStep} orientation="vertical">
                  {steps.map((label, index) => (
                    <Step key={label}>
                      <StepLabel optional={<Typography variant="caption">{subTitle[index]}</Typography>}>{label}</StepLabel>
                    </Step>
                  ))
                  }
                </Stepper>
              </div>
            </div>
            <div className="col-lg-9">
              <Typography>{getStepContent(activeStep)}</Typography>
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
                    {(activeStep === steps.length - 2) ? (inputs.id ? 'Update' : 'Save') : 'Next'}
                  </Button>
                  <div style={{ textAlign: 'center' }}>
                    <Button
                      style={{ visibility: "hidden", marginLeft: '30px', width: '140px' }}
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