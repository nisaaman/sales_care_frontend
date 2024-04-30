import React from "react";

export default function ReportLocationTreeView(props) {
    return (
        <>
            {props.tree.map((node, index) =>
                <Node key={index} node={node} selectLocationTreeNode={props.selectLocationTreeNode}/>
            )}
        </>
    );
}

function Node(props) {
    if (props.node.children.length > 0) {
        return (
            <>
                <details className="tree-nav__item is-expandable">
                    <summary className="d-flex justify-content-between tree-nav__item_demo tree-nav__item-title" id={"report-location-tree-view-id-"+props.node.id}>
                        <label  onClick={(event) => {
                            event.preventDefault();
                            props.selectLocationTreeNode(props.node)
                        }}>{props.node.name}</label>
                    </summary>
                    {props.node.children.map((node, index) =>
                        <Node key={index} node={node} selectLocationTreeNode={props.selectLocationTreeNode}/>
                    )}
                </details>

            </>
        );
    } else {
        return (
            <>
                <details className="tree-nav__item" style={{paddingLeft: "1.6rem"}}>
                    <summary className="d-flex justify-content-between tree-nav__item_demo tree-nav__item-title" id={"report-location-tree-view-id-"+props.node.id}>
                        <label  onClick={(event) => {
                            event.preventDefault();
                            props.selectLocationTreeNode(props.node)
                        }}>{props.node.name}</label>
                    </summary>
                </details>
            </>
        );
    }
}