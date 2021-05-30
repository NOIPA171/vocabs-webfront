import React, { useEffect, useState } from "react";
import Card2 from "components/Card/v2";
import Message from "components/Message";
import DisplayBlock2 from "pages/List/DisplayBlock/v2";
import Button from "components/Button";
import Input from "components/Input";
import Dropdown from "components/Dropdown";

import { priorityList } from "./lists";
import {
  shuffleArray,
  formatApiDate,
  formatDisplayDate,
  formatInputDate,
  mapObjectToQuery,
} from "utils/functions";
import moment from "moment-timezone";
import className from "classnames/bind";
import styles from "./style.module.scss";

import axios from "axios";

const cx = className.bind(styles);

const frmt = "YYYY/MM/DD";

export default function App() {
  const [keyword, setKeyword] = useState("");
  const [date, setDate] = useState(moment().format(frmt));
  const [message, setMessage] = useState(null);
  const [list2, setList2] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [openIndex, setOpenIndex] = useState(-1);

  const [listDates, setListDates] = useState([]);

  const [filterPrrty, setFilterPrrty] = useState("all");
  const [filterDate, setFilterDate] = useState("all");

  useEffect(() => {
    getDateList();
  }, []);

  useEffect(() => {
    fetchList({
      priority: filterPrrty,
      created_at: filterDate !== "all" ? formatApiDate(filterDate) : "all",
    });
  }, [filterPrrty, filterDate]);

  //v
  const deleteVocab = (index, word) => {
    const ans = window.confirm("are you sure?");
    if (!ans) return;
    setIsLoading(true);
    axios
      .post(`http://localhost:5500/vocab/delete/${word}`)
      .then((res) => {
        setOpenIndex(-1);
        const vocab = list2[index];
        const currList = list2.concat([]);
        currList.splice(index, 1);
        setList2(currList);
        shouldUpdateDateList(vocab.created_at, "delete");
      })
      .catch((err) => {
        console.log("delete error", err.response);
        setIsLoading(false);
      });
  };

  const handleOpen = (vocab, index) => {
    setOpenIndex((prev) => (prev === index ? -1 : index));
  };

  //v
  const addVocab = (isCustom) => {
    const api = isCustom
      ? `http://localhost:5500/vocab/insert-custom/${keyword}`
      : `http://localhost:5500/vocab/search/${keyword}`;

    axios
      .post(api, {
        created_at: formatApiDate(date),
      })
      .then((res) => {
        if (res.status === 201) {
          // dupe vocab
          console.log("dupe!!", res);
          const newList = list2.concat([]);
          const wordIdx = newList.findIndex(
            (word) => word.word === res.data.word
          );
          const vocab = newList[wordIdx];
          if (vocab.priority < 6) {
            vocab.priority += 1;
          }
          newList.unshift(vocab);
          newList.splice(wordIdx + 1, 1);
          setMessage({
            status: res.status,
            word: vocab.word,
            priority: vocab.priority,
          });
          setList2(newList);
          return;
        }
        shouldUpdateDateList(res.data.created_at, "add");
        setMessage(null);
        setList2((prev) => {
          const newList = [res.data].concat(prev);
          return newList;
        });
      })
      .catch((err) => {
        if (err?.response?.status === 401) {
          // fetch dictionary api error
          setMessage({
            status: err.response.status,
          });
        }
        console.log("fetch dictionary api error", err?.response);
      });
  };

  const fetchList = (query) => {
    setIsLoading(true);
    axios(`http://localhost:5500/vocab/list${mapObjectToQuery(query)}`)
      .then((res) => {
        setIsLoading(false);
        setList2(res.data);
      })
      .catch((err) => {
        setIsLoading(false);
        console.log("fetch list error", err.response);
      });
  };

  const updateWord = (vocab, index, data) => {
    axios
      .post(`http://localhost:5500/vocab/update/${vocab.word}`, data)
      .then((res) => {
        const newList = list2.concat([]);
        newList.splice(index, 1, { ...vocab, ...data });
        setList2(newList);
      })
      .catch((err) => {
        console.log("update error", err.response);
        setIsLoading(false);
      });
  };

  const getDateList = () => {
    setIsLoading(true);
    axios
      .get(`http://localhost:5500/vocab/vocabs-per-day`)
      .then((res) => {
        setIsLoading(false);
        setListDates(
          res.data.map((date) => ({
            value: formatDisplayDate(date.created_at),
            key: date.created_at,
            note: date.total,
          }))
        );
      })
      .catch((err) => {
        console.log("get date list error", err.response);
        setIsLoading(false);
      });
  };

  const shouldUpdateDateList = (date, action) => {
    //for simplicity's sake, fetch api when deleting vocab or adding new date
    if (
      action === "delete" ||
      listDates.findIndex((option) => option.key === formatApiDate(date)) === -1
    ) {
      getDateList();
      return;
    }
    if (action === "add") {
      const newList = listDates.concat([]);
      const dateIndex = listDates.findIndex(
        (option) => option.key === formatApiDate(date)
      );
      newList[dateIndex].note += 1;
      setListDates(newList);
    }
  };

  return (
    <>
      <div className={cx("bar")}>
        <Input
          type="date"
          value={formatInputDate(date)}
          onChange={(evt) => {
            setDate(formatDisplayDate(evt.target.value));
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
            setList2((prev) => shuffleArray(prev));
          }}
        >
          Shuffle Deck
        </Button>
        <Button onClick={() => addVocab(true)}>Custom add</Button>
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
          <Message data={message} />
          {list2.map((vocab, index) => {
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
    </>
  );
}
