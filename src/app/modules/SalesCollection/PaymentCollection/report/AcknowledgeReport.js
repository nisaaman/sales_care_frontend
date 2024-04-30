import React, { useEffect, useState } from 'react';
import { Card, CardBody } from "../../../../../_metronic/_partials/controls";
import { shallowEqual, useSelector } from "react-redux";
import CollectionBreadCrum from '../common/CollectionBreadCrum';
import CollectionTodaySales from "../common/CollectionTodaySales";
import Button from '@material-ui/core/Button';
import CommonDateComponent from '../../../Common/CommonDateComponent';
import axios from "axios";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { TextField } from "@material-ui/core";
import ReportSubTabs from '../common/ReportSubTabs';
import { showError } from "../../../../pages/Alert";
import moment from "moment";

export function AcknowledgeReport(props) {
    const companyId = useSelector((state) => state.auth.company, shallowEqual);
    const userId = useSelector((state) => state.auth.user.userId, shallowEqual);
    const [distributors, setDistributors] = useState([]);
    const [distributor, setDistributor] = useState({});

    // DATE COMPONENT USE STATE
    const [inputsDate, setInputsDate] = useState({});
    const [dateType, setDateType] = useState("");

    useEffect(() => {
        document.getElementById('pills-payment-collection-reports-tab').classList.add('active');
        document.getElementById('pills-acknowledge-report-tab').classList.add('active');
        //setDistributor({})
    }, []);

    useEffect(() => {
        getAllDistributorList(userId, companyId)
    }, [userId, companyId]);

    const getAllDistributorList = (userId, companyId) => {
        const URL = `${process.env.REACT_APP_API_URL}/api/distributor/get-distributor-without-credit-limit/${companyId}/`;
        axios.get(URL).then(response => {
            setDistributors(response.data.data);
        });
    }

    const handleChangeDistributor = (row) => {
        setDistributor(row)
    }

    const getParamsDate = () => {
        let startDate = '';
        let endDate = '';
        if (dateType === 'Date') {
            startDate = inputsDate.startDate === undefined || inputsDate.startDate === null || inputsDate.startDate === '' ? '' : inputsDate.startDate;   // 2023-03-01  yyyy-mm-dd
            endDate = inputsDate.endDate === undefined || inputsDate.endDate === null || inputsDate.endDate === '' ? '' : inputsDate.endDate;   // 2023-03-01  yyyy-mm-dd
        } else if (dateType === 'Month') {
            let startY = inputsDate.startMonth.getFullYear();
            let startM = inputsDate.startMonth.getMonth() + 1;
            startM = startM<9 ? startM = '0'+startM : startM;
            let endY = inputsDate.endMonth.getFullYear();
            let endM = inputsDate.endMonth.getMonth() + 1;
            endM = endM<9 ? endM = '0'+endM : endM;
            let lastDay = new Date(endY, endM, 0).getDate()
            startDate = inputsDate.startMonth === undefined || inputsDate.startMonth === null || inputsDate.startMonth === '' ? '' : (startY+'-'+startM + '-01');
            endDate = inputsDate.endMonth === undefined || inputsDate.endMonth === null || inputsDate.endMonth === '' ? '' : (endY+'-'+endM + '-'+lastDay);
        } else if (dateType === 'Year') {
            startDate = inputsDate.fromYear === undefined || inputsDate.fromYear === null || inputsDate.fromYear === '' ? '' : (inputsDate.fromYear + '-01-01');
            endDate = inputsDate.toYear === undefined || inputsDate.toYear === null || inputsDate.toYear === '' ? '' : (inputsDate.toYear + '-12-31');
        }
        return { startDate: startDate, endDate: endDate };
    }

    const validate = () => {
        let dates = getParamsDate();
        let startDate = dates.startDate;
        let endDate = dates.endDate;

        if (Object.keys(distributor || {}).length === 0) {
            showError('Please Select Distributor!');
            return false;
        }
        if (endDate < startDate) {
            showError(`End ${dateType} should be greater than Start ${dateType}.`);
            return false;
         }
        return true;
    }

    const handleDownloadChange = () => {
        if (!validate()) {
            return false;
        }
        let dates = getParamsDate();
        let startDate = dates.startDate;
        let endDate = dates.endDate;

        let queryParams = '?companyId=' + companyId;
        queryParams += '&distributorId=' + distributor.distributorId;
        queryParams += '&startDate=' + startDate;
        queryParams += '&endDate=' + endDate;
        queryParams += '&dateType=' + dateType;
        
        const URL = `${process.env.REACT_APP_API_URL}/api/reports/acknowledged-invoice-report` + queryParams;
        axios.get(URL, { responseType: 'blob' }).then(response => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            console.log(response.data)
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', "AcknowledgedInvoiceReport.pdf");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        }).catch(err => {
            showError();
        });
    }

    return (
        <>
            {/* BREAD CRUM ROW */}
            <CollectionBreadCrum />
            {/* TODAY SALE ROW */}
            <CollectionTodaySales />

            <div>
                <ReportSubTabs />
            </div>

            <div>
                <Card>
                    <CardBody>

                        <div className='row'>
                            <div className='col-xl-6'>
                                {/* DATE COMPONENT */}
                                <CommonDateComponent
                                    inputs={inputsDate}
                                    setInputs={setInputsDate}
                                    type={dateType}
                                    setType={setDateType}
                                />
                                <div>
                                    <Autocomplete
                                        id="distributorId"
                                        name="distributorId"
                                        options={distributors}
                                        getOptionLabel={(option) => option.distributorName}
                                        onChange={(event, newValue) => {
                                            handleChangeDistributor(newValue)
                                        }}
                                        renderInput={(params) => (
                                            <TextField {...params} label="Select Distributor*" />
                                        )}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="float-right">
                            <Button className="mt-5" id="gotItBtn" variant="contained" color="primary" onClick={handleDownloadChange}>
                                Download
                            </Button>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </>
    );
}