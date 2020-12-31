const { getStore, setStore } = require("./LowLevelDriver");

const isZonesAuto = () => {
  let environmentalData = getStore("Environmental Data").climateControl;
  return environmentalData.isAuto;
};

const setZonesAuto = () => {
  setClimateControl("isAuto", true);
};

const setZonesManual = () => {
  setClimateControl("isAuto", false);
};

const setClimateControl = (point = null, value = null) => {
  let environmentalData = getStore("Environmental Data");
  environmentalData = {
    ...environmentalData,
    climateControl: {
      ...environmentalData.climateControl,
      [point]: value,
    },
  };

  setStore("Environmental Data", environmentalData);
};

const setZonesSetpoints = (room, vals) => {
  let environmentalData = getStore("Environmental Data");

  environmentalData = {
    ...environmentalData,
    setpoints: {
      ...environmentalData.setpoints,
      [room]: vals,
    },
  };

  setStore("Environmental Data", environmentalData);
};

module.exports = {
  isZonesAuto: isZonesAuto,
  setZonesAuto: setZonesAuto,
  setZonesManual: setZonesManual,
  setZonesSetpoints: setZonesSetpoints,
};
