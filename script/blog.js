/* =========================
   RADIO STATIONS
========================= */
const radioStations = [
  {
    name: "Radio Maria 103.1 MHz",
    src: "https://dreamsiteradiocp2.com/proxy/rmmozambique2?mp=/stream"
  },
  {
    name: "RM ANTENA NACIONAL",
    src: "https://node.stream-africa.com:8443/AntenaNacional"
  },
  {
    name: "Radio Maria Papua New Guinea",
    src: "https://dreamsiteradiocp2.com/proxy/rmpapua2?mp=/stream"
  },
  {
    name: "Radio Miramar",
    src: "https://nl.digitalrm.pt:8150/stream"
  },
  {
    name: "SUPER RM",
    src: "https://c1.mirror.africa:8443/227"
  },

  {
    name: "Cabo Delgado FM",
    src: "https://node.stream-africa.com:8443/CaboDelgadoFM"
  },
  {
    name: "Manica FM",
    src: "https://node.stream-africa.com:8443/ManicaFM"
  },
  {
    name: "Maputo Corridor FM",
    src: "https://node.stream-africa.com:8443/MaputoCorridor"
  },
  {
    name: "Radio Mocambique Maputo FM",
    src: "https://node.stream-africa.com:8443/MaputoFM"
  },
  {
    name: "Nampula FM",
    src: "https://node.stream-africa.com:8443/Nampula"
  },

  {
    name: "Niassa FM",
    src: "https://node.stream-africa.com:8443/NiassaFM"
  },
  {
    name: "Power FM Lusaka",
    src: "https://node.stream-africa.com:8443/PowerFMLusaka"
  },
  {
    name: "RM Desporto",
    src: "https://node.stream-africa.com:8443/RMDesporto"
  },
  {
    name: "Radio Cidade Beira",
    src: "https://node.stream-africa.com:8443/RadioCidadeBeira"
  },
  {
    name: "Radio Cidade Maputo",
    src: "https://node.stream-africa.com:8443/RadioCidadeMaputo"
  },
  {
    name: "Sofala FM",
    src: "https://node.stream-africa.com:8443/Sofala"
  },
  {
    name: "Zambezi FM",
    src: "https://node.stream-africa.com:8443/ZambeziFM"
  },
  {
    name: "Zambezia FM",
    src: "https://node.stream-africa.com:8443/ZambeziaFM"
  },
  {
    name: "Tete FM",
    src: "https://node.stream-africa.com:8443/TeteFM"
  },
  {
    name: "LM RADIO",
    src: "https://cast6.asurahosting.com/proxy/lmradioc/stream"
  }
];

/* =========================
     STATE
  ========================= */
let currentAudio = null;
let isPlaying = false;
let activeCard = null;
let activeButton = null;

/* =========================
     DOM
  ========================= */
const grid = document.getElementById("radio-grid");

const miniPlayer = document.getElementById("mini-player");
const miniTitle = document.getElementById("mini-title");
const miniStatus = document.getElementById("mini-status");
const miniBtn = document.getElementById("mini-btn");

const vuL = document.getElementById("vu-l");
const vuR = document.getElementById("vu-r");

/* =========================
     INIT
  ========================= */
renderStations();

/* =========================
     RENDER CARDS
  ========================= */
function renderStations() {
  grid.innerHTML = "";

  radioStations.forEach((station) => {
    const card = document.createElement("div");
    card.className = "radio-card";

    const btn = document.createElement("div");
    btn.className = "radio-play";
    btn.innerText = "▶ Play";

    const title = document.createElement("div");
    title.className = "radio-title";
    title.innerText = station.name;

    card.appendChild(title);
    card.appendChild(btn);

    card.onclick = () => playStation(station, card, btn);

    grid.appendChild(card);
  });
}

/* =========================
     PLAY STATION
  ========================= */
