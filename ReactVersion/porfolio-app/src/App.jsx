// src/App.jsx

import { Route, Routes } from "react-router-dom";

import Layout from "./components/Layout";

import Blog from "./pages/Blog";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Support from "./pages/Support";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/support" element={<Support />} />
      </Route>
    </Routes>
  );
}
