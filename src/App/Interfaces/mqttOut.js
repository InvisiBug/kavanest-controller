var mqttOut = false;

const heatingControl = (message) => {
  if (mqttOut) {
    client.publish("Heating Control", message);
  } else {
    console.log(`Heating: ${message}`);
  }
};

const radiatorFanControl = (message) => {
  if (mqttOut) {
    client.publish("Radiator Fan Control", message);
  } else {
    console.log(`Radiator Fan: ${message}`);
  }
};

const computerAudioControl = (message) => {
  if (mqttOut) {
    client.publish("Computer Audio Control", message);
  } else {
    console.log(`Computer Audio Control: ${message}`);
  }
};

const computerPowerControl = (message) => {
  if (mqttOut) {
    client.publish("Computer Power Control", message);
  } else {
    console.log(`Computer Power Control: ${message}`);
  }
};

const plugControl = (message) => {
  if (mqttOut) {
    client.publish("Plug Control", message);
  } else {
    console.log(`Plug Control: ${message}`);
  }
};

const sunControl = (message) => {
  if (mqttOut) {
    client.publish("Sun Control", message);
  } else {
    console.log(`Sun Control: ${message}`);
  }
};

const tableLampControl = (message) => {
  if (mqttOut) {
    client.publish("Table Lamp Control", message);
  } else {
    console.log(`Table Lamp Control: ${message}`);
  }
};

const deskLEDsControl = (message) => {
  if (mqttOut) {
    client.publish("Desk LED Control", message);
  } else {
    console.log(`Desk LEDs Control: ${message}`);
  }
};

const screenLEDsControl = (message) => {
  if (mqttOut) {
    client.publish("Screen LEDs Control", message);
  } else {
    console.log(`Screen LEDs Control: ${message}`);
  }
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
