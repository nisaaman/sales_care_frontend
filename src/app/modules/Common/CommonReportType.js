import React, { useEffect } from 'react';

export default function CommonReportType(props) {

    useEffect(() => {
        document.getElementById('sum-checkbox-id').classList.add('d-none')
        document.getElementById('sum-level-id').classList.add('d-none')
    }, []);

    const handleChange = (event) => {
        if(event.target.value === "DETAILS"){
            document.getElementById('sum-checkbox-id').classList.remove('d-none')
            document.getElementById('sum-level-id').classList.remove('d-none')
            props.setReportType(event.target.value)
        }else{
            document.getElementById('sum-checkbox-id').classList.add('d-none')
            document.getElementById('sum-level-id').classList.add('d-none')
            props.setReportType(event.target.value)
        }
        
    }

    const handleCheckbox = (event) => {
        props.setWithSum(event.target.checked)
    }

    return (
        <>
            <div className='row'>
                <div className='form-group col-lg-8 first-level-top'>
                    <div>
                        <label className='level-title'><span
                            className="mr-1">Report Type</span><span
                                className="text-danger ">*</span></label>
                        <div className='d-flex'>
                        <select className="form-control mr-5" id="reportType" name="reportType" onChange={handleChange}>
                            <option value="">Select Report Type</option>
                            <option value="SUMMARY">By Summary</option>
                            <option value="DETAILS">By Details</option>
                        </select>
                        <input id = "sum-checkbox-id" className='form-group mt-4 mr-3 d-none' type='checkbox' onChange={handleCheckbox} />
                        <label id = "sum-level-id" className='level-title mt-3 d-none'>With Sub-Total</label>
                        </div>
                    </div>
                    <div></div>
                </div>
            </div>
        </>
    );
}