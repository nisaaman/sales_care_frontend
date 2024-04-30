import React, {useEffect, useState} from "react";
import {Card, CardBody} from "../../../../../../_metronic/_partials/controls";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import IOSSwitch from '../../../../../pages/IOSSwitch';
import SVG from "react-inlinesvg";
import {toAbsoluteUrl} from "../../../../../../_metronic/_helpers";
import TimeLineSetupBreadCrum from "../common/TimeLineSetupBreadCrum";
import axios from "axios";
import {useIntl} from "react-intl";
import {useHistory} from "react-router-dom";
import moment from "moment";

export default function TimeLineList() {
    const history = useHistory();
    const intl = useIntl();
    const [fiscalYearList, setFiscalYearList] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [searchInputs, setSearchInputs] = useState({});
    const [currentFiscalYear, setCurrentFiscalYear] = useState({});
    const [currentSemester, setCurrentSemester] = useState({});
    const semesterProgressbarColorList = ['blue', 'yellow', 'purple'];

    useEffect(() => {
        getAllCompaniesByOrganization();

    }, []);

    useEffect(() => {
        if (searchInputs.companyId === '' || searchInputs.companyId === undefined) {
            setCompanies([]);
            setCurrentFiscalYear({});
            setCurrentSemester({});
        } else {
            getFiscalYearList(searchInputs.companyId);
        }
    }, [searchInputs]);

    const handleAddNewTimeLine = () => {
        history.push("/salescollection/configure/time-line-setup/list-add")
    }

    const getCurrentFiscalYear = (list) => {
        var now = moment(new Date()); //todays date
        let exist = false;
        for (let i = 0; i < list.length; i++) {
            let start = moment(list[i].fiscal_year_start_date); // another date
            let end = moment(list[i].fiscal_year_end_date); // another date
            let startDays = moment.duration(start.diff(now)).asDays();
            let endDays = moment.duration(end.diff(now)).asDays();
            if (startDays <= 0 && endDays >= 0) {
                let totalDays = moment.duration(end.diff(start)).asDays();
                let progress = Math.floor(((totalDays - endDays) / totalDays) * 100);
                setCurrentFiscalYear({...list[i], progress: progress});
                getCurrentSemester(list[i].semesterList);
                exist = true;
                break;
            }
        }
        if (!exist) {
            setCurrentFiscalYear({});
        }
    }

    const getCurrentSemester = (list) => {
        var now = moment(new Date()); //todays date
        let exist = false;
        for (let i = 0; i < list.length; i++) {
            let start = moment(list[i].semester_start_date); // another date
            let end = moment(list[i].semester_end_date); // another date
            let startDays = moment.duration(start.diff(now)).asDays();
            let endDays = moment.duration(end.diff(now)).asDays();
            if (startDays <= 0 && endDays >= 0) {
                exist = true;
                setCurrentSemester(list[i]);
                break;
            }
        }
        if (!exist) {
            setCurrentSemester({});
        }
    }

    const getFiscalYearList = (companyId) => {
        const URL = `${process.env.REACT_APP_API_URL}/api/accounting-year/get-all-with-semester/` + companyId;
        axios.get(URL).then(response => {
            if (response.data.success === true) {
                setFiscalYearList(response.data.data);
                getCurrentFiscalYear(response.data.data);
            }
        }).catch(err => {
            console.log(err);
        });
    }

    const getAllCompaniesByOrganization = () => {
        const URL = `${process.env.REACT_APP_API_URL}/api/organization/companies-by-login-user-organization`;
        axios.get(URL).then(response => {
            setCompanies(response.data.data);
        });
    }

    const handleChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;
        setSearchInputs(values => ({...values, [name]: value}));
    }

    const editFiscalYear = (row) => {
        history.push({'pathname': '/salescollection/configure/time-line-setup/list-add', state: {row}})
    }

    return (<>
        {/* BREADCRUM ROW */}
        <div>
            <TimeLineSetupBreadCrum/>
            {/*TimeLineSetupHeader*/}
            <>
                {/* TODAY SALE ROW */}
                <div className="mt-3">
                    <Card>
                        <CardBody>
                            <div className="row">
                                <div className="col-xl-6">
                                    <p className="create-field-title">{intl.formatMessage({id: "COMMON.TIME_LINE_SETUP"})}</p>
                                </div>

                                <div className="col-xl-6 d-flex justify-content-end">
                                    <div className="mr-3 mt-3" style={{color: "rgb(130, 130, 130)"}}>
                                        <label>{intl.formatMessage({id: "COMMON.COMPANY"})}</label>
                                    </div>
                                    <div className="create-field-title mr-5">
                                        <select placeholder='Ex. Bangladesh Islami Bank' id="company"
                                                className='form-control'
                                                name="companyId" value={searchInputs.companyId || ""}
                                                onChange={handleChange}>
                                            <option value="">Select Company</option>
                                            {companies.map((c) => (
                                                <option key={c.id} value={c.id}>
                                                    {c.shortName + '-' + c.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="create-field-title">
                                        <button type="button" className="btn btn-gradient-blue" data-toggle="tooltip"
                                                data-placement="bottom" title="Add New Timeline"
                                                style={{color: "white"}} onClick={handleAddNewTimeLine}>
                                            <SVG
                                                className="svg-icon svg-icon-md svg-icon-primary"
                                                src={toAbsoluteUrl("/media/svg/icons/project-svg/add-year.svg")}
                                            />Add New Timeline
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <span
                                    className="text-muted">{currentSemester.semester_name ? "Current " + currentSemester.semester_name : "No Current Semester"}</span>
                                <span className="text-muted">|&nbsp;</span>
                                <span
                                    className="text-muted">{currentFiscalYear.fiscal_year_name ? currentFiscalYear.fiscal_year_name : "No Current Fiscal Year"}</span>
                            </div>

                            <div className="mt-5">
                            <span>
                                <SVG
                                    className="svg-icon svg-icon-md svg-icon-primary"
                                    src={toAbsoluteUrl("/media/svg/icons/project-svg/start-time.svg")}
                                    style={{marginTop: "-4px"}}
                                />&nbsp;
                                <strong>{currentFiscalYear.fiscal_year_start_date ? moment(currentFiscalYear.fiscal_year_start_date).format('DD MMMM YYYY') : "No Date"}&nbsp;</strong>
                                <span className="text-muted">Start</span>
                            </span>
                                <span className="float-right">
                                <SVG
                                    className="svg-icon svg-icon-md svg-icon-primary"
                                    src={toAbsoluteUrl("/media/svg/icons/project-svg/end-time.svg")}
                                    style={{marginTop: "-4px"}}
                                />&nbsp;
                                    <strong>{currentFiscalYear.fiscal_year_end_date ? moment(currentFiscalYear.fiscal_year_end_date).format('DD MMMM YYYY') : "No Date"}&nbsp;</strong>
                                <span className="text-muted">End</span>
                            </span>
                            </div>

                            <div className="distributor-progress mt-5">
                                <div className="progress">
                                    <div className="progress-bar" role="progressbar"
                                         style={{width: (currentFiscalYear.progress ? currentFiscalYear.progress : 0) + "%"}}
                                         aria-valuenow="30" aria-valuemin="0" aria-valuemax="100"></div>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </>

        </div>
        {/* TIME LINE LIST VIE ROW */}
        {fiscalYearList.map((fiscalYear, index) => (<div key={index}>
            <Card>
                <CardBody>
                    {/* TITLE ROW */}
                    <div className="row">
                        <div className="col-xl-6 d-flex fiscal-year-left-side-row-title">
                            <div>
                                <span className="fiscal-year-title">{fiscalYear.fiscal_year_name}</span>
                            </div>
                            <div
                                className="card-div-icon dark-gray-color edit-icon"
                                style={{marginLeft: "10px"}}
                                onClick={() => editFiscalYear(fiscalYear.id)}
                                data-toggle="tooltip" data-placement="bottom" title="Edit"
                                hidden={fiscalYear.status === 'not_started' ? false : true}
                            >
                                <SVG
                                    className="pen-edit-icon"
                                    src={toAbsoluteUrl("/media/svg/icons/project-svg/eva_edit.svg")}
                                    data-toggle="tooltip" data-placement="bottom" title="Edit"/>
                            </div>
                            <div className="mt-1 ml-5">
                                <span
                                    className="daysCount mr-3">{fiscalYear.fiscal_year_days > 1 ? fiscalYear.fiscal_year_days + " Days" : fiscalYear.fiscal_year_days + " Day"}</span>
                                <span className="text-muted">{fiscalYear.start_date_formated + " - "}</span>
                                <span className="text-muted">{fiscalYear.end_date_formated}</span>
                            </div>
                        </div>
                        <div className="col-xl-6">
                            <div className="float-right">
                                <div style={{marginLeft: "10px", marginTop: "-8px"}}>
                                    <FormControlLabel
                                        label={fiscalYear.status === 'not_started' ? 'Not Start Yet' : fiscalYear.status === 'current' ? 'Current' : 'Expired'}
                                        labelPlacement="start"
                                        control={<IOSSwitch
                                            checked={fiscalYear.status === 'current' ? true : false}/>}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* PROGRESSBAR ROW */}
                    <div className="row">
                        {fiscalYear.semesterList.map((semester, i) => (<div className="col-xl" key={i}>
                            <span className="text-muted">{semester.semester_start_date}</span>
                            <span
                                className="text-muted float-right mr-5">{semester.semester_end_date}</span><br/>
                            <div
                                className={"mt-5 time-lile-list-progressbar-" + semesterProgressbarColorList[i % semesterProgressbarColorList.length]}>
                                <span>{semester.semester_name}</span>
                            </div>
                        </div>))}
                    </div>
                </CardBody>
            </Card>
        </div>))}

    </>)
}