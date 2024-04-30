
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function CommonTimeLine(props) {
    const [allAccountingYear, setAllAccountingYear] = useState([]);

    useEffect(() => {
        getAccountingYear(props.companyIdPass)
    }, [props.companyIdPass]);

    const getAccountingYear = (companyId) => {
        const URL = `${process.env.REACT_APP_API_URL}/api/accounting-year/companyWise/${companyId}`;
        if (companyId) {
          
        axios.get(URL).then(response => {
            setAllAccountingYear(response.data.data);
        }).catch(err => {
            //showError(intl.formatMessage({ id: "COMMON.ERROR_STATUS" }));
        });  
        }
    }
    const handleChange = (event) =>{
        props.setAccountingYearId(Number(event.target.value))
    }
    return (
        <>
            <div className="mt-5 first-level-top row">
               <div className="form-group col-lg-8">
               <label className='level-title'><span className="mr-1">Timeline</span><span className="text-danger">*</span></label>
                <select className="form-control" name="fiscalYearId" onChange={handleChange}>
                    <option value="" selected>Select Fiscal Year</option>
                    {allAccountingYear.map((accYear) => (
                        <option key={accYear.fiscalYearName} value={accYear.id}>
                            {accYear.fiscalYearName}
                        </option>
                    ))}
                </select>
               </div>
            </div>
        </>);
}