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
const { getRoomSetpoints, getRoomTemperature } = require("../../helpers/StorageDrivers/Conditions");
const { setValveDemand, getValveStatus } = require("../../helpers/StorageDrivers/Valves");
const { openValve, closeValve } = require("../../App/Interfaces/Out/Valves");
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
      // ! the -1 bit may need to open the valve, fail safe
      setValveDemand(camelRoomName(room), true);
    } else {
      setValveDemand(camelRoomName(room), false);
    }
    // console.log(`${room} \t Current Temp: ${currentTemp} \t Target Temp: ${setpoint[hour()]}`);
  }, 1 * 1000);

  // Valve open / close
  setInterval(() => {
    let valve = getValveStatus(camelRoomName(room));
    // console.log(valve);

    if (valve.isConnected) {
      if (valve.demand && !valve.isOpen) {
        openValve(room);
        // console.log("Opening Valve");
      } else if (!valve.demand && valve.isOpen) {
        closeValve(room);
        // console.log("Closing Valve");
      }
    }
  }, 1 * 1000);
};

module.exports = {
  newZoneController: newZoneController,
};
