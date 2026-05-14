// src/components/ThemeToggle.jsx

export default function ThemeToggle() {
  const toggleTheme = () => {
    document.body.classList.toggle("light-theme");
  };

  return (
    <div
      className="badge"
      style={{
        cursor: "pointer",
        position: "fixed",
        right: "20px",
        top: "70px",
        zIndex: 9999
      }}
      onClick={toggleTheme}
    >
      🌓 THEME
    </div>
  );
}
