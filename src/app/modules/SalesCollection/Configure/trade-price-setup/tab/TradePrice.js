import React, {useEffect, useState} from "react";
import {toAbsoluteUrl} from "../../../../../../_metronic/_helpers";
import SVG from "react-inlinesvg";
import {Route, useHistory} from "react-router-dom";
import {TradePriceList} from "../table/TradePriceList";
import AddTradePriceModal from "../modal/AddTradePriceModal";
import axios from "axios";
import _ from "lodash";
import {showError} from '../../../../../pages/Alert';

export default function TradePrice(props) {
    const history = useHistory();
    const [tradePriceList, setTradePriceList] = useState([]);
    const [currentTradePrice, setCurrentTradePrice] = useState({});

    useEffect(() => {
        if (_.isEmpty(props.selectedProduct)) {
            setTradePriceList([]);
            setCurrentTradePrice({});
        } else {
            getAllTradePriceByProductId(props.selectedProduct.id);
        }
    }, [props.selectedProduct.id]);


    const newTradePriceUIEvents = {
        newTradePriceAddButtonClick: () => {
            if (_.isEmpty(props.selectedProduct)) {
                showError("No Product is Selected");
            } else {
                history.push("/salescollection/configure/trade-price-setup/list/add-trade-price");
            }
        },
    };

    const getAllTradePriceByProductId = (productId) => {
        const URL = `${process.env.REACT_APP_API_URL}/api/product-trade-price/get-all/` + productId;
        axios.get(URL).then(response => {
            if (response.data.success === true) {
                let tpList = response.data.data;
                if (tpList.length > 0) {
                    let currentTd = tpList.find(element => element.expired_date === null);
                    setCurrentTradePrice(currentTd === undefined ? {} : currentTd);
                    props.setSelectedProductTradePrice(currentTd.amount);
                } else {
                    setCurrentTradePrice({});
                    props.setSelectedProductTradePrice("");
                }
                setTradePriceList(tpList);
            }
        });
    }


    return (
        <>
            <Route path="/salescollection/configure/trade-price-setup/list/add-trade-price">
                {({history, match}) => (
                    <AddTradePriceModal
                        selectedProduct={props.selectedProduct}
                        show={match != null}
                        onHide={(isSave = false) => {
                            history.push("/salescollection/configure/trade-price-setup/list");
                            if (isSave) {
                                getAllTradePriceByProductId(props.selectedProduct.id);
                            }
                        }}
                    />
                )}
            </Route>
            {/* CURRENT TRADE PRICE ROW */}
            <div className="current-trade-price p-5 row">

                {/* CURRENT TRADE PRICE TITLE ROW */}
                <div className="col-xl-12">
                    <span className="current-trade-price-title">Current Trade Price</span>
                    <span className="float-right">
                        <button className="text-white trade-price-add-btn"
                                onClick={newTradePriceUIEvents.newTradePriceAddButtonClick}>
                            <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/more.svg")} width="15px"
                                 height="15px"/>&nbsp;
                            New Trade Price
                        </button>
                    </span>
                </div>

                {/* ALL DATE AND AMOUNT SUMMARY */}
                <div className='col-xl-12 current-trade-price-summary mt-5'>
                    <div className="row">
                        {/* EFFECTIVE DATE ROW */}
                        <div className='col-xl-4'>
                            <div className="d-flex">
                                <div>
                                    <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/date-green.svg")} width="25px"
                                         height="25px"/>
                                </div>
                                <div className="ml-2">
                                    <span>
                                        <span>Effective Date</span>
                                        <p>
                                            <strong
                                                className="current-trade-price-summary-text">{currentTradePrice?.effective_date}</strong>
                                        </p>
                                    </span>
                                </div>
                            </div>
                        </div>
                        {/* EXPIRED DATE ROW */}
                        <div className='col-xl-4'>
                            <div className="d-flex">
                                <div>
                                    <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/date-green.svg")} width="25px"
                                         height="25px"/>
                                </div>
                                <div className="ml-2">
                                    <span>
                                        <span>Expired Date</span>
                                        <p><strong
                                            className="current-trade-price-summary-text">{currentTradePrice?.expired_date === null ? 'Continue' : currentTradePrice?.expired_date}</strong></p>
                                    </span>
                                </div>
                            </div>
                        </div>
                        {/* AMOUNT ROW */}
                        <div className='col-xl-4'>
                            <div className="d-flex">
                                <div>
                                    {/* <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/doller-green.svg")}
                                         width="25px" height="25px"/> */}
                                </div>
                                <div className="ml-2">
                                    <span>
                                        <span>Price</span>
                                        <p><strong
                                            className="current-trade-price-summary-text">{currentTradePrice.amount}</strong></p>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                {/* HISTORY TITLE ROW */}
                <div className='col-xl-12 mt-5'>
                    <span className="text-muted"><SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/history.svg")}
                                                      width="15px" height="15px"/>&nbsp;Trade Price History</span>
                </div>

                {/* TRADE PRICE LIST ROW */}
                <div className='col-xl-12 mt-5'>
                    <TradePriceList tradePriceList={tradePriceList}/>
                </div>
            </div>
        </>
    )
}