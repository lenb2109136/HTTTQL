import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';
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
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HeaderEmp from './component/user/EmployeeHeader';
import SidebarEmp from './component/user/EmployeeSidebar';

// Component con để chứa các route có Sidebar và Header
function MainApp({ employee }) {
  const location = useLocation();
  const isUserHome = location.pathname === '/userhome';

  return (
    <div className="app">
      {isUserHome ? <SidebarEmp /> : <Sidebar />}
      <div className="main-content">
        {isUserHome ? <HeaderEmp employee={employee} /> : <Header />}
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="employees" element={<Employee />} />
          <Route path="salary-advance" element={<SalaryAdvance />} />
          <Route path="departments" element={<Department />} />
          <Route path="userhome" element={<UserHome />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  const [employee, setEmployee] = useState(null);

  // Kiểm tra dữ liệu đăng nhập khi ứng dụng khởi động
  useEffect(() => {
    const storedEmployee = localStorage.getItem('employee');
    if (storedEmployee) {
      setEmployee(JSON.parse(storedEmployee));
    }
  }, []);

  return (
    <Router>
      <Routes>
        {/* Route cho LoginPage, nằm ngoài MainApp để không bị ảnh hưởng bởi App.css */}
        <Route
          path="/login"
          element={<LoginPage setEmployee={setEmployee} />}
        />
        {/* Các route khác vẫn nằm trong MainApp */}
        <Route path="/*" element={<MainApp employee={employee} />} />
      </Routes>
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
    </Router>
  );
}

export default App;
