const { getStore, setStore } = require("../LowLevelDriver");

const getRadiatorFan = () => {
  const data = getStore("Radiator Fan");
  return data;
};

const isRadiatorFanAuto = () => {
  const data = getRadiatorFan();
  return data.isAutomatic;
};

const isRadiatorFanConnected = () => {
  const data = getRadiatorFan();
  return data.isConnected;
};

const isRadiatorFanOn = () => {
  const data = getRadiatorFan();
  return data.isOn;
};

module.exports = {
  getRadiatorFan: getRadiatorFan,
  isRadiatorFanAuto: isRadiatorFanAuto,
  isRadiatorFanConnected: isRadiatorFanConnected,
  isRadiatorFanOn: isRadiatorFanOn,
};
