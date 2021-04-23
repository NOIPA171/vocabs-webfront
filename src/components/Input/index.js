import React from "react";
import className from "classnames/bind";
import styles from "./style.module.scss";

const cx = className.bind(styles);

const Input = ({...props}) => {
  return (
      <input className={cx('input')} {...props} />
  );
};

export default Input;
