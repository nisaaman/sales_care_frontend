import React, { useState, useEffect } from 'react';
import axios from "axios";
import { showError } from '../../../../../pages/Alert';
import DistributorsBreadCrum from "../../common/DistributorsBreadCrum";
import DistributorsHeader from "../../common/DistributorsHeader";
import { useIntl } from "react-intl";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../../_metronic/_helpers";
import Popper from '@material-ui/core/Popper';
import LocationTreeView from '../../../CommonComponents/LocationTreeView';
import { shallowEqual, useSelector } from "react-redux";
import { Card, CardBody } from "../../../../../../_metronic/_partials/controls";
import { DistributorsListView } from "../table/DistributorsListView";
import * as XLSX from 'xlsx';//EXPORT Library import
import { hasAcess } from '../../../../Util';

export default function DistributorsOverview() {
    const permissions = useSelector((state) => state.auth.user.permissions, shallowEqual);
    const intl = useIntl();
    const userId = useSelector((state) => state.auth.user.userId, shallowEqual);
    const companyId = useSelector((state) => state.auth.company, shallowEqual);
    let [singleAll, setSingleAll] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [sessionData, setSessionData] = useState({ userLoginId: userId, companyId: companyId, accountingYearId: 1 });
    const [searchParams, setSearchParams] = useState({ ...sessionData, locationId: '', semesterId: '' });
    const [locationTree, setLocationTree] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState({});
    const [locationTypeNameSelect, setLocationTypeNameSelect] = useState("Area");
    const [locationNameSelect, setLocationNameSelect] = useState("All");
    const [distributors, setDistributors] = useState(0)
    const [distributorList, setDistributorList] = useState([])
    const [distributorListSearch, setDistributorListSearch] = useState([])

    const [active, setActive] = useState(0)//In first stagte it will always 0
    const [inActive, setInActive] = useState(0)//In first stagte it will always 0
    let activeCount = 1;// count start from 1


    useEffect(() => {
        if(hasAcess(permissions, 'DISTRIBUTOR_LIST')){
            document.getElementById('pills-distributors-list-tab').classList.add('active');
        }
        //getLocationTreeList({ userLoginId: sessionData.userLoginId, companyId: sessionData.companyId });
        getDistributorList([]);
    }, [sessionData.companyId]);

    const handleClick = (event) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popper' : undefined;

    // const handleExport = () => {
    //     const exportData = [...singleAll]
    //     //----------------------EXPORT START---------------
    //     const workbook = XLSX.utils.book_new();
    //     const Heading = [
    //         ["Name", "Balance", "Status","Distributor Id","Distributor Type"],
    //     ];
    //     const worksheet = XLSX.utils.json_to_sheet(exportData, { origin: 'A2', skipHeader: true });

    //     // creating sheet and adding data from 2nd row of column A.
    //     // Leaving first row to add Heading

    //     XLSX.utils.sheet_add_aoa(worksheet, Heading, { origin: 'A1' });
    //     XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    //     XLSX.writeFile(workbook, "Distributor_Data.xlsx");
    //     //----------------------EXPORT END-------------
    // }

    const handleExport = () => {
        const data = [...singleAll];
        if (data.length === 0) {
            showError("No row is selected for export data");
            return;
        }
        let exportData = [];
        data.map(row => {
            let obj = {};
            //obj.distributorId = row.distributorId;
            obj.distributorName = row.distributorName;
            obj.creditLimit = row.creditLimit;
            obj.Active = row.Active === true ? "Active" : "Inactive";
            obj.distributorType = row.distributorType === "Silver"?3:row.distributorType=== "Gold"?4:5;
            exportData.push(obj);
            setSingleAll([]);
        })
        const workbook = XLSX.utils.book_new();
        const Heading = [
            [ "NAME", "CREDIT LIMIT", "STATUS", "RATING"]
        ];
        const worksheet = XLSX.utils.json_to_sheet(exportData, { origin: 'A2', skipHeader: true });

        // creating sheet and adding data from 2nd row of column A.
        // Leaving first row to add Heading
        XLSX.utils.sheet_add_aoa(worksheet, Heading, { origin: 'A1' });
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
        XLSX.writeFile(workbook, "DistributorList.xlsx");
    }

    const selectLocationTreeNode = (node) => {
        let id = "summary-id-"+node.id;
        const getId = document.getElementById(id);
        const getElements = document.getElementsByClassName('tree-nav__item_demo tree-nav__item-title');
        
        for (var i = 0; i < getElements.length; i++) {
            getElements[i].classList.remove('tree-nav-item');
        }
        if (getId) {
            getId.classList.add('tree-nav-item');
            setLocationNameSelect(node.locationName)
            let searchObj = { ...searchParams, locationId: node.id.toString() };
            setSearchParams(searchObj);
            setSelectedLocation(node);
            getDistributorList({ userLoginId: sessionData.userLoginId, locationId: node.id, companyId: searchParams.companyId });
        }
    }

    const getDistributorList = (params) => {//getDistributorList is method

        if (params.userLoginId !== undefined && params.locationId !== undefined && params.companyId !== undefined) {
            //console.log(params)
            const URL = `${process.env.REACT_APP_API_URL}/api/distributor/distributorList/${params.userLoginId}/${params.locationId}/${params.companyId}`;//API call from backend
            axios.get(URL).then(response => {//get data in response
                if (response.data.data.length > 0) {
                    response.data.data.map((obj) => {// one by one row is checking in obj
                        if (obj.Active === true) {
                            setActive(activeCount++)
                        }
                        else {
                            setInActive(inActive + 1)
                        }
                    })
                    setDistributorList(response.data.data);
                    setDistributorListSearch(response.data.data);
                }
                else {
                    setDistributorList([]);
                    setDistributorListSearch([]);
                }
            }).catch(err => {
                showError(intl.formatMessage({ id: "COMMON.ERROR_LOCATION_TREE" }));
            });
        }

    }

    const getCompanySelect = (row) => {//getCompanySelect is passed in DistributorHeader using props.getSearchInputs

        setDistributorList([]);
        setDistributorListSearch([]);
        setSearchParams({ ...searchParams, companyId: row.companyId });
        getLocationTreeList({ userLoginId: sessionData.userLoginId, companyId: row.companyId });
    }


    const getLocationTreeList = (params) => {
        //console.log(params)
        if (params.userLoginId !== undefined && params.companyId !== undefined) {
            const URL = `${process.env.REACT_APP_API_URL}/api/location-tree/locationTree/${params.userLoginId}/${params.companyId}`;
            axios.get(URL).then(response => {
               //console.log(response.data)
                if(response.data.data===null || response.data.data.length===0){
                    setLocationTree([]);
                    showError("No Location Tree Found.");
                }else{
                    const locationTree = response.data.data;
                    setLocationTree(locationTree);
                }

            }).catch(err => {
                showError(intl.formatMessage({ id: "COMMON.ERROR_LOCATION_TREE" }));
            });
        }
    }
    const handleKeyPressChange = (e) => {
        if (e.keyCode === 32) {
            getDistributorList(searchParams);
        } else if (e.keyCode === 8) {
            getDistributorList(searchParams);
        }
    }
    const handleSearchChange = (event) => {
        let value = event.target.value;
        getSearchList(value);
    }
    const getSearchList = (searchText) => {
        let searchTextValue = searchText.toLowerCase();
        let tp = [];
        for (let i = 0; i < distributorListSearch.length; i++) {
            let distributorName = distributorListSearch[i].distributorName.toLowerCase();
            if (distributorName.includes(searchTextValue)) {
                tp.push(distributorListSearch[i]);
            }
        }
        setDistributorList(tp);
    }
    return (
        <>
            <div>
                <DistributorsBreadCrum />
                <DistributorsHeader getSearchInputs={getCompanySelect} /> {/*getSearchInputs method is in DistributorHeader as a props */}
            </div>
            <div>
                <Card>
                    <CardBody>
                        <div>
                            <div className='row'>
                                {/* LEFT SIDE TREE ROW */}
                                <div className='col-xl-3' style={{ borderRight: "1px solid #F2F2F2" }}>
                                    <div style={{ borderBottom: "1px solid #F2F2F2" }}>
                                        <label>
                                            <img src={toAbsoluteUrl("/images/loc3.png")}
                                                style={{ width: "20px", height: "20px", textAlign: "center" }}
                                                alt='Company Picture' />
                                            <strong style={{ marginLeft: "10px", color: "#828282" }}>Location (All)</strong>
                                        </label>
                                    </div>
                                    {/* TREE */}
                                    <LocationTreeView tree={locationTree}
                                        selectLocationTreeNode={selectLocationTreeNode} />
                                </div>
                                {/* RIGHT SIDE LIST ROW */}
                                <div className='col-xl-9'>
                                    {/* SEARCHING AND FILTERING ROW */}
                                    <div className="row">
                                        <div className="col-xl-3">
                                            <div style={{ position: "absolute", padding: "7px", marginTop: "3px" }}>
                                                <img src={toAbsoluteUrl("/images/search.png")} width="20px" height="20px" />
                                            </div>
                                            <form className="form form-label-right">
                                                <input type="text" className="form-control" name="searchText"
                                                    placeholder="Search Here"
                                                    style={{ paddingLeft: "28px" }}
                                                    onChange={handleSearchChange}
                                                />
                                            </form>
                                        </div>
                                        <div className="col-xl-9 d-flex justify-content-end">
                                            <div>
                                                <button className="btn filter-btn">
                                                    <i className="bi bi-funnel"></i>&nbsp;Filter
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    {/* ALL SUMMARY ROW */}
                                    <div className='row ml-2'>
                                        <div className='col-xl-3 sales-data-chip' style={{ borderRadius: "5px 0px 0px 5px" }}>
                                            <div className="d-flex">
                                                <div className="dark-gray-color">
                                                    <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/location.svg")} width="25px" height="25px" />
                                                </div>
                                                <div className="ml-2">
                                                    <span>
                                                        <span className="dark-gray-color"
                                                            style={{ fontWeight: "500" }}>{intl.formatMessage({ id: "LOCATION" })}</span>
                                                        <p><strong>{locationNameSelect}</strong></p>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-xl-3 sales-data-chip'>
                                            <div className="d-flex">
                                                <div className="dark-gray-color">
                                                    <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/Duotone.svg")} width="22px" height="22px" />
                                                </div>
                                                <div className="ml-2">
                                                    <span>
                                                        <span className="dark-gray-color"
                                                            style={{ fontWeight: "500" }}>{intl.formatMessage({ id: "COMMON.DISTRIBUTORS" })}</span>
                                                        <p><strong>{distributorList.length}</strong></p>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-xl-3 sales-data-chip' style={{ borderRadius: "0px 5px 5px 0px" }}>

                                            <div className="ml-2">
                                                <span>
                                                    <span className="dark-gray-color"
                                                        style={{ fontWeight: "500" }}>{intl.formatMessage({ id: "COMMON.ACTIVE" })}</span>
                                                    &nbsp;<strong className='text-primary'>{active}</strong>
                                                </span>
                                            </div>
                                            <div className="ml-2">
                                                <span>
                                                    <span className="dark-gray-color"
                                                        style={{ fontWeight: "500" }}>{intl.formatMessage({ id: "COMMON.INACTIVE" })}</span>
                                                    &nbsp;<strong>{inActive}</strong>
                                                </span>
                                            </div>

                                        </div>
                                        <div className='col-xl-3 sales-data-chip' style={{ background: "#F9F9F9" }}>
                                            <button className="btn float-right export-btn" onClick={handleExport}>
                                                <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/export.svg")} width="15px" height="15px" />
                                            </button>
                                        </div>
                                    </div>
                                    {/* TABLE ROW */}
                                    <div className='mt-5'>
                                        <DistributorsListView setSingleAll={setSingleAll} singleAll={singleAll} distributorList={distributorList} setDistributorList = {setDistributorList}/>
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