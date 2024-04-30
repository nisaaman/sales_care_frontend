import { node } from "prop-types";
import React from "react";

export default function ReportProductCategoryTreeView(props) {
    return (
        <>
            {props.tree.map((node, index) =>
                <Node key={index} node={node} selectProductCategoryTreeNode={props.selectProductCategoryTreeNode} selectProduct={props.selectProduct} />
            )}
        </>
    );
}

function Node(props) {
    if (props.node.children.length > 0) {
        return (
            <>
                <details className="tree-nav__item is-expandable">
                    <summary className="tree-nav__item_demo tree-nav__item-title" id={"report-product-category-tree-id-" + props.node.id}>
                        <a onClick={(event) => {
                            event.preventDefault();
                            props.selectProductCategoryTreeNode(props.node)
                        }}>{props.node.name}</a>

                    </summary>
                    {props.node.children.map((node, index) =>
                        <Node key={index} node={node}
                            selectProductCategoryTreeNode={props.selectProductCategoryTreeNode}
                            selectProduct={props.selectProduct}
                        />
                    )}
                </details>
            </>
        );
    } else {
        return (
            <>
                <details className="tree-nav__item" style={{paddingLeft: "1.6rem"}}>
                    <summary className="tree-nav__item_demo tree-nav__item-title" id={"report-product-category-tree-id-" + props.node.id}>
                        <a onClick={(event) => {
                            event.preventDefault();
                            props.selectProductCategoryTreeNode(props.node)
                        }}>{props.node.name}</a>

                            
                            <div className="product-list d-none" id={"product-list-id-" + props.node.id}>
                            <div className="table-responsive scroll-product-list">
                                <table className="table text-white">
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">Product Name</th>
                                            <th scope="col">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                           props.node.productList && props.node.productList.map((product, index) => (
                                                <tr key={index}>
                                                    <th scope="row">{index + 1}</th>
                                                    <td>{product.name}</td>
                                                    <td><input type="checkbox" onClick={(event) => props.selectProduct(product)} class="product-select"/></td>
                                                </tr>

                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        
                    </summary>
                </details>
            </>
        );
    }
}
