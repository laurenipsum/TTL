

      function updateDateTime() { 
        // create 'now'
        const now = new Date();

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
        document.getElementById('current-date').textContent = days[now.getDay()] + ", " + months[now.getMonth()] + " " + now.getDate() + getSuffix(now.getDate()); 
        document.getElementById('current-time').textContent = hour + ":" + minutes + " " + ampm;
      }

      updateDateTime()
      setInterval(updateDateTime, 10000);