////////////////////////////////////////////////////////////////////////
//
// ██╗  ██╗███████╗ █████╗ ████████╗██╗███╗   ██╗ ██████╗
// ██║  ██║██╔════╝██╔══██╗╚══██╔══╝██║████╗  ██║██╔════╝
// ███████║█████╗  ███████║   ██║   ██║██╔██╗ ██║██║  ███╗
// ██╔══██║██╔══╝  ██╔══██║   ██║   ██║██║╚██╗██║██║   ██║
// ██║  ██║███████╗██║  ██║   ██║   ██║██║ ╚████║╚██████╔╝
// ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝   ╚═╝   ╚═╝╚═╝  ╚═══╝ ╚═════╝
//
////////////////////////////////////////////////////////////////////////
//
//   #####
//  #     #  ####  #    # ###### #  ####
//  #       #    # ##   # #      # #    #
//  #       #    # # #  # #####  # #
//  #       #    # #  # # #      # #  ###
//  #     # #    # #   ## #      # #    #
//   #####   ####  #    # #      #  ####
//
////////////////////////////////////////////////////////////////////////
// Express
const express = require("express");
const app = (module.exports = express());
const bodyParser = require("body-parser");
app.use(bodyParser.json());

// Functions
const functions = require("../../Functions.js");

////////////////////////////////////////////////////////////////////////
//
//  #     #
//  #     #   ##   #####  #   ##   #####  #      ######  ####
//  #     #  #  #  #    # #  #  #  #    # #      #      #
//  #     # #    # #    # # #    # #####  #      #####   ####
//   #   #  ###### #####  # ###### #    # #      #           #
//    # #   #    # #   #  # #    # #    # #      #      #    #
//     #    #    # #    # # #    # #####  ###### ######  ####
//
////////////////////////////////////////////////////////////////////////
// var data =
// {
//   "monday" : [ 4.3, 10.15, 17.3, 22.45 ],
//   "tuesday" : [ 6.3, 10.15, 15.45, 22.3 ],
//   "wednesday" : [ 4.15, 11.3, 14.45, 19.3 ],
//   "thursday" : [ 4.15, 10, 16.3, 20 ],
//   "friday" : [ 6, 12, 14.45, 22 ],
//   "saturday" : [ 6.15, 10, 15, 22.15 ],
//   "sunday" : [ 6, 9.15, 16, 20 ],
//   "enable" : true,
//   "boost" : false,
//   "heatingOn" : true
// }

var data;

// timer1 = setInterval(() =>
// {
//   var dataToSend = {};
//
//   for(var key in heating)
//   {
//     dataToSend[key] = tabletToSystem(heating[key]);
//   }
//
//   client.publish("Heating Control", JSON.stringify(dataToSend));
// }, 1 * 1000)

////////////////////////////////////////////////////////////////////////
//
//    #    ######  ###
//   # #   #     #  #
//  #   #  #     #  #
// #     # ######   #
// ####### #        #
// #     # #        #
// #     # #       ###
//
////////////////////////////////////////////////////////////////////////
app.get("/api/heating/status", (req, res) => {
  res.end(JSON.stringify(data));
});

app.post("/api/heating/schedule/update", (req, res) => {
  console.log(req.body);

  data = req.body.vals;

  var dataToSend = {};

  for (var key in data) {
    dataToSend[key] = tabletToSystem(data[key]);
  }

  client.publish("Heating Control", JSON.stringify(dataToSend));

  res.end(JSON.stringify(data));
});

app.post("/api/heating/enable/update", (req, res) => {
  data.enable = req.body.state;

  var dataToSend = {};

  for (var key in data) {
    dataToSend[key] = tabletToSystem(data[key]);
  }

  console.log(dataToSend);
  client.publish("Heating Control", JSON.stringify(dataToSend));

  res.end(JSON.stringify(data));
});

app.post("/api/heating/boost/update", (req, res) => {
  data.boost = req.body.state;

  var dataToSend = {};

  for (var key in data) {
    dataToSend[key] = tabletToSystem(data[key]);
  }

  client.publish("Heating Control", JSON.stringify(dataToSend));

  res.end(JSON.stringify(data));
});

