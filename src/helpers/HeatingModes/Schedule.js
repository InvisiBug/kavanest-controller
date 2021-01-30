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
const heatingOn = (time = 99999) => {
  radiatorFanOn(time + overRunTime);
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

// TODO, move the below out of the schedule file
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
