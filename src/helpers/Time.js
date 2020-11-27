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

  // console.log(hrs + "." + mins.toString().padStart(2, "0"));

  return hrs + "." + mins.toString().padStart(2, "0");
};

const offsetTime = (time = 0) => {
  let now = new Date();
  return now.setMinutes(now.getMinutes() + time);
};

module.exports = {
  day: day,
  now: now,
  time: time,
  offsetTime: offsetTime,
};
