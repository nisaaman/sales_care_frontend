import React, {useEffect, useState} from "react";
import PaymentAdjustmentBreadCrum from '../../../common/PaymentAdjustmentBreadCrum';
import PaymentAdjustmentHeader from "../../../common/PaymentAdjustmentHeader";
import CreditDebitNoteTabs from "../../../common/CreditDebitNoteTabs";
import LocationTreeView from '../../../../CommonComponents/LocationTreeView';
import SVG from "react-inlinesvg";
import {toAbsoluteUrl} from "../../../../../../../_metronic/_helpers";
import {Card, CardBody} from "../../../../../../../_metronic/_partials/controls";
import axios from 'axios';
import {showError} from '../../../../../../pages/Alert';
import {useIntl} from "react-intl";
import {shallowEqual, useSelector} from "react-redux";
import {CreditDebitNoteAllList} from "./table/CreditDebitNoteAllList";
import * as XLSX from "xlsx";


export default function AllPage() {
    let [singleAll, setSingleAll] = useState([]);
    const selectedCompany = useSelector((state) => state.auth.company, shallowEqual);
    const userLoginId = useSelector((state) => state.auth.user.userId, shallowEqual);
    const intl = useIntl();
    const [locationTree, setLocationTree] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState({});
    const [sessionData, setSessionData] = useState({userLoginId: userLoginId, companyId: selectedCompany});
    const [searchParams, setSearchParams] = useState({...sessionData});
    const [distributorList, setDistributorList] = useState([]);
    const [searchDistributorList, setSearchDistributorList] = useState([]);
    const [selectedLocationIds, setselectedLocationIds] = useState([]);
    const [searchInputs, setSearchInputs] = useState({});
    const [totalInfo, setTotalInfo] = useState({totalDistributors: 0, totalBalance: 0});


    useEffect(() => {
        document.getElementById('pills-payment-adjustment-credit-debit-note-tab').classList.add('active');
        document.getElementById('pills-payment-adjustment-credit-debit-note-all-tab').classList.add('active');
    }, []);

    useEffect(() => {
        setSearchParams({...searchParams, companyId: selectedCompany});
        getLocationTreeList({userLoginId: userLoginId, companyId: selectedCompany});
        setDistributorList([]);
        setSearchDistributorList([]);
        setSearchInputs({});
        setTotalInfo({totalDistributors: 0, totalBalance: 0});
    }, [selectedCompany]);

    const getLocationTreeList = () => {
        const URL = `${process.env.REACT_APP_API_URL}/api/location-tree/locationTree/${sessionData.userLoginId}/${sessionData.companyId}`;
        if (sessionData.companyId) {
        axios.get(URL).then(response => {
            const locationTree = response.data.data;
            setLocationTree(locationTree);
        }).catch(err => {
            showError(intl.formatMessage({id: "COMMON.ERROR_LOCATION_TREE"}));
        });}
    }

    const selectLocationTreeNode = (node) => {
        selectedLocationIds.length = 0;
        getAllLocationIdFromParentNode(node);
        let searchObj = {...searchParams, locationIds: selectedLocationIds};
        setSearchParams(searchObj);
        setSelectedLocation(node);
        getDistributorList(searchObj);
        setSearchInputs({});
    }

    const getAllLocationIdFromParentNode = (node) => {
        selectedLocationIds.push(node.id);
        node.children.map(n => getAllLocationIdFromParentNode(n));
    }

    const getDistributorList = (obj) => {
        let queryString = '?';
        queryString += '&companyId=' + obj.companyId;
        queryString += '&locationIds=' + obj.locationIds;
        const URL = `${process.env.REACT_APP_API_URL}/api/distributor/list-with-as-on-balance-and-current-credit-limit` + queryString;
        axios.get(URL, JSON.stringify(obj), {headers: {"Content-Type": "application/json"}}).then(response => {
            let distributorInfoList = response.data.data;
            distributorInfoList.map((d,i)=>  d.sl = i);
            let totalDistributors = 0;
            let totalBalance = 0;
            distributorInfoList.map(d => {
                d.selectedCompany = selectedCompany
                totalDistributors++;
                totalBalance += d.ledger_balance;
            });
            setTotalInfo({totalDistributors: totalDistributors, totalBalance: totalBalance});
            setDistributorList(distributorInfoList);
            setSearchDistributorList(distributorInfoList);
        }).catch(err => {

        });
    }

    const handleSearchChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;
        setSearchInputs(values => ({...values, [name]: value}));
        getSearchListFromDistributorList(value);
    }

    const getSearchListFromDistributorList = (searchText) => {
        searchText = searchText.toLowerCase();
        let tp = [];
        let totalDistributors = 0;
        let totalBalance = 0;
        for (let i = 0; i < distributorList.length; i++) {
            if (distributorList[i].distributor_name.toLowerCase().includes(searchText)
                || distributorList[i].ledger_balance.toString().includes(searchText)) {
                totalDistributors++;
                totalBalance += distributorList[i].ledger_balance;
                tp.push(distributorList[i]);
            }
        }
        setTotalInfo({totalDistributors: totalDistributors, totalBalance: totalBalance});
        setSearchDistributorList(tp);
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
            obj.distributor_name = row.distributor_name;
            obj.contact_no = row.contact_no;
            obj.ledger_balance = row.ledger_balance;
            exportData.push(obj);
            setSingleAll([]);
        })
        const workbook = XLSX.utils.book_new();
        const Heading = [
            ["DISTRIBUTOR NAME", "CONTACT NO.", "LEDGER BALANCE"]
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
        XLSX.writeFile(workbook, "distributor list in credit debit note.xlsx");
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
                <CreditDebitNoteTabs/>
            </div>

            <div>
                <Card>
                    <CardBody>
                        <div>
                            <div className='row'>
                                {/* LEFT SIDE TREE ROW */}
                                <div className='col-xl-3' style={{borderRight: "1px solid #F2F2F2"}}>
                                    <div style={{borderBottom: "1px solid #F2F2F2"}}>
                                        <label>
                                            <img src={toAbsoluteUrl("/images/loc3.png")}
                                                 style={{width: "20px", height: "20px", textAlign: "center"}}
                                                 alt='Company Picture'/>
                                            <strong style={{
                                                marginLeft: "10px",
                                                color: "#828282"
                                            }}>{intl.formatMessage({id: "COMMON.LOCATION_ALL"})}</strong>
                                        </label>
                                    </div>
                                    {/* TREE */}
                                    <LocationTreeView tree={locationTree}
                                                      selectLocationTreeNode={selectLocationTreeNode}/>
                                </div>
                                {/* RIGHT SIDE LIST ROW */}
                                <div className='col-xl-9'>
                                    {/* SEARCHING AND FILTERING ROW */}
                                    <div className="row">
                                        <div className="col-xl-3">
                                            <div style={{position: "absolute", padding: "7px", marginTop: "3px"}}>
                                                <img src={toAbsoluteUrl("/images/search.png")} width="20px"
                                                     height="20px"/>
                                            </div>
                                            <form className="form form-label-right">
                                                <input type="text" className='form-control' name="searchText"
                                                       placeholder="Search Here" style={{paddingLeft: "28px"}}
                                                       value={searchInputs.searchText || ""}
                                                       onChange={handleSearchChange}></input>
                                            </form>
                                        </div>
                                        <div className="col-xl-9 d-flex justify-content-end">

                                            <div>
                                                <button className="btn filter-btn">
                                                    <i className="bi bi-funnel"></i>&nbsp;{intl.formatMessage({id: "COMMON.FILTER"})}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    {/* ALL SUMMARY ROW */}
                                    <div className='row ml-2'>
                                        <div className='col-xl-3 sales-data-chip'
                                             style={{borderRadius: "5px 0px 0px 5px"}}>
                                            <div className="d-flex">
                                                <div className="dark-gray-color">
                                                    <SVG
                                                        src={toAbsoluteUrl("/media/svg/icons/project-svg/location.svg")}
                                                        width="25px" height="25px"/>
                                                </div>
                                                <div className="ml-2">
                                                    <span>
                                                        <span className="dark-gray-color"
                                                              style={{fontWeight: "500"}}>Location</span>
                                                        <p><strong>{selectedLocation.locationName ? selectedLocation.locationName : 'All'}</strong></p>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-xl-3 sales-data-chip'>
                                            <div className="d-flex">
                                                <div className="dark-gray-color">
                                                    <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/Duotone.svg")}
                                                         width="25px" height="25px"/>
                                                </div>
                                                <div className="ml-2">
                                                    <span>
                                                        <span className="dark-gray-color"
                                                              style={{fontWeight: "500"}}>{intl.formatMessage({id: "COMMON.DISTRIBUTORS"})}</span>
                                                        <p><strong>{totalInfo.totalDistributors}</strong></p>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-xl-3 sales-data-chip'
                                             style={{borderRadius: "0px 5px 5px 0px"}}>
                                            <div className="d-flex">
                                                <div className="dark-gray-color">
                                                    <SVG
                                                        src={toAbsoluteUrl("/media/svg/icons/project-svg/total-entry.svg")}
                                                        width="25px" height="25px"/>
                                                </div>
                                                <div className="ml-2">
                                                    <span>
                                                        <span className="dark-gray-color"
                                                              style={{fontWeight: "500"}}>Total Balance</span>
                                                        <p><strong>{totalInfo.totalBalance.toLocaleString('en-US', {minimumFractionDigits: 2})}</strong></p>
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
                                        <CreditDebitNoteAllList setSingleAll={setSingleAll} singleAll={singleAll}
                                                                distributorList={searchDistributorList}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </div>

        </>
    );
}