////////////////////////////////////////////////////////////////////////
//
// #     #  #####  ####### #######    #     #                                              ######
// ##   ## #     #    #       #       ##   ## ######  ####   ####    ##    ####  ######    #     # ######  ####  ###### # #    # ###### #####
// # # # # #     #    #       #       # # # # #      #      #       #  #  #    # #         #     # #      #    # #      # #    # #      #    #
// #  #  # #     #    #       #       #  #  # #####   ####   ####  #    # #      #####     ######  #####  #      #####  # #    # #####  #    #
// #     # #   # #    #       #       #     # #           #      # ###### #  ### #         #   #   #      #      #      # #    # #      #    #
// #     # #    #     #       #       #     # #      #    # #    # #    # #    # #         #    #  #      #    # #      #  #  #  #      #    #
// #     #  #### #    #       #       #     # ######  ####   ####  #    #  ####  ######    #     # ######  ####  ###### #   ##   ###### #####
//
////////////////////////////////////////////////////////////////////////
client.on("message", (topic, payload) => {
  if (topic == "Heating") {
    // console.log(JSON.parse(payload))
    if (payload != "Heating Disconnected") {
      data = convertMQTTData(JSON.parse(payload));
    } else {
      data = null;
      console.log(
        "Heating Controller Disconnected  at " + functions.printTime()
      );
    }
  }
});

////////////////////////////////////////////////////////////////////////
//
//  #####
// #     #  ####   ####  #    # ###### #####
// #       #    # #    # #   #  #        #
//  #####  #    # #      ####   #####    #
//       # #    # #      #  #   #        #
// #     # #    # #    # #   #  #        #
//  #####   ####   ####  #    # ######   #
//
////////////////////////////////////////////////////////////////////////
const sensorUpdate = setInterval(() => {
  io.emit("Heating", data);
}, 1 * 1000);

////////////////////////////////////////////////////////////////////////
//
// #######
// #       #    # #    #  ####  ##### #  ####  #    #  ####
// #       #    # ##   # #    #   #   # #    # ##   # #
// #####   #    # # #  # #        #   # #    # # #  #  ####
// #       #    # #  # # #        #   # #    # #  # #      #
// #       #    # #   ## #    #   #   # #    # #   ## #    #
// #        ####  #    #  ####    #   #  ####  #    #  ####
//
////////////////////////////////////////////////////////////////////////
var tabletToSystem = (tempValues) => {
  try {
    var adjustedValues = [];

    for (var index of tempValues.keys()) {
      var last = [];

      tempValues[index] % 1 === 0.25
        ? (last[index] = "15")
        : tempValues[index] % 1 === 0.5
        ? (last[index] = "30")
        : tempValues[index] % 1 === 0.75
        ? (last[index] = "45")
        : tempValues[index] % 1 === 0.0
        ? (last[index] = "00")
        : null;

      var value = parseFloat(Math.floor(tempValues[index]) + "." + last[index]);
      // console.log(value)

      adjustedValues[index] = value;
    }
    return adjustedValues;
  } catch (
    error // enable, boost and heatingOn are handled here
  ) {
    // console.log(error)
    return tempValues;
  }
};

var systemToTablet = (values) => {
  try {
    let newValues = [];
    let finalVals = [];

    var first = [];
    var last = [];

    for (let index of values.keys()) {
      // newValues[index] = values[index].toString().padStart(4, '0');

      newValues[index] = (Math.round(values[index] * 100) / 100).toFixed(2);
      newValues[index] = newValues[index].toString().padStart(5, "0");

      first[index] = newValues[index].substring(0, 2);
      last[index] = newValues[index].substring(2, 4);

      newValues[index].substring(3, 5) == "15"
        ? (last[index] = "25")
        : newValues[index].substring(3, 5) == "30"
        ? (last[index] = "50")
        : newValues[index].substring(3, 5) == "45"
        ? (last[index] = "75")
        : null;

      finalVals[index] = parseFloat(first[index] + "." + last[index]);
    }
    return finalVals;
  } catch (
    error // enable, boost and heatingOn are handled here
  ) {
    // console.log(error)
    return values;
  }
};

var convertMQTTData = (dataIn) => {
  var convertedData = {};

  for (var key in dataIn) {
    convertedData[key] = systemToTablet(dataIn[key]);
  }

  return convertedData;
};
