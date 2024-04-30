import React, {useEffect, useState} from "react";
import PaymentAdjustmentBreadCrum from '../../../common/PaymentAdjustmentBreadCrum';
import PaymentAdjustmentHeader from "../../../common/PaymentAdjustmentHeader";
import CreditDebitNoteTabs from "../../../common/CreditDebitNoteTabs";
import SVG from "react-inlinesvg";
import {toAbsoluteUrl} from "../../../../../../../_metronic/_helpers";
import {Card, CardBody} from "../../../../../../../_metronic/_partials/controls";
import axios from 'axios';
import {showError} from '../../../../../../pages/Alert';
import {shallowEqual, useSelector} from "react-redux";
import {ApprovalList} from "./table/ApprovalList";
import * as XLSX from "xlsx";


export default function ApprovalPage() {
    let [singleAll, setSingleAll] = useState([]);
    let [noteTypeList, setNoteTypeList] = useState([]);
    let [timelineList, setTimelineList] = useState([]);
    let [approvalStatusList, setApprovalStatusList] = useState([]);
    let [locationList, setLocationList] = useState([]);
    let [approvalNoteList, setApprovalNoteList] = useState([]);
    let [totalApprovalNo, setTotalApprovalNo] = useState(0);
    let [searchedApprovalNoteList, setSearchedApprovalNoteList] = useState([]);
    let [searchingApprovalList, setSearchingApprovalList] = useState([]);
    let [searchInputs, setSearchInputs] = useState({});
    const selectedCompany = useSelector((state) => state.auth.company, shallowEqual);
    const [totalInfo, setTotalInfo] = useState({totalDebit: 0, totalCredit: 0});
    const [sessionData, setSessionData] = useState({userLoginId: 1, companyId: selectedCompany, accountingYearId: 1});

    useEffect(() => {
        document.getElementById('pills-payment-adjustment-credit-debit-note-tab').classList.add('active');
        document.getElementById('pills-payment-adjustment-credit-debit-note-approval-tab').classList.add('active');
    }, []);

    useEffect(() => {
        getNoteListByParams({companyId: selectedCompany});
        setSearchInputs({
            companyId: selectedCompany,
            locationId: '',
            noteType: '',
            status: '',
            accountingYearId: ''
        });
    }, [selectedCompany]);

    useEffect(() => {
        if (searchInputs.companyId !== undefined) {
            getApprovalNoteListByParams(searchInputs);
        }
    }, [searchInputs]);

    const getApprovalNoteListByParams = (params) => {
        console.log(params)
        let queryParams = 'companyId=' + params.companyId;
        queryParams += '&locationId=' + params.locationId;
        queryParams += '&noteType=' + params.noteType;
        queryParams += '&status=' + params.status;
        queryParams += '&accountingYearId=' + params.accountingYearId;
        const URL = `${process.env.REACT_APP_API_URL}/api/credit-debit-note/get-all-with-distributor-balance?` + queryParams;
        axios.get(URL).then(response => {
            console.log(response.data.data)
            let notes = response.data.data;
            let creditAmount = 0;
            let debitAmount = 0;
            let totalApproval = 0;
            notes.map(n => {
                totalApproval++;
                n.note_type === 'DEBIT' ? debitAmount += n.amount : creditAmount += n.amount;
            });
            setApprovalNoteList(notes);
            setSearchedApprovalNoteList(notes);
            setSearchingApprovalList(notes)
            setTotalInfo({totalDebit: debitAmount, totalCredit: creditAmount});
            setTotalApprovalNo(totalApproval);
        }).catch(err => {

        });
    }

    const getNoteListByParams = (params) => {
        let queryParams = 'companyId=' + params.companyId;
        const URL = `${process.env.REACT_APP_API_URL}/api/credit-debit-note/get-approval-page-all-filter-list?` + queryParams;
        axios.get(URL).then(response => {
            let dataMap = response.data.data;
            setNoteTypeList(dataMap.noteTypeList);
            setTimelineList(dataMap.accountingYearList);
            setLocationList(dataMap.locationList);
            setApprovalStatusList(dataMap.approvalStatusList.slice(1, dataMap.approvalStatusList.length)); // remove first element "Draft"
        }).catch(err => {

        });
    }

    const handleSearchInputsChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;
        setSearchInputs(values => ({...values, [name]: value}));
    }

    const handleSearchTextChange = (event) => {
        let value = event.target.value
        getSearchListFromNoteList(value);
    }

    const getSearchListFromNoteList = (searchText) => {
        let searchTextValue = searchText.toLowerCase();
        let tp = [];
        let creditAmount = 0;
        let debitAmount = 0;
        for (let i = 0; i < searchedApprovalNoteList.length; i++) {
            let distributorName = searchedApprovalNoteList[i].distributor_name.toLowerCase();
            let noteNo = searchedApprovalNoteList[i].note_no.toLowerCase();
            let entryBy = searchedApprovalNoteList[i].entry_by.toLowerCase();
            if (distributorName.includes(searchTextValue) || 
                noteNo.includes(searchTextValue) || 
                entryBy.includes(searchTextValue)) {
                searchedApprovalNoteList[i].note_type === 'DEBIT' ? debitAmount += searchingApprovalList[i].amount : creditAmount += searchingApprovalList[i].amount;
                tp.push(searchedApprovalNoteList[i]);
            }
        }
        setTotalInfo({totalDebit: debitAmount, totalCredit: creditAmount});
        setApprovalNoteList(tp);
    }

    const handleExport = () => {
        const data = [...singleAll];
        if (data.length === 0) {
            showError("No row is selected for export data");
            return;
        }
        let exportData = [];
        data.map(row => {
            let obj = {};
            obj.note_no = row.note_no;
            obj.approval_status = row.approval_status;
            obj.approval_date = row.approval_date;
            obj.distributor_name = row.distributor_name;
            obj.ledger_balance = row.ledger_balance;
            obj.entry_by = row.entry_by;
            obj.entry_by_designation = row.entry_by_designation;
            obj.company_name = row.company_name;
            obj.amount = row.amount;
            obj.note_type = row.note_type;
            exportData.push(obj);
            setSingleAll([]);
        })
        const workbook = XLSX.utils.book_new();
        const Heading = [
            ["NOTE NO", "STATUS", "APPROVAL DATE", "DISTRIBUTOR NAME", "BALANCE", "ENTRY BY",
                "ENTRY BY DESIGNATION", "COMPANY", "AMOUNT", "NOTE TYPE"]
        ];
        const worksheet = XLSX.utils.json_to_sheet(exportData, {origin: 'A2', skipHeader: true});

        // creating sheet and adding data from 2nd row of column A.
        // Leaving first row to add Heading
        XLSX.utils.sheet_add_aoa(worksheet, Heading, {origin: 'A1'});
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        for (let i = 0; i < Heading.length; i++) {
            worksheet[letters.charAt(i).concat('1')].s = {
                font: {
                    name: 'arial',
                    sz: 11,
                    bold: true,
                    color: "#F2F2F2"
                },
            }
        }
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, "debit credit note approval list.xlsx");
    }

    return (
        <>
            <div>
                {/* BREAD CRUM ROW */}
                <PaymentAdjustmentBreadCrum/>
                {/* HEADER ROW */}
                <PaymentAdjustmentHeader/>
            </div>
            <div>
                <CreditDebitNoteTabs totalApprovalNo={totalApprovalNo}/>
            </div>

            <div>
                <Card>
                    <CardBody>
                        {/* SEARCHING AND FILTERING ROW */}
                        <div className="row">
                            <div className="col-xl-3">
                                <div style={{position: "absolute", padding: "7px", marginTop: "3px"}}>
                                    <img src={toAbsoluteUrl("/images/search.png")} width="20px" height="20px"/>
                                </div>
                                <form className="form form-label-right">
                                    <input type="text" className='form-control' name="searchText"
                                           placeholder="Search Here" style={{paddingLeft: "28px"}}
                                           //value={searchText || ""} 
                                           onChange={handleSearchTextChange}>

                                    </input>
                                </form>
                            </div>
                            <div className="col-xl-9 mt-1 d-flex flex-wrap justify-content-end">
                                <div className="row">
                                    {/* NOTE TYPE ROW */}
                                    <div className="mr-3">
                                        <div className="row">
                                            <div className="col-6 mt-3">
                                                <label className="dark-gray-color">Note
                                                    Type</label>
                                            </div>
                                            <div className="col-6">
                                                <select className="form-control border-0" name="noteType"
                                                        value={searchInputs.noteType || ""}
                                                        onChange={handleSearchInputsChange}>
                                                    <option value="">All</option>
                                                    {noteTypeList.map((c) => (
                                                        <option key={c.code} value={c.code}>{c.name}</option>))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* STATUS ROW */}
                                    <div className="mr-3">
                                        <div className="row">
                                            <div className="col-4 mt-3">
                                                <label className="dark-gray-color">Status</label>
                                            </div>
                                            <div className="col-8">
                                                <select className="form-control border-0" name="status"
                                                        value={searchInputs.status || ""}
                                                        onChange={handleSearchInputsChange}>
                                                    <option value="">All</option>
                                                    {approvalStatusList.map((c) => (
                                                        <option key={c.code} value={c.code}>{c.name}</option>))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* LOCATION ROW */}
                                    <div className="mr-3">
                                        <div className="row">
                                            <div className="col-4 mt-3">
                                                <label className="dark-gray-color">Location</label>
                                            </div>
                                            <div className="col-8">
                                                <select className="form-control border-0" name="locationId"
                                                        value={searchInputs.locationId || ""}
                                                        onChange={handleSearchInputsChange}>
                                                    <option value="">Select Location</option>
                                                    {locationList.map((c) => (
                                                        <option key={c.id} value={c.id}>{c.name}</option>))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* TIMELINE ROW */}
                                    <div className="mr-3">
                                        <div className="row">
                                            <div className="col-4 mt-3">
                                                <label className="dark-gray-color">Timeline</label>
                                            </div>
                                            <div className="col-8">
                                                <select className="form-control border-0" name="accountingYearId"
                                                        value={searchInputs.accountingYearId || ""}
                                                        onChange={handleSearchInputsChange}>
                                                    <option value="">Select Fiscal Year</option>
                                                    {timelineList.map((c) => (
                                                        <option key={c.id} value={c.id}>{c.fiscal_year_name}</option>))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* FILTER ROW */}
                            <div>
                                <button className="btn filter-btn float-right">
                                    <i className="bi bi-funnel" style={{fontSize: "13px"}}></i>&nbsp;Filter
                                </button>
                            </div>
                                </div>
                            </div>
                        </div>
                        {/* ALL SUMMARY ROW */}
                        <div className="row">
                            {/* LOCATION ROW */}
                            <div className='col-xl-3 sales-data-chip' style={{borderRadius: "5px 0px 0px 5px"}}>
                                {/*<div className="d-flex">*/}
                                {/*    <div className="dark-gray-color">*/}
                                {/*        <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/location.svg")}*/}
                                {/*             width="30px" height="30px"/>*/}
                                {/*    </div>*/}
                                {/*    <div className="ml-2">*/}
                                {/*        <span>*/}
                                {/*            <span className="dark-gray-color"*/}
                                {/*                  style={{fontWeight: "500"}}>Location</span>*/}
                                {/*            <p><strong>All</strong></p>*/}
                                {/*        </span>*/}
                                {/*    </div>*/}
                                {/*</div>*/}
                            </div>

                            {/* CREDIT NOTE AMOUNT */}
                            <div className='col-xl-3 sales-data-chip'>
                                <div className="d-flex">
                                    <div className="dark-gray-color">
                                        <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/gray-add.svg")}
                                             width="25px" height="25px"/>
                                    </div>
                                    <div className="ml-2">
                                        <span>
                                            <span className="dark-gray-color"
                                                  style={{fontWeight: "500"}}>Credit Note Amount</span>
                                            <p><strong>{(totalInfo.totalCredit).toFixed(2)}</strong></p>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* DEBIT NOTE AMOUNT */}
                            <div className='col-xl-3 sales-data-chip' style={{borderRadius: "0px 5px 5px 0px"}}>
                                <div className="d-flex">
                                    <div className="dark-gray-color">
                                        <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/gray-minus.svg")}
                                             width="25px" height="25px"/>
                                    </div>
                                    <div className="ml-2">
                                        <span>
                                            <span className="dark-gray-color"
                                                  style={{fontWeight: "500"}}>Debit Note Amount</span>
                                            <p><strong>{(totalInfo.totalDebit).toFixed(2)}</strong></p>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className='col-xl-3 sales-data-chip' style={{background: "#F9F9F9"}}>
                                <button className="btn float-right export-btn" onClick={handleExport}>
                                    <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/download.svg")} width="15px"
                                         height="15px"/>
                                </button>
                            </div>
                        </div>
                        {/* TABLE ROW */}
                        <div className='mt-5'>
                            <ApprovalList setSingleAll={setSingleAll} singleAll={singleAll}
                                          approvalNoteList={approvalNoteList}/>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </>
    );
}