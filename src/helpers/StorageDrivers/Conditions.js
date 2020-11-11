import { getStore, setStore } from "./LowLevelDriver";

// Conditions
export const getRoomConditions = (room) => {
  return getStore("Environmental Data").heatingSensors[room];
};

export const getRoomTemperature = (room) => {
  return getStore("Environmental Data").heatingSensors[room].temperature;
};

export const getRoomSetpoints = (room) => {
  return getStore("Environmental Data").setpoints[room];
};
