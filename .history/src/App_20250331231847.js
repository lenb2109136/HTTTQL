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
import UserHome from './component/user/Index'; // UserHome vẫn được import nhưng không dùng HeaderEmp/SidebarEmp
import LoginPage from './component/Login';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Component con để chứa các route có Sidebar và Header (cho admin)
function MainApp() {
  const location = useLocation();
  const isUserHome = location.pathname === '/userhome';

  // Nếu là /userhome, không hiển thị Sidebar và Header của admin
  if (isUserHome) {
    return (
      <div className="app">
        <Routes>
          <Route path="/userhome" element={<UserHome />} />
        </Routes>
      </div>
    );
  }

  // Các route khác (admin) vẫn dùng Sidebar và Header
  return (
    <div className="app">
      <Sidebar />
      <div className="main-content">
        <Header />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="employees" element={<Employee />} />
          <Route path="salary-advance" element={<SalaryAdvance />} />
          <Route path="departments" element={<Department />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Route cho LoginPage, nằm ngoài MainApp */}
        <Route path="/login" element={<LoginPage />} />
        {/* Các route khác nằm trong MainApp */}
        <Route path="/*" element={<MainApp />} />
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
