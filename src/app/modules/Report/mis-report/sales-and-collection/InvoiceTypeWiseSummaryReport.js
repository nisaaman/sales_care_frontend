import React, { useEffect, useMemo, useState } from 'react';
import { toAbsoluteUrl } from "../../../../../_metronic/_helpers";
import { Card, CardBody } from "../../../../../_metronic/_partials/controls";
import { useHistory } from 'react-router-dom';
import LocationTreeView from '../../../SalesCollection/CommonComponents/LocationTreeView';
import { showError } from '../../../../pages/Alert';
import axios from "axios";
import { useIntl } from "react-intl";
import { shallowEqual, useSelector } from "react-redux";
import MisReportBreadCrum from '../MisReportBreadCrum';


import Autocomplete from "@material-ui/lab/Autocomplete";
import { TextField } from "@material-ui/core";
import Button from '@material-ui/core/Button';
import { typeOf } from 'react-is';
import moment from "moment";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_green.css";
import { getDayDiff, getDaysCount } from "../../../Util"


export default function InvoiceTypeWiseSummaryReport() {

    const fields = {
        locationId: "",
        salesOfficerId: "",
        distributorId: "",
        startDate: "",
        endDate: "",
        report: "",
        reportType: ""

    };

    const [inputs, setInputs] = useState(fields);
    const userId = useSelector((state) => state.auth.user.userId, shallowEqual);
    const companyId = useSelector((state) => state.auth.company, shallowEqual);
    const selectedCompany = useSelector((state) => state.auth.company, shallowEqual);
    const userLoginId = useSelector((state) => state.auth.user.userId, shallowEqual);
    const intl = useIntl();
    const [locationTree, setLocationTree] = useState([]);
    const [sessionData, setSessionData] = useState({ userLoginId: userId, companyId: companyId });
    const [accountingYearId, setAccountingYearId] = useState('');
    const [locationId, setLocationId] = useState('');
    const [productCategoryId, setProductCategoryId] = useState('');
    const [salesOfficer, setSalesOfficer] = useState([]);
    const [salesOfficerValue, setSalesOfficerValue] = useState(null);
    const [distributorValue, setDistributorValue] = useState(null);
    const [distributors, setDistributors] = useState([]);
    const [showReport, setShowReport] = useState('');
    const [reportData, setReportData] = useState([]);
    const [locationIds] = useState([]);


    const searchParams = useMemo(() => {
        return {
            userLoginId: userLoginId, companyId: selectedCompany, accountingYearId: accountingYearId
            , locationId: locationId, productCategoryId: productCategoryId
        }
    }, [userLoginId, selectedCompany, accountingYearId, locationId, productCategoryId]);

    const [selectedLocation, setSelectedLocation] = useState({});
    const [total, setTotal] = useState({ totalQuantity: 0, totlaSalesAmount: 0 });
    const [salesDataList, setInvoiceWiseAgingReportList] = useState([]);

    let history = useHistory();
    const [anchorEl, setAnchorEl] = React.useState(null);
    let [singleAll, setSingleAll] = React.useState([]);

    const handleClick = (event) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    };
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popper' : undefined;


    useEffect(() => {
        document.getElementById('reportShowIframe').style.display = "none";
        getLocationTreeList(searchParams);
    }, [userLoginId, selectedCompany]);

    const getLocationTreeList = (params) => {
        const URL = `${process.env.REACT_APP_API_URL}/api/location-tree/locationTree/${params.userLoginId}/${params.companyId}`;
        axios.get(URL).then(response => {
            const locationTree = response.data.data;
            setLocationTree(locationTree);
        }).catch(err => {
            showError("Cannot get Location Tree data.");
        });
    }

    const selectLocationTreeNode = (node) => {
        let id = "summary-id-" + node.id;
        const getId = document.getElementById(id);
        const getElements = document.getElementsByClassName('tree-nav__item_demo tree-nav__item-title');

        for (var i = 0; i < getElements.length; i++) {
            getElements[i].classList.remove('tree-nav-item');
        }
        if (getId) {
            getId.classList.add('tree-nav-item');
            setSelectedLocation(node);
            setLocationId(node.id);
            setInputs({ ...inputs, "locationId": node.id })
            if (node.id) {
                getSalesOfficerListByLocation(node.id, selectedCompany)
                getAllDistributorList(userId, node.id, selectedCompany)
            }
        }
        if (locationIds.length !== 0) { // for clear state
            locationIds.length = 0;
        }
        getLocationIds(node);
    }

    const getLocationIds = (node) => {
        let temp = [...locationIds]
        let index = temp.findIndex(id => id === node.id)
        if (index === -1) {
            locationIds.push(node.id)
        }
        node.children.map(nodeChild => {
            getLocationIds(nodeChild)
        })
    }

    const getSalesOfficerListByLocation = (locationId, companyId) => {
        const URL = `${process.env.REACT_APP_API_URL}/auth/get-sales-officer-location/${locationId}/${companyId}`;
        axios.get(URL).then(response => {
            console.log(response.data.data)
            if (response.data.data != undefined) {
                console.log(response.data.data)
                setSalesOfficer(response.data.data);
            }
            else {
                setSalesOfficer([]);
                setSalesOfficerValue('');
            }
        }).catch(err => {
            showError("Cannot get Company data.");
        });
    }


    const getAllDistributorList = (userLoginId, locationId, companyId) => {
        const URL = `${process.env.REACT_APP_API_URL}/api/distributor/distributorList/${userLoginId}/${locationId}/${companyId}`;//API call from backend
        axios.get(URL).then(response => {//get data in response
            console.log('hello', response.data.data)
            if (response.data.data != undefined && response.data.data.length != 0) {
                setDistributors(response.data.data);
            }
            else {
                setDistributors([]);
                setDistributorValue('');
            }
        }).catch(err => {
            showError("Cannot get Distributor data.");
        });
    }
    const handleChangeDistributor = (e, dis) => {
        if (dis.distributorId !== null || dis.distributorId !== "") {
            setInputs({ ...inputs, distributorId: parseInt(dis.distributorId) });
        }
    }

    const handleChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;
        setInputs(values => ({ ...values, [name]: value }))
    }

    const validate = () => {
        console.log("inputs=", inputs)

        // if (!inputs.locationId) {
        //     showError('Location is required.');
        //     return false;
        // }
        // else if (!inputs.salesOfficerId) {
        //     showError('Sales Officer Name is required.');
        //     return false;
        // }
        // else if (!inputs.distributorId) {
        //     showError('Distributor Name is required.');
        //     return false;
        // }
        // else 
        if (inputs.startDate === undefined || inputs.startDate === "") {
            //showError("Start date  is required");
        } else if (inputs.endDate === undefined || inputs.endDate === "") {
            //showError("End date is required");
        } else if (new Date(inputs.endDate) < new Date(inputs.startDate)) {
            showError("End Date should be greater than Start Date.");
            return false;
        } 
        // else if (!inputs.report) {
        //     showError('Report Format is required.');
        //     return false;
        // }
        // else if (!inputs.reportType) {
        //     showError('Report Type is required.');
        //     return false;
        // }
        return true;
    }

    const download = () => {

        if (inputs.locationId === "") {
            // all location pass when none selected
            locationTree.map(childLocation => {
                getLocationIds(childLocation);
            })
        }
        if (!validate()) {
            return false;
        }
        let queryString = '?';
        queryString += 'companyId=' + companyId;
        queryString += inputs.salesOfficerId ? '&salesOfficerId=' + parseInt(inputs.salesOfficerId) : '';
        queryString += '&reportFormat=' + "PDF";
        queryString += '&startDate=' + inputs.startDate;
        queryString += '&endDate=' + inputs.endDate;
        queryString += inputs.distributorId ? '&distributorId=' + parseInt(inputs.distributorId) : '';
        //queryString += '&locationId=' + parseInt(inputs.locationId);
        queryString += locationIds.length !== 0 ? '&locationIds=' + locationIds : '';

        const URL = `${process.env.REACT_APP_API_URL}/api/reports/invoice-type-wise-summary-report` + queryString;
        console.log(URL);
        axios.get(URL, { responseType: 'blob' }).then(response => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', "invoiceTypeWiseSummaryReport.xlsx");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        }).catch(err => {
            showError();
        });

    }

    const preview = () => {

        if (inputs.locationId === "") {
            // all location pass when none selected
            locationTree.map(childLocation => {
                getLocationIds(childLocation);
            })
        }
        if (!validate()) {
            return false;
        }
        let queryString = '?';
        queryString += 'companyId=' + companyId;
        queryString += inputs.salesOfficerId ? '&salesOfficerId=' + parseInt(inputs.salesOfficerId) : '';
        queryString += '&reportFormat=' + "pdf";
        queryString += '&startDate=' + inputs.startDate;
        queryString += '&endDate=' + inputs.endDate;
        queryString += inputs.distributorId ? '&distributorId=' + parseInt(inputs.distributorId) : '';
        //queryString += '&locationId=' + parseInt(inputs.locationId);
        queryString += locationIds.length !== 0 ? '&locationIds=' + locationIds : '';

        const dataURL = `${process.env.REACT_APP_API_URL}/api/reports/invoice-type-wise-summary-report` + queryString;
        axios.get(dataURL, { responseType: 'blob' }).then(response => {
            const file = new Blob([response.data], { type: "application/pdf" });
            const fileURL = URL.createObjectURL(file);
            const iframe = document.querySelector("iframe");
            if (iframe?.src) iframe.src = fileURL;
            document.getElementById('reportShowIframe').style.display = "inline-block";

        }).catch(err => {
            showError();
        });

    }
    const getReportData = () => {
        if (!validate()) {
            return false;
        }
        setShowReport(inputs.reportType);
        // if(!validate()){
        //     return false;
        // }
        // let queryString = "?";
        // queryString += 'salesOfficerId=' + parseInt(inputs.salesOfficerId);
        // queryString += '&startDate=' + inputs.startDate;
        // queryString += '&endDate=' + inputs.endDate;

        axios.get(URL).then((response) => {
            setReportData(response.data.data);
            setShowReport(true);
        }).catch();
    }
    // console.log(inputs)
    return (
        <>
            <div>
                <MisReportBreadCrum menuTitle="Invoice Type Wise Summary Report" />
            </div>
            <div>
                <Card>
                    <CardBody>
                        <div className='row'>
                            {/* LEFT SIDE TREE ROW */}
                            <div className='col-xl-3' style={{ borderRight: "1px solid #F2F2F2" }}>
                                <div style={{ borderBottom: "1px solid #F2F2F2" }}>
                                    <label>
                                        <img src={toAbsoluteUrl("/images/loc3.png")}
                                            style={{ width: "20px", height: "20px", textAlign: "center" }}
                                            alt='Company Picture' />
                                        <strong style={{ marginLeft: "10px", color: "#828282" }}>{intl.formatMessage({ id: "COMMON.LOCATION_ALL" })}</strong>
                                    </label>
                                </div>
                                {/* TREE */}
                                <LocationTreeView tree={locationTree} selectLocationTreeNode={selectLocationTreeNode} />
                            </div>
                            {/* RIGHT SIDE LIST ROW */}
                            <div className='col-xl-9'>
                                <div className='mt-5 row'>
                                    <div className='col-xl-8'>
                                        <div style={{ marginTop: "5px" }}>
                                            <label className='level-title'>Sales Officer</label><br />
                                            <Autocomplete
                                                name="salesOfficerId"
                                                options={salesOfficer}
                                                onKeyDown={getSalesOfficerListByLocation}
                                                getOptionLabel={(option) => option.salesOfficerName}
                                                value={salesOfficerValue}
                                                onChange={(event, newValue) => {
                                                    setSalesOfficerValue(newValue)
                                                    if (newValue !== null) {
                                                        setInputs({ ...inputs, salesOfficerId: newValue.id });
                                                    } else {
                                                        setInputs({ ...inputs, salesOfficerId: '' });
                                                    }
                                                }}
                                                renderInput={(params) => (
                                                    <TextField {...params} label="Select Sales Officer" />
                                                )}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className='mt-5 row'>
                                    <div className='col-xl-8'>
                                        <label className='level-title'><span className="mr-1">Distributor</span></label>
                                        <Autocomplete
                                            //id="distributorId"
                                            name="distributorId"
                                            options={distributors}
                                            onKeyDown={getAllDistributorList}
                                            getOptionLabel={(option) => option.distributorName}
                                            value={distributorValue}
                                            onChange={(event, newValue) => {
                                                setDistributorValue(newValue)
                                                if (newValue !== null) {
                                                    setInputs({ ...inputs, distributorId: newValue.distributorId });
                                                } else {
                                                    setInputs({ ...inputs, distributorId: '' });
                                                }
                                            }}
                                            renderInput={(params) => (
                                                <TextField {...params} label="Select Distributor" />
                                            )}
                                        />
                                    </div>
                                </div>

                                <div className='row'>
                                    <div className='form-group col-lg-8 first-level-top'>
                                        <label className='level-title'>Start Date<i style={{ color: "red" }}>*</i></label>
                                        <Flatpickr className="form-control" id="startDate" placeholder="dd-MM-yyyy"
                                            name='startDate'
                                            value={inputs.startDate ? moment(inputs.startDate, "YYYY-MM-DD").format("DD-MMM-YYYY") : ''}
                                            options={{ dateFormat: "d-M-Y" }}
                                            onChange={(value) => {
                                                setInputs({
                                                    ...inputs, "startDate": moment(new Date(value)).format("YYYY-MM-DD")
                                                })

                                            }}
                                        />
                                    </div>
                                </div>


                                <div className='row'>
                                    <div className='form-group col-lg-8 first-level-top'>
                                        <label className='level-title'>End Date<i style={{ color: "red" }}>*</i></label>
                                        <Flatpickr className="form-control" id="endDate" placeholder="dd-MM-yyyy"
                                            name='endDate'
                                            value={inputs.endDate ? moment(inputs.endDate, "YYYY-MM-DD").format("DD-MMM-YYYY") : ''}
                                            options={{ dateFormat: "d-M-Y" }} required
                                            onChange={(value) => {
                                                setInputs({
                                                    ...inputs, "endDate": moment(new Date(value)).format("YYYY-MM-DD")
                                                })
                                            }}
                                        />
                                    </div>
                                </div>


                                {/* <div className='row'>
                                    <div className='form-group col-lg-8 first-level-top'>
                                        <div>
                                            <label className='level-title'><span className="mr-1">Report Format</span><span className="text-danger ">*</span></label>
                                            <select className="form-control" id="reportId" name="report"
                                                onChange={(e) => handleChange(e)}
                                            >
                                                <option value="">Select Report Format</option>
                                                <option value="pdf">Pdf</option>
                                                <option value="excel">Excel</option>

                                            </select>
                                        </div>
                                    </div>
                                </div> */}

                                {/* <div className='row'>
                                    <div className='form-group col-lg-8 first-level-top'>
                                        <div>
                                            <label className='level-title'><span className="mr-1">Report Type</span><span className="text-danger ">*</span></label>
                                            <select className="form-control" id="reportType" name="reportType"
                                                onChange={(e) => handleChange(e)}
                                            >
                                                <option value="">Select Report Type</option>
                                                <option value="bySalesOfficer">By SalesOfficer</option>
                                                <option value="byTerritory">By Territory</option>
                                                <option value="byDistributor">By Distributor</option>                                                                                                                                                                                                                                                                                                
                                               <option value="byArea">By Area</option>  
                                                <option value="byZone">By Zone</option>      
                                     
                                            </select>
                                        </div>
                                    </div>
                                </div> */}

                                <Button className="float-right mt-5" id="gotItBtn" variant="contained"
                                    color="primary"
                                    onClick={download}
                                >
                                    Download
                                </Button>

                                <div className="float-right">
                                    <Button className="mt-5 mr-5" id="gotItBtn" variant="contained" color="primary" onClick={preview}>
                                        Preview
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className='mt-5'>
                            <iframe src="" className='w-100' id="reportShowIframe" height="500px" />
                        </div>
                    </CardBody>
                </Card>
            </div>
        </>
    );
}