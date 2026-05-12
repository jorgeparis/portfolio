
/* =========================
   RADIO STATIONS
========================= */
const radioStations = [
    {
      radioId: "Radio Maria 103.1 MHz",
      src: "https://dreamsiteradiocp2.com/proxy/rmmozambique2?mp=/stream",
      background: "img/Bk1.jpg"
    },
    {
      radioId: "RM ANTENA NACIONAL",
      src: "https://node.stream-africa.com:8443/AntenaNacional",
      background: "img/Bk8.jpg"
    },
    {
      radioId: "Radio Miramar",
      src: "https://nl.digitalrm.pt:8150/stream",
      background: "img/Animated.jpg"
    },
    {
      radioId: "LM RADIO",
      src: "https://cast6.asurahosting.com/proxy/lmradioc/stream",
      background: "img/Bk7.jpg"
    }
  ];
  
  /* =========================
     STATE
  ========================= */
  let state = {
    currentStation: null,
    audio: null,
    isPlaying: false
  };
  
  /* =========================
     DOM
  ========================= */
  const list = document.getElementById("station-list");
  const bg = document.getElementById("radio-bg");
  const nowPlaying = document.getElementById("now-playing");
  
  /* =========================
     INIT
  ========================= */
  renderStations();
  
  /* =========================
     RENDER STATIONS
  ========================= */
  function renderStations() {
    list.innerHTML = "";
  
    radioStations.forEach((station, index) => {
      const card = document.createElement("div");
      card.className = "station-card";
  
      card.innerHTML = `
        <div class="station-bg" style="background-image:url(${station.background})"></div>
        <div class="station-info">
          <h3>${station.radioId}</h3>
        </div>
      `;
  
      card.onclick = () => playStation(station);
  
      list.appendChild(card);
    });
  }
  
  /* =========================
     PLAY STATION
  ========================= */
  function playStation(station) {
  
    stopCurrent();
  
    const audio = new Audio(station.src);
    audio.crossOrigin = "anonymous";
    audio.play();
  
    state.audio = audio;
    state.currentStation = station;
    state.isPlaying = true;
  
    // UI
    bg.style.backgroundImage = `url(${station.background})`;
    nowPlaying.innerText = "LIVE: " + station.radioId;
  
    connectAnalyser(audio);
  }
  
  /* =========================
     STOP
  ========================= */
  function stopCurrent() {
    if (state.audio) {
      state.audio.pause();
      state.audio = null;
    }
  
    state.isPlaying = false;
  }
  
  /* =========================
     VU METER (WEB AUDIO API)
  ========================= */
  let audioCtx;
  let analyser;
  
  function connectAnalyser(audio) {
  
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  
    const source = audioCtx.createMediaElementSource(audio);
    analyser = audioCtx.createAnalyser();
  
    source.connect(analyser);
    analyser.connect(audioCtx.destination);
  
    analyser.fftSize = 256;
  
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
  
    function draw() {
      requestAnimationFrame(draw);
  
      analyser.getByteFrequencyData(dataArray);
  
      let avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
  
      document.getElementById("vu-meter").style.width = avg + "%";
    }
  
    draw();
  }