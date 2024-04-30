import React from "react";
import { Modal } from "react-bootstrap";
import { useHistory } from 'react-router-dom';
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../../../../_metronic/_helpers";

export default function ApproveConfirmModal({ show, onHide, setApprove, responseMsg}) {
  let history = useHistory();
  const handleOkChange = () => {
    setApprove(true)
    history.push("/salescollection/payment-adjustment/payment-verify/view-verify");
  }
  return (
    <>
        <Modal
      show={show}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
    >
      <Modal.Body>
      <div className="p-5 text-center">
        <div className="p-5">
          <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/sure.svg")} width="70px" height="70px" />&nbsp;
        </div>

        <div className="mt-5">
           <p>{responseMsg}</p>
        </div>

        <div className="mt-5 text-center">
          <button
            type="button"
            onClick={handleOkChange}
            className="btn btn-elevate text-white w-25"
            style={{background:"#6993FF"}}
          >
            GOT IT
          </button>
        </div>
        </div>
      </Modal.Body>
    </Modal>
    </>
  );
}