// Only create the music module on macOS
if (require("os").platform() === "darwin") {
  window.musicModule = (() => {
    const { ipcRenderer } = require("electron");
    let updateInterval = null;

    function updateSongInfo() {
      ipcRenderer.invoke("getNowPlaying").then((info) => {
        const songElement = document.getElementById("song");
        const artistElement = document.getElementById("artist");
        const songInfoDiv = document.getElementById("songInfo");

        if (info.title && info.artist) {
          songElement.innerHTML = "<span>Now Playing -</span> " + info.title;
          artistElement.innerHTML = "<span>By </span> " + info.artist;
          songInfoDiv.style.display = "grid";
        } else {
          songInfoDiv.style.display = "none";
        }
      });
    }

    return {
      start: () => {
        updateSongInfo();
        updateInterval = setInterval(updateSongInfo, 1000);
      },
      stop: () => {
        if (updateInterval) {
          clearInterval(updateInterval);
          updateInterval = null;
        }

        // Stop the clock
        window.clockModule.stop();

        // Hide music info when stopped
        const songInfoDiv = document.getElementById("songInfo");
        if (songInfoDiv) songInfoDiv.style.display = "none";
      },
    };
  })();
} else {
  // On non-macOS platforms, set to null
  window.musicModule = null;
}
