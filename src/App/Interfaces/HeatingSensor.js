const express = require("express");
const app = (module.exports = express());
const { getStore, setStore, updateSensorData } = require("../../helpers/StorageDriver");
const { camelRoomName } = require("../../helpers/Functions");

const errorState = {
  isConnected: false,
  temperature: -1,
  humidity: -1,
  pressure: -1,
};

const newSensor = (room, offset) => {
  var timer;
  var deviceData = errorState;

  client.on("message", (topic, payload) => {
    if (topic == `${room} ${"Heating Sensor"}`) {
      clearTimeout(timer);

      timer = setTimeout(() => {
        deviceData = errorState;
        let environmentalData = getStore("Environmental Data");
        environmentalData = {
          ...environmentalData,
          heatingSensors: {
            ...environmentalData.heatingSensors,
            [camelRoomName(room)]: deviceData,
          },
        };
        setStore("Environmental Data", environmentalData);
      }, 10 * 1000);

      if (payload != `${room} ${"Heating Sensor Disconnected"}`) {
        var mqttData = JSON.parse(payload);

        deviceData = {
          ...deviceData,
          isConnected: true,
          temperature: Math.round((mqttData.temperature + offset) * 100) / 100,
          humidity: mqttData.humidity,
          pressure: mqttData.pressure,
        };

        updateSensorData(camelRoomName(room), deviceData);
      } else {
        console.log(`${room} ${"Heating Sensor Disconnected at "} ${printTime()}`);
      }
    }
  });
};

module.exports = {
  newSensor: newSensor,
};
