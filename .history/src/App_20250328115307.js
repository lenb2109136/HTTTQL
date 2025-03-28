// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import PayrollManagement from './pages/PayrollManagement';
import Calendar from './pages/Calendar';
import Companies from './pages/Companies';
import Contacts from './pages/Contacts';
import Administration from './pages/Administration';

function App() {
  return (
    <Router>
      <div className="app">
        <Sidebar />
        <div className="main-content">
          <Header />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/payroll-management" element={<PayrollManagement />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/companies" element={<Companies />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/administration" element={<Administration />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
