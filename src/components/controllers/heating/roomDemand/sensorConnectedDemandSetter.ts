import { Room, Sensor } from "@/components/stores";
import { RoomData } from "@/types";

export const sensorConnectedDemandSetter = async ({ room, log, roomData, sensor }: Props) => {
  const target = await room.getCurrentTarget();

  const deadzone = roomData?.deadzone || 0;
  const passiveDeadzone = 0.2;

  const higherThanSetpoint = () => sensor.temperature > target.temp;
  const wantingHeat = () => sensor.temperature < target.temp - deadzone;

  const targetOn = async () => {
    if (higherThanSetpoint()) {
      // Temp is higher than setpoint

      if (log) console.log(`Not wanting heat`);
      if (log) console.log(`So set demand to off`);

      room.setDemand("off");

      return;
    } else if (wantingHeat()) {
      // temp is lower than setpoint and deadzone

      if (log) console.log("Wanting heat...");
      if (log) console.log(`So set demand to on`);

      room.setDemand("on");

      return;
    } else {
      // Within deadzone
      // Heat if another room is being heated

      const anyDemand = await room.anyDemand();
      const thisRoomDemand = await room.getDemand();

      if (anyDemand && thisRoomDemand != "on" && sensor.temperature < target.temp - passiveDeadzone) {
        if (log) console.log("Within deadzone... Another room is wanting heat");
        if (log) console.log(`So set demand to passive`);

        room.setDemand("passive");

        return;
      } else {
        if (log) console.log("No other rooms wanting heat");
        if (log) console.log(`Within deadzone... do nothing`);

        return;
      }
    }
  };

  const targetPassive = () => {
    if (log) console.log(`Type is passive`);
    if (target.temp !== 0) {
      if (log) console.log(`With a temperature`);

      if (higherThanSetpoint()) {
        if (log) console.log(`Temperature is above target`);
        if (log) console.log(`So set demand to off`);

        room.setDemand("off");

        return;
      } else if (wantingHeat()) {
        if (log) console.log(`Temperature is less than target`);
        if (log) console.log(`So set demand to passive`);

        room.setDemand("passive");

        return;
      } else {
        if (log) console.log(`Within deadzone`);
      }
    } else {
      if (log) console.log(`Without a temperature`);
      if (log) console.log(`So set demand to passive`);

      room.setDemand("passive");

      return;
    }
  };

  if (log) console.log(`Temperature: ${sensor.temperature} \t Target: ${target.temp} \t Type: ${target.type}`);
  if (target.type === "on") {
    if (log) console.log(`Type is on`);

    targetOn();
  } else if (target.type === "off") {
    if (log) console.log(`Type is off`);

    room.setDemand("off");
    return;
  } else if (target.type === "passive") {
    targetPassive();
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
