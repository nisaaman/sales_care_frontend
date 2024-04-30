/* eslint-disable jsx-a11y/anchor-is-valid */
import { id } from "date-fns/locale";
import React from 'react';
import { Link } from "react-router-dom";

export function BreadCrumbs({ items, subTitle }) {
  if (!items || !items.length) {
    return "";
  }
  return (
    <ul className="breadcrumb breadcrumb-transparent breadcrumb-dot font-weight-bold my-2 p-0">
      {/* <Link className="breadcrumb-item" to="/dashboard">
        Dashboard
      </Link> */}
      {items.map((item, index) => (
        <li className="breadcrumb-item" key={index}>
          <Link
            //className="text-muted "
            to={{ pathname: item.pathname }}
          >
            {item.title}
          </Link>
        </li>
      ))}
      <li className="breadcrumb-item">
        <Link>
          {subTitle}
        </Link>
      </li>
    </ul>
  );
}
