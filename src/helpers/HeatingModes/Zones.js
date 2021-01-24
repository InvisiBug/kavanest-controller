const { camelRoomName } = require("../Functions");
const { getStore, setStore, getEnvironmentalData, setEnvironmentalData } = require("../StorageDrivers/LowLevelDriver");

const isZonesAuto = () => {
  let environmentalData = getEnvironmentalData().heatingZones;
  return environmentalData.isAuto;
};

const setAllZonesDemand = () => {
  setZonesDemand("Living Room", true);
  setZonesDemand("Liams Room", true);
  setZonesDemand("Study", true);
  setZonesDemand("Our Room", true);
};

const setZonesDemand = (room, state) => {
  const data = getEnvironmentalData();

  data.heatingZones[camelRoomName(room)].demand = state;
  setEnvironmentalData(data);
};

const isZonesDemand = () => {
  return isZoneDemand("livingRoom") || isZoneDemand("liamsRoom") || isZoneDemand("study") || isZoneDemand("ourRoom");
};

const isZoneDemand = (zone) => {
  const data = getEnvironmentalData().heatingZones[zone].demand;
  return data;
};

const setZonesAuto = () => {
  setZonesIsAuto(true);
};

const setZonesManual = () => {
  setZonesIsAuto(false);
};

const setZonesIsAuto = (val) => {
  const data = getEnvironmentalData();
  data.heatingZones.isAuto = val;
  setEnvironmentalData(data);
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
  isZonesDemand: isZonesDemand,
  setZonesDemand: setZonesDemand,
  isZoneDemand: isZoneDemand,
  setAllZonesDemand: setAllZonesDemand,
};
