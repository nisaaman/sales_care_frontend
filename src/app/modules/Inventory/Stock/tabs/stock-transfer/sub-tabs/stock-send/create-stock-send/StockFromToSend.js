import React from "react";
import { showError } from "../../../../../../../../pages/Alert";
export default function StockFromToSend( {fromDepotInfo, toDepots, setToDepotId, fromDepotId}) {

    const setToDepots = event => {
        
        const toStoreId = event.target.value;
        if(fromDepotId == toStoreId) {
            document.getElementById("toStoreId").selectedIndex = ''
            showError("To Depot And From Depot Can't be Same");
            return false;
        }else{
            setToDepotId(event.target.value);
        }
       
        //setInvTransactionDetails([{...invTransactionDetails, rate:event.target.value}])
    }

    return (
        <>
            <div className="bg-white">
                <div className="container-fluid">
                    <div className="row justify-content-between pt-5 pb-5">
                        {/* FROM ROW */}
                        <div className="col-xl-3 mt-5">
                            <strong class="mt-5 dark-gray-color">From</strong><br />
                            <span className="">
                            <label className="dark-gray-color">{fromDepotInfo.depot_name}</label>
                            </span>
                        </div>
                        {/* TO ROW */}
                        <div className="offset-xl-6 col-xl-3 mt-5">
                            <strong class="mt-5 dark-gray-color">To</strong><br />
                            <span>
                                <div className="row">
                                    <div className="col-3 mt-3">
                                        <label className="dark-gray-color">Depot</label>
                                    </div>
                                    <div className="col-9">
                                        <select className="border-0 form-control" id="toStoreId" onChange={setToDepots}>
                                            <option value="1" selected>Select To Depot</option>
                                            {toDepots.map((depot) => (
                                                <option key={depot.depot_name} value={depot.id}>
                                                        {depot.depot_name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}