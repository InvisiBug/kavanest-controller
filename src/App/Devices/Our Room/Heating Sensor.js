////////////////////////////////////////////////////////////////////////
//
//  ██████╗ ███████╗██████╗ ██████╗  ██████╗  ██████╗ ███╗   ███╗     ██████╗██╗     ██╗███╗   ███╗ █████╗ ████████╗███████╗
//  ██╔══██╗██╔════╝██╔══██╗██╔══██╗██╔═══██╗██╔═══██╗████╗ ████║    ██╔════╝██║     ██║████╗ ████║██╔══██╗╚══██╔══╝██╔════╝
//  ██████╔╝█████╗  ██║  ██║██████╔╝██║   ██║██║   ██║██╔████╔██║    ██║     ██║     ██║██╔████╔██║███████║   ██║   █████╗  
//  ██╔══██╗██╔══╝  ██║  ██║██╔══██╗██║   ██║██║   ██║██║╚██╔╝██║    ██║     ██║     ██║██║╚██╔╝██║██╔══██║   ██║   ██╔══╝  
//  ██████╔╝███████╗██████╔╝██║  ██║╚██████╔╝╚██████╔╝██║ ╚═╝ ██║    ╚██████╗███████╗██║██║ ╚═╝ ██║██║  ██║   ██║   ███████╗
//  ╚═════╝ ╚══════╝╚═════╝ ╚═╝  ╚═╝ ╚═════╝  ╚═════╝ ╚═╝     ╚═╝     ╚═════╝╚══════╝╚═╝╚═╝     ╚═╝╚═╝  ╚═╝   ╚═╝   ╚══════╝
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
const express = require('express');
const app     = module.exports = express();

// Functions
const functions = require('../../Functions.js');

// Database
const path   = require('path');
const Engine = require('tingodb')();
const db     = new Engine.Db(path.join(__dirname, '../../../Databases/Heating'), {});

// Schedule
const schedule = require('node-schedule');

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
var sensorData = null;

var setpoint   = 22;
var hysteresis = 0.5;

var addHeat = false;

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
app.get('/api/heating/sensor/ourRoom/status', (req, res) =>
{
  res.json(sensorData);
});

app.get('/api/heating/sensor/ourRoom/setpoint/status', (req, res) =>
{
  res.json(setpoint);
});

app.post('/api/heating/sensor/ourRoom/setpoint/set', (req, res) =>
{
  setpoint = req.body.value
  console.log(setpoint)
  res.end(null);
});

////////////////////////////////////////////////////////////////////////
//
//  #     #  #####  ####### #######    #     #                                              ######                                              
//  ##   ## #     #    #       #       ##   ## ######  ####   ####    ##    ####  ######    #     # ######  ####  ###### # #    # ###### #####  
//  # # # # #     #    #       #       # # # # #      #      #       #  #  #    # #         #     # #      #    # #      # #    # #      #    # 
//  #  #  # #     #    #       #       #  #  # #####   ####   ####  #    # #      #####     ######  #####  #      #####  # #    # #####  #    # 
//  #     # #   # #    #       #       #     # #           #      # ###### #  ### #         #   #   #      #      #      # #    # #      #    # 
//  #     # #    #     #       #       #     # #      #    # #    # #    # #    # #         #    #  #      #    # #      #  #  #  #      #    # 
//  #     #  #### #    #       #       #     # ######  ####   ####  #    #  ####  ######    #     # ######  ####  ###### #   ##   ###### ##### 
//
////////////////////////////////////////////////////////////////////////
client.on('message', (topic, payload) =>
{
  if(topic == "Our Room Heating Sensor")
  {
    if(payload != "Our Room Heating Sensor Disconnected") 
    {
      sensorData = JSON.parse(payload);
      io.emit("Our Room Heating Sensor", sensorData);
    }
    else
    {
      sensorData = null;
      io.emit("Our Room Heating Sensor", sensorData);
      console.log("Our Room Heating Sensor Disconnected");
    }
  }
});

////////////////////////////////////////////////////////////////////////
//
//  ######                                                  
//  #     #   ##   #####   ##   #####    ##    ####  ###### 
//  #     #  #  #    #    #  #  #    #  #  #  #      #      
//  #     # #    #   #   #    # #####  #    #  ####  #####  
//  #     # ######   #   ###### #    # ######      # #      
//  #     # #    #   #   #    # #    # #    # #    # #      
//  ######  #    #   #   #    # #####  #    #  ####  ###### 
//
////////////////////////////////////////////////////////////////////////
var Hourly    = new schedule.RecurrenceRule();
Hourly.minute = 0;

schedule.scheduleJob(Hourly, () =>
{
  if(sensorData)
  {    
    console.log("Saving Our Room")
    var data = { temperature: sensorData.temperature, humidity: sensorData.humidity, timestamp: functions.currentTime() };
    db.collection('Our Room').insert(data, (err,res) => { if(err) console.log(err) });
  }

  else 
  {
    var data = { temperature: null, humidity: null, timestamp: functions.currentTime() };
    db.collection('Our Room').insert(data, (err,res) => { if(err) console.log(err) });
  }
});

// const bedroomtemperatureController = setInterval(()  =>
// {
//   try
//   {
//     if((sensorData.temperature < setpoint - hysteresis))
//     {
//       client.publish("Our Room Radiator Control", JSON.stringify({"Node": "Our Room temperature Controller", "state": true}));
//       client.publish("Heating Request Control",   JSON.stringify({"Node": "Our Room temperature Controller", "state": true}));
//     }
// 
//     if((sensorData.temperature > setpoint + hysteresis))
//     {
//       client.publish("Our Room Radiator Control", JSON.stringify({"Node": "Our Room temperature Controller", "state": false}));
//       client.publish("Heating Request Control",   JSON.stringify({"Node": "Our Room temperature Controller", "state": false}));
//     }
//   }
// 
//   catch {}
// }, 5 * 1000);