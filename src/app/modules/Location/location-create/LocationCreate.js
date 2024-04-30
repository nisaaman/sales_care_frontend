import React, {useEffect, useRef, useState} from 'react';
import {NavLink, Route, useLocation} from "react-router-dom";
import {makeStyles} from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import {Card, CardBody,} from "../../../../_metronic/_partials/controls";
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import {toAbsoluteUrl} from "../../../../_metronic/_helpers";
import LevelTreeModal from './LevelTreeModal'
import LevelSetup from './LevelSetup'
import {showError} from '../../../pages/Alert';
import axios from "axios";
import LocationTree from './LocationTree';

const useStyles = makeStyles(theme => ({
    root: {
        width: '90%',
    },
    button: {
        marginTop: theme.spacing(1),
        marginRight: theme.spacing(1),
    },
    actionsContainer: {
        marginBottom: theme.spacing(2),
    },
    resetContainer: {
        padding: theme.spacing(3),
    },
}));


// this part is need to understand tree node
var locationNode = {
    id: null,
    name: '',
    level: '',
    children: []
};

var tree = [];

function addNode(locTree, treeLevel, locationNode) {
    locTree.map((node) => {  // traverse every node to find match
        if (node.treeLevel === treeLevel) {
            node.children.push(locationNode);
            return;
        } else {
            addNode(node.children, treeLevel, locationNode);
            return;
        }
    });
}

function updateNode(locTree, treeLevel, locationParams) {
    locTree.map((node) => {  // traverse every node to find match
        if (node.treeLevel === treeLevel) {
            node.name = locationParams.locationName;
            return;
        } else {
            updateNode(node.children, treeLevel, locationParams);
            return;
        }
    });
}

function deleteNode(locTree, treeLevel) {
    for (let i = 0; i < locTree.length; i++) {
        if (locTree[i].treeLevel === treeLevel) {
            locTree.splice(i, 1); //remove that node
            return;
        } else {
            deleteNode(locTree[i].children, treeLevel);
        }
    }
}

