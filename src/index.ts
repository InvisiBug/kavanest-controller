import { apiUrl } from "./components/helpers";
import { request, gql } from "graphql-request";
import { RoomDemandSetter, Valve, HeatingTimeSetter, RadiatorFan, Radiator, PlugTimer } from "./components/controllers";
import { RadiatorV2 } from "./components/stores";

const controllers: Array<any> = [];

/////
// * Create controllers for each room demand
// by first getting a list of all valves
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
  console.log(data);
  // Set to true when testing
  const testing = false;
  const testRoom = "frontStudy";

  if (testing) {
    controllers.push(new RoomDemandSetter(testRoom));
    // controllers.push(new Valve(testRoom));
    controllers.push(new Radiator(testRoom));
  }

  data.response.forEach((valve) => {
    if (!testing) {
      controllers.push(new RoomDemandSetter(valve.name));
      // controllers.push(new Valve(valve.room));
      controllers.push(new Radiator(valve.name));
    }
  });
});

//////

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

console.log("Hello from new Skippy");

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
