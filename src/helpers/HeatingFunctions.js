const { updateValue, readValue, updateBoostTime, updateRadiatorFanTime, updateHeatingTime } = require("./StorageDrivers/LowLevelDriver");
// const { now } = require("../helpers/Time");

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
  return readValue("heatingSchedule", "heatingTime") > new Date();
};

// radiatorFanOff();

module.exports = {
  boostOn: boostOn,
  boostOff: boostOff,
  radiatorFanOverrun: radiatorFanOverrun,
  radiatorFanOn: radiatorFanOn,
  radiatorFanOff: radiatorFanOff,
  heatingOn: heatingOn,
  heatingOff: heatingOff,
};
