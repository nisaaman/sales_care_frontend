import React from "react";
import { useHistory } from "react-router-dom";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../_metronic/_helpers";
import { shallowEqual, useSelector } from 'react-redux';
import { hasAcess } from '../../../Util';

export default function BatchPreparationTabs() {
    const history = useHistory();
    const permissions = useSelector((state) => state.auth.user.permissions, shallowEqual);
    const handleProductsChange = () => {
        history.push("/production/production-batch-preparation/production-batch-preparation-product")
    }
    const handleTicketsChange = () => {
        history.push("/production/production-batch-preparation/production-batch-preparation-product-tickets")
    }

    return (
        <>
            {/* TODAY SALE ROW */}
            <div>  
                <div className="mt-5 collection-budget-tabs">
                    <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
                    {hasAcess(permissions, 'BATCH_PREPARATION_PRODUCT') &&
                        <li class="nav-item mr-5" role="presentation">
                            <a class="nav-link" id="pills-inventory-products-products-tab" data-toggle="pill" href="#pills-inventory-products-products" role="tab" aria-controls="pills-inventory-products-products" aria-selected="false" onClick={handleProductsChange}>
                            <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/blue-product.svg")} width="15px" height="15px" />&nbsp;
                                Products
                            </a>
                        </li>
                    }

                    {hasAcess(permissions, 'MATERIAL_PLAN') && 
                        <li class="nav-item" role="presentation">
                            <a class="nav-link" id="pills-inventory-products-tickets-tab" data-toggle="pill" href="#pills-inventory-products-tickets" role="tab" aria-controls="pills-inventory-products-tickets" aria-selected="false" onClick={handleTicketsChange}>
                            <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/blue-ticket.svg")} width="15px" height="15px" />&nbsp;
                                Tickets
                            </a>
                        </li>
                     } 
                    </ul>
                </div>
            </div>
        </>
    );
}