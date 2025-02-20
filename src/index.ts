import { apiUrl } from "./components/helpers";
import { request, gql } from "graphql-request";
import { RoomDemandSetter, HeatingTimeSetter, Radiator, PlugTimer } from "./components/controllers";

import { connectToMQTT } from "./components/mqtt/mqttService";
const client = connectToMQTT();

const controllers: Array<any> = [];

import { zigbeeControllers } from "./components/controllers";

zigbeeControllers(client);

//////////////////////////////////
// Demand and radiator controllers
// * Create controllers for each room demand
// by first getting a list of all radiators
type Data = {
  response: [
    {
      name: string;
    },
  ];
};

const query = gql`
  query {
    response: getRadiators {
      name
    }
  }
`;

request(apiUrl, query).then((data: Data) => {
  // Set to true when testing
  const testing = false;

  if (testing) {
    const testRoom = "study";
    controllers.push(new RoomDemandSetter(testRoom));
    controllers.push(new Radiator(testRoom));
  } else {
    for (const room of data.response) {
      controllers.push(new RoomDemandSetter(room.name));
      controllers.push(new Radiator(room.name));
    }
  }
});

//////////////////////
// Special Controllers
controllers.push(new HeatingTimeSetter());

controllers.push(new PlugTimer("mattress"));
controllers.push(new PlugTimer("heating"));

// https://stackoverflow.com/a/54635436/7489419
const systemTick = async (delay: number) => {
  try {
    for (let i = 0; i < controllers.length; i++) {
      await controllers[i].tick();
    }
  } catch (error: unknown) {
    console.log(error);
  }
  setTimeout(() => systemTick(delay), delay);
  watchdog();
};

systemTick(2 * 1000);

console.log("Hello from Skippy");

// Watchdog request
// Terminate app if request fails, kubernetes will restart it for us
const watchdog = () => {
  request(
    apiUrl,
    gql`
      query {
        response: getRadiators {
          name
        }
      }
    `,
  ).catch((error) => {
    console.log(error);
    process.exit();
  });
};
