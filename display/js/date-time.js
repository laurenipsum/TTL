//day and month arrays 
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

      function updateDateTime() { 
        // create 'now' and test it
        const now = new Date(); 

        //create suffixes for ordinal numbers on dates
        let suffix; 
        if ([11, 12, 13].includes(now.getDate())) { 
          suffix = "th"; //if the date is 11, 12, or 13, the suffix should be 'th'
        } else if (now.getDate() % 10 === 1) { 
          suffix = "st"; // if the date's number divided by 10 has a remainder of 1, the suffix should be 'st'
        } else if (now.getDate() %10 === 2) { 
          suffix = "nd"; // if the date's number divided by 10 has a remainder of 2, the suffix should be 'nd'
        } else if (now.getDate() %10 === 3) { 
          suffix = "rd"; // if the date's number divided by 10 has a remainder of 3, the suffix should be 'rd'
        } else suffix = "th"; // the rest are 'th'

        //convert to 12h time
        let hour; 
        if (now.getHours() === 0) 
          { 
            hour = 12; //if hours is 0 (midnight) change it to 12
          } else if (now.getHours() < 13) { 
            hour = now.getHours(); // else if hours is under 13, just use it as-is
          } else { 
            hour = now.getHours() - 12; // else subtract 12 from the value.
          }

        //minutes padding 
        let minutes; 
        if (now.getMinutes() < 10) 
          { minutes = '0' + now.getMinutes();  // if minutes is under 10, prepend a 0 
          } else { 
            minutes = now.getMinutes(); // otherwise leave it as-is
          }

        // AM / PM 
        let ampm
        if (now.getHours() < 12) { 
          ampm = "AM"; //if the hour is under 12, it's AM 
        }
        else { 
          ampm = "PM"; // otherwise it's PM
        }

        // get the current date 
        document.getElementById('current-date').textContent = days[now.getDay()] + ", " + months[now.getMonth()] + " " + now.getDate() + suffix; 
        document.getElementById('current-time').textContent = hour + ":" + minutes + " " + ampm;
      }

      updateDateTime()
      setInterval(updateDateTime, 10000);