import React, { useEffect, useState, useRef } from "react";
import { Modal } from "react-bootstrap";
import { showError } from "../../../../pages/Alert";

export default function LevelTreeModal({ node, show, onHide, handleSubmit }) {
    const [inputs, setInputs] = useState({});
    const [categoryType, setCategoryType] = useState('');

    useEffect(() => {
        setInputs({ categoryTypeName: (typeof node === 'undefined' ? '' : node.name) });
    }, []);

    useEffect(() => {
        setCategoryType(typeof node !== 'undefined' ? (node.action === 'add' || node.treeLevel === '') ? node.nextCategoryType : node.typeName : '')
        setInputs({ categoryTypeName: (typeof node !== 'undefined' && node.action === 'update' ? node.name : '') });
    }, [node]);

    const handleChange = (event) => { 
        let name = event.target.name;
        let value = event.target.value;
        setInputs(values => ({ ...values, [name]: value }));
    }

    const handleSave = () => {
        inputs.categoryTypeName = inputs.categoryTypeName.trim()
        if(inputs.categoryTypeName === ''){
            showError('Please Enter ' + categoryType + ' Name.');
            return;
        }
        if (inputs.categoryTypeName.length < 3) {
            showError('Level Name Charecter Length is Minimum 3!')
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
        <Modal
            size="md"
            show={show}
            onHide={onHide}
            aria-labelledby="example-modal-sizes-title-lg"
        >
            <Modal.Header closeButton>
                <Modal.Title id="example-modal-sizes-title-lg">{typeof node !== 'undefined' ? (node.action === 'add' || node.treeLevel === '') ? 'Add New' : 'Update Existing' : ''} {categoryType}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="overlay overlay-block cursor-default">
                <form>
                    <div className='row'>
                        <label><strong>{categoryType} Name</strong></label>
                        <input maxLength={100} type="text" className='form-control' name="categoryTypeName"
                            value={inputs.categoryTypeName} onChange={handleChange}></input>
                    </div>
                </form>
            </Modal.Body>
            <Modal.Footer>
                <button
                    type="button"
                    onClick={handleCancel}
                    className="btn btn-light btn-elevate"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    onClick={handleSave}
                    className="btn btn-primary btn-elevate"
                >
                    {node && node.action === 'add' ? 'Add' : 'Update'}
                </button>
            </Modal.Footer>
        </Modal>
    );
}