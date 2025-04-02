import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
  useNavigate,
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
function MainApp({ employee, setEmployee }) {
  const location = useLocation();
  const navigate = useNavigate();
  const isUserHome = location.pathname === '/userhome';

  // Kiểm tra trạng thái đăng nhập và điều hướng về /login nếu chưa đăng nhập
  useEffect(() => {
    if (!employee && location.pathname !== '/login') {
      console.log('Chưa đăng nhập, điều hướng về /login');
      navigate('/login', { replace: true });
    }
  }, [employee, location.pathname, navigate]);

  // Nếu chưa đăng nhập, không render nội dung của MainApp
  if (!employee) {
    return null; // Hoặc có thể return một loading spinner nếu cần
  }

  return (
    <div className="app">
      {isUserHome ? <SidebarEmp setEmployee={setEmployee} /> : <Sidebar />}
      <div className="main-content">
        {isUserHome ? (
          <HeaderEmp employee={employee} setEmployee={setEmployee} />
        ) : (
          <Header />
        )}
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
      const parsedEmployee = JSON.parse(storedEmployee);
      setEmployee(parsedEmployee);
      console.log('Đã load employee từ localStorage:', parsedEmployee);
    }
  }, []);

  // Debug trạng thái employee
  useEffect(() => {
    console.log('Trạng thái employee trong App.js:', employee);
  }, [employee]);

  return (
    <Router>
      <Routes>
        {/* Route cho LoginPage, không cần bảo vệ */}
        <Route
          path="/login"
          element={<LoginPage setEmployee={setEmployee} />}
        />
        {/* Các route khác được bảo vệ trong MainApp */}
        <Route
          path="/*"
          element={<MainApp employee={employee} setEmployee={setEmployee} />}
        />
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
