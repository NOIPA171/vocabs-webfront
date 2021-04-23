import React, { useEffect, useState, useRef } from "react";
import Card from "components/Card";
import Message from "components/Message";
import DisplayBlock from "components/DisplayBlock";
import Button from "components/Button";
import Input from "components/Input";
import Dropdown from "components/Dropdown";

import { priorityList } from "./lists";
import moment from "moment-timezone";
import className from "classnames/bind";
import styles from "./style.module.scss";

const cx = className.bind(styles);

const sortList = (list) => list.sort((a, b) => b.priority - a.priority);
const setStorage = (list) =>
  localStorage.setItem("vocabs", JSON.stringify(list));

export default function App() {
  const fullList = useRef(JSON.parse(localStorage.getItem("vocabs") || "[]"))
  const [keyword, setKeyword] = useState("");
  const [display, setDisplay] = useState(null);
  const [list, setList] = useState(fullList.current);
  const [filterPrrty, setFilterPrrty] = useState(null)
  const [isLoading, setIsLoading] = useState(false);

  const [openIndex, setOpenIndex] = useState(-1);

  useEffect(() => {
    setList(prev => {
      if(filterPrrty === null){
        return fullList.current
      }
      return fullList.current.filter(vocab => {
        return vocab.priority === filterPrrty
      })
    })
  }, [filterPrrty])

  const getListDatesData = () => {
    return list.reduce((obj, currValue) => {
      const date = currValue.created_at;
      obj[date] = (obj[date] || 0) + 1;
      return obj;
    }, {});
  };

  const setData = (list) => {
    setStorage(list);
    setList(list);
    fullList.current = list
  };

  const fetchData = async () => {
    setIsLoading(true);
    if (!keyword.trim().length) return;
    await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en_US/${keyword}`)
      .then((res) => res.json())
      .then((res) => {
        if (res[0]) {
          setVocab({
            ...res[0],
            status: "success",
            priority: 3,
            created_at: moment().format("YYYY/MM/DD"),
          });
          //has word
        } else {
          setDisplay({ status: "error", word: keyword });
        }
        setIsLoading(false);
      });
  };

  const setVocab = (newVocab) => {
    const list = JSON.parse(localStorage.getItem("vocabs") || "[]");
    const duplicateIndex = list.findIndex(
      (vocab) => vocab.word === newVocab.word
    );
    if (duplicateIndex === -1) {
      list.unshift(newVocab);
      setDisplay(newVocab);
    } else {
      const currPriority = list[duplicateIndex].priority;
      list[duplicateIndex].priority = currPriority > 5 ? 5 : currPriority + 1;
      list.unshift(list[duplicateIndex]);
      list.splice(duplicateIndex + 1, 1);
      setDisplay({ ...list[duplicateIndex], status: "dupe" });
    }
    setOpenIndex(0);
    setData(list);
  };

  const deleteVocab = (index) => {
    setOpenIndex(-1);
    setList((prev) => {
      const newList = prev.concat([]);
      newList.splice(index, 1);
      setStorage(newList);
      return newList;
    });
  };

  const updateVocab = (index, data) => {
    setList((prev) => {
      const currList = prev.concat([]);
      const curr = currList[index];
      currList.splice(index, 1, { ...curr, ...data });
      setStorage(currList);
      return currList;
    });
  };

  const handleOpen = (vocab, index) => {
    setOpenIndex((prev) => (prev === index ? -1 : index));
  };

  const handlePriority = (evt, direction, data) => {
    evt.preventDefault();
    evt.stopPropagation();
    if (data.priority + direction < 0 || data.priority + direction > 5) return;
    updateVocab({
      priority: data.priority + direction,
    });
  };

  return (
    <div className="App">
      <nav>
        <h1>Vocab Tool :D</h1>
      </nav>
      <div className={cx("bar")}>
        <Input
          value={keyword}
          onChange={(evt) => setKeyword(evt.target.value)}
          onKeyDown={(evt) => {
            if (evt.key === "Enter") {
              fetchData();
            }
          }}
          disabled={isLoading}
        />
        <Button onClick={fetchData}>Search & add to deck</Button>
        {/* <Button onClick={() => setData(sortList(list))}>sort deck</Button> */}
        <Dropdown
          options={priorityList}
          onChange={(key) => {
            setFilterPrrty(key);
          }}
        />
      </div>
      <div className={cx("container")}>
        <div className={cx("list")}>
          <Message data={display} />
          {list.map((vocab, index) => {
            return (
              <Card
                key={vocab.word}
                data={vocab}
                deleteVocab={() => deleteVocab(index)}
                updateVocab={(data) => updateVocab(index, data)}
                handleOpen={() => handleOpen(vocab, index)}
                isActive={openIndex === index}
              />
            );
          })}
        </div>
        <div className={cx("display")}>
          <DisplayBlock
            selectedVocab={list[openIndex]}
            updateVocab={(data) => updateVocab(openIndex, data)}
          />
        </div>
      </div>
    </div>
  );
}
