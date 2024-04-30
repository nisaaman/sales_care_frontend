import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { toAbsoluteUrl } from "../../../../../../../_metronic/_helpers";
import SVG from "react-inlinesvg";
import { shallowEqual, useSelector } from "react-redux";
import axios from "axios";

export function ViewModal({ data, show, onHide, dataList }) {
  //const companyId = useSelector((state) => state.auth.company, shallowEqual);
  //const [depotWiseStockList, setDepotWiseStockList] = useState([]);
  //let productId = data.product_id
  // useEffect(() => {
  //   getProductWiseDepotStockList(productId, companyId)
  // }, [productId, companyId]);

  // const getProductWiseDepotStockList = (productId, companyId) => {
  //   let queryParams = 'companyId=' + companyId;
  //   queryParams += '&productId=' + productId;
  //   const URL = `${process.env.REACT_APP_API_URL}/api/product/get-product-wise-depot?` + queryParams;
  //   axios.get(URL).then(response => {
  //     setDepotWiseStockList(response.data.data);
  //   }).catch(err => { });
  // }
  const handleCancel = () => {
    onHide();
  }
  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="example-modal-sizes-title-lg"
    >
      <Modal.Body>
        <div className="close-btn row">
          <div className="col-11">
            <span className="text-muted">{data.product_sku}</span><br />
            <strong>{data.product_name}</strong><br />
            <span className="text-muted">{data.category_name}</span>
          </div>
          <div className="float-right col-1">
            <button onClick={handleCancel}>
              <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/reject.svg")} width="20px"
                height="20px" />
            </button>
          </div>
        </div>

        <div className="table-responsive mt-5">
          <table className="table table-bordered">
            <thead className="table-info">
              <tr>
                <th scope="col">SL.No</th>
                <th scope="col">Depot</th>
                <th scope="col">Stock</th>
              </tr>
            </thead>
            <tbody>
              {
                dataList.map((depotWiseStock, index) => (
                  <tr>
                    <th scope="row">{index + 1}</th>
                    <td>{depotWiseStock.depot_name}</td>
                    <td>{depotWiseStock.stock_qty}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </Modal.Body>
    </Modal>
  );
}
