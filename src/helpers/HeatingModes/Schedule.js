const { getStore, setStore, getEnvironmentalData } = require("../StorageDrivers/LowLevelDriver");
const { offsetTimeMins } = require("../Time");

const overRunTime = 1;
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
  const heatingSchedule = getScheduleHeating();
  return heatingSchedule.heatingTime > new Date();
  // return readValue("heatingSchedule", "heatingTime") > new Date();
};

const updateBoostTime = (time = 0) => {
  const heatingSchedule = getScheduleHeating();
  heatingSchedule.boostTime = offsetTimeMins(time);
  setHeatingSchedule(heatingSchedule);

  // updateValue("heatingSchedule", "boostTime", offsetTimeMins(time));
};

const updateRadiatorFanTime = (time = 0) => {
  const heatingSchedule = getScheduleHeating();
  heatingSchedule.radiatorFanTime = offsetTimeMins(time);
  setHeatingSchedule(heatingSchedule);
  // updateValue("heatingSchedule", "radiatorFanTime", offsetTimeMins(time));
};

const updateHeatingTime = (time = 0) => {
  const heatingSchedule = getScheduleHeating();
  heatingSchedule.heatingTime = offsetTimeMins(time);
  setHeatingSchedule(heatingSchedule);
  // updateValue("heatingSchedule", "heatingTime", offsetTimeMins(time));
};

// radiatorFanOff();

// const getScheduleHeating = () => {
//   const data = getStore("Environmental Data");
//   return data.heatingSchedule;
// };

const getHeatingController = () => {
  let heatingController = getStore("Environmental Data").heatingController;
  return heatingController;
};

const getScheduleHeating = () => {
  const heatingSchedule = getStore("Environmental Data").heatingSchedule;
  return heatingSchedule;
};

const setHeatingSchedule = (data) => {
  let oldData = getStore("Environmental Data");

  setStore("Environmental Data", {
    ...oldData,
    heatingSchedule: data,
  });
};

module.exports = {
  getScheduleHeating: getScheduleHeating,
  setHeatingSchedule: setHeatingSchedule,
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
  getHeatingController: getHeatingController,
};
