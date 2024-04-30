import React, { useState, useEffect } from 'react';
import axios from "axios";
import Popper from '@material-ui/core/Popper';
import DistributorsBreadCrum from "../../common/DistributorsBreadCrum";
import DistributorsHeader from "../../common/DistributorsHeader";
import {showError} from '../../../../../pages/Alert';
import LocationTreeView from '../../../CommonComponents/LocationTreeView';
import {
    Card,
    CardBody,
  } from "../../../../../../_metronic/_partials/controls";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../../_metronic/_helpers";
import { useHistory } from "react-router-dom";
import { useIntl } from 'react-intl';
import { shallowEqual, useSelector } from "react-redux";
import { ActivityList } from "../table/ActivityList";

export default function DistributorsActivity() {
    const history = useHistory();
    const selectedCompany = useSelector((state) => state.auth.company, shallowEqual);
    let [singleAll, setSingleAll] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [sessionData, setSessionData] = useState({userLoginId: 1, companyId: 2, accountingYearId: 1});
    const [searchParams, setSearchParams] = useState({...sessionData, locationId: '', semesterId: ''});
    const [locationTree, setLocationTree] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState({});
    const [locationTypeNameSelect, setLocationTypeNameSelect] = useState("Area");
    const [locationNameSelect, setLocationNameSelect] = useState("Chittagong");
    const [distributors, setDistributors] = useState("8,030")
    const intl = useIntl();
    useEffect(() => {
        document.getElementById('pills-distributors-activity-tab').classList.add('active');
        getLocationTreeList();
    }, []);

    const handleClick = (event) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    };
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popper' : undefined;
    const handleExport = () => {
        const exportData = [...singleAll]
        //console.log(exportData)
    }

    const getLocationTreeList = () => {
        const URL = `${process.env.REACT_APP_API_URL}/api/location-tree/locationTree/${sessionData.userLoginId}/${sessionData.companyId}`;
        axios.get(URL).then(response => {
            const locationTree = response.data.data;
            setLocationTree(locationTree);
        }).catch(err => {
            showError(intl.formatMessage({id: "COMMON.ERROR_LOCATION_TREE"}));
        });
    }

    const selectLocationTreeNode = (node) => {
        let searchObj={...searchParams,locationId:node.id.toString()};
        setSearchParams(searchObj);
        setSelectedLocation(node);
    }
    return (
        <>
            <div>
                <DistributorsBreadCrum />
                <DistributorsHeader />
            </div>

            {/* CONTENT ROW */}
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
                                                      selectLocationTreeNode={selectLocationTreeNode}/>
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
                                                />
                                            </form>
                                        </div>
                                        <div className="col-xl-9 d-flex justify-content-end">
                                            <div>
                                                <button className='btn' aria-describedby={id} onClick={handleClick} style={{ color: "#828282" }}>
                                                    Fiscal Year 2022-23&nbsp;
                                                    <i className="bi bi-chevron-down"></i>
                                                </button>
                                                <Popper id={id} open={open} anchorEl={anchorEl}>
                                                    <div className='dropdown-content'>
                                                        <div className="row">
                                                            <div className="column">
                                                                <h6>Category 1</h6>
                                                                <a href="#">Link 1</a>
                                                                <a href="#">Link 2</a>
                                                                <a href="#">Link 3</a>
                                                            </div>
                                                            <div className="column">
                                                                <h6>Category 2</h6>
                                                                <a href="#">Link 1</a>
                                                                <a href="#">Link 2</a>
                                                                <a href="#">Link 3</a>
                                                            </div>
                                                            <div className="column">
                                                                <h6>Category 3</h6>
                                                                <a href="#">Link 1</a>
                                                                <a href="#">Link 2</a>
                                                                <a href="#">Link 3</a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Popper>
                                            </div>
                                            <div>
                                                <button className="btn filter-btn">
                                                    <i className="bi bi-funnel"></i>&nbsp;Filter
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    {/* ALL SUMMARY ROW */}
                                    <div className='row ml-2'>
                                        <div className='col-xl-4 sales-data-chip' style={{ borderRadius: "5px 0px 0px 5px" }}>
                                            <div className="d-flex">
                                                <div className="dark-gray-color">
                                                <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/location.svg")} width="25px" height="25px" />
                                                </div>
                                                <div className="ml-2">
                                                    <span>
                                                        <span className="dark-gray-color"
                                                            style={{ fontWeight: "500" }}>{locationTypeNameSelect}</span>
                                                        <p><strong>{locationNameSelect}</strong></p>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-xl-4 sales-data-chip'>
                                            <div className="d-flex">
                                                <div className="dark-gray-color">
                                                    <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/Duotone.svg")} width="22px" height="22px" />
                                                </div>
                                                <div className="ml-2">
                                                    <span>
                                                        <span className="dark-gray-color"
                                                            style={{ fontWeight: "500" }}>{intl.formatMessage({id: "COMMON.DISTRIBUTORS"})}</span>
                                                    <p><strong>{distributors}</strong></p>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className='col-xl-4 sales-data-chip' style={{ background: "#F9F9F9" }}>
                                            <button className="btn float-right export-btn" onClick={handleExport}>
                                                <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/export.svg")} width="15px" height="15px" />
                                            </button>
                                        </div>
                                    </div>
                                    {/* TABLE ROW */}
                                    <div className='mt-5'>
                                        <ActivityList setSingleAll={setSingleAll} singleAll={singleAll} />
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