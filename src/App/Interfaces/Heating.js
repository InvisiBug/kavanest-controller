const express = require("express");
const app = (module.exports = express());
const { getStore, setStore, updateValue, readValue } = require("../../helpers/StorageDriver");
const { boostOn, boostOff } = require("../../helpers/HeatingFunctions");
const functions = require("../../helpers/Functions");

const disconnectedState = {
  isConnected: false,
  isOn: false,
};

var timer;
var deviceData = disconnectedState;

client.on("message", (topic, payload) => {
  if (topic == "Heating") {
    clearTimeout(timer);

    timer = setTimeout(() => {
      deviceData.isConnected = false;
      setStore("Heating", deviceData);
    }, 10 * 1000);

    if (payload != `${"Heating Disconnected"}`) {
      var mqttData = JSON.parse(payload);

      deviceData = {
        ...deviceData,
        isConnected: true,
        isOn: mqttData.state,
      };

      setStore("Heating", deviceData);
    } else {
      console.log(`${"Heating Disconnected"} ${functions.printTime()}`);
    }
  } else if (topic === "Heating Button") {
    const now = new Date().getTime();
    if (readValue("heatingSchedule", "boostTime") < now) {
      boostOn();
    } else {
      boostOff();
    }
  }
});

setInterval(() => {
  sendSocketData();
}, 1 * 1000);

const sendSocketData = () => {
  io.emit("Heating", deviceData);
};
