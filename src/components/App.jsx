import React from "react";
import { KitProvider } from '../context/KitContext';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./layout/Navbar";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "./kit/Dashboard";
import ActivateKit from "../pages/ActivateKit";
import AdminPanel from "./admin/AdminPanel";
import DownloadPDF from "../pages/DownloadPDF";
import PaymentPreferencesForm from "./PaymentPreferencesForm"; // Nueva importación
import Kit2Activation from "./Kit2Activation"; // Nueva importación

const App = () => {
  return (
    <KitProvider>
      <Router>
        <div className="App">
          <Navbar />
          <div className="container">
            <Routes>
              {/* Rutas existentes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/activate/:code" element={<ActivateKit />} />
              <Route path="/activate" element={<ActivateKit />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/download/:filename" element={<DownloadPDF />} />
              
              {/* Nuevas rutas para el sistema multimoneda */}
              <Route path="/payment-preferences" element={<PaymentPreferencesForm />} />
              <Route path="/activate-kit/:invitationId" element={<Kit2Activation />} />
              {/* Ruta de prueba para acceder directamente al componente sin ID */}
              <Route path="/activate-kit" element={<Kit2Activation />} />
            </Routes>
          </div>
        </div>
      </Router>
    </KitProvider>
  );
};

export default App;