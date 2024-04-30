import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../../../_metronic/_helpers"
import { Card } from "react-bootstrap";
import { CardBody } from "../../../../../../../_metronic/_partials/controls";
import ProductCategoryTreeView from '../../../../../SalesCollection/CommonComponents/ProductCategoryTreeView';
import { shallowEqual, useSelector } from "react-redux";
import axios from "axios";
import { showError, showSuccess } from '../../../../../../pages/Alert';
import Autocomplete from "@material-ui/lab/Autocomplete";
import { TextField } from "@material-ui/core";
import { allowOnlyNumeric, handlePasteDisable } from "../../../../../Util";

export default function NewStoreMovement() {
    //const companyId = useSelector((state) => state.auth.company, shallowEqual);
    let history = useHistory();
    const location = useLocation();
    const [value, setValue] = React.useState(null);
    const companyId = location.state.companyId;
    const userLoginId = location.state.userLoginId;
    const depotId = location.state.depotId;

    const [productsList, setProductsList] = useState([]);
    const [selectedProductId, setSelectedProductId] = useState();
    const [producCategoryTree, setProductCategoryTree] = useState([]);
    const [batchNoList, setBatchNoList] = useState([]);
    const [batchInfo, setBatchInfo] = useState({});
    const [cartList, setCartList] = useState([]);
    const [storeList, setStoreList] = useState([]);
    const [fromStoreId, setFromStoreId] = useState();
    const [toStoreId, setToStoreId] = useState();
    const [depotInfo, setDepotInfo] = useState();
    //const [depotId, setDepotId] = useState();
    const [productCategoryId, setProductCategoryId] = useState();
    const [fromStoreType, setFromStoreType] = useState();
    const [toStoreType, setToStoreType] = useState();
    const [fromStoreName, setFromStoreName] = useState('');
    const [toStoreName, setToStoreName] = useState('');
    const [searchParams, setSearchParams] = useState({userLoginId: userLoginId, companyId: companyId,
            depotId: depotId, productCategoryId: productCategoryId});
    const [quantity, setQuantity] = useState();
    const [availableStockQuantity, setAvailableStockQuantity] = useState('');
    const [availableFailQuantity, setAvailableFailQuantity] = useState('');
    const [reason, setReason] = useState('');
    const [interStoreStockMovement, setInterStoreStockMovement] = useState({reason:reason, note:"", depotId: depotId,
    companyId:companyId});
    const [invTransactionDto, setInvTransactionDto] = useState({transactionType:"INTER_STORE_MOVEMENT", companyId:companyId});

    useEffect(() => {
        document.getElementById('full-screen-close-icon').style.display = "none";
    }, [])
    useEffect(() => {
        getProductCategoryTreeList(companyId);
        getStoreList()
        getDepotInfo(companyId, userLoginId)
    }, [companyId])

    useEffect(() => {
        setBatchNoList([]);
        setBatchInfo({})
        setValue('');
        setAvailableStockQuantity('')
        setSelectedProductId('')
        setProductsList([])
        setCartList([]);
        document.getElementById("transferQuantity").value = '';
    }, [fromStoreId])

    useEffect(() => {
        setBatchNoList([]);
        setBatchInfo({...batchInfo, batchNo:'',batchQuantity:''})
        setValue('');
        setAvailableStockQuantity('')
        document.getElementById("transferQuantity").value = '';
        setSelectedProductId('');
        const getElements = document.getElementsByClassName('order-list-div');

        for (var i = 0; i < getElements.length; i++) {
            getElements[i].classList.remove('select-order-list');
        }
        var cbs = document.getElementsByClassName("all-radio");
        for (var i = 0; i < cbs.length; i++) {
            cbs[i].checked = false;
        }
    }, [productCategoryId])    

    const handleBackToListPage = () => {
        history.push('/inventory/stock/stock-store/stock-store-movement');
    }
    const openFullscreen = () => {
        const elem = document.getElementById("myFullScreen");
        elem.classList.add("scroll-product-search");
        elem.requestFullscreen();
        document.getElementById('full-screen-icon').style.display = "none"
        document.getElementById('full-screen-close-icon').style.display = "inline-block"
    }
    const closeFullscreen = () => {
        const elem = document.getElementById("myFullScreen");
        elem.classList.remove("scroll-product-search");
        document.exitFullscreen();
        document.getElementById('full-screen-icon').style.display = "inline-block"
        document.getElementById('full-screen-close-icon').style.display = "none"
    }

    const getStoreList = () => {
        const URL = `${process.env.REACT_APP_API_URL}/api/store/`;
        axios.get(URL).then(response => {
            setStoreList(response.data.data);
        }).catch(err => {
            
        });
    }

    const getDepotInfo = (companyId, userLoginId) => {
        const URL = `${process.env.REACT_APP_API_URL}/api/depot/user-depot/${companyId}/${userLoginId}`;
        axios.get(URL).then(response => {
            setDepotInfo(response.data.data);
            //setDepotId(response.data.data.id);
            
            setSearchParams({...searchParams, depotId:response.data.data.id})
        }).catch(err => {
            
        });
    }
    
    const getProductCategoryTreeList = (params) => {
        const URL = `${process.env.REACT_APP_API_URL}/api/product-category/list-info/` + params;
        if (params) {
        axios.get(URL).then(response => {
            setProductCategoryTree(response.data.data.childProductCategoryDtoList);
        }).catch(err => {
            showError("Can not get product category tree data.");
        });}
    }


    const selectTreeNode = (node) => {
        setProductCategoryId(node);
        const paramsData = {...searchParams, productCategoryId:node.id}
        if(fromStoreType) {
            getDepotWiseStockDetails(paramsData)
        } else {
            showError("Please Select Store")
        }
        
    }


    const getDepotWiseStockDetails = (params) => {
    
        let queryString = "?";
        queryString += "&companyId="+params.companyId;
        queryString += "&userLoginId="+params.userLoginId;
        queryString += params.productCategoryId ? "&productCategoryId="+params.productCategoryId : '';

        const URL = `${process.env.REACT_APP_API_URL}/api/stock/depot-wise-stock-data`+queryString;
        axios.get(URL).then((response) => {
            setProductsList(response.data.data);
            
        }).catch();
    }

    const handleSelectProduct = (number, productId) => {
        
        if(selectedProductId !== productId) {
            setBatchNoList([]);
            setBatchInfo({...batchInfo, batchNo:'',batchQuantity:''})
            setValue('');
            setAvailableStockQuantity('');
            setAvailableFailQuantity('');
            //setSelectedProductedId(productId);
            setSelectedProductId(productId)
        }
        
        document.getElementById("transferQuantity").value = '';
        let id = "product-id-" + number;
        const getId = document.getElementById(id);
        const getElements = document.getElementsByClassName('order-list-div');
        for (var i = 0; i < getElements.length; i++) {
            getElements[i].classList.remove('select-order-list');
        }
        // FOR RADIO BTN
        let radioId = "product-radio-id-" + number;
        const getRadioId = document.getElementById(radioId);
        var cbs = document.getElementsByClassName("all-radio");
        for (var i = 0; i < cbs.length; i++) {
            cbs[i].checked = false;
        }
        if (getId.className == "select-order-list") {
            getId.classList.remove('select-order-list');
            getRadioId.checked = false;
            setBatchNoList([])
        } else {
            getId.classList.add('select-order-list');
            getRadioId.checked = true;
            getProductLatestBatchInfo(productId);
        }
        storeWiseBatchDataSource(productId);

    }
    const getProductLatestBatchInfo = (productId) => {
        let temp = [...productsList]
        let index = temp.findIndex((obj) => obj.productId === productId);
        //setBatchNoList(temp[index].batchList)
        //setBatchInfo(temp[index].batchList[0]);
    }

    const handleAddCart = (data) => {
        // FIND PRODUCT INFO INTO PRODUCT ARRAY LIST
        
        if(fromStoreId === undefined || fromStoreId === "") {
            showError("Please Select From Store");
            return false;
        }
        if(toStoreId === undefined || toStoreId === "") {
            showError("Please Select To Store");
            return false;
        }

        if(cartList.findIndex(obj => obj.batchId == data.batchId) != -1) {
            showError("Already Added Into Cart");
            return;
        }

        if(!quantity) {
            showError("Please enter quantity");
            return;
        }

        if(quantity !== undefined && (quantity) !== "" && parseFloat(quantity) !=0 && fromStoreId && toStoreId) {
            const productListTemp = [...productsList];
            const index = productListTemp.findIndex(obj => obj.productId === data.productId);
            if(index > -1){
            // const batchListTemp = [...productListTemp[index].batchList];
            // const batchIndex = batchListTemp.findIndex(obj=> obj.id === data.id)
            // batchListTemp[batchIndex].confirm=true;
            setBatchInfo({...batchInfo, confirm: true})
            //setBatchNoList(setBatchInfo) 
            const pName = productListTemp[index].productName;
            const productId = productListTemp[index].productId;
            const pSku = productListTemp[index].productSku;
            const pCategory = productListTemp[index].productCategory;
            const WAR = productListTemp[index].weightedAverageRate;
                
            // ADD TO CART LIST ARRAY
            const tempCart = [...cartList]
            tempCart.push({
                ...data,
                "pSku": pSku,
                "productId": productId, 
                "pName": pName,
                "pCategory": pCategory,
                "rate": WAR,
                "batchId": data.batchId,
                "batchNo": batchInfo.batchNo,
                "batchQuantity": batchInfo.batchQuantity,
                "quantity": quantity,
                "fromStoreId": fromStoreId,
                "toStoreId" : toStoreId
            })
            setCartList(tempCart)
            }
        }
        
    }
    const handleCartRemove = (data) =>{
       // FIND PRODUCT INFO INTO PRODUCT ARRAY LIST
       const productListTemp = [...productsList];
       const index = productListTemp.findIndex(obj => obj.productId === data.productId);
       
       if(index > -1){
        //const batchListTemp = [...productListTemp[index]];
        //const batchIndex = batchListTemp.findIndex(obj=> obj.productId === data.productId)
        //batchListTemp[batchIndex].confirm=false;
        setBatchInfo({...batchInfo, confirm: false})
        

         // ADD TO CART LIST ARRAY
         const tempCart = [...cartList]
         const cartIndex = tempCart.findIndex(obj=> obj.productId === data.productId && obj.productId === data.productId) 
         tempCart.splice(cartIndex, 1)
         setCartList(tempCart)
       }
    }
    const handleSearch = (event) =>{
        if(event.target.value !== "" || event.target.value !== undefined){
            document.getElementById('autocomplete-id').classList.add('d-none')
        }
    }

    const handleFromStore = (event) => {
        const fromStoreId = event.target.value;
        setFromStoreId(fromStoreId);
         
        if( (fromStoreId && toStoreId) && fromStoreId === toStoreId) {
            document.getElementById("fromStoreId").selectedIndex = ''
            showError("From Store And To Store Can't be Same");
            setFromStoreId('');
            setFromStoreType('');
            setFromStoreName('')
            return false;
        }
        
        if (fromStoreId) {
            const fromStoreTypeIndex = storeList.findIndex(obj => obj.id== fromStoreId);
            setFromStoreType(storeList[fromStoreTypeIndex].storeType);
            setFromStoreName(storeList[fromStoreTypeIndex].name) 
        }
        else {
            setFromStoreType('');
            setFromStoreName('')
        }       

        setBatchNoList([]);
        setBatchInfo({...batchInfo, batchNo:'',batchQuantity:''})
        setValue('');
        setAvailableStockQuantity('')
    }

    const handleToStore = (event) => {
        const toStoreId = event.target.value;
        //const index  = event.nativeEvent.target.selectedIndex;
        setAvailableFailQuantity('');
        clearTextField();

        if(toStoreId === '') {
            setToStoreId('');
            setToStoreType(''); 
            setToStoreName('');
            return false;
        }

        if(!batchInfo.batchId) {
            document.getElementById("toStoreId").selectedIndex = ''
            setToStoreType(''); 
            setToStoreName('');
            setToStoreId('');
            showError("Provide Batch Information First");
            return false;
        }

        if(fromStoreId === undefined || fromStoreId === '') {
            document.getElementById("toStoreId").selectedIndex = ''
            showError("Select From Store First");
            return false;
        }

        setToStoreId(toStoreId);

        if( (fromStoreId && toStoreId) && toStoreId === fromStoreId) {
            document.getElementById("toStoreId").selectedIndex = ''
            showError("To Store And From Store Can't be Same");
            setToStoreType(''); 
            setToStoreName('');
            setToStoreId('');
            return false;
        }
        
        const fromStoreTypeIndex = storeList.findIndex(obj => obj.id== fromStoreId);
        const toStoreTypeIndex = storeList.findIndex(obj => obj.id== toStoreId);
        const fromStoreType = storeList[fromStoreTypeIndex].storeType;
        
        const selectedStoreType = storeList[toStoreTypeIndex].storeType;
        
        if (toStoreId) {
            setToStoreType(selectedStoreType);
            setToStoreName(storeList[toStoreTypeIndex].name)
        }
        else {
            setToStoreType(''); 
            setToStoreName('')
        }
        
        if(selectedStoreType === 'RESTRICTED') {
            getQCStockQCInfo(batchInfo);
        }
        
        if(fromStoreType && (fromStoreType === 'RESTRICTED' && selectedStoreType === 'REGULAR') 
            || selectedStoreType === 'IN_TRANSIT' || (fromStoreType === 'IN_TRANSIT' && selectedStoreType ==='REGULAR')) {
            document.getElementById("toStoreId").selectedIndex = ''
            setToStoreId();
            setToStoreType(''); 
            setToStoreName('');
            showError("Can't Transfer From '" +fromStoreType +" to "+selectedStoreType+" Store");
        }
        
    }

    const batchNoDataSource = (event) => {

        let queryString = "?";
        queryString += selectedProductId ? "productId="+selectedProductId : '';
        queryString += "&searchString="+event.target.value
        if (selectedProductId) {
         
        const URL = `${process.env.REACT_APP_API_URL}/api/batch/auto-complete-data`+queryString;
        axios.get(URL).then(response => {
    
            setBatchNoList(response.data.data);
            
        }).catch(err => {
    
        });   
    }
    }

    const storeWiseBatchDataSource = (productId) => {
        
        let queryString = "?";
        queryString += "companyId="+companyId;
        queryString += "&depotId="+depotId;
        queryString += productId ? "&productId="+productId : '';
        queryString += "&storeType="+fromStoreType;
        queryString += "&searchString=" + '';
       
        if (productId) {        
            const URL = `${process.env.REACT_APP_API_URL}/api/batch/depot-and-product-and-store-wise-info`+queryString;
            axios.get(URL).then(response => {
        
                setBatchNoList(response.data.data);
                
            }).catch(err => {
        
            });
        }
    }

    const getQCStockQCInfo = (batchInfo) => {
        let queryString = "?";
        queryString += "companyId="+companyId;
        queryString += "&depotId="+depotId;
        queryString += selectedProductId ? "&productId="+selectedProductId : '';
        queryString += "&storeType="+fromStoreType;
        queryString += "&batchId="+batchInfo.batchId;
        queryString += "&qaStatus="+'FAILED';
     
        const URL = `${process.env.REACT_APP_API_URL}/api/inter-store-stock-movement/depot-and-product-and-store-wise-qc-info`+queryString;
        axios.get(URL).then(response => {
    
            setAvailableFailQuantity(response.data.data.available_qc_quantity ? response.data.data.available_qc_quantity : 0);
            
        }).catch(err => {
    
        });
    }

    const handleQuantity = (event,batchId) => {
        
        //let alreadyAddedQuantityInCart = 0;

        const alreadyAddedInCart = cartList.filter((cart) => cart.batchId == batchId);
        let alreadyAddedQuantityInCart = alreadyAddedInCart.reduce((total,cart) => parseInt(cart.quantity) + total, 0);
        
        const quantity = event.target.value;
        
        if(parseInt(quantity) > (parseInt(toStoreType === "RESTRICTED" ? availableFailQuantity : availableStockQuantity) - parseInt(alreadyAddedQuantityInCart))) {
           document.getElementById("transferQuantity").value = '';
           showError("Transfer Quantity Exceeded Stock Quantity...")
           return false;
        }
        setQuantity(quantity);
       //setInvTransactionDetails([{...invTransactionDetails, quantity:event.target.value}])
   }

    const interStoreMovementSubmit = () => {

        const storeMovementData = {...interStoreStockMovement, depotId:depotId}
        const transactionDetails = [...cartList]
        
        if(transactionDetails.length === 0) {
            showError("Please Add Product To Cart to Continue...")
            return false;
        }

        if(reason.trim() === "") {
            showError("Please Add Reason for Stock Movement...")
            return false;
        }

        //if(invReceive.depotId && toStoreId && quantity && rate) {
            saveInterStoreStockMovement(storeMovementData, invTransactionDto, transactionDetails)
        //}
    }
    
    const saveInterStoreStockMovement = (storeMovementData, invTransactionDto, invTransactionDetails) => {
        
        const URL = `${process.env.REACT_APP_API_URL}/api/inter-store-stock-movement`;
        axios.post(URL, JSON.stringify({
            ...storeMovementData,
            invTransactionDto: invTransactionDto,
            invTransactionDetailsDtoList: invTransactionDetails
        }), {headers: {"Content-Type": "application/json"}}).then(response => {
        
            if (response.data.success === true) {
                showSuccess(response.data.message)
                //setSelectedProductId();
                //setProductsList([])
                setCartList([]);
                setBatchNoList([]);
                setValue('');
                setQuantity('');
                setBatchInfo({...batchInfo, batchNo:'', batchQuantity:''})
                setAvailableStockQuantity('');
                setProductsList([]);
                setReason('');
                setToStoreType(''); 
                setToStoreName('');
                setToStoreId('');
                document.getElementById("transferQuantity").value = '';
                document.getElementById("noteId").value = '';
                document.getElementById("reasonId").value = ''; 
                document.getElementById("toStoreId").selectedIndex = '';

               
            } else {
                showError(response.data.message);
            }
        }).catch(err => {
            showError("Cannot be Submitted");
        });
    }

    const setReasonInfo = (event) => {
        setReason(event.target.value);
        setInterStoreStockMovement({...interStoreStockMovement, reason: event.target.value})
    }

    const setNote = (event) => {
        setInterStoreStockMovement({...interStoreStockMovement, note: event.target.value})
    }

    const handleCancelChange = () =>{
       
        // batch.map((batch,index) => {
           
        //     batch.addToCart = false

        // })
        setBatchInfo({...batchInfo, confirm: false})
        setCartList([])
    }

    const clearTextField = () => {
        document.getElementById("transferQuantity").value = '';
        setQuantity('');
    }
    return (
        <>
            <div className="container-fluid" id="myFullScreen" style={{ background: "#f3f6f9" }}>
                {/* HEADER ROW */}
                <div className="approval-view-header">
                    {/* BACK AND TITLE ROW */}
                    <div className="row">
                        <div className="col-3">
                            <span>
                                <button className='btn' onClick={handleBackToListPage}>
                                    <strong>
                                        <i className="bi bi-arrow-left-short" style={{ fontSize: "30px" }}></i>
                                    </strong>
                                </button>
                            </span>
                        </div>
                        <div className="col-6 text-center mt-4">
                            <strong>Inter Store Stock Movement</strong>
                        </div>
                        <div className="col-3 text-right text-muted">
                            <button id="full-screen-icon" className="btn text-white" onClick={openFullscreen}>
                                <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/full-screen.svg")} />
                            </button>
                            <button id="full-screen-close-icon" className="btn text-white" onClick={closeFullscreen}>
                                <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/full-screen-close.svg")} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* FROM TO AND ADDITIONAL INFO ROW */}
                <div className="bg-white">
                    <div className="container-fluid">
                        <div className="row justify-content-between pt-5 pb-5">
                            {/* FROM ROW */}
                            <div className="col-xl-3 mt-5">
                                <strong class="mt-5 dark-gray-color">From</strong><br />
                                <span>
                                    <div className="row">
                                        <div className="col-3 mt-3">
                                            <label className="dark-gray-color">Store</label>
                                        </div>
                                        <div className="col-9">
                                            <select className="border-0 form-control" id="fromStoreId" onChange={handleFromStore}>
                                                <option value="" selected>Select From Store</option>
                                                {storeList.map( store => (
                                                    <option value={store.id} >{store.name +" ("+store.storeType+")"}</option>
                                                    )
                                                )}
                                            </select>
                                        </div>
                                    </div>
                                </span>
                            </div>
                           
                            {/* TO ROW */}
                            <div className="offset-xl-6 col-xl-3 mt-5">
                                <strong class="mt-5 dark-gray-color">To</strong><br />
                                <span>
                                    <div className="row">
                                        <div className="col-3 mt-3">
                                            <label className="dark-gray-color">Store</label>
                                        </div>
                                        <div className="col-9">
                                            <select className="border-0 form-control" id="toStoreId" onChange={handleToStore}>
                                                <option value="" selected>Select To Store</option>
                                                {storeList.map( store => (
                                                    <option value={store.id} >{store.name +" ("+store.storeType+")"}</option>
                                                    )
                                                )}
                                            </select>
                                        </div>
                                    </div>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* MAIN CONTENT ROW */}
                <div className="row mt-5">
                    <div className="col-xl-9">
                        {/*TITLE ROW */}
                        <div>
                            <Card className="h-100" style={{ borderTopLeftRadius: "30px", borderTopRightRadius: "30px" }}>
                                <CardBody>
                                    <div>
                                        <span className="text-muted">Title</span><br />
                                        <strong>Inter Store Stock Movement</strong>
                                    </div>
                                    <div className="row no-gutters mt-5">
                                        <div className="col-3">
                                            <span className="text-muted"><strong>CATEGORY</strong></span>
                                        </div>
                                        <div className="col-4">
                                            <span className="text-muted"><strong>PRODUCTS</strong></span>
                                        </div>
                                        <div className="col-5">
                                            <span className="text-muted ml-5"><strong>BATCHES</strong></span>
                                            <span className="text-muted float-right"><strong>ACTION</strong></span>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </div>
                        {/* SEARCH OR SCAN ROW */}
                        <div className="mt-5">
                            <div style={{ position: "absolute", padding: "7px", marginTop: "7px" }}>
                                <img src={toAbsoluteUrl("/images/search.png")} width="20px" height="20px" />
                            </div>
                            <form className="form form-label-right">
                                <input type="text" className="form-control h-50px" name="searchText"
                                    placeholder="Scan/Search Product by QR Code or Name" style={{ paddingLeft: "28px" }} onChange={(event)=>handleSearch(event)}/>
                            </form>
                            <div style={{ float: "right", padding: "7px", marginTop: "-42px" }}>
                                <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/barcode.svg")} width="20px" height="20px" />
                            </div>
                        </div>
                        <div className="row mb-5">
                            {/* CATEGORY ROW */}
                            <div className="col-xl-3">
                                <Card className="mt-5">
                                    <CardBody>
                                        <ProductCategoryTreeView
                                            tree={producCategoryTree}
                                            selectProductCategoryTreeNode={selectTreeNode}
                                        />
                                    </CardBody>
                                </Card>
                            </div>

                            {/* PRODUCTS ROW */}
                            <div className="col-xl-4">
                                {
                                    productsList.map((product, index) => (
                                        fromStoreType==='QUARANTINE' && product.quarantineStock > 0 
                                        || fromStoreType==='RESTRICTED' && product.restrictedStock > 0 
                                        || fromStoreType==='REGULAR' && product.regularStock > 0 
                                        ?
                                        <div className="order-list-div" style={{ cursor: "pointer" }} onClick={() => handleSelectProduct(index, product.productId)} id={"product-id-" + index}>
                                            <Card className="p-3 mt-5">
                                                <CardBody>
                                                    {/* RADIO BTN ROW */}
                                                    <div className="position-absolute" style={{ left: "17px", top: "43px" }}>
                                                        <span><input className="all-radio" type="radio" id={"product-radio-id-" + index} /></span>
                                                    </div>
                                                    {/* PRODUCT INFO ROW */}
                                                    <div className="mt-1">
                                                        <span className="float-right">
                                                            <span className="text-muted mr-1">Rate</span>
                                                            <strong>{product.weightedAverageRate.toFixed(2)}</strong>
                                                        </span>
                                                        <span className="text-muted">{product.productSku}</span><br />
                                                        <strong>{product.productName}</strong><br />
                                                        <span className="text-muted">{product.productCategory}</span><br />
                                                    </div>
                                                    <div className="mt-5" style={{ border: "1px solid #F2F2F2", width: "100%" }}></div>
                                                    {/* STOCK QTY ROW */}
                                                    <div className="mt-3">
                                                        <span className="dark-gray-color mr-2">
                                                            <SVG className="mr-2" src={toAbsoluteUrl("/media/svg/icons/project-svg/total-gray.svg")} />
                                                            Stock Qty.
                                                        </span>
                                                        <strong>
                                                            {
                                                                fromStoreType === "REGULAR" ? product.regularStock :
                                                                fromStoreType === "IN_TRANSIT" ? product.inTransitStock :
                                                                fromStoreType === "RESTRICTED" ? product.restrictedStock :
                                                                fromStoreType === "QUARANTINE" ? product.quarantineStock : ""
                                                            }
                                                            
                                                            {/* {product.regularStock ? product.regularStock : 0}(Pcs) */}
                                                        </strong>
                                                    </div>
                                                </CardBody>
                                            </Card>
                                        </div>
                                        : ''
                                    ))
                                }
                            </div>

                            {/* BATCHES ROW */}
                            <div className="col-xl-5">
                                {/* SEARCH BATCH */}
                                <Card className="mt-5" id="autocomplete-id">
                                    <CardBody>
                                        <Autocomplete
                                            options={batchNoList}
                                            freeSolo
                                            //onKeyUp={storeWiseBatchDataSource}
                                            getOptionLabel={(option) => option.batchNo}
                                            value={value}
                                            onChange={(event, newValue) => {
                                                if (newValue) {
                                                    setValue(newValue)
                                                    setBatchInfo(newValue);
                                                    setAvailableStockQuantity(newValue.availableStockQuantity);
                                                    getQCStockQCInfo(newValue);
                                                    clearTextField();
                                                }
                                            }}
                                            renderInput={(params) => (
                                                <TextField {...params} label="Batch" id="batch-search" />
                                            )}
                                        />
                                    </CardBody>
                                </Card>
                                {/* BATCH INFO ROW */}
                                <Card className="mt-5  pt-3">
                                    <CardBody>
                                        <div>
                                            <div className="row">
                                                <div className="col-8">
                                                <span className="text-muted mr-2">Batch No:</span>
                                                <strong className="display-inline-block">{batchInfo.batchNo}</strong>
                                                </div>
                                                <div className="col-4 text-right">
                                                {
                                                    Object.keys(batchInfo).length === 0 ? "" :
                                                        batchInfo.confirm ?
                                                            <span id="transferred" select="false" className="float-right light-success-bg dark-success-color p-3 mt-n3 rounded">Transfered</span> :
                                                            <span id="transfer" className="float-right" >
                                                                <button className="btn text-white float-right mt-n3" style={{ background: "#6FCF97" }} onClick={() => handleAddCart(batchInfo)}>
                                                                    <SVG className="mr-2" src={toAbsoluteUrl("/media/svg/icons/project-svg/white-receive.svg")} />
                                                                    Transfer
                                                                </button>
                                                            </span>
                                                }
                                                </div>
                                            </div>
                                        </div>
                                        {/* BATCH QTY ROW */}
                                        <div className="mt-5">
                                            <div className="row">
                                                <div className="col-8">
                                                    {/* <span className="text-muted">Transfer Qty:</span> */}
                                                </div>
                                                <div className="col-4 text-right">
                                                    <input className="w-100"  type="text" placeholder="Trans. Qty." id="transferQuantity" 
                                                    name="transferQuantity" maxLength={9} onChange={(e) => handleQuantity(e, batchInfo.batchId)} 
                                                    onKeyPress={e => allowOnlyNumeric(e)} 
                                                    onPaste={handlePasteDisable}/>
                                                </div>
                                            </div>
                                            <div>
                                                <span className="text-muted mr-2">Batch Qty:</span>
                                                <strong>{batchInfo.batchQuantity}</strong>
                                            </div>
                                            <div>
                                                <span className="text-muted mr-2">Stock Qty:</span>
                                                <strong>{toStoreType === "RESTRICTED" ? availableFailQuantity : availableStockQuantity}</strong>
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card> :
                            </div>
                        </div>
                    </div>

                    {/*CART ROW */}
                    <div className="col-xl-3">
                        {/* CART TITLE ROW */}
                        <Card style={{ borderTopRightRadius: "30px", borderTopLeftRadius: "30px" }}>
                            <CardBody>
                                <div>
                                    <span className="text-muted">Title</span><br />
                                    <strong>{fromStoreName} to {toStoreName}</strong>
                                </div>
                                <div className="mt-5">
                                    <span className="text-muted"><strong>PRODUCTS</strong></span>
                                    <span className="text-muted float-right"><strong>ACTION</strong></span>
                                </div>
                            </CardBody>
                        </Card>
                        {/* ADD DATA INTO CART ROW */}
                        <div className="mt-4">
                            {
                                cartList.map((obj, index) => (
                                    <Card className="mt-5">
                                        <CardBody>
                                            <div className="d-flex">
                                                <div className="ml-n3 mt-3"><span className="rounded light-gray-bg pl-2 pr-2">{index + 1}</span></div>
                                                <div className="w-100 pl-5">
                                                    <div>
                                                        <button className="btn float-right" style={{ background: "#F9F9F9", color: "#0396FF" }} onClick={()=>handleCartRemove(obj)}>
                                                            <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/red-delete.svg")} />
                                                        </button>
                                                    </div>
                                                    <div>
                                                        <span className="text-muted">{obj.pSku}</span><br />
                                                        <strong>{obj.pName}</strong><br />
                                                        <span className="text-muted">{obj.pCategory}</span><br />
                                                    </div>
                                                    <div className="mt-5">
                                                        <span>
                                                            <span className="mr-2 text-muted">Batch</span>
                                                            <strong className="display-inline-block">{obj.batchNo}</strong>
                                                        </span>
                                                        <span >
                                                            <span className="mr-2 text-muted"> Batch Qty.</span>
                                                            <strong>{obj.batchQuantity}</strong>
                                                        </span>
                                                    </div>
                                                    <div className="mt-5" style={{ border: "1px solid #F2F2F2", width: "100%" }}></div>

                                                    {/* TOTAL QTY ROW */}
                                                    <div className="mt-3">
                                                        <span>
                                                            <SVG className="mr-1" src={toAbsoluteUrl("/media/svg/icons/project-svg/price-gray.svg")} />
                                                            <span className="mr-2 text-muted">Current W.A. Rate</span>
                                                            <strong>{obj.rate.toFixed(2)}</strong>
                                                        </span>
                                                        <span ><br></br>
                                                            <span className="mr-2 text-muted">Transfer Qty.</span>
                                                            <strong>{obj.quantity}</strong>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardBody>
                                    </Card>
                                ))
                            }
                        </div>
                        {/* REASON AND NOTES CART */}
                        <Card className="mt-4">
                            <CardBody>
                                {/* REASON ROW */}
                                <div className="mt-3">
                                    <label className="dark-gray-color">Reason*</label>
                                    <textarea type="text" id="reasonId" className="form-control" rows="5" maxLength={200}
                                    onChange={setReasonInfo} placeholder="Write here..." />
                                </div>
                                {/* NOTES ROW */}
                                <div className="mt-3">
                                    <label className="dark-gray-color">Note</label>
                                    <textarea type="text" id="noteId" className="form-control" rows="5" 
                                    maxLength={200} placeholder="Write here..." />
                                </div>
                                <div className="mt-5" style={{ border: "1px solid #F2F2F2", width: "100%" }}></div>
                                <div className="mt-5">
                                    <strong>Total Qty.</strong>
                                    <strong className="float-right">{cartList.reduce((total, cart) => total = total + parseInt(cart.quantity),0)}</strong>
                                </div>
                            </CardBody>
                        </Card>
                        {/* TOTAL QTY CART ROW */}
                        <Card className="mt-5 mb-5" style={{ borderBottomRightRadius: "30px", borderBottomLeftRadius: "30px" }}>
                            <CardBody>
                                <div>
                                    <button className="btn dark-danger-color" onClick={handleCancelChange} style={{ background: "#F9F9F9", color: "#0396FF" }}>
                                        <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/reject.svg")} />
                                        &nbsp;<strong>Cancel</strong>
                                    </button>
                                    <button className="btn text-white mr-3 float-right" onClick={interStoreMovementSubmit} style={{ background: "#6FCF97" }}>
                                        <SVG src={toAbsoluteUrl("/media/svg/icons/project-svg/white-receive.svg")} />
                                        &nbsp;<strong>Stock Move</strong>
                                    </button>
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}