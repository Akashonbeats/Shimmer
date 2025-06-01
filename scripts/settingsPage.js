document
  .getElementById("settingsCheckBox")
  .addEventListener("change", function () {
    const appTitle = document.getElementById("appTitle");
    const appTagline = document.getElementById("appTagline");
    const websiteLink = document.getElementById("websiteLink");
    const myName = document.getElementById("myName");
    const screenSaver = document.querySelector(".screensaver");
    const settingsButton = document.querySelector(".settingsButton");
    const infoCheckBox = document.getElementById("infoCheckBox");

    if (this.checked) {
      console.log("Checkbox is checked");
      // Function to execute when checkbox is checked

      appTitle.style.display = "none";
      appTagline.style.display = "none";
      websiteLink.style.display = "none";
      myName.style.display = "none";
      screenSaver.style.display = "none";

      // Positioning the settings button
      settingsButton.style.bottom = "90px";

      const enabled = () => {};
      enabled();
    } else {
      console.log("Checkbox is unchecked");
      // Function to execute when checkbox is unchecked

      appTitle.style.display = "block";
      appTagline.style.display = "block";
      websiteLink.style.display = "block";
      myName.style.display = "block";

      if (infoCheckBox.checked) {
        screenSaver.style.display = "block";
      }

      // Positioning the settings button
      settingsButton.style.bottom = "160px";
    }
  });
