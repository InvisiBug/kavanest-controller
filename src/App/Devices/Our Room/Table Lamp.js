////////////////////////////////////////////////////////////////////////
//
//  ████████╗ █████╗ ██████╗ ██╗     ███████╗    ██╗      █████╗ ███╗   ███╗██████╗ 
//  ╚══██╔══╝██╔══██╗██╔══██╗██║     ██╔════╝    ██║     ██╔══██╗████╗ ████║██╔══██╗
//     ██║   ███████║██████╔╝██║     █████╗      ██║     ███████║██╔████╔██║██████╔╝
//     ██║   ██╔══██║██╔══██╗██║     ██╔══╝      ██║     ██╔══██║██║╚██╔╝██║██╔═══╝ 
//     ██║   ██║  ██║██████╔╝███████╗███████╗    ███████╗██║  ██║██║ ╚═╝ ██║██║     
//     ╚═╝   ╚═╝  ╚═╝╚═════╝ ╚══════╝╚══════╝    ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝      
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
const express = require('express');
const app     = module.exports = express();

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
var tableLamp = null;

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
app.get('/api/tableLamp/Status', (req, res) =>
{
  res.json(tableLamp);
});

app.post('/api/tableLamp/Update', (req, res) =>
{
  tableLamp = 
  {
    "Node": "Table Lamp",
    "red":   req.body.red,
    "green": req.body.green,
    "blue":  req.body.blue,
  }

  client.publish("Table Lamp Control", JSON.stringify(tableLamp));
  res.json(tableLamp);
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
  if(topic == "Table Lamp")
  {
    if(payload != "Table Lamp Disconnected")
    {
      tableLamp = JSON.parse(payload)
      io.emit("Table Lamp", tableLamp);
    }

    else
    {
      tableLamp = null;
      io.emit("Table Lamp", tableLamp);
      console.log("Table Lamp Disconnected");
    }
  }
});