////////////////////////////////////////////////////////////////////////
//
//  ██╗  ██╗██╗███████╗████████╗ ██████╗ ██████╗ ██╗ ██████╗ █████╗ ██╗
//  ██║  ██║██║██╔════╝╚══██╔══╝██╔═══██╗██╔══██╗██║██╔════╝██╔══██╗██║
//  ███████║██║███████╗   ██║   ██║   ██║██████╔╝██║██║     ███████║██║
//  ██╔══██║██║╚════██║   ██║   ██║   ██║██╔══██╗██║██║     ██╔══██║██║
//  ██║  ██║██║███████║   ██║   ╚██████╔╝██║  ██║██║╚██████╗██║  ██║███████╗
//  ╚═╝  ╚═╝╚═╝╚══════╝   ╚═╝    ╚═════╝ ╚═╝  ╚═╝╚═╝ ╚═════╝╚═╝  ╚═╝╚══════╝
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

const path = require("path");
const Engine = require("tingodb")();
const db = new Engine.Db(path.join(__dirname, "../../Databases/Heating/"), {});

////////////////////////////////////////////////////////////////////////
//
//     #    ######  ###
//    # #   #     #  #
//   #   #  #     #  #
//  #     # ######   #
//  ####### #        #
//  #     # #        #
//  #     # #       ###
//
////////////////////////////////////////////////////////////////////////
app.post("/api/heatingSensor/historical", (req, res) => {
  var points;
  if (req.body.timescale == "day") points = 24;
  else if (req.body.timescale == "week") points = 168;
  else if (req.body.timescale == "month") points = 720;
  else if (req.body.timescale == "year") points = 8760;

  db.collection(req.body.room)
    .find()
    .toArray((error, result) => {
      var data = [];

      if (error) console.log(error);
      else {
        if (result.length < points) {
          for (i = result.length - 1; i >= 0; i--) {
            data.push({
              temperature: result[i].temperature,
              humidity: result[i].humidity,
              timestamp: result[i].timestamp,
            });
          }
        } else {
          for (i = result.length - 1; i >= result.length - 1 - (points - 1); i--) {
            data.push({
              temperature: result[i].temperature,
              humidity: result[i].humidity,
              timestamp: result[i].timestamp,
            });
          }
        }
        res.json(data.reverse());
      }
    });
});
