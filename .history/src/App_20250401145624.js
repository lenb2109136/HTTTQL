import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
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

// Component chứa layout với Sidebar và Header
function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  // Kiểm tra nếu đã đăng nhập và đang ở trang /login, thì điều hướng về /userhome
  useEffect(() => {
    const employee = localStorage.getItem('employee');
    if (employee && location.pathname === '/login') {
      console.log('Đã đăng nhập, điều hướng về /userhome');
      navigate('/userhome', { replace: true });
    }
  }, [location.pathname, navigate]);

  const isUserHome = location.pathname === '/userhome';

  return (
    <div className="app">
      {isUserHome ? <SidebarEmp /> : <Sidebar />}
      <div className="main-content">
        {isUserHome ? <HeaderEmp /> : <Header />}
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/employees" element={<Employee />} />
          <Route path="/salary-advance" element={<SalaryAdvance />} />
          <Route path="/departments" element={<Department />} />
          <Route path="/userhome" element={<UserHome />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <MainLayout />
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
