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

////////////////////////////////////////////////////////////////////////
//
//  #     #
//  #     #   ##   #####  #   ##   #####  #      ######  ####
//  #     #  #  #  #    # #  #  #  #    # #      #      #
//  #     # #    # #    # # #    # #####  #      #####   ####
//   #   #  ###### #####  # ###### #    # #      #           #
//    # #   #    # #   #  # #    # #    # #      #      #    #
//     #    #    # #    # # #    # #####  ###### ######  ####
//
////////////////////////////////////////////////////////////////////////
const saveToStorage = true;
var deviceData;
var timer = setTimeout(() => {
  deviceData.isConnected = false;
}, 10 * 1000);

////////////////////////////////////////////////////////////////////////
//
//  #     #  #####  ####### #######
//  ##   ## #     #    #       #
//  # # # # #     #    #       #
//  #  #  # #     #    #       #
//  #     # #   # #    #       #
//  #     # #    #     #       #
//  #     #  #### #    #       #
//
////////////////////////////////////////////////////////////////////////
connection.on("message", (topic, payload) => {
  if (topic == `${"Heating"}`) {
    clearTimeout(timer);

    timer = setTimeout(() => {
      deviceData.isConnected = false;
      if (saveToStorage) store.setStore(`${"Heating"}`, deviceData);
    }, 10 * 1000);

    if (payload != `${"Heating Disconnected"}`) {
      var mqttData = JSON.parse(payload);

      deviceData = {
        ...deviceData,
        isConnected: true,
        isOn: mqttData.state,
      };
      if (saveToStorage) store.setStore(`${"Heating"}`, deviceData);
    } else {
      console.log(`${"Heating Disconnected"}`);
    }
  }
});

setInterval(() => {
  sendSocketData();
}, 1 * 1000);

const sendSocketData = () => {
  io.emit(`${"Heating"}`, deviceData);
};
