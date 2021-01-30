const { getStore, setStore } = require("../LowLevelDriver");

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

const isValveOpen = (room) => {
  return getStore("Environmental Data").radiatorValves[room].isOpen;
};

const isValveConnected = (room) => {
  return getStore("Environmental Data").radiatorValves[room].isConnected;
};

const getValveStatus = (room) => {
  return getStore("Environmental Data").radiatorValves[room];
};

const isAnyValveOpen = () => {
  return getValveState("livingRoom") || getValveState("kitchen") || getValveState("liamsRoom") || getValveState("study") || getValveState("ourRoom");
};

module.exports = {
  setValveState: setValveState,
  isValveOpen: isValveOpen,
  getValveDemand: getValveDemand,
  setValveDemand: setValveDemand,
  isValveConnected: isValveConnected,
  getValveStatus: getValveStatus,
  isAnyValveOpen: isAnyValveOpen,
};
