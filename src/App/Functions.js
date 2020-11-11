////////////////////////////////////////////////////////////////////////
//
//  ███████╗██╗   ██╗███╗   ██╗ ██████╗████████╗██╗ ██████╗ ███╗   ██╗███████╗
//  ██╔════╝██║   ██║████╗  ██║██╔════╝╚══██╔══╝██║██╔═══██╗████╗  ██║██╔════╝
//  █████╗  ██║   ██║██╔██╗ ██║██║        ██║   ██║██║   ██║██╔██╗ ██║███████╗
//  ██╔══╝  ██║   ██║██║╚██╗██║██║        ██║   ██║██║   ██║██║╚██╗██║╚════██║
//  ██║     ╚██████╔╝██║ ╚████║╚██████╗   ██║   ██║╚██████╔╝██║ ╚████║███████║
//  ╚═╝      ╚═════╝ ╚═╝  ╚═══╝ ╚═════╝   ╚═╝   ╚═╝ ╚═════╝ ╚═╝  ╚═══╝╚══════╝
//
////////////////////////////////////////////////////////////////////////
const currentTime = () => // Move to functions file
{
  var d = new Date();
  let hour   = d.getHours();
  let minute = d.getMinutes();
  let second = d.getSeconds();

  let day   = d.getDate();
  let month = d.getMonth() + 1;
  let year  = d.getFullYear();

  var daysOfWeek  = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  var monthOfYear = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  let days = daysOfWeek[d.getDay()];
  let months = monthOfYear[d.getMonth()];

  // return hour + ":" + minute + " " + day + "-" + month + "-" + year;
  return {Hour: hour, Minute: minute, Day: day, Month: month, Year: year, Days: days, Months: months};
}

module.exports =
{
	currentTime: currentTime
}