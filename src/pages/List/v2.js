import React, { useEffect, useState, useRef } from "react";
import Card from "components/Card";
import Card2 from "components/Card/v2";
import Message from "components/Message";
import DisplayBlock from "pages/List/DisplayBlock";
import DisplayBlock2 from "pages/List/DisplayBlock/v2";
import Button from "components/Button";
import Input from "components/Input";
import Dropdown from "components/Dropdown";

import { priorityList } from "./lists";
import { shuffleArray } from "utils/functions";
import moment from "moment-timezone";
import className from "classnames/bind";
import styles from "./style.module.scss";

import axios from "axios";

const cx = className.bind(styles);

const frmt = "YYYY/MM/DD";

export default function App() {
  const fullList = useRef(JSON.parse(localStorage.getItem("vocabs") || "[]"));

  const [keyword, setKeyword] = useState("");
  const [date, setDate] = useState(moment().format(frmt));
  const [display, setDisplay] = useState(null);
  const [list, setList] = useState(fullList.current);
  const [list2, setList2] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [openIndex, setOpenIndex] = useState(-1);

  const [listDates, setListDates] = useState([]);

  const [filterPrrty, setFilterPrrty] = useState(null);
  const [filterDate, setFilterDate] = useState(null);

  useEffect(() => {
    fetchList();
  }, []);

  useEffect(() => {
    setList(() => {
      let list = fullList.current.concat([]);
      if (filterPrrty) {
        list = list.filter((vocab) => vocab.priority === filterPrrty);
      }
      if (filterDate) {
        list = list.filter((vocab) => vocab.created_at === filterDate);
      }
      return list;
    });
  }, [filterPrrty, filterDate]);

  useEffect(() => {
    const getListDatesData = () => {
      const data = fullList.current.reduce((obj, currValue) => {
        const date = currValue.created_at;
        obj[date] = (obj[date] || 0) + 1;
        return obj;
      }, {});
      return Object.keys(data).map((date) => ({
        value: date,
        key: date,
        note: data[date],
      }));
    };

    setListDates(getListDatesData());
  }, [fullList.current.length]);

  //v
  const deleteVocab = (index, word) => {
    const ans = window.confirm("are you sure?");
    if (!ans) return;
    setIsLoading(true);
    axios
      .post(`http://localhost:5500/vocab/delete/${word}`)
      .then((res) => {
        setOpenIndex(-1);
        const currList = list2.concat([]);
        currList.splice(index, 1);
        setList2(currList);
      })
      .catch((err) => {
        console.log("error", err);
        setIsLoading(false);
      });
  };

  const handleOpen = (vocab, index) => {
    setOpenIndex((prev) => (prev === index ? -1 : index));
  };

  //v
  const addVocab = () => {
    axios
      .post(`http://localhost:5500/vocab/search/${keyword}`, {
        created_at: moment(new Date(date)).format("YYYY-MM-DD HH:mm:ss"),
      })
      .then((res) => {
        if (res.status === 201) {
          // dupe vocab
          console.log("dupe!!");
          const newList = list2.concat([]);
          const wordIdx = newList.findIndex(
            (word) => word.word === res.data.word
          );
          if (newList[wordIdx].priority < 6) {
            newList[wordIdx].priority += 1;
          }
          newList.unshift(newList[wordIdx]);
          newList.splice(wordIdx + 1, 1);
          setList2(newList);
          return;
        }
        setList2((prev) => [res.data].concat(prev));
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const fetchList = () => {
    setIsLoading(true);
    axios(`http://localhost:5500/vocab/list`)
      .then((res) => {
        setIsLoading(false);
        setList2(res.data);
      })
      .catch((err) => {
        setIsLoading(false);
        console.log("error", err);
      });
  };

  const updateWord = (vocab, index, data) => {
    const query = Object.keys(data)
      .map((key) => `${key}=${data[key]}`)
      .join("&");
    axios
      .post(`http://localhost:5500/vocab/update/${vocab.word}?${query}`)
      .then((res) => {
        const newList = list2.concat([]);
        newList.splice(index, 1, { ...vocab, ...data });
        setList2(newList);
      })
      .catch((err) => {
        console.log("error", err);
        setIsLoading(false);
      });
  };

  return (
    <div className="App">
      <nav>
        <h1>Vocab Tool :D</h1>
      </nav>
      <div className={cx("bar")}>
        <Input
          type="date"
          value={moment(date).format("YYYY-MM-DD")}
          onChange={(evt) => {
            setDate(moment(evt.target.value).format(frmt));
          }}
        />
        <Input
          value={keyword}
          onChange={(evt) => setKeyword(evt.target.value)}
          onKeyDown={(evt) => {
            if (evt.key === "Enter") {
              addVocab();
            }
          }}
          disabled={isLoading}
        />
        <Button onClick={addVocab}>+</Button>
        <Button
          onClick={() => {
            setOpenIndex(-1);
            setList((prev) => shuffleArray(prev));
          }}
        >
          Shuffle Deck
        </Button>
        <div>
          <Dropdown
            hasAll
            label="Priority:"
            options={priorityList}
            onChange={(key) => {
              setFilterPrrty(key);
            }}
          />
          <Dropdown
            hasAll="All dates"
            label="Date:"
            options={listDates}
            onChange={(key) => {
              setFilterDate(key);
            }}
          />
        </div>
      </div>
      <div className={cx("container")}>
        <div className={cx("list")}>
          <Message data={display} />
          {list2.map((vocab, index) => {
            if (filterDate && vocab.created_at !== filterDate) {
              return null;
            }
            if (filterPrrty && vocab.priority !== filterPrrty) {
              return null;
            }
            return (
              <Card2
                key={`card_${vocab.word}`}
                data={vocab}
                deleteVocab={() => deleteVocab(index, vocab.word)}
                updateVocab={(data) => updateWord(vocab, index, data)}
                handleOpen={() => handleOpen(vocab, index)}
                isActive={openIndex === index}
              />
            );
          })}
        </div>
        <div className={cx("display")}>
          <DisplayBlock2
            selectedVocab={list2[openIndex]}
            updateVocab={(data) =>
              updateWord(list2[openIndex], openIndex, data)
            }
          />
        </div>
      </div>
    </div>
  );
}
