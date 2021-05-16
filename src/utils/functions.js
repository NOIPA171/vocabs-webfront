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
  return moment(string).format('YYYY/MM/DD')
}