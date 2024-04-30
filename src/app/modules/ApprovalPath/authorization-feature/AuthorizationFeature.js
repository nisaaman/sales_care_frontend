import { Card } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { CardBody } from "../../../../_metronic/_partials/controls";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../_metronic/_helpers";
import ApprovalPathBreadCrum from "../bread-crum/ApprovalPathBreadCrum";
import { showError, showSuccess } from "../../../pages/Alert"
import { useHistory } from "react-router-dom"
import axios from "axios";
export default function AuthorizationFeature(props) {
    let history = useHistory();
    const [company, setCompany] = useState([]);
    const [approvalFeatureList, setApprovalFeatureList] = useState([]);
    const [approvalList, setApprovalList] = useState([]);
    const [companyId, setCompanyId] = useState("");
    const [approvalFeature, setApprovalFeature] = useState("");
    const [data, setData] = useState("");

    const [approvalObj, setApprovalObj] = useState([
        {
            id: '',
            approvalName: '',
            approvalStepId: '',
            level: '',
        },
    ]);
    const addApprovalFields = (i) => {
        setApprovalObj([...approvalObj, {
            id: '',
            approvalName: '',
            approvalStepId: '',
            level: '',
        }])
    }
    useEffect(() => {
        getCompanyList();
        getAllApprovalFeature();
        getAllApprovalStep();
        if (props.location.state !== undefined) {
            //console.log(props.location.state.data);
            setData(props.location.state.data);
            setAuthorizationFeatureForUpdate(props.location.state.data);
        }
    }, [])
    const setAuthorizationFeatureForUpdate = (data) => {
        document.getElementById("companyId").disabled = true;
        document.getElementById("featureId").disabled = true;
        let tempArray = [];
        const URL = `${process.env.REACT_APP_API_URL}/api/approval-step-feature-map/get-all-by-company-id-and-approval-feature/${data.companyId}/${data.feature}`;
        axios.get(URL).then(response => {
            if (response.data.success === true) {

                if (response.data.data.length > 0) {

                    for (let i = 0; i < response.data.data.length; i++) {
                        tempArray.push({
                            id: '',
                            approvalName: response.data.data[i].approvalStep.name,
                            approvalStepId: response.data.data[i].approvalStep.id,
                            level: i,
                        })
                    }
                    setApprovalObj(tempArray);
                }

            } else {
                showError(response.data.message);
            }
        }).catch(err => {
            showError(err);
        });
        setCompanyId(data.companyId);
        setApprovalFeature(data.feature);
        //setApprovalObj();
    }

    const getCompanyList = () => {
        const URL = `${process.env.REACT_APP_API_URL}/api/organization/companies-by-login-user-organization`;
        axios.get(URL).then(response => {
            setCompany(response.data.data);
        });
    }
    const getAllApprovalFeature = () => {
        const URL = `${process.env.REACT_APP_API_URL}/api/constants/approval-feature`;
        axios.get(URL).then(response => {
            //console.log(response.data)
            setApprovalFeatureList(response.data.data)
        });
    }
    const getAllApprovalStep = () => {
        const URL = `${process.env.REACT_APP_API_URL}/api/approval-step`;
        axios.get(URL).then(response => {
            //console.log(response.data.data)
            setApprovalList(response.data.data)
        });
    }

    const removeApproval = (i) => {
        let newFormValues = [...approvalObj];
        newFormValues.splice(i, 1);
        newFormValues.map((obj, index) => {
            obj.level = index;
        })
        setApprovalObj(newFormValues)

    }
    const handleBackToListPage = () => {
        history.push('/approval-path/authorization-feature');
    }

    const handleCompanyChange = (e, i) => {
        const companyId = e.target.value;
        setCompanyId(companyId);
    }
    const handleFeatureChange = (e, i) => {
        const featureString = e.target.value;
        setApprovalFeature(featureString);
    }

    const handleChange = (e, i) => {
        const getId = document.getElementById("approvalStepId-" + i)
        const getApprovalName = getId.options[getId.selectedIndex].text;
        if (approvalObj.length > 1) {
            const temp = [...approvalObj]
            const index = temp.findIndex((obj) => obj.approvalStepId === Number(e.target.value))
            if (index > -1) {
                showError("This approval step already used");
                return;
            } else {
                let newFormValues = [...approvalObj];
                newFormValues[i][e.target.name] = e.target.value;
                newFormValues[i].approvalName = getApprovalName;
                newFormValues[i].level = i;
                setApprovalObj(newFormValues);
            }
        } else {
            let newFormValues = [...approvalObj];
            newFormValues[i][e.target.name] = e.target.value;
            newFormValues[i].approvalName = getApprovalName;
            newFormValues[i].level = i;
            setApprovalObj(newFormValues);
        }
    }

    const createApprovalFeature = () => {//alert('create..'); return;
        if (!validate()) {
            return false;
        }

        let obj = {}

        obj.companyId = companyId;
        obj.approvalFeature = approvalFeature;
        obj.approvalStepFeatureMapDtoList = approvalObj;
        // console.log(obj)

        const URL = `${process.env.REACT_APP_API_URL}/api/approval-step-feature-map/create-all`;
        axios.post(URL, JSON.stringify(obj), { headers: { "Content-Type": "application/json" } }).then(response => {
            if (response.data.success === true) {
                setApprovalObj([
                    {
                        id: '',
                        approvalName: '',
                        approvalStepId: '',
                        level: '',
                    },
                ]);
                document.getElementById('companyId').value = "";
                document.getElementById('featureId').value = "";
                showSuccess(response.data.message);
            } else {
                showError(response.data.message);
            }
        }).catch(err => {
            showError(err);
        });
    }

    const updateApprovalFeature = () => {
        if (!validate()) {
            return false;
        }
        let obj = {}

        obj.companyId = companyId;
        obj.approvalFeature = approvalFeature;
        obj.approvalStepFeatureMapDtoList = approvalObj;
        //console.log(obj);

        const URL = `${process.env.REACT_APP_API_URL}/api/approval-step-feature-map/update-all`;
        axios.post(URL, JSON.stringify(obj), { headers: { "Content-Type": "application/json" } }).then(response => {
            if (response.data.success === true) {
                showSuccess(response.data.message);
                history.push('/approval-path/authorization-feature');
            } else {
                showError(response.data.message);
            }
        }).catch(err => {
            showError(err);
        });
    }

    const validate = () => {

        if (!companyId) {
            showError('Company is required.');
            return false;
        }
        if (!approvalFeature) {
            showError('Feature is required.');
            return false;
        }
        for (let i = 0; i < approvalObj.length; i++) {
            if (!approvalObj[i].approvalStepId) {
                showError('Approval Step Name is required.');
                return false;
            }
        }
        return true;
    }
    return (
        <>
            {/* BREAD CRUM ROW */}
            <ApprovalPathBreadCrum menuTitle="Authorization Feature" />
            <Card>
                <CardBody>
                    {/* BACK AND TITLE ROW */}
                    <div className="row">
                        <div className="col-4">
                            <span>
                                <button className='btn' onClick={handleBackToListPage}>
                                    <strong>
                                        <i className="bi bi-arrow-left-short sales-booking-view-icon"></i>
                                    </strong>
                                </button>
                            </span>
                        </div>
                        <div className="col-4 level-title text-center mt-3">
                            <strong className="display-inline-block">Authorization Feature</strong>
                        </div>
                    </div>
                    <div className="d-flex flex-wrap justify-content-between mt-5">
                        {/* COMPANY DROPDOWN */}
                        <div>
                            <div className="d-flex flex-wrap">
                                <div className="mt-3">
                                    <label className="dark-gray-color">Company <span className="text-danger">*</span></label>
                                </div>
                                <div>
                                    <select id="companyId" className='form-control border-0' name="companyId"
                                        value={companyId || ""}
                                        onChange={handleCompanyChange}
                                    >
                                        <option value="">Please select Company</option>
                                        {
                                            company.map((c) => (
                                                <option key={c.id} value={c.id}>{c.name}</option>
                                            ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                        {/* FEATURE DROPDOWN */}
                        <div>
                            <div className="d-flex ">
                                <div className="mt-3">
                                    <label className="dark-gray-color">Feature <span className="text-danger ">*</span></label>
                                </div>
                                <div>
                                    <select id="featureId" className='form-control border-0' name="featureId"
                                        value={approvalFeature || ""}
                                        onChange={handleFeatureChange}
                                    >
                                        <option value="">Please select Feature</option>
                                        {
                                            approvalFeatureList.map((af) => (
                                                <option key={af.code} value={af.code}>{af.name}</option>
                                            ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {approvalObj.map((element, index) => (
                        <div className="row" key={index}>
                            <div className="form-group col-xl-12 float-right">
                                {
                                    index === 0 ?
                                        <button
                                            id="more-btn-id"
                                            type="button"
                                            className="btn float-right"
                                            onClick={() => addApprovalFields(index)}
                                        >
                                            <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/blue-add.svg")} />
                                        </button>
                                        :
                                        <div className="text-right">
                                            <button
                                                type="button"
                                                className="btn"
                                                onClick={() => removeApproval(index)}
                                            >
                                                <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/red-delete.svg")} />
                                            </button>
                                            <button
                                                id="more-btn-id"
                                                type="button"
                                                className="btn"
                                                onClick={() => addApprovalFields(index)}
                                            >
                                                <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/blue-add.svg")} />
                                            </button>
                                        </div>

                                }
                            </div>
                            <div className='col-xl-12 guarantee-cheque-div'>
                                <span>Approval to({index + 1})</span>
                            </div>
                            <div className="col-xl-12 mt-5">
                                <div className="row">
                                    <div className="col-xl-6">
                                        <label className='level-title'>Approval Step Name <span className="text-danger ">*</span></label>
                                        <select id={"approvalStepId-" + index} className="form-control" name="approvalStepId" value={element.approvalStepId || ""} onChange={(e) => handleChange(e, index)}>
                                            <option value="">Select Approval Steps</option>
                                            {
                                                approvalList.map((approval, index) => (
                                                    <option value={approval.id}>{approval.name}</option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className='col-xl-12 text-center mb-5'>
                        <button
                            id="save-btn-id"
                            type="button"
                            className="btn bg-primary text-white float-right"
                            onClick={data ? updateApprovalFeature : createApprovalFeature}
                        >
                            {data ? 'Update' : 'Save'}
                        </button>
                    </div>
                </CardBody>
            </Card>
        </>
    );
}