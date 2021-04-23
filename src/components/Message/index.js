import React from "react";
import className from "classnames/bind";
import styles from "./style.module.scss";

const cx = className.bind(styles);

const Message = ({ data, ...props }) => {
  const getMessage = () => {
    let message = "";
    switch (data.status) {
      case "error":
        message = "Error, please check your spelling";
        break;
      case "dupe":
        message = `You've already added ${data.word}! Priority now at ${data.priority}`;
        break;
      default:
    }
    return message;
  };

  if (!data) {
    return null;
  }

  return <div className={cx("message")}>{getMessage()}</div>;
};

export default Message;
