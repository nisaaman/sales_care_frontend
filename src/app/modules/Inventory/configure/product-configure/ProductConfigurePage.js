import React, { useRef, useState, useEffect } from "react";
import { Route } from "react-router-dom";
import {
    Card,
    CardBody,
    CardHeaderToolbar,
} from "../../../../../_metronic/_partials/controls";
import { ProductConfigureTable } from "./product-configure-table/ProductConfigureTable";
import axios from "axios";
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import LevelTreeModal from './LevelTreeModal'
import LevelSetup from './LevelSetup'
import { toAbsoluteUrl } from "../../../../../_metronic/_helpers";
import { CategoryTypeTree } from "./CategoryTypeTree"
import { showSuccess, showError } from '../../../../pages/Alert';
import { useLocation } from "react-router-dom";
import { shallowEqual, useSelector } from "react-redux";
import { set } from "lodash";
import * as XLSX from "xlsx";
import UnauthorizedPage from "../../../Common/UnauthorizedPage";
import { hasAcess } from "../../../Util";
import { event } from "jquery";

// this part is need to understand tree node
var categorTypeNode = {
    id: null,
    name: '',
    level: '',
    children: []
};

let tree = [];

const addNode = (productCategoryTree, treeLevel, locationNode) => {
    productCategoryTree.map((node) => {  // traverse every node to find match
        if (node.treeLevel === treeLevel) {
            node.children.push(locationNode);
            return;
        } else {
            addNode(node.children, treeLevel, locationNode);
            return;
        }
    });
}

