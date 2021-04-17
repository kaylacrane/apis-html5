const fileInput = document.getElementById("file-upload-input");
const videoDisplay = document.getElementById("video-display");
const progressBar = document.getElementById("progress-bar");
const controlButtons = document.querySelector(".video-control-buttons");
const playPauseButton = document.getElementById("playpause");
const muteButton = document.getElementById("mute");

//función manejadora para subir archivo a través de input tipo file
function handleFileSelect(event) {
  resetPlayer();
  //coge solo el primer archivo si varios son seleccionados por input
  let file = event.target.files[0];
  //solo acepta archivos tipo video
  if (file.type.match("video*")) {
    let fileReader = new FileReader();
    fileReader.onload = (event) => {
      //enseña los botones de control y crea el video
      controlButtons.classList.remove("hidden-element");
      videoDisplay.innerHTML = `<video src=${event.target.result} id="video-content" width="650" onloadstart="this.volume=0.5"></video>`;
    };
    fileReader.onloadstart = () =>
      //mensaje de que se está cargando el video
      (videoDisplay.innerHTML = `<p class="messages">Loading video...</p>`);
    fileReader.onloadend = () => {
      //ventana de aviso que indica que se cargó bien el video
      alert("📽️ Video has loaded correctly. Click PLAY to start viewing.");
      const video = document.getElementById("video-content");
      //para que el botón de play/pause se resetee si el video se termina
      video.addEventListener("ended", function () {
        playPauseButton.classList.remove("red"),
          playPauseButton.classList.add("green");
        playPauseButton.dataset.state = "paused";
      });
    };
    fileReader.readAsDataURL(file);
  } else {
    //error que se ve si el usuario intenta subir otro tipo de archivo
    //se esconden de nuevo los botones en ese caso
    videoDisplay.innerHTML = `<p class="messages">Please choose a valid video file...</p>`;
    controlButtons.classList.add("hidden-element");
  }
}
//función para cuando el usuario hace clic en cualquiera de los botones de control de video
function handleControlButtonClick(event) {
  const button = event.target;
  const video = document.getElementById("video-content");
  //elige función según tipo de botón: cambio de estado (play/pause) o volumen (+/-/mute)
  if (button.id === "playpause") {
    togglePlayPause(button, video);
  } else {
    setVolume(button, video);
  }
}
//función que resetea los botónes de control
function resetPlayer() {
  videoDisplay.innerHTML = "";
  playPauseButton.classList.remove("red");
  playPauseButton.classList.add("green");
  muteButton.classList.remove("orange");
}
//función que maneja el botón de play/pause
function togglePlayPause(button, video) {
  button.classList.toggle("red");
  button.classList.toggle("green");
  if (video.paused || video.ended) {
    video.play();
    button.dataset.state = "playing";
  } else {
    video.pause();
    button.dataset.state = "paused";
  }
}
//función que maneja botones de volumen y mute
function setVolume(button, video) {
  if (button.dataset.volume === "volume") {
    //si el video está muteado y se da al botón de volumen:
    video.muted = false;
    muteButton.classList.remove("orange");
    if (button.id === "volume-up" && video.volume < 1) {
      video.volume += 0.1;
    } else if (button.id === "volume-down" && video.volume >= 0.1) {
      video.volume -= 0.1;
    }
  } else if (button.dataset.volume === "mute") {
    muteButton.classList.toggle("orange");
    video.muted = video.muted === false ? true : false;
  }
  //establece un valor más limpio para el volumen
  video.volume = Math.round(video.volume * 10) / 10;
}

//escuchar los eventos
fileInput.addEventListener("change", handleFileSelect);
controlButtons.addEventListener("click", handleControlButtonClick);
