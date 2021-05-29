import React, { useEffect, useState } from "react";
import { formatDisplayDate } from "utils/functions";

import axios from "axios";

import className from "classnames/bind";
import classes from "./style.module.scss";

const cx = className.bind(classes);

const Chart = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    axios
      .get(`http://localhost:5500/vocab/data`)
      .then((res) => {
        console.log("res", res);
        setData(res.data);
      })
      .catch((err) => {
        console.log("error", err);
      });
  }, []);

  return (
    <div className={cx("box")}>
      {data.map((item) => {
        return (
          <div className={cx("card")}>
            <h3>{formatDisplayDate(item.created_at)}</h3>
            <p>total: {item.data.reduce((num, d) => num + d.count, 0)}</p>
            <ul>
              {item.data.map((d) => (
                <li>
                  <b>priority {d.priority}</b> : {d.count}
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
};

export default Chart;
