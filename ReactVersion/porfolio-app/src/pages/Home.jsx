// src/pages/Home.jsx
import "../styles/Home.css";

export default function Home() {
  return (
    <>
      <div className="topbar">
        <div className="logo">
          <div className="logo-icon">⬡</div>

          <div>
            <div className="logo-text">
              Jorge<span>STREAM</span>
            </div>

            <div className="logo-sub">BROADCAST STUDIO</div>
          </div>
        </div>

        <div className="badge">v2.4.1 · BUILD 2026</div>
      </div>

      <div className="grid">
        {/* SERVER */}

        <div className="card server-card">
          <div className="card-header">
            <div className="card-title">Configuração do Servidor</div>

            <div className="badge">ICECAST / SHOUTCAST</div>
          </div>

          <div className="card-body">
            <div className="proto-tabs">
              <div className="tab active">IceCast 2</div>

              <div className="tab">ShoutCast v1</div>

              <div className="tab">ShoutCast v2</div>
            </div>

            <div className="field">
              <label>Hostname / IP</label>

              <input type="text" defaultValue="stream.example.com" />
            </div>

            <div className="row2">
              <div className="field">
                <label>Porta</label>

                <input type="number" defaultValue="8000" />
              </div>

              <div className="field">
                <label>Mount Point</label>

                <input type="text" defaultValue="/live" />
              </div>
            </div>

            <div className="field">
              <label>Username</label>

              <input type="text" defaultValue="source" />
            </div>

            <div className="field">
              <label>Password</label>

              <input type="password" defaultValue="hackme" />
            </div>

            <div className="sep"></div>

            <div className="field">
              <label>Nome da Estação</label>

              <input type="text" defaultValue="Radio Alpha FM" />
            </div>

            <div className="field">
              <label>Codec / Bitrate</label>
            </div>

            <div className="codec-strip">
              <div className="codec-chip active">MP3</div>

              <div className="codec-chip">AAC+</div>

              <div className="codec-chip">OPUS</div>

              <div className="codec-chip">128k</div>

              <div className="codec-chip">320k</div>
            </div>
          </div>
        </div>

        {/* AUDIO */}

        <div className="card audio-card">
          <div className="card-header">
            <div className="card-title">Interface de Áudio</div>

            <div className="badge">↻ SCAN</div>
          </div>

          <div className="card-body">
            <div className="device-list">
              <div className="device-item selected">
                <div className="device-icon">🎙</div>

                <div className="device-info">
                  <div className="device-name">Focusrite Scarlett 2i2</div>

                  <div className="device-desc">USB Audio Interface</div>
                </div>

                <div className="device-ch">2 CH</div>

                <div className="device-sel-dot"></div>
              </div>

              <div className="device-item">
                <div className="device-icon">🔊</div>

                <div className="device-info">
                  <div className="device-name">Realtek HD Audio</div>

                  <div className="device-desc">Windows Output</div>
                </div>

                <div className="device-ch">Stereo</div>

                <div className="device-sel-dot"></div>
              </div>
            </div>
          </div>
        </div>

        {/* METER */}

        <div className="card meter-card">
          <div className="card-header">
            <div className="card-title">Monitor de Transmissão</div>

            <div className="badge">00:00:00</div>
          </div>

          <div className="card-body">
            <div className="meter-inner">
              <div className="status-block">
                <div className="status-row">
                  <span className="status-key">Estado</span>

                  <div className="status-indicator">
                    <div className="dot live"></div>

                    <span>AO VIVO</span>
                  </div>
                </div>

                <div className="status-row">
                  <span className="status-key">Codec</span>

                  <span className="status-val">MP3 · 128k</span>
                </div>

                <div className="actions">
                  <button className="btn btn-primary live">● TRANSMITIR</button>
                </div>
              </div>

              <div>
                <div className="vu-wrap">
                  <div className="vu-label">
                    <span>VU METER</span>
                    <span>PEAK -3dB</span>
                  </div>

                  <div className="channels">
                    <div className="channel">
                      <div className="ch-tag">L</div>

                      <div className="bar-track">
                        <div
                          className="bar-fill"
                          style={{ width: "78%" }}
                        ></div>
                      </div>

                      <div className="db-val">-3dB</div>
                    </div>

                    <div className="channel">
                      <div className="ch-tag">R</div>

                      <div className="bar-track">
                        <div
                          className="bar-fill"
                          style={{ width: "71%" }}
                        ></div>
                      </div>

                      <div className="db-val">-5dB</div>
                    </div>
                  </div>
                </div>

                <div className="wave-wrap">
                  <div className="wave-label">FORMA DE ONDA</div>

                  <div className="wave-canvas-wrap">
                    <canvas id="waveform"></canvas>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
