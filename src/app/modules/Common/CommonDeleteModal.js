import React from "react";
import { Modal } from "react-bootstrap";

export function CommonDeleteModal({ id, show, onHide, deleteAction }) {

  return (
    <Modal
      show={show}
      onHide={onHide}
      // action={deleteAction}
      aria-labelledby="example-modal-sizes-title-lg"
    >
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">
          Delete 
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <span>Are you sure to delete this record?</span>
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
            onClick={()=>deleteAction(id)}
            className="btn btn-primary btn-elevate"
          >
            Delete
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
