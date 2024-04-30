import { Card } from "@material-ui/core";
import React from "react";
import { toAbsoluteUrl } from "../../../_metronic/_helpers";
import { CardBody } from "../../../_metronic/_partials/controls";
export default function UnauthorizedPage() {
    return (
        <Card>
            <CardBody>
                <div className="container-fluid text-center">
                    <img title="Unauthorized" alt="Block" className="max-h-50px"
                    src={toAbsoluteUrl("/images/block.png")}/>

                    <h1 className="text-danger">You are not authorized to access this page!</h1>
                </div> 
            </CardBody>
        </Card>        
    );
}