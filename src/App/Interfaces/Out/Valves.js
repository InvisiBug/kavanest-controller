const { radiatorValveControl } = require("./mqttOut");

const open = "0";
const close = "1";

const openAllValves = () => {
  radiatorValveControl("Living Room", open);
  radiatorValveControl("Kitchen", open);
  radiatorValveControl("Liams Room", open);
  radiatorValveControl("Study", open);
  radiatorValveControl("Our Room", open);
};

const closeAllValves = () => {
  radiatorValveControl("Living Room", close);
  radiatorValveControl("Kitchen", close);
  radiatorValveControl("Liams Room", close);
  radiatorValveControl("Study", close);
  radiatorValveControl("Our Room", close);
};

const openValve = (valve) => {
  radiatorValveControl(valve, open);
};

const closeValve = (valve) => {
  radiatorValveControl(valve, close);
};

module.exports = {
  openAllValves: openAllValves,
  closeAllValves: closeAllValves,

  openValve: openValve,
  closeValve: closeValve,
};
