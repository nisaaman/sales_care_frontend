import React, {useEffect, useState} from "react";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import axios from "axios";
import { showError, showSuccess } from '../../../../pages/Alert';
import IOSSwitch from '../../../../pages/IOSSwitch';
import { useHistory } from "react-router-dom";
import { toAbsoluteUrl } from "../../../../../_metronic/_helpers";
import { useSubheader } from "../../../../../_metronic/layout";
import { shallowEqual, useSelector } from 'react-redux';

export function DepotPage({ depotAdd }) {
    const areaDynamicStyleClass = ["light-purple-bg  dark-purple-color", "light-success-bg  dark-success-color", "light-warning-bg  dark-warning-color"];
    const [searchParams, setSearchParams] = useState({ searchText: '', searchAreaId: '', searchAccountingYearId: '' });
    const [areas, setAreas] = useState([]);
    const [accountingYears, setAccountingYears] = useState([]);
    const [depots, setDepots] = useState([]);
    const history = useHistory();
    const subheader = useSubheader();
    const parentCompany = useSelector((state) => state.auth.user.parentCompany, shallowEqual);


    useEffect(() => {
        subheader.setTitle("Depot Configure");
        getAllArea();
        getAllAccountingYear();
        getAlldepots(searchParams);
    }, []);

    const handleChange = (event) => {
        const URL = `${process.env.REACT_APP_API_URL}/api/depot/update-active-status/` + event.target.value;
        let id = parseInt(event.target.value);
        let checked = event.target.checked;
        let index = depots.findIndex(depot => (depot.id === id));
        let previousDepots = [...depots];
        axios.get(URL).then(response => {
            if (response.data.success) {
                showSuccess("Status changed Successfully.")
                previousDepots[index].is_active = checked;
                setDepots(previousDepots);
            } else {
                showError("Cannot change status.");
                previousDepots[index].is_active = !checked;
                setDepots(previousDepots);
            }
        }).catch(err => {
            showError("Cannot change status.");
            previousDepots[index].is_active = !checked;
            setDepots(previousDepots);
        });
    }

    const getAllArea = (event) => {
        const URL = `${process.env.REACT_APP_API_URL}/api/location`;
        axios.get(URL).then(response => {
            if (response.data.success) {
                setAreas(response.data.data);
            } else {
                showError("Cannot get Areas.");
            }
        });
    }

    const getAllAccountingYear = (event) => {
        const URL = `${process.env.REACT_APP_API_URL}/api/accounting-year`;
        axios.get(URL).then(response => {
            if (response.data.success) {
                setAccountingYears(response.data.data);
            } else {
                showError("Cannot get Accounting years.");
            }
        });
    }

    const getAlldepots = (obj) => {
        const URL = `${process.env.REACT_APP_API_URL}/api/depot/list`;
        axios.post(URL, JSON.stringify(obj), { headers: { "Content-Type": "application/json" } }).then(response => {
            if (response.data.success) {
                let depots = response.data.data;
                let depot_length = depots.length;
                for (let i = 0; i < depot_length; i++) {
                    depots[i].areas = depots[i].areas ? depots[i].areas.split(",") : [];
                }
                setDepots(depots);
            } else {
                showError("Cannot get Depots.");
            }
        });
    }

    const handleSearchChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        let obj = { ...searchParams, [name]: value };
        setSearchParams(obj);
        getAlldepots(obj);
    }

    const editDepot = (row) => {
        history.push({ 'pathname': '/inventory/configure/depot-configure/new', state: { row } })
    }

    return (
        <>
            <div>
            <div style={{ marginTop: "-30px",marginLeft:"-18px" }}>
                <nav aria-label="breadcrumb">
                    <ol className="breadCrum-bg-color">
                        <li aria-current="page" className='breadCrum-main-title'>{parentCompany?.name}</li>
                        <li aria-current="page" className='mt-1 breadCrum-sub-title'>&nbsp;Inventory&nbsp;&nbsp;&nbsp;&nbsp;</li>
                        <li aria-current="page" className='mt-1 breadCrum-sub-title text-primary'><span className='font-weight-bolder'>.</span>&nbsp; Configure &nbsp;&nbsp;</li>
                        <li aria-current="page" className='mt-1 breadCrum-sub-title text-primary'><span className='font-weight-bolder'>.</span>&nbsp; Depot Configure</li>
                    </ol>
                </nav>
            </div>
                <div className="row">
                    <div className="col-xl-2">
                    <div style={{position:"absolute",padding:"7px",marginTop:"3px"}}>
                                <img src={toAbsoluteUrl("/images/search.png")} alt={''} width="20px" height="20px" />
                        </div>
                        <form className="form form-label-right">
                            <input type="text" className="form-control" name="searchText"
                                value={searchParams.searchText} placeholder="Search Depot"
                                onChange={handleSearchChange}
                                style={{paddingLeft:"28px"}}
                            />
                        </form>
                    </div>
                    <div className="col-xl-10 d-flex flex-wrap justify-content-end">
                        <div className="mr-5">
                            <select className="form-control" name="searchAreaId"
                                value={searchParams.searchAreaId}
                                onChange={handleSearchChange}
                                aria-label="Default select example">
                                <option value="">Select Area</option>
                                {areas && areas.length>0 && areas.map((area) => (
                                    <option key={area.id} value={area.id}>
                                        {area.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mr-5">
                            <select className="form-control" name="searchAccountingYearId"
                                value={searchParams.searchAccountingYearId}
                                onChange={handleSearchChange}
                                aria-label="Default select example">
                                <option value="">Select Fiscal Year</option>
                                {accountingYears && accountingYears.length>0 && accountingYears.map((year) => (
                                    <option key={year.id} value={year.id}>{year.fiscalYearName}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <button type="button" className="btn btn-primary" onClick={depotAdd} data-toggle="tooltip" data-placement="bottom" title="Add Depot">+ New Depot
                            </button>
                        </div>
                    </div>
                </div>
                <div>
                    {/* DEPOT CARD START*/}
                    <div className="row row-cols-1 row-cols-xl-3 g-4">
                        {depots.map((depot, index) => (
                            <div key={index} className="col mt-5">
                                <div className="card h-100 full-card-redius" style={{ marginTop: "30px" }}>
                                    <div className="card-body">
                                        <div className="d-flex flex-wrap justify-content-between">
                                            <div className="">
                                                <div>
                                                    <span className="chip light-gray-bg dark-gray-color"
                                                        style={{
                                                            fontWeight: "700",
                                                            padding: "5px 20px"
                                                        }}>{depot.code}</span>
                                                </div>
                                            </div>
                                            <div className="d-flex flex-wrap"
                                                style={{ marginTop: "10px" }}>
                                                <div className="card-div-icon dark-gray-color edit-icon" data-toggle="tooltip" data-placement="bottom" title="View Details">
                                                    <i className="bi bi-eye" data-toggle="tooltip" data-placement="bottom" title="View Details"></i>
                                                </div>
                                                {
                                                    depot.is_active?
                                                    <div
                                                    className="card-div-icon dark-gray-color edit-icon"
                                                    style={{ marginLeft: "10px" }}
                                                    onClick={() => editDepot(depot)}
                                                    data-toggle="tooltip" data-placement="bottom" title="Edit Depot"
                                                >
                                                    <i className="bi bi-pen" data-toggle="tooltip" data-placement="bottom" title="Edit Depot"></i>
                                                </div>
                                                    :""
                                                }
                                                
                                                <div style={{ marginLeft: "10px", marginTop: "-8px" }}>
                                                    <FormControlLabel
                                                        control={
                                                            <IOSSwitch id={'depot_status_' + depot.id}
                                                                checked={depot.is_active}
                                                                value={depot.id}
                                                                onChange={(event) => handleChange(event)} />
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row mt-5">
                                            <div className="col-xl-12" style={{paddingLeft:"20px"}}>
                                                <div hidden={true} key={depot.id}></div>
                                                <div>
                                                    <p className="card-header-title"><b>{depot.depot_name}</b></p>
                                                </div>
                                                {depot.centralWarehouse != "" &&
                                                <div className="d-flex mt-2">
                                                    <div className="card-div-icon dark-gray-color">
                                                        <i className="bi bi-house-fill"></i>
                                                    </div>
                                                    <div className="ml-2 mt-1"><p className="dark-gray-color"
                                                        style={{ fontWeight: "500" }}>{depot.centralWarehouse}</p>
                                                    </div>
                                                </div>
                                                }
                                                <div className="d-flex mt-2">
                                                    <div className="card-div-icon dark-gray-color">
                                                        <i className="bi bi-person-workspace"></i>
                                                    </div>
                                                    <div className="ml-2 mt-1"><p className="dark-gray-color"
                                                        style={{ fontWeight: "500" }}>{depot.depotManager}</p>
                                                    </div>
                                                </div>
                                                <div className="d-flex mt-2">
                                                    <div className="card-div-icon dark-gray-color">
                                                        <i className="bi bi-telephone-plus"></i>
                                                    </div>
                                                    <div className="ml-2 mt-1"><p className="dark-gray-color"
                                                        style={{ fontWeight: "500" }}>{depot.contact_number}</p>
                                                    </div>
                                                </div>
                                                <div className="d-flex">
                                                    <div className="card-div-icon dark-gray-color">
                                                        <i className="bi bi-geo-alt"></i>
                                                    </div>
                                                    <div className="ml-2 mt-1">
                                                        <p className="dark-gray-color"
                                                            style={{ fontWeight: "500" }}>{depot.address}</p>
                                                    </div>
                                                </div>
                                                {/* <div className="mt-3">
                                                    <p className="product-title title"><b>Products</b></p>
                                                </div>
                                                <div className="row">
                                                    <div className="col-xl-9 available">Available</div>
                                                    <div className="col-xl-3 available-ammout"><b>6,500</b></div>
                                                </div>
                                                <div className="progress text-primary mt-3">
                                                    <div className="progress-bar" role="progressbar"
                                                        style={{ width: "25%" }} aria-valuenow="25" aria-valuemin="0"
                                                        aria-valuemax="100">25%
                                                    </div>
                                                </div> */}
                                                <div style={{marginTop:"20px",marginBottom:"-10px"}}>
                                                    <p className="font-14" style={{ color: "#BDBDBD" }}><b>Covered Area</b>
                                                    </p>
                                                </div>
                                                {depot.areas.map((area, index) =>
                                                    <div key={index} >
                                                        <span
                                                            className={'chip ' + areaDynamicStyleClass[index % areaDynamicStyleClass.length]}
                                                            style={{ padding: "10px 20px" }}>{area}</span>
                                                    </div>)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* DEPOT CARD END*/}
                </div>
            </div>
        </>
    );
}