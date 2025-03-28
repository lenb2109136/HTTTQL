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
        <span>Samsung</span>
      </div>
      <ul>
        <li className={location.pathname === '/' ? 'active' : ''}>
          <Link to="/">
            <FiGrid className="menu-icon" />
            <span>Trang chủ</span>
          </Link>
        </li>
        <li className={location.pathname === '/calendar' ? 'active' : ''}>
          <Link to="/calendar">
            <FiCalendar className="menu-icon" />
            <span>Ngạch lương</span>
          </Link>
        </li>
        <li
          className={
            location.pathname === '/payroll-management' ? 'active' : ''
          }
        >
          <Link to="/payroll-management">
            <FiDollarSign className="menu-icon" />
            <span>Bậc lương</span>
          </Link>
        </li>
        <li className={location.pathname === '/companies' ? 'active' : ''}>
          <Link to="/companies">
            <FiBriefcase className="menu-icon" />
            <span>Tính lương</span>
          </Link>
        </li>
        <li className={location.pathname === '/contacts' ? 'active' : ''}>
          <Link to="/contacts">
            <FiUsers className="menu-icon" />
            <span>Khấu trừ</span>
            <span className="badge">2</span>
          </Link>
        </li>
        <li className={location.pathname === '/contacts' ? 'active' : ''}>
          <Link to="/contacts">
            <FiUsers className="menu-icon" />
            <span>Ứng lương</span>
            <span className="badge">2</span>
          </Link>
        </li>
        <li className={location.pathname === '/administration' ? 'active' : ''}>
          <Link to="/administration">
            <FiSettings className="menu-icon" />
            <span>Cài Đặt</span>
          </Link>
        </li>
        <li className={location.pathname === '/administration' ? 'active' : ''}>
          <Link to="/administration">
            <FiSettings className="menu-icon" />
            <span>phòng ban</span>
          </Link>
        </li>
        <li className={location.pathname === '/administration' ? 'active' : ''}>
          <Link to="/administration">
            <FiSettings className="menu-icon" />
            <span>Nhân viên</span>
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
