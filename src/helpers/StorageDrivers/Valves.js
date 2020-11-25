const { getStore, setStore } = require("./LowLevelDriver");

const setValveState = (room, value) => {
  // updateValue("Radiator Valves", room, value);
};

const setValveDemand = (room, value) => {
  let data = getStore("Environmental Data");

  data = {
    ...data,
    radiatorValves: {
      ...data.radiatorValves,
      [room]: {
        ...data.radiatorValves[room],
        demand: value,
      },
    },
  };

  setStore("Environmental Data", data);
};

const getValveDemand = (room) => {
  return getStore("Environmental Data").radiatorValves[room].demand;
};

const getValveState = (room) => {
  return getStore("Environmental Data").radiatorValves[room].isOpen;
};

const getValveConnection = (room) => {
  return getStore("Environmental Data").radiatorValves[room].isConnected;
};

const getValveStatus = (room) => {
  console.log(getStore("Environmental Data").radiatorValves[room]);
};

module.exports = {
  setValveState: setValveState,
  getValveState: getValveState,
  getValveDemand: getValveDemand,
  setValveDemand: setValveDemand,
  getValveConnection: getValveConnection,
  getValveStatus: getValveStatus,
};
