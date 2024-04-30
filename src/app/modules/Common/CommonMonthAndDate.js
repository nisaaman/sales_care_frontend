import React, { useEffect, useState } from 'react';
import { showError } from "../../pages/Alert";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_green.css";
import moment from "moment";
// Datepicker
import DatePicker from "react-datepicker";

export default function CommonMonthAndDate(props) {
    const currentDate = new Date();
    const [startMonth, setStartMonth] = useState(new Date());
    const [endMonth, setEndMonth] = useState(new Date());

    useEffect(() => {
        document.getElementById('month').style.display = "none";
        document.getElementById('date').style.display = "block";
        document.getElementById('Date').checked = true;
        props.setType('Date')
    }, []);
    
    const handleSelectTypeRange = (e) => {
        const getRadioId = document.getElementById(e.target.id);
        var radioElements = document.getElementsByClassName("all-radio");
        for (var i = 0; i < radioElements.length; i++) {
            radioElements[i].checked = false;
            radioElements[i].classList.remove("true")

        }
        if (getRadioId.className === "all-radio mr-5") {
            if (e.target.id === "Date") {
                props.setInputs({})
                props.setType(e.target.id)
                getRadioId.checked = true;
                document.getElementById('date').style.display = "block";
                document.getElementById('month').style.display = "none";
            } else if (e.target.id === "Month") {
                props.setInputs({})
                props.setType(e.target.id)
                getRadioId.checked = true;
                document.getElementById('date').style.display = "none";
                document.getElementById('month').style.display = "block";
            } 
            // else {
            //     props.setInputs({})
            //     props.setType(e.target.id)
            //     getRadioId.checked = true;
            //     document.getElementById('month').style.display = "none";
            //     document.getElementById('date').style.display = "none";
            // }
        }
    }
    return (
        <>

            <div className='row mt-5'>
                <div className='col-xl-3'>
                    <input className="all-radio mr-5" type="radio" name="day" id="Date" onClick={(e) => handleSelectTypeRange(e)} />
                    <label className='level-title'>Day</label>
                </div>
                <div className='col-xl-3'>
                    <input className="all-radio mr-5" type="radio" name="month" id="Month" onClick={(e) => handleSelectTypeRange(e)} />
                    <label className='level-title'>Month</label>
                </div>
            </div>
            <div id="date">
                <div className='mt-5 row'>
                    <div className='form-group col-lg-8'>
                        <label className='level-title'>Start Date</label>
                        <Flatpickr className="form-control date" id="startDate"
                            name="startDate" placeholder="dd-MM-yyyy"
                            value={props.inputs.startDate ? moment(props.inputs.startDate, "YYYY-MM-DD").format("DD-MMM-YYYY") : ''}
                            options={{ dateFormat: "d-M-Y" }}
                            onChange={(value) => {
                                props.setInputs({
                                    ...props.inputs,
                                    "startDate": moment(new Date(value)).format("YYYY-MM-DD")
                                })

                            }}
                        />
                    </div>
                </div>
                <div className='mt-5 row'>
                    <div className='form-group col-lg-8'>
                        <label className='level-title'>End Date</label>
                        <Flatpickr className="form-control date" id="endDate" placeholder="dd-MM-yyyy"
                            value={props.inputs.endDate ? moment(props.inputs.endDate, "YYYY-MM-DD").format("DD-MMM-YYYY") : ''}
                            options={{ dateFormat: "d-M-Y" }}
                            onChange={(value) => {
                                props.setInputs({
                                    ...props.inputs,
                                    "endDate": moment(new Date(value)).format("YYYY-MM-DD")
                                })
                            }}
                        />
                    </div>
                </div>
            </div>

            <div id="month">
                <div className='mt-5 row'>
                    <div className='form-group col-lg-8'>
                        <label className='level-title'>Start Month</label>
                        <DatePicker className="form-control"
                            value={props.inputs.startMonth || ""}
                            placeholderText={'MM-yyyy'}
                            dateFormat="MMM-yyyy"
                            showMonthYearPicker
                            selected={startMonth}
                            onChange={(startMonth) => {
                                props.setInputs({
                                    ...props.inputs,
                                    "startMonth": startMonth
                                })
                                setStartMonth(startMonth)
                            }}
                        />
                    </div>
                </div>
                <div className='mt-5 row'>
                    <div className='form-group col-lg-8'>
                        <label className='level-title'>End Month</label>
                        <DatePicker className="form-control"
                            value={props.inputs.endMonth || ""}
                            placeholderText={'MM-yyyy'}
                            dateFormat="MMM-yyyy"
                            showMonthYearPicker
                            selected={endMonth}
                            onChange={(endMonth) => {
                                props.setInputs({
                                    ...props.inputs,
                                    "endMonth": endMonth
                                })
                                setEndMonth(endMonth)
                            }}
                        />
                    </div>                    
                </div>
            </div>
            
        </>
    );
}