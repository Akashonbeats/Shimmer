document.getElementById("infoCheckBox").addEventListener("change", function() {
    const infoBox = document.querySelector(".app");
    const formatBar = document.querySelector(".format-bar");
    const aboutPage = document.querySelector(".about-page");


    if (this.checked) {
        // Function to execute when checkbox is checked
        const enabled = () => {
            console.log("Checkbox is checked");
            infoBox.style.opacity = "0";
            formatBar.style.opacity = "0";
            aboutPage.style.display = "flex";
        };
        enabled();
    } else {
        // Function to execute when checkbox is unchecked
        console.log("Checkbox is unchecked");
        infoBox.style.opacity = "1";
        formatBar.style.opacity = "1";
        aboutPage.style.display = "none";
    }
});
