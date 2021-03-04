const { getStore, setStore } = require("../StorageDrivers/LowLevelDriver");
const { now } = require("../Time");
const { updateBoostTime, updateHeatingTime, updateRadiatorFanTime, getHeatingTime } = require("./Timers");

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
const radiatorFanOn = () => {
  updateRadiatorFanTime("on");
  console.log("hjds");
};

const radiatorFanOff = () => {
  updateRadiatorFanTime("off");
};

const radiatorFanOverrun = () => {
  updateRadiatorFanTime("overrun");
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
const heatingOn = (time = 99999) => {
  radiatorFanOn();
  updateHeatingTime(time);
};

const heatingOff = () => {
  // Need to check if the heating is on to prevent the
  // fan overrun time being constantly written
  // therefore keeping the fan on
  if (now() < getHeatingTime()) {
    radiatorFanOverrun();
    updateHeatingTime();
  }
};

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
  getHeatingController: getHeatingController,
};