function playStation(station, card, btn) {
  // reset previous UI
  if (activeButton) {
    activeButton.innerText = "▶ Play";
  }

  if (activeCard) {
    activeCard.classList.remove("active");
  }

  // stop previous audio
  if (currentAudio) {
    currentAudio.pause();
  }

  // create new audio
  const audio = new Audio(station.src);
  audio.crossOrigin = "anonymous";
  audio.play();

  currentAudio = audio;
  isPlaying = true;

  activeCard = card;
  activeButton = btn;

  // UI update
  card.classList.add("active");
  btn.innerText = "⏸ Pause";

  miniTitle.innerText = station.name;
  miniStatus.innerText = "LIVE";
  miniBtn.innerText = "⏸";

  miniPlayer.classList.add("show");

  connectVU(audio);
}

/* =========================
     MINI PLAYER CONTROL
  ========================= */
miniBtn.onclick = () => {
  if (!currentAudio) return;

  if (isPlaying) {
    currentAudio.pause();
    isPlaying = false;

    miniBtn.innerText = "▶";
    miniStatus.innerText = "PAUSED";

    // sync card button
    if (activeButton) activeButton.innerText = "▶ Play";
  } else {
    currentAudio.play();
    isPlaying = true;

    miniBtn.innerText = "⏸";
    miniStatus.innerText = "LIVE";

    // sync card button
    if (activeButton) activeButton.innerText = "⏸ Pause";
  }
};

/* =========================
     VU METER (WEB AUDIO API)
  ========================= */
let audioCtx;
let analyser;
let dataArray;

function connectVU(audio) {
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  const source = audioCtx.createMediaElementSource(audio);
  analyser = audioCtx.createAnalyser();

  analyser.fftSize = 256;

  source.connect(analyser);
  analyser.connect(audioCtx.destination);

  dataArray = new Uint8Array(analyser.frequencyBinCount);

  drawVU();
}

/* =========================
     DRAW VU (SMOOTH)
  ========================= */
function drawVU() {
  requestAnimationFrame(drawVU);

  if (!analyser) return;

  analyser.getByteFrequencyData(dataArray);

  let avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;

  let level = avg / 2;

  // smooth stereo feel
  vuL.style.height = level + "px";
  vuR.style.height = level * 0.7 + "px";
}

/* =========================
   DESKTOP PLAYER ELEMENTS
========================= */
const dp = document.getElementById("desktop-player");
const dpTitle = document.getElementById("dp-title");
const dpStatus = document.getElementById("dp-status");
const dpBtn = document.getElementById("dp-btn");

/* =========================
   UPDATE DESKTOP PLAYER
========================= */
function updateDesktopUI(station) {
  dpTitle.innerText = station.name;
  dpStatus.innerText = isPlaying ? "LIVE" : "PAUSED";

  dp.classList.add("show");
}

/* =========================
   SYNC INSIDE PLAYSTATION
========================= */
function playStation(station, card, btn) {
  // stop previous
  if (currentAudio) {
    currentAudio.pause();
  }

  const audio = new Audio(station.src);
  audio.crossOrigin = "anonymous";
  audio.play();

  currentAudio = audio;
  isPlaying = true;

  activeCard = card;
  activeButton = btn;

  // UI cards
  document
    .querySelectorAll(".radio-card")
    .forEach((c) => c.classList.remove("active"));

  card.classList.add("active");

  btn.innerText = "⏸ Pause";

  // MINI PLAYER
  miniTitle.innerText = station.name;
  miniStatus.innerText = "LIVE";
  miniBtn.innerText = "⏸";
  miniPlayer.classList.add("show");

  // DESKTOP PLAYER (NEW)
  updateDesktopUI(station);

  dpBtn.innerText = "⏸";

  connectVU(audio);
}

dpBtn.onclick = () => {
  if (!currentAudio) return;

  if (isPlaying) {
    currentAudio.pause();
    isPlaying = false;

    dpBtn.innerText = "▶";
    dpStatus.innerText = "PAUSED";

    miniBtn.innerText = "▶";
    miniStatus.innerText = "PAUSED";

    if (activeButton) activeButton.innerText = "▶ Play";
  } else {
    currentAudio.play();
    isPlaying = true;

    dpBtn.innerText = "⏸";
    dpStatus.innerText = "LIVE";

    miniBtn.innerText = "⏸";
    miniStatus.innerText = "LIVE";

    if (activeButton) activeButton.innerText = "⏸ Pause";
  }
};
