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
const db = new Engine.Db(path.join(__dirname, "../../../PersistantStorage/Historical/"), {});

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
  // console.log(req.body.timescale.toUpperCase());
  let points;
  if (req.body.timescale.toUpperCase() == "DAY") points = 24;
  else if (req.body.timescale.toUpperCase() == "WEEK") points = 168;
  else if (req.body.timescale.toUpperCase() == "MONTH") points = 720;
  else if (req.body.timescale.toUpperCase() == "YEAR") points = 8760;

  db.collection(req.body.room)
    .find()
    .toArray((error, result) => {
      let data = [];

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
