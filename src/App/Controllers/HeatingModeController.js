const { getStore } = require("../../Helpers/StorageDrivers/LowLevelDriver");
const { scheduleChecker, scheduleHeating, scheduleRadiatorFan } = require("./Heating/ScheduleHeatingController");
const { zoneHeating, zoneRadiatorFan, zoneManualOverride, checkRoomDemand } = require("./Heating/ZoneHeatingController");
const { checkFan, checkHeating } = require("./Heating/ManualHeatingController");
const { setAllZonesDemand } = require("../../Helpers/HeatingModes/Zones");
const { signalValve } = require("./ValveController");

const rooms = [
  {
    name: "Our Room",
    offset: 0,
  },
  {
    name: "Study",
    offset: 0,
  },
  {
    name: "Living Room",
    offset: 0,
  },
  {
    name: "Kitchen",
    offset: 0,
  },
  {
    name: "Liams Room",
    offset: 0,
  },
];

setInterval(() => {
  const mode = getStore("Environmental Data").heatingMode;

  switch (mode) {
    case "zones":
      zoneHeating();
      zoneRadiatorFan();

      checkRoomDemand("Living Room");
      checkRoomDemand("Kitchen");
      checkRoomDemand("Liams Room");
      checkRoomDemand("Study");
      checkRoomDemand("Our Room");

      rooms.map((room, index) => {
        signalValve(room.name);
      });
      break;

    case "schedule":
      setAllZonesDemand(true);
      scheduleChecker();
      scheduleHeating();
      scheduleRadiatorFan();

      rooms.map((room, index) => {
        signalValve(room.name);
      });
      break;

    case "manual":
      // setAllZonesDemand(true);
      checkFan();
      checkHeating();
      break;
  }

  // if (mode === "zones") {
  //   zoneHeating();
  //   zoneRadiatorFan();
  //   zoneManualOverride();

  //   checkRoomDemand("Living Room");
  //   checkRoomDemand("Kitchen");
  //   checkRoomDemand("Liams Room");
  //   checkRoomDemand("Study");
  //   checkRoomDemand("Our Room");
  // } else if (mode === "schedule") {
  //   scheduleChecker();
  //   scheduleHeating();
  //   scheduleRadiatorFan();
  // } else if (mode === "manual") {
  //   console.log("boop");
  // }
}, 1 * 1000);
