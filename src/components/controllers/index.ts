/*
  Standard controllers
*/
export { default as HeatingTimeSetter } from "./heating/heatingTimeSetter";
export { default as RoomDemandSetter } from "./heating/roomDemandSetter";
export { default as PlugTimer } from "./others/plugTimer";
export { default as Radiator } from "./heating/radiator";

export { zigbeeControllers } from "./zigbeeControllers";
// export { zigbeeControllers };
export interface DeviceConfig {
  topic: string;
}
