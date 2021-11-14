const day = () => {
  const date = new Date();
  return date.getDay();
};

const now = () => {
  const date = new Date();
  return date.getTime();
};

const time = () => {
  const date = new Date();

  let hrs = date.getHours();
  let mins = date.getMinutes();

  return hrs + "." + mins.toString().padStart(2, "0");
};

const hour = () => {
  const date = new Date();
  return date.getHours();
};

/*
  Returns the time now + addedTime
*/
const offsetTimeMins = (addedTime = 0) => {
  let now = new Date();
  return now.setMinutes(now.getMinutes() + addedTime);
};

const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

module.exports = {
  day: day,
  now: now,
  time: time,
  hour: hour,
  offsetTimeMins: offsetTimeMins,
  days: days,
};
