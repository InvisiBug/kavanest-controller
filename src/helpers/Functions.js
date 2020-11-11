////////////////////////////////////////////////////////////////////////
//
//  ███████╗██╗   ██╗███╗   ██╗ ██████╗████████╗██╗ ██████╗ ███╗   ██╗███████╗
//  ██╔════╝██║   ██║████╗  ██║██╔════╝╚══██╔══╝██║██╔═══██╗████╗  ██║██╔════╝
//  █████╗  ██║   ██║██╔██╗ ██║██║        ██║   ██║██║   ██║██╔██╗ ██║███████╗
//  ██╔══╝  ██║   ██║██║╚██╗██║██║        ██║   ██║██║   ██║██║╚██╗██║╚════██║
//  ██║     ╚██████╔╝██║ ╚████║╚██████╗   ██║   ██║╚██████╔╝██║ ╚████║███████║
//  ╚═╝      ╚═════╝ ╚═╝  ╚═══╝ ╚═════╝   ╚═╝   ╚═╝ ╚═════╝ ╚═╝  ╚═══╝╚══════╝
//
////////////////////////////////////////////////////////////////////////
const currentTime = () => {
  const d = new Date();
  const hour = d.getHours();
  const minute = d.getMinutes();
  const second = d.getSeconds();

  const day = d.getDate();
  const month = d.getMonth() + 1;
  const year = d.getFullYear();

  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const monthOfYear = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const days = daysOfWeek[d.getDay()];
  const months = monthOfYear[d.getMonth()];

  return {
    Hour: hour,
    Minute: minute,
    Day: day,
    Month: month,
    Year: year,
    Days: days,
    Months: months,
  };
};

var printTime = () => {
  const date = new Date();
  let hours = date.getHours(); // *NB* figure out a way to make these all const
  let minutes = date.getMinutes();
  const ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  const strTime = hours + ":" + minutes + " " + ampm;
  return strTime;
};

const updateValue = (data, point, value) => {
  data = {
    ...data,
    [point]: value,
  };
  return data;
};

const camelRoomName = (roomName) => {
  if (roomName.split(" ").length === 2) {
    return `${roomName.split(" ")[0].toLowerCase()}${roomName.split(" ")[1]}`;
  } else return roomName.toLowerCase();
};

const frontendToBackend = (data) => {
  var newData = {};

  for (var key in data) {
    if (data[key].length > 1) {
      var newVals = [];
      for (var index in data[key]) {
        newVals[index] = parseFloat(Math.floor(data[key][index])) + toNodeDecimalConverter(data[key][index]); // used to convert to a string here
      }
      newData[key] = newVals;
    } else newData[key] = data[key];
  }
  return newData;
};

const backendToFrontend = (data) => {
  var newData = {};
  for (var key in data) {
    if (data[key].length > 1) {
      var newVals = [];
      for (var index in data[key]) {
        newVals[index] = parseFloat(Math.floor(data[key][index])) + toReactDecimalConverter(data[key][index]); // used to convert to a string here
      }
      newData[key] = newVals;
    } else newData[key] = data[key];
  }
  return newData;
};

const toNodeDecimalConverter = (val) => {
  switch (val % 1) {
    case 0.25:
      return 0.15;
    case 0.5:
      return 0.3;
    case 0.75:
      return 0.45;
    default:
      return 0.0;
  }
};

const toReactDecimalConverter = (val) => {
  switch (parseFloat((val % 1).toFixed(2))) {
    case 0.15:
      return 0.25;
    case 0.3:
      return 0.5;
    case 0.45:
      return 0.75;
    default:
      return 0.0;
  }
};

module.exports = {
  currentTime: currentTime,
  printTime: printTime,
  camelRoomName: camelRoomName,
  backendToFrontend: backendToFrontend,
  frontendToBackend: frontendToBackend,
};
