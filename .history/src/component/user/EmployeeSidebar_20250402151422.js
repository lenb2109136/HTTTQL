import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  FiHome,
  FiDollarSign,
  FiAlertCircle,
  FiChevronRight,
  FiLogOut,
} from 'react-icons/fi';
import './EmployeeSidebar.css';

const EmployeeSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate('/login', { replace: true });
  };

  return (
    <div className="sidebar">
      <div className="logo">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Samsung_Logo.svg/1280px-Samsung_Logo.svg.png"
          alt="Samsung Logo"
          className="logo-icon"
        />
        <span className="logo-text">Samsung</span>
      </div>

      <ul className="sidebar-menu">
        <li className={location.pathname === '/userhome' ? 'active' : ''}>
          <a href="#" onClick={() => navigate('/userhome')}>
            <FiHome className="menu-icon" />
            <span className="menu-text">Trang chủ</span>
            <FiChevronRight className="chevron-icon" />
          </a>
        </li>
        <li
          className={
            location.pathname === '/emp-salary-advance' ? 'active' : ''
          }
        >
          <a href="#" onClick={() => navigate('/emp-salary-advance')}>
            <FiDollarSign className="menu-icon" />
            <span className="menu-text">Ứng lương</span>
            <FiChevronRight className="chevron-icon" />
          </a>
        </li>
        <li className={location.pathname === '/emp-reports' ? 'active' : ''}>
          <a href="#" onClick={() => navigate('/emp-reports')}>
            <FiAlertCircle className="menu-icon" />
            <span className="menu-text">Khiếu nại</span>
            <FiChevronRight className="chevron-icon" />
          </a>
        </li>
      </ul>

      <div className="logout-section">
        <a href="#" onClick={handleLogout} className="logout-link">
          <FiLogOut className="logout-icon" />
          <span className="logout-text">Đăng xuất</span>
          <FiChevronRight className="chevron-icon" />
        </a>
      </div>
    </div>
  );
};

export default EmployeeSidebar;
