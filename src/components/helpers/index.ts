export { apiUrl } from "./urlGenerators";

export const camelRoomName = (text: string) => {
  text = text.replace(/[-_\s.]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ""));
  return text.substring(0, 1).toLowerCase() + text.substring(1);
};

export const decamelize = (text: string) => {
  if (!text) return "Unknown Name, probs something wrong with mongo";
  const result = text.replace(/([A-Z]{1,})/g, " $1");
  const finalResult = result.charAt(0).toUpperCase() + result.slice(1);
  return finalResult;
};

export const weekOrWeekend = () => {
  const today = new Date();
  if (!(today.getDay() % 6)) return "weekend";
  else return "weekday";
};

// Takes in setpoints object and returns current target
export const getCurrentSetpoint = (setpoints: Setpoints) => {
  // let setpoint: {
  //   temp: number;
  //   type: string;
  // } = {};

  let setpoint = {} as Setpoint;

  let count: number = 0;
  // console.log(now());

  // Look for a setpoint
  try {
    Object.keys(setpoints[weekOrWeekend()]).forEach((entry) => {
      if (now() >= entry) {
        setpoint = setpoints[weekOrWeekend()][entry];
      }
      count++;
    });

    const obj = setpoints[weekOrWeekend()];

    // If setpoint isnt found, use the last entry
    if (!setpoint.temp) {
      const lastEntry = obj[Object.keys(obj)[count - 1]]; // Final entry in the setpoint array
      // Data format
      // {
      //   temp:Number;
      //   type:String;
      // }

      const lastSetpoint = obj[Object.keys(obj)[count - 1]].temp;
      console.log("🚀 ~ getCurrentSetpoint ~ lastEntry:", lastEntry);
      // If there arent any setpoints return 0
      if (!lastEntry.temp) {
        return lastEntry;
      }

      // Otherwise return the last setpoint
      return lastEntry;
    }

    // console.log(setpoint);

    // return parseFloat(setpoint);
    return setpoint;
  } catch {
    return {
      temp: 0,
      type: "off",
    };
  }
};

export const now = () => {
  const date = new Date();
  const dateString = date.toLocaleTimeString([], {
    hourCycle: "h23", // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale/hourCycle
    hour: "2-digit",
    minute: "2-digit",
  });

  //! Daylight savings hack
  const time = dateString.split(":");

  const hour = parseInt(time[0]);
  const min = time[1];

  const dst = `${("0" + (hour + 1)).slice(-2)}:${min}`;

  const daylightSavings = false;

  if (daylightSavings) {
    return dst;
  } else {
    return dateString;
  }
};

export const offsetTimeMins = (addedTime = 0) => {
  let now = new Date();
  return now.setMinutes(now.getMinutes() + addedTime);
};

export const nowTimer = () => {
  const date = new Date();
  return date.getTime();
};

interface Setpoints {
  weekend: entry;
  weekday: entry;
}
interface entry {
  [x: key]: Setpoint;
}

type key = string;
type Setpoint = {
  temp: number;
  type: string;
};
