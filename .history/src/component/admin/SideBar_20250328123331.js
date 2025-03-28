import React from 'react';
import './admin-style/SideBar-Admin.css';
import { Link, useLocation } from 'react-router-dom';
import {
  FiGrid,
  FiCalendar,
  FiDollarSign,
  FiBriefcase,
  FiUsers,
  FiSettings,
  FiLogOut, // Changed from FiArrowUpCircle to FiLogOut for "Đăng xuất"
} from 'react-icons/fi';

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="sidebar">
      <div className="logo">
        <img
          src="/https://th.bing.com/th/id/OIP.JJvfkO0l7yuXpqpcI9mUqQHaFj?w=288&h=216&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2"
          alt="Samsung Logo"
          className="logo-icon"
        />
      </div>
      <ul>
        <li className={location.pathname === '/' ? 'active' : ''}>
          <Link to="/">
            <FiGrid className="menu-icon" />
            <span>Thống kê</span>
          </Link>
        </li>
        <li className={location.pathname === '/calendar' ? 'active' : ''}>
          <Link to="/calendar">
            <FiCalendar className="menu-icon" />
            <span>Lịch làm việc</span>
          </Link>
        </li>
        <li
          className={
            location.pathname === '/payroll-management' ? 'active' : ''
          }
        >
          <Link to="/payroll-management">
            <FiDollarSign className="menu-icon" />
            <span>Doanh số sản phẩm</span>
          </Link>
        </li>
        <li className={location.pathname === '/companies' ? 'active' : ''}>
          <Link to="/companies">
            <FiBriefcase className="menu-icon" />
            <span>Cập nhật điểm danh</span>
          </Link>
        </li>
        <li className={location.pathname === '/contacts' ? 'active' : ''}>
          <Link to="/contacts">
            <FiUsers className="menu-icon" />
            <span>Đơn nghỉ phép</span>
            <span className="badge">2</span>
          </Link>
        </li>
        <li className={location.pathname === '/administration' ? 'active' : ''}>
          <Link to="/administration">
            <FiSettings className="menu-icon" />
            <span>Cài Đặt</span>
          </Link>
        </li>
      </ul>
      <div className="logout-section">
        <FiLogOut className="logout-icon" />
        <span>Đăng xuất</span>
      </div>
    </div>
  );
};

export default Sidebar;
