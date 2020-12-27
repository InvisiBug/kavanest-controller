/* 
  * NB *
  The timers here may cause issues if they are too short 
  the system uses file system sync which references files 
  which have to be qued for reading and writing
  if the file is accessed too quickly there may be issues
*/
////////////////////////////////////////////////////////////////////////
//
//   #####
//  #     #  ####  #    # ###### #  ####
//  #       #    # ##   # #      # #    #
//  #       #    # # #  # #####  # #
//  #       #    # #  # # #      # #  ###
//  #     # #    # #   ## #      # #    #
//   #####   ####  #    # #      #  ####
//
////////////////////////////////////////////////////////////////////////
// Express
const express = require("express");
var app = (module.exports = express());
const { getStore, setStore, updateValue } = require("../../helpers/StorageDriver");
const { days } = require("../../helpers/Constants");
const { radiatorFanOn, radiatorFanOverrun, heatingOn, heatingOff } = require("../../helpers/HeatingFunctions");
const { day, now, time } = require("../../helpers/Time");

////////////////////////////////////////////////////////////////////////
//
// #######
//    #    # #    # ###### #####   ####
//    #    # ##  ## #      #    # #
//    #    # # ## # #####  #    #  ####
//    #    # #    # #      #####       #
//    #    # #    # #      #   #  #    #
//    #    # #    # ###### #    #  ####
//
////////////////////////////////////////////////////////////////////////
setInterval(() => {
  let scheduleData = getStore("heatingSchedule");
  // let scheduleData = getHeatingSchedule();

  if (scheduleData.boostTime < now()) {
    if (scheduleData.auto) {
      if (
        (scheduleData[days[day()]][0] <= time() && time() <= scheduleData[days[day()]][1]) || // Seems to be some overlap ie schedule on at 16:02 when should be on at 16:15
        (scheduleData[days[day()]][2] <= time() && time() <= scheduleData[days[day()]][3])
      ) {
        // console.log("Heating On (A)");
        heatingOn(); // On demand from schedule
      } else {
        // console.log("Heating Off (B)");
        heatingOff(); // off demand from schedule
      }
    }
  }
}, 0.5 * 1000);
