import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./components/kit/Dashboard";
import ActivateKit from "./pages/ActivateKit";
import AdminPanel from "./components/admin/AdminPanel";
import DownloadPDF from "./pages/DownloadPDF";
import "./App.css";

const App = () => {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/activate/:code" element={<ActivateKit />} />
            <Route path="/activate" element={<ActivateKit />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/download/:filename" element={<DownloadPDF />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
