import React from "react";

export default function LocationTreeView(props) {
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
                    <summary className="tree-nav__item_demo tree-nav__item-title" id={"summary-id-"+props.node.id}>
                        <label  onClick={(event) => {
                            event.preventDefault();
                            props.selectLocationTreeNode(props.node)
                        }}>{props.node.locationName}({props.node.children.length})</label>
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
                <details className="tree-nav__item"  style={{left: "1.6rem"}} >
                    <summary className="tree-nav__item_demo tree-nav__item-title" id={"summary-id-"+props.node.id}>
                        <label  onClick={(event) => {
                            event.preventDefault();
                            props.selectLocationTreeNode(props.node)
                        }}>{props.node.locationName}</label>
                    </summary>
                </details>
            </>
        );
    }
}