export const disconnectWatchdog = (data: any, msg: string, writeToMongo: any) => {
  return setTimeout(() => {
    data = setDisconnected(data, msg);
    writeToMongo(data);
  }, 10 * 1000);
};

export const setDisconnected = (data: any, msg: string): any => {
  // console.log(msg); // TODO remove this, will need to alter all calls
  data = {
    ...data,
    connected: false,
  };
  return data;
};

export const camelRoomName = (text: string) => {
  text = text.replace(/[-_\s.]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ""));
  return text.substr(0, 1).toLowerCase() + text.substr(1);
};

export { apiUrl, mongoUrl } from "./urlGenerators";
