// ─────────────────────────────────────────────
// APP STATE
// ─────────────────────────────────────────────

const App = {
  connected: false,
  stream: null,
  audioCtx: null,
  analyser: null,
  source: null,
  dataArray: null,
  animationFrame: null,
  timerInterval: null,
  startTime: null,
  selectedDeviceId: null,
  devices: []
};

// ─────────────────────────────────────────────
// DOM CACHE
// ─────────────────────────────────────────────

const UI = {
  canvas: null,
  ctx: null,

  connDot: null,
  connText: null,

  connectBtn: null,
  btnIcon: null,
  btnLabel: null,

  vuL: null,
  vuR: null,

  dbL: null,
  dbR: null,

  codecStat: null,
  hostStat: null,
  timer: null,
  deviceList: null
};

// ─────────────────────────────────────────────
// INIT
// ─────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", init);

async function init() {
  cacheDOM();
  restoreTheme();

  resizeCanvas();
  updateCodecDisplay();

  await scanAudioDevices();

  window.addEventListener("resize", resizeCanvas);
}

// ─────────────────────────────────────────────
// DOM CACHE
// ─────────────────────────────────────────────

function cacheDOM() {
  UI.canvas = document.getElementById("waveform");
  UI.ctx = UI.canvas.getContext("2d");

  UI.connDot = document.getElementById("conn-dot");
  UI.connText = document.getElementById("conn-text");

  UI.connectBtn = document.getElementById("connect-btn");
  UI.btnIcon = document.getElementById("btn-icon");
  UI.btnLabel = document.getElementById("btn-label");

  UI.vuL = document.getElementById("vu-l");
  UI.vuR = document.getElementById("vu-r");

  UI.dbL = document.getElementById("db-l");
  UI.dbR = document.getElementById("db-r");

  UI.codecStat = document.getElementById("stat-codec");
  UI.hostStat = document.getElementById("stat-host");

  UI.timer = document.getElementById("live-timer");

  UI.deviceList = document.getElementById("device-list");
}

// ─────────────────────────────────────────────
// SERVER CONFIG
// ─────────────────────────────────────────────

function getServerConfig() {
  return {
    host: document.querySelector('[placeholder="stream.servidor.com"]').value,
    port: document.querySelector('input[type="number"]').value,
    username: document.getElementById("input-username").value,
    password: document.getElementById("input-password").value,
    mount: document.querySelector('[placeholder="/live"]').value
  };
}

function updateServerDisplay() {
  const cfg = getServerConfig();
  UI.hostStat.textContent = `${cfg.host}:${cfg.port}`;
}

// ─────────────────────────────────────────────
// CODEC
// ─────────────────────────────────────────────

function getCodecConfig() {
  return {
    codec: document.querySelector('.codec-chip[data-type="codec"].active')
      ?.textContent,

    bitrate: document.querySelector('.codec-chip[data-type="bitrate"].active')
      ?.textContent
  };
}

function updateCodecDisplay() {
  const { codec, bitrate } = getCodecConfig();

  UI.codecStat.textContent = `${codec || "—"} · ${bitrate || "—"}`;
}

// ─────────────────────────────────────────────
// CONNECTION UI
// ─────────────────────────────────────────────

function setConnectionState(state) {
  const states = {
    idle: {
      dot: "dot idle",
      text: "DESLIGADO",
      icon: "▶",
      label: "CONECTAR",
      live: false
    },

    connecting: {
      dot: "dot warn",
      text: "CONECTANDO…",
      icon: "⌛",
      label: "CONECTANDO",
      live: false
    },

    live: {
      dot: "dot live",
      text: "AO VIVO",
      icon: "■",
      label: "AO VIVO",
      live: true
    }
  };

  const s = states[state];

  UI.connDot.className = s.dot;
  UI.connText.textContent = s.text;

  UI.btnIcon.textContent = s.icon;
  UI.btnLabel.textContent = s.label;

  UI.connectBtn.classList.toggle("live", s.live);
}

// ─────────────────────────────────────────────
// AUDIO DEVICES
// ─────────────────────────────────────────────

async function scanAudioDevices() {
  try {
    await navigator.mediaDevices.getUserMedia({ audio: true });

    const all = await navigator.mediaDevices.enumerateDevices();

    App.devices = all
      .filter((d) => d.kind === "audioinput")
      .map((d, i) => ({
        id: d.deviceId,
        name: d.label || `Audio Input ${i + 1}`
      }));

    if (!App.selectedDeviceId && App.devices.length) {
      App.selectedDeviceId = App.devices[0].id;
    }

    renderDevices();
  } catch (err) {
    console.error(err);

    UI.deviceList.innerHTML = `<div class="device-error">
        Permissão de microfone negada
      </div>`;
  }
}

function renderDevices() {
  UI.deviceList.innerHTML = App.devices
    .map(
      (d) => `
    <div class="device-item
      ${d.id === App.selectedDeviceId ? "selected" : ""}"
      onclick="selectDevice('${d.id}')">

      <div class="device-icon">🎙</div>

      <div class="device-info">
        <div class="device-name">${d.name}</div>
      </div>
    </div>
  `
    )
    .join("");
}

