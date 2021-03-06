import React from "react";
import className from "classnames/bind";
import styles from "./style.module.scss";

const cx = className.bind(styles);

const Button = ({ children, ...props }) => {
  return (
    <button className={cx("button")} {...props}>
      {children}
    </button>
  );
};

export default Button;
