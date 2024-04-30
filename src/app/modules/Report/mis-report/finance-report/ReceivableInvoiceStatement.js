
import React, { useEffect, useState } from "react";
import ReportTabsHeader from "../../tabs/ReportsTabsHeader";
import { Card } from "react-bootstrap";
import Button from '@material-ui/core/Button';
import { CardBody } from "../../../../../_metronic/_partials/controls";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { TextField } from "@material-ui/core";
import { NavLink } from "react-router-dom";
import { shallowEqual, useSelector } from 'react-redux';
import { showError, showSuccess } from "../../../../pages/Alert";
import axios from "axios";
import MisReportBreadCrum from "../MisReportBreadCrum";
import moment from "moment";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_green.css";

const fields = {
    distributorId: "",
    invoiceNatureId: "",
    companyId:"",
    startDate:"",
    endDate:""
}
export default function ReceivableInvoiceStatement() {
    const companyId = useSelector((state) => state.auth.company, shallowEqual);
    const userId = useSelector((state) => state.auth.user.userId, shallowEqual);
    const [distributors, setDistributors] = useState([]);
    const [inputs, setInputs] = useState(fields);
    const [allFiscalYear, setAllFiscalYear] = useState([]);
    const [allInvoiceNature, setInvoiceNature] = useState([]);
    const [value, setValue] = React.useState(null);

    useEffect(() => {
        document.getElementById('pills-receivable-invoice-statement-cash-tab').classList.add('active')
    }, []);

    useEffect(() => {
        document.getElementById('reportShowIframe').style.display = "none";
        //getAllFiscalYear(companyId);
        //getAllDistributorList();
        getAllInvoiceNature();
    }, [companyId])

    const getAllInvoiceNature = () => {
        const URL = `${process.env.REACT_APP_API_URL}/api/invoice-nature`;
        axios.get(URL).then(response => {
            setInvoiceNature(response.data.data);
        });
    }

    // const getAllFiscalYear = (companyId) => {
    //     const URL = `${process.env.REACT_APP_API_URL}/api/accounting-year/companyWise/${companyId}`;
    //     axios.get(URL).then(response => {
    //         setAllFiscalYear(response.data.data);
    //     });
    // }

    const getAllDistributorList = (event) => {
        let queryString = "?";
        queryString += "companyId="+companyId ;
        queryString += event.target.value? "&searchString="+event.target.value:"&searchString="+''
        //let searchString = event.target.value;
        const URL = `${process.env.REACT_APP_API_URL}/api/distributor/get-distributor-list-company`+queryString;
        axios.get(URL).then(response => {
            setDistributors(response.data.data);
        });
    }

    // const handleFiscalYearChange = (e) =>{
    //     if (e.target.value !== null || e.target.value !== "") {
    //         setInputs({ ...inputs, accountingYearId: parseInt(e.target.value) });
    //     }
    // }
  
    const handleChangeDistributor = (e, dis) => {
        console.log(dis)
        if (dis.distributorId !== null || dis.distributorId !== "") {
            setInputs({ ...inputs, distributorId: parseInt(dis.distributorId)});
        }
    }
    const handleInvoiceNatureIdChange = (e) => {
        if (e.target.value !== null || e.target.value !== "") {
            setInputs({ ...inputs, invoiceNatureId: parseInt(e.target.value)});
        }
    }
    const validate = () => {
        if (!inputs.invoiceNatureId) {
            showError('Invoice Nature is required.');
            return false;
        } else if (!inputs.startDate) {
            showError("Start date  is required");
            return false;
        } else if (!inputs.endDate) {
            showError("End date is required");
            return false;
        } else if (inputs.endDate < inputs.startDate) {
            showError("End Date should be greater than Start Date");
            return false;
        }
        return true;
    }

    const download = () =>{
        if(!validate()){
            return false;
        }
        let queryString = '?';
        queryString += 'companyId=' + companyId;
        queryString += inputs.invoiceNatureId ? '&invoiceNatureId=' + inputs.invoiceNatureId : '';
        queryString += inputs.distributorId ? '&distributorId=' + inputs.distributorId : '';
        queryString += '&startDate=' + inputs.startDate;
        queryString += '&endDate=' + inputs.endDate;
        queryString += '&reportFormat=' + "excel";
        const URL = `${process.env.REACT_APP_API_URL}/api/reports/receivable-invoice-statement`+queryString;
        axios.get(URL, {responseType: 'blob'}).then(response => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', "ReceivableInvoiceStatement.xlsx");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        }).catch(err => {
            showError();
        });
        
    }
    const preview = () =>{
        if(!validate()){
            return false;
        }
        let queryString = '?';
        queryString += 'companyId=' + companyId;
        queryString += inputs.invoiceNatureId ? '&invoiceNatureId=' + inputs.invoiceNatureId : '';
        queryString += inputs.distributorId ? '&distributorId=' + inputs.distributorId : '';
        queryString += '&startDate=' + inputs.startDate;
        queryString += '&endDate=' + inputs.endDate;
        queryString += '&reportFormat=' + "pdf";
        const data = `${process.env.REACT_APP_API_URL}/api/reports/receivable-invoice-statement`+queryString;
        axios.get(data, {responseType: 'blob'}).then(response => {
            const file = new Blob([response.data], { type: "application/pdf" });
            const fileURL = URL.createObjectURL(file);
            const iframe = document.querySelector("iframe");
            if (iframe?.src) iframe.src = fileURL;
            document.getElementById('reportShowIframe').style.display = "inline-block";
        }).catch(err => {
            showError();
        });
        
    }
    const handlePaste = (e) => {
        e.preventDefault()
        return false;
    }

    const getCompanySelect = (row) => {//getCompanySelect is passed in DistributorHeader using props.getSearchInputs
      //  setSearchParams({ ...searchParams, companyId: row.companyId });
      //  getLocationTreeList({ userLoginId: userId, companyId: row.companyId });
      //getAllFiscalYear(companyId);
    }
    return (
        <>
            <div>
            <MisReportBreadCrum menuTitle="Finance Analysis Report"/>
            </div>
            <div>
                <ReportTabsHeader />
            </div>
            <div>
            <Card>
                <CardBody>
                    <div className="row">
                        <div className="col-lg-12">
                            <span className="create-field-title">Report</span>

                            {/* <div className='mt-5 row'>
                                <div className='col-xl-6'>
                                    <div>
                                    <label className='level-title'><span className="mr-1">Fiscal Year</span><span className="text-danger ">*</span></label>
                                        <select className="form-control" id="fiscalYearId"  name="fiscalYearId" onChange={(e)=>handleFiscalYearChange(e)}>
                                            <option value="">Select Fiscal Year</option>
                                            {
                                                allFiscalYear.map((fiscalYear)=>(
                                                <option key={fiscalYear.id} value={fiscalYear.id}>{fiscalYear.fiscalYearName}</option> 
                                                ))
                                            }   
                                        </select>
                                    </div>
                                </div>
                            </div> */}

                            <div className='mt-5 row'>
                                <div className='col-xl-6'>
                                    <div>
                                    <label className='level-title'><span className="mr-1">Invoice Nature</span><span className="text-danger ">*</span></label>
                                        <select className="form-control" id="invoiceNatureId"  name="invoiceNatureId" 
                                            onChange={(e)=>handleInvoiceNatureIdChange(e)}>
                                            <option value="">Select Invoice Nature</option>
                                            {
                                                allInvoiceNature.map((invoiceNature)=>(
                                                <option key={invoiceNature.id} value={invoiceNature.id}>
                                                    {invoiceNature.name}
                                                </option> 
                                                ))
                                            }   
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className='mt-5 row'>
                                <div className='col-xl-6'>
                                <label className='level-title'><span className="mr-1">Distributor</span></label>
                                <Autocomplete
                                    id="distributorId"
                                    name="distributorId"
                                    options={distributors}
                                    onKeyDown={getAllDistributorList}
                                    value={value}
                                    getOptionLabel={(option) => option.distributorName}
                                    onChange={(event, newValue) => {
                                        setValue(newValue)
                                        if(newValue) {
                                            handleChangeDistributor(event, newValue)
                                       }
                                        
                                    }}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Select Distributor" />
                                    )}
                                />
                                </div>
                            </div>

                            <div className='row'>
                                    <div className='form-group col-lg-6 first-level-top'>
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
                                    <div className='form-group col-lg-6 first-level-top'>
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

                            <Button className="float-right mt-5" id="gotItBtn" variant="contained" 
                                color="primary"  onClick={download}>
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
                        <iframe src="" className='w-100' id="reportShowIframe" height="500px"/>
                    </div>
                </CardBody>
            </Card>
            </div>
        </>);
}