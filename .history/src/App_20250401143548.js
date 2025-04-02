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
  const isUserHome = location.pathname === '/userhome';

  // Không cần useEffect kiểm tra employee nữa vì đã xử lý trong App.js

  if (!employee) {
    return null; // Hoặc loading spinner nếu muốn
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
  const navigate = useNavigate(); // Thêm useNavigate ở đây

  // Kiểm tra dữ liệu đăng nhập khi ứng dụng khởi động
  useEffect(() => {
    const storedEmployee = localStorage.getItem('employee');
    if (storedEmployee) {
      const parsedEmployee = JSON.parse(storedEmployee);
      setEmployee(parsedEmployee);
      console.log('Đã load employee từ localStorage:', parsedEmployee);
    }
  }, []);

  // Theo dõi sự thay đổi của employee và điều hướng
  useEffect(() => {
    if (employee) {
      console.log('Employee đã được cập nhật, điều hướng về /userhome');
      navigate('/userhome'); // Điều hướng đến /userhome khi employee có giá trị
    } else {
      console.log('Employee là null, điều hướng về /login');
      navigate('/login'); // Điều hướng về /login nếu employee là null
    }
  }, [employee, navigate]);

  // Debug trạng thái employee
  useEffect(() => {
    console.log('Trạng thái employee trong App.js:', employee);
  }, [employee]);

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={<LoginPage setEmployee={setEmployee} />}
        />
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
