const { getEnvironmentalData, setEnvironmentalData } = require("../StorageDrivers/LowLevelDriver");
const { offsetTimeMins } = require("../Time");

const getManualHeating = () => {
  const data = getEnvironmentalData().heatingManual;
  return data;
};

const manualheatingOn = () => {
  const data = getEnvironmentalData();

  // data.heatingManual.radiatorFanTime = offsetTimeMins(9999);
  // data.heatingManual.heatingTime = offsetTimeMins(9999);

  data.heatingSchedule.radiatorFanTime = offsetTimeMins(9999);
  data.heatingSchedule.heatingTime = offsetTimeMins(9999);

  setEnvironmentalData(data);
};

const manualheatingOff = () => {
  const data = getEnvironmentalData();

  // data.heatingManual.radiatorFanTime = offsetTimeMins(15);
  // data.heatingManual.heatingTime = offsetTimeMins();

  data.heatingSchedule.radiatorFanTime = offsetTimeMins(15);
  data.heatingSchedule.heatingTime = offsetTimeMins();

  setEnvironmentalData(data);
};

module.exports = {
  manualheatingOn: manualheatingOn,
  manualheatingOff: manualheatingOff,
  getManualHeating: getManualHeating,
};
