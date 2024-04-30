import React, { useState, useEffect } from "react";
import InventoryBreadCrum from '../../../../bread-crum/InventoryBreadCrum';
import InventoryStockHeader from "../../../header/InventoryStockHeader";
import { Card, CardBody } from "../../../../../../../_metronic/_partials/controls";
import { toAbsoluteUrl } from "../../../../../../../_metronic/_helpers";
import SVG from "react-inlinesvg";
import DamageDeclarationList from "./table/DamageDeclarationList";
import { useHistory } from "react-router-dom";
import { shallowEqual, useSelector } from "react-redux";
import axios from "axios";
import { hasCreateAccess } from "../../../../../Util";

export default function DamageDeclaration() {
    let [singleAll, setSingleAll] = useState([]);
    const history = useHistory();
    const permissions = useSelector((state) => state.auth.user.permissions, shallowEqual);
    const companyId = useSelector((state) => state.auth.company, shallowEqual);
    const [accountingYearId, setAccountingYearId] = useState('');
    const [sessionData, setSessionData] = useState({userLoginId: '', companyId: companyId, accountingYearId: accountingYearId});
    const [searchParams, setSearchParams] = useState({...sessionData, locationId: ''});
    const [allAccountingYear, setAllAccountingYear] = useState([]);
    const [invRcvDetails, setInvRcvDetails] = useState([]);
    const [allSemester, setAllSemester] = useState([]);
    const [approvalStatus, setApprovalStatus] = useState('');
    const [fiscalYearId, setFiscalYearId] = useState('');
    const [listData, setListData] = useState([]);
    
    useEffect(() => {
        document.getElementById('pills-inventory-stock-damage-declaration-tab').classList.add('active');
        getCurrentAccountingYear(companyId)
        getAllAccountingYear(companyId)
        getDamageList();
    }, [companyId]);
    
    useEffect(() => {
        getDamageList();
    }, [fiscalYearId]);

    const getCurrentAccountingYear = (companyId) => {
        const URL = `${process.env.REACT_APP_API_URL}/api/accounting-year/current/${companyId}`;
        axios.get(URL).then((response) => {
            setAccountingYearId(response.data.data);
        }).catch();
    }

    const getAllAccountingYear = (companyId) => {        
        const URL = `${process.env.REACT_APP_API_URL}/api/accounting-year/companyWise/${companyId}`;
        if (companyId) {
          axios.get(URL).then(response => {
            setAllAccountingYear(response.data.data);
        }).catch(err => {
           
        });
    }
    }
    const changeAccYear = event => {
        /* if(event.target.value === ""){
            setAllSemester([]) 
        }else{
            getAllSemester(event.target.value)
        } */

        fiscalYearChangeHandler(event);
    }

    const fiscalYearChangeHandler = (e) => {
        const value = e.target.value;
        setFiscalYearId(value ? value : '');        
    }

    const getAllSemester = (fiscalYearId) => {
        const URL = `${process.env.REACT_APP_API_URL}/api/accounting-year/get-with-semesters-by-id/${fiscalYearId}`;
        axios.get(URL).then(response => {
            setAllSemester(response.data.data.semesterList);
        });
    }

    const getDamageList = () => { 
        let URL = `${process.env.REACT_APP_API_URL}/api/inv-damage/damage-declaration-list`;
        URL += '?companyId=' + companyId;
        // URL += '&status=' + approvalStatus;
        URL += '&fiscalYearId=' + fiscalYearId;
        axios.get(URL).then(response => {
            setListData(response.data.data);          
        });
    }

    const handleExport = () => {
        const exportData = [...singleAll]
    }

    const handleNewDamage = ()=>{
        history.push("/new-stock-damage")
    }
    const handleKeyPressChange = (e) => {
        if (e.keyCode === 32) {
            getDamageList();
        } else if (e.keyCode === 8) {
            getDamageList();
        }
    }
    const handleSearchChange = (event) => {
        let value = event.target.value;
        getSearchList(value);
    }
    const getSearchList = (searchText) => {
        let searchTextValue = searchText.toLowerCase();
        let tp = [];
        for (let i = 0; i < listData.length; i++) {
            let damageNo = listData[i].damage_no.toLowerCase();
            let createdBy = listData[i].created_by.toLowerCase();
            if (damageNo.includes(searchTextValue)
                ||createdBy.includes(searchTextValue)
                ) {
                tp.push(listData[i]);
            }
        }
        setListData(tp);
    }
    return (
        <>
            {/* BREAD CRUM ROW */}
            <div>
                <InventoryBreadCrum />
            </div>
            
            {/* HEADER ROW */}
            <div>
               <InventoryStockHeader showStockData={true}/>
            </div>

            {/* MAIN CARD ROW */}
            <div className="mb-n5">
                <Card>
                    <CardBody>
                        <span className="text-muted mt-3 display-inline-block">
                        Inter Store Damage will only change the physical location of the Products.
                        </span>
                        {hasCreateAccess(permissions, 'STOCK_DAMAGE_DECLARATION') &&
                        <span>
                            <button onClick={()=>handleNewDamage()} className="float-right btn light-blue-bg dark-blue-color rounded">
                                <SVG className="mr-2" src={toAbsoluteUrl("/media/svg/icons/project-svg/storemove-blue.svg")} /> 
                                Inter Stock Damage
                            </button>
                        </span>
                        }
                    </CardBody>
                </Card>
            </div>
            <div>
                <Card>
                    <CardBody>
                        {/* SEARCH AND FILTER ROW */}
                        <div className="row">
                            {/* SEARCH BOX ROW */}
                            <div className="col-xl-3">
                                <div style={{ position: "absolute", padding: "7px", marginTop: "3px" }}>
                                    <img src={toAbsoluteUrl("/images/search.png")} width="20px" height="20px" />
                                </div>
                                <form className="form form-label-right">
                                    <input type="text" className="form-control" name="searchText"
                                    placeholder="Search Here" style={{ paddingLeft: "28px" }} 
                                    onChange={handleSearchChange}
                                    onKeyUp={(e) => handleKeyPressChange(e)}
                                    />
                                </form>
                            </div>

                            {/* SELECTED ROW */}
                            <div className="col-xl-8 text-right">
                                    {/* TIMELINE DROPDOWN */}
                                    <span className="mr-3 display-inline-block">
                                        <div className="row">
                                            <div className="col-3 mt-3">
                                                <label className="dark-gray-color">Timeline</label>
                                            </div>
                                            <div className="col-9">
                                                <select className="border-0 form-control" onChange={(event) => changeAccYear(event)}>
                                                <option value="" className="fs-1">Select Fiscal Year</option>
                                                {
                                                    allAccountingYear.map((accYear)=>(
                                                        <option key={accYear.id} value={accYear.id}
                                                            className="fs-1">{accYear.fiscalYearName}</option>
                                                    ))
                                                }
                                                </select>
                                            </div>
                                        </div>
                                    </span>

                                    {/* SEMESTER DROPDOWN */}
                                    <span className="mr-3 display-inline-block d-none">
                                        <div className="row">
                                            <div className="col-3 mt-3">
                                                <label className="dark-gray-color">Semester</label>
                                            </div>
                                            <div className="col-9">
                                            <select className="form-control" id="semesterId"  name="semesterId">
                                                <option value="">Please Select Semester</option> 
                                                {
                                                    allSemester.map((semester)=>(
                                                    <option key={semester.id} value={semester.id}>{semester.semesterName}</option> 
                                                    ))
                                                } 
                                            </select>
                                            </div>
                                        </div>
                                    </span>
                            </div>

                            {/* FILTER BUTTON ROW */}
                            <div className="col-xl-1">
                                <button className="btn filter-btn">
                                    <i className="bi bi-funnel" style={{ fontSize: "11px" }}></i>&nbsp;Filter
                                </button>
                            </div>
                        </div>

                        {/* ALL SUMMARY ROW */}
                        <div className="row d-none">
                            {/* DEPOT ROW */}
                            <div className='col-xl-4 sales-data-chip'>
                                <div className="d-flex">
                                    <div className="dark-gray-color">
                                        <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/location.svg")} width="30px" height="30px" />
                                    </div>
                                    <div className="ml-2">
                                        <span>
                                            <span className="dark-gray-color"
                                                style={{ fontWeight: "500" }}>Depot</span>
                                            <p><strong>Chittagong</strong></p>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* NO. OF DAMAGE ROW */}
                            <div className='col-xl-4 sales-data-chip'>
                                <div className="d-flex">
                                    <div className="dark-gray-color">
                                        <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/history.svg")} width="25px" height="25px" />
                                    </div>
                                    <div className="ml-2">
                                        <span>
                                            <span className="dark-gray-color"
                                                style={{ fontWeight: "500" }}>No. Of Movement Request</span>
                                            <p><strong>{invRcvDetails?.length}</strong></p>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* EXPORT ROW */}
                            <div className='col-xl-4 sales-data-chip' style={{ background: "#F9F9F9" }}>
                                <button className="btn float-right export-btn" onClick={handleExport}>
                                    <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/download.svg")} width="15px" height="15px" />
                                </button>
                            </div>
                        </div>

                        {/* TABLE ROW */}
                        <div className='mt-5'>
                            <DamageDeclarationList setSingleAll={setSingleAll} singleAll={singleAll} 
                            listData={listData} />
                        </div>
                    </CardBody>
                </Card>
            </div>
        </>
    );
}