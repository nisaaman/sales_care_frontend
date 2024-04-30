import React, {useEffect, useState} from "react";
import {showError} from "../../pages/Alert";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {TextField} from "@material-ui/core";
import axios from "axios";

export default function SalesOfficeList(props) {
    const [selectedItem, setSelectedItem] = useState({email: '', name: '', id: 0});

    useEffect(() => {
        getSalesOfficerListByLocation(props.companyIdPass, props.locationsIdsPass, props.nationalLocationChecked)
    }, [props.companyIdPass, props.locationsIdsPass, props.nationalLocationChecked]);


    const getSalesOfficerListByLocation = (companyId, locationIds, nationalAll) => {
        if (nationalAll) {
            props.salesOfficerListPass.length = 0;
            props.setSalesOfficer([])
            let queryString = '?';
            queryString += 'companyId=' + companyId;
            queryString += '&locationIds=' + locationIds;
            const URL = `${process.env.REACT_APP_API_URL}/auth/get-sales-officer-by-location-wise` + queryString;
            axios.get(URL).then(response => {
                props.setSalesOfficer(response.data.data)
            }).catch(err => {
            });

        } else {
            props.salesOfficerListPass.length = 0;
            props.setSalesOfficer([])
            if (locationIds.length > 0) {
                let queryString = '?';
                queryString += 'companyId=' + companyId;
                queryString += '&locationIds=' + locationIds;
                const URL = `${process.env.REACT_APP_API_URL}/auth/get-sales-officer-by-location-wise` + queryString;
                axios.get(URL).then(response => {
                    props.setSalesOfficer(response.data.data)
                }).catch(err => {
                });
            }
        }

    }
    const deleteSalesOfficer = (data) => {
        const temp = [...props.salesOfficerListPass]
        const index = temp.findIndex(obj => obj.id === data.id);
        temp.splice(index, 1);
        props.setSalesOfficerListPass(temp)
    }
    return (
        <>
            <div className="mt-5 row">
                <div className="form-group col-lg-8">
                    <label className='level-title'>Sales Officer</label><br/>
                    <Autocomplete
                        name="salesOfficerId"
                        options={props.salesOfficer}
                        getOptionLabel={(option) => option.name ? option.name + " -[" + option.email + "]" : ""}
                        value={selectedItem}
                        onChange={(event, newValue) => {
                            console.log("newValue=", newValue)
                            console.log("props=", props)
                            if (newValue !== null) {
                                if (props.salesOfficerListPass.length > 0) {
                                    let temp = [...props.salesOfficerListPass]
                                    const index = temp.findIndex(data => data.id === newValue.id);
                                    if (index > -1) {
                                        showError("This sales officer already used");
                                        setSelectedItem({email: '', name: '', id: 0});
                                        return;
                                    } else {
                                        temp.push({
                                            "id": newValue.id,
                                            "name": newValue.name,
                                            "email": newValue.email
                                        });
                                        props.setSalesOfficerListPass(temp);
                                    }
                                } else {
                                    const temp = [...props.salesOfficerListPass]
                                    temp.push({
                                        "id": newValue.id,
                                        "name": newValue.name,
                                        "email": newValue.email
                                    })
                                    props.setSalesOfficerListPass(temp)
                                }
                            }
                            setSelectedItem({email: '', name: '', id: 0});
                        }}
                        renderInput={(params) => (
                            <TextField {...params} label="Select Sales Officer"/>
                        )}
                    />
                </div>
            </div>

            <div
                style={{border: "none", padding: "0 3px 3px 3px"}}>
                {props.salesOfficerListPass.length > 0 ? props.salesOfficerListPass.map(data => {
                    return (
                        <>
                            {
                                data.id !== "" ?
                                    <span className='mt-3 mr-5 areaLevel'
                                    >
                                        {data.name
                                            // + " -[" + data.email + "]"
                                        }
                                        <span className='deleteIcon'>
                                            <a
                                                className='fa fa-times text-white delete-file'
                                                onClick={() => deleteSalesOfficer(data)}
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