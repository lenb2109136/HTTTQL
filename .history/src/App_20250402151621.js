import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Header from './component/admin/Header-Admin';
import Sidebar from './component/admin/SideBar';
import Dashboard from './component/admin/Dashboard';
import Employee from './component/admin/EmployeesPage';
import SalaryAdvance from './component/admin/SalaryAdvancePage';
import Reports from './component/admin/ReportsPage';
import Department from './component/admin/DepartmentsPage';
import UserHome from './component/user/Index';
import EmployeeSalaryAdvance from './component/user/EmployeeSalaryAdvance';
import LoginPage from './component/Login';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HeaderEmp from './component/user/EmployeeHeader';
import SidebarEmp from './component/user/EmployeeSidebar';
import EmpReports from './component/user/EmployeeReport';

// Component chứa layout với Sidebar và Header
function MainLayout() {
  // Cả /userhome và /emp-salary-advance đều sử dụng layout của nhân viên
  const isEmployeePage =
    window.location.pathname === '/userhome' ||
    window.location.pathname === '/emp-salary-advance' ||
    window.location.pathname === '/complaints';

  return (
    <div className="app">
      {isEmployeePage ? <SidebarEmp /> : <Sidebar />}
      <div className="main-content">
        {isEmployeePage ? <HeaderEmp /> : <Header />}
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/employees" element={<Employee />} />
          <Route path="/salary-advance" element={<SalaryAdvance />} />
          <Route path="/departments" element={<Department />} />
          <Route path="/report" element={<Reports />} />

          <Route path="/userhome" element={<UserHome />} />
          <Route path="/complaints" element={<EmpReports />} />
          <Route
            path="/emp-salary-advance"
            element={<EmployeeSalaryAdvance />}
          />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Trang login độc lập, không có header hay sidebar */}
        <Route path="/login" element={<LoginPage />} />
        {/* Các trang khác sử dụng layout có header và sidebar */}
        <Route path="/*" element={<MainLayout />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Router>
  );
}

export default App;
