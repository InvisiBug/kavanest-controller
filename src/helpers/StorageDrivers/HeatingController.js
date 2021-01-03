const { getStore, setStore } = require("./LowLevelDriver");
const storeName = "Environmental Data";

const isHeatingControllerConnected = () => {
  const data = getStore(storeName).heatingController;
  return data.isConnected;
};

const isHeatingControllerOn = () => {
  const data = getStore(storeName).heatingController;
  return data.isOn;
};

module.exports = {
  isHeatingControllerConnected: isHeatingControllerConnected,
  isHeatingControllerOn: isHeatingControllerOn,
};
