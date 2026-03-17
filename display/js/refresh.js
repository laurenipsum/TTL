// get the number of the day of the month
const todayDay = today.getDate(); 

function checkDateRollover() {
  // get the date again and set it as a different const 
  const irlDate = new Date(); 
  // get the number of the day of the month from the new date
  const irlDateDay = irlDate.getDate(); 
  // check if they match
  if (todayDay !== irlDateDay) { 
    // if not, reload
    location.reload(); 
  } 
}

// run that function every hour
setInterval(checkDateRollover, 3600000); 
