import React, { useState } from "react";
import { ChevronDown } from "react-feather";
import className from "classnames/bind";
import styles from "./style.module.scss";

const cx = className.bind(styles);

const Dropdown = ({ options, title, onChange }) => {
  const [isFocus, setIsFocus] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(options[0]);
  return (
    <div
      tabIndex="1"
      onFocus={() => {
        setIsOpen(true);
        setIsFocus(1);
      }}
      onClick={() => {
        setIsFocus(2);
        if (isFocus <= 1) return;
        setIsOpen(!isOpen);
      }}
      onBlur={() => {
        setIsOpen(false);
        setIsFocus(0);
      }}
      className={cx("wrapper")}
    >
      <div className={cx("title")}>
        {selected.value} <ChevronDown />
      </div>
      {isOpen && (
        <div className={cx("options")}>
          {options.map((opt, idx) => {
            return (
              <div
                className={cx("opt")}
                key={`option_${idx}`}
                onClick={(evt) => {
                  evt.preventDefault();
                  evt.stopPropagation();
                  onChange(opt.key);
                  setSelected(opt);
                  setIsOpen(false);
                }}
              >
                {opt.value}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
