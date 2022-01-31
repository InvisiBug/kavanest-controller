import { Radiator, Plug } from "../stores";

export default class RadiatorController {
  roomName: string;
  radiator: Radiator;
  fan: Plug;

  constructor(roomName: string) {
    this.roomName = roomName;

    this.radiator = new Radiator(roomName);
    this.fan = new Plug("radiatorFan");
  }

  async tick() {
    const log = true;

    const fan = await this.fan.getState();
    const threshold: number = 35;

    if (log) console.log("\nRadiator fan controller");

    if (fan.connected) {
      if (log) console.log("Fan connected");

      const radiator = await this.radiator.getTemp();
      if (log) console.log("Radiator inlet temp:", radiator.inlet, "Threshold:", threshold);

      if (radiator.inlet > threshold) {
        if (log) console.log("Fan should be on!");
        if (!fan.state) {
          if (log) console.log("Fan is off...");

          if (log) console.log("So turn fan on");
          this.fan.setState(true);
        } else {
          if (log) console.log("And it is :)");
        }
      } else {
        if (log) console.log("Fan should be off!");

        if (fan.state) {
          if (log) console.log("Fan is on...");

          if (log) console.log("So turn fan off");
          this.fan.setState(false);
        } else {
          if (log) console.log("And it is :)");
        }
      }
    }

    // const valve = await this.valve.getState();
    // const anyDemand = await this.room.anyDemand();
    // const thisRoomDemand = await this.room.getDemand();
    // const log = false;
    // if (log) console.log(`\n* ${this.roomName} Valve *`);
    // if (valve?.connected) {
    //   if (log) console.log("Valve connected");
    //   if (anyDemand) {
    //     if (log) console.log("Some rooms are in demand");
    //     if (thisRoomDemand) {
    //       if (log) console.log("This room is in demand");
    //       if (log) console.log("Valve should be open!");
    //       if (valve?.state === close) {
    //         if (log) console.log("Valve is closed...");
    //         if (log) console.log("So open Valve");
    //         this.valve.setState(open);
    //       } else {
    //         if (log) console.log("And it is :)");
    //       }
    //     } else {
    //       if (log) console.log("This room is not in demand");
    //       if (log) console.log("Valve should be closed!");
    //       if (valve.state === open) {
    //         if (log) console.log("Valve is open...");
    //         if (log) console.log("So close valve");
    //         this.valve.setState(close);
    //       } else {
    //         if (log) console.log("And it is :)");
    //       }
    //     }
    //   } else {
    //     if (log) console.log("No rooms in demand");
    //     if (log) console.log("So valve should be open!");
    //     if (valve.state === close) {
    //       if (log) console.log("Valve is closed...");
    //       if (log) console.log("So open Valve");
    //       this.valve.setState(open);
    //     } else {
    //       if (log) console.log("And it is :)");
    //     }
    //   }
    // }
  }
}
