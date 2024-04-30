import React from "react";
import { Card } from "react-bootstrap";
import { CardBody } from "../../../../../../_metronic/_partials/controls";
export default function NewQATitle() {
    return (
        <>
            <div className="mt-5">
                <Card style={{ borderTopLeftRadius: "30px", borderTopRightRadius: "30px" }}>
                    <CardBody>
                        <div>
                            <span className="text-muted">Title</span><br />
                            <strong>Quality Inspection</strong>
                        </div>
                        <div className="row no-gutters mt-5">
                            <div className="col-xl-3">
                                <span className="text-muted"><strong>CATEGORY</strong></span>
                            </div>
                            <div className="col-xl-4 text-xl-center">
                                <span className="text-muted"><strong>PRODUCTS</strong></span>
                            </div>
                            <div className="col-xl-5">
                                <span className="text-muted"><strong className="ml-xl-5">BATCHES</strong></span>
                                <span className="text-muted float-right"><strong>ACTION</strong></span>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </>
    );
}