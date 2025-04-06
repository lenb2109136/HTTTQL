import React from 'react';
import { Nav } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  FiHome,
  FiDollarSign,
  FiChevronRight,
  FiAlertCircle,
  FiLogOut,
  FiBell,
} from 'react-icons/fi';
import './EmployeeSidebar.css'; // Import file CSS riêng

const EmployeeSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="sidebar">
      {/* Thêm logo Samsung ở đầu sidebar */}
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
        <li className={location.pathname === '/advance-salary' ? 'active' : ''}>
          <a href="#" onClick={() => navigate('/advance-salary')}>
            <FiDollarSign className="menu-icon" />
            <span className="menu-text">Ứng lương</span>
            <FiChevronRight className="chevron-icon" />
          </a>
        </li>
        <li className={location.pathname === '/complaints' ? 'active' : ''}>
          <a href="#" onClick={() => navigate('/complaints')}>
            <FiAlertCircle className="menu-icon" />
            <span className="menu-text">Khiếu nại</span>
            <FiChevronRight className="chevron-icon" />
          </a>
        </li>
      </ul>

      <div className="logout-section">
        <a href="#" onClick={() => navigate('/logout')} className="logout-link">
          <FiLogOut className="logout-icon" />
          <span className="logout-text">Đăng xuất</span>
          <FiChevronRight className="chevron-icon" />
        </a>
      </div>
    </div>
  );
};

export default EmployeeSidebar;
