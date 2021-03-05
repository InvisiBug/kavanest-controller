const { camelRoomName } = require("../Functions");
const { getStore, setStore, getEnvironmentalData, setEnvironmentalData } = require("../StorageDrivers/LowLevelDriver");

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

const setZonesSetpoints = (room, vals, weekday) => {
  let environmentalData = getStore("Environmental Data");

  environmentalData.setpoints[weekday][room] = vals;

  setStore("Environmental Data", environmentalData);
};

module.exports = {
  setZonesSetpoints: setZonesSetpoints,
  isZonesDemand: isZonesDemand,
  setZonesDemand: setZonesDemand,
  isZoneDemand: isZoneDemand,
  setAllZonesDemand: setAllZonesDemand,
};
