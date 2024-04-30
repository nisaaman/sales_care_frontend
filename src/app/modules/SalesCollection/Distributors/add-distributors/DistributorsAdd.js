import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import { Card, CardBody, Input } from "../../../../../_metronic/_partials/controls";
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { NavLink } from 'react-router-dom';
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../_metronic/_helpers";
import { useLocation } from "react-router-dom";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import axios from "axios";
import { showSuccess, showError } from '../../../../pages/Alert';
import { update } from 'lodash';
import { validateEmail, allowOnlyNumeric, handlePasteDisable } from '../../../Util';
import { shallowEqual, useSelector } from 'react-redux';

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
    return [`Basic Info`, 'License', 'Proprietor Info', 'Guarantor Info', 'Completed'];
}

export function DistributorsAdd(props) {
    const classes = useStyles();
    const location = useLocation();
    const parentCompany = useSelector((state) => state.auth.user.parentCompany, shallowEqual);
    const [distributorImg, setDistributorImg] = useState(toAbsoluteUrl("/images/copmanylogo.png"));
    const [proprietorImg, setProprietorImg] = useState(toAbsoluteUrl("/images/copmanylogo.png"));
    const [guarantorImg, setGuarantorImg] = useState(toAbsoluteUrl("/images/copmanylogo2.png"));
    const [distributorGuarantorLogoList, setDistributorGuarantorLogoList] = useState([]);
    const [successImg, setSuccessImg] = useState(toAbsoluteUrl("/images/success2.png"));
    const [activeStep, setActiveStep] = useState(0);
    const [imageText, setImageText] = useState('');
    const [distributorImage, setDistributorImage] = useState('');
    const steps = getSteps();
    const [guaranteeChequeInfo, setGuaranteeChequeInfo] = useState({
        bankId: "",
        chequeNo: "",
        chequeType: "",
        chequeAmount: "",
        branchId: ""
    });
    const [licenseInfo, setLicenseInfo] = useState({

    });
    const [allCompany, setAllCompany] = useState([]);
    const [allLocation, setAllLocation] = useState([]);
    const [allSo, setAllSo] = useState([]);
    const [allBank, setAllBank] = useState([]);
    const [allDistributorType, setAllDistributorType] = useState([]);
    const [allBranch, setAllBranch] = useState([]);
    const [contactNoValue, setcontactNoValue] = useState("");
    const [proprietorContactNoValue, setProprietorContactNoValue] = useState("");
    const [guarantorContactNoValue, setGuarantorContactNoValue] = useState("");
    const [companyId, setCompanyId] = useState("")
    const [fileList, setFileList] = useState([]);
    const [proprietorLogoList, setProprietorLogoList] = useState([]);
    const [distributorId, setDistributorId] = useState("");
    const subsTitle = ["Insert Distributor’s Basic Info", "Insert License Info", "Insert Proprietor Info", "Insert Guarantor Info", "Woah, we are here"];
    const [ditributorInfo, setDitributorInfo] = useState(
        {
            // id: "",
            // distributorName: "",
            // contactNo: "",
            // email: "",
            // shipToAddress: "",
            // billToAddress: "",
            // geoLatitude: "",
            // geoLongitude: "",
            // radius: "",
            // distributorTypeId: "",
            // filePath: ""
        }
    );
    const [assignToObj, setAssignToObj] = useState([
        {
            id: '',
            companyId: '',
            locationId: '',
            salesOfficerId: '',
            locationArray: [],
            soArray: []
        },
    ]);
    const [assignProprietorInfoObj, setAssignProprietorInfoObj] = useState([
        {
            id: '',
            name: '',
            nid: '',
            fatherName: '',
            motherName: '',
            contactNo: '',
            address: '',
            fileName: '',
            filePath: '',
            imagePath: ''
        }
    ]);
    const [assignGuarantorInfoObj, setAssignGuarantorInfoObj] = useState([
        {
            id: '',
            name: '',
            nid: '',
            fatherName: '',
            motherName: '',
            contactNo: '',
            address: '',
            fileName: '',
            filePath: '',
            imagePath: ''
        }
    ])
    useEffect(() => {
        if (activeStep === 0) {
            document.getElementById('backBtn').style.visibility = 'hidden';
        }
        getAllCompanyByOrganization();
        getBankList();
        getAllDistributorType();
        if (location.state != undefined) {

            //document.getElementById('imgUploadDiv1').style.display ="none"
            //document.getElementById('distributorLogo').disabled =true;
            setDistributorId(location.state.state.distributorId);
            openEditPage(location.state.state.distributorId);
        }
    }, []);


    useEffect(() => {
    }, [assignToObj]);

    const getAllCompanyByOrganization = () => {
        const URL = `${process.env.REACT_APP_API_URL}/api/organization/get-all-company-by-organization`;
        axios.get(URL).then(response => {
            setAllCompany(response.data.data)
        });
    }

    const openEditPage = (id) => {
        const URL = `${process.env.REACT_APP_API_URL}/api/distributor/details-with-proprietor-and-guarantor/${id}`;
        axios.get(URL).then(response => {
            setDitributorInfo(response.data.data);
            setDistributorImg(`data:image/png;base64,${response.data.data.filePath}`)


            guaranteeChequeInfo.bankId = response.data.data.bankId;
            guaranteeChequeInfo.chequeAmount = response.data.data.chequeAmount;
            guaranteeChequeInfo.chequeNo = response.data.data.chequeNo;
            guaranteeChequeInfo.chequeType = response.data.data.chequeType;
            guaranteeChequeInfo.branchId = response.data.data.branchId;

            getBranchList(response.data.data.bankId);

            licenseInfo.vatRegistrationNo = response.data.data.vatRegistrationNo;
            licenseInfo.tinRegistrationNo = response.data.data.tinRegistrationNo;
            licenseInfo.tradeLicenseNo = response.data.data.tradeLicenseNo;
            licenseInfo.pesticideLicenseNo = response.data.data.pesticideLicenseNo;
            licenseInfo.seedLicenseNo = response.data.data.seedLicenseNo;

            setAssignGuarantorInfoObj(response.data.data.distributorGuarantorDtoList);
            setAssignProprietorInfoObj(response.data.data.proprietorDtoList);

            if (response.data.data.distributorSalesOfficerMapDtoList != null) {
                // getLastLocationByCompany(response.data.data.distributorSalesOfficerMapDtoList[0].companyId);
                // getSoListByLocation(response.data.data.distributorSalesOfficerMapDtoList[0].locationId,
                //     response.data.data.distributorSalesOfficerMapDtoList[0].companyId);
                setAssignToObj(response.data.data.distributorSalesOfficerMapDtoList);
            }

        });
    }

    const handleNext = () => {
        let isForwardNextStep = true;
        if (activeStep >= 0) {
            document.getElementById('backBtn').style.visibility = 'visible';
        }
        if (activeStep === 0) {

            if (contactNoValue) {
                const name = "contactNo";
                setDitributorInfo(values => ({ ...values, [name]: contactNoValue }));
            }
            // DISTRIBUTOR NAME VALIDATION
            if (ditributorInfo.distributorName.trim() === undefined 
            || ditributorInfo.distributorName.trim() === null || ditributorInfo.distributorName.trim() === '') {
                showError("Distributor Name is required.");
                isForwardNextStep = false;
            }
            // DISTRIBUTOR CONTACT NO VALIDATION
            if (!contactNoValue) {
                if (ditributorInfo.contactNo === undefined || ditributorInfo.contactNo === null 
                    || ditributorInfo.contactNo === '') {
                    showError("Distributor Contact No is required.");
                    isForwardNextStep = false;
                    return;
                }
            }

            if (ditributorInfo.email && ditributorInfo.email.trim() !== undefined
                && ditributorInfo.email.trim() !== null && ditributorInfo.email.trim() !== '') {
                if (!validateEmail(ditributorInfo.email)) {
                    showError("Invalid Distributor Email.");
                    isForwardNextStep = false;
                    return;
                }
            }
            //distributorTypeId
            if (ditributorInfo.distributorTypeId === undefined 
                || ditributorInfo.distributorTypeId === null || ditributorInfo.distributorTypeId === '') {
                showError("Distributor Type is required.");
                isForwardNextStep = false;
                return;
            }
            // DISTRIBUTOR SHIP TO ADDRESS VALIDATION
            if (!ditributorInfo.shipToAddress || ditributorInfo.shipToAddress.trim() === undefined 
            || ditributorInfo.shipToAddress.trim() === null || ditributorInfo.shipToAddress.trim() === '') {
                showError("Distributor Ship To Address is required.");
                isForwardNextStep = false;
                return;
            }
            // billToAddress
            if (!ditributorInfo.billToAddress || ditributorInfo.billToAddress.trim() === undefined 
            || ditributorInfo.billToAddress.trim() === null || ditributorInfo.billToAddress.trim() === '') {
                showError("Distributor Bill To Address is required.");
                isForwardNextStep = false;
                return;
            }
            //geoLatitude
            if (!ditributorInfo.geoLatitude || ditributorInfo.geoLatitude.trim() === undefined 
            || ditributorInfo.geoLatitude.trim() === null || ditributorInfo.geoLatitude.trim() === '') {
                showError("Geo Latitude is required.");
                isForwardNextStep = false;
                return;
            }
            //DISTRIBUTOR GEO LONGITUDE VALIDATION
            if (!ditributorInfo.geoLongitude || ditributorInfo.geoLongitude.trim() === undefined 
            || ditributorInfo.geoLongitude.trim() === null || ditributorInfo.geoLongitude.trim() === '') {
                showError("Geo Longitude is required.");
                isForwardNextStep = false;
                return;
            }
            //DISTRIBUTOR RADIAS VALIDATION
            if (!ditributorInfo.radius || ditributorInfo.radius.trim() === undefined 
            || ditributorInfo.radius.trim() === null || ditributorInfo.radius.trim() === '') {
                showError("Radius is required.");
                isForwardNextStep = false;
                return;
            }
            //bankId
            if (guaranteeChequeInfo.bankId === undefined 
                || guaranteeChequeInfo.bankId === null || guaranteeChequeInfo.bankId === '') {
                showError("Bank Name is required.");
                isForwardNextStep = false;
                return;
            }
            //branchId
            if (guaranteeChequeInfo.branchId === undefined 
                || guaranteeChequeInfo.branchId === null || guaranteeChequeInfo.branchId === '') {
                showError("Bank Branch Name is required.");
                isForwardNextStep = false;
                return;
            }
            //DISTRIBUTOR CHEQUE NO VALIDATION
            if (guaranteeChequeInfo.chequeNo.trim() === undefined 
            || guaranteeChequeInfo.chequeNo.trim() === null || guaranteeChequeInfo.chequeNo.trim() === '') {
                showError("Cheque No is required.");
                isForwardNextStep = false;
                return;
            }
            //DISTRIBUTOR CHEQUE TYPE VALIDATION
            if (guaranteeChequeInfo.chequeType.trim() === undefined 
            || guaranteeChequeInfo.chequeType.trim() === null || guaranteeChequeInfo.chequeType.trim() === '') {
                showError("Cheque Type is required.");
                isForwardNextStep = false;
                return;
            }
            if (assignToObj.length > 0) {
                assignToObj.map((obj) => {
                    if (obj.companyId === undefined || obj.companyId === null || obj.companyId === '') {
                        showError("Company Name is required.");
                        isForwardNextStep = false;
                    }
                    else if (obj.locationId === undefined || obj.locationId === null || obj.locationId === '') {
                        showError("Location is required.");
                        isForwardNextStep = false;
                    }
                    else if (obj.salesOfficerId === undefined || obj.salesOfficerId === null || obj.salesOfficerId === '') {
                        showError("Representative is required.");
                        isForwardNextStep = false;
                    }
                    return;
                }
                )

            }

        } else if (activeStep === 2) {
            if (assignProprietorInfoObj.length > 0) {
                assignProprietorInfoObj.map((obj) => {
                    if (obj.name.trim() === undefined || obj.name.trim() === null || obj.name.trim() === '') {
                        showError("Proprietor Name is required.");
                        isForwardNextStep = false;
                    }
                    else if (obj.nid.trim() === undefined || obj.nid.trim() === null || obj.nid.trim() === '') {
                        showError("Proprietor NID is required.");
                        isForwardNextStep = false;
                    }
                    else if (obj.contactNo === undefined || obj.contactNo === null || obj.contactNo === '') {
                        showError("Proprietor Contact No is required.");
                        isForwardNextStep = false;
                    }
                }
                )
            }
        } else if (activeStep === 3) {
            let noError = true;
            isForwardNextStep = false;
            if (assignGuarantorInfoObj.length > 0) {
                assignGuarantorInfoObj.map((obj) => {
                    if (obj.name.trim() === undefined || obj.name.trim() === null || obj.name.trim() === '') {
                        showError("Guarantor Name is required.");
                        noError = false;
                    }
                    else if (obj.nid.trim() === undefined || obj.nid.trim() === null || obj.nid.trim() === '') {
                        showError("Guarantor NID is required.");
                        noError = false;
                    }
                    else if (obj.contactNo === undefined || obj.contactNo === null || obj.contactNo === '') {
                        showError("Guarantor Contact No is required.");
                        noError = false;
                    }
                }
                )
            }
            if (noError === true) {

                if (distributorId !== "" && distributorId !== null) {
                    updateDistributor();
                } else {
                    saveDistributor();
                }
            }

        }
        if (isForwardNextStep) {
            setActiveStep(prevActiveStep => prevActiveStep + 1);
        }
    }

    const handleBack = () => {
        if (activeStep === 1) {
            document.getElementById('backBtn').style.visibility = 'hidden';
        }
        setActiveStep(prevActiveStep => prevActiveStep - 1);
    }

    const imageHandler = (e) => {
        var x = document.getElementById("demoImg");
        x.style.display = "block";
        setImageText('');
        const reader = new FileReader();
        reader.onload = () => {
            if (reader.readyState === 2) {
                setDistributorImg(reader.result);
            }
        }

        reader.readAsDataURL(e.target.files[0])

        const tempFile = [...fileList]// fileList array
        var input = document.getElementById('distributorLogo');
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
    const handleAssignToChange = (i, e) => {
        let newFormValues = [...assignToObj];
        newFormValues[i][e.target.name] = e.target.value;
        // if (e.target.name === "companyId") {
        //     setCompanyId(e.target.value);
        //     getLastLocationByCompany(e.target.value);
        //     getSoAssignedStatusDistributor(distributorId, e.target.value);
        // } else if (e.target.name === "locationId") {
        //     const companyId = document.getElementById("companyId").value
        //     getSoListByLocation(e.target.value, companyId)
        // }
        setAssignToObj(newFormValues);
    }
    const getLastLocationByCompany = (id) => {
        if (id) {
            const URL = `${process.env.REACT_APP_API_URL}/api/location/get-last-location-by-company/${parseInt(id)}`;
            axios.get(URL).then(response => {
                if (response.data.data !== null && response.data.data !== undefined && response.data.data !== "") {
                    setAllLocation(response.data.data)
                }
                else {
                    showError("No location found under this company.");
                }
            });
        }
        else {
            setAllLocation([]);
        }
    }

    const getSoListByLocation = (locationid, companyid) => {
        if (locationid && companyid) {
            const URL = `${process.env.REACT_APP_API_URL}/auth/get-SO-by-location/${parseInt(locationid)}/${parseInt(companyid)}`;
            axios.get(URL).then(response => {
                if (response.data.data !== null && response.data.data !== undefined && response.data.data !== "") {
                    setAllSo(response.data.data);
                }
                else {
                    showError("No Representative found under this company and location.");
                }
            });
        }
        else {
            setAllSo([]);
        }
    }

    const getSoAssignedStatusDistributor = (distributorId, companyId) => {
        if (assignToObj.length >= 1) {
            if (distributorId && companyId) {
                const URL = `${process.env.REACT_APP_API_URL}/api/distributor/get-so-assigned-status-distributor/${parseInt(distributorId)}/${parseInt(companyId)}`;
                axios.get(URL).then(response => {
                    if (response.data.data !== null && response.data.data !== undefined && response.data.data !== "") {
                        showError("SO already assigned");
                    }
                });
            }
        }
    }


    // const addAssignToFormFields = () => {
    //     setAssignToObj([...assignToObj, {
    //         company: '',
    //         location: '',
    //         representative: '',
    //     }])
    // }

    const addAssignToFormFields = () => {
        setAssignToObj([...assignToObj, {
            id: '',
            companyId: '',
            locationId: '',
            salesOfficerId: '',
            locationArray: [],
            soArray: []
        }])
    }

    const removeAssignToFormFields = (i) => {
        let newFormValues = [...assignToObj];
        newFormValues.splice(i, 1);
        setAssignToObj(newFormValues)
    }

    const handleProprietorChange = (i, e) => {
        if (e.target.name === "fileName") {
            const newFormValues = [...assignProprietorInfoObj];
            proprietorImageHandler(i, e, newFormValues);
        }
        else {
            const newFormValues = [...assignProprietorInfoObj];
            newFormValues[i][e.target.name] = e.target.value;
            setAssignProprietorInfoObj(newFormValues);
        }
    }

    const handleProprietorContactNoChange = (i, e) => {
        setProprietorContactNoValue(e);
        const ContactNo = "contactNo";
        const position = i.split("_")[1];
        const newFormValues = [...assignProprietorInfoObj];
        newFormValues[position][ContactNo] = e;
        setAssignProprietorInfoObj(newFormValues);
    }

    const addProprietorFormFields = () => {
        setAssignProprietorInfoObj([...assignProprietorInfoObj, {
            id: '',
            name: '',
            nid: '',
            fatherName: '',
            motherName: '',
            contactNo: '',
            address: '',
            fileName: '',
            filePath: '',
            imagePath: '',
        }])
    }

    const removeProprietorFormFields = (i) => {
        let newFormValues = [...assignProprietorInfoObj];
        newFormValues.splice(i, 1);
        setAssignProprietorInfoObj(newFormValues)
    }


    const proprietorImageHandler = (index, e, newFormValues) => {

        const uploadId = 'proprietorLogoUploader-' + index;
        if (uploadId) {
            const imgId = 'proprietorImgId-' + index;
            const imgSet = document.getElementById(imgId);
            const input = document.getElementById(uploadId);
            if (imgSet) {
                imgSet.setAttribute("src", URL.createObjectURL(input.files.item(0)))
            }
            const tempFile = [...proprietorLogoList]

            if (input.files.length < 1)
                return false;

            let count = 0;
            for (var i = 0; i < input.files.length; i++) {
                if (fileValidation(input.files.item(i))) {

                    var file = input.files.item(i);
                    var fileName = new Date().getTime() + '|' + file.name;
                    newFormValues[index][e.target.name] = fileName;
                    newFormValues[index]["imagePath"] = URL.createObjectURL(input.files.item(0));
                    setAssignProprietorInfoObj(newFormValues);
                    const renamedFile = new File([file], fileName, { type: fileName.split('.').pop() });
                    tempFile.push(renamedFile);

                } else {
                    count++;
                    continue;
                }
            }

            if (count > 0) {
                showError('Some files are not supported due to file extention or file size.');
            }

            setProprietorLogoList(tempFile);
        }
    }

    const handleGuarantorChange = (i, e) => {

        if (e.target.name === "fileName") {
            const newFormValues = [...assignGuarantorInfoObj];
            guarantorImageHandler(i, e, newFormValues);
        }
        else {
            const newFormValues = [...assignGuarantorInfoObj];
            newFormValues[i][e.target.name] = e.target.value;
            setAssignGuarantorInfoObj(newFormValues);
        }
    }
    const handleGuarantorContactNoChange = (i, e) => {

        setGuarantorContactNoValue(e);
        const ContactNo = "contactNo";
        const position = i.split("_")[1];
        const newFormValues = [...assignGuarantorInfoObj];
        newFormValues[position][ContactNo] = e;
        setAssignGuarantorInfoObj(newFormValues);
    }

    const guarantorImageHandler = (index, e, newFormValues) => {

        const uploadId = 'distributorGaurantorLogoUploader-' + index;
        if (uploadId) {
            const imgId = 'guarantorImgId-' + index;
            const imgSet = document.getElementById(imgId)
            const input = document.getElementById(uploadId);
            if (imgSet) {
                imgSet.setAttribute("src", URL.createObjectURL(input.files.item(0)))
            }
            const tempFile = [...distributorGuarantorLogoList]
            if (input.files.length < 1)
                return false;

            let count = 0;
            for (var i = 0; i < input.files.length; i++) {
                if (fileValidation(input.files.item(i))) {

                    var file = input.files.item(i);
                    var fileName = new Date().getTime() + '|' + file.name;
                    newFormValues[index][e.target.name] = fileName;
                    newFormValues[index]["imagePath"] = URL.createObjectURL(input.files.item(0));
                    setAssignGuarantorInfoObj(newFormValues);
                    const renamedFile = new File([file], fileName, { type: fileName.split('.').pop() });
                    tempFile.push(renamedFile);

                } else {
                    count++;
                    continue;
                }
            }

            if (count > 0) {
                showError('Some files are not supported due to file extention or file size.');
            }

            setDistributorGuarantorLogoList(tempFile);
        }
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

    const addGuarantorFormFields = () => {
        setAssignGuarantorInfoObj([...assignGuarantorInfoObj, {
            id: '',
            name: '',
            nid: '',
            fatherName: '',
            motherName: '',
            contactNo: '',
            address: '',
            fileName: '',
            filePath: '',
            imagePath: '',
        }])
    }

    const removeGuarantorFormFields = (i) => {
        let newFormValues = [...assignGuarantorInfoObj];
        newFormValues.splice(i, 1);
        setAssignGuarantorInfoObj(newFormValues)
    }

    const handleDistributorChange = (event) => {
        let name = event.target.name;  //distributorName
        let value = event.target.value; //anika
        setDitributorInfo(values => ({ ...values, [name]: value }));
    }

    const handleDistributorContactNoChange = (e) => {

        setcontactNoValue(e);
        const ContactNo = "contactNo";
        setDitributorInfo(values => ({ ...values, [ContactNo]: e }));
    }

    const handleGuaranteeChequeInfoChange = (event) => {
        let name = event.target.name;  //distributorName
        let value = event.target.value; //anika

        if (name === 'chequeAmount') {
            if (value === '') {
                setGuaranteeChequeInfo(values => ({ ...values, [name]: value }));
            } else if (Number(value) > 0) {
                let v = value.split(".")[1];
                if (v === undefined) {
                    setGuaranteeChequeInfo(values => ({ ...values, [name]: value.trim() }));
                } else if (v.length < 3) {
                    setGuaranteeChequeInfo(values => ({ ...values, [name]: value }));
                }
            }
        }
        else {
            if (name === "bankId") {
                getBranchList(event.target.value);
            }
            setGuaranteeChequeInfo(values => ({ ...values, [name]: value }));
        }
    }

    const handlelicenseInfoChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;
        setLicenseInfo(values => ({ ...values, [name]: value }));

    }


    //Bank 
    const getBankList = () => {
        const URL = `${process.env.REACT_APP_API_URL}/api/bank/all-bank`;
        axios.get(URL).then(response => {
            setAllBank(response.data.data)
        });
    }

    //Branch
    const getBranchList = (id) => {
        if (id) {
            const URL = `${process.env.REACT_APP_API_URL}/api/bank-branch/bank-all-branch/${parseInt(id)}`;
            axios.get(URL).then(response => {
                setAllBranch(response.data.data)
            });
        }
        else {
            setAllBranch([]);
        }

    }

    //Bank 
    const getAllDistributorType = () => {
        const URL = `${process.env.REACT_APP_API_URL}/api/distributor-type`;
        axios.get(URL).then(response => {
            setAllDistributorType(response.data.data)
        });
    }

    const saveDistributor = () => {
        let formData = new FormData();
        let obj = { ...ditributorInfo, ...guaranteeChequeInfo, ...licenseInfo };
        obj.distributorSalesOfficerMapDtoList = assignToObj;
        obj.proprietorDtoList = assignProprietorInfoObj;
        obj.distributorGuarantorDtoList = assignGuarantorInfoObj;
        formData.append("distributorDto", new Blob([JSON.stringify(obj)], { type: "application/json" }));
        // fileList.forEach(file => {
        //formData.append("distributorLogo", file);
        // })
        let file = fileList[fileList.length - 1]
        formData.append("distributorLogo", file);

        proprietorLogoList.forEach(file => {
            formData.append("proprietorLogoList", file);
        })

        distributorGuarantorLogoList.forEach(file => {
            formData.append("distributorGuarantorLogoList", file);
        })
        const URL = `${process.env.REACT_APP_API_URL}/api/distributor`;
        axios.post(URL, formData, { headers: { "Content-Type": "application/json" } }).then(response => {

            if (response.data.success === true) {
                setActiveStep(prevActiveStep => prevActiveStep + 1);
                if (activeStep === 3) {
                    document.getElementById('nextBtn').style.visibility = 'hidden';
                    document.getElementById('backBtn').style.visibility = 'hidden';
                    document.getElementById('gotItBtn').style.visibility = 'visible'
                }
            } else {
                showError(response.data.message);
            }
        }).catch(err => {
            showError(err);
        });
    }

    //============================updateDistributor  Start [not used]========
    const updateDistributor = () => {
        let formData = new FormData();
        let obj = { ...ditributorInfo, ...guaranteeChequeInfo, ...licenseInfo };
        obj.distributorSalesOfficerMapDtoList = assignToObj;
        obj.proprietorDtoList = assignProprietorInfoObj;
        obj.distributorGuarantorDtoList = assignGuarantorInfoObj;

        formData.append("distributorDto", new Blob([JSON.stringify(obj)], { type: "application/json" }));
        // fileList.forEach(file => {
        //     formData.append("distributorLogo", file);
        // })
        let file = fileList[fileList.length - 1]
        formData.append("distributorLogo", file);

        proprietorLogoList.forEach(file => {
            formData.append("proprietorLogoList", file);
        })

        distributorGuarantorLogoList.forEach(file => {
            formData.append("distributorGuarantorLogoList", file);
        })

        const URL = `${process.env.REACT_APP_API_URL}/api/distributor`;
        axios.post(URL, formData, { headers: { "Content-Type": "application/json" } }).then(response => {
            if (response.data.success === true) {
                setActiveStep(prevActiveStep => prevActiveStep + 1);
                if (activeStep === 3) {
                    document.getElementById('nextBtn').style.visibility = 'hidden';
                    document.getElementById('backBtn').style.visibility = 'hidden';
                    document.getElementById('gotItBtn').style.visibility = 'visible'
                }
            } else {
                showError(response.data.message);
            }
        }).catch(err => {
            showError(err);
        });
    }
    const allowOnlyNumericWithPeriodWhenPaste = (e) => {

        for (let i = 0; i < e.clipboardData.getData('text/plain').length; i++) {
            if ((e.clipboardData.getData('text/plain')).charCodeAt(i) != 46 && !((e.clipboardData.getData('text/plain')).charCodeAt(i) >= 48 && (e.clipboardData.getData('text/plain')).charCodeAt(i) <= 57)) {
                e.preventDefault();
            }
        }
    }

    const handleCompanyChange = (e, i) => {
        if (assignToObj.length > 1) {
            const temp = [...assignToObj]
            const index = temp.findIndex((obj) => parseInt(obj.companyId) === parseInt(e.target.value))
            if (index > -1) {
                showError("This company already used");
                return;
            } else {
                if (e.target.value != '') {
                    let newFormValues = [...assignToObj];
                    newFormValues[i][e.target.name] = e.target.value;
                    newFormValues[i].locationId = ''
                    newFormValues[i].locationArray = []
                    newFormValues[i].salesOfficerId = ''
                    newFormValues[i].soArray = []
                    const URL = `${process.env.REACT_APP_API_URL}/api/location/get-last-location-by-company/` + e.target.value;
                    axios.get(URL).then(response => {
                        newFormValues[i].locationArray = response.data.data
                        return setAssignToObj(newFormValues);
                    });
                } else {
                    let newFormValues = [...assignToObj];
                    newFormValues[i][e.target.name] = e.target.value;
                    newFormValues[i].locationId = ''
                    newFormValues[i].locationArray = []
                    newFormValues[i].salesOfficerId = ''
                    newFormValues[i].soArray = []
                    setAssignToObj(newFormValues)
                }

            }
        } else {
            if (e.target.value != '') {
                let newFormValues = [...assignToObj];
                newFormValues[i][e.target.name] = e.target.value;
                newFormValues[i].locationId = ''
                newFormValues[i].locationArray = []
                newFormValues[i].salesOfficerId = ''
                newFormValues[i].soArray = []
                const URL = `${process.env.REACT_APP_API_URL}/api/location/get-last-location-by-company/` + e.target.value;
                axios.get(URL).then(response => {
                    newFormValues[i].locationArray = response.data.data
                    return setAssignToObj(newFormValues);
                })

            } else {
                let newFormValues = [...assignToObj];
                newFormValues[i][e.target.name] = e.target.value;
                newFormValues[i].locationId = ''
                newFormValues[i].locationArray = []
                newFormValues[i].salesOfficerId = ''
                newFormValues[i].soArray = []
                setAssignToObj(newFormValues)
            }
        }
    }

    const handleLocationChange = (e, i) => {
        const _areaIdVal = document.getElementById("companyId-id-" + i);
        let id = _areaIdVal.options[_areaIdVal.selectedIndex].value;
        let newFormValues = [...assignToObj];
        newFormValues[i][e.target.name] = e.target.value;
        const URL = `${process.env.REACT_APP_API_URL}/auth/get-SO-by-location/${parseInt(e.target.value)}/${parseInt(id)}`;
        if (e.target.value != '') {
            axios.get(URL).then(response => {

                newFormValues[i].soArray = response.data.data

                if (newFormValues[i].soArray.length ==0) {
                    newFormValues[i].salesOfficerId = ''
                }
                return setAssignToObj(newFormValues);

            });
        } else {
            newFormValues[i].soArray = ''
            newFormValues[i].soArray = []
            return setAssignToObj(newFormValues);
        }
    }

    //=========================================END=============
    const getStepContent = (step) => {
        switch (step) {
            case 0:
                return <div className='steper-height ml-5'>
                    <div>
                        <span className="create-field-title">Distributor’s Basic Info</span>
                        <p style={{ color: "#B6B6B6" }}>If you need more info, please check out <NavLink to="/salescollection/distributors/overview" className="faq-title"><u>FAQ Page</u></NavLink></p>
                    </div>

                    {/* DISTRIBUTOR IMAGE ROW */}
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
                                            title="Change Distributor’s Picture">
                                            <div id="demoImg">
                                                <img className="image-input image-input-circle"
                                                    //src={ditributorInfo.filePath === undefined || ditributorInfo.filePath === "" || ditributorInfo.filePath === null ? distributorImg : `data:image/png;base64,${ditributorInfo.filePath}`}
                                                    src={distributorImg}
                                                    style={{ width: "150px", height: "150px", textAlign: "center" }} alt='Distributor’s Picture' />
                                            </div>

                                            <div id='imgUploadDiv1' className='imgUploadDiv'>
                                                <i className="bi bi-pencil-fill fs-7" style={{ fontSize: "12px", padding: "7px", color: "white" }}></i>
                                            </div>
                                            <input id="distributorLogo" type="file" name="distributorLogo"
                                                onChange={imageHandler} accept=".png, .jpg, .jpeg" />
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='row mt-5'>
                        <div className='col-lg-12' style={{ textAlign: "center" }}>
                            <label className='level-title'>Upload new distributor’s logo</label>
                        </div>
                    </div>

                    {/* DISTRIBUTOR NAME ROW */}
                    <div className='row mt-5'>
                        <div className='col-lg-12'>
                            <label className='level-title'>Distributor’s Name<i style={{ color: "red" }}>*</i></label>
                            {/* <input id="distributorName" type="text" className='form-control' name="distributorName" value={ditributorInfo.distributorName || ""} onChange={(event) => handleDistributorChange(event)}></input> */}
                            <input id="distributorName" type="text" className='form-control' name="distributorName" value={ditributorInfo.distributorName || ""} onChange={(event) => handleDistributorChange(event)}></input>
                        </div>
                    </div>



                    {/* CONTACT AND EMAIL ROW */}
                    <div className='row mt-5'>
                        <div className='col-xl-6'>
                            <label className='level-title'>Contact<i style={{ color: "red" }}>*</i></label>
                            <PhoneInput
                                international
                                countryCallingCodeEditable={false}
                                defaultCountry="BD"
                                className='form-control'
                                id="contactNo"
                                name="contactNo"
                                value={ditributorInfo.contactNo || ""}
                                onChange={e => handleDistributorContactNoChange(e)}
                            />
                        </div>
                        <div className='col-xl-6'>
                            <label className='level-title'>Email</label>
                            <input id="distributorEmail" type="text" className='form-control' name="email" value={ditributorInfo.email || ""} onChange={(event) => handleDistributorChange(event)}></input>
                        </div>
                    </div>

                    {/* DISTRIBUTOR TYPE ROW */}
                    <div className='row mt-5'>
                        <div className='col-xl-6'>
                            <label className='level-title'>Distributor Type<i style={{ color: "red" }}>*</i></label>
                            <select id="distributorTypeId" className='form-control' name="distributorTypeId" value={ditributorInfo.distributorTypeId || ""} onChange={(event) => handleDistributorChange(event)}>

                                <option value="">Please select Distributor Type</option>
                                {
                                    allDistributorType.map((distributorType) => (
                                        <option key={distributorType.id} value={distributorType.id}>{distributorType.name}</option>
                                    ))}
                            </select>
                        </div>
                    </div>
                    {/* SHIP ADDRESS ROW */}
                    <div className='row mt-5'>
                        <div className='col-xl-12'>
                            <label className='level-title'>Ship to Address(Delivery)<i style={{ color: "red" }}>*</i></label>
                            <textarea rows="5" id="shipAddress" type="text" className='form-control' name="shipToAddress" value={ditributorInfo.shipToAddress || ""} onChange={(event) => handleDistributorChange(event)} placeholder='Ex. mirpur, dhaka'></textarea>
                        </div>
                    </div>

                    {/* BILL ADDRESS ROW */}
                    <div className='row mt-5'>
                        <div className='col-xl-12'>
                            <label className='level-title'>Bill to Address<i style={{ color: "red" }}>*</i></label>
                            <textarea rows="5" id="billAddress" type="text" className='form-control' name="billToAddress" value={ditributorInfo.billToAddress || ""} onChange={(event) => handleDistributorChange(event)} placeholder='Ex. mirpur, dhaka'></textarea>
                        </div>
                    </div>

                    {/* GEO AND RIDUES ROW */}
                    <div className='row mt-5'>
                        <div className='col-xl-4'>
                            <label className='level-title'>Geo Latitude<i style={{ color: "red" }}>*</i></label>
                            <input placeholder='Ex. ed1885780820' id="geoLatitude" type="text" className='form-control' name="geoLatitude" value={ditributorInfo.geoLatitude || ""} onChange={(event) => handleDistributorChange(event)}></input>
                        </div>
                        <div className='col-xl-4'>
                            <label className='level-title'>Geo Longitude<i style={{ color: "red" }}>*</i></label>
                            <input placeholder='Ex. ef1885780820' id="geoLongitude" type="text" className='form-control' name="geoLongitude" value={ditributorInfo.geoLongitude || ""} onChange={(event) => handleDistributorChange(event)}></input>
                        </div>
                        <div className='col-xl-4'>
                            <label className='level-title'>Radius<i style={{ color: "red" }}>*</i></label>
                            <input placeholder='Ex. rt1885780820' id="radius" type="text" className='form-control' name="radius" value={ditributorInfo.radius || ""} onChange={(event) => handleDistributorChange(event)}></input>
                        </div>
                    </div>

                    {/* TITLE ROW */}
                    <div className='mt-6 guarantee-cheque-div'>
                        <span>Guarantee Cheque Info</span>
                    </div>

                    {/* BANK NAME AND BRANCH NAME ROW */}
                    <div className='row mt-5'>
                        <div className='col-xl-6'>
                            <label className='level-title'>Bank Name<i style={{ color: "red" }}>*</i></label>
                            <select id="bankId" className='form-control' name="bankId" value={guaranteeChequeInfo.bankId || ""} onChange={(event) => handleGuaranteeChequeInfoChange(event)}>

                                <option value="">Please select bank</option>
                                {
                                    allBank.map((bank) => (
                                        <option key={bank.id} value={bank.id}>{bank.name}</option>
                                    ))}
                            </select>
                        </div>
                        <div className='col-xl-6 '>
                            <label className='level-title'>Bank Branch Name<i style={{ color: "red" }}>*</i></label>
                            <select id="branchId" className='form-control' name="branchId" value={guaranteeChequeInfo.branchId || ""} onChange={(event) => handleGuaranteeChequeInfoChange(event)}>

                                <option value="">Please select branch name</option>
                                {
                                    allBranch.map((branch) => (
                                        <option key={branch.id} value={branch.id}>{branch.name}</option>
                                    ))}
                            </select>
                        </div>
                    </div>

                    {/* CHEQUE NO AND CHEQUE TYPE ROW */}
                    <div className='row mt-5'>
                        <div className='col-xl-6'>
                            <label className='level-title'>Cheque No.<i style={{ color: "red" }}>*</i></label>
                            <input placeholder='Ex. ff1425465452345235' id="chequeNo" type="text" className='form-control' name="chequeNo" value={guaranteeChequeInfo.chequeNo || ""} onChange={(event) => handleGuaranteeChequeInfoChange(event)}></input>
                        </div>
                        <div className='col-xl-6'>
                            <label className='level-title'>Cheque Type<i style={{ color: "red" }}>*</i></label>
                            <input placeholder='Ex. open cheque' id="chequeType" type="text" className='form-control' name="chequeType" value={guaranteeChequeInfo.chequeType || ""} onChange={(event) => handleGuaranteeChequeInfoChange(event)}></input>
                        </div>
                    </div>

                    {/* CHEQUE AMOUNT ROW */}
                    <div className='row mt-5'>
                        <div className='col-xl-6'>
                            <label className='level-title'>Cheque Amount</label>
                            <input placeholder='Ex. 14,254,654' id="chequeAmount" type="text" className='form-control' name="chequeAmount"
                                value={guaranteeChequeInfo.chequeAmount || ""}
                                onPaste={(e) => allowOnlyNumericWithPeriodWhenPaste(e)}
                                onChange={(event) => handleGuaranteeChequeInfoChange(event)}></input>
                        </div>
                    </div>

                    {/* ASSIGN ROW */}
                    {/* {assignToObj.map((element, index) => (
                        <div className="row mt-5" key={index}>
                            <div className='col-xl-12 guarantee-cheque-div'>
                                <span>Assign to({index + 1})</span>
                            </div>
                            <div className="form-group col-xl-12 mt-5 float-right">
                                {
                                    index === 0 ? ""
                                        :
                                        <button
                                            type="button"
                                            className="btn btn-sm float-right"
                                            onClick={() => removeAssignToFormFields(index)}
                                        >
                                            <i style={{ marginLeft: "-15px", fontSize: "16px" }} class="bi bi-trash3-fill text-danger"></i>
                                        </button>
                                }
                            </div>

                            COMPANY AND LOCATION ROW
                            <div className="col-xl-12">
                                <div className="form-group row">
                                    <div className="col-xl-6">
                                        <label className='level-title'>Company<i style={{ color: "red" }}>*</i></label>
                                        <select id="companyId" className='form-control' name="companyId" value={element.companyId || ""} onChange={e => handleAssignToChange(index, e)} >
                                            <option value="">Please select company</option>
                                            {
                                                allCompany.map((company) => (
                                                    <option  value={company.id}>{company.name}</option>
                                                ))}
                                        </select>
                                    </div>
                                    <div className="col-xl-6">
                                        <label className='level-title'>Location<i style={{ color: "red" }}>*</i></label>
                                        <select id="locationId" className='form-control' name="locationId" value={element.locationId || ""} onChange={e => handleAssignToChange(index, e)} >
                                            <option value="">Please select Location</option>
                                            {
                                                allLocation.map((location) => (
                                                    <option key={location.id} value={location.id}>{location.name}</option>
                                                ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            REPRESENTATIVE ROW
                            <div className="col-xl-12">
                                <label className='level-title'>Representative<i style={{ color: "red" }}>*</i></label>
                                <select id="salesOfficerId" className='form-control' name="salesOfficerId" value={element.salesOfficerId || ""} onChange={e => handleAssignToChange(index, e)} >

                                    <option value="">Please select Representative</option>
                                    {
                                        allSo.map((so) => (
                                            <option key={so.salesOfficerId} value={so.salesOfficerId}>{so.salesOfficerName}</option>
                                        ))}
                                </select>
                            </div>
                        </div>
                    ))}
                    <div className='col-xl-12 text-center m-0 auto bg-success mt-5'>
                        <button
                            type="button"
                            className="btn text-white"
                            onClick={() => addAssignToFormFields()}
                        >
                            <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/add-btn.svg")} />Assign More
                        </button>
                    </div> */}

                    {/* FOR TESTING PURPOSE */}

                    {/* ASSIGN ROW */}
                    {assignToObj.map((element, index) => (
                        <div className="row mt-5" key={index}>
                            <div className='col-xl-12 guarantee-cheque-div'>
                                <span>Assign to({index + 1})</span>
                            </div>
                            <div className="form-group col-xl-12 mt-5 float-right">
                                {
                                    index === 0 ? ""
                                        :
                                        <button
                                            type="button"
                                            className="btn btn-sm float-right"
                                            onClick={() => removeAssignToFormFields(index)}
                                        >
                                            <i style={{ marginLeft: "-15px", fontSize: "16px" }} class="bi bi-trash3-fill text-danger"></i>
                                        </button>
                                }
                            </div>

                            {/* COMPANY AND LOCATION ROW */}
                            <div className="col-xl-12">
                                <div className="form-group row">
                                    <div className="col-xl-6">
                                        <label className='level-title'>Company<i style={{ color: "red" }}>*</i></label>
                                        <select id={"companyId-id-" + index} className='form-control' name="companyId" value={element.companyId || ""}
                                            //onChange={e => handleAssignToChange(index, e)} 
                                            onChange={(event) => handleCompanyChange(event, index)}>

                                            <option value="">Please select company</option>
                                            {
                                                allCompany.map((company) => (
                                                    <option value={company.id}>{company.name}</option>
                                                ))}
                                        </select>
                                    </div>
                                    <div className="col-xl-6">
                                        <label className='level-title'>Location<i style={{ color: "red" }}>*</i></label>
                                        <select id={"location-id-" + index} className='form-control' name="locationId" value={element.locationId || ""}
                                            onChange={(event) => handleLocationChange(event, index)}
                                        >
                                            <option value="">Please select Location</option>
                                            {
                                                element.locationArray!=null ?
    
                                                element.locationArray.map((location) => (
                                                    <option key={location.id} value={location.id}>{location.name}</option>
                                                ))
                                            : ''}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* REPRESENTATIVE ROW */}
                            <div className="col-xl-12">
                                <label className='level-title'>Representative<i style={{ color: "red" }}>*</i></label>
                                <select id="salesOfficerId" className='form-control' name="salesOfficerId" value={element.salesOfficerId || ""} onChange={e => handleAssignToChange(index, e)} >

                                    <option value="">Please select Representative</option>
                                    {
                                        element.soArray.map((so) => (
                                            <option key={so.salesOfficerId} value={so.salesOfficerId}>{so.salesOfficerName}</option>
                                        ))}
                                </select>
                            </div>

                            {/* ASSIGN MORE BUTTON */}
                            <div className='col-xl-12 text-center m-0 auto bg-success mt-5'>
                                <button
                                    type="button"
                                    className="btn text-white"
                                    onClick={() => addAssignToFormFields(index)}
                                >
                                    <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/add-btn.svg")} />Assign More
                                </button>
                            </div>
                        </div>
                    ))}

                </div>;
            case 1:
                return <div className='steper-height ml-5'>
                    <div>
                        <span className="create-field-title">License Info</span>
                        <p style={{ color: "#B6B6B6" }}>If you need more info, please check out <NavLink to="/salescollection/distributors/overview" className="faq-title"><u>FAQ Page</u></NavLink></p>
                    </div>
                    {/* VAT REGISTRATION NO. AND TIN REGISTRATION NO. ROW */}
                    <div className='row mt-5'>
                        <div className='col-xl-6'>
                            <label className='level-title'>VAT Registration No.</label>
                            <input placeholder='AC23241885780820' id="vatRegistrationNo" type="text" className='form-control' name="vatRegistrationNo" value={licenseInfo.vatRegistrationNo || ""} onChange={(event) => handlelicenseInfoChange(event)}></input>
                        </div>
                        <div className='col-xl-6'>
                            <label className='level-title'>TIN Registration No.</label>
                            <input placeholder='AC12382324188578' id="tinRegistrationNo" type="text" className='form-control' name="tinRegistrationNo" value={licenseInfo.tinRegistrationNo || ""} onChange={(event) => handlelicenseInfoChange(event)}></input>
                        </div>
                    </div>

                    {/* TRADE LICENSE NO. AND PESTICIDE LICENSE NO. ROW */}
                    <div className='row mt-5'>
                        <div className='col-xl-6'>
                            <label className='level-title'>Trade License No</label>
                            <input placeholder='AC23241885780820' id="tradeLicenseNo" type="text" className='form-control' name="tradeLicenseNo" value={licenseInfo.tradeLicenseNo || ""} onChange={(event) => handlelicenseInfoChange(event)}></input>
                        </div>
                        <div className='col-xl-6'>
                            <label className='level-title'>Pesticide License No</label>
                            <input placeholder='Ac12382324188578' id="pesticideLicenseNo" type="text" className='form-control' name="pesticideLicenseNo" value={licenseInfo.pesticideLicenseNo || ""} onChange={(event) => handlelicenseInfoChange(event)}></input>
                        </div>
                    </div>

                    {/* SEED LICENSE NO. ROW */}
                    <div className='row mt-5'>
                        <div className='col-xl-6'>
                            <label className='level-title'>Seed License No</label>
                            <input placeholder='Ac23241885780820' id="seedLicenseNo" type="text" className='form-control' name="seedLicenseNo" value={licenseInfo.seedLicenseNo || ""} onChange={(event) => handlelicenseInfoChange(event)}></input>
                        </div>
                    </div>
                </div>;
            case 2:
                return <div className='steper-height ml-5'>
                    <div>
                        <span className="create-field-title">Proprietor Info</span>
                        <p style={{ color: "#B6B6B6" }}>If you need more info, please check out <NavLink to="/salescollection/distributors/overview" className="faq-title"><u>FAQ Page</u></NavLink></p>
                    </div>
                    {/* ASIGN PROPRIETOR ROW */}
                    {assignProprietorInfoObj.map((element, index) => (
                        <div className="row mt-5" key={index}>
                            <div className='col-xl-12 guarantee-cheque-div'>
                                <span>Proprietor Info({index + 1})</span>
                            </div>
                            <div className="form-group col-xl-12 mt-5 float-right">
                                {
                                    index === 0 ? ""
                                        :
                                        <button
                                            type="button"
                                            className="btn btn-sm float-right"
                                            onClick={() => removeProprietorFormFields(index)}
                                        >
                                            <i style={{ marginLeft: "-15px", fontSize: "16px" }} class="bi bi-trash3-fill text-danger"></i>
                                        </button>
                                }
                            </div>

                            {/* PROPRIETOR IMAGE ROW */}
                            <div className='col-lg-12' style={{ textAlign: "center", marginBottom: "50px" }}>
                                <div className="image-input image-input-circle" data-kt-image-input="true">
                                    <div className="image-input-wrapper w-125px h-125px"></div>
                                    <label className="btn btn-icon btn-circle btn-color-muted btn-active-color-primary w-25px h-25px bg-body shadow"
                                        data-kt-image-input-action="change"
                                        data-bs-toggle="tooltip"
                                        data-bs-dismiss="click"
                                        title="Change Proprietor Picture"
                                    >
                                        <div>
                                            <img className="image-input image-input-circle"
                                                id={"proprietorImgId-" + index}
                                                src={(element.imagePath === undefined || element.imagePath === null || element.imagePath === "") ? (element.filePath === undefined || element.filePath === "" || element.filePath === null) ? proprietorImg : `data:image/png;base64,${element.filePath}` : toAbsoluteUrl(element.imagePath)}
                                                style={{ width: "150px", height: "150px", textAlign: "center" }} alt='Proprietor Picture' />
                                        </div>
                                        <div id='imgUploadDiv1' className='imgUploadDiv'>
                                            <i className="bi bi-pencil-fill fs-7" style={{ fontSize: "12px", padding: "7px", color: "white" }}></i>
                                        </div>
                                        <input id={"proprietorLogoUploader-" + index} type="file" name="fileName"
                                            onChange={e => handleProprietorChange(index, e)} accept=".png, .jpg, .jpeg" />
                                    </label>
                                </div>
                            </div>

                            <div className='col-lg-12 mt-5' style={{ textAlign: "center" }}>
                                <label className='level-title'>Upload Proprietor’s Photo</label>
                            </div>

                            {/* PROPRIETOR NAME ROW */}
                            <div className="col-xl-12 mt-5">
                                <label className='level-title'>Proprietor Name<i style={{ color: "red" }}>*</i></label>
                                <input placeholder='Ex. John Doe' id="name" type="text" className='form-control' name="name" value={element.name || ""} onChange={e => handleProprietorChange(index, e)} />
                            </div>

                            {/* PROPRIETOR NID NO. ROW */}
                            <div className="col-xl-12 mt-5">
                                <label className='level-title'>Proprietor’s NID No.<i style={{ color: "red" }}>*</i></label>
                                <input placeholder='Ex. 465467984794' id="nid" type="text" className='form-control' name="nid" value={element.nid || ""}
                                    onChange={e => handleProprietorChange(index, e)} onKeyPress={e => allowOnlyNumeric(e)} onPaste={handlePasteDisable} />
                            </div>

                            {/* PROPRIETOR FATHER NAME ROW */}
                            <div className="col-xl-12 mt-5">
                                <label className='level-title'>Proprietor Father’s Name</label>
                                <input placeholder='Ex. Peter Doe' id="fatherName" type="text" className='form-control' name="fatherName" value={element.fatherName || ""} onChange={e => handleProprietorChange(index, e)}
                                />
                            </div>

                            {/* PROPRIETOR MOTHER NAME ROW */}
                            <div className="col-xl-12 mt-5">
                                <label className='level-title'>Proprietor Mother’s Name</label>
                                <input placeholder='Ex. Angel Cristina ' id="motherName" type="text" className='form-control' name="motherName" value={element.motherName || ""} onChange={e => handleProprietorChange(index, e)} />
                            </div>

                            {/* PROPRIETOR CONTACT NO. ROW */}
                            <div className="col-xl-12 mt-5">
                                <label className='level-title'>Proprietor’s Contact<i style={{ color: "red" }}>*</i></label>
                                <PhoneInput
                                    international
                                    countryCallingCodeEditable={false}
                                    defaultCountry="BD"
                                    className='form-control'
                                    id="contactNo"
                                    name="contactNo"
                                    value={element.contactNo || ""}
                                    onChange={e => handleProprietorContactNoChange("contactNo_" + index, e)}
                                />
                            </div>

                            {/* PROPRIETOR ADDRESS ROW */}
                            <div className="col-xl-12 mt-5">
                                <label className='level-title'>Proprietor’s Address</label>
                                <textarea rows="5" id="address" type="text" className='form-control' name="address" value={element.address || ""} onChange={e => handleProprietorChange(index, e)} placeholder='Ex. mirpur, dhaka'></textarea>
                            </div>
                        </div>
                    ))}
                    <div className='col-xl-12 text-center m-0 auto bg-success mt-5'>
                        <button
                            type="button"
                            className="btn text-white"
                            onClick={() => addProprietorFormFields()}
                        >
                            <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/add-btn.svg")} />Assign More
                        </button>
                    </div>
                </div>;
            case 3:
                return <div className='steper-height ml-5'>
                    <div>
                        <span className="create-field-title">Guarantor Info</span>
                        <p style={{ color: "#B6B6B6" }}>If you need more info, please check out <NavLink to="/salescollection/distributors/overview" className="faq-title"><u>FAQ Page</u></NavLink></p>
                    </div>
                    {/* ASIGN GUARANTOR ROW */}

                    {assignGuarantorInfoObj.map((guarantor, index) => (
                        <div className="row mt-5" key={index}>
                            <div className='col-xl-12 guarantee-cheque-div'>
                                <span>Guarantor Info({index + 1})</span>
                            </div>
                            <div className="form-group col-xl-12 mt-5 float-right">
                                {
                                    index === 0 ? ""
                                        :
                                        <button
                                            type="button"
                                            className="btn btn-sm float-right"
                                            onClick={() => removeGuarantorFormFields(index)}
                                        >
                                            <i style={{ marginLeft: "-15px", fontSize: "16px" }} class="bi bi-trash3-fill text-danger"></i>
                                        </button>
                                }
                            </div>

                            {/* GUARANTOR IMAGE ROW */}
                            <div className='col-lg-12' style={{ textAlign: "center", marginBottom: "50px" }}>
                                <div className="image-input image-input-circle">
                                    <div className="image-input-wrapper w-125px h-125px"></div>
                                    <label className="btn btn-icon btn-circle btn-color-muted btn-active-color-primary w-25px h-25px bg-body shadow"
                                        data-kt-image-input-action="change"
                                        data-bs-toggle="tooltip"
                                        data-bs-dismiss="click"
                                        title="Change Guarantor Picture"
                                    >
                                        <div>
                                            <img className="image-input image-input-circle"
                                                id={"guarantorImgId-" + index}
                                                src={(guarantor.imagePath === undefined || guarantor.imagePath === null || guarantor.imagePath === "") ? (guarantor.filePath === undefined || guarantor.filePath === null || guarantor.filePath === "") ? guarantorImg : `data:image/png;base64,${guarantor.filePath}` : toAbsoluteUrl(guarantor.imagePath)}
                                                style={{ width: "150px", height: "150px", textAlign: "center" }} alt='Guarantor Picture' />
                                        </div>
                                        <div className='imgUploadDiv'>
                                            <i className="bi bi-pencil-fill fs-7" style={{ fontSize: "12px", padding: "7px", color: "white" }}></i>
                                        </div>
                                        <input id={"distributorGaurantorLogoUploader-" + index} type="file" name="fileName"
                                            onChange={e => handleGuarantorChange(index, e)} accept=".png, .jpg, .jpeg" />
                                    </label>
                                </div>
                            </div>

                            <div className='col-lg-12 mt-5' style={{ textAlign: "center" }}>
                                <label className='level-title'>Upload Guarantor’s Photo</label>
                            </div>

                            {/* GUARANTOR NAME ROW */}
                            <div className="col-xl-12 mt-5">
                                <label className='level-title'>Guarantor Name<i style={{ color: "red" }}>*</i></label>
                                <input placeholder='Ex. Roney Doe' id="name" type="text" className='form-control' name="name" value={guarantor.name || ""} onChange={e => handleGuarantorChange(index, e)} />
                            </div>

                            {/* GUARANTOR NID NO. ROW */}
                            <div className="col-xl-12 mt-5">
                                <label className='level-title'>Guarantor’s NID No.<i style={{ color: "red" }}>*</i></label>
                                <input placeholder='Ex. 465467984794' id="nid." type="text" className='form-control' name="nid" value={guarantor.nid || ""}
                                    onChange={e => handleGuarantorChange(index, e)} onKeyPress={e => allowOnlyNumeric(e)} onPaste={handlePasteDisable} />
                            </div>

                            {/* GUARANTOR FATHER NAME ROW */}
                            <div className="col-xl-12 mt-5">
                                <label className='level-title'>Guarantor Father’s Name</label>
                                <input placeholder='Ex. John Doe' id="fatherName" type="text" className='form-control' name="fatherName" value={guarantor.fatherName || ""} onChange={e => handleGuarantorChange(index, e)} />
                            </div>

                            {/* GUARANTOR MOTHER NAME ROW */}
                            <div className="col-xl-12 mt-5">
                                <label className='level-title'>Guarantor Mother’s Name</label>
                                <input placeholder='Ex. Anabel Cristina ' id="motherName" type="text" className='form-control' name="motherName" value={guarantor.motherName || ""} onChange={e => handleGuarantorChange(index, e)} />
                            </div>

                            {/* GUARANTOR CONTACT NO. ROW */}
                            <div className="col-xl-12 mt-5">
                                <label className='level-title'>Guarantor’s Contact<i style={{ color: "red" }}>*</i></label>
                                <PhoneInput
                                    international
                                    countryCallingCodeEditable={false}
                                    defaultCountry="BD"
                                    className='form-control'
                                    id="contactNo"
                                    name="contactNo"
                                    value={guarantor.contactNo || ""}
                                    onChange={e => handleGuarantorContactNoChange("contactNo_" + index, e)}
                                />
                            </div>

                            {/* GUARANTOR ADDRESS ROW */}
                            <div className="col-xl-12 mt-5">
                                <label className='level-title'>Guarantors Address</label>
                                <textarea rows="5" id="address" type="text" className='form-control' name="address" value={guarantor.address || ""} onChange={e => handleGuarantorChange(index, e)} placeholder='Ex. mirpur, dhaka'></textarea>
                            </div>
                        </div>
                    ))}
                    <div className='col-xl-12 text-center m-0 auto bg-success mt-5'>
                        <button
                            type="button"
                            className="btn text-white"
                            onClick={() => addGuarantorFormFields()}
                        >
                            <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/add-btn.svg")} />Assign More
                        </button>
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
                            <span className='text-muted'>{ditributorInfo.id !== null || ditributorInfo.id !== "" || ditributorInfo.id !== undefined ? "Distributor has been updated Successfully!!" : "New Distributor has been Added Successfully!!"}</span>
                        </div>
                        <div className='thanks-sub-title mt-12'>
                            <strong style={{ fontSize: "17px" }}>{ditributorInfo.id !== null || ditributorInfo.id !== "" || ditributorInfo.id !== undefined ? "Distributor Info" : "New Distributor Info"}</strong>
                        </div>
                    </div>
                    <div className='col-lg-12'>
                        <div className='row'>
                            <div className='offset-xl-4 col-xl-4 d-flex justify-content-center distributor-thanks-div text-white'>
                                <div>
                                    <SVG src={toAbsoluteUrl({ fileList })} width="100px" height="75px" />
                                </div>
                                <div>
                                    <span style={{ fontWeight: "500" }}><strong>{ditributorInfo.distributorName}</strong></span><br />
                                    {/* <span>ID&nbsp;<strong style={{ fontWeight: "500" }}>50000</strong></span><br />
                                    <span>Credit Limit&nbsp;<strong style={{ fontWeight: "500" }}>৳0</strong></span><br />
                                    <span>Balance&nbsp;<strong style={{ fontWeight: "500" }}>৳0</strong></span> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>;
        }
    }
    const backToListPage = () => {
        props.history.push("/salescollection/distributors/distributors-list");
    }
    return (
        <>
            {/* BREAD CRUM ROW */}
            <div className="row" style={{ marginTop: "-30px", marginLeft: "-18px" }}>
                <div className="col-xl-6">
                    <nav aria-label="breadcrumb">
                        <ol className="breadCrum-bg-color">
                            <li aria-current="page" className='breadCrum-main-title'>{parentCompany?.name}</li>
                            <li aria-current="page" className='mt-1 breadCrum-sub-title'>&nbsp;Sales & Collection&nbsp;&nbsp;&nbsp;&nbsp;</li>
                            <li aria-current="page" className='mt-1 text-primary'><span className='font-weight-bolder'>.</span></li>
                            <li aria-current="page" className='mt-1 breadCrum-sub-title text-primary'>Distributors&nbsp;&nbsp;&nbsp;&nbsp;</li>
                            <li aria-current="page" className='mt-1 text-primary'><span className='font-weight-bolder'>.</span></li>
                            <li aria-current="page" className='mt-1 breadCrum-sub-title text-primary'>Create Distributors</li>
                        </ol>
                    </nav>
                </div>
                <div className="col-xl-6 d-flex justify-content-end">
                    <div className="mr-5">
                        <button
                            type="button"
                            className="btn approval-config-btn btn-hover-primary"
                            data-toggle="tooltip" data-placement="bottom" title="Approval Path Config"
                        >
                            <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/approval.svg")} width="15px" height="15px" />
                            &nbsp;&nbsp;Approval Path Config.
                        </button>
                    </div>
                    <div>
                        <button
                            type="button"
                            className="btn approval-config-btn btn-hover-primary"
                            data-toggle="tooltip" data-placement="bottom" title="Product Configure"
                        >
                            <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/configure.svg")} width="15px" height="15px" />
                            &nbsp;&nbsp;Product Configure
                        </button>
                    </div>
                </div>
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
                                        <NavLink to="/salescollection/distributors/distributors-list">&nbsp; Back to distributors menu
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
                                    <div style={{ textAlign: 'center', marginTop: '100px' }}>
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