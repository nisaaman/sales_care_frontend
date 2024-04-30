import React from "react";
import { useHistory } from "react-router-dom";
import { Modal } from "react-bootstrap";
import axios from 'axios';
import { showError, showSuccess } from '../../../../../pages/Alert';

export function TradeDiscountDelete({ id, show, onHide }) {
  let history = useHistory();
  const deleteCustomer = (id) => {
    const URL = `${process.env.REACT_APP_API_URL}/api/trade-discount/${id}`;
        axios.delete(URL).then(response => {
            if(response.data.success == true){
              showSuccess(response.data.message)
            }
            else{
              showError(response.data.message);
            }
        }).catch(err => {
            showError(err);
        });
    history.push('/salescollection/sales/trade-discount');
  }

  return (
    <Modal
      show={show}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
    >
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">
          Delete 
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <span>Are you sure to delete this product?</span>
      </Modal.Body>
      <Modal.Footer>
        <div>
          <button
            type="button"
            onClick={onHide}
            className="btn btn-light btn-elevate"
          >
            Cancel
          </button>
          <> </>
          <button
            type="button"
            onClick={()=>deleteCustomer(id)}
            className="btn btn-primary btn-elevate"
          >
            Delete
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
