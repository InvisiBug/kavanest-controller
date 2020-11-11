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
var livingRoom = null;

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
app.get('/api/heating/sensor/livingRoom/status', (req, res) =>
{
  res.json(livingRoom);
});

app.get('/api/heating/sensor/livingRoom/setpoint/status', (req, res) =>
{
  res.json(setpoint);
});

app.post('/api/heating/sensor/livingRoom/setpoint/set', (req, res) =>
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
  if(topic == "Living Room Heating Sensor")
  {
    if(payload != "Living Room Heating Sensor Disconnected") 
    {
      livingRoom = JSON.parse(payload);
      // console.log(livingRoom);
      io.emit("Living Room Heating Sensor", livingRoom);
    }
    else
    {
      livingRoom = null;
      io.emit("Living Room Heating Sensor", livingRoom);
      console.log("Living Room Heating Sensor Disconnected");
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
  if(livingRoom)
  {    
    var data = { temperature: livingRoom.temperature, humidity: livingRoom.humidity, timestamp: functions.currentTime() };
    db.collection('Living Room').insert(data, (err,res) => { if(err) console.log(err) });
  }

  else 
  {
    var data = { temperature: null, humidity: null, timestamp: functions.currentTime() };
    db.collection('Living Room').insert(data, (err,res) => { if(err) console.log(err) });
  }
});

// const bedroomTemperatureController = setInterval(()  =>
// {
//   try
//   {
//     if((livingRoom.Temperature < setpoint - hysteresis))
//     {
//       client.publish("Living Room Radiator Control", JSON.stringify({"Node": "Living Room Temperature Controller", "state": true}));
//       client.publish("Heating Request Control",   JSON.stringify({"Node": "Living Room Temperature Controller", "state": true}));
//     }
// 
//     if((livingRoom.Temperature > setpoint + hysteresis))
//     {
//       client.publish("Living Room Radiator Control", JSON.stringify({"Node": "Living Room Temperature Controller", "state": false}));
//       client.publish("Heating Request Control",   JSON.stringify({"Node": "Living Room Temperature Controller", "state": false}));
//     }
//   }
// 
//   catch {}
// }, 5 * 1000);