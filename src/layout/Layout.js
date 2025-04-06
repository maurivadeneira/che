import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header.js';
import Footer from '../components/Footer.js';
import Sidebar from '../components/Sidebar.js';

const Layout = () => {
  return (
    <div className="app-container">
      <Header />
      <div className="main-content">
        <Sidebar />
        <main className="content">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
