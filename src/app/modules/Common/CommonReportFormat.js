
import React from "react";

export default function CommonReportFormat(props) {
    const handleChange = (event) => {
        props.setReportFormat(event.target.value)
    }
    return (
        <>
            <div className="mt-5 first-level-top row">
                <div className="form-group col-lg-8">
                    <label className='level-title'><span className="mr-1">Report Format</span></label>
                    <select className="form-control" id="reportFormat" name="reportFormat" onChange={handleChange}>
                        <option value="">Select Report Format</option>
                        <option value="PDF">Pdf</option>
                        <option value="EXCEL">Excel</option>
                    </select>
                </div>
            </div>
        </>);
}