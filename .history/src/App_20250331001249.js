// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Header from './component/admin/Header-Admin';
import Sidebar from './component/admin/SideBar';
import Dashboard from './component/admin/Dashboard';
import Employee from './component/admin/EmployeesPage';
import SalaryAdvance from './component/admin/SalaryAdvancePage';
import Department from './component/admin/DepartmentsPage';
import UserHome from './component/user/Index';
import LoginPage from './component/Login';

import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Sidebar />
        <div className="main-content">
          <Header />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="employees" element={<Employee />} />
            <Route path="salary-advance" element={<SalaryAdvance />} />
            <Route path="departments" element={<Department />} />
            <Route path="userhome" element={<UserHome />} />
          </Routes>
        </div>
        <ToastContainer
          position="top-right"
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </Router>
  );
}

export default App;
