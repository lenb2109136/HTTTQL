// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Header from './component/admin/Header-Admin';
import Sidebar from './component/admin/SideBar';
import Dashboard from './component/admin/Dashboard';
import SalaryCalculationPage from "./component/admin/SalaryCalculationPage"
import Deductionspase from "./component/admin/DeductionsPage"
function App() {
  return (
    <Router>
      <div className="app">
        <Sidebar />
        <div className="main-content">
          <Header />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path='/salaryCalculation' element={<SalaryCalculationPage></SalaryCalculationPage>}></Route>
            <Route path='/deductions' element={<Deductionspase></Deductionspase>}></Route>
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
