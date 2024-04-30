import React, {useState, useEffect} from "react";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import IOSSwitch from '../../../../../pages/IOSSwitch';
import {toAbsoluteUrl} from "../../../../../../_metronic/_helpers";
import SVG from "react-inlinesvg";
import {useHistory, Route} from "react-router-dom";
import AddVatModal from "../modal/AddVatModal";
import _ from "lodash";
import {showError} from '../../../../../pages/Alert';
import axios from "axios";

export default function VatSetup(props) {
    const history = useHistory();
    // const [vatLabel, setVatLabel] = useState("Vat is Excluded");

    const [vatIncluded, setVatIncluded] = useState(false);
    const [vatList, setVatList] = useState([]);

    useEffect(() => {
        if (document.getElementById('vatSwitchId').checked) {
            document.getElementById('vatDiv').classList.add('add-vat-div-green')
        } else {
            document.getElementById('vatDiv').classList.add('add-vat-div-gray')
            document.getElementById('vatId').classList.add('dark-gray-color')
        }
    }, []);

    useEffect(() => {
        getAllVatByProductId({vatIncluded: vatIncluded, productId: props.selectedProduct.id});
    }, [props.selectedProduct.id]);

    useEffect(() => {
        getAllVatByProductId({vatIncluded: vatIncluded, productId: props.selectedProduct.id});
        if (vatIncluded == true) {
            document.getElementById('vatDiv').classList.remove('add-vat-div-gray')
            document.getElementById('vatId').classList.remove('dark-gray-color')
            document.getElementById('vatDiv').classList.add('add-vat-div-green')
        } else {
            document.getElementById('vatDiv').classList.add('add-vat-div-gray')
            document.getElementById('vatId').classList.add('dark-gray-color')
        }
    }, [vatIncluded]);

    const getAllVatByProductId = (params) => {
        if (_.isEmpty(props.selectedProduct)) {
            setVatList([]);
            return;
        }
        let queryParams = '?';
        queryParams += 'productId=' + params.productId;
        queryParams += '&vatIncluded=' + params.vatIncluded;
        const URL = `${process.env.REACT_APP_API_URL}/api/vat-setup/get-all-with-current` + queryParams;
        axios.get(URL).then(response => {
            if (response.data.success === true) {
                setVatList(response.data.data.vatList);
                props.setSelectedProductVat(response.data.data.currentVatInfo);
            } else {
                props.setSelectedProductVat({});
            }
        });
    }

    const newVatUIEvents = {
        newVatAddButtonClick: () => {
            if (_.isEmpty(props.selectedProduct)) {
                showError("No Product is Selected");
            } else {
                history.push("/salescollection/configure/trade-price-setup/list/add-vat");
            }
        },
    };

    const handleVatChange = (event) => {
        setVatIncluded(!vatIncluded);

    }

    return (
        <>
            <Route path="/salescollection/configure/trade-price-setup/list/add-vat">
                {({history, match}) => (
                    <AddVatModal
                        selectedProduct={props.selectedProduct}
                        show={match != null}
                        onHide={(isSave = false) => {
                            history.push("/salescollection/configure/trade-price-setup/list");
                            if (isSave) {
                                getAllVatByProductId({vatIncluded: vatIncluded, productId: props.selectedProduct.id});
                            }
                        }}
                    />
                )}
            </Route>
            {/* VAT ADD BTN AND SWITCH ROW */}
            <div id="vatDiv">
                <div>
                    <button className="add-to-vat text-white" onClick={newVatUIEvents.newVatAddButtonClick}>
                        <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/more.svg")} width="15px"
                             height="15px"/>&nbsp;
                        Add New VAT
                    </button>
                </div>
                <div className=" float-right vat-switch" id="vatId">
                    <FormControlLabel label={vatIncluded ? 'VAT is Included' : 'VAT is Excluded'}
                                      control={
                                          <IOSSwitch id="vatSwitchId" checked={vatIncluded} value={vatIncluded}
                                                     onChange={(event) => handleVatChange(event)}/>
                                      }
                    />
                </div>
            </div>

            {vatList.map((vat, index) => (
                <div key={index} className="p-5 current-vat-inactive mt-5">
                    {/* VAT TITLE ROW */}
                    <div>
                        <span
                            className="current-vat-summary-text-gray-color">{vat.status === 'EXPIRED' ? 'Expired' : vat.status === 'CURRENT' ? 'Current VAT' : 'Not Start Yet'}</span>
                        <span className="float-right vat-status">
                            <FormControlLabel label={vat.status === 'CURRENT' ? 'Active' : 'Disable'}
                                              labelPlacement="start"
                                              control={<IOSSwitch checked={vat.status === 'CURRENT' ? true : false}/>}
                            />
                    </span>
                    </div>
                    <div className="d-flex justify-content-between mt-5 current-vat-summary">
                        <div>
                            <div className="d-flex">
                                <div className="mt-2">
                                    <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/gray-date.svg")} width="25px"
                                         height="25px"/>
                                </div>
                                <div className="ml-2">
                                <span>
                                    <span>Effective Date</span>
                                    <p><strong className="current-trade-price-summary-text">{vat.from_date}</strong></p>
                                </span>
                                </div>
                            </div>
                        </div>
                        <div className="float-right">
                            <div className="d-flex">
                                <div className="mt-2">
                                    <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/gray-date.svg")} width="25px"
                                         height="25px"/>
                                </div>
                                <div className="ml-2">
                                <span>
                                    <span>Expired Date</span>
                                    <p><strong className="current-trade-price-summary-text">{vat.to_date}</strong></p>
                                </span>
                                </div>
                            </div>
                        </div>
                        <div className="float-right">
                            <div className="d-flex">
                                <div className="mt-2">
                                    <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/gra-doller.svg")} width="25px"
                                         height="25px"/>
                                </div>
                                <div className="ml-2">
                                <span>
                                    <span>Amount</span>
                                    <p><strong className="current-trade-price-summary-text">{vat.vat}%</strong></p>
                                </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </>
    )
}