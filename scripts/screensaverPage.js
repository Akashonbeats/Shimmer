document.getElementById("screensaverCheckBox").addEventListener("change", function() {
    const appTitle = document.getElementById("appTitle");
    const appTagline = document.getElementById("appTagline");
    const websiteLink = document.getElementById("websiteLink");
    const screensaverOverlay = document.querySelector(".screensaver-overlay");

    if (this.checked) {
        // Function to execute when checkbox is checked
        const enabled = () => {
            console.log("Checkbox is checked");
            appTitle.style.display = "none";
            appTagline.style.display = "none";
            websiteLink.style.display = "none";
            screensaverOverlay.style.display = "flex";

            // Go fullscreen
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
            }

            // Keep screen on
            if ('wakeLock' in navigator) {
                navigator.wakeLock.request('screen').catch(err => console.error(err));
            }
        };
        enabled();
    } else {
        // Function to execute when checkbox is unchecked
        console.log("Checkbox is unchecked");
        appTitle.style.display = "block";
        appTagline.style.display = "block";
        websiteLink.style.display = "block";
        screensaverOverlay.style.display = "none";

        // Exit fullscreen
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
});
