// Create a global module for clock functions
window.clockModule = (() => {
  let clockInterval = null;
  
  function updateClock() {
    const timeElem = document.querySelector("#time");
    const dateElem = document.querySelector("#date");
    
    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;

    // Format time with smaller AM/PM at the same level as the time
    timeElem.innerHTML = `${hours}:${minutes}:${seconds}<span style="font-size:0.5em; vertical-align:down; position:relative;">${ampm}</span>`;

    const dayOfWeek = now.toLocaleString("en-US", { weekday: "long" });
    const day = now.getDate();
    const month = now.toLocaleString("en-US", { month: "long" });
    dateElem.textContent = `${dayOfWeek}, ${day} ${month}`;
  }

  return {
    start: function() {
      if (!clockInterval) {
        updateClock(); // Update immediately
        clockInterval = setInterval(updateClock, 1000);
      }
    },
    stop: function() {
      if (clockInterval) {
        clearInterval(clockInterval);
        clockInterval = null;
      }
    }
  };
})();

// No automatic start - will be triggered by screensaver
