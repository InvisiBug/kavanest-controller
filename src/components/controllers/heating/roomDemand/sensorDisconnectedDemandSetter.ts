import { Room, Sensor } from "@/components/stores";
import { RoomData } from "@/types";

export const sensorDisconnectedDemandSetter = async ({ room, log }: Props) => {
  const target = await room.getCurrentTarget();
  if (target.temp === 0) {
    if (log) console.log(`Target is 0`);
    if (log) console.log(`Set demand to off`);

    room.setDemand("off");
    return;
  } else {
    if (log) console.log(`Target exists... `);
    if (log) console.log(`Set demand to passive`);
    room.setDemand("passive");
    return;
  }
};

type Props = {
  room: Room;
  log: boolean;
};
