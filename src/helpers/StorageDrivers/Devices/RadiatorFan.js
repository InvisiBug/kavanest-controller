const { getStore, setStore, getEnvironmentalData } = require("../LowLevelDriver");

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

const setRadiatorFan = (deviceData) => {
  // ! Not working yet
  // TODO, will need to scale this later when new fans are added
  // const data = getEnvironmentalData().radiatorFans.ourRoom;

  setStore("Radiator Fan", deviceData);

  // data

  // data.isAutomatic = auto;
  // data.isConnected = connected;
  // data.isOn = on;

  // setEnvironmentalData(data);

  // console.log(data);
  // console.log(state);
};

// setRadiatorFan(true, true, true);

module.exports = {
  getRadiatorFan: getRadiatorFan,
  isRadiatorFanAuto: isRadiatorFanAuto,
  isRadiatorFanConnected: isRadiatorFanConnected,
  isRadiatorFanOn: isRadiatorFanOn,
  setRadiatorFan: setRadiatorFan,
};
