
import React, { useEffect, useState } from "react";
import { showError } from "../../pages/Alert";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { TextField } from "@material-ui/core";
import axios from "axios";

export default function DepotList(props) {
    const [depotValue, setDepotValue] = useState(null);

    useEffect(() => {
        getAllDepots(props.companyIdPass, props.salesOfficerIdsDepotPass,props.depotShow);
    }, [props.companyIdPass, props.salesOfficerIdsDepotPass,props.depotShow]);

    const getAllDepots = (companyId, salesOfficerList, depotShow) => {
        props.depotListPass.length = 0;
        if(depotShow === "COMPANY_AND_SALES_OFFICER_ID"){
            if (salesOfficerList.length > 0) {
                let queryString = "?";
                queryString += "companyId=" + companyId;
                queryString += '&salesOfficerList=' + salesOfficerList;
                const URL = `${process.env.REACT_APP_API_URL}/api/depot/get-depot-filter` + queryString;
                axios.get(URL).then(response => {
                    props.setDepots(response.data.data);
                });
            }
        }
        if(depotShow === "ONLY_COMPANY") {
            if (companyId) {
                //let queryString = "?";
                //queryString += "companyId=" + Number(companyId);
                const URL = `${process.env.REACT_APP_API_URL}/api/depot/all-of-a-company/${companyId}`;
                axios.get(URL).then(response => {
                    props.setDepots(response.data.data);
                }); 
            }
            
        }
    }
    const deleteDepot = (data) => {
        const temp = [...props.depotListPass]
        const index = temp.findIndex(obj => obj.id === data.id);
        temp.splice(index, 1);
        props.setDepotListPass(temp)
    }
    return (
        <>
            <div className='mt-5'>
                <label className='level-title'><span className="mr-1">Depot</span></label>
                <Autocomplete
                    name="depotId"
                    options={props.depots}
                    //onKeyDown={getAllDepots}
                    getOptionLabel={(option) => option.depot_name}
                    value={depotValue}
                    onChange={(event, newValue) => {
                        setDepotValue(newValue)
                        if (newValue !== null) {
                            if (props.depotListPass.length > 0) {
                                let temp = [...props.depotListPass]
                                const index = temp.findIndex(data => data.id === newValue.id);
                                if (index > -1) {
                                    showError("This depot already used");
                                    return;
                                } else {
                                    temp.push({
                                        "id": newValue.id,
                                        "depotName": newValue.depot_name

                                    })
                                    props.setDepotListPass(temp)
                                }
                            } else {
                                const temp = [...props.depotListPass]
                                temp.push({
                                    "id": newValue.id,
                                    "depotName": newValue.depot_name

                                })
                                props.setDepotListPass(temp)
                            }
                        }
                    }}
                    renderInput={(params) => (
                        <TextField {...params} label="Select Depot" />
                    )}
                />
            </div>

            <div
                className="mt-3"
                style={{ border: "none", padding: "0 3px 3px 3px" }}>
                {props.depotListPass.length > 0 ? props.depotListPass.map(data => {
                    return (
                        <>
                            {
                                data.id !== "" ?
                                    <span className='mt-3 mr-5 areaLevel'
                                    >
                                        {data.depotName}
                                        <span className='deleteIcon'>
                                            <a
                                                className='fa fa-times text-white delete-file'
                                                onClick={() => deleteDepot(data)}
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