// Radiator fan and heating controller below will be moved to their own controller
/*
  Is our radfan in auto and connected
    Is now before turn off time
      Is radfan off
        - Turn radfan on
    else
      Is radfan on
        - Turn radFan off
*/
const zoneRadiatorFan = () => {
  if (isRadiatorFanAuto() && isRadiatorFanConnected()) {
    if (new Date() < getRadiatorFanTime()) {
      if (!isRadiatorFanOn()) {
        radiatorFanControl("1");
      }
    } else {
      if (isRadiatorFanOn()) {
        radiatorFanControl("0");
      }
    }
  }
};

/*
  Is heating controller connected and 
*/
const zoneHeating = () => {
  if (now() < getHeatingTime() && isHeatingControllerConnected()) {
    if (!isHeatingControllerOn()) {
      heatingControl("1");
    }
  } else if (isHeatingControllerOn()) {
    heatingControl("0");
  }
};
