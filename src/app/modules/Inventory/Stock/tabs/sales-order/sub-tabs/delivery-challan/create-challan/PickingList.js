import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "react-bootstrap";
import { CardBody } from "../../../../../../../../../_metronic/_partials/controls";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import IOSSwitch from '../../../../../../../../pages/IOSSwitch';
import { toAbsoluteUrl } from "../../../../../../../../../_metronic/_helpers";
import SVG from "react-inlinesvg";
import { showError } from "../../../../../../../../pages/Alert";
import { format, parseISO } from 'date-fns';

export default function PickingList({ pickingList, setPickingId, setOrderList, 
    setProductList, companyId, setPickingList, pickingStateList, orderStateList }) {
    const [checked, setChecked] = useState(false);
    useEffect(() => {
        handleActive();
    }, []);

    const handleSelectPickingList = (event, number) => {
        let id = "picking-id-" + number;
        const getId = document.getElementById(id);
        const getElements = document.getElementsByClassName('picking-list-div');

        let spanId = "picking-list-normal-span-id-" + number;
        const getSpanId = document.getElementById(spanId);
        const getSpanElements = document.getElementsByClassName('picking-list-normal-span');

        for (var i = 0; i < getElements.length; i++) {
            getElements[i].classList.remove('select-order-list');
        }
        for (var i = 0; i < getSpanElements.length; i++) {
            getSpanElements[i].classList.remove('picking-list-select-span');
        }

        if (getId) {
            getId.classList.add('select-order-list');
            getSpanId.classList.add('picking-list-select-span');
            setOrderList([])
            setProductList([])
            getOrderList(number);
        }
    }

    const getOrderList = (pickingId) => {
        setPickingId(pickingId)
        const URL = `${process.env.REACT_APP_API_URL}/api/picking/get-order-list-by-picking-wise/${pickingId}`
        axios.get(URL, JSON.stringify(), { headers: { "Content-Type": "application/json" } }).then(response => {
            setOrderList(response.data.data);
        }).catch(err => {
            console.log(err);
        });
    }

    const openDownLoad = (picking_id) => {
        let queryString = '?';
        queryString += 'pickingId=' + picking_id;
        queryString += '&companyId=' + companyId;
        const URL = `${process.env.REACT_APP_API_URL}/api/reports/picking-list` + queryString;
        axios.get(URL, { responseType: 'blob' }).then(response => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', "pickingList.pdf");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        }).catch(err => {
            showError();
        });
    }

    const handleActive = () => {
        let checked = document.getElementById('pickingListId').checked;
        setChecked(checked)
        if (checked) {
            setPickingList(pickingStateList)
            setOrderList([])
            setProductList([])
        } else {
            setPickingId("")
            setPickingList([])
            setOrderList(orderStateList)
            setProductList([])

            const getElements = document.getElementsByClassName('order-list-div');
            for (var i = 0; i < getElements.length; i++) {
                getElements[i].classList.remove('select-order-list');
            }
        }
    }
    
    return (
        <>
            {/* TITLE ROW */}
            <div>
                {/* PICKING LIST TITLE CARD */}
                <Card style={{ borderTopRightRadius: "30px", borderTopLeftRadius: "30px" }}>
                    <CardBody>
                        <div className="row no-gutters">
                            <div className="col-10">
                                <span className="text-muted">Title</span><br />
                                <strong>Picking List</strong>
                            </div>
                            <div className="col-2">
                                <FormControlLabel
                                    control={<IOSSwitch
                                        id="pickingListId"
                                        checked={checked}
                                        onClick={handleActive}
                                    />}
                                />
                            </div>
                        </div>
                        <div>
                            <span className="text-muted"><strong>List</strong></span>
                            <span className="text-muted float-right"><strong>Status</strong></span>
                        </div>
                    </CardBody>
                </Card>
            </div>

            {/* PICKING LIST DATA VIEW ROW */}
            {
                pickingList.map((data) => (
                    <>
                        <div className="mt-5 picking-list-div" style={{ cursor: "pointer" }} onClick={(event) => handleSelectPickingList(event, data.picking_id)} id={"picking-id-" + data.picking_id}>
                            <Card>
                                <CardBody>
                                    <div>
                                        <span id={"picking-list-normal-span-id-" + data.picking_id} className="float-right picking-list-normal-span"><strong>{data.total_order}</strong></span>
                                        <span className="text-muted">Picking ID.</span><br />
                                        <strong>{data.picking_no}</strong>
                                    </div>
                                    <div className="mt-5">
                                        <span className="text-muted">Date</span><br />
                                        <strong>{format(parseISO(data.picking_date), 'dd-MMM-yyyy')}</strong>
                                        <button
                                            className="float-right border-0 bg-white"
                                            onClick={() => openDownLoad(data.picking_id)}
                                        >

                                            <SVG
                                                className="svg-icon svg-icon-md svg-icon-primary"
                                                src={toAbsoluteUrl("/media/svg/icons/project-svg/blueDownload.svg")}
                                            />

                                        </button>
                                    </div>
                                </CardBody>
                            </Card>
                        </div>
                    </>
                ))
            }
        </>
    )
}