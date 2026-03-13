// create today 
const today = new Date(); 

//create one day's worth of milliseconds
const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24; 
//get the date a week from today 
const oneWeek = new Date(today.getTime() + (MILLISECONDS_PER_DAY * 7)); 
//get the date two weeks from today 
const twoWeeks = new Date(today.getTime() + (MILLISECONDS_PER_DAY * 14)); 

// set the dates
document.getElementById('one-week').textContent = days[oneWeek.getDay()] + ", " + months[oneWeek.getMonth()] + " " + oneWeek.getDate() + getSuffix(oneWeek.getDate());
document.getElementById('two-weeks').textContent = days[twoWeeks.getDay()] + ", " + months[twoWeeks.getMonth()] + " " + twoWeeks.getDate() + getSuffix(twoWeeks.getDate()); 