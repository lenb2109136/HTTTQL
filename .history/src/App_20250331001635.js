import React from 'react';
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

function App() {
  const location = useLocation(); // Lấy đường dẫn hiện tại
  const noSidebarHeader = ['/login', '/userhome'].includes(location.pathname); // Kiểm tra nếu là /login hoặc /userhome

  return (
    <Router>
      <div className="app">
        {/* Chỉ hiển thị Sidebar và Header nếu không phải /login hoặc /userhome */}
        {!noSidebarHeader && <Sidebar />}
        <div className={noSidebarHeader ? '' : 'main-content'}>
          {!noSidebarHeader && <Header />}
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
