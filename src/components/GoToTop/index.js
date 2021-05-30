import React from "react";
import className from "classnames/bind";
import styles from "./style.module.scss";
import { ArrowUpCircle, ArrowUp } from "react-feather";

const cx = className.bind(styles);

const GoToTop = () => {
  return (
    <div className={cx("btn")} onClick={() => window.scrollTo(0, 0)}>
      <ArrowUp />
      Go to top
    </div>
  );
};

export default GoToTop;