export function LocationCreate(props) {
    const classes = useStyles();
    const [successImg, setSuccessImg] = useState(toAbsoluteUrl("/images/success2.png"));
    const [activeStep, setActiveStep] = useState(0);
    const initialLocationTypes = useRef([{name: '', level: 0}]);
    const [locationTypes, setLocationTypes] = useState([]);
    const [locationTreeName, setLocationTreeName] = useState({name: ""});
    const [locationTree, setLocationTree] = useState(tree);
    const [locationTreeDepth, setLocationTreeDepth] = useState(0);
    const [isUpdate, setIsUpdate] = useState(false);
    const steps = [`Location Tree`, 'Completed'];
    const routeLocation = useLocation();
    const [responseData, setResponseData] = useState();
    const subsTitle = ["Set Business Location Tree", "Woah, we are here"];
    const [deleteLocation, setDeleteLocation] = useState([]);

    useEffect(() => {
        setLocationTreeDepth(getLocationTreeDepth(locationTree));
    });
    useEffect(() => {
        if (routeLocation.state) { // at the time of edit
            getProps();
            setIsUpdate(true);
        } else {  // at the time of add
            setLocationTree(tree);
            tree = []; //state clear #NGLSC-2259
        }
    }, []);

    const getProps = () => {
        const editObj = routeLocation.state.row;
        getAllLocationRelatedInfoByLocationTreeId(editObj.id);
    }

    const getAllLocationRelatedInfoByLocationTreeId = (id) => {
        const URL = `${process.env.REACT_APP_API_URL}/api/location-tree/info/${id}`;
        if (id) {
         
        axios.get(URL).then(response => {
            const masterLocation = response.data.data.locationTreeName;
            const locationTypeList = response.data.data.locationTypeList;
            const locationAsTree = response.data.data.locationAsTree;
            setLocationTreeName(masterLocation);

            initialLocationTypes.current = locationTypeList; // it need for initial list populate
            setLocationTypes(locationTypeList);              // this state need for sending data to backend

            setLocationTree(locationAsTree);
        });   
    }
    }

    const addTreeNode = (node) => {
        if (locationTypes.length == 0) {
            showError("Please Add Location Type");
            return;
        } else if (isAnyLocationTypeFieldEmpty(locationTypes)) {
            return;
        }
        props.history.push({pathname: '/location/new/new-location', state: node});
    }

    const updateTreeNode = (node) => {
        node.action = 'update';
        props.history.push({pathname: '/location/new/new-location', state: node});
    }

    const deleteTreeNode = (node) => {
        let locTree = locationTree;
        deleteNode(locTree, node.treeLevel);
        props.history.push("/location/new");
    }

    function getLocationTreeDepth(treeArray) {
        if (treeArray.length === 0) {
            return 0;
        } else {
            let max = 0;
            for (let i = 0; i < treeArray.length; i++) {
                max = Math.max(max, getLocationTreeDepth(treeArray[i].children));
            }
            return 1 + max;
        }
    }

    const isAnyLocationTypeFieldEmpty = (listOfFields = []) => {
        let empty = false;
        let length = listOfFields.length;
        if (length === 0) {
            showError("Location Type is empty at Level 1");
            empty = true;
        }
        for (let i = 0; i < length; i++) {
            if (typeof (listOfFields[i].name) === "undefined" || listOfFields[i].name.trim() === '') {
                empty = true;
                showError("Location Type is empty at Level " + (i + 1)); // level is start from 1 , not from 0
                break;
            }
        }
        return empty;
    }

    const isLocationTreeNameFieldEmpty = () => {
        let empty = false;
        if (typeof (locationTreeName.name) === "undefined" || locationTreeName.name.trim() === '') {
            empty = true;
            showError("Location Tree Name is empty");
        }
        return empty;
    }

    const isLocationTreeEmpty = () => {
        let empty = false;
        if (locationTree.length == 0) {
            showError("Location Tree is empty");
            empty = true;
        }
        return empty;
    }

    const isValidate = () => {
        let valid = true;
        if (isLocationTreeNameFieldEmpty()) {
            valid = false;
            return valid;
        }
        if (isAnyLocationTypeFieldEmpty(locationTypes)) {
            valid = false;
            return valid;
        }
        if (isLocationTreeEmpty()) {
            valid = false;
            return valid;
        }
        return valid;
    }

    const getLocationNameObject = () => {
        return {
            name: locationTreeName.name,
            description: null
        };
    }

    const getLocationTypeList = () => {
        let locationTypeList = [];
        for (let i = 0; i < locationTypes.length; i++) {
            locationTypeList[i] = {
                id: locationTypes[i].id,
                name: locationTypes[i].name.trim(),
                level: i + 1
            }
        }
        return locationTypeList;
    }

    const getLocationTree = () => {
        return locationTree;
    }

    const setFormRelatedStateToEmpty = () => {
        setLocationTreeName("");
        setLocationTypes([]);
        setLocationTree([]);
        setIsUpdate(false);
    }

    const handleNext = () => {
        if (isUpdate) { // at the time of update
            updateLocationTree();
        } else {                    // at the time of save
            saveLocationTree();
        }
    }

    const saveLocationTree = () => {
        if (!isValidate()) {
            return 0;
        }
        const URL = `${process.env.REACT_APP_API_URL}/api/location-tree`;
        const masterLocationObject = getLocationNameObject();
        masterLocationObject.locationTypeList = getLocationTypeList();
        masterLocationObject.locationTree = getLocationTree();
        axios.post(URL, JSON.stringify(masterLocationObject), {headers: {"Content-Type": "application/json"}}).then(response => {
            setResponseData(response.data);
            if (response.data.success == true) {
                setActiveStep(prevActiveStep => prevActiveStep + 1);
                setFormRelatedStateToEmpty();
                if (activeStep === 0) {
                    document.getElementById('nextBtn').style.visibility = 'hidden';
                    document.getElementById('backBtn').style.visibility = 'hidden';
                    document.getElementById('gotItBtn').style.visibility = 'visible';
                }
            } else {
                showError(response.data.message);
                //showError("Cannot Save Location Tree");
            }
        }).catch(err => {
            showError(err);
        });
    }

    const updateLocationTree = () => {
        let locationTypes = getLocationTypeList()
        let array = locationTypes.filter(n=>!deleteLocation.includes(n.id))
        if (!isValidate()) {
            return 0;
        }
        const URL = `${process.env.REACT_APP_API_URL}/api/location-tree`;
        const masterLocationObject = locationTreeName; // assign from state
        masterLocationObject.locationTypeList = array;
        masterLocationObject.locationTree = getLocationTree();
        axios.put(URL, JSON.stringify(masterLocationObject), {headers: {"Content-Type": "application/json"}}).then(response => {
            setResponseData(response.data);
            if (response.data.success == true) {
                setActiveStep(prevActiveStep => prevActiveStep + 1);
                setFormRelatedStateToEmpty();
                if (activeStep === 0) {
                    document.getElementById('nextBtn').style.visibility = 'hidden';
                    document.getElementById('backBtn').style.visibility = 'hidden';
                    document.getElementById('gotItBtn').style.visibility = 'visible';
                }
            } else {
                showError(response.data.message);
                //showError("Unable to update Location profile");
            }
        }).catch(err => {
            showError(err);
        });
    }

    const getStepContent = (step) => {
        switch (step) {
            case 0:
                return <div className='steper-height ml-5'>
                    <div>
                        <span className="create-field-title">Business Location Tree</span>
                        <p style={{color: "#B6B6B6"}}>If you need more info, please check out <NavLink
                            to="/location/list" className="faq-title"><u>FAQ Page</u></NavLink></p>
                    </div>

                    <div className='row'>
                        <div className='form-group col-xl-12 first-level-top'>
                            <label className='level-title'>Name the business location tree<span className="text-danger">*</span></label>
                            <input type="text" className='form-control' value={locationTreeName.name}
                                   onChange={(event) => setLocationTreeName({
                                       ...locationTreeName,
                                       name: event.target.value
                                   })} placeholder='Business Location Tree 1' maxLength={100}></input>
                        </div>
                    </div>
                    <div className='row' style={{marginTop: "30px"}}>
                        <div className='form-group col-xl-12'>
                            <label className='level-title'>Custom Business Location Tree Setup</label>
                        </div>
                    </div>
                    {/* LEVEL ROW START */}
                    <div className='row margin-top-minus-25'>
                        <div className='col-xl-5'>
                            <label className='tree-level'>
                                <img src={toAbsoluteUrl("/images/loc2.png")}
                                     style={{width: "12px", height: "10px", textAlign: "center"}}
                                     alt='Company Picture'/>
                                <strong style={{marginLeft: "10px", color: "#828282"}}>Location Type Setup</strong>
                            </label>
                        </div>
                        <div className='col-xl-7'>
                            <label className='tree-level'>
                                <img src={toAbsoluteUrl("/images/loc3.png")}
                                     style={{width: "14px", height: "14px", textAlign: "center"}}
                                     alt='Company Picture'/>
                                <strong style={{marginLeft: "10px", color: "#828282"}}>Location Tree</strong>
                            </label>
                        </div>
                    </div>
                    {/* LEVEL ROW END */}

                    {/* CONTENT ROW START */}
                    <div className='row g-0'>
                        <div
                            className='form-group col-lg-5 border border-left-0 border border-light border-primary border-bottom-0'>
                            <div className='mt-4'>
                                <LevelSetup setLocationTypes={setLocationTypes}
                                            maxDepthOfLocationTree={locationTreeDepth}
                                            locationTypes={initialLocationTypes.current}
                                            deleteLocation = {deleteLocation}
                                            setDeleteLocation = {setDeleteLocation}
                                            />
                            </div>
                        </div>
                        <div
                            className='col-lg-7 border border-left-0 border border-light border-primary border-bottom-0 border-right-0'>
                            <div>
                                <div className='mt-5'>
                                    <img src={toAbsoluteUrl("/images/loc1.png")}
                                         style={{width: "20px", height: "20px", textAlign: "center"}}
                                         alt='Company Picture'/>

                                    <button
                                        type="button"
                                        className="btn ml-0 btn-sm"
                                        onClick={(event) => {
                                            event.preventDefault();
                                            addTreeNode(); //most top level
                                        }}
                                    >
                                        <i className="bi bi-plus-circle-fill text-primary"
                                           style={{fontSize: "20px", marginLeft: "-4px"}}></i>
                                    </button>
                                </div>

                                {/*tree start*/}

                                <nav className="tree-nav">
                                    <LocationTree tree={locationTree} addTreeNode={addTreeNode}
                                                  updateTreeNode={updateTreeNode} deleteTreeNode={deleteTreeNode}
                                                  maxDepth={locationTypes.length}/>

                                </nav>
                            </div>
                        </div>
                    </div>
                    {/* CONTENT ROW END */}
                </div>;
            default:
                return <div className='row steper-height ml-5'>
                    <div className='col-lg-12' style={{textAlign: "center", marginTop: "10px"}}>
                        <img
                            src={successImg}
                            style={{width: "84px", height: "84px", textAlign: "center"}} alt='Company Picture'/>
                        <div className='mt-5'>
                            <p style={{marginBottom: "0px"}} className="create-field-title">Thank You</p>
                            <span className='text-muted'>{responseData ? responseData.message : ""}</span>
                        </div>
                        <div className='thanks-sub-title mt-12'>
                            <strong style={{fontSize: "0.813rem"}}>Business Location Tree</strong>
                        </div>
                        <div>
                            <span className="chip thanks-chip-title"
                                  style={{padding: "10px 20px"}}>{responseData ? responseData.data.name : ""}</span>
                        </div>
                    </div>
                </div>;
        }
    }

    const backToListPage = () => {
        props.history.push("/location/list");
    }

    return (
        <>
            <Route path="/location/new/new-location">
                {({history, match}) => (
                    <LevelTreeModal
                        node={routeLocation.state}
                        show={
                            match != null
                        }
                        onHide={() => {
                            history.push("/location/new");
                        }}
                        handleSubmit={(locationParams) => {
                            let locTree = locationTree;
                            if (typeof routeLocation.state !== 'undefined' && routeLocation.state.action === 'update') {  // for update existing
                                updateNode(locTree, routeLocation.state.treeLevel, locationParams);
                            } else { // for add new
                                let treeLevel = ''
                                let locationNode = {
                                    id: null,
                                    name: locationParams.locationName,
                                    treeLevel: treeLevel,
                                    children: []
                                };
                                if (typeof routeLocation.state === 'undefined') {  //  top layer node add
                                    treeLevel = '' + (locationTree.length + 1);
                                    locationNode.treeLevel = treeLevel;
                                    locTree.push(locationNode);
                                } else {  // any child node add
                                    treeLevel = routeLocation.state.treeLevel + '-' + (routeLocation.state.children.length + 1);
                                    locationNode.treeLevel = treeLevel;
                                    addNode(locTree, routeLocation.state.treeLevel, locationNode);
                                }
                            }

                            history.push("/location/new");
                        }}
                    />
                )}
            </Route>
            <div style={{marginTop: "-30px", marginLeft: "-18px"}}>
                <nav aria-label="breadcrumb">
                    <ol className="breadCrum-bg-color">
                        <li aria-current="page" className='breadCrum-main-title'>Company</li>
                        <li aria-current="page" className='mt-1 breadCrum-sub-title'>&nbsp;Location
                            tree&nbsp;&nbsp;&nbsp;&nbsp;</li>
                        <li aria-current="page" className='mt-1 breadCrum-sub-title text-primary'><span
                            className='font-weight-bolder'>.</span>&nbsp; Create New Business Location Tree &nbsp;&nbsp;
                        </li>
                    </ol>
                </nav>
            </div>
            <Card>
                <CardBody>
                    <div className="row">
                        <div
                            className="col-lg-3 border border-left-0 border border-light border-primary border-bottom-0 border-top-0">
                            <NavLink to="/location/list">
                                <span><i className="bi bi-chevron-left"></i></span> &nbsp; Back to List of Location Tree
                            </NavLink>
                            <div className={classes.root}>
                                <Stepper activeStep={activeStep} orientation="vertical">
                                    {steps.map((label, index) => (
                                        <Step key={label}>
                                            <StepLabel optional={<Typography
                                                variant="caption">{subsTitle[index]}</Typography>}>{label}</StepLabel>
                                        </Step>
                                    ))
                                    }
                                </Stepper>
                            </div>
                        </div>
                        <div className="col-lg-9">
                            <Typography>{getStepContent(activeStep)}</Typography>
                            <div className={classes.actionsContainer}>
                                <div>
                                    <Button
                                        style={{visibility: "hidden"}}
                                        id="backBtn"
                                        disabled={activeStep === 0}
                                        className={classes.button}
                                    >
                                        Back
                                    </Button>
                                    <Button
                                        id="nextBtn"
                                        disabled={activeStep === steps.length}
                                        variant="contained"
                                        color="primary"
                                        onClick={handleNext}
                                        className="float-right"
                                    >
                                        {activeStep === steps.length - 2 ? isUpdate === true ? 'Update' : 'Save' : 'Next'}
                                    </Button>
                                    <div style={{textAlign: 'center'}}>
                                        <Button
                                            style={{visibility: "hidden"}}
                                            className='gotIt-btn'
                                            id="gotItBtn"
                                            variant="contained"
                                            color="primary"
                                            onClick={backToListPage}
                                        >
                                            Got it
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardBody>
            </Card>
        </>
    );
}