import { Room } from "@/components/stores";
import { decamelize, nowTimer } from "@/components/helpers";
import { RoomData } from "@/types";

export const checkOverride = async ({ room, log, roomData }: Props) => {
  const overrideTime = roomData?.overrideTime;
  const overrideType = roomData?.overrideType;

  if (overrideTime && nowTimer() < overrideTime) {
    if (log) console.log("Override");

    switch (overrideType) {
      case "on":
        if (log) console.log("Heating on override");
        if (log) console.log(`So set demand to on`);

        room.setDemand("on");
        break;

      case "off":
        if (log) console.log("Heating off override");
        if (log) console.log(`So set demand to off`);

        room.setDemand("off");
        break;

      case "passive":
        if (log) console.log("Passive override");
        if (log) console.log(`So set passive mode`);

        room.setDemand("passive");
        break;
    }
  }
};

type Props = {
  room: Room;
  log: boolean;
  roomData: RoomData;
};
