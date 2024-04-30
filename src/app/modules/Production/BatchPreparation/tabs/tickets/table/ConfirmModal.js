import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_green.css";
import moment from 'moment';
import { allowOnlyNumeric, handlePasteDisable } from '../../../../../Util';
import { showError } from '../../../../../../pages/Alert';

export function ConfirmModal({ data, show, onHide, confirmAction, inputs, setInputs }) {
  const handleChange = (event) => {
    let name = event.target.name;
    let value = event.target.value;
    if(event.target.name == "confirmQuantity"){
        if(event.target.value>data.ticket_quantity){
          showError('Confirm quantity can not be greater than ticket quantity.');
          document.getElementById('confirmQuantity').value = ""
          setInputs(values => ({ ...values, [name]: ""}));
          return false;
        }else if(event.target.value<=0){
          document.getElementById('confirmQuantity').value = ""
          setInputs(values => ({ ...values, [name]: ""}));
          return false;
        }
        else{
          setInputs(values => ({ ...values, [name]: value}));
        }
    }else{
      setInputs(values => ({ ...values, [name]: value}));
    }
  }
  return (
    <Modal
      show={show}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
    >
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">
          Confirmation
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
        <label className='level-title'>Confirm Quantity<span style={{ color: "red" }}>*</span></label>
        <input  
        autoComplete="off"
        id="confirmQuantity"  
        type="text" 
        className='form-control' 
        onKeyPress={(e) => allowOnlyNumeric(e)} 
        name="confirmQuantity" 
        onChange={(event) => handleChange(event)} 
        onPaste={handlePasteDisable}
        />
        </div>
        <div>
          <label className='level-title'>Commitment Date<span style={{ color: "red" }}>*</span></label>
          <Flatpickr className="form-control date" id="commitmentDate" name="commitmentDate"
            value={moment(inputs.commitmentDate||"", "YYYY-MM-DD").format("DD-MM-YYYY")}
            options={{
              dateFormat: "d-m-Y"
            }} required
            onChange={(value) => {
              inputs.commitmentDate=moment(new Date(value[0])).format("YYYY-MM-DD");
              setInputs(inputs);
           }}
          />
        </div>
        <div className="mt-3">
          <label className='level-title'>Notes<span style={{ color: "red" }}>*</span></label>
          <textarea type="text" className="form-control" name="notes" rows="5" placeholder="Write here..." 
          onChange={(event) => handleChange(event)} maxLength={250}/>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div>
          <button
            type="button"
            onClick={onHide}
            className="btn btn-light btn-elevate mr-5"
          >
            Cancel
          </button>
          <> </>
          <button
            type="button"
            onClick={() => confirmAction(data)}
            className="btn btn-danger btn-elevate"
          >
            Confirm
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
