import moment from "moment";

export const shuffleArray = (array) => {
  const arr = array.concat([]);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
  return arr;
};

export const formatDisplayDate = (string) => {
  return moment(string).format("YYYY/MM/DD");
};

export const formatApiDate = (string) => {
  return moment(string).format("YYYY-MM-DD HH:mm:ss");
};

export const formatInputDate = (string) => {
  return moment(string).format("YYYY-MM-DD");
};

export const mapObjectToQuery = (obj) => {
  if (!obj) {
    return "";
  }
  return (
    "?" +
    Object.keys(obj)
      .map((key) => `${key}=${obj[key]}`)
      .join("&")
  );
};
