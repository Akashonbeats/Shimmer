document.getElementById("infoCheckBox").addEventListener("change", function () {
  const app = document.querySelector(".app");
  const formatBar = document.querySelector(".format-bar");
  const aboutPage = document.querySelector(".about-page");
  const screenSaver = document.querySelector(".screensaver");

  if (this.checked) {
    // Function to execute when checkbox is checked
    const enabled = () => {
      console.log("Checkbox is checked");
      app.style.display = "none";
      formatBar.style.display = "none";
      aboutPage.style.display = "flex";
      screenSaver.style.display = "block";

      // Start the clock (Triggering this in the about page itself just to preload the data before the user enters screensaver mode)
      window.clockModule.start();

      // Start music updates (Triggering this in the about page itself just to preload the data before the user enters screensaver mode)
      if (window.musicModule) {
        window.musicModule.start();
      }
    };
    enabled();
  } else {
    // Function to execute when checkbox is unchecked
    console.log("Checkbox is unchecked");
    app.style.display = "block";
    formatBar.style.display = "block";
    aboutPage.style.display = "none";
    screenSaver.style.display = "none";

    // Stop music updates
    if (window.musicModule) {
      window.musicModule.stop();
    }

    // Stop the clock
    window.clockModule.stop();

    document.getElementById("screensaverCheckBox").checked = false;
    document
      .getElementById("screensaverCheckBox")
      .dispatchEvent(new Event("change"));
  }
});
