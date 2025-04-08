import React from 'react';
import './admin-style/SideBar-Admin.css';
import { Link, useLocation, useNavigate } from 'react-router-dom'; // Added useNavigate
import {
  FiGrid,
  FiUsers,
  FiBriefcase,
  FiCalendar,
  FiDollarSign,
  FiSettings,
  FiLogOut,
  FiChevronRight,
} from 'react-icons/fi';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Initialize useNavigate

  // Function to handle logout
  const handleLogout = () => {
    // Clear sessionStorage
    sessionStorage.clear();
    // Clear localStorage
    localStorage.clear();
    // Redirect to /login
    navigate('/login');
  };

  return (
    <div className="sidebar">
      <div className="logo">
        <span className="logo-text">Samsung</span>
      </div>
      <ul>
        <li className={location.pathname === '/' ? 'active' : ''}>
          <Link to="/">
            <FiGrid className="menu-icon" />
            <span>Trang chủ</span>
            <FiChevronRight className="chevron-icon" />
          </Link>
        </li>
        <li className={location.pathname === '/employees' ? 'active' : ''}>
          <Link to="/employees">
            <FiUsers className="menu-icon" />
            <span>Nhân viên</span>
            <FiChevronRight className="chevron-icon" />
          </Link>
        </li>
        <li className={location.pathname === '/departments' ? 'active' : ''}>
          <Link to="/departments">
            <FiBriefcase className="menu-icon" />
            <span>Phòng ban</span>
            <FiChevronRight className="chevron-icon" />
          </Link>
        </li>
        <li className={location.pathname === '/salary-scale' ? 'active' : ''}>
          <Link to="/salary-scale">
            <FiCalendar className="menu-icon" />
            <span>Ngạch lương</span>
            <FiChevronRight className="chevron-icon" />
          </Link>
        </li>
        {/* <li className={location.pathname === '/pay-grade' ? 'active' : ''}>
          <Link to="/pay-grade">
            <FiDollarSign className="menu-icon" />
            <span>Bậc lương</span>
            <FiChevronRight className="chevron-icon" />
          </Link>
        </li> */}
        <li
          className={
            location.pathname === '/salary-calculation' ? 'active' : ''
          }
        >
          <Link to="/salary-calculation">
            <FiDollarSign className="menu-icon" />
            <span>Tính lương</span>
            <FiChevronRight className="chevron-icon" />
          </Link>
        </li>
        <li className={location.pathname === '/deductions' ? 'active' : ''}>
          <Link to="/deductions">
            <FiUsers className="menu-icon" />
            <span>Khấu trừ</span>
            <FiChevronRight className="chevron-icon" />
          </Link>
        </li>
        <li className={location.pathname === '/salary-advance' ? 'active' : ''}>
          <Link to="/salary-advance">
            <FiUsers className="menu-icon" />
            <span>Ứng lương</span>
            <FiChevronRight className="chevron-icon" />
          </Link>
        </li>
        <li className={location.pathname === '/report' ? 'active' : ''}>
          <Link to="/report">
            <FiSettings className="menu-icon" />
            <span>Khiếu nại</span>
            <FiChevronRight className="chevron-icon" />
          </Link>
        </li>
      </ul>
      <div className="logout-section">
        {/* Replace Link with a div or button to handle the logout logic */}
        <div
          className="logout-link"
          onClick={handleLogout}
          style={{ cursor: 'pointer' }}
        >
          <FiLogOut className="logout-icon" />
          <span>Đăng xuất</span>
          <FiChevronRight className="chevron-icon" />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
