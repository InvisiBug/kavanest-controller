const { getHeatingSchedule, setHeatingSchedule } = require("./StorageDrivers/Schedule");
const { updateValue, readValue, getStore, getEnvironmentalData } = require("./StorageDrivers/LowLevelDriver");
const { offsetTimeMins } = require("./Time");

const overRunTime = 20;
const boostTime = 20;

////////////////////////////////////////////////////////////////////////
//
//  ######
//  #     #  ####   ####   ####  #####
//  #     # #    # #    # #        #
//  ######  #    # #    #  ####    #
//  #     # #    # #    #      #   #
//  #     # #    # #    # #    #   #
//  ######   ####   ####   ####    #
//
////////////////////////////////////////////////////////////////////////
const boostOn = () => {
  updateBoostTime(boostTime);
  heatingOn(boostTime);
};

const boostOff = () => {
  updateBoostTime();
  heatingOff();
};

////////////////////////////////////////////////////////////////////////
//
//  ######                                                #######
//  #     #   ##   #####  #   ##   #####  ####  #####     #         ##   #    #
//  #     #  #  #  #    # #  #  #    #   #    # #    #    #        #  #  ##   #
//  ######  #    # #    # # #    #   #   #    # #    #    #####   #    # # #  #
//  #   #   ###### #    # # ######   #   #    # #####     #       ###### #  # #
//  #    #  #    # #    # # #    #   #   #    # #   #     #       #    # #   ##
//  #     # #    # #####  # #    #   #    ####  #    #    #       #    # #    #
//
////////////////////////////////////////////////////////////////////////
// Radiator Fan
const radiatorFanOn = (time = 99999) => {
  updateRadiatorFanTime(time);
};

const radiatorFanOff = () => {
  updateRadiatorFanTime();
};

const radiatorFanOverrun = () => {
  updateRadiatorFanTime(overRunTime);
};

////////////////////////////////////////////////////////////////////////
//
//  #    # ######   ##   ##### # #    #  ####
//  #    # #       #  #    #   # ##   # #    #
//  ###### #####  #    #   #   # # #  # #
//  #    # #      ######   #   # #  # # #  ###
//  #    # #      #    #   #   # #   ## #    #
//  #    # ###### #    #   #   # #    #  ####
//
////////////////////////////////////////////////////////////////////////
// Heating
const heatingOn = (time = 99999) => {
  radiatorFanOn(time + overRunTime);
  updateHeatingTime(time);
};

const heatingOff = () => {
  if (isHeatingOn()) {
    radiatorFanOverrun();
    updateHeatingTime();
  }
};

const isHeatingOn = () => {
  const heatingSchedule = getHeatingSchedule();
  return heatingSchedule.heatingTime > new Date();
  // return readValue("heatingSchedule", "heatingTime") > new Date();
};

const updateBoostTime = (time = 0) => {
  const heatingSchedule = getHeatingSchedule();
  heatingSchedule.boostTime = offsetTimeMins(time);
  setHeatingSchedule(heatingSchedule);

  // updateValue("heatingSchedule", "boostTime", offsetTimeMins(time));
};

const updateRadiatorFanTime = (time = 0) => {
  const now = new Date();
  const heatingSchedule = getHeatingSchedule();
  heatingSchedule.radiatorFanTime = offsetTimeMins(time);
  setHeatingSchedule(heatingSchedule);
  // updateValue("heatingSchedule", "radiatorFanTime", offsetTimeMins(time));
};

const updateHeatingTime = (time = 0) => {
  const now = new Date();
  const heatingSchedule = getHeatingSchedule();
  heatingSchedule.heatingTime = offsetTimeMins(time);
  setHeatingSchedule(heatingSchedule);
  // updateValue("heatingSchedule", "heatingTime", offsetTimeMins(time));
};

// radiatorFanOff();

// const getHeatingSchedule = () => {
//   const data = getStore("Environmental Data");
//   return data.heatingSchedule;
// };

const setHeatingModeSchedule = () => {
  updateValue("Environmental Data", "heatingMode", "schedule");
};

const setHeatingModeZones = () => {
  updateValue("Environmental Data", "heatingMode", "zones");
};

const setHeatingModeManual = () => {
  updateValue("Environmental Data", "heatingMode", "manual");
};

const getHeatingMode = () => {
  const data = getStore("Environmental Data");
  return data.heatingMode;
};
const getHeatingController = () => {
  let heatingController = getStore("Environmental Data").heatingController;
  return heatingController;
};

module.exports = {
  boostOn: boostOn,
  boostOff: boostOff,
  radiatorFanOverrun: radiatorFanOverrun,
  radiatorFanOn: radiatorFanOn,
  radiatorFanOff: radiatorFanOff,
  heatingOn: heatingOn,
  heatingOff: heatingOff,
  updateBoostTime: updateBoostTime,
  updateRadiatorFanTime: updateRadiatorFanTime,
  updateHeatingTime: updateHeatingTime,
  setHeatingModeSchedule: setHeatingModeSchedule,
  setHeatingModeZones: setHeatingModeZones,
  getHeatingMode: getHeatingMode,
  getHeatingController: getHeatingController,
  setHeatingModeManual: setHeatingModeManual,
};
