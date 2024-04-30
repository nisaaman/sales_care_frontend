import React, {useEffect, useState} from "react";
import SVG from "react-inlinesvg";
import {toAbsoluteUrl} from "../../../../../../../_metronic/_helpers";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import {Card, CardBody} from "../../../../../../../_metronic/_partials/controls";
import OrdOverdueSetupBreadCrum from "../../common/OrdOverdueSetupBreadCrum";
import OrdOverdueSetupHeader from "../../common/OrdOverdueSetupHeader";
import {useHistory} from "react-router-dom";
import axios from "axios";

export default function OverDueList() {
    const history = useHistory();
    const [overdueList, setOverdueList] = useState([]);


    useEffect(() => {
        document.getElementById('pills-configure-overdue-setup-tab').classList.add('active')
    }, []);

    const handleAddNewOverdue = () => {
        history.push("/salescollection/configure/ord-overdue-setup/ord-list-overdue-add");
    }

    const onChangeHeaderSearchInputs = (searchParams) => {
        if (searchParams.companyId === undefined || searchParams.companyId === '') {
            setOverdueList([]);
        } else {
            getCompanyWiseOverdueList(searchParams.companyId);
        }
    }

    const getCompanyWiseOverdueList = (companyId) => {
        const URL = `${process.env.REACT_APP_API_URL}/api/invoice-overdue/get-all/` + companyId;
        axios.get(URL).then(response => {
            if (response.data.success === true && response.data.data.length > 0) {
                // !! Always come two row, cash row and credit row. invoiceNatureId = 2/cash and 1/Credit
                let odList = response.data.data;
                let overdue = {};
                if (odList[0].invoiceNature.id === 2) { // 2 = cash
                    overdue.cash = odList[0];
                    overdue.credit = odList[1];
                } else {
                    overdue.cash = odList[1];
                    overdue.credit = odList[0];
                }
                setOverdueList([overdue]);
            } else {
                setOverdueList([]);
            }
        });
    }

    const handleEdit = (params) => {
        history.push({'pathname': '/salescollection/configure/ord-overdue-setup/ord-list-overdue-add', state: {params}});
    }

    return (
        <>
            {/* BREADCRUM ROW */}
            <div>
                <OrdOverdueSetupBreadCrum/>
                <OrdOverdueSetupHeader onChangeSearchInputs={onChangeHeaderSearchInputs}/>
            </div>

            {/* NEW OVER DUE ADD ROW */}
            <div className="d-flex justify-content-between ord-add-div">
                <div className="mt-2">
                    <span><strong>Overdue/Not Due will be applicable on Credit and Cash Sales Only during Payment Receive Approval.</strong></span>
                </div>
                <div>
                    <button className="add-to-ord-setup text-white mt-1" onClick={handleAddNewOverdue}>
                        <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/more.svg")} width="15px"
                             height="15px"/>&nbsp;
                        New Overdue Setup
                    </button>
                </div>
            </div>

            {/* NEW OVER DUE ADD ROW */}

            {overdueList.map((data, index) => (
                <div className="mt-5" key={index}>
                    <Card>
                        <CardBody>
                            {/* TITLE ROW */}
                            <div className="row">
                                <div className="col-xl-6 d-flex fiscal-year-left-side-row-title">
                                    <div>
                                    <span className="fiscal-year-title mr-5" style={{color: "rgba(235, 87, 87, 0.7)"}}
                                    >{data.cash.company.name}</span>
                                    </div>
                                    <div className="card-div-icon dark-gray-color edit-icon mr-5" title="Edit"
                                         style={{marginLeft: "10px"}} data-toggle="tooltip" data-placement="bottom"
                                         onClick={() => handleEdit(data)}>
                                        <SVG className="pen-edit-icon"
                                             src={toAbsoluteUrl("/media/svg/icons/project-svg/eva_edit.svg")}
                                             data-toggle="tooltip" data-placement="bottom" title="Edit"/>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-xl-6">
                                    <div className="mt-5">
                                        <span className="text-primary">{data.cash.startDay}</span>
                                        <span className="text-primary float-right mr-5">{data.cash.endDay}</span>
                                        <br/>
                                        <div className="time-lile-list-progressbar-blue">
                                            <span>{'Cash Sales Overdue(Above ' + data.cash.notDueDays + ' Days)'}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-6">
                                    <div className="mt-5">
                                        <span className="text-primary">{data.credit.startDay}</span>
                                        <span className="text-primary float-right mr-5">{data.credit.endDay}</span>
                                        <br/>
                                        <div className="time-lile-list-progressbar-purple">
                                            <span>{'Credit Sales Overdue(Above ' + data.credit.notDueDays + ' Days)'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            ))}
        </>
    )
}
