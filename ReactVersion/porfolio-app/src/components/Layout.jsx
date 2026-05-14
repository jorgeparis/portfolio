// src/components/Layout.jsx

import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import ThemeToggle from "./ThemeToggle";

export default function Layout() {
  return (
    <>
      <Navbar />
      <ThemeToggle />

      <div className="shell">
        <Outlet />
      </div>
    </>
  );
}
