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
  let setpoint: string | undefined | null;
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
    // console.log("obj", obj);

    // If setpoint isnt found, use the last entry
    if (!setpoint) {
      const lastSetpoint = parseInt(obj[Object.keys(obj)[count - 1]]);
      // If there arent any setpoints return 0
      if (!lastSetpoint) {
        return 0;
      }

      // Otherwise return the last setpoint
      return lastSetpoint;
    }

    // console.log(setpoint);

    return parseFloat(setpoint);
  } catch {
    return 0;
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

  const daylightSavings = true;

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
  [x: key]: value;
}

type key = string;
type value = string;
