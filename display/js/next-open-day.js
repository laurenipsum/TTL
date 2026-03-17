// how many days away is the next open day? from the array in utils.js
const nextOpenDate = new Date(today.getTime() + (MILLISECONDS_PER_DAY * daysUntilOpen[today.getDay()])); 

// set the right time for the next open day
let nextOpenTime; 
if (nextOpenDate.getDay() === 6) {
  nextOpenTime = '10 AM - 1 PM'; 
} else { 
  nextOpenTime = '4:30 - 7:30 PM';
}

// set the next dates
document.getElementById('next-open-day').textContent = days[nextOpenDate.getDay()] + ", " + months[nextOpenDate.getMonth()] + " " + nextOpenDate.getDate() + getSuffix(nextOpenDate.getDate()); 
document.getElementById('next-open-time').textContent = nextOpenTime; 
