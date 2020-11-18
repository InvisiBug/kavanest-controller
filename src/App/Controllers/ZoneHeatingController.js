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
const { getRoomSetpoints, getRoomTemperature } = require("../../helpers/StorageDriver");
const { setValveDemand, getValveDemand } = require("../../helpers/ValveStorageDriver");
const { openOurRoomValve, closeOurRoomValve } = require("../../helpers/ValveDriver");
const { camelRoomName } = require("../../helpers/Functions");
const { hour } = require("../../helpers/Time");

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
const newZoneController = (room) => {
  // TODO make this the same as heating sensor and radiator valve
  setInterval(() => {
    let setpoint = getRoomSetpoints(camelRoomName(room));
    let currentTemp = getRoomTemperature(camelRoomName(room));

    if (currentTemp < setpoint[hour()] && currentTemp > -1) {
      setValveDemand(camelRoomName(room), true);
      // console.log("here");
    } else {
      setValveDemand(camelRoomName(room), false);
    }
    // console.log(`${room} Current Temp: ${currentTemp} \t Target Temp: ${setpoint[currentHour]}`);
  }, 1 * 1000);

  setInterval(() => {
    // grab the valve demand
    // grab the valve state and connection
    // if valve is connected, had demand and is closed, open
    // else close
    // const
  }, 1 * 1000);
};

module.exports = {
  newZoneController: newZoneController,
};
