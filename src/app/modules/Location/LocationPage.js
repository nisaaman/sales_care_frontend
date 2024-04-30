import React, {useEffect, useState} from "react";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import {toAbsoluteUrl} from "../../../_metronic/_helpers";
import IOSSwitch from '../../pages/IOSSwitch';
import axios from "axios";
import {showError, showSuccess} from '../../pages/Alert';
import {useHistory} from "react-router-dom";
import {shallowEqual, useSelector} from "react-redux";

export function LocationPage({locationUIEvents}) {
    const dynamicStyleClasses = ["light-purple-bg  dark-purple-color", "light-success-bg  dark-success-color", "light-warning-bg  dark-warning-color"];
    const [searchParams, setSearchParams] = useState({searchText: '', childCompanyId: ''});
    const [childCompanies, setChildCompanies] = useState([]);
    const [locationTrees, setLocationTrees] = useState([]);
    const parentCompanyId = useSelector((state) => state.auth.user.parentCompany.id, shallowEqual);
    const history = useHistory();

    useEffect(() => {
        getAllChildCompanyByParentCompany();
        getAllLocationTree(searchParams);
    }, []);

    const getAllChildCompanyByParentCompany = () => {
        const URL = `${process.env.REACT_APP_API_URL}/api/organization/children/` + parentCompanyId;
        axios.get(URL).then(response => {
            setChildCompanies(response.data.data);
        });
    }

    const getAllLocationTree = (searchParamsObj) => {
        const URL = `${process.env.REACT_APP_API_URL}/api/location-tree/list`;
        axios.post(URL, JSON.stringify(searchParamsObj), {headers: {"Content-Type": "application/json"}}).then(response => {
            let locationTrees = response.data.data;
            let locationTrees_length = locationTrees.length;
            for (let i = 0; i < locationTrees_length; i++) {
                locationTrees[i].companies = locationTrees[i].companies ? locationTrees[i].companies.split(",") : [];
            }
            setLocationTrees(locationTrees);
        });
    }

    const handleSearchChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        let obj = {...searchParams, [name]: value};
        setSearchParams(obj);
        getAllLocationTree(obj);
    }

    const handleChange = (event) => {      
        const URL = `${process.env.REACT_APP_API_URL}/api/location-tree/update-active-status/` + event.target.value +"/"+ event.target.checked;
        let id = parseInt(event.target.value);
        let checked = event.target.checked;
        let index = locationTrees.findIndex(locationTree => (locationTree.id === id));
        let previouslocationTrees = [...locationTrees];
        axios.get(URL).then(response => {
            if (response.data.success) {
                showSuccess("Status changed Successfully.")
                previouslocationTrees[index].is_active = checked;
                setLocationTrees(previouslocationTrees);
            } else {
                showError("Cannot change status.");
                previouslocationTrees[index].is_active = !checked;
                setLocationTrees(previouslocationTrees);
            }
        }).catch(err => {
            showError("Cannot change status.");
            previouslocationTrees[index].is_active = !checked;
            setLocationTrees(previouslocationTrees);
        });
    }

    const editLocationTree = (row) => {
        history.push({'pathname': '/location/new', state: {row}})
    }

    return (
        <>

            <div>
                <div style={{marginTop: "-30px", marginLeft: "-18px"}}>
                    <nav aria-label="breadcrumb">
                        <ol className="breadCrum-bg-color">
                            <li aria-current="page" className='breadCrum-main-title'>Company</li>
                            <li aria-current="page" className='mt-1 breadCrum-sub-title'>&nbsp;Location
                                tree&nbsp;&nbsp;&nbsp;&nbsp;</li>

                        </ol>
                    </nav>
                </div>
                <div className="row">
                    <div className="col-xl-2">
                        <div style={{position: "absolute", padding: "7px", marginTop: "3px"}}>
                            <img src={toAbsoluteUrl("/images/search.png")} alt={''} width="20px" height="20px"/>
                        </div>
                        <form className="form form-label-right">
                            <input type="text" className="form-control" name="searchText"
                                   value={searchParams.searchText} placeholder="Search Here"
                                   onChange={handleSearchChange}
                                   style={{paddingLeft: "28px"}}
                            />
                        </form>
                    </div>
                    <div className="col-xl-10 d-flex justify-content-end">
                        <div style={{marginRight: "20px"}}>
                            <select className="form-control" aria-label="Default select example"
                                    name="childCompanyId"
                                    value={searchParams.childCompanyId}
                                    onChange={handleSearchChange}>
                                <option value=''>Select Child Company</option>
                                {childCompanies.map((company) => (
                                    <option key={company.id} value={company.id}>{company.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <button
                                type="button" className="btn btn-primary"
                                onClick={locationUIEvents.newLocationButtonClick}
                                data-toggle="tooltip" data-placement="bottom" title="Add Location"
                            >
                                + New Business Location Tree
                            </button>
                        </div>
                    </div>
                </div>
                <div className="row row-cols-1 row-cols-xl-3 g-4">


                    {/* LOCATION CARD START*/}

                    {locationTrees.map((locationTree, index) => (
                        <div key={index} className="col mt-5">
                            <div className="card h-100 full-card-redius" style={{marginTop: "30px"}}>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-xl-6 col-6 d-flex">
                                            <div>
                                                    <span className="chip light-gray-bg dark-gray-color"
                                                          style={{fontWeight: "700", padding: "5px 20px"}}
                                                    >{locationTree.code}</span>
                                            </div>
                                        </div>
                                        <div className="col-xl-6 col-6 d-flex"
                                             style={{marginTop: "10px"}}>
                                            <div className="card-div-icon dark-gray-color edit-icon"
                                                 data-toggle="tooltip" data-placement="bottom" title="View Details">
                                                <i className="bi bi-eye" data-toggle="tooltip" data-placement="bottom"
                                                   title="View Details"></i>
                                            </div>
                                            
                                            {
                                                    locationTree.is_active?
                                                    <div
                                                className="card-div-icon dark-gray-color edit-icon"
                                                style={{marginLeft: "10px"}}
                                                onClick={() => editLocationTree(locationTree)}
                                                data-toggle="tooltip" data-placement="bottom" title="Edit Depot"
                                            >
                                                <i className="bi bi-pen" data-toggle="tooltip" data-placement="bottom"
                                                   title="Edit Location"></i>
                                            </div>
                                                    :""
                                                }
                                            <div style={{marginLeft: "10px", marginTop: "-8px"}}>
                                                <FormControlLabel
                                                    control={
                                                        <IOSSwitch
                                                            checked={locationTree.is_active}
                                                            value={locationTree.id}
                                                            onChange={(event) => handleChange(event)}
                                                        />
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-5" style={{paddingLeft: "8px"}}>
                                        <div>
                                            <p className="card-header-title"><b>{locationTree.name}</b></p>
                                        </div>
                                        <div className="mt-5">
                                            <p><span
                                                style={{color: "rgba(153, 149, 149, 0.99)"}}>Create date : </span><b
                                                className="dark-gray-color">{locationTree.created_date}</b></p>
                                            <p><span
                                                style={{color: "rgba(153, 149, 149, 0.99)"}}>Update date : </span><b
                                                className="dark-gray-color">{locationTree.updated_date}</b></p>
                                        </div>
                                        <div>
                                            <p className="font-14" style={{color: "#BDBDBD"}}><b>Used by</b></p>
                                        </div>
                                        {locationTree.companies.map((company, index) =>
                                            <div key={index}>
                                                        <span
                                                            className={'chip ' + dynamicStyleClasses[index % dynamicStyleClasses.length]}
                                                            style={{padding: "10px 20px"}}>{company}</span>
                                            </div>)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    {/* LOCATION CARD END*/}

                </div>
            </div>
        </>
    );
}
