// Store timeout ID globally
let screensaverTimeoutId = null;

document
  .getElementById("settingsCheckBox")
  .addEventListener("change", function () {
    const appTitle = document.getElementById("appTitle");
    const appTagline = document.getElementById("appTagline");
    const websiteLink = document.getElementById("websiteLink");
    const myName = document.getElementById("myName");
    const settingsButton = document.querySelector(".settingsButton");
    const screenSaver = document.querySelector(".screensaver");

    if (this.checked) {
      console.log("Checkbox is checked");
      // Function to execute when checkbox is checked

      appTitle.style.display = "none";
      appTagline.style.display = "none";
      websiteLink.style.display = "none";
      myName.style.display = "none";

      // Positioning the settings button
      settingsButton.style.bottom = "90px";

      // Positioning the screensaver button
      screenSaver.style.right = "-65px";
      screenSaver.style.transform = "rotate(180deg)";

      // Clear any existing timeout
      if (screensaverTimeoutId) {
        clearTimeout(screensaverTimeoutId);
      }

      // Set new timeout and store its ID
      screensaverTimeoutId = setTimeout(() => {
        screenSaver.style.display = "none";
        screensaverTimeoutId = null;
      }, 1300);

      const enabled = () => {};
      enabled();
    } else {
      console.log("Checkbox is unchecked");
      // Function to execute when checkbox is unchecked

      // Clear the timeout if it exists
      if (screensaverTimeoutId) {
        clearTimeout(screensaverTimeoutId);
        screensaverTimeoutId = null;
      }

      appTitle.style.display = "block";
      appTagline.style.display = "block";
      websiteLink.style.display = "block";
      myName.style.display = "block";

      // Make sure screensaver is visible and properly positioned
      if (infoCheckBox.checked) {
        screenSaver.style.display = "block";
      }
      screenSaver.style.right = "20px"; // Reset to original position
      screenSaver.style.transform = "rotate(0deg)";

      // Positioning the settings button
      settingsButton.style.bottom = "160px";
    }
  });
