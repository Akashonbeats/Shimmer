document
  .getElementById("screensaverCheckBox")
  .addEventListener("change", function () {
    const appTitle = document.getElementById("appTitle");
    const appTagline = document.getElementById("appTagline");
    const websiteLink = document.getElementById("websiteLink");
    const myName = document.getElementById("myName");
    const settingsButton = document.querySelector(".settingsButton");
    const screensaverOverlay = document.querySelector(".screensaver-overlay");
    const infoCheckBox = document.getElementById("infoCheckBox");

    if (this.checked) {
      // Function to execute when checkbox is checked
      const enabled = () => {
        console.log("Checkbox is checked");
        appTitle.style.display = "none";
        appTagline.style.display = "none";
        websiteLink.style.display = "none";
        myName.style.display = "none";
        settingsButton.style.display = "none";
        screensaverOverlay.style.display = "flex";

        // Go fullscreen
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen();
        }

        // ... acquire wake lock as before ...
        if ("wakeLock" in navigator) {
          navigator.wakeLock
            .request("screen")
            .then((lock) => {
              window.myWakeLock = lock;
            })
            .catch((err) => console.error(err));
        }
      };
      enabled();
    } else {
      // Function to execute when checkbox is unchecked
      console.log("Checkbox is unchecked");
      appTitle.style.display = "block";
      appTagline.style.display = "block";
      websiteLink.style.display = "block";
      myName.style.display = "block";
      screensaverOverlay.style.display = "none";

      // To only show settings button if info checkbox is checked
      if (infoCheckBox.checked) {
        settingsButton.style.display = "block";
      }

      // Disable fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }

      // Release wake lock if available
      if (window.myWakeLock) {
        window.myWakeLock.release().then(() => {
          window.myWakeLock = null;
        });
      }
    }
  });