async function selectDevice(id) {
  App.selectedDeviceId = id;

  renderDevices();

  await startAudio();
}

// ─────────────────────────────────────────────
// AUDIO ENGINE
// ─────────────────────────────────────────────

async function startAudio() {
  stopAudio();

  try {
    App.stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        deviceId: {
          exact: App.selectedDeviceId
        }
      }
    });

    App.audioCtx = new AudioContext();

    App.source = App.audioCtx.createMediaStreamSource(App.stream);

    App.analyser = App.audioCtx.createAnalyser();

    App.analyser.fftSize = 2048;

    App.dataArray = new Float32Array(App.analyser.fftSize);

    App.source.connect(App.analyser);

    startMeters();
  } catch (err) {
    console.error("Audio Engine:", err);
  }
}

function stopAudio() {
  if (App.stream) {
    App.stream.getTracks().forEach((t) => t.stop());
  }

  if (App.audioCtx) {
    App.audioCtx.close();
  }

  cancelAnimationFrame(App.animationFrame);
}

// ─────────────────────────────────────────────
// CONNECTION FLOW
// ─────────────────────────────────────────────

async function toggleConnect() {
  App.connected ? disconnect() : connect();
}

async function connect() {
  const cfg = getServerConfig();

  if (!cfg.username || !cfg.password) {
    alert("Username e Password são obrigatórios");
    return;
  }

  setConnectionState("connecting");

  try {
    const ok = await testConnection();

    if (!ok) {
      setConnectionState("idle");
      alert("Servidor indisponível");
      return;
    }

    App.connected = true;

    setConnectionState("live");

    startTimer();
  } catch (err) {
    console.error(err);

    setConnectionState("idle");
  }
}

function disconnect() {
  App.connected = false;

  stopAudio();

  clearInterval(App.timerInterval);

  UI.vuL.style.width = "0%";
  UI.vuR.style.width = "0%";

  setConnectionState("idle");
}

// ─────────────────────────────────────────────
// SERVER TEST
// ─────────────────────────────────────────────

async function testConnection() {
  try {
    const cfg = getServerConfig();

    const res = await fetch(`http://${cfg.host}:${cfg.port}/status-json.xsl`);

    return res.ok;
  } catch {
    return false;
  }
}

// ─────────────────────────────────────────────
// TIMER
// ─────────────────────────────────────────────

function startTimer() {
  App.startTime = Date.now();

  App.timerInterval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - App.startTime) / 1000);

    const h = String(Math.floor(elapsed / 3600)).padStart(2, "0");

    const m = String(Math.floor((elapsed % 3600) / 60)).padStart(2, "0");

    const s = String(elapsed % 60).padStart(2, "0");

    UI.timer.textContent = `${h}:${m}:${s}`;
  }, 1000);
}

// ─────────────────────────────────────────────
// METERS
// ─────────────────────────────────────────────

function startMeters() {
  function draw() {
    if (!App.analyser) return;

    App.analyser.getFloatTimeDomainData(App.dataArray);

    let sum = 0;

    for (const sample of App.dataArray) {
      sum += sample * sample;
    }

    const rms = Math.sqrt(sum / App.dataArray.length);

    let db = rms > 0 ? 20 * Math.log10(rms) : -100;

    db = Math.max(db, -60);

    const level = (db + 60) / 60;

    UI.vuL.style.width = `${level * 100}%`;
    UI.vuR.style.width = `${level * 100}%`;

    UI.dbL.textContent = `${db.toFixed(1)} dB`;
    UI.dbR.textContent = `${db.toFixed(1)} dB`;

    drawWaveform();

    App.animationFrame = requestAnimationFrame(draw);
  }

  draw();
}

// ─────────────────────────────────────────────
// WAVEFORM
// ─────────────────────────────────────────────

function resizeCanvas() {
  const wrap = UI.canvas.parentElement;

  UI.canvas.width = wrap.clientWidth * devicePixelRatio;
  UI.canvas.height = 72 * devicePixelRatio;

  UI.canvas.style.width = wrap.clientWidth + "px";
  UI.canvas.style.height = "72px";
}

function drawWaveform() {
  const { canvas, ctx } = UI;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const mid = canvas.height / 2;

  ctx.beginPath();

  ctx.strokeStyle = "#00ff88";
  ctx.lineWidth = 1;

  for (let i = 0; i < App.dataArray.length; i++) {
    const x = (i / App.dataArray.length) * canvas.width;

    const y = mid + App.dataArray[i] * mid;

    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }

  ctx.stroke();
}

// ─────────────────────────────────────────────
// UI HELPERS
// ─────────────────────────────────────────────

function selectChip(el) {
  const type = el.dataset.type;

  document
    .querySelectorAll(`.codec-chip[data-type="${type}"]`)
    .forEach((c) => c.classList.remove("active"));

  el.classList.add("active");

  updateCodecDisplay();
}

function refreshDevices() {
  scanAudioDevices();
}

function toggleTheme() {
  const light = document.body.classList.toggle("light-theme");

  localStorage.setItem("theme", light ? "light" : "dark");
}

function restoreTheme() {
  if (localStorage.getItem("theme") === "light") {
    document.body.classList.add("light-theme");
  }
}
