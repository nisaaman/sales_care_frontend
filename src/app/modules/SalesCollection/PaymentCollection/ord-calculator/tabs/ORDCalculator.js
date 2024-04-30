import React, {useEffect, useState} from 'react';
import SVG from "react-inlinesvg";
import {toAbsoluteUrl} from "../../../../../../_metronic/_helpers";
import {Card, CardBody} from "../../../../../../_metronic/_partials/controls";
import {useHistory} from 'react-router-dom';
import axios from 'axios';
import {showError} from '../../../../../pages/Alert';
import {useIntl} from "react-intl";
import {shallowEqual, useSelector} from "react-redux";
import {ORDCalculatorDataTable} from '../data-table/ORDCalculatorDataTable';
import CollectionBreadCrum from '../../common/CollectionBreadCrum'
import CollectionTodaySales from "../../common/CollectionTodaySales"
import LocationTreeView from '../../../CommonComponents/LocationTreeView';
import * as XLSX from "xlsx";
import _ from "lodash";
import moment from "moment";

export function ORDCalculator(props) {
    const selectedCompany = useSelector((state) => state.auth.company, shallowEqual);
    const userLoginId = useSelector((state) => state.auth.user.userId, shallowEqual);
    let history = useHistory();
    let [singleAll, setSingleAll] = React.useState([]);
    const [sessionData, setSessionData] = useState({
        userLoginId: userLoginId,
        companyId: selectedCompany,
        locationIds: [],
        selectedAccountingYear: {}
    });
    const [searchParams, setSearchParams] = useState(sessionData);
    const [locationTree, setLocationTree] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState({});
    const [selectedLocationIds, setselectedLocationIds] = useState([]);
    const [totalReceivable, setTotalReceivable] = useState(0);
    const [totalDistributor, setTotalDistributor] = useState(0);
    const [ordList, setOrdList] = useState([]);
    const intl = useIntl();
    const [allAccountingYear, setAllAccountingYear] = useState([]);

    useEffect(() => {
        document.getElementById('pills-payment-ord-calculator-tab').classList.add('active');
    }, []);

    useEffect(() => {
        if (selectedCompany === null) { // when select add company
            setLocationTree([]);
            setTotalReceivable(0)
            setTotalDistributor(0)
            setOrdList([]);
        } else {
            let searchObj = {...searchParams, companyId: selectedCompany};
            setSearchParams(searchObj);
            getLocationTreeList({...searchParams, companyId: selectedCompany});
            getOrdCalculatorList(searchObj);
            getAccountingYear(selectedCompany);
        }
    }, [selectedCompany]);

    const getOrdCalculatorList = (obj) => {
        if (_.isEmpty(obj.selectedAccountingYear) || obj.locationIds.length === 0) {
            return;
        }

        let queryString = '?';
        queryString += '&companyId=' + selectedCompany;
        queryString += '&fromDate=' + obj.selectedAccountingYear.startDate;
        queryString += '&toDate=' + obj.selectedAccountingYear.endDate;
        queryString += '&locationIds=' + obj.locationIds;
        const URL = `${process.env.REACT_APP_API_URL}/api/ord/calculator-list-view` + queryString;

        axios.get(URL, JSON.stringify(obj), {headers: {"Content-Type": "application/json"}}).then(response => {
            let ordDataList = response.data.data.distributorList;
            if (ordDataList.length === 0) {
                showError("No Data found");
            }
            let totalDistributors = 0;
            let totalReceivableAmount = 0;
            ordDataList.map(d => {
                totalDistributors++;
                totalReceivableAmount += parseFloat(d.periodicBalance);
            });
            setTotalReceivable(totalReceivableAmount)
            setTotalDistributor(totalDistributors)

            setOrdList(ordDataList);
        }).catch(err => {

        });
    }

    const getLocationTreeList = (params) => {
        const URL = `${process.env.REACT_APP_API_URL}/api/location-tree/locationTree/${params.userLoginId}/${params.companyId}`;
        if (params.companyId) { 
        axios.get(URL).then(response => {
            const locationTree = response.data.data;
            setLocationTree(locationTree);
        }).catch(err => {
            showError(intl.formatMessage({id: "COMMON.ERROR_LOCATION_TREE"}));
        });}
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
            selectedLocationIds.length = 0;
            getAllLocationIdFromParentNode(node);
            let searchObj = {...searchParams, locationIds: selectedLocationIds};
            setSearchParams(searchObj);
            setSelectedLocation(node);
            getOrdCalculatorList(searchObj);
        }
    }

    const getAllLocationIdFromParentNode = (node) => {
        selectedLocationIds.push(node.id);
        node.children.map(n => getAllLocationIdFromParentNode(n));
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
            obj.SKU = row.distributorName;
            obj.CategoryName = row.openingBalance;
            obj.CategoryName = row.periodicBalance;
            exportData.push(obj);
            setSingleAll([]);
        })
        const workbook = XLSX.utils.book_new();
        const Heading = [
            ["Distributor", "Opening Balance", "Closing Balance"]
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
        XLSX.writeFile(workbook, "Trade_Price_Data.xlsx");
    }
    const handleKeyPressChange = (e) => {
        let searchObj = {...searchParams, companyId: selectedCompany};
        if (e.keyCode === 32) {
            getOrdCalculatorList(searchObj);
        } else if (e.keyCode === 8) {
            getOrdCalculatorList(searchObj);
        }
    }

    const handleSearchChange = (event) => {
        let value = event.target.value;
        getSearchList(value);
    }
    const getSearchList = (searchText) => {
        let searchTextValue = searchText.toLowerCase();
        let tp = [];
        for (let i = 0; i < ordList.length; i++) {
            let distributorName = ordList[i].distributorName.toLowerCase();
            if (distributorName.includes(searchTextValue)) {
                tp.push(ordList[i]);
            }
        }
        setOrdList(tp);
    }
    const getAccountingYear = (companyId) => {
        const URL = `${process.env.REACT_APP_API_URL}/api/accounting-year/companyWise/${companyId}`;
        if (companyId) {
        axios.get(URL).then(response => {
            setAllAccountingYear(response.data.data);
        }).catch(err => {

        });}
    }
    const setAccountingYearData = (event) => {
        let ac = allAccountingYear.find(item => item.id.toString() === event.target.value);
        if (ac === undefined) {  // when select empty
            ac = {};
        } else {
            ac.formatedStartDate = moment(new Date(ac.startDate)).format('DD/MM/YYYY');
            ac.formatedEndtDate = moment(new Date(ac.endDate)).format('DD/MM/YYYY');
        }
        let searchObj = {...searchParams, selectedAccountingYear: ac};
        setSearchParams(searchObj);
        getOrdCalculatorList(searchObj);
    }
    return (
        <>
            {/* BREAD CRUM ROW */}
            <CollectionBreadCrum/>
            {/* TODAY SALE ROW */}
            <CollectionTodaySales/>
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
                                            <strong style={{marginLeft: "10px", color: "#828282"}}>Location
                                                (All)</strong>
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
                                                <input type="text" className="form-control" name="searchText"
                                                       placeholder="Search Here" style={{paddingLeft: "28px"}}
                                                       onKeyUp={(e) => handleKeyPressChange(e)}
                                                       onChange={handleSearchChange}
                                                />
                                            </form>
                                        </div>
                                        <div className="col-xl-9 d-flex flex-wrap justify-content-end">
                                            <div className='mr-3'>
                                                <div className="row">
                                                    <div className="col-3 mt-3">
                                                        <label className="dark-gray-color">Timeline</label>
                                                    </div>
                                                    <div className="col-9">
                                                        <select className="border-0 form-control"
                                                                onChange={setAccountingYearData}>
                                                            <option value="">Select Fiscal Year</option>
                                                            {allAccountingYear.map((accYear) => (
                                                                <option key={accYear.fiscalYearName} value={accYear.id}>
                                                                    {accYear.fiscalYearName}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <button className="btn filter-btn">
                                                    <i className="bi bi-funnel"></i>&nbsp;Filter
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    {/* ALL SUMMARY ROW */}
                                    <div className='d-flex flex-wrap justify-content-between sales-data-chip'>
                                        <div style={{borderRadius: "5px 0px 0px 5px"}}>
                                            <div className="d-flex">
                                                <div className="dark-gray-color">
                                                    <i className="bi bi-geo-alt"></i>
                                                </div>
                                                <div className="ml-2">
                                                    <span>
                                                        <span className="dark-gray-color"
                                                              style={{fontWeight: "500"}}>Area</span>
                                                        <p><strong>{selectedLocation.locationName ? selectedLocation.locationName : 'All'}</strong></p>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="d-flex">
                                                <div className="dark-gray-color">
                                                    <SVG
                                                        src={toAbsoluteUrl("/media/svg/icons/project-svg/gray-transactions.svg")}
                                                        width="15px" height="15px"/>
                                                </div>
                                                <div className="ml-2">
                                                    <span>
                                                        <span className="dark-gray-color"
                                                              style={{fontWeight: "500"}}>Timeline</span>
                                                        <p><strong>{_.isEmpty(searchParams.selectedAccountingYear) ? '' : '' + searchParams.selectedAccountingYear.formatedStartDate + ' to ' + searchParams.selectedAccountingYear.formatedEndtDate}</strong></p>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="d-flex">
                                                <div className="dark-gray-color">
                                                    <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/box.svg")}
                                                         width="15px" height="15px"/>
                                                </div>
                                                <div className="ml-2">
                                                    <span>
                                                        <span className="dark-gray-color"
                                                              style={{fontWeight: "500"}}>Distributors</span>
                                                        <p><strong>{totalDistributor}</strong></p>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{borderRadius: "0px 5px 5px 0px"}}>
                                            <div className="d-flex">
                                                <div className="dark-gray-color">
                                                    <img src={toAbsoluteUrl("/images/LineChart.png")} width="24px"
                                                         height="24px"/>
                                                </div>
                                                <div className="ml-2">
                                                    <span>
                                                        <span className="dark-gray-color"
                                                              style={{fontWeight: "500"}}>Total Receivable</span>
                                                        <p><strong>{Number(totalReceivable).toFixed(2)}</strong></p>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{background: "#F9F9F9"}}>
                                            <button className="btn float-right export-btn" onClick={handleExport}>
                                                <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/download.svg")}
                                                     width="15px" height="15px"/>
                                            </button>
                                        </div>
                                    </div>
                                    {/* TABLE ROW */}
                                    <div className='mt-5'>
                                        <ORDCalculatorDataTable setSingleAll={setSingleAll} singleAll={singleAll}
                                                                ordList={ordList}/>
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