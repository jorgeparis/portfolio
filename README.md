# StreamForge

Modern Web-Based IceCast / ShoutCast Streaming Studio

## Overview

StreamForge is a modern browser-based audio streaming client designed for broadcasting live audio to IceCast and ShoutCast servers.

The project combines:

* Modern Broadcast UI
* Real-time audio monitoring
* Hardware audio device detection
* WebSocket audio transport
* Backend audio encoding
* IceCast / ShoutCast integration

The frontend is built as a real-time web studio interface while the backend handles audio encoding and streaming to the server.

---

# Features

## Frontend Features

* Real audio hardware detection
* Live VU meters
* Real waveform monitor
* IceCast / ShoutCast configuration
* Username and password authentication
* Mountpoint configuration
* Codec selection:

  * MP3
  * AAC+
  * OPUS
  * OGG
* Bitrate selection
* Real-time connection state
* Broadcast timer
* Professional broadcast console UI

---

## Backend Features

* Receives audio from browser
* FFmpeg audio encoding
* Streams encoded audio to IceCast
* WebSocket audio transport
* Dynamic codec selection
* Dynamic bitrate selection
* Real streaming pipeline

---

# Architecture

```text
Browser Frontend
    ↓
WebSocket Audio Transport
    ↓
Node.js Backend
    ↓
FFmpeg Encoder
    ↓
IceCast / ShoutCast Server
```

---

# Technology Stack

## Frontend

* HTML5
* CSS3
* JavaScript
* WebAudio API
* Canvas API
* WebSocket API

## Backend

* Node.js
* Express
* ws (WebSocket)
* FFmpeg

---

# Project Structure

```text
streamforge/
│
├── frontend/
│   ├── index.html
│   ├── frontend-stream.js
│   ├── styles.css
│   └── assets/
│
├── backend/
│   ├── server.js
│   ├── package.json
│   └── ffmpeg/
│
└── README.md
```

---

# Installation

## Requirements

* Node.js 18+
* FFmpeg installed
* IceCast or ShoutCast server
* Modern Chromium browser

---

# Backend Setup

## Install dependencies

```bash
npm install express ws axios
```

---

## Install FFmpeg

### Windows

Download FFmpeg:

[https://ffmpeg.org/download.html](https://ffmpeg.org/download.html)

Add FFmpeg to PATH.

---

## Start backend

```bash
node server.js
```

Backend runs on:

```text
http://localhost:3000
```

WebSocket audio server:

```text
ws://localhost:3001/audio
```

---

# Frontend Setup

Open:

```text
index.html
```

Or use a local web server:

```bash
npx serve
```

---

# Streaming Workflow

## 1. Select audio device

The frontend scans all available audio hardware using the WebAudio API.

## 2. Configure streaming server

Enter:

* Host
* Port
* Username
* Password
* Mountpoint

## 3. Select codec

Supported codecs:

* MP3
* AAC+
* OPUS
* OGG

## 4. Select bitrate

Examples:

* 64k
* 128k
* 192k
* 320k

## 5. Click CONNECT

Frontend sends configuration to backend.

Backend starts FFmpeg.

Browser streams raw PCM audio through WebSocket.

FFmpeg encodes audio and pushes stream to IceCast.

---

# Frontend → Backend Communication

## Start stream

### Endpoint

```http
POST /start-stream
```

### Example payload

```json
{
  "host": "stream.example.com",
  "port": "8000",
  "username": "source",
  "password": "hackme",
  "mount": "/live",
  "codec": "MP3",
  "bitrate": "128k"
}
```

---

# Audio Transport

Audio is streamed from browser to backend using:

```text
WebSocket
```

Raw PCM audio is captured using:

```text
WebAudio API
```

The backend encodes audio using:

```text
FFmpeg
```

---

# Example FFmpeg Pipeline

```bash
ffmpeg \
-f s16le \
-ar 44100 \
-ac 1 \
-i pipe:0 \
-c:a libmp3lame \
-b:a 128k \
-f mp3 \
icecast://source:hackme@localhost:8000/live
```

---

# Current Limitations

## Browser Limitations

Browsers cannot directly stream encoded audio to IceCast because:

* CORS restrictions
* No native MP3/AAC encoder access
* No raw socket access

This is why a backend bridge is required.

---

# Future Roadmap

## Planned Features

* Multi-server broadcasting
* Auto reconnect
* DSP processing
* Audio compressor
* Limiter
* Metadata updates
* Recording support
* Playlist automation
* Stereo streaming
* OBS-style dockable panels
* Electron desktop version
* Embedded Linux version

---

# Security Recommendations

* Never expose IceCast passwords publicly
* Use HTTPS + WSS in production
* Validate backend requests
* Add authentication layer
* Store credentials securely

---

# Recommended Production Stack

## Frontend

* React
* TailwindCSS
* WebAudio API

## Backend

* Node.js
* FFmpeg
* Redis
* Nginx

## Streaming

* IceCast 2
* Liquidsoap

---

# License

MIT License

---

# Author

Jorge Paris

Broadcast Streaming Studio Project
