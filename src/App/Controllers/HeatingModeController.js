const { getStore } = require("../../Helpers/StorageDrivers/LowLevelDriver");
const { scheduleChecker, scheduleHeating, scheduleRadiatorFan } = require("./Heating/ScheduleHeatingController");
const { zoneHeating, zoneRadiatorFan, zoneManualOverride, checkRoomDemand } = require("./Heating/ZoneHeatingController");
const { checkFan, checkHeating } = require("./Heating/ManualHeatingController");
const { setAllZonesDemand } = require("../../Helpers/HeatingModes/Zones");
const { signalValve } = require("./ValveController");

// const rooms = [
//   {
//     name: "Our Room",
//     offset: 0,
//   },
//   {
//     name: "Study",
//     offset: 0,
//   },
//   {
//     name: "Living Room",
//     offset: 0,
//   },
//   // {
//   //   name: "Kitchen",
//   //   offset: 0,
//   // },
//   {
//     name: "Liams Room",
//     offset: 0,
//   },
// ];

const rooms = ["Our Room", "Study", "Living Room", "Liams Room"];

setInterval(() => {
  const mode = getStore("Environmental Data").heatingMode;

  switch (mode) {
    case "zones":
      zoneHeating();
      zoneRadiatorFan();

      // checkRoomDemand("Living Room");
      // checkRoomDemand("Liams Room");
      // checkRoomDemand("Study");
      // checkRoomDemand("Our Room");

      rooms.map((room, index) => {
        signalValve(room);
        checkRoomDemand(room);
      });
      break;

    case "schedule":
      setAllZonesDemand(true);
      scheduleChecker();
      scheduleHeating();
      scheduleRadiatorFan();

      rooms.map((room, index) => {
        signalValve(room);
      });
      break;

    case "manual":
      checkFan();
      checkHeating();
      break;
  }
}, 1 * 1000);
