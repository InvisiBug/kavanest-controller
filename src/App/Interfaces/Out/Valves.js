// * Decided to not have valve transit time

const open = "0";
const close = "1";

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
