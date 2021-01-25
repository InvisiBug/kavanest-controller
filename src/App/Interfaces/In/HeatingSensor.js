const { getStore, setStore } = require("../../../Helpers/StorageDrivers/LowLevelDriver");
const { camelRoomName, printTime, currentTime } = require("../../../Helpers/Functions");

// Historical Data (Tingo)
const path = require("path");
const Engine = require("tingodb")();
const db = new Engine.Db(path.join(__dirname, "../../../../PersistantStorage/Historical"), {});
const schedule = require("node-schedule");

const disconnectedState = {
  isConnected: false,
  // direction: "rising",
  temperature: -1,
  humidity: -1,
  pressure: -1,
};

var Hourly = new schedule.RecurrenceRule();
Hourly.minute = 0;

const newSensor = (room, offset) => {
  var timer;
  var deviceData = disconnectedState;

  client.on("message", (topic, payload) => {
    if (topic == `${room} ${"Heating Sensor"}`) {
      const roomName = camelRoomName(room);
      clearTimeout(timer);

      timer = setTimeout(() => {
        let environmentalData = getStore("Environmental Data");

        environmentalData = {
          ...environmentalData,
          heatingSensors: {
            ...environmentalData.heatingSensors,
            [roomName]: disconnectedState,
          },
        };

        setStore("Environmental Data", environmentalData);
      }, 10 * 1000);

      // * Good MQTT data in
      if (payload != `${room} ${"Heating Sensor Disconnected"}`) {
        var mqttData = JSON.parse(payload);
        var direction;

        // if (mqttData.temperature > deviceData.temperature) {
        //   direction = "rising";
        // } else if (mqttData.temperature < deviceData.temperature) {
        //   direction = "falling";
        // } else {
        //   // console.log("Same");
        // }

        let oldData = getStore("Environmental Data");

        deviceData = {
          ...deviceData,
          isConnected: true,
          // direction: direction,
          // direction: "rising",
          direction: oldData.heatingSensors[camelRoomName(room)].direction,
          temperature: Math.round((mqttData.temperature + offset) * 100) / 100,
          humidity: mqttData.humidity,
          pressure: mqttData.pressure,
        };

        // let oldData = getStore("Environmental Data");

        setStore("Environmental Data", {
          ...oldData,
          heatingSensors: {
            ...oldData.heatingSensors,
            [roomName]: deviceData,
          },
        });
      } else {
        console.log(`${room} ${"Heating Sensor Disconnected at "} ${printTime()}`);
      }
    }
  });

  schedule.scheduleJob(Hourly, () => {
    let data = {
      temperature: deviceData.temperature,
      humidity: deviceData.humidity,
      timestamp: currentTime(),
    };
    db.collection(room).insert(data, (err, res) => {
      if (err) console.log(err);
    });
  });
};

module.exports = {
  newSensor: newSensor,
};
