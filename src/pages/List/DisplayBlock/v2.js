import React, { useState, useEffect } from "react";
import { ArrowDownCircle, ArrowUpCircle } from "react-feather";
import TextareaAutosize from "react-textarea-autosize";
import { shuffleArray, formatDisplayDate } from "utils/functions";

import className from "classnames/bind";
import styles from "./style.module.scss";

const cx = className.bind(styles);

const DisplayBlock = ({ selectedVocab, deleteVocab, updateVocab }) => {
  const [value, setValue] = useState(selectedVocab?.notes || "");
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    if (selectedVocab) {
      setValue(selectedVocab?.notes || "");
      setIsEdit(false);
    } else {
      setIsEdit(false);
      setValue("");
    }
  }, [selectedVocab]);

  const handlePass = (direction) => {
    if (
      selectedVocab.priority + direction < 0 ||
      selectedVocab.priority + direction > 6
    )
      return;
    updateVocab({
      priority: selectedVocab.priority + direction,
    });
  };

  const handleSave = () => {
    updateVocab({ notes: value });
    setIsEdit(false);
  };

  if (!selectedVocab) {
    return null;
  }

  return (
    <div className={cx("container")}>
      <div className={cx("word")}>
        <h3>{selectedVocab.word}</h3>
        <p>{formatDisplayDate(selectedVocab.created_at)}</p>
        {selectedVocab.updated_at && (
          <p>
            priority updated at: {formatDisplayDate(selectedVocab.updated_at)}
          </p>
        )}
        {/* <input value={selectedVocab.created_at} readOnly /> */}
      </div>
      <div className={cx("tools")}>
        {isEdit ? (
          <>
            <div onClick={handleSave}>Save</div>
            <div onClick={() => setIsEdit(false)}>Cancel</div>
            <div onClick={() => setValue("")}>Clear</div>
          </>
        ) : (
          <div onClick={() => setIsEdit(true)}>Edit</div>
        )}
        <div onClick={() => handlePass(-1)}>
          <ArrowDownCircle size={24} color="red" />
        </div>
        <div onClick={() => handlePass(1)}>
          <ArrowUpCircle size={24} color="green" />
        </div>
        <span className={cx("del")} onClick={deleteVocab}></span>
      </div>
      <div className={cx("info")}>
        {isEdit ? (
          <TextareaAutosize
            className={cx("textarea")}
            minRows={2}
            value={value}
            onChange={(evt) => setValue(evt.target.value)}
          />
        ) : (
          selectedVocab.notes && (
            <p className={cx("notes")}>{selectedVocab.notes}</p>
          )
        )}
        {selectedVocab.results.map((result, index) => (
          <>
            <div key={`result_${index}`}>
              {result.list.map((item, idx) => (
                <div
                  key={`item_${result.groupNum}_${idx}`}
                  className={cx("meaning")}
                >
                  <p>{item.partOfSpeech}</p>
                  <ul>
                    {item.definitions &&
                      item.definitions.map((def, i) => (
                        <li key={`def_${index}_${result.groupNum}_${i}`}>
                          {def.definition}
                          <p className={cx("eg")}>{def.example}</p>
                          {def.synonyms && <p>{def.synonyms.join(", ")}</p>}
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
            </div>
            <hr />
          </>
        ))}
      </div>
    </div>
  );
};

export default DisplayBlock;
