import React from "react";
import { KitProvider } from './context/KitContext';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./components/kit/Dashboard";
import UserDashboard from "./pages/UserDashboard"; // ✅ NUEVO DASHBOARD PROFESIONAL
import ActivateKit from "./pages/ActivateKit";
import ActivarKit from "./pages/ActivarKit"; // <- NUEVA LÍNEA para nuestro componente Kit2
import AdminPanel from "./components/admin/AdminPanel";
import DownloadPDF from "./pages/DownloadPDF";
import KitHeresy from "./components/kit-heresy/KitHeresy"; // ✅ Sistema Kit2 informativo (educación familiar)
import ObjetivoKit2Page from "./pages/ObjetivoKit2Page"; // ✅ NUEVA: Página Objetivo Kit2
import "./App.css";

const App = () => {
  return (
    <KitProvider>
      <Router>
        <div className="App">
          <Navbar />
          <div className="container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Dashboard existente (mantenemos compatibilidad) */}
              <Route path="/dashboard" element={<Dashboard />} />
              
              {/* ✅ NUEVO DASHBOARD PROFESIONAL */}
              <Route path="/mi-cuenta" element={<UserDashboard />} />
              <Route path="/perfil" element={<UserDashboard />} />
              
              {/* Rutas existentes de activación */}
              <Route path="/activate/:code" element={<ActivateKit />} />
              <Route path="/activate" element={<ActivateKit />} />
              
              {/* NUEVA RUTA para el sistema Kit2 */}
              <Route path="/activar" element={<ActivarKit />} />
              
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/download/:filename" element={<DownloadPDF />} />
              
              {/* ✅ RUTAS OBJETIVO KIT2 */}
              <Route path="/kit2" element={<KitHeresy />} />           {/* Educación familiar */}
              <Route path="/sistema-kit2" element={<KitHeresy />} />   {/* Educación familiar */}
              <Route path="/objetivo-kit2" element={<ObjetivoKit2Page />} /> {/* ✅ NUEVA PÁGINA */}
              
              {/* ✅ RUTAS ADICIONALES PARA OBJETIVO KIT2 */}
              <Route path="/kit2-pdf" element={<ObjetivoKit2Page />} />   {/* Alternativa */}
              <Route path="/guia-pdf" element={<ObjetivoKit2Page />} />   {/* Alternativa */}
            </Routes>
          </div>
        </div>
      </Router>
    </KitProvider>
  );
};

export default App;
