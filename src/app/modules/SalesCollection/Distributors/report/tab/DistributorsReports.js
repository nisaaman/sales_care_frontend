
import React, { useEffect, useMemo, useState } from "react";
import { Card } from "react-bootstrap";
import Button from '@material-ui/core/Button';
import { CardBody } from "../../../../../../_metronic/_partials/controls";
// import SalesCollectionConfigureBreadCrum from "../../common/DistributorsHeader";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { TextField } from "@material-ui/core";
import { NavLink } from "react-router-dom";
import { showError, showSuccess } from "../../../../../pages/Alert";
import { shallowEqual, useSelector } from 'react-redux';
import axios from "axios";
import DistributorsBreadCrum from "../../common/DistributorsBreadCrum";
import DistributorsHeader from "../../common/DistributorsHeader";
import { allowOnlyNumericWithPeriod, amountFormatterWithoutCurrency } from '../../../../Util';
import { now } from "lodash";
import moment from "moment";
import Flatpickr from "react-flatpickr";
const fields = {
    distributorId: "",
    semesterId: "",
    creditLimit: "",
    companyId:""
}

export default function DistributorsReports() {
    const companyId = useSelector((state) => state.auth.company, shallowEqual);
    const userId = useSelector((state) => state.auth.user.userId, shallowEqual);
    const [distributorId, setDistributorId] = useState();
    const [distributors, setDistributors] = useState([]);
    const [inputs, setInputs] = useState(fields);
    const [allFiscalYear, setAllFiscalYear] = useState([]);
    const [reportData, setReportData] = useState([]);
    const [debitAmout, setDebitAmount] = useState();
    const [credittAmout, setCreditAmount] = useState();
    const [showReport, setShowReport] = useState(false);
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();

    useEffect(() => {
        document.getElementById('pills-distributors-reports-tab').classList.add('active');
        getAllFiscalYear(companyId);
        getAllDistributorList();
    }, [companyId, distributorId])

    const getAllFiscalYear = (companyId) => {
        const URL = `${process.env.REACT_APP_API_URL}/api/accounting-year/companyWise/${companyId}`;
        if (companyId) {
        axios.get(URL).then(response => {
            setAllFiscalYear(response.data.data);
        });}
    }

    const getAllDistributorList = () => {
        const URL = `${process.env.REACT_APP_API_URL}/api/distributor/list/${userId}/${companyId}/`;
        axios.get(URL).then(response => {
            //console.log(response.data.data)
            setDistributors(response.data.data);
        });
    }

    const handleFiscalYearChange = (e) =>{
        if (e.target.value !== null || e.target.value !== "") {
            setInputs({ ...inputs, accountingYearId: parseInt(e.target.value) });
        }
    }
  
    const handleChangeDistributor = (distributorId) => {
        setDistributorId(distributorId);
        if (distributorId !== null || distributorId !== "") {
            setInputs({ ...inputs, distributorId: distributorId });
        }
    }


    const validate = () => {
        if (!startDate) {
            showError('Start Date is required.');
            return false;
        }

        if (!endDate) {
            showError('End Date is required.');
            return false;
        }

        if (!distributorId) {
            showError('Distributor is required.');
            return false;
        }
        return true;
    }
    const saveLimit = () =>{
        if(!validate()){
            return false;
        }
        let queryString = '?';
        queryString += 'distributorId=' + inputs.distributorId;
        queryString += '&companyId=' + companyId;
        queryString += "&startDateStr="+startDate;
        queryString +="&endDateStr="+endDate;
        const URL = `${process.env.REACT_APP_API_URL}/api/reports/distributor-ledger`+queryString;
        axios.get(URL, {responseType: 'blob'}).then(response => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', "distributorLedger.pdf");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        }).catch(err => {
            showError();
        });
        
    }

    const getReportData = () => {

        if(!validate()){
            return false;
        }
        let queryString = "?";
        queryString +="distributorId="+distributorId;
        queryString +="&startDateStr="+startDate;
        queryString +="&endDateStr="+endDate;
        queryString +="&companyId="+companyId;

        const URL = `${process.env.REACT_APP_API_URL}/api/reports/distributor-ledger-view`+queryString;
        axios.get(URL).then((response) => {
            setReportData(response.data.data);
            setShowReport(true);
        }).catch();
    }
    const handlePaste = (e) => {
        e.preventDefault()
        return false;
    }

    const getCompanySelect = (row) => {//getCompanySelect is passed in DistributorHeader using props.getSearchInputs
      //  setSearchParams({ ...searchParams, companyId: row.companyId });
      //  getLocationTreeList({ userLoginId: userId, companyId: row.companyId });
      getAllFiscalYear(companyId);
    }

    return (
        <>
            <div>
                <DistributorsBreadCrum />
                <DistributorsHeader getSearchInputs={getCompanySelect} />
            </div>
            <div>
            <Card>
                <CardBody>
                    <div className="row">
                        <div className="col-lg-12">
                            <span className="create-field-title">Report</span>

                            {/* <NavLink className="float-right" to="/salescollection/configure/credit-limit-setup/credit-limit-setup">
                                <span className="mt-5"><i className="bi bi-chevron-left"></i></span>Back
                            </NavLink> */}

                            <div className='mt-5 row'>
                                <div className='col-xl-6'>
                                    {/* <div>
                                    <label className='level-title'><span className="mr-1">Fiscal Year</span><span className="text-danger ">*</span></label>
                                        <select className="form-control" id="fiscalYearId"  name="fiscalYearId" onChange={(e)=>handleFiscalYearChange(e)}>
                                            <option value="">Please Select Fiscal Year</option>
                                            {
                                                allFiscalYear.map((fiscalYear)=>(
                                                <option key={fiscalYear.id} value={fiscalYear.id}>{fiscalYear.fiscalYearName}</option> 
                                                ))
                                            }   
                                        </select>
                                    </div> */}
                                    <div className="d-flex flex-wrap">
                                                <div>
                                                    <div className="row">
                                                        <div className="col-5 mt-3" style={{ color: "rgb(130, 130, 130)" }}>
                                                            <label>Start Date<i style={{ color: "red" }}>*</i></label>
                                                        </div>
                                                        <div className="col-7">
                                                            <Flatpickr className="form-control date border-0" id="startDate" placeholder="dd-MM-yyyy"
                                                                options={{ dateFormat: "d-M-Y" }} required
                                                                onChange={(value) => {
                                                                    setStartDate(
                                                                        moment(new Date(value)).format("YYYY-MM-DD")
                                                                    )
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div>
                                                    <div className="row">
                                                        <div className="col-5 mt-3" style={{ color: "rgb(130, 130, 130)" }}>
                                                            <label>End Date<i style={{ color: "red" }}>*</i></label>
                                                        </div>
                                                        <div className="col-7">
                                                                <Flatpickr className="form-control date border-0" id="startDate" placeholder="dd-MM-yyyy"
                                                                    options={{ dateFormat: "d-M-Y" }} required 
                                                                    onChange={(value) => {
                                                                        setEndDate(
                                                                            moment(new Date(value)).format("YYYY-MM-DD")
                                                                        )
                                                                    }}
                                                                />
                                                         </div>
                                                    </div>
                                                </div>
                                    </div>
                                </div>


                            </div>

                            <div className='mt-5 row'>
                                <div className='col-xl-6'>
                                    <Autocomplete
                                        id="distributorId"
                                        name="distributorId"
                                        options={distributors}
                                        onKeyDown={getAllDistributorList}
                                        getOptionLabel={(option) => option.distributorName}
                                        onChange={(event, newValue) => {
                                            handleChangeDistributor(newValue.distributorId)
                                        }}
                                        renderInput={(params) => (
                                            <TextField {...params} label="Select Distributor*" />
                                        )}
                                    />
                                </div>

                                {/* <div className='col-xl-6'>
                                    <label className='level-title'><span className="mr-1">Credit Limit Amount</span><span className="text-danger ">*</span></label>
                                    <input maxLength={15} onPaste={(e)=>handlePaste(e)}  onChange={(e)=>handleChangeCreditLimit(e)} onKeyPress={(e) => allowOnlyNumericWithPeriod(e)} id="creditLimit" name="creditLimit" type="text" className='form-control' />
                                </div> */}
                            </div>

                            <div className="float-right">
                            <Button className="mt-5 mr-5" id="gotItBtn" variant="contained" color="primary"  onClick={getReportData}>
                                View
                            </Button>
                            <Button className="mt-5" id="gotItBtn" variant="contained" color="primary"  onClick={saveLimit}>
                                Generate
                            </Button>
                            </div>
                        </div>
                    </div>
                </CardBody>
            </Card>
            <Card>
                <CardBody>
                  {showReport && <div>
                     <div className="report-table" >
                        <table class="center"  style={{width:"100%"}}>
                        <caption style={{captionSide: "top", width: "100%", fontSize: "x-large", fontWeight: "bold", color: "black"}}>Distributor Ledger</caption>
                            <tr>
                                <th style={{fontWeight:"bold", textAlign:"center"}}>Sl. No.</th>
                                <th style={{fontWeight:"bold", textAlign:"center"}}>Date</th>
                                <th style={{fontWeight:"bold", textAlign:"center"}}>Description</th>
                                <th style={{fontWeight:"bold", textAlign:"center", width:"15%"}}>Debit</th>
                                <th style={{fontWeight:"bold", textAlign:"center", width:"15%"}}>Credit</th> 
                                <th style={{fontWeight:"bold", textAlign:"center", width:"15%"}}>Balance</th>
                            </tr>
                            {reportData.map(( data, index ) => {
                                    return (
                                        <tr key={index}>
                                            <td style={{textAlign:"center", paddingRight:"10px"}}>{++index}</td>
                                            <td style={{textAlign:"center", paddingRight:"10px"}}>{data.date}</td>
                                            <td style={{paddingRight:"10px"}}>{data.description}</td>
                                            {/* <td style={{textAlign: "right", width:"15%", paddingRight:"10px"}}>{amountFormatterWithoutCurrency(data.debit)}</td> */}
                                            <td style={{textAlign: "right", width:"15%", paddingRight:"10px"}}>{Math.round(data.debit).toLocaleString()}</td>
                                            {/* <td style={{textAlign: "right", width:"15%", paddingRight:"10px"}}>{amountFormatterWithoutCurrency(data.credit)}</td> */}
                                            <td style={{textAlign: "right", width:"15%", paddingRight:"10px"}}>{Math.round(data.credit).toLocaleString()}</td>
                                            {/* <td style={{textAlign: "right", width:"15%"}}>{amountFormatterWithoutCurrency(data.balance)}</td> */}
                                            <td style={{textAlign: "right", width:"15%"}}>{Math.round(data.balance).toLocaleString()}</td>
                                        </tr>
                                    );
                                })
                            }
                            <tr>
                                <td style={{textAlign:"center", fontWeight:"bold", paddingRight:"10px"}} colSpan={3}>Total</td>
                                {/*NGLSC-2209,NGLSC-2210 <td style={{fontWeight:"bold", textAlign: "right", paddingRight:"10px"}}>{amountFormatterWithoutCurrency(reportData.reduce((total, data) =>
                                        total += data.debit,0
                                    ))}
                                </td>
                                <td style={{fontWeight:"bold", textAlign: "right", paddingRight:"10px"}}>
                                    {amountFormatterWithoutCurrency(reportData.reduce((total, data) =>
                                        total += data.credit,0
                                    ))}
                                </td>
                                <td style={{fontWeight:"bold", textAlign: "right"}}>{amountFormatterWithoutCurrency(reportData[reportData.length-1].balance)}</td> */}

                                <td style={{fontWeight:"bold", textAlign: "right", paddingRight:"10px"}}>{Math.round(reportData.reduce((total, data) =>
                                        total += data.debit,0
                                    )).toLocaleString()}
                                </td>
                                <td style={{fontWeight:"bold", textAlign: "right", paddingRight:"10px"}}>
                                    {Math.round(reportData.reduce((total, data) =>
                                        total += data.credit,0
                                    )).toLocaleString()}
                                </td>
                                <td style={{fontWeight:"bold", textAlign: "right"}}>{Math.round(reportData[reportData.length-1].balance).toLocaleString()}</td>
                            </tr>
                        </table>
                        </div>
                    </div>}
                </CardBody>
            </Card>
            </div>
        </>);
}