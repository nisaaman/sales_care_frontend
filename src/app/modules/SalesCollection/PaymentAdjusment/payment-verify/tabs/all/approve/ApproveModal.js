import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { useHistory, Route } from 'react-router-dom';
import ApproveConfirmModal from "./ApproveConfirmModal";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../../../../_metronic/_helpers";
import axios from "axios";
import { showError } from "../../../../../../../pages/Alert";

export default function ApproveModal({ show, onHide, setApprove, paymentId, setResponseData}) {
  let history = useHistory();
  const [responseMsg, setResponseMsg] = useState('');

  const approveUIEvents = {
    confirmButtonClick: () => {

      const URL = `${process.env.REACT_APP_API_URL}/api/payment-collection/approve/` + paymentId;

      axios.put(URL).then(response => {
        if(response.data.success == true){
          setResponseData(response.data.data);
          setResponseMsg(response.data.message);
          setApprove(true)
          history.push("/salescollection/payment-adjustment/payment-verify/view-verify");
          //history.push("/salescollection/payment-adjustment/payment-verify/view-verify/approve-confirm");
        }else{
          showError(response.data.message);
        }
      }).catch(err => {
        showError(err);
      })        
    }, 
};
  return (
    <>
    <Route path="/salescollection/payment-adjustment/payment-verify/view-verify/approve-confirm">
                {({ history, match }) => (
                    <ApproveConfirmModal 
                        responseMsg={responseMsg}
                        show={match != null}
                        onHide={() => {
                            history.push("/salescollection/payment-adjustment/payment-verify/view-verify");
                        }}
                        setApprove = {setApprove}
                    />
                )}
            </Route>
        <Modal
      show={show}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
    >
      <Modal.Body>
        <div className="p-5">
        <div className="text-center p-5">
          <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/confirm.svg")} width="70px" height="70px" />&nbsp;
        </div>

        <div className="mt-5">
           <p className="dark-gray-color text-center"><strong>If you approve this payment, please click on Button <span style={{color:"#6FCF97"}}>Approve</span></strong></p>
        </div>
        <div>
          
        </div>

        <div className="mt-5">
          <button
            type="button"
            onClick={onHide}
            className="btn btn-light btn-elevate w-25"
          >
            Cancel
          </button>
          <> </>
          <button
            type="button"
            onClick={approveUIEvents.confirmButtonClick}
            className="btn btn-elevate float-right text-white w-25"
            style={{background:"#6FCF97"}}
          >
            Approve
          </button>
        </div>
        </div>
      </Modal.Body>
    </Modal>
    </>
  );
}