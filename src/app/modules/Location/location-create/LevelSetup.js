import React from "react";
import { Field, FieldArray, Form, Formik } from "formik";
import { Input, } from "../../../../_metronic/_partials/controls";
import { showError } from '../../../pages/Alert';

export default function LevelSetup(props) {

    const isAnyFieldEmpty = (listOfFields = []) => {
        let empty = false;
        let length = listOfFields.length;
        for (let i = 0; i < length; i++) {
            if (typeof (listOfFields[i].name) === "undefined" || listOfFields[i].name.trim() === '') {
                empty = true;
                showError("Location Type is empty at Level " + (i + 1)); // level is start from 1 , not from 0
                break;
            }
        }
        return empty;
    }
    const isValidate = (listOfFields = []) => {
        let validate = true;
        if (isAnyFieldEmpty(listOfFields)) {
            validate = false;
        }
        return validate;
    }
    return (
        <>
            <Formik enableReinitialize={true} initialValues={{
                locationsTypes: props.locationTypes
            }}>
                {({ values }) => (
                    <>
                        <Form className="form form-label-right">
                            <FieldArray name="locationsTypes">
                                {({ remove, push }) => (
                                    <div>
                                        {values.locationsTypes.length > 0 ?
                                            values.locationsTypes.map((row, index) => (
                                                <div key={index}>
                                                    <div className="row">
                                                        <div className="col-xl-9">
                                                            <div className="row mt-3">
                                                                <div className="col-xl-5">
                                                                    <label className="mt-3">Level {index + 1}</label>
                                                                </div>
                                                                <div className="col-xl-7">
                                                                    <Field
                                                                        name={`locationsTypes.${index}.name`}
                                                                        type="text"
                                                                        component={Input}
                                                                        placeholder="Level Name"
                                                                        onKeyUp={() => props.setLocationTypes(values.locationsTypes)}
                                                                        maxLength={100}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-xl-3">
                                                            {/* {
                                                                index === 0 ? ""
                                                                    :
                                                                    <button
                                                                        type="button"
                                                                        className="btn ml-0 btn-sm mt-5"
                                                                        onClick={() => {
                                                                            if ((index + 1) > props.maxDepthOfLocationTree) {  // index start from 0. so (index + 1) is used
                                                                                remove(index);
                                                                                values.locationsTypes.splice(index, 1);
                                                                            } else {
                                                                                showError("This Location Type is already used in Location Tree");
                                                                            }
                                                                        }
                                                                        }
                                                                    >
                                                                        <i style={{
                                                                            marginLeft: "-15px",
                                                                            fontSize: "16px"
                                                                        }} className="bi bi-trash3-fill text-danger"></i>
                                                                    </button>
                                                            } */}
                                                            {
                                                                values.locationsTypes.length - 1 === index ?
                                                                    <>
                                                                        <button
                                                                            type="button"
                                                                            className="btn btn-sm mt-5"
                                                                            onClick={() => {
                                                                                if (!isValidate(values.locationsTypes)) {
                                                                                    return;
                                                                                }
                                                                                push({});  // add new field in formic
                                                                            }
                                                                            }
                                                                        >
                                                                            <i className="bi bi-plus-circle-fill text-primary"
                                                                                style={{
                                                                                    marginLeft: "-15px",
                                                                                    fontSize: "16px"
                                                                                }}></i>
                                                                        </button>
                                                                        <button
                                                                            type="button"
                                                                            className="btn ml-0 btn-sm mt-5"
                                                                            onClick={() => {
                                                                                if ((index + 1) > props.maxDepthOfLocationTree) {  // index start from 0. so (index + 1) is used
                                                                                    remove(index);
                                                                                    let temp = [...props.deleteLocation]
                                                                                    let indexFind = temp.findIndex(obj=>obj === row.id)
                                                                                    if(indexFind === -1 && row.id != undefined){
                                                                                        temp.push(row.id)
                                                                                        props.setDeleteLocation(temp)
                                                                                    }
                                                                                    
                                                                                } else {
                                                                                    showError("This Location Type is already used in Location Tree");
                                                                                }
                                                                            }
                                                                            }
                                                                        >
                                                                            <i style={{
                                                                                marginLeft: "-15px",
                                                                                fontSize: "16px"
                                                                            }} className="bi bi-trash3-fill text-danger"></i>
                                                                        </button>
                                                                    </>
                                                                    : ""
                                                            }

                                                        </div>
                                                    </div>
                                                </div>
                                            )) :
                                            <div>
                                                <button
                                                    style={{ paddingLeft: "40px" }}
                                                    type="button"
                                                    className="btn btn-sm mt-5"
                                                    onClick={() => {
                                                        if (!isValidate(values.locationsTypes)) {
                                                            return;
                                                        }
                                                        push({});  // add new field in formic
                                                    }
                                                    }
                                                >
                                                    <i className="bi bi-plus-circle-fill text-primary"
                                                        style={{
                                                            marginLeft: "-15px",
                                                            fontSize: "20px"
                                                        }}></i>
                                                </button>
                                            </div>
                                        }
                                    </div>
                                )}
                            </FieldArray>
                        </Form>
                    </>
                )}
            </Formik>
        </>
    );
}