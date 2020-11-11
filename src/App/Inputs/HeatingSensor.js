// Express
const express = require("express");
const app = (module.exports = express());

const store = require("../../helpers/StorageDriver");

// MQTT
const mqtt = require("mqtt");
const connection = mqtt.connect("mqtt://kavanet.io");

connection.setMaxListeners(15); // Disables event listener warning
connection.subscribe("#", (err) => {
  err ? console.log(err) : null;
});

connection.on("connect", () => null);

const newSensor = (room, saveToStorage) => {
  var deviceData;
  var timer;

  connection.on("message", (topic, payload) => {
    if (topic == `${room} ${"Heating Sensor"}`) {
      clearTimeout(timer);

      timer = setTimeout(() => {
        deviceData.isConnected = false;
        if (saveToStorage) store.setStore(`${room} ${"Heating Sensor"}`, deviceData);
      }, 10 * 1000);

      if (payload != `${room} ${"Heating Sensor Disconnected"}`) {
        var mqttData = JSON.parse(payload);

        deviceData = {
          ...deviceData,
          isConnected: true,
          temperature: mqttData.temperature,
          humidity: mqttData.humidity,
          pressure: mqttData.pressure,
          battery: mqttData.battery,
        };
        if (saveToStorage) store.setStore(`${room} ${"Heating Sensor"}`, deviceData);
      } else {
        console.log(`${room} ${"Heating Sensor Disconnected"}`);
      }
    }
  });

  setInterval(() => {
    sendSocketData();
  }, 1 * 1000);

  const sendSocketData = () => {
    io.emit(`${room} ${"Heating Sensor"}`, deviceData);
  };
};

module.exports = {
  newSensor: newSensor,
};
