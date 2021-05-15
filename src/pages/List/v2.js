import React, { useEffect, useState, useRef } from "react";
import Card from "components/Card";
import Card2 from 'components/Card/v2'
import Message from "components/Message";
import DisplayBlock from "pages/List/DisplayBlock";
import DisplayBlock2 from 'pages/List/DisplayBlock/v2'
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

  const setStorage = (list) => {
    localStorage.setItem("vocabs", JSON.stringify(list));
    fullList.current = list;
  };

  const setData = (list) => {
    setStorage(list);
    setList(list);
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
            created_at: date,
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
      list[duplicateIndex].priority = currPriority > 6 ? 6 : currPriority + 1;
      list.unshift(list[duplicateIndex]);
      list.splice(duplicateIndex + 1, 1);
      setDisplay({ ...list[duplicateIndex], status: "dupe" });
    }
    setOpenIndex(0);
    setData(list);
  };

  const deleteVocab = (index) => {
    const ans = window.confirm("are you sure?");
    if (!ans) return;
    setOpenIndex(-1);
    const currList = list.concat([]);
    const vocab = currList.splice(index, 1);
    setList(currList);
    const currFullList = fullList.current.concat([]);
    currFullList.splice(
      currFullList.findIndex((v) => v.word === vocab[0].word),
      1
    );
    setStorage(currFullList);
  };

  const updateVocab = (index, data) => {
    const curr = list[index];
    const currList = list.concat([]);
    const vocab = currList.splice(index, 1, { ...curr, ...data });
    setList(currList);
    const currFullList = fullList.current.concat([]);
    currFullList.splice(
      currFullList.findIndex((v) => v.word === vocab[0].word),
      1,
      { ...curr, ...data }
    );
    setStorage(currFullList);
  };

  const handleOpen = (vocab, index) => {
    setOpenIndex((prev) => (prev === index ? -1 : index));
  };

  const test = async () => {
    fetch(`http://localhost:5500/vocab/search2/${keyword}`)
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
      });
    // .catch((err) => console.log("error", err));
  };

  const fetchList = () => {
    setIsLoading(true);
    axios(`http://localhost:5500/vocab/list`)
      .then((res) => {
        setIsLoading(false);
        setList2(res.data)
        console.log(res);
      })
      .catch((err) => {
        setIsLoading(false);
        console.log("error", err);
      });
  };

  // const insertword = (word) => {
  //   return new Promise((resolve, rej) => {
  //     axios
  //       .post(`http://localhost:5500/vocab/upload-localstorage`, {
  //         word: word.word,
  //         priority: word.priority,
  //         created_at: moment(new Date(word.created_at)).format(
  //           "YYYY-MM-DD HH:mm:ss"
  //         ),
  //         notes: word.notes,
  //         meanings: word.meanings,
  //       })
  //       .then((res) => {
  //         // console.log("resove", word.word);
  //         // setTimeout(() => {
  //         resolve(res);
  //         // }, 500);
  //       })
  //       .catch((err) => {
  //         console.log("an error has occurred", err, word);
  //         resolve(err);
  //       });
  //   });
  // };

  // const insertLocalStorage = async (index) => {
  //   if (!list[index]) {
  //     console.log("DONE!!");
  //     return;
  //   }
  //   console.log("fetch word", list[index].word, "index", index);
  //   const data = await insertword(list[index]);
  //   insertLocalStorage(index + 1);
  // };

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
              fetchData();
            }
          }}
          disabled={isLoading}
        />
        <Button onClick={fetchData}>+</Button>
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
          <DisplayBlock2
            selectedVocab={list2[openIndex]}
            updateVocab={(data) => updateVocab(openIndex, data)}
          />
        </div>
      </div>
    </div>
  );
}
