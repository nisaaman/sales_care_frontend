import React from "react";
import { Modal } from "react-bootstrap";

export function RejectModal({ data, show, onHide, rejectAction }) {

  return (
    <Modal
      show={show}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
    >
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">
          Reject 
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <span>Are you sure to reject this record?</span>
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
            onClick={()=>rejectAction(data)}
            className="btn btn-danger btn-elevate"
          >
            Reject
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
