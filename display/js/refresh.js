//1. on page load, check the current time
//2. figure out what time is midnight tonight
//3. subtract midnight’s milliseconds from right now’s milliseconds
//4. set a timeout to that number of milliseconds
//5. refresh the page when the countdown ends

function refreshAtMidnight() { 
  // create 'now'
  const now = new Date();

  // figure out what day is tomorrow (will be 0:00:00 because I'm not specifying a time) 
  const midnight = new Date(now.getFullYear(), now.getMonth(), (now.getDate() + 1)); 

  // calculate time in milliseconds between now and midnight
  const msUntilMidnight = midnight.getTime() - now.getTime();

  // tell the page to reload when msUntilMidnight milliseconds have elapsed -- which should be tomorrow morning at midnight
  setTimeout(location.reload, msUntilMidnight);
}

refreshAtMidnight(); 

