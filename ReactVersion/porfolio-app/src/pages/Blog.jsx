// src/pages/Blog.jsx

export default function Blog() {
  return (
    <>
      <div className="blog-header">
        <h1>Broadcast Blog</h1>

        <p>Radio engineering and streaming technology</p>
      </div>

      <div className="radio-grid">
        <div className="radio-card">
          <div className="radio-header">
            <div>
              <h3>IceCast vs ShoutCast</h3>
              <span>Streaming</span>
            </div>

            <button className="play-btn">▶</button>
          </div>
        </div>

        <div className="radio-card">
          <div className="radio-header">
            <div>
              <h3>Broadcast Audio Chains</h3>
              <span>Audio Processing</span>
            </div>

            <button className="play-btn">▶</button>
          </div>
        </div>
      </div>
    </>
  );
}
