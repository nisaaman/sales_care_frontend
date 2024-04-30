import React from "react";
import { Formik, Form, Field, FieldArray } from "formik";
import {
  Input,
} from "../../../../../_metronic/_partials/controls";
import { showError, showSuccess } from '../../../../pages/Alert';
import axios from "axios";
import { shallowEqual, useSelector } from "react-redux";

export default function LevelSetup(props) {
  const companyId = useSelector((state) => state.auth.company, shallowEqual);
  const isAnyFieldEmpty = (listOfFields = []) => {
    let empty = false;
    for (let i = 0; i < listOfFields.length; i++) {
      if (typeof (listOfFields[i].name) === "undefined" || listOfFields[i].name.trim() === '') {
        empty = true;
        showError("Product Category Type is empty at Level " + (i + 1)); // level is start from 1 , not from 0
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

  const submitDataPrepare = (arr) => {
    let temp = [];
    arr.map(obj => {
      temp.push({
        "id": obj.id != null ? obj.id : null,
        "name": obj.name.trim(),
        "level": obj.level,
        "companyId": obj.companyId
      })
    })
    return temp;
  }

  const handleDelete = (id) => {
    if(id !=null){
      const URL = `${process.env.REACT_APP_API_URL}/api/product-category-type/${id}`;
    axios.delete(URL).then(response => {
      if (response.data.success == true) {
        showSuccess(response.data.message)
      }
      else {
        showError(response.data.message);
      }
    }).catch(err => {
      showError(err);
    });

    }
    
  }

  const handleSubmit = (data) => {
    let obj = {};
    obj.productCategoryTypeDtoList = submitDataPrepare(data);

    let URL = `${process.env.REACT_APP_API_URL}/api/product-category-type/`;

    if ((props.productCategoryTypeDtoList.length > 0 && props.productCategoryTypeDtoList[0].id != null)) {
      URL += 'update-all'
      axios.put(URL, JSON.stringify(obj), { headers: { "Content-Type": "application/json" } }).then(response => {
        if (response.data.success == true) {
          showSuccess(response.data.message)
          props.setProductCategoryTypes(data)
          document.getElementById('update-btn').style.display="none"
        } else {
          showError(response.data.message);
        }
      }).catch(err => {
        showError(err);
      });

    } else {
      URL += 'create-all'
      axios.post(URL, JSON.stringify(obj), { headers: { "Content-Type": "application/json" } }).then(response => {
        if (response.data.success == true) {
          showSuccess(response.data.message)
          props.setProductCategoryTypes(data)
          document.getElementById('save-btn').style.display="none"
        } else {
          showError(response.data.message);
        }
      }).catch(err => {
        showError(err);
      });
    }

  }

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          productCategoryTypeDtoList: props.productCategoryTypeDtoList
        }}
      >
        {({ values }) => (
          <>
            <Form className="form form-label-right">
              <FieldArray name="productCategoryTypeDtoList">
                {({ remove, push }) => (
                  <div>
                    {values.productCategoryTypeDtoList.length > 0 ?
                      values.productCategoryTypeDtoList.map((row, index) => (

                        <div key={index}>
                          <div className="row">
                            <div className="col-xl-9">
                              <div className="row mt-3">
                                <div className="col-xl-3">
                                  <label className="mt-3">Level {index + 1}</label>
                                </div>
                                <div className="col-xl-9">
                                  <Field
                                    name={`productCategoryTypeDtoList.${index}.name`}
                                    id="name"
                                    type="text"
                                    maxLength={100}
                                    component={Input}
                                    placeholder="Level Name"
                                    onKeyUp={() => props.setProductCategoryTypes(values.productCategoryTypeDtoList)}
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
                                      if ((index + 1) > props.maxDepth) {
                                        remove(index);
                                        handleDelete(row.id);
                                      } else {
                                        showError("This Product Category Type is already used in Product Category");
                                      }
                                    }
                                    }
                                  >
                                    <i style={{ marginLeft: "-15px", fontSize: "16px" }} class="bi bi-trash3-fill text-danger"></i>
                                  </button>
                              } */}
                              {
                                values.productCategoryTypeDtoList.length - 1 == index ?
                                  <>
                                    <button
                                      type="button"
                                      className="btn btn-sm mt-5"
                                      onClick={() =>
                                        push({
                                          id: null,
                                          name: '',
                                          level: values.productCategoryTypeDtoList.length,
                                          companyId: companyId,
                                        }) // add new field in formic
                                      }
                                    >
                                      <i class="bi bi-plus-circle-fill text-primary" style={{ marginLeft: "-15px", fontSize: "16px" }}></i>
                                    </button>

                                    <button
                                      type="button"
                                      className="btn ml-0 btn-sm mt-5"
                                      onClick={() => {
                                        if ((index + 1) > props.maxDepth) {
                                          remove(index);
                                          handleDelete(row.id);
                                        } else {
                                          showError("This Product Category Type is already used in Product Category");
                                        }
                                      }
                                      }
                                    >
                                      <i style={{ marginLeft: "-15px", fontSize: "16px" }} class="bi bi-trash3-fill text-danger"></i>
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
                          style={{paddingLeft:"40px"}}
                          type="button"
                          className="btn btn-sm mt-5"
                          onClick={() =>
                            push({
                              id: null,
                              name: '',
                              level: values.productCategoryTypeDtoList.length,
                              companyId: companyId,
                            }) // add new field in formic
                          }
                        >
                          <i class="bi bi-plus-circle-fill text-primary" style={{ marginLeft: "-15px", fontSize: "20px" }}></i>
                        </button>

                      </div>
                    }
                  </div>
                )}
              </FieldArray>
              <footer>
              {(props.productCategoryTypeDtoList.length > 0 && props.productCategoryTypeDtoList[0].id != null) ? 
               <button
               id="update-btn"
               onClick={() => {
                 if (isValidate(values.productCategoryTypeDtoList)) {
                   handleSubmit(values.productCategoryTypeDtoList)
                 };  // add new field in formic
               }}
               className="btn btn-primary  btn-sm float-right ml-3 mt-5"
             >
               Update
             </button>
              : ''}
               
               {(props.productCategoryTypeDtoList.length > 0 && props.productCategoryTypeDtoList[0].id == null) ? 
               <button
               id="save-btn"
               onClick={() => {
                 if (isValidate(values.productCategoryTypeDtoList)) {
                   handleSubmit(values.productCategoryTypeDtoList)
                 };  // add new field in formic
               }}
               className="btn btn-primary  btn-sm float-right ml-3 mt-5"
             >
              Save 
             </button>
              : ''}
                
              </footer>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}