////////////////////////////////////////////////////////////////////////
//
// ██╗  ██╗███████╗ █████╗ ████████╗██╗███╗   ██╗ ██████╗         ██╗     ██████╗ ██╗   ██╗██████╗     ██████╗  ██████╗  ██████╗ ███╗   ███╗
// ██║  ██║██╔════╝██╔══██╗╚══██╔══╝██║████╗  ██║██╔════╝        ██╔╝    ██╔═══██╗██║   ██║██╔══██╗    ██╔══██╗██╔═══██╗██╔═══██╗████╗ ████║
// ███████║█████╗  ███████║   ██║   ██║██╔██╗ ██║██║  ███╗      ██╔╝     ██║   ██║██║   ██║██████╔╝    ██████╔╝██║   ██║██║   ██║██╔████╔██║
// ██╔══██║██╔══╝  ██╔══██║   ██║   ██║██║╚██╗██║██║   ██║     ██╔╝      ██║   ██║██║   ██║██╔══██╗    ██╔══██╗██║   ██║██║   ██║██║╚██╔╝██║
// ██║  ██║███████╗██║  ██║   ██║   ██║██║ ╚████║╚██████╔╝    ██╔╝       ╚██████╔╝╚██████╔╝██║  ██║    ██║  ██║╚██████╔╝╚██████╔╝██║ ╚═╝ ██║
// ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝   ╚═╝   ╚═╝╚═╝  ╚═══╝ ╚═════╝     ╚═╝         ╚═════╝  ╚═════╝ ╚═╝  ╚═╝    ╚═╝  ╚═╝ ╚═════╝  ╚═════╝ ╚═╝     ╚═╝
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
// const functions = require('../Heating Functions.js');

// Database
// const path   = require('path');
// const Engine = require('tingodb')();
// const db     = new Engine.Db(path.join(__dirname, '../Databases/Our Room'), {});

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
var blanketSchedule = null;

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
app.get('/api/blanket/status', (req, res) =>
{
  res.json(blanketSchedule);
});

app.post('/api/blanket/schedule/update', (req, res) =>
{
  blanketSchedule = req.body.vals;

  var dataToSend = {};

  for(var key in blanketSchedule)
  {
    dataToSend[key] = tabletToSystem(blanketSchedule[key]);
  }

  client.publish("Electric Blanket Control", JSON.stringify(dataToSend));

  res.end(null)
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
  if(topic == "Electric Blanket")
  {
    if(payload != "Electric Blanket Disconnected")
    {
      bedroomClimate = JSON.parse(payload);
      io.emit("Electric Blanket", bedroomClimate);
    }
    else
    {
      bedroomClimate = null;
      io.emit("Electric Blanket", bedroomClimate);
      console.log("Electric Blanket Disconnected");
    }
  }
});

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
tabletToSystem = (values) =>
{
  try
  {
    var adjustedValues = [];

    for(index of values.keys())
    {
      var last = [];

      values[index] % 1 === .25 ? last[index] = "15" :
      values[index] % 1 === .5  ? last[index] = "30" :
      values[index] % 1 === .75 ? last[index] = "45" :
      values[index] % 1 === .0  ? last[index] = "00" :
      null

      var value = parseFloat(Math.floor(values[index]) + "." + last[index]);

      adjustedValues[index] = value;
    }
    return adjustedValues;
  }

  catch (error) // Active is dealt with here
  { 
    // console.log(error)
    return values 
  }
}

systemToTablet = (values) =>
{
  newValues = [];
  finalVals = [];

  var first = [];
  var last  = [];

  for(index of values.keys())
  {
    newValues[index] = values[index].toString().padStart(4, '0');

    first[index] = newValues[index].substring(0,2);
    last[index]  = newValues[index].substring(2,4);

    newValues[index].substring(2,4) == "15" ? last[index] = "25" :  
    newValues[index].substring(2,4) == "30" ? last[index] = "50" :
    newValues[index].substring(2,4) == "45" ? last[index] = "75" :
    null

    finalVals[index] = parseFloat(first[index] + "." + last[index]);
  }
  return finalVals;
}