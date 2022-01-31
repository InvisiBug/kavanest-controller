import { apiUrl, mongoUrl } from "./components/helpers";
import { request, gql } from "graphql-request";
import { RoomDemandSetter, Valve, TimeSetter, Heating } from "./components/controllers";
import Plug from "./components/stores/plug";

let devices: Array<any> = [];

request(
  apiUrl,
  gql`
    query {
      response: getValves {
        room
      }
    }
  `,
).then((data) => {
  data.response.forEach((valve: any) => {
    devices.push(new RoomDemandSetter(valve.room));
    devices.push(new Valve(valve.room));
  });
});

// devices.push(new RoomDemandSetter("diningRoom"));
// devices.push(new Valve("diningRoom"));

devices.push(new TimeSetter());
devices.push(new Heating());
devices.push(new Plug("radiatorFan"));

// setInterval(async () => {
//   try {
//     for (let i = 0; i < devices.length; i++) {
//       await devices[i].tick();
//     }
//   } catch (error: unknown) {
//     console.log(error);
//   }
// }, 2 * 1000);

// https://stackoverflow.com/a/54635436/7489419
const systemTick = async (delay: number) => {
  try {
    for (let i = 0; i < devices.length; i++) {
      await devices[i].tick();
    }
  } catch (error: unknown) {
    console.log(error);
  }
  setTimeout(() => systemTick(delay), delay);
};

systemTick(2 * 1000);

console.log("Hello from Skippy");
