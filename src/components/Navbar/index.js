import React from "react";
import { Link } from "react-router-dom";
import className from "classnames/bind";
import styles from "./style.module.scss";

const cx = className.bind(styles);

const Navbar = () => {
  return (
    <nav className={cx("navbar")}>
      <h1>Vocab Tool :D</h1>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/chart">Chart</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
