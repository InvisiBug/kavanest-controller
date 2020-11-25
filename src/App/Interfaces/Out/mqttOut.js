const heatingControl = (message) => {
  client.publish("Heating Control", message);
};

const radiatorFanControl = (message) => {
  client.publish("Radiator Fan Control", message);
};

const computerAudioControl = (message) => {
  client.publish("Computer Audio Control", message);
};

const computerPowerControl = (message) => {
  client.publish("Computer Power Control", message);
};

const plugControl = (message) => {
  client.publish("Plug Control", message);
};

const sunControl = (message) => {
  client.publish("Sun Control", message);
};

const tableLampControl = (message) => {
  client.publish("Table Lamp Control", message);
};

const deskLEDsControl = (message) => {
  client.publish("Desk LED Control", message);
};

const screenLEDsControl = (message) => {
  client.publish("Screen LEDs Control", message);
};

module.exports = {
  heatingControl: heatingControl,
  radiatorFanControl: radiatorFanControl,
  computerAudioControl: computerAudioControl,
  computerPowerControl: computerPowerControl,
  plugControl: plugControl,
  sunControl: sunControl,
  tableLampControl: tableLampControl,
  deskLEDsControl: deskLEDsControl,
  screenLEDsControl: screenLEDsControl,
};
