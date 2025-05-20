document.addEventListener("DOMContentLoaded", () => {
  const timeElem = document.querySelector("#time");
  const dateElem = document.querySelector("#date");

  function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;

    timeElem.textContent = `${hours}:${minutes}:${seconds} ${ampm}`;

    const dayOfWeek = now.toLocaleString("en-US", { weekday: "long" });
    const day = now.getDate();
    const month = now.toLocaleString("en-US", { month: "long" });
    dateElem.textContent = `${dayOfWeek}, ${day} ${month}`;
  }

  setInterval(updateClock, 1000);
  updateClock();
});