export default function ProductConfigurePage(props) {
    const permissions = useSelector((state) => state.auth.user.permissions, shallowEqual);
    const companyId = useSelector((state) => state.auth.company, shallowEqual);
    const childCompanyList = useSelector((state) => state.auth.user.companies, shallowEqual);
    const selectedCompany = childCompanyList.find(it => it.id == companyId);
    const initialCategoryType = [{ id: null, name: '', level: 0, companyId: companyId, }];
    const routeProductCategory = useLocation();
    const [productCategoryTreeDepth, setProductCategoryTreeDepth] = useState();
    const initialLocationTypes = useRef(initialCategoryType);
    const [categoryTypeTree, setCategoryTypeTree] = useState(tree);
    const [isUpdate, setIsUpdate] = useState(false);
    const [productCategoryTypes, setProductCategoryTypes] = useState([]);
    const [editNode, SetEditNode] = useState({});
    const [singleAll, setSingleAll] = useState([]);
    const [categoryIds, setCategoryIds] = useState([]);
    const [reloadCategoryIds, setReloadCategoryIds] = useState([]);
    const [productProfileList, setProductProfileList] = useState([]);
    const [productProfileSearchList, setProductProfileSearchList] = useState([]);
    //const [levelSetupButtonId, setLevelSetupButtonId] = useState("update-btn");
    // const [breadCrumParentProductCategoryTypeName, setBreadCrumParentProductCategoryTypeName] = useState("sadfasf");
    // const [breadCrumParentProductCategoryName, setBreadCrumParentProductCategoryName] = useState("asfas");
    const [breadCrum, setBreadCrum] = useState([]);
    const [showProductCreateBtn, setShowProductCreateBtn] = useState(false);

    const [selectedNode, setSelectedNode] = useState({});

    const handleChange = (event) => {
        if(document.getElementById('update-btn') != null){
            document.getElementById('update-btn').style.display = 'block' 
        }
        getAllProductCategoryTypeByCompanyWise(companyId);
    };


    useEffect(() => {
        setProductCategoryTreeDepth(getProductCategoryTreeDepth(categoryTypeTree));
    });

    useEffect(() => {
        getAllProductCategoryTypeByCompanyWise(companyId);
        getAllProductCategoryTreeByCompanyWise(companyId)
        setCategoryTypeTree(tree);

    }, []);
    // useEffect(() => {
    //     getAllProductCategoryTypeByCompanyWise(companyId);
    //     getAllProductCategoryTreeByCompanyWise(companyId)
    //     setCategoryTypeTree(tree);

    // }, []);

    useEffect(() => {
        setSelectedNode({})
        getAllProductCategoryTypeByCompanyWise(companyId);
        getAllProductCategoryTreeByCompanyWise(companyId)
        setCategoryTypeTree(tree);
        setProductProfileList([]);
        setProductProfileSearchList([]);
        setShowProductCreateBtn(false);
    }, [companyId]);

    const productProfileUIEvents = {
        newCategoryAddButtonClick: () => {
            props.history.push("/inventory/configure/product-configure/list/add-category");
        },
        newProductProfileButtonClick: () => {
            const URL = `${process.env.REACT_APP_API_URL}/api/product-category-type/list-info/${companyId}`;
            axios.get(URL).then(response => {
            if (response.data.data.length > 0) {             
                if(selectedNode.treeLevel && selectedNode.treeLevel.split('-').length === response.data.data.length){
                    props.history.push({ pathname: "/inventory/configure/product-configure/new", state: { breadCrum } });
                }else{
                    showError("Please Check Level Setup"); 
                    return;
                }
            }
        });
        },
    };

    const getAllProductCategoryTypeByCompanyWise = (id) => {
        if (id) {         
        const URL = `${process.env.REACT_APP_API_URL}/api/product-category-type/list-info/${id}`;
        axios.get(URL).then(response => {
            if (response.data.data.length > 0) {
                const productCategoryTypeList = response.data.data;
                initialLocationTypes.current = productCategoryTypeList;
                setProductCategoryTypes(productCategoryTypeList);
                setIsUpdate(true);
            } else {
                initialLocationTypes.current = initialCategoryType;
                setProductCategoryTypes([]);
            }
        });}
    }


    const getAllProductCategoryTreeByCompanyWise = (id) => {
        if (id) {          
        const URL = `${process.env.REACT_APP_API_URL}/api/product-category/list-info/${id}`;
        axios.get(URL).then(response => {
            if (response.data.data.childProductCategoryDtoList.length > 0) {
                setIsUpdate(true);
                setCategoryTypeTree(response.data.data.childProductCategoryDtoList);
            } else {
                setCategoryTypeTree([]);
            }
        });  
    }
    }

    const getProductCategoryTreeDepth = (data) => {
        if (data.length === 0) {
            return 0;
        } else {
            let max = 0
            for (let i = 0; i < data.length; i++) {
                max = Math.max(max, getProductCategoryTreeDepth(data[i].children));
            }
            return 1 + max;
        }
    }

    // Get all product by category ids
    const selectProductCategoryName = (node) => {
        setSelectedNode(node)

        if (node !== '') {
            getProductCategoryIds(node);
        }

        const URL = `${process.env.REACT_APP_API_URL}/api/product-category/get-all-product?ids=${categoryIds}`
        axios.get(URL).then(response => {
            if (response.data.data) {
                setProductProfileList(response.data.data)
                setProductProfileSearchList(response.data.data)
                setCategoryIds([]);
            }
        });
    }

    // Get category id recursively
    const getProductCategoryIds = (node) => {
        let temp = [...categoryIds]
        let index = temp.findIndex(id => id === node.id)
        if (index === - 1) {
            categoryIds.push(node.id)
        }

        node.children.map(nodeChild => {
            getProductCategoryIds(nodeChild)
        })
    }

    const getBreadCrumByCategoryId = (id) => {
        let categoryNode = getCategoryNodeById(categoryTypeTree, id);
        return getBreadCrum(categoryNode);
    }

    const getCategoryNodeById = (arr, id) => {
        for (let j = 0; j < arr.length; j++) {
            if (arr[j].id == id) {
                return arr[j];
            } else {
                let val = getCategoryNodeById(arr[j].children, id)
                if (val) {
                    return val;
                }
            }
        };
    }

    const getBreadCrum = (node) => {
        setBreadCrum([])

        let level = ''
        const breadCrumTemp = new Array()
        const treeLevels = node.treeLevel.split('-')
        const treeLength = treeLevels.length

        console.log("node.children.length", node.children.length);
        console.log("node.children.treeLength", treeLength);
        console.log("productCategoryTypes.length", productCategoryTypes.length);
        setShowProductCreateBtn(node.children.length == 0 && node.id != null && treeLength == productCategoryTypes.length);
        if (treeLength > 1) {
            level = treeLevels[0]
            let rootNode = categoryTypeTree.find(obj => obj.treeLevel === level)
            breadCrumTemp.push(rootNode)

            for (let i = 1; i < treeLength - 1; i++) {
                level += '-' + treeLevels[i]
                rootNode = rootNode.children.find(obj => obj.treeLevel === level)
                breadCrumTemp.push(rootNode)
            }
        }

        breadCrumTemp.push(node)
        setBreadCrum(breadCrumTemp)

        return breadCrumTemp
    }

    const addTreeNode = (node) => { // add category type name
        let treeLength = node.treeLevel.split('-').length
        if (productCategoryTypes.length == 0 || (productCategoryTypes.length > 0 && productCategoryTypes[0].id == null)) {
            showError("Please Add Level Setup");
            return;
        } else {
            if (node.treeLevel != '') {
                node.nextCategoryType = productCategoryTypes[treeLength].name
            }

            node.action = 'add';
            props.history.push({ pathname: '/inventory/configure/product-configure/list/add-category', state: node });

            /* if (node && node.hasOwnProperty("action")) {
                node.action = 'add';
                props.history.push({ pathname: '/inventory/configure/product-configure/list/add-category', state: node });
            } else {
                props.history.push({ pathname: '/inventory/configure/product-configure/list/add-category', state: node });
            } */

        }
    }


    const updateTreeNode = (node) => {
        node.action = 'update';
        props.history.push({ pathname: '/inventory/configure/product-configure/list/add-category', state: node });
    }

    const updateNode = (productCategoryTree, treeLevel, productCategoryParams) => {
        productCategoryTree.map((node) => {  // traverse every node to find match
            if (node.treeLevel === treeLevel) {
                node.name = productCategoryParams.categoryTypeName;
                node.companyId = companyId;
                setIsUpdate(true)
                SetEditNode(node)
                return;
            } else {
                updateNode(node.children, treeLevel, productCategoryParams);
                return;
            }
        });
    }

    const deleteTreeNode = (node) => {
        deleteNode(node);
        props.history.push("/inventory/configure/product-configure/list");
    }

    function deleteCategoryTreeNode(categoryTree, treeLevel) {
        for (let i = 0; i < categoryTree.length; i++) {
            if (categoryTree[i].treeLevel === treeLevel) {
                categoryTree.splice(i, 1); //remove that node
                return;
            } else {
                deleteCategoryTreeNode(categoryTree[i].children, treeLevel);
            }
        }
    }

    const deleteNode = (node) => {
        if (node.id) {
            const URL = `${process.env.REACT_APP_API_URL}/api/product-category/${node.id}`;
            axios.delete(URL).then(response => {
                if (response.data.success == true) {
                    showSuccess(response.data.message)
                    // deleteCategoryTreeNode(categoryTypeTree, node.treeLevel);
                    setCategoryTypeTree(response.data.data.childProductCategoryDtoList);
                } else {
                    showError(response.data.message);
                }
            }).catch(err => {
                showError(err);
            });
        } else {
            deleteCategoryTreeNode(categoryTypeTree, node.treeLevel);
        }

    }

    const saveProductCategory = () => {
        let obj = {}
        obj.childProductCategoryDtoList = categoryTypeTree;
        obj.companyId = companyId;
        const URL = `${process.env.REACT_APP_API_URL}/api/product-category/create-all`;
        axios.post(URL, JSON.stringify(obj), { headers: { "Content-Type": "application/json" } }).then(response => {
            if (response.data.success == true) {
                setCategoryTypeTree(response.data.data.childProductCategoryDtoList);
                showSuccess(response.data.message)
            } else {
                showError(response.data.message);
            }
        }).catch(err => {
            showError(err);
        });
        props.history.push("/inventory/configure/product-configure/list");
    }


    const updateProductCategory = () => {
        let obj = {}
        obj.childProductCategoryDtoList = categoryTypeTree;
        obj.companyId = companyId;
        const URL = `${process.env.REACT_APP_API_URL}/api/product-category/update-all`;
        axios.put(URL, JSON.stringify(obj), { headers: { "Content-Type": "application/json" } }).then(response => {
            if (response.data.success == true) {
                setCategoryTypeTree(response.data.data.childProductCategoryDtoList);
                showSuccess(response.data.message)
            } else {
                showError(response.data.message);
            }
        }).catch(err => {
            showError(err);
        });
        props.history.push("/inventory/configure/product-configure/list");
    }

    /* const updateProductCategory = () => {
        const URL = `${process.env.REACT_APP_API_URL}/api/product-category`;
        axios.put(URL, JSON.stringify(editNode), { headers: { "Content-Type": "application/json" } }).then(response => {
            if (response.data.success == true) {
                setIsUpdate(false)
                setCategoryTypeTree(response.data.data.childProductCategoryDtoList);
                showSuccess(response.data.message)
            } else {
                showError(response.data.message);
            }
        }).catch(err => {
            showError(err);
        });
        props.history.push("/inventory/configure/product-configure/list");
    } */

    const handleCategorySubmit = () => {
        if (isUpdate) {
            updateProductCategory();
        } else {
            saveProductCategory();
        }
    }

    const exportData = (e) => {
        if (e.target.value === 'excel') {
            handleExport();
        }
    }

    const handleExport = () => {
        const data = [...singleAll];
        if (data.length === 0) {
            showError("No row is selected for export data");
            return;
        }
        let exportData = [];
        data.map(row => {
            let obj = {};
            obj.productSku = row.product_sku;
            obj.productName = row.name + ' ' + row.item_size + ' ' + row.uom_name + ' * ' + row.pack_size;
            obj.expiryDays = row.expiry_days;
            obj.minimumStock = row.minimum_stock;
            exportData.push(obj);
            setSingleAll([]);
        })
        const workbook = XLSX.utils.book_new();
        const Heading = [
            ["Product SKU", "Product Name", "Expiry Days", "Minimum Stock"]
        ];
        const worksheet = XLSX.utils.json_to_sheet(exportData, { origin: 'A2', skipHeader: true });

        // creating sheet and adding data from 2nd row of column A.
        // Leaving first row to add Heading
        XLSX.utils.sheet_add_aoa(worksheet, Heading, { origin: 'A1' });

        /* const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        for (let i = 0; i < Heading.length; i++) {
            worksheet[letters.charAt(i).concat('1')].s = {
                font: {
                    name: 'arial',
                    sz: 10,
                    bold: true,
                    color: "#F2F2F2"
                },
            }
        } */

        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, "ProductProfileList.xlsx");
    }
    const handleSearchChange = (event) => {
        let value = event.target.value;
        getSearchList(value);
    }
    const getSearchList = (searchText) => {
        let searchTextValue = searchText.toLowerCase();
        let tp = [];
        for (let i = 0; i < productProfileSearchList.length; i++) {
            let productSku = productProfileSearchList[i].product_sku.toLowerCase();
            let productName = (productProfileSearchList[i].name+' '+ productProfileSearchList[i].item_size+ ' ' +productProfileSearchList[i].uom_name+ ' * ' +productProfileSearchList[i].pack_size).toLowerCase();
            if (productSku.includes(searchTextValue)
                ||productName.includes(searchTextValue)
                ) {
                tp.push(productProfileSearchList[i]);
            }
        }
        setProductProfileList(tp);
    }
    return (
        <>
            <Route path="/inventory/configure/product-configure/list/add-category">
                {({ history, match }) => (

                    <LevelTreeModal
                        node={routeProductCategory.state}
                        show={match != null}
                        onHide={() => {
                            history.push("/inventory/configure/product-configure/list");
                        }}
                        handleSubmit={(productCategoryParams) => {
                            let productCategoryTree = categoryTypeTree;
                            if (typeof routeProductCategory.state !== 'undefined' && routeProductCategory.state.action === 'update') {  // for update existing
                                updateNode(productCategoryTree, routeProductCategory.state.treeLevel, productCategoryParams);
                            } else { // for add new// for add new
                                let treeLevel = ''
                                let categorTypeNode = {
                                    id: null,
                                    name: productCategoryParams.categoryTypeName,
                                    treeLevel: treeLevel,
                                    typeName: routeProductCategory.state.nextCategoryType,
                                    children: []
                                };

                                if (routeProductCategory.state.treeLevel === '') {  //  top layer node add
                                    treeLevel = '' + (categoryTypeTree.length + 1);
                                    categorTypeNode.treeLevel = treeLevel;
                                    productCategoryTree.push(categorTypeNode);
                                } else {  // any child node add
                                    treeLevel = routeProductCategory.state.treeLevel + '-' + (routeProductCategory.state.children.length + 1);
                                    categorTypeNode.treeLevel = treeLevel;
                                    addNode(productCategoryTree, routeProductCategory.state.treeLevel, categorTypeNode);
                                }
                            }

                            history.push("/inventory/configure/product-configure/list");
                        }}
                    />
                )}
            </Route>
            <div style={{ marginTop: "-30px", marginLeft: "-18px" }}>
                <nav aria-label="breadcrumb">
                    <ol class="breadCrum-bg-color">
                        <li aria-current="page" className='breadCrum-main-title'>{selectedCompany?.name}</li>
                        <li aria-current="page" className='mt-1 breadCrum-sub-title'>&nbsp;Inventory&nbsp;&nbsp;&nbsp;&nbsp;</li>
                        <li aria-current="page" className='mt-1 breadCrum-sub-title text-primary'><span className='font-weight-bolder'>.</span>&nbsp; Configure &nbsp;&nbsp;</li>
                        <li aria-current="page" className='mt-1 breadCrum-sub-title text-primary'><span className='font-weight-bolder'>.</span>&nbsp; Product Configure</li>
                    </ol>
                </nav>
            </div>

            {hasAcess(permissions, 'PRODUCT_CONFIGURE') ?
                <Card>
                    <CardBody>
                        <div className="row">
                            <div className="col-lg-4 border border-left-0 border border-light border-primary border-bottom-0 border-top-0">
                                <Tabs
                                    defaultActiveKey="levelTree" id="tab" className="mr-5 pr-5 mb-5 tabs-class"
                                    centered
                                    onClick={handleChange}
                                >
                                    <Tab eventKey="levelTree" title="Level Tree">
                                        <div className='mt-5'>
                                            <img src={toAbsoluteUrl("/images/loc1.png")}
                                                style={{ width: "20px", height: "20px", textAlign: "center" }} alt='Company Picture' />

                                            <button
                                                type="button"
                                                className="btn ml-0 btn-sm"
                                                onClick={(event) => {
                                                    event.preventDefault();
                                                    addTreeNode({ nextCategoryType: productCategoryTypes.length > 0 ? productCategoryTypes[0].name : '', treeLevel: '', children: [] }); //most top level
                                                }}
                                            >
                                                <i className="bi bi-plus-circle-fill text-primary" style={{ fontSize: "20px", marginLeft: "-4px" }}></i>
                                            </button>
                                        </div>
                                        <nav className="tree-nav">
                                            <CategoryTypeTree
                                                tree={categoryTypeTree}
                                                addTreeNode={addTreeNode}
                                                updateTreeNode={updateTreeNode}
                                                maxDepth={productCategoryTypes.length}
                                                deleteTreeNode={deleteTreeNode}
                                                selectProductCategoryName={selectProductCategoryName}
                                                getBreadCrum={getBreadCrum}
                                            />
                                        </nav>
                                        <button
                                            type="button"
                                            className="btn btn-primary  btn-sm float-right ml-3 mt-5 "
                                            onClick={handleCategorySubmit}

                                        >
                                            {(categoryTypeTree.length > 0) ? 'Update' : 'Save'}
                                        </button>
                                    </Tab>
                                    <Tab
                                        eventKey="levelSetup"
                                        title="Level Setup"
                                    >
                                        <LevelSetup
                                            setProductCategoryTypes={setProductCategoryTypes}
                                            maxDepth={productCategoryTreeDepth}
                                            productCategoryTypeDtoList={initialLocationTypes.current}
                                        />
                                    </Tab>
                                </Tabs>
                            </div>
                            <div className="col-lg-8">
                                <Card className="cardBackground">
                                    <div className="product-profile-breadcrum ">
                                        <nav aria-label="breadcrumb">
                                            <ol class="breadCrum-bg-color">
                                                {breadCrum.length > 0 && breadCrum.map((row, index) => {
                                                    return (
                                                        <>
                                                            <li key={index} aria-current="page" className='mt-1 breadCrum-sub-title' style={{ fontSize: "13px" }}>
                                                                <span><i class="bi bi-chevron-right"></i></span>&nbsp;
                                                                <span>{row.typeName} &nbsp;</span>
                                                                <span className="text-primary">{row.name}</span>
                                                            </li>
                                                        </>
                                                    )
                                                })}
                                            </ol>
                                        </nav>
                                    </div>
                                    <CardBody>
                                        <div className="row">
                                            <div className="col-xl-5">
                                                <span className="create-field-title">Product Profile List</span>
                                                <p style={{ color: "#B6B6B6" }}>Total {productProfileList.length} products </p>
                                                <div>
                                                    <form className="form form-label-right">
                                                        <input type="text" className="form-control" name="searchText"
                                                        placeholder="Search Here" style={{ paddingLeft: "28px" }}
                                                        onChange={handleSearchChange}
                                                        />
                                                    </form>
                                                </div>
                                            </div>
                                            <div className="col-xl-7 d-flex justify-content-end">
                                                <div className="mr-5">
                                                    <CardHeaderToolbar
                                                        title="Add Profile"
                                                    >
                                                        {showProductCreateBtn ?
                                                            <button
                                                                tree={categoryTypeTree}
                                                                type="button"
                                                                className="btn btn-primary"
                                                                onClick={productProfileUIEvents.newProductProfileButtonClick}
                                                            >
                                                                + New Product Profile
                                                            </button> : ''}
                                                    </CardHeaderToolbar>
                                                </div>
                                                <div style={{ marginRight: "20px" }}>
                                                    <select className="form-control" aria-label="Default select example" onChange={exportData}>
                                                        <option selected>Export</option>
                                                        <option value="excel">Excel</option>
                                                        {/* <option value="2">Two</option> */}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <ProductConfigureTable setSingleAll={setSingleAll} singleAll={singleAll}
                                            productProfileList={productProfileList} setProductProfileList={setProductProfileList}
                                            getBreadCrum={getBreadCrumByCategoryId} reloadProductList={selectProductCategoryName} />
                                    </CardBody>
                                </Card>
                            </div>
                        </div>
                    </CardBody>
                </Card>
                : <UnauthorizedPage />}
        </>
    );
}