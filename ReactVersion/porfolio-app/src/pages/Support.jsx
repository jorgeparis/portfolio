// src/pages/Support.jsx

export default function Support() {
  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">Technical Support</div>
      </div>

      <div className="card-body">
        <div className="field">
          <label>Name</label>

          <input type="text" />
        </div>

        <div className="field">
          <label>Email</label>

          <input type="email" />
        </div>

        <div className="field">
          <label>Issue</label>

          <textarea
            style={{
              width: "100%",
              minHeight: "150px",
              background: "var(--surface)",
              border: "1px solid var(--border2)",
              color: "var(--text)",
              padding: "10px"
            }}
          ></textarea>
        </div>

        <button className="btn btn-primary">SEND TICKET</button>
      </div>
    </div>
  );
}
