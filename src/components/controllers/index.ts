/*
  Standard controllers
*/
export { default as HeatingTimeSetter } from "./heating/heatingTimeSetter";
export { default as RoomDemandSetter } from "./heating/roomDemandSetter";
export { default as PlugTimer } from "./others/plugTimer";
export { default as Radiator } from "./heating/radiator";

/*
  Zigbee controllers
*/
export { default as Button } from "./zigbeeControllers/buttons/livingRoomButton";
export { default as StudyButton } from "./zigbeeControllers/buttons/studyButton";
export { default as TrainingRoomMotion } from "./zigbeeControllers/motion/trainingRoomMotion";

export interface DeviceConfig {
  topic: string;
}
