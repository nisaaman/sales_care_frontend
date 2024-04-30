import React from "react";
import { showError } from "../../../../../pages/Alert";
import { stringExtract } from "../../../../Util";
export default function NewQAFromToSend({ fromDepotInfo, stores, setToDepotId, 
    fromDepotId, setStoreId, setStoreType}) {

    const setStore = event => {
        setStoreId(parseInt(event.target.value));
        const str = event.target.options[event.target.selectedIndex].text;
        const stringExtractor = stringExtract(str, '(',')')[0];
        // alert(stringExtractor)
        // alert(event.target.options[event.target.selectedIndex].text)
        // alert(stringExtractor(event.target.options[event.target.selectedIndex].text));
        setStoreType(stringExtractor);     
    }

    return (
        <>
            <div className="bg-white">
                <div className="container-fluid">
                    <div className="row justify-content-between pt-5 pb-5">
                        {/* DEPOT ROW */}
                        <div className="col-xl-3 mt-5">
                            <strong class="mt-5 dark-gray-color">Depot</strong><br />
                            <span className="">
                                <label className="dark-gray-color">{fromDepotInfo.depotName}</label>
                            </span>
                        </div>
                        {/* STORE ROW */}
                        <div className="offset-xl-6 col-xl-3 mt-5">
                            <div><strong class="mt-5 dark-gray-color">Store</strong></div>
                            <div>
                                <select className="form-control" id="toStoreId" onChange={setStore}>
                                    <option value="" selected>Select To Store</option>
                                    {stores.map((store) => (
                                        <option key={store.name} value={store.id}>
                                            {store.name +" ("+store.store_type+")"}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}