import React, {useState, useEffect} from "react";
import {Card, CardBody} from "../../../../../../../_metronic/_partials/controls";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import IOSSwitch from '../../../../../../pages/IOSSwitch';
import SVG from "react-inlinesvg";
import {toAbsoluteUrl} from "../../../../../../../_metronic/_helpers";
import OrdOverdueSetupBreadCrum from "../../common/OrdOverdueSetupBreadCrum";
import OrdOverdueSetupHeader from "../../common/OrdOverdueSetupHeader";
import {useHistory} from "react-router-dom";
import axios from "axios";

export default function ORDList() {
    const history = useHistory();
    const [semesterList, setSemesterList] = useState([]);

    useEffect(() => {
        document.getElementById('pills-configure-ord-setup-tab').classList.add('active')
    }, []);

    const handleAddNewORD = () => {
        history.push("/salescollection/configure/ord-overdue-setup/ord-list-add")
    }

    const onChangeHeaderSearchInputs = (searchParams) => {
        if (searchParams.companyId === undefined || searchParams.companyId === '') {
            setSemesterList([]);
        } else {
            getOrdRelatedSemesterList(searchParams.companyId);
        }
    }

    const getOrdRelatedSemesterList = (companyId) => {
        const URL = `${process.env.REACT_APP_API_URL}/api/overriding-discount/get-list-with-related-info/` + companyId;
        axios.get(URL).then(response => {
            if (response.data.success === true) {
                setSemesterList(response.data.data);
            }
        });
    }

    const handleEditORD = (params) => {
        history.push({'pathname': '/salescollection/configure/ord-overdue-setup/ord-list-add', state: {params}});
    }

    return (
        <>
            {/* BREADCRUM ROW */}
            <div>
                <OrdOverdueSetupBreadCrum/>
                <OrdOverdueSetupHeader onChangeSearchInputs={onChangeHeaderSearchInputs}/>
            </div>

            {/* NEW ORD SETUP ROW */}
            <div className="ord-add-div row">
                <div className="col-9">
                    <span><strong>Overriding Discount Setup (ORD)/ Commission will be applicable on Credit Sales Only during Payment Receive Approval.</strong></span>
                </div>
                <div className="col-3 float-right">
                    <button className="float-right add-to-ord-setup text-white" onClick={handleAddNewORD}>
                        <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/more.svg")} width="15px"
                             height="15px"/>&nbsp;
                        New ORD Setup
                    </button>
                </div>
            </div>

            {/* FISCAL YEAR LIST VIEW ROW */}
            {semesterList.map((semester, index) => (
                <div key={index} className="mt-5">
                    <Card>
                        <CardBody>
                            {/* TITLE ROW */}
                            <div className="row">
                                <div className="col-xl-6 d-flex fiscal-year-left-side-row-title">
                                    <div>
                                        <span className="fiscal-year-title mr-5" style={
                                            semester.status === "NOT_START_YET" ? {color: "rgba(235, 87, 87, 0.7)"} : semester.status === "CURRENT" ? {color: "#27AE60"} : {color: ""}
                                        }
                                        >{semester.fiscal_year_name}</span>
                                    </div>
                                    <div className="mt-1">
                                        <span className="daysCount mr-5">{semester.semester_name} </span>
                                    </div>
                                    <div className="mt-1">
                                        <span className="daysCount mr-3">{semester.semester_days + ' Days'}</span>
                                        <span className="text-muted">{semester.semester_start_date + " - "}</span>
                                        <span className="text-muted">{semester.semester_end_date}</span>
                                    </div>

                                </div>
                                <div className="col-xl-6">
                                    <div className="float-right">
                                        <div style={{marginLeft: "10px", marginTop: "-8px"}}>
                                            <FormControlLabel
                                                label={semester.status === "EXPIRED" ? 'Expired' : semester.status === "CURRENT" ? 'Current' : 'Not Start Yet'}
                                                labelPlacement="start"
                                                control={<IOSSwitch
                                                    checked={semester.status === "CURRENT" ? true : false}/>}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* CREDIT PROGRESSBAR ROW */}
                            {semester.invoice_list.map((invoiceNature, index) => (
                                <div key={index}>
                                    <div className="mt-5 dark-blue-color">
                                        <label>{invoiceNature.invoice_nature_name}</label>
                                        <span
                                            className="card-div-icon dark-gray-color edit-icon mr-5"
                                            style={{marginLeft: "10px"}}
                                            data-toggle="tooltip" data-placement="bottom" title="Edit"
                                            onClick={() => handleEditORD(invoiceNature)}
                                            hidden={semester.status === 'NOT_START_YET' ? false : true}
                                        >
                                            <SVG
                                                className="pen-edit-icon"
                                                src={toAbsoluteUrl("/media/svg/icons/project-svg/eva_edit.svg")}
                                                data-toggle="tooltip" data-placement="bottom" title="Edit"/>
                                        </span>
                                    </div>
                                    {invoiceNature.ordList.map((ord, index) => (
                                        <div key={index} className="mt-5 display-inline-block">
                                            <span className="text-muted">{ord.from_day}</span>
                                            <span className="text-muted float-right mr-5">{ord.to_day}</span>
                                            <br/>
                                            <div className="time-lile-list-progressbar-blue display-inline-block mt-5">
                                                <span>ORD {ord.ord + ord.calculation_type}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </CardBody>
                    </Card>
                </div>
            ))}

        </>
    )
}
