const { getStore, setStore, updateValue } = require("./LowLevelDriver");

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

const setClimateControlAuto = (value) => {
  setClimateControl("isAuto", value);
};

const isClimateControlAuto = () => {
  let environmentalData = getStore("Environmental Data").climateControl;
  return environmentalData.isAuto;
};

module.exports = {
  isClimateControlAuto: isClimateControlAuto,
  setClimateControlAuto: setClimateControlAuto,
};
