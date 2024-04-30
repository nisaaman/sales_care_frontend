import React from "react";
import { Modal } from "react-bootstrap";

export function StatusUpdateModal({ id,updateStatusData, show, onHide, updateAction }) {

  return (
    <Modal
      show={show}
      onHide={onHide}
      // action={deleteAction}
      aria-labelledby="example-modal-sizes-title-lg"
    >
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">
          Update Status 
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <span>Are you sure to update this record?</span>
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
            onClick={()=>updateAction(id)}
            className="btn btn-primary btn-elevate"
          >
            Update
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
