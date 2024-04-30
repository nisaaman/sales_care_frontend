import React, {useEffect, useState} from "react";
import {Modal} from "react-bootstrap";
import { showError } from "../../../pages/Alert";

export default function LevelTreeModal({id, node, show, onHide, handleSubmit}) {
    const [inputs, setInputs] = useState({});

    useEffect(() => {
        setInputs({locationName: (typeof node === 'undefined' ? '' : node.name)});
    }, []);

    useEffect(() => {
        setInputs({locationName: (typeof node !== 'undefined' && node.action === 'update' ? node.name : '')});
    }, [node]);

    const handleChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;
        setInputs(values => ({...values, [name]: value}));
    }

    const handleSave = () => {
        if(!inputs.locationName){
            showError('Location name is required.');
            return false;
        }

        if(!inputs.locationName.trim()){
            showError('Location name is required.');
            return false;
        }

        handleSubmit(inputs);
        setInputs({});
    }

    const handleCancel = () => {
        onHide();
        setInputs({});
    }

    return (
        <Modal size="md" show={show} onHide={onHide} aria-labelledby="example-modal-sizes-title-lg">
            <Modal.Header closeButton>
                <Modal.Title id="example-modal-sizes-title-lg">New Location</Modal.Title>
            </Modal.Header>

            <Modal.Body className="overlay overlay-block cursor-default">
                <form>
                    <div className='row'>
                        <label><strong>Lcation Name</strong></label>
                        <input maxlength="25" type="text" className='form-control' name="locationName"
                               value={inputs.locationName} onChange={handleChange}></input>
                    </div>
                </form>
            </Modal.Body>
            <Modal.Footer>
                <button type="button" onClick={handleCancel} className="btn btn-light btn-elevate">Cancel</button>
                <button type="submit" onClick={handleSave} className="btn btn-primary btn-elevate">Save</button>
            </Modal.Footer>
        </Modal>
    );
}