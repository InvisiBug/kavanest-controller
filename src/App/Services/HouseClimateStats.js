const express = require("express");
const app = (module.exports = express());
const { getStore, setStore } = require("../../helpers/StorageDrivers/LowLevelDriver");

let environmentalData = getStore("Environmental Data");
let temperatures = {};

setInterval(() => {
  environmentalData = getStore("Environmental Data");
  temperatures = {
    livingRoom: environmentalData.heatingSensors.livingRoom.temperature,
    kitchen: environmentalData.heatingSensors.kitchen.temperature,
    liamsRoom: environmentalData.heatingSensors.liamsRoom.temperature,
    study: environmentalData.heatingSensors.study.temperature,
    ourRoom: environmentalData.heatingSensors.ourRoom.temperature,
  };
  const houseData = {
    ...environmentalData,
    houseStats: {
      average: average(temperatures),
      minimumTemp: minMax(temperatures)[0],
      maximumTemp: minMax(temperatures)[1],
    },
  };
  setStore("Environmental Data", houseData);
  io.emit(`${"Environmental Data"}`, houseData); //*NB* Break this out in to a seperate socket file
}, 1 * 1000);

// -----  Functions  -----
const average = (temps) => {
  let totalActive = 0;
  let temperatureSum = 0;
  let houseAverage = 0;

  for (let key in temps) {
    if (temps[key] > 0) {
      temperatureSum = temperatureSum + temps[key];
      totalActive++;
    }
  }

  houseAverage = temperatureSum / totalActive;
  return Math.round(houseAverage * 10) / 10;
};

const minMax = (temps) => {
  let tempTemps = [];

  for (let key in temps) {
    if (temps[key] > 0) {
      tempTemps.push(temps[key]);
    }
  }
  return [Math.min(...tempTemps), Math.max(...tempTemps)];
};
