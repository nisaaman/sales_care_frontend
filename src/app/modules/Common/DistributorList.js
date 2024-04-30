import React, {useEffect, useState} from "react";
import {showError} from "../../pages/Alert";
import axios from "axios";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {TextField} from "@material-ui/core";

export default function DistributorList(props) {
    const [distributorValue, setDistributorValue] = useState({email: '', name: '', id: 0});

    useEffect(() => {
        getAllDistributors(props.companyIdPass, props.salesOfficerIdsPass)
    }, [props.companyIdPass, props.salesOfficerIdsPass]);

    const getAllDistributors = (companyId, salesOfficerIds) => {
        props.distributorListPass.length = 0;
        let queryString = "?";
        queryString += "companyId=" + companyId;
        queryString += '&salesOfficerIds=' + salesOfficerIds;
        const URL = `${process.env.REACT_APP_API_URL}/api/distributor/get-distributor-list-by-company-sales-officer-wise` + queryString;
        axios.get(URL).then(response => {
            props.setDistributors(response.data.data);
        });
    }
    const deleteDistributor = (data) => {
        const temp = [...props.distributorListPass]
        const index = temp.findIndex(obj => obj.id === data.id);
        temp.splice(index, 1);
        props.setDistributorListPass(temp)
    }
    return (
        <>
            <div className='mt-5 row'>
                <div className="form-group col-lg-8">
                    <label className='level-title'><span className="mr-1">Distributor</span></label>
                    <Autocomplete
                        name="distributorId"
                        options={props.distributors}
                        getOptionLabel={(option) => option.name ? option.name : "" + option.email ? " -[" + option.email + "]" : ""}
                        value={distributorValue}
                        onChange={(event, newValue) => {
                            if (newValue !== null) {
                                if (props.distributorListPass.length > 0) {
                                    let temp = [...props.distributorListPass]
                                    const index = temp.findIndex(data => data.id === newValue.id);
                                    if (index > -1) {
                                        showError("This distributor already used");
                                        setDistributorValue({email: '', name: '', id: 0});
                                        return;
                                    } else {
                                        temp.push({
                                            "id": newValue.id,
                                            "name": newValue.name,
                                            "email": newValue.email
                                        });
                                        props.setDistributorListPass(temp);
                                    }
                                } else {
                                    const temp = [...props.distributorListPass]
                                    temp.push({
                                        "id": newValue.id,
                                        "name": newValue.name,
                                        "email": newValue.email
                                    });
                                    props.setDistributorListPass(temp);
                                }
                            }
                            setDistributorValue({email: '', name: '', id: 0});
                        }}
                        renderInput={(params) => (
                            <TextField {...params} label="Select Distributor"/>
                        )}
                    />
                </div>
            </div>

            <div
                className="mt-3"
                style={{border: "none", padding: "0 3px 3px 3px"}}>
                {props.distributorListPass.length > 0 ? props.distributorListPass.map(data => {
                    return (
                        <>
                            {
                                data.id !== "" ?
                                    <span className='mt-3 mr-5 areaLevel'
                                    >
                                        {data.name + " -[" + data.email + "]"}
                                        <span className='deleteIcon'>
                                            <a
                                                className='fa fa-times text-white delete-file'
                                                onClick={() => deleteDistributor(data)}
                                            ></a>
                                        </span>
                                    </span> : ""
                            }
                        </>
                    )
                }) : ""}
            </div>
        </>);
}