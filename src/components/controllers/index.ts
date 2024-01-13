/*
  Standard controllers
*/
export { default as HeatingTimeSetter } from "./heatingTimeSetter";
export { default as RoomDemandSetter } from "./roomDemandSetter";
export { default as PlugTimer } from "./plugTimer";
export { default as Radiator } from "./radiator";

/*
  Zigbee controllers
*/
export { default as Button } from "./button";
export { default as TrainingRoomMotion } from "./trainingRoomMotion";

export interface DeviceConfig {
  topic: string;
}
