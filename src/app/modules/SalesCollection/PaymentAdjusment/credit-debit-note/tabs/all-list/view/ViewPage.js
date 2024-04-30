import React, {useEffect, useState} from "react";
import PaymentAdjustmentBreadCrum from '../../../../common/PaymentAdjustmentBreadCrum';
import SVG from "react-inlinesvg";
import {toAbsoluteUrl} from "../../../../../../../../_metronic/_helpers";
import {useHistory, useLocation} from 'react-router-dom';
import {Card} from "react-bootstrap";
import {CardBody} from "../../../../../../../../_metronic/_partials/controls";
import {useIntl} from "react-intl";
import DistributorLedgerList from "../table/DistributorLedgerList";
import axios from "axios";
import _ from "lodash";
import * as XLSX from "xlsx";
import {showError} from '../../../../../../../pages/Alert';
import { amountFormatterWithoutCurrency } from "../../../../../../Util";

export default function ViewPage() {
    let routeLocation = useLocation();
    let history = useHistory();
    let [singleAll, setSingleAll] = useState([]);
    const intl = useIntl();
    const [distributorInfo, setDistributorInfo] = useState({});
    const [locationHierarchyListLowToHigh, setLocationHierarchyListLowToHigh] = useState([]);
    const [timelineList, setTimelineList] = useState([]);
    const [noteList, setNoteList] = useState([]);
    const [searchInputs, setSearchInputs] = useState({});
    const [selectedTimeLine, setSelectedTimeLine] = useState({});
    const [totalInfo, setTotalInfo] = useState({totalTransaction: 0, totalBalance: 0});
    const [searchNoteList, setSearchNoteList] = useState([]);
    const [distributorLogo, setDistributorLogo] = useState("");
    const [distributorImg, setDistributorImg] = useState(toAbsoluteUrl("/images/copmanylogo.png"));

    useEffect(() => {
        setDistributorInfo(routeLocation.state.state);
        locationHierarchyListLowToHighList({
            companyId: routeLocation.state.state.selectedCompany,
            distributorId: routeLocation.state.state.distributor_id
        });
        getTimeLineListByCompany({companyId: routeLocation.state.state.selectedCompany});
        getDistributorLogo(routeLocation.state.state.distributor_id);
        console.log("noteList", noteList);
    }, []);

    useEffect(() => {
        if (_.isEmpty(selectedTimeLine)) {
            setNoteList([]);
        } else {
            getNoteListByParams({
                companyId: distributorInfo.selectedCompany,
                distributorId: distributorInfo.distributor_id,
                fromDate: selectedTimeLine.fiscal_year_start_date,
                toDate: selectedTimeLine.fiscal_year_end_date
            });
        }

    }, [selectedTimeLine]);

    const locationHierarchyListLowToHighList = (params) => {
        const URL = `${process.env.REACT_APP_API_URL}/api/location/get-down-to-up-location-hierarchy/${params.companyId}/${params.distributorId}`;
        axios.get(URL).then(response => {
            const locationList = response.data.data.reverse();
            setLocationHierarchyListLowToHigh(locationList);
        }).catch(err => {

        });
    }

    const getDistributorLogo = (distributorId) => {
        const URL = `${process.env.REACT_APP_API_URL}/api/distributor/logo/${distributorId}`;
        axios.get(URL).then(response => {
            const logo = response.data;
            setDistributorLogo(logo);
        }).catch(err => {

        });
    }

    const getTimeLineListByCompany = (params) => {
        const URL = `${process.env.REACT_APP_API_URL}/api/accounting-year/all/${params.companyId}`;
        axios.get(URL).then(response => {
            setTimelineList(response.data.data);
        }).catch(err => {

        });
    }

    const getNoteListByParams = (params) => {
        let queryParams = 'companyId=' + params.companyId;
        queryParams += '&distributorId=' + params.distributorId;
        queryParams += '&fromDate=' + params.fromDate;
        queryParams += '&toDate=' + params.toDate;
        const URL = `${process.env.REACT_APP_API_URL}/api/credit-debit-note/get-all-by-company-distributor-date-range?` + queryParams;
        axios.get(URL).then(response => {
            let notes = response.data.data;
            let balance = 0;
            let totalTransaction = 0;
            notes.map(n => {
                balance += n.credit - n.debit;
                n.balance = balance;
                totalTransaction++;
            });
            setNoteList(notes);
            console.log("noteList", noteList);
            setTotalInfo({totalTransaction: totalTransaction, totalBalance: balance});
            setSearchNoteList(notes);
        }).catch(err => {

        });
    }

    const handleBackToAllListPage = () => {
        history.push('/salescollection/payment-adjustment/credit-debit-note/all-list');
    }

    const handleTimeLineChange = (event) => {
        let value = event.target.value;
        getFiscalYearDateFromFiscalYearListByFiscalYearId(value);

    }

    const getFiscalYearDateFromFiscalYearListByFiscalYearId = (id) => {
        let found = false;
        for (let i = 0; i < timelineList.length; i++) {
            if (timelineList[i].id.toString() === id) {
                setSelectedTimeLine(timelineList[i]);
                found = true;
                break;
            }
        }
        if (!found) {
            setSearchNoteList([]);
            setSelectedTimeLine({})
            setTotalInfo({totalTransaction: 0, totalBalance: 0});
        }
        setSearchInputs({});
    }

    const handleSearchChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;
        setSearchInputs(values => ({...values, [name]: value}));
        getSearchListFromNoteList(value);
    }

    const getSearchListFromNoteList = (searchText) => {
        let tp = [];
        let totalTransaction = 0;
        let totalBalance = 0;
        for (let i = 0; i < noteList.length; i++) {
            if (noteList[i].proposal_date.includes(searchText) || noteList[i].note_no.includes(searchText) || noteList[i].reason.includes(searchText)) {
                totalTransaction++;
                totalBalance += noteList[i].credit - noteList[i].debit;
                noteList[i].balance = totalBalance;
                tp.push(noteList[i]);
            }
        }
        setTotalInfo({totalTransaction: totalTransaction, totalBalance: totalBalance});
        setSearchNoteList(tp);
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
            obj.PROPOSAL_DATE = row.proposal_date;
            obj.NOTE_NO = row.note_no;
            obj.REASON = row.reason;
            obj.CREDIT = row.credit;
            obj.DEBIT = row.debit;
            obj.BALANCE = row.balance;
            exportData.push(obj);
            setSingleAll([]);
        })
        const workbook = XLSX.utils.book_new();
        const Heading = [
            ["PROPOSAL DATE", "NOTE NO.", "REASON", "CREDIT", "DEBIT", "BALANCE"]
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
        XLSX.writeFile(workbook, "Distributor's_note_ledger.xlsx");
    }

    return (
        <>
            <div>
                {/* BREAD CRUM ROW */}
                <PaymentAdjustmentBreadCrum/>
            </div>

            <div>
                <Card>
                    <CardBody>
                        {/* BACK AND TITLE ROW */}
                        <div className="row">
                            <div className="col-4">
                                <span>
                                    <button className='btn' onClick={handleBackToAllListPage}>
                                        <strong>
                                            <i className="bi bi-arrow-left-short sales-booking-view-icon"></i>
                                        </strong>
                                    </button>
                                </span>
                            </div>
                            <div className="col-4 text-center mt-3">
                                <strong>Distributor's Credit Debit List</strong>
                            </div>
                        </div>

                        {/* HEADER ROW */}
                        <div className='row mt-5'>
                            <div className='col-xl-8'>
                                <div className="row">
                                    {locationHierarchyListLowToHigh.map((location, index) => (
                                        <div key={index} className="col-3">
                                        <span className="dark-gray-color"
                                              style={{fontWeight: "500"}}>{location.locationType.name}</span><br/>
                                            <span><strong>{location.name}</strong></span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className='col-xl-4 d-flex justify-content-end'>
                                <div className="d-flex  mr-5">
                                    <div>
                                        <img className="image-input image-input-circle"
                                             src={distributorLogo === undefined || distributorLogo === "" || distributorLogo === null ? distributorImg : `data:image/png;base64,${distributorLogo}`}
                                             width="35px" height="35px" alt='Distributor’s Picture'/>
                                    </div>
                                    <div className="ml-3">
                                        <span>
                                            <span
                                                style={{fontWeight: "500"}}><strong>{distributorInfo.distributor_name}</strong></span>
                                            <p><SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/phone.svg")}
                                                    width="14px" height="14px"/>&nbsp;{distributorInfo.contact_no}</p>
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <button className='btn sales-credit-btn'
                                            style={{padding: "0px 15px", borderRadius: "13px"}}>
                                        <span className='text-white' style={{fontSize: "0.83rem"}}>
                                            Balance<br/>
                                            {Number(distributorInfo.ledger_balance).toLocaleString('en-US', {minimumFractionDigits: 2})}
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>

                    </CardBody>
                </Card>
            </div>
            <div className="mt-5">
                <Card>
                    <CardBody>
                        {/* BODY ROW */}
                        <div>
                            {/* SEARCHING AND FILTERING ROW */}
                            <div className="row">
                                <div className="col-xl-3">
                                    <div style={{position: "absolute", padding: "7px", marginTop: "3px"}}>
                                        <img src={toAbsoluteUrl("/images/search.png")} width="20px" height="20px"/>
                                    </div>
                                    <form className="form form-label-right">
                                        <input type="text" className='form-control' name="searchText"
                                               placeholder="Search Here" style={{paddingLeft: "28px"}}
                                               value={searchInputs.searchText || ""} onChange={handleSearchChange}>

                                        </input>
                                    </form>
                                </div>
                                <div className="col-xl-9 d-flex justify-content-end">
                                    <div className="row mr-1">
                                        <div className="col-4 mt-3 text-xl-right">
                                            <label style={{color: "rgb(130, 130, 130)"}}>Timeline</label>
                                        </div>
                                        <div className="col-8">
                                            <select className="form-control" name="accountingYearId"
                                                    value={selectedTimeLine.id || ""}
                                                    onChange={handleTimeLineChange}>
                                                <option value="">Select Timeline</option>
                                                {timelineList.map((c) => (
                                                    <option key={c.id} value={c.id}>{c.fiscal_year_name}</option>))}
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <button className="btn filter-btn">
                                            <i className="bi bi-funnel"></i>&nbsp;{intl.formatMessage({id: "COMMON.FILTER"})}
                                        </button>
                                    </div>
                                </div>
                            </div>
                            {/* ALL SUMMARY ROW */}
                            <div className='row ml-2'>
                                <div className='col-xl-3 sales-data-chip' style={{borderRadius: "5px 0px 0px 5px"}}>
                                    <div className="d-flex">
                                        <div className="dark-gray-color">
                                            <SVG
                                                src={toAbsoluteUrl("/media/svg/icons/project-svg/gray-transactions.svg")}
                                                width="25px" height="25px"/>
                                        </div>
                                        <div className="ml-2">
                                            <span>
                                                <span className="dark-gray-color"
                                                      style={{fontWeight: "500"}}>Total Transaction</span>
                                                <p><strong>{totalInfo.totalTransaction}</strong></p>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className='col-xl-3 sales-data-chip'>
                                    <div className="d-flex">
                                        <div className="dark-gray-color">
                                            <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/gray-date.svg")}
                                                 width="25px" height="25px"/>
                                        </div>
                                        <div className="ml-2">
                                            <span>
                                                <span className="dark-gray-color"
                                                      style={{fontWeight: "500"}}>Date Range</span>
                                                <p><strong>{selectedTimeLine.start_date_formated}- {selectedTimeLine.end_date_formated}</strong></p>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className='col-xl-3 sales-data-chip' style={{borderRadius: "0px 5px 5px 0px"}}>
                                    <div className="d-flex">
                                        <div className="dark-gray-color">
                                            <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/gray-doller.svg")}
                                                 width="25px" height="25px"/>
                                        </div>
                                        <div className="ml-2">
                                            <span>
                                                <span className="dark-gray-color"
                                                      style={{fontWeight: "500"}}>Balance At  Period Start</span>
                                                <p><strong>{amountFormatterWithoutCurrency(totalInfo.totalBalance)}</strong></p>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className='col-xl-3 sales-data-chip' style={{background: "#F9F9F9"}}>
                                    <button className="btn float-right export-btn" onClick={handleExport}>
                                        <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/download.svg")}
                                             width="15px" height="15px"/>
                                    </button>
                                </div>
                            </div>
                            {/* TABLE ROW */}
                            <div className='mt-5'>
                                <DistributorLedgerList setSingleAll={setSingleAll} singleAll={singleAll}
                                                       noteList={searchNoteList}/>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </>
    );
}