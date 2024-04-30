import React from "react";
import { Modal } from "react-bootstrap";
import { useHistory } from 'react-router-dom';
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../../../../_metronic/_helpers";
import axios from "axios";
import { showError } from "../../../../../../../pages/Alert";

export default function RejectModal({ show, onHide, setReject, setRejectRemarks, paymentId, setResponseData }) {
  let history = useHistory();
  const handleOkChange = () => {
    let reason = document.getElementById("reason").value;
    setRejectRemarks(reason)    
    
    const URL = `${process.env.REACT_APP_API_URL}/api/payment-collection/reject/` + paymentId;

      axios.put(URL, {reason: reason}).then(response => {
        if(response.data.success == true){
          setResponseData(response.data.data);
          setReject(true)
          showError(response.data.message);
          history.push("/salescollection/payment-adjustment/payment-verify/view-verify");
        }else{
          showError(response.data.message);
        }
      }).catch(err => {
        showError(err);
      })
  }
  return (
    <>
      <Modal
        show={show}
        onHide={onHide}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Body>
          <div className="p-5">
          <div className="close-btn">
                    <span className="float-right" style={{ marginTop: "-20px" }}>
                        <button onClick={onHide}>
                            <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/reject.svg")} width="20px" height="20px" />
                        </button>
                    </span>
                </div>
            <div className="text-center p-5">
              <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/reject-alert.svg")} width="70px" height="70px" />&nbsp;
            </div>

            <div className="mt-5">
              <p className="dark-gray-color"><strong>If you Reject this payment, please click on Button <span style={{ color: "red" }}>Reject.</span></strong></p>
            </div>

            <div>
              <label><strong>Remarks(If any)</strong></label>
              <textarea id="reason" placeholder="Write here" type="text" className='form-control border-success' name="reason" style={{height:"200px"}}/>
            </div>

            <div className="mt-5">
              <button
                type="button"
                onClick={handleOkChange}
                className="btn btn-elevate float-right text-white w-25 border-0"
                style={{ background: "linear-gradient(135deg, #FFA3A3 0%, #FE3233 100%)" }}
              >
                Reject
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}