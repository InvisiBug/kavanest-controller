////////////////////////////////////////////////////////////////////////
//
//   ██████╗ ██████╗ ███╗   ███╗██████╗ ██╗   ██╗████████╗███████╗██████╗      █████╗ ██╗   ██╗██████╗ ██╗ ██████╗ 
//  ██╔════╝██╔═══██╗████╗ ████║██╔══██╗██║   ██║╚══██╔══╝██╔════╝██╔══██╗    ██╔══██╗██║   ██║██╔══██╗██║██╔═══██╗
//  ██║     ██║   ██║██╔████╔██║██████╔╝██║   ██║   ██║   █████╗  ██████╔╝    ███████║██║   ██║██║  ██║██║██║   ██║
//  ██║     ██║   ██║██║╚██╔╝██║██╔═══╝ ██║   ██║   ██║   ██╔══╝  ██╔══██╗    ██╔══██║██║   ██║██║  ██║██║██║   ██║
//  ╚██████╗╚██████╔╝██║ ╚═╝ ██║██║     ╚██████╔╝   ██║   ███████╗██║  ██║    ██║  ██║╚██████╔╝██████╔╝██║╚██████╔╝
//   ╚═════╝ ╚═════╝ ╚═╝     ╚═╝╚═╝      ╚═════╝    ╚═╝   ╚══════╝╚═╝  ╚═╝    ╚═╝  ╚═╝ ╚═════╝ ╚═════╝ ╚═╝ ╚═════╝ 
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
var computerAudio  = null;

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
app.get('/api/computerAudio/Status', (req, res) =>
{
  res.json(computerAudio);
});

app.post('/api/ComputerAudio/On', (req, res) =>
{
  console.log("Computer Audio On: " + req.body.Device);
  if(req.body.Device == "Master") 
  {
    client.publish("Computer Audio Control", '1'); // Toggle power button

    computerAudio.Left  = true;
    computerAudio.Right = true;
    computerAudio.Sub   = true;
    computerAudio.Mixer = true;
  }

  else
  {
    req.body.Device == "Left"  ? computerAudio.Left  = true :
    req.body.Device == "Right" ? computerAudio.Right = true :
    req.body.Device == "Sub"   ? computerAudio.Sub   = true :
    req.body.Device == "Mixer" ? computerAudio.Mixer = true : null

    client.publish("Computer Audio Control", JSON.stringify(computerAudio));
  }

  res.json(computerAudio);
});


app.post('/api/ComputerAudio/Off', (req, res) =>
{
  console.log("Computer Audio Off: " + req.body.Device);
  if(req.body.Device == "Master")
  {
    client.publish("Computer Audio Control", '0'); // Toggle power button

    computerAudio.Left  = false;
    computerAudio.Right = false;
    computerAudio.Sub   = false;
    computerAudio.Mixer = false;
  }

  else 
  {
    req.body.Device == "Left"  ? computerAudio.Left  = false :
    req.body.Device == "Right" ? computerAudio.Right = false :
    req.body.Device == "Sub"   ? computerAudio.Sub   = false :
    req.body.Device == "Mixer" ? computerAudio.Mixer = false : null

    client.publish("Computer Audio Control", JSON.stringify(computerAudio));
  }
  // console.log(computerAudio);

  res.json(computerAudio);
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
  if(topic == "Computer Audio")
  {
    if(payload != "Computer Audio Disconnected") 
    {
      computerAudio = JSON.parse(payload);
      io.emit("Computer Audio", computerAudio);
    }
    else
    {
      computerAudio = null;
      io.emit("Computer Audio", computerAudio);
      console.log("Computer Audio Disconnected");
    }
  }
});