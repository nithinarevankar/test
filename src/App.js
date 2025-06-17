import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Editor from "./Editor";
import Usersite from "./usersite";
import Chat from "./chat";
import Showcase from "./showcase";

function App() {
  return (
    <Router>
      <Routes>
        {/* Home page */}
        <Route path="/" element={<Home />} />

        {/* GrapesJS Editor */}
        <Route path="/editor" element={<Editor />} />

        {/* User site, dynamic username from URL */}
        <Route path="/user/:username" element={<Usersite />} />

        {/* Chat page */}
        <Route path="/chat" element={<Chat />} />
        <Route path="/showcase" element={<Showcase />} />

      </Routes>
    </Router>
  );
}

export default App;