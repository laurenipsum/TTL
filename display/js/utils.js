//day and month arrays 
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

//create suffixes for ordinal numbers on dates
  function getSuffix(date) { 
    let suffix; 
    if ([11, 12, 13].includes(date)) { 
      suffix = "th"; //if the date is 11, 12, or 13, the suffix should be 'th'
    } else if (date % 10 === 1) { 
      suffix = "st"; // if the date's number divided by 10 has a remainder of 1, the suffix should be 'st'
    } else if (date %10 === 2) { 
      suffix = "nd"; // if the date's number divided by 10 has a remainder of 2, the suffix should be 'nd'
    } else if (date %10 === 3) { 
      suffix = "rd"; // if the date's number divided by 10 has a remainder of 3, the suffix should be 'rd'
    } else suffix = "th"; // the rest are 'th'
    return suffix; 
  }