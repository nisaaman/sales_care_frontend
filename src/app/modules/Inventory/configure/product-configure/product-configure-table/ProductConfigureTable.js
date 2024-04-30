import React, { useState } from "react";
import { Route, useHistory } from "react-router-dom";
import BootstrapTable from "react-bootstrap-table-next";
import { useIntl } from "react-intl";
import paginationFactory from "react-bootstrap-table2-paginator";
import { ActionsColumnFormatter } from "./ActionsColumnFormatter";
import { CommonDeleteModal } from "../../../../Common/CommonDeleteModal";
import axios from "axios";
import { showError, showSuccess } from "../../../../../pages/Alert";

export function ProductConfigureTable({setSingleAll, singleAll, productProfileList, setProductProfileList, getBreadCrum, reloadProductList }) {
  let history = useHistory();
  const intl = useIntl();
  const [deleteId, setDeleteId] = useState(0);

  const openViewPage = (data) => {
    console.log(data);
    // history.push('/salescollection/sales/slaes-booking-view', { state: data });
  }
  
  const openEditPage = (data) => {
    const breadCrum = getBreadCrum(data.product_category_id);
    history.push({pathname: '/inventory/configure/product-configure/new', state: { data, breadCrum }});
  }
  
  const openDeleteDialog = (data) => {
    setDeleteId(data.id)
    history.push('/inventory/configure/product-configure/list/delete');
  } 

  const deleteProduct = (id) => {
    const URL = `${process.env.REACT_APP_API_URL}/api/product/${id}`;
        axios.delete(URL).then(response => {
            if(response.data.success == true){
              showSuccess(response.data.message)
              // reloadProductList('');
              const tempProductProfileList = [...productProfileList]
              const pIndex = tempProductProfileList.findIndex(obj => obj.id == id);
              tempProductProfileList.splice(pIndex,1);
              setProductProfileList(tempProductProfileList)
            }
            else{
              showError(response.data.message);
            }
        }).catch(err => {
            showError(err);
        });
    history.push('/inventory/configure/product-configure/list');
  }

  const singleWiseSelectHandler = (data, isSelect) => {
    if (isSelect == true) {
      let temp = [...singleAll]
      temp.push(data)
      setSingleAll(temp)
    } else {
      if (singleAll.length >= 0) {
        let temp = [...singleAll]
        const index = temp.findIndex(obj => obj.id == data.id);
        temp.splice(index, 1);
        setSingleAll(temp)
      }
    }
  }
  const allSelectHandler = (allData, isSelect) => {
    if (isSelect == true) {
      setSingleAll(allData)
    } else {
      if (allData.length >= 0) {
        let temp = [...singleAll]
        for (let i = 0; i < allData.length; i++) {
          const index = temp.findIndex(obj => obj.id == allData[i].id);
          temp.splice(index, 1);
          setSingleAll(temp)
        }
      }
    }
  }
  const columns = [
    {
      dataField: "product_sku",
      text: "SKU",
    },
    {
      dataField: "name",
      text: "Product Name",
      formatter : (cellContent, row) => {
        return cellContent +' '+ row.item_size+ ' ' +row.uom_name+ ' * ' +row.pack_size;
      }
    },
    {
      dataField: "action",
      text: "Actions",
      formatter: ActionsColumnFormatter,
      formatExtraData: {
        openViewPage: openViewPage,
        openEditPage: openEditPage,
        openDeleteDialog: openDeleteDialog
      },
      classes: "text-center",
      headerClasses: "text-center",
      style: {
        minWidth: "8.5rem",
      },
    },
  ];


  return (
    <>

      <Route path="/inventory/configure/product-configure/list/delete">
          {({ history, match }) => (
              <CommonDeleteModal
                  show={match != null}
                  id={deleteId}
                  deleteAction={deleteProduct}
                  onHide={() => {
                      history.push("/inventory/configure/product-configure/list");                      
                  }}
              />
          )}
      </Route>

     <BootstrapTable
        wrapperClasses="table-responsive"
        classes="table table-head-custom table-vertical-center overflow-hidden"
        bootstrap4
        bordered={false}
        keyField="id"
        data={productProfileList}
        columns={columns}
        selectRow={
          {
            mode: 'checkbox',
            onSelect: (row, isSelect, rowIndex, e) => {
              singleWiseSelectHandler(row, isSelect);
            },
            onSelectAll: (isSelect, rows, e) => {
              allSelectHandler(rows, isSelect);

            }

          }
        }

        pagination={paginationFactory({ sizePerPage: 10, showTotal: true })}
      />
    </>
  );
}
