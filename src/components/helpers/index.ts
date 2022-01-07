export { apiUrl, mongoUrl } from "./urlGenerators";

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
  var today = new Date();
  if (!(today.getDay() % 6)) return "weekend";
  else return "weekday";
};

// Takes in setpoints object and returns current target
export const getCurrentSetpoint = (setpoints: any) => {
  let setpoint;
  try {
    Object.keys(setpoints[weekOrWeekend()]).forEach((entry) => {
      if (now() > entry) {
        setpoint = setpoints[weekOrWeekend()][entry];
      }
    });
    return setpoint;
  } catch {
    return "n/a";
  }
};

export const now = () => {
  const date = new Date();
  return date.toLocaleTimeString([], {
    hourCycle: "h23",
    hour: "2-digit",
    minute: "2-digit",
  });
};
