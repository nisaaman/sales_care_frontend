import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { CardBody } from "../../../../../_metronic/_partials/controls";
import { shallowEqual, useSelector } from "react-redux";
import axios from "axios";
import DistributorsBreadCrum from "../common/DistributorsBreadCrum";
import DistributorsHeader from "../common/DistributorsHeader";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../_metronic/_helpers";
import { showError, showSuccess } from "../../../../pages/Alert";

export default function DistributorUpload() {
    const companyId = useSelector((state) => state.auth.company, shallowEqual);
    const [input, setInput] = useState({
        company: "",
    });

    useEffect(() => {
        document
            .getElementById("pills-distributors-upload-tab")
            .classList.add("active");
    }, []);

    const getCompanySelect = (row) => {
        const setId = document.getElementById("fileName");
        setId.innerHTML = "Upload File";
        document.getElementById("fileId").value = "";
        setInput({ company: row.companyId });
    };

    const handleUpload = (event) => {
        if (
            input.company === undefined ||
            input.company === "" ||
            input.company === null
        ) {
            return showError("Please Select Company.");
        } else {
            const fileName = event.target.files[0].name;
            const setId = document.getElementById("fileName");
            setId.innerHTML = fileName;
        }

        let formData = new FormData();

        let obj = new Object();
        obj.companyId = input.company;

        formData.append("tradePriceFile", event.target.files[0]);

        const URL = `${process.env.REACT_APP_API_URL}/api/product-trade-price/upload-trade-price`;
        axios.post(URL, formData, { headers: { "Content-Type": false } })
            .then((response) => {
                showSuccess("Distributor Upload Successfully.");
            })
            .catch((err) => {
                showError(err.message);
            });
    };

    return (
        <>
            <div>
                <DistributorsBreadCrum />
                <DistributorsHeader getSearchInputs={getCompanySelect} />
            </div>
            <div>
                <Card>
                    <CardBody>
                        <div className="row">
                            <div className="col-xl-6">
                                <div>
                                    <span className="daysCount mt-5">Distributor Upload</span>
                                </div>

                                <div>
                                    <button
                                        className="btn-warning-test mt-3 sales-chip border-success text-success text-center"
                                        style={{ width: "100%" }}
                                    >
                                        <span>
                                            <SVG
                                                src={toAbsoluteUrl(
                                                    "/media/svg/icons/project-svg/blue-up-arrow.svg"
                                                )}
                                                width="15px"
                                                height="15px"
                                            />
                                            &nbsp;
                                            <span id="fileName">Upload File</span>
                                        </span>
                                        <input
                                            type="file"
                                            id="fileId"
                                            onChange={(event) => handleUpload(event)}
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </>
    );
}
