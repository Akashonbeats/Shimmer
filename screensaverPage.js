document.getElementById("screensaverCheckBox").addEventListener("change", function() {
const appTitle = document.getElementById("appTitle");
const appTagline = document.getElementById("appTagline");
const websiteLink = document.getElementById("websiteLink");

    if (this.checked) {
        // Function to execute when checkbox is checked
        const enabled = () => {
            console.log("Checkbox is checked");
            appTitle.style.display = "none";
            appTagline.style.display = "none";
            websiteLink.style.display = "none";
        };
        enabled();
    } else {
        // Function to execute when checkbox is unchecked
        console.log("Checkbox is unchecked");
        appTitle.style.display = "block";
        appTagline.style.display = "block";
        websiteLink.style.display = "block";

    }
});
