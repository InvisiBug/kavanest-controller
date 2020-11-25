const valveTransitTime = 3 * 60 * 1000;
// const valveTransitTime = 5 * 1000;

const open = "0";
const close = "1";

// * Decided not to use a 3 min timeout
const openLivingRoomValve = () => {
  console.log("Opening Living Room Valve");
  client.publish("Living Room Valve Control", open);
  // setTimeout(() => console.log("Living Room Valve Opened"), valveTransitTime);
};

const closeLivingRoomValve = () => {
  console.log("Opening Living Room Valve");
  client.publish("Living Room Valve Control", close);
  // setTimeout(() => console.log("Living Room Valve Closed"), valveTransitTime);
};

const openKitchenValve = () => {
  console.log("Opening Kitchen Valve");
  client.publish("Kitchen Valve Control", open);
  // setTimeout(() => console.log("Kitchen Valve Opened"), valveTransitTime);
};

const closeKitchenValve = () => {
  console.log("Closing Kitchen Valve");
  client.publish("Kitchen Valve Control", close);
  // setTimeout(() => console.log("Kitchen Valve Closed"), valveTransitTime);
};

const openLiamsRoomValve = () => {
  console.log("Opening Liams Room Valve");
  client.publish("Liams Room Valve Control", open);
  // setTimeout(() => console.log("Liams Room Valve Opened"), valveTransitTime);
};

const closeLiamsRoomValve = () => {
  console.log("Closing Liams Room Valve");
  client.publish("Liams Room Valve Control", close);
  // setTimeout(() => console.log("Liams Room Valve Closed"), valveTransitTime);
};

const openStudyValve = () => {
  console.log("Opening Study Valve");
  client.publish("Study Valve Control", open);
  // setTimeout(() => console.log("Study Valve Opened"), valveTransitTime);
};

const closeStudyValve = () => {
  console.log("Closing Study Valve");
  client.publish("Study Valve Control", close);
  // setTimeout(() => console.log("Study Valve Closed"), valveTransitTime);
};

const openOurRoomValve = () => {
  console.log("Opening Our Room Valve");
  client.publish("Our Room Valve Control", open);
  // setTimeout(() => setValve("ourRoom", true), valveTransitTime);
};

const closeOurRoomValve = () => {
  console.log("Closing Our Room Valve");
  client.publish("Our Room Valve Control", close);
  // setTimeout(() => setValve("ourRoom", false), valveTransitTime);
};

const openAllValves = () => {
  console.log("Opening All Valves");

  client.publish("Living Room Valve Control", open);
  client.publish("Kitchen Valve Control", open);
  client.publish("Liams Room Valve Control", open);
  client.publish("Study Valve Control", open);
  client.publish("Our Room Valve Control", open);
  // setTimeout(() => {
  //   setValve("livingRoom", true);
  //   setValve("kitchen", true);
  //   setValve("liamsRoom", true);
  //   setValve("study", true);
  //   setValve("ourRoom", true);
  // }, valveTransitTime);
};

const closeAllValves = () => {
  console.log("Closing All Valves");

  client.publish("Living Room Valve Control", close);
  client.publish("Kitchen Valve Control", close);
  client.publish("Liams Room Valve Control", close);
  client.publish("Study Valve Control", close);
  client.publish("Our Room Valve Control", close);
  // setTimeout(() => {
  //   setValve("livingRoom", false);
  //   setValve("kitchen", false);
  //   setValve("liamsRoom", false);
  //   setValve("study", false);
  //   setValve("ourRoom", false);
  // }, valveTransitTime);
};

const openValve = (valve) => {
  client.publish(`${valve} Valve Control`, open);
};

const closeValve = (valve) => {
  client.publish(`${valve} Valve Control`, close);
};

module.exports = {
  openLivingRoomValve: openLivingRoomValve,
  openKitchenValve: openKitchenValve,
  openLiamsRoomValve: openLiamsRoomValve,
  openStudyValve: openStudyValve,
  openOurRoomValve: openOurRoomValve,

  closeLivingRoomValve: closeLivingRoomValve,
  closeKitchenValve: closeKitchenValve,
  closeLiamsRoomValve: closeLiamsRoomValve,
  closeStudyValve: closeStudyValve,
  closeOurRoomValve: closeOurRoomValve,

  openAllValves: openAllValves,
  closeAllValves: closeAllValves,

  openValve: openValve,
  closeValve: closeValve,
};
