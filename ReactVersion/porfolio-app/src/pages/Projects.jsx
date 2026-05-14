// src/pages/Projects.j

export default function Projects() {
  return (
    <>
      <div className="projects-header">
        <h1>Broadcast Projects</h1>

        <p>Streaming, FM, TV and Telecom installations</p>
      </div>

      <div className="gallery">
        <div className="project-card">
          <img src="https://picsum.photos/600/400?1" alt="" />

          <div className="overlay">
            <h3>FM Studio</h3>
            <p>Mozambique</p>
          </div>
        </div>

        <div className="project-card">
          <img src="https://picsum.photos/600/400?2" alt="" />

          <div className="overlay">
            <h3>TV Control Room</h3>
            <p>South Africa</p>
          </div>
        </div>
      </div>
    </>
  );
}
