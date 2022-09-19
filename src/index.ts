import { apiUrl } from "./components/helpers";
import { request, gql } from "graphql-request";
import { RoomDemandSetter, Valve, HeatingTimeSetter, Radiator, PlugTimer } from "./components/controllers";

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

//* Used for testing a single room
// devices.push(new RoomDemandSetter("frontStudy"));
// devices.push(new Valve("frontStudy"));

devices.push(new HeatingTimeSetter());

devices.push(new PlugTimer("mattress"));
devices.push(new PlugTimer("heating"));

devices.push(new Radiator("frontStudy"));

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
  watchdog();
};

systemTick(2 * 1000);

console.log("Hello from new Skippy");

// Watchdog request
// Terminate app if request fails, kubernetes will restart it for us
const watchdog = () => {
  request(
    apiUrl,
    gql`
      query {
        response: getValves {
          room
        }
      }
    `,
  ).catch((error) => {
    console.log(error);
    process.exit();
  });
};
