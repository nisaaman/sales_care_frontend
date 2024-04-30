import React from "react";

export  function CategoryTypeTree(props) {
    return (
        <>
            {props.tree.map((node, index) =>
                <Node key={index} node={node} addTreeNode={props.addTreeNode} updateTreeNode={props.updateTreeNode} getBreadCrum={props.getBreadCrum}
                      deleteTreeNode={props.deleteTreeNode} maxDepth={props.maxDepth} selectProductCategoryName={props.selectProductCategoryName} />
            )}
        </>
    );
}

function Node(props) {
    if (props.maxDepth === props.node.treeLevel.split('-').length) {
        return (
            <>
                <details className="tree-nav__item">
                    <summary className="tree-nav__item-title d-flex justify-content-between">
                       <div>
                       <label
                        style={{cursor: "inherit"}} 
                            onClick={(event) => {
                            event.preventDefault();
                            props.getBreadCrum(props.node)
                            props.selectProductCategoryName(props.node)
                            }}
                        >   {props.node.name}
                        </label>
                       </div>
                        <div  id="action-div">
                            <button
                                type="button"
                                onClick={(event) => {
                                    event.preventDefault();
                                    props.updateTreeNode(props.node)
                                }}
                                className="btn btn-sm  btn-size"><i
                                className="bi bi-pencil-square text-info"></i></button>
                            <button
                                type="button"
                                className="btn  btn-sm btn-size"
                                onClick={(event) => {
                                    event.preventDefault();
                                    props.deleteTreeNode(props.node)
                                }}
                            ><i className="bi bi-trash3-fill text-danger"></i></button>
                        </div>
                    </summary>
                </details>
            </>
        );

    } else if (props.node.children.length > 0) {
        return (
            <>
                <details className="tree-nav__item is-expandable">
                    <summary className="tree-nav__item-title d-flex justify-content-between">
                        <div><label
                        style={{cursor: "inherit"}}
                         onClick={(event) => {
                            event.preventDefault();
                            props.getBreadCrum(props.node)
                            props.selectProductCategoryName(props.node)
                            }} 
                        >{props.node.name}</label></div>
                        <div id="action-div">
                            <button
                                type="button"
                                id="view-btn"
                                className="btn btn-sm ml-2 btn-size"
                                onClick={(event) => {
                                    event.preventDefault();
                                    props.addTreeNode(props.node)
                                }}
                            ><i className="bi bi-plus-circle-fill text-warning"></i>
                            </button>
                            <button
                                id="edit-btn"
                                type="button"
                                onClick={(event) => {
                                    event.preventDefault();
                                    props.updateTreeNode(props.node)
                                }}
                                className="btn btn-sm  btn-size"><i
                                className="bi bi-pencil-square text-info"></i></button>
                            <button
                                id="delete-btn"
                                type="button"
                                onClick={(event) => {
                                    event.preventDefault();
                                    props.deleteTreeNode(props.node)
                                }}
                                className="btn  btn-sm btn-size"
                            ><i className="bi bi-trash3-fill text-danger"></i></button>
                        </div>
                    </summary>
                    {props.node.children.map((node, index) =>
                        <Node key={index} node={node} maxDepth={props.maxDepth}
                              addTreeNode={props.addTreeNode}
                              updateTreeNode={props.updateTreeNode}
                              deleteTreeNode={props.deleteTreeNode}
                              getBreadCrum={props.getBreadCrum}
                              selectProductCategoryName={props.selectProductCategoryName}
                              />
                    )}
                </details>

            </>
        );
    } else {
        return (
            <>
                <details className="tree-nav__item is-expandable">
                    <summary className="tree-nav__item-title d-flex justify-content-between">
                        <div>
                        <label 
                        style={{cursor: "inherit"}}
                         onClick={(event) => {
                            event.preventDefault();
                            props.getBreadCrum(props.node)
                            props.selectProductCategoryName(props.node)
                            }}
                        >{props.node.name}</label>
                        </div>
                        <div id="action-div">
                            <button
                                type="button"
                                className="btn btn-sm ml-2 btn-size"
                                onClick={(event) => {
                                    event.preventDefault();
                                    props.addTreeNode(props.node)
                                }}
                            ><i className="bi bi-plus-circle-fill text-warning"></i>
                            </button>
                            <button
                                type="button"
                                onClick={(event) => {
                                    event.preventDefault();
                                    props.updateTreeNode(props.node)
                                }}
                                className="btn btn-sm  btn-size"><i
                                className="bi bi-pencil-square text-info"></i></button>
                            <button
                                type="button"
                                className="btn  btn-sm btn-size"
                                onClick={(event) => {
                                    event.preventDefault();
                                    props.deleteTreeNode(props.node)
                                }}
                            ><i className="bi bi-trash3-fill text-danger"></i></button>
                        </div>
                    </summary>
                </details>
            </>
        );
    }
}