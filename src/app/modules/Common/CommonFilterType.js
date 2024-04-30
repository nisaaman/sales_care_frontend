import React, { useEffect, useState } from 'react';

export default function CommonFilterType(props) {

    const allFilterTypeList = [
        { value: "SO", label: "SO" },
        { value: "DIS", label: "Distributor" },
        { value: "TERRITORY", label: "Territory" }    
    ];
    //const [allFilterType, setAllFilterType] = useState("");

    useEffect(() => {
        document.getElementById('sum-checkbox-id').classList.add('d-none')
        document.getElementById('sum-level-id').classList.add('d-none')
    }, []);

    const handleChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;
        if (name === 'allFilterType') {
            props.setAllFilterType(value);
        }        
    }

    return (
        <>
            <div style={{ margin: '1px' }}>
                <select id="allFilterType" className='form-control' name="allFilterType"
                    onChange={handleChange}>
                    <option value="">Filter Type</option>
                    {allFilterTypeList.map((allFilterTypeList) => (
                            <option key={allFilterTypeList.label} value={allFilterTypeList.value}>{allFilterTypeList.label}</option>
                        ))}
                </select>
            </div>
        </>
    );
}