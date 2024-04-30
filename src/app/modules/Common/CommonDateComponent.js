import React, { useEffect, useState } from 'react';
import { showError } from "../../pages/Alert";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_green.css";
import moment from "moment";
// Datepicker
import DatePicker from "react-datepicker";

export default function CommonDateComponent(props) {
    const currentDate = new Date();
    let currentYear = currentDate.getFullYear();
    const [startMonth, setStartMonth] = useState(new Date());
    const [endMonth, setEndMonth] = useState(new Date());

    useEffect(() => {
        document.getElementById('fromToyear').style.display = "none";
        document.getElementById('month').style.display = "none";
        document.getElementById('date').style.display = "block";
        document.getElementById('Date').checked = true;
        props.setType('Date')
    }, []);

    const handleChange = (event) => {
        // if (event.target.id === "endMonth") {
        //     if (event.target.value < props.inputs.startMonth) {
        //         document.getElementById('endMonth').value = ""
        //         showError("End Month should be greater than Start Month");
        //         return false;
        //     }else{
        //         let name = event.target.id;
        //         let value = event.target.value;
        //         props.setInputs(values => ({ ...values, [name]: value }))
        //     }
        // }else if (event.target.id === "startMonth") {
        //     if (props.inputs.endMonth < event.target.value) {
        //         document.getElementById('startMonth').value = ""
        //         showError("Start Month should be less than End Month");
        //         return false;
        //     }else{
        //         let name = event.target.id;
        //         let value = event.target.value;
        //         props.setInputs(values => ({ ...values, [name]: value }))
        //     }
        // }else {
        //     let name = event.target.id;
        //     let value = event.target.value;
        //     props.setInputs(values => ({ ...values, [name]: value }))
        // }
        let name = event.target.id;
        let value = event.target.value;
        props.setInputs(values => ({ ...values, [name]: value }))

    }
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
                document.getElementById('fromToyear').style.display = "none";
                document.getElementById('month').style.display = "none";
            } else if (e.target.id === "Month") {
                props.setInputs({})
                props.setType(e.target.id)
                getRadioId.checked = true;
                document.getElementById('date').style.display = "none";
                document.getElementById('fromToyear').style.display = "none";
                document.getElementById('month').style.display = "block";
            } else {
                props.setInputs({})
                props.setType(e.target.id)
                getRadioId.checked = true;
                document.getElementById('month').style.display = "none";
                document.getElementById('date').style.display = "none";
                document.getElementById('fromToyear').style.display = "block";
            }

        }
    }
    const handleYear = (e) => {
        if (e.target.id === "fromYear") {
            let text = e.target.value;
            if (text.match(/^\d{5}$/)) {
                showError('Please type 4 digits of year');
                document.getElementById('fromYear').value = '';
                return false;
            }
        } else {
            let text = e.target.value;
            if (text.match(/^\d{5}$/)) {
                showError('Please type 4 digits of year');
                document.getElementById('toYear').value = '';
                return false;
            }
        }
        let name = e.target.name;
        let value = e.target.value;
        props.setInputs(values => ({ ...values, [name]: value }))
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
                <div className='col-xl-3'>
                    <input className="all-radio mr-5" type="radio" name="year" id="Year" onClick={(e) => handleSelectTypeRange(e)} />
                    <label className='level-title'>Year</label>
                </div>
            </div>
            <div id="date">
                <div className='mt-5 row'>
                    <div className='form-group col-lg-8'>
                        <label className='level-title'>Start Date</label>
                        {/* <input
                            type="text"
                            className='form-control'
                            id="startDate"
                            name="startDate"
                            value={props.inputs.startDate || ""}
                            placeholder="dd/mm/yyyy"
                            onChange={handleChange}
                            onFocus={(e) => (e.target.type = type)}
                        /> */}
                        <Flatpickr className="form-control date" id="startDate"
                            name="startDate" placeholder="dd-MM-yyyy"
                            value={props.inputs.startDate ? moment(props.inputs.startDate, "YYYY-MM-DD").format("DD-MMM-YYYY") : ''}
                            options={{ dateFormat: "d-M-Y" }}
                            onChange={(value) => {
                                // if (props.inputs.endDate < moment(new Date(value)).format("YYYY-MM-DD")) {
                                //     document.getElementById('startDate').value = ""
                                //     showError("Start Date should be less than End Date");
                                //     return false;
                                // } else {
                                //     props.setInputs({
                                //         ...props.inputs,
                                //         "startDate": moment(new Date(value)).format("YYYY-MM-DD")
                                //     })
                                // }
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
                                // if (moment(new Date(value)).format("YYYY-MM-DD") < props.inputs.startDate) {
                                //     document.getElementById('endDate').value = ""
                                //     showError("End Date should be greater than Start Date");
                                //     return false;
                                // } else {
                                //     props.setInputs({
                                //         ...props.inputs,
                                //         "endDate": moment(new Date(value)).format("YYYY-MM-DD")
                                //     })
                                // }
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
                    {/* <div className='form-group col-lg-8'>
                        <label className='level-title'>Start Month</label>
                        <input
                            type="text"
                            className='form-control'
                            id="startMonth"
                            name="startMonth"
                            value={props.inputs.startMonth || ""}
                            placeholder="January 2023"
                            onChange={handleChange}
                            onFocus={(e) => (e.target.type = props.type)}
                        />
                    </div>
                </div>
                <div className='mt-5 row'>
                    <div className='form-group col-lg-8'>
                        <label className='level-title'>End Month</label>
                        <input
                            type="text"
                            className='form-control'
                            id="endMonth"
                            name="endMonth"
                            value={props.inputs.endMonth || ""}
                            placeholder="March 2023"
                            onChange={handleChange}
                            onFocus={(e) => (e.target.type = props.type)}
                        />
                    </div> */}
                </div>
            </div>

            <div id="fromToyear">
                <div className='mt-5 row'>
                    <div className="form-group col-lg-8">
                        <label className='level-title'>Start Year</label>
                        <input className='form-control' placeholder="2023" type="number" id="fromYear"
                            name="fromYear" min="1900" max={currentYear}
                            value={props.inputs.fromYear || ""}
                            onChange={(e) => handleYear(e)} />
                    </div>
                </div>
                <div className='mt-5 row'>
                    <div className='form-group col-lg-8'>
                        <label className='level-title'>End Year</label>
                        <input className='form-control' placeholder="2025" type="number" id="toYear"
                            value={props.inputs.toYear || ""}
                            name="toYear" min="1900" max={currentYear} onChange={(e) => handleYear(e)} />
                    </div>
                </div>
            </div>
        </>
    );
}