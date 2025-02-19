import { Room, Sensor } from "@/components/stores";
import { RoomData } from "@/types";

export const sensorConnectedDemandSetter = async ({ room, log, roomData, sensor }: Props) => {
  const target = await room.getCurrentTarget();

  const deadzone = roomData?.deadzone || 0;
  const passiveDeadzone = 0.2;

  if (log) console.log(`Temperature: ${sensor.temperature} \t Target: ${target.temp} \t Type: ${target.type}`);
  if (target.type === "on") {
    if (log) console.log(`Type is on`);

    if (sensor.temperature > target.temp) {
      if (log) console.log(`Not wanting heat`);
      if (log) console.log(`So set demand to off`);

      room.setDemand("off");

      return;
    } else if (sensor.temperature < target.temp - deadzone) {
      if (log) console.log("Wanting heat...");
      if (log) console.log(`So set demand to on`);

      room.setDemand("on");

      return;
    } else {
      const anyDemand = await room.anyDemand();
      const thisRoomDemand = await room.getDemand();

      if (anyDemand && thisRoomDemand != "on" && sensor.temperature < target.temp - passiveDeadzone) {
        if (log) console.log("Another room is wanting heat");
        if (log) console.log(`So set demand to passive`);

        room.setDemand("passive");

        return;
      } else {
        if (log) console.log("No other rooms wanting heat");
        if (log) console.log(`Within deadzone... do nothing`);

        return;
      }
    }
  } else if (target.type === "off") {
    if (log) console.log(`Type is off`);

    room.setDemand("off");
  } else if (target.type === "passive") {
    if (log) console.log(`Type is passive`);

    room.setDemand("passive");
  }
};
type Props = {
  room: Room;
  log: boolean;
  roomData: RoomData;
  sensor: {
    connected: boolean;
    temperature: number;
  };
};
