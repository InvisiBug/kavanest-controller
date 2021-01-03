const { getStore, setStore } = require("./LowLevelDriver");

const isRadiatorFanAuto = () => {
  const data = getStore("Radiator Fan");
  return data.isAutomatic;
};

const isRadiatorFanConnected = () => {
  const data = getStore("Radiator Fan");
  return data.isConnected;
};

const isRadiatorFanOn = () => {
  const data = getStore("Radiator Fan");
  return data.isOn;
};

module.exports = {
  isRadiatorFanAuto: isRadiatorFanAuto,
  isRadiatorFanConnected: isRadiatorFanConnected,
  isRadiatorFanOn: isRadiatorFanOn,
};
