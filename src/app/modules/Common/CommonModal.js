import React from "react";
import { Modal } from "react-bootstrap";

export function CommonModal({ data, show, onHide, action, title, message, btnName }) {

  return (
    <Modal
      show={show}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
    >
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">
          {title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <span>{message}</span>
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
            onClick={()=>action(data)}
            className="btn btn-primary btn-elevate"
          >
            {btnName}
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
