import React, { useEffect, useState } from "react";
import { Card, CardBody } from "../../../../../../../_metronic/_partials/controls";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import IOSSwitch from '../../../../../../pages/IOSSwitch';
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../../../_metronic/_helpers";
import BudgetSetupBreadCrum from "../../common/BudgetSetupBreadCrum";
import BudgetSetupHeader from "../../common/BudgetSetupHeader";
import axios,{AxiosRequestConfig} from "axios";
import { shallowEqual, useSelector } from "react-redux";
import { showError, showSuccess } from "../../../../../../pages/Alert";

export default function DistributorWiseList() {
    //const [status, setStatus] = useState("Not Set Yet");
    const [recentAccYearList, setRecentAccYearList] = useState([]);

    const companyId = useSelector((state) => state.auth.company, shallowEqual);

    useEffect(() => {
        document.getElementById('pills-configure-budget-distributor-wise-tab').classList.add('active')
    }, []);

    useEffect(() => {
        getRecentAccountingYearList(companyId);
    },[companyId]);

    const notYetSalesBudgetFileUpload = (event,index,accountingYearId) =>{
        const fileName = event.target.files[0].name;
        const setId = document.getElementById('salesBudgetFileName-'+index);
        setId.innerHTML = fileName;

        var input = document.getElementById('notYetSalesBudgetId'+index);
        if (input.files.length < 1)
            return false;
        else
            uploadSalesBudgetData(event,accountingYearId,index);    
    }

    const currentYearSalesBudgetFileUpload = (event,index, accountingYearId) =>{
        const fileName = event.target.files[0].name;
        const setId = document.getElementById('salesCurrentBudgetFileName-'+index);
        setId.innerHTML = fileName;
    
    
        var input = document.getElementById('currentYearSalesBudgetId'+index);
        if (input.files.length < 1)
            return false;
        else
            uploadSalesBudgetData(event,accountingYearId,index);  
    }

    const notYetPaymentCollectionBudgetFileUpload = (event,index, accountingYearId) =>{
        const fileName = event.target.files[0].name;
        const setId = document.getElementById('paymentCollectionBudgetFileName-'+index);
        setId.innerHTML = fileName;

        var input = document.getElementById('notYetCollectionBudgetId'+index);
        if (input.files.length < 1)
            return false;
        else
            uploadCollectionBudgetData(event,accountingYearId,index);  
    }

    const currentYearCollectionBudgetFileUpload = (event,index, accountingYearId) =>{
        const fileName = event.target.files[0].name;
        const setId = document.getElementById('collectionCurrentBudgetFileName-'+index);
        setId.innerHTML = fileName;
    
        var input = document.getElementById('currentYearCollectionBudgetId'+index);
        if (input.files.length < 1)
            return false;
       
        else
        uploadCollectionBudgetData(event,accountingYearId,index);  
    }

    const getRecentAccountingYearList = (companyId) => {
        const URL = `${process.env.REACT_APP_API_URL}/api/accounting-year/recent/${companyId}`;
        axios.get(URL).then((response) => {
            setRecentAccYearList(response.data.data);
        }).catch();
    }

    const downloadSalesBudgetDocument = (accountingYearId) => {
        const headers = {'Content-Type': 'blob'};
        
        let queryString = "?";
        queryString += "accountingYearId="+accountingYearId;
        queryString += "&companyId="+companyId;
        const API_URL = `${process.env.REACT_APP_API_URL}/api/sales-budget/template/download`+queryString;
        const config = {method: 'GET', responseType: 'blob'};
        axios.get(API_URL, config).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
           // const [, filename] = response.headerKey['content-disposition'].split('filename=');
            link.setAttribute('download',"Sales_Budget.xlsx");
            document.body.appendChild(link);
            link.click();
        }).catch();
    }

    const uploadSalesBudgetData = (event,accountingYearId,index) => {

        let formData = new FormData();

        let obj = new Object();
        obj.accountingYearId = accountingYearId;
        obj.companyId = companyId;
    
        formData.append("salesBudgetFile", event.target.files[0]);
        formData.append("salesBudgetDto", new Blob([JSON.stringify(obj)], { type: "application/json" }));
        console.log('form data', formData);
         const URL = `${process.env.REACT_APP_API_URL}/api/sales-budget`;
         axios.post(URL, formData, { headers: { "Content-Type": false } }).then(response => {
             if (response.data.success === true) {
                 showSuccess("Sales Budget Data Upload Successfully Done")
                 //document.getElementById("currentYearSalesBudgetId"+index).reset();
             } else {
                 showError(response.data.message);
             }
         }).catch(err => {
             showError(err.message);
         });
    }

    const downloadCollectionBudgetDocument = (accountingYearId) => {
        
        let queryString = "?";
        queryString += "accountingYearId="+accountingYearId;
        queryString += "&companyId="+companyId;
        const API_URL = `${process.env.REACT_APP_API_URL}/api/collection-budget/template/download`+queryString;
        const config = {method: 'GET', responseType: 'blob'};
        axios.get(API_URL, config).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download',"Collection_Budget.xlsx");
            document.body.appendChild(link);
            link.click();
        }).catch();
    }

    const uploadCollectionBudgetData = (event,accountingYearId,index) => {

        let formData = new FormData();

        let obj = new Object();
        obj.accountingYearId = accountingYearId;
        obj.companyId = companyId;
    
        formData.append("collectionBudgetFile", event.target.files[0]);
        formData.append("collectionBudgetDto", new Blob([JSON.stringify(obj)], { type: "application/json" }));
        
         const URL = `${process.env.REACT_APP_API_URL}/api/collection-budget`;
         axios.post(URL, formData, { headers: { "Content-Type": false } }).then(response => {
             if (response.data.success === true) {
                 showSuccess("Collection Budget Data Upload Successfully Done")
                 //document.getElementById("currentYearSalesBudgetId"+index).reset();
             } else {
                 showError(response.data.message);
             }
         }).catch(err => {
             showError(err.message);
         });
    }

    return (
        <>
            {/* BREADCRUM AND HEADER ROW */}
            <div>
                <BudgetSetupBreadCrum />
                <BudgetSetupHeader />
            </div>

            {/* NOT SET YET ROW */}
            {recentAccYearList.filter(acc => "not_started".localeCompare(acc.status) === 0).map((acc,index)=>(
                        <div className="row">
                            <div className="col-xl-2">
                                <Card>
                                    <CardBody>
                                        <div className="p-5">
                                            <span
                                                className="daysCount"
                                                style={{ color: "rgba(235, 87, 87, 0.7)" }}
                                            >
                                                {acc.status}
                                            </span><br />
                                            <span className="budget-fiscal-year-title mt-5">Fiscal Year {acc.fiscal_year_name}<br /></span>
                                        </div>
                                    </CardBody>
                                </Card>
                            </div>
                            <div className="col-xl-5">
                                <div>
                                    <Card>
                                        <CardBody>
                                            <div>
                                                <span className="daysCount mt-5">Sales Budget</span>
                                                <button
                                                    type="button"
                                                    className="btn budget-download-btn btn-hover-primary float-right"
                                                    data-toggle="tooltip" data-placement="bottom" title="Approval Path Config"
                                                    
                                                    onClick={() => downloadSalesBudgetDocument(acc.id)}
                                                >
                                                    <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/download.svg")} width="15px" height="15px" />
                                                    &nbsp;&nbsp;Download Format
                                                </button>
                                            </div>
                                            <div>
                                            <button className="btn-warning-test mt-3 sales-chip border-success text-success text-center" style={{width:"100%"}}>
                                                <span>
                                                <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/blue-up-arrow.svg")} width="15px" height="15px" />    
                                                &nbsp;
                                                <span id={"salesBudgetFileName-"+index}>Upload Sales Budget ({acc.fiscal_year_name} Year) File(Format Excel)</span>
                                                </span>
                                                <input type="file" accept=".xlsx" id={"notYetSalesBudgetId"+index} onChange={(event)=>notYetSalesBudgetFileUpload(event,index, acc.id)}></input>
                                            </button>
                                            </div>
                                        </CardBody>
                                    </Card>
                                </div>
                            </div>
                            <div className="col-xl-5">
                                <div>
                                    <Card>
                                        <CardBody>
                                        <div>
                                                <span className="daysCount mt-5">Payment Collection Budget</span>
                                                <button
                                                    type="button"
                                                    className="btn budget-download-btn btn-hover-primary float-right"
                                                    data-toggle="tooltip" data-placement="bottom" title="Approval Path Config"
                                                    onClick={() => downloadCollectionBudgetDocument(acc.id)}
                                                >
                                                    <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/download.svg")} width="15px" height="15px" />
                                                    &nbsp;&nbsp;Download Format
                                                </button>
                                            </div>
                                            <div>
                                            <button className="btn-warning-test mt-3 sales-chip border-success text-success text-center" style={{width:"100%"}}>
                                                <span>
                                                <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/blue-up-arrow.svg")} width="15px" height="15px" />    
                                                &nbsp;
                                                <span id={"paymentCollectionBudgetFileName-"+index}>Upload Collection Budget ({acc.fiscal_year_name} Year) File(Format Excel)</span>
                                                </span>
                                                <input type="file" accept=".xlsx" id={"notYetCollectionBudgetId"+index} onChange={(event)=>notYetPaymentCollectionBudgetFileUpload(event,index,acc.id)}></input>
                                            </button>
                                            </div>
                                        </CardBody>
                                    </Card>
                                </div>
                            </div>
                        </div>
                    ))
            }

            {/* ACTIVE ROW */}
            {recentAccYearList.filter(acc => "current".localeCompare(acc.status) === 0).map((acc,index)=>(
                     <div className="row">
                     <div className="col-xl-2">
                         <Card>
                             <CardBody>
                                 <div className="p-5">
                                     <span
                                         className="daysCount"
                                         style={{color: "#27AE60"}}
                                     >
                                        {acc.status} 
                                     </span><br />
                                     <span className="budget-fiscal-year-title mt-5">Fiscal Year {acc.fiscal_year_name} </span>
                                 </div>
                             </CardBody>
                         </Card>
                     </div>
                     <div className="col-xl-5">
                         <div>
                             <Card>
                                 <CardBody>
                                     <div>
                                         <span className="daysCount mt-5">Sales Budget</span>
                                         <button
                                             type="button"
                                             className="btn budget-download-btn btn-hover-primary float-right"
                                             data-toggle="tooltip" data-placement="bottom" title="Approval Path Config"
                                             onClick={() => downloadSalesBudgetDocument(acc.id, {companyId})}
                                         >
                                             <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/download.svg")} width="15px" height="15px" />
                                             &nbsp;&nbsp;Download Format
                                         </button>
                                     </div>
                                     <div className="mt-5">
                                     <button className="btn-warning-test mt-3 sales-chip border-success text-success text-center" style={{width:"100%"}}>
                                                <span>
                                                <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/blue-up-arrow.svg")} width="15px" height="15px" />    
                                                &nbsp;
                                                <span id={"salesCurrentBudgetFileName-"+index}>Upload Sales Budget ({acc.fiscal_year_name} Year) File(Format Excel)</span>
                                                </span>
                                                <input type="file" accept=".xlsx" id={"currentYearSalesBudgetId"+index} onChange={(event)=>currentYearSalesBudgetFileUpload(event,index, acc.id)}></input>
                                            </button>
                                     </div>
                                 </CardBody>
                             </Card>
                         </div>
                     </div>
                     <div className="col-xl-5">
                         <div>
                             <Card>
                                 <CardBody>
                                 <div>
                                         <span className="daysCount mt-5">Payment Collection Budget</span>
                                         <button
                                             type="button"
                                             className="btn budget-download-btn btn-hover-primary float-right"
                                             data-toggle="tooltip" data-placement="bottom" title="Approval Path Config"
                                             onClick={() => downloadCollectionBudgetDocument(acc.id, {companyId})}
                                         >
                                             <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/download.svg")} width="15px" height="15px" />
                                             &nbsp;&nbsp;Download Format
                                         </button>
                                     </div>
                                     <div>
                                            <button className="btn-warning-test mt-3 sales-chip border-success text-success text-center" style={{width:"100%"}}>
                                                <span>
                                                <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/blue-up-arrow.svg")} width="15px" height="15px" />    
                                                &nbsp;
                                                <span id={"collectionCurrentBudgetFileName-"+index}>Upload Collection Budget ({acc.fiscal_year_name} Year) File(Format Excel)</span>
                                                </span>
                                                <input type="file" accept=".xlsx" id={"currentYearCollectionBudgetId"+index} onChange={(event)=>currentYearCollectionBudgetFileUpload(event,index,acc.id)}></input>
                                            </button>
                                     </div>
                                 </CardBody>
                             </Card>
                         </div>
                     </div>
                 </div>
            ))}
           

            {/* EXPIRED ROW */}
            {/* {recentAccYearList.filter(acc => "expired".localeCompare(acc.status) === 0).map((acc,index)=>(
                <div className="row">
                <div className="col-xl-2">
                    <Card>
                        <CardBody>
                            <div className="pl-5">
                                <span
                                    className="daysCount"
                                    style={{color: "#BDBDBD"}}
                                >
                                   {acc.status}
                                </span><br />
                                <span className="budget-fiscal-year-title mt-5">Fiscal Year 2021-22 </span>
                            </div>
                        </CardBody>
                    </Card>
                </div>
                <div className="col-xl-5">
                    <div>
                        <Card>
                            <CardBody>
                                <div>
                                    <span className="dark-gray-color mt-5"><strong>Sales Budget</strong></span>
                                    <button
                                        type="button"
                                        className="btn budget-download-btn btn-hover-primary float-right"
                                        data-toggle="tooltip" data-placement="bottom" title="Approval Path Config"
                                    >
                                        <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/download.svg")} width="15px" height="15px" />
                                        &nbsp;&nbsp;Download Format
                                    </button>
                                </div>
                                <div className="mt-5 light-gray-bg dark-gray-color rounded p-3">
                                    <span className="display-inline-block">
                                    <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/gray-attach-file.svg")} width="15px" height="15px" />
                                    &nbsp;&nbsp;Sales Budget 2021-22 (98.30kb.)
                                    </span>
                                    <span className="float-right">
                                    <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/gray-close.svg")} width="15px" height="15px" />
                                    </span>
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                </div>
                <div className="col-xl-5">
                    <div>
                        <Card>
                            <CardBody>
                            <div>
                                    <span className="daysCount mt-5">Payment Collection Budget</span>
                                    <button
                                        type="button"
                                        className="btn budget-download-btn btn-hover-primary float-right"
                                        data-toggle="tooltip" data-placement="bottom" title="Approval Path Config"
                                    >
                                        <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/download.svg")} width="15px" height="15px" />
                                        &nbsp;&nbsp;Download Format
                                    </button>
                                </div>
                                <div className="mt-5 light-gray-bg dark-gray-color rounded p-3">
                                    <span className="display-inline-block">
                                    <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/gray-attach-file.svg")} width="15px" height="15px" />
                                    &nbsp;&nbsp; Collection Budget 2021-22 (112.30kb.)
                                    </span>
                                    <span className="float-right">
                                    <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/gray-close.svg")} width="15px" height="15px" />
                                    </span>
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                </div>
            </div>
            ))} */}
            

            {/* EXPIRED ROW */}
            {/*<div className="row">
                <div className="col-xl-2">
                    <Card>
                        <CardBody>
                            <div className="pl-5">
                                <span
                                    className="daysCount"
                                    style={{color: "#BDBDBD"}}
                                >
                                    Expired
                                </span><br />
                                <span className="budget-fiscal-year-title mt-5">Fiscal Year 2021-22 </span>
                            </div>
                        </CardBody>
                    </Card>
                </div>
                <div className="col-xl-5">
                    <div>
                        <Card>
                            <CardBody>
                                <div>
                                    <span className="dark-gray-color mt-5"><strong>Sales Budget</strong></span>
                                    <button
                                        type="button"
                                        className="btn budget-download-btn btn-hover-primary float-right"
                                        data-toggle="tooltip" data-placement="bottom" title="Approval Path Config"
                                    >
                                        <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/download.svg")} width="15px" height="15px" />
                                        &nbsp;&nbsp;Download Format
                                    </button>
                                </div>
                                <div className="mt-5 light-gray-bg dark-gray-color rounded p-3">
                                    <span className="display-inline-block">
                                    <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/gray-attach-file.svg")} width="15px" height="15px" />
                                    &nbsp;&nbsp;Sales Budget 2021-22 (98.30kb.)
                                    </span>
                                    <span className="float-right">
                                    <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/gray-close.svg")} width="15px" height="15px" />
                                    </span>
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                </div>
                <div className="col-xl-5">
                    <div>
                        <Card>
                            <CardBody>
                            <div>
                                    <span className="daysCount mt-5">Payment Collection Budget</span>
                                    <button
                                        type="button"
                                        className="btn budget-download-btn btn-hover-primary float-right"
                                        data-toggle="tooltip" data-placement="bottom" title="Approval Path Config"
                                    >
                                        <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/download.svg")} width="15px" height="15px" />
                                        &nbsp;&nbsp;Download Format
                                    </button>
                                </div>
                                <div className="mt-5 light-gray-bg dark-gray-color rounded p-3">
                                    <span className="display-inline-block">
                                    <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/gray-attach-file.svg")} width="15px" height="15px" />
                                    &nbsp;&nbsp; Collection Budget 2021-22 (112.30kb.)
                                    </span>
                                    <span className="float-right">
                                    <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/gray-close.svg")} width="15px" height="15px" />
                                    </span>
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                </div>
            </div>*/}

        </>
    )
}
