import { node } from "prop-types";
import React from "react";

export default function ProductCategoryTreeView(props) {
    return (
        <>
            {props.tree.map((node, index) =>
                <Node key={index} node={node} selectProductCategoryTreeNode={props.selectProductCategoryTreeNode} />
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
                        <a onClick={(event) => {
                            event.preventDefault();
                            props.selectProductCategoryTreeNode(props.node)
                        }}>{props.node.name}</a>
                    </summary>
                    {props.node.children.map((node, index) =>
                        <Node key={index} node={node}
                              selectProductCategoryTreeNode={props.selectProductCategoryTreeNode}/>
                    )}
                </details>
            </>
        );
    } else {
        return (
            <>
                <details className="tree-nav__item">
                    <summary className="tree-nav__item_demo tree-nav__item-title" id={"summary-id-"+props.node.id}>
                        <a onClick={(event) => {
                            event.preventDefault();
                            props.selectProductCategoryTreeNode(props.node)
                        }}>{props.node.name}</a>
                    </summary>
                </details>
            </>
        );
    }
}
