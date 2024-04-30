import React, {useEffect, useState} from "react";
import {Card} from "react-bootstrap";
import Button from '@material-ui/core/Button';
import {CardBody} from "../../../../_metronic/_partials/controls";
import MasterConfigBreadCrum from "../MasterConfigBreadCrum";
import {NavLink, useHistory} from "react-router-dom";
import {showError, showSuccess} from "../../../pages/Alert";
import axios from "axios";

export default function DepotLocationLevelCreate(props) {
    const fields = {id: "", locationTypeId: "", locationTreeId: ""};
    const [inputs, setInputs] = useState(fields);
    const [locationTypeList, setLocationTypeList] = useState([]);
    const [locationTreeList, setLocationTreeList] = useState([]);
    const [selectedLocationType, setSelectedLocationType] = useState("");
    const history = useHistory();

    useEffect(() => {

        if (props.location.state) {
            let treelist = [];
            treelist.push(props.location.state.data.locationTree);
            setLocationTreeList(treelist);
            setSelectedLocationType("" + props.location.state.data.id);
            setInputs({
                id: props.location.state.data.id,
                locationTypeId: props.location.state.data.id,
                locationTreeId: props.location.state.data.locationTree.id
            });
            getLocationTypeList(props.location.state.data.locationTree.id);
        } else {
            getLocationTreeList();
        }
    }, [])

    const getLocationTypeList = (locationTreeId) => {
        const URL = `${process.env.REACT_APP_API_URL}/api/location-type/get-location-type/${locationTreeId}`;
        axios.get(URL).then(response => {
            setLocationTypeList(response.data.data)
        });
    }

    const getLocationTreeList = () => {
        const URL = `${process.env.REACT_APP_API_URL}/api/location-tree`;
        axios.get(URL).then(response => {
            setSelectedLocationType("");
            setLocationTreeList(response.data.data)
        });
    }

    const handleChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;
        setInputs(values => ({...values, [name]: value}));
        if (event.target.name == 'locationTreeId') {
            getLocationTypeList(event.target.value);
            setSelectedLocationType("");
        } else if (event.target.name == 'locationTypeId') {
            setSelectedLocationType(value);
        }
    }

    const handleBack = (data) => {
        history.push({pathname: '/master-config/depot-location-level-map-setup'});
    }

    const saveMap = () => {
        if (!isValid()) {
            return false;
        }
        let URL = ''
        if (inputs.id === '') {
            URL = `${process.env.REACT_APP_API_URL}/api/location-type/add-depot-location-level-map/` + selectedLocationType;
        } else {
            URL = `${process.env.REACT_APP_API_URL}/api/location-type/add-depot-location-level-map/` + selectedLocationType;
        }
        axios.get(URL).then(response => {
            if (response.data.success === true) {
                showSuccess(response.data.message);
                handleBack();
            } else {
                showError(response.data.message);
            }
        }).catch(err => {
            showError(err);
        });
    }

    const isValid = () => {
        console.log("selectedLocationType=", selectedLocationType)

        if (!inputs.locationTreeId) {
            showError('Location Tree is required.');
            return false;
        } 

        if (!inputs.locationTypeId) {
            showError('Location Type is required.');
            return false;
        }
        
        else if (inputs.id === '' && isMapExistInTypeList()) {
            showError('Depot Location Level Map already exist in Location Tree');
            return false;
        }
        return true;
    }

    const isMapExistInTypeList = () => {
        let valid = false;
        locationTypeList.map(t => {
            if (t.isDepotLevel === true) {
                valid = true;
            }
        });
        return valid;
    }


    return (
        <>
            {/* BREAD CRUM ROW */}
            <MasterConfigBreadCrum menuTitle="Depot Location Level Map Setup"/>

            <Card>
                <CardBody>
                    <div className="row">
                        <div className="col-lg-12">
                            <span className="create-field-title">Depot Location Level Map Setup</span>

                            <NavLink className="float-right" to="/master-config/depot-location-level-map-setup">
                                <span><i className="bi bi-chevron-left"></i></span>Back
                            </NavLink>

                            <div className='mt-5 row'>
                                <div className='col-xl-6'>

                                    <label className='level-title'>Location Tree<i style={{color: "red"}}>*</i></label>
                                    <select id="locationTreeId" className='form-control' name="locationTreeId"
                                            value={inputs.locationTreeId || ""}
                                            onChange={(event) => handleChange(event)}>
                                        <option value="">Please select Tree</option>
                                        {locationTreeList.map((t) => (
                                            <option key={t.id} value={t.id}>{t.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className='col-xl-6 '>
                                    <label className='level-title'>Location Type<i
                                        style={{color: "red"}}>*</i></label>
                                    <select id="locationTypeId" className='form-control' name="locationTypeId"
                                            value={inputs.locationTypeId || ""}
                                            onChange={(event) => handleChange(event)}>
                                        <option value="">Please select Location Type</option>
                                        {locationTypeList.map((branch) => (
                                            <option key={branch.id} value={branch.id}>{branch.name}</option>
                                        ))}
                                    </select>
                                </div>

                            </div>

                            <Button className="float-right mt-5" id="gotItBtn" variant="contained" color="primary"
                                    onClick={saveMap}>
                                {inputs.id ? 'Update' : 'Create'}
                            </Button>

                        </div>
                    </div>
                </CardBody>
            </Card>
        </>);
}