//What day is it? → which closing time applies (or none, if it's not an open day)
//What time is it now?
//Calculate minutes until close
//If less than 30, show the countdown. Otherwise show nothing.


function updateClosingCountdown() { 
  // create 'now'
  const now = new Date(); 
  const nowDay = now.getDay(); //today's day of the week as a number
  const nowHour = now.getHours(); //now's hour as a number
  const nowMinutes = now.getMinutes(); //now's minutes as a number
  

  if (openDays.includes(nowDay)) { //check whether the openDays array in utils.js includes today's day of the week as a number 
    const todayClosingHour = closingTimes[nowDay].hour; //get the closing time's hour from the object in utils.js
    const todayClosingMinute = closingTimes[nowDay].minute; //and get the closing time's minutes from the object in utils.js
    
    //compare current time to closing time
    const closingInMinutes = (todayClosingHour * 60) + todayClosingMinute; // find the minutes until closing
    const nowInMinutes = (nowHour * 60) + nowMinutes; //find the current minutes
    const minutesUntilClose = closingInMinutes - nowInMinutes; //find the difference

    if (minutesUntilClose < 0) { //if we closed in the past
       document.getElementById('closing-countdown').textContent = "Closed!"; 
    } 
    else if (minutesUntilClose < 30) { // if we close in the next 30 minutes
       document.getElementById('closing-countdown').textContent = "Closing in " + minutesUntilClose + " minutes"; 
    }
    else { //in all other cases
      document.getElementById('closing-countdown').textContent = ""; 
    }
  };
}

updateClosingCountdown(); //actually run the thing
setInterval(updateClosingCountdown, 30000); //every thirty seconds
