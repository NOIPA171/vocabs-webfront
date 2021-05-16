import React, { useState } from "react";
import { Trash2, ArrowDownCircle, ArrowUpCircle, ArrowUp } from "react-feather";
import { formatDisplayDate } from "utils/functions";

import className from "classnames/bind";
import styles from "./style.module.scss";

const cx = className.bind(styles);

const getRandomIdx = (arr) => Math.round(Math.random() * (arr?.length - 1));

const Card = ({ data, deleteVocab, updateVocab, handleOpen, isActive }) => {
  const getRandomExample = () => {
    if (!data) return "";
    const randomGroupIdx = getRandomIdx(data.results);
    const randomGroup = data.results[randomGroupIdx].list;
    const randomTypeIdx = getRandomIdx(randomGroup);
    const randomDefIdx = getRandomIdx(randomGroup[randomTypeIdx].definitions);
    return randomGroup[randomTypeIdx].definitions[randomDefIdx].example || "";
  };

  const [example, setExample] = useState(() => getRandomExample());

  const handlePass = (evt, direction) => {
    evt.preventDefault();
    evt.stopPropagation();
    if (data.priority + direction < 0 || data.priority + direction > 6) return;
    updateVocab({
      priority: data.priority + direction,
    });
  };

  if (!data) {
    return null;
  }
  return (
    <div
      className={cx("container", `priority${data.priority}`, {
        active: isActive,
      })}
      onClick={handleOpen}
    >
      <div className={cx("word")}>
        <div className={cx("info")}>
          <h3>{data.word}</h3>
          <span>{formatDisplayDate(data.created_at)}</span>
        </div>
        <p className={cx("eg")}>{example}</p>
      </div>
      <div className={cx("tools")}>
        <span
          className={cx("del")}
          onClick={(evt) => {
            evt.preventDefault();
            evt.stopPropagation();
            deleteVocab();
          }}
        >
          <Trash2 color="#fff" size={18} />
        </span>
        <span onClick={(evt) => handlePass(evt, -1)}>
          <ArrowDownCircle color="#fff" size={18} />
        </span>
        <span onClick={(evt) => handlePass(evt, 1)}>
          <ArrowUpCircle color="#fff" size={18} />
        </span>
      </div>
    </div>
  );
};

export default Card;
