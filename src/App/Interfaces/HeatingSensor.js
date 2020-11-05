// Express
const express = require("express");
const app = (module.exports = express());

// Persistant Storage
const { getStore, setStore } = require("../../helpers/StorageDriver");
const { camelRoomName } = require("../../helpers/Functions");

// MQTT
const mqtt = require("mqtt");
const connection = mqtt.connect("mqtt://kavanet.io");
connection.setMaxListeners(15); // Disables event listener warning
connection.subscribe("#", (err) => {
  err ? console.log(err) : null;
});

connection.on("connect", () => null);

const errorState = {
  isConnected: false,
  temperature: -1,
  humidity: -1,
  pressure: -1,
};

const newSensor = (room, offset) => {
  var timer;
  var deviceData = errorState;

  connection.on("message", (topic, payload) => {
    if (topic == `${room} ${"Heating Sensor"}`) {
      const roomName = camelRoomName(room);
      clearTimeout(timer);

      timer = setTimeout(() => {
        deviceData = errorState;
        let environmentalData = getStore("Environmental Data");
        environmentalData = {
          ...environmentalData,
          heatingSensors: {
            ...environmentalData.heatingSensors,
            [roomName]: deviceData,
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

        let environmentalData = getStore("Environmental Data");
        environmentalData = {
          ...environmentalData,
          heatingSensors: {
            ...environmentalData.heatingSensors,
            [roomName]: deviceData,
          },
        };
        setStore("Environmental Data", environmentalData);
      } else {
        console.log(`${room} ${"Heating Sensor Disconnected"}`);
      }
    }
  });
};

module.exports = {
  newSensor: newSensor,
};
