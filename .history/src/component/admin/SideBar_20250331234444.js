import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FiGrid,
  FiUsers,
  FiBriefcase,
  FiCalendar,
  FiDollarSign,
  FiSettings,
  FiLogOut,
  FiChevronRight,
  FiBell,
} from 'react-icons/fi';

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="sidebar">
      <div className="logo">
        <span className="logo-text">Samsung</span>
      </div>
      <ul className="sidebar-menu">
        <li className={location.pathname === '/' ? 'active' : ''}>
          <Link to="/" className="sidebar-item">
            <FiGrid className="menu-icon" />
            <span className="menu-text">Trang chủ</span>
            <FiChevronRight className="chevron-icon" />
          </Link>
        </li>
        <li className={location.pathname === '/employees' ? 'active' : ''}>
          <Link to="/employees" className="sidebar-item">
            <FiUsers className="menu-icon" />
            <span className="menu-text">Nhân viên</span>
            <FiChevronRight className="chevron-icon" />
          </Link>
        </li>
        <li className={location.pathname === '/departments' ? 'active' : ''}>
          <Link to="/departments" className="sidebar-item">
            <FiBriefcase className="menu-icon" />
            <span className="menu-text">Phòng ban</span>
            <FiChevronRight className="chevron-icon" />
          </Link>
        </li>
        <li className={location.pathname === '/salary-scale' ? 'active' : ''}>
          <Link to="/salary-scale" className="sidebar-item">
            <FiCalendar className="menu-icon" />
            <span className="menu-text">Ngạch lương</span>
            <FiChevronRight className="chevron-icon" />
          </Link>
        </li>
        <li className={location.pathname === '/pay-grade' ? 'active' : ''}>
          <Link to="/pay-grade" className="sidebar-item">
            <FiDollarSign className="menu-icon" />
            <span className="menu-text">Bậc lương</span>
            <FiChevronRight className="chevron-icon" />
          </Link>
        </li>
        <li
          className={
            location.pathname === '/salary-calculation' ? 'active' : ''
          }
        >
          <Link to="/salary-calculation" className="sidebar-item">
            <FiDollarSign className="menu-icon" />
            <span className="menu-text">Tính lương</span>
            <FiChevronRight className="chevron-icon" />
          </Link>
        </li>
        <li className={location.pathname === '/deductions' ? 'active' : ''}>
          <Link to="/deductions" className="sidebar-item">
            <FiUsers className="menu-icon" />
            <span className="menu-text">Khấu trừ</span>
            <FiChevronRight className="chevron-icon" />
          </Link>
        </li>
        <li className={location.pathname === '/salary-advance' ? 'active' : ''}>
          <Link to="/salary-advance" className="sidebar-item">
            <FiDollarSign className="menu-icon" />
            <span className="menu-text">Ứng lương</span>
            <FiChevronRight className="chevron-icon" />
          </Link>
        </li>
        <li className={location.pathname === '/settings' ? 'active' : ''}>
          <Link to="/settings" className="sidebar-item">
            <FiSettings className="menu-icon" />
            <span className="menu-text">Cài đặt</span>
            <FiChevronRight className="chevron-icon" />
          </Link>
        </li>
        <li className={location.pathname === '/notifications' ? 'active' : ''}>
          <Link to="/notifications" className="sidebar-item">
            <FiBell className="menu-icon" />
            <span className="menu-text">Thông báo</span>
            <FiChevronRight className="chevron-icon" />
            <span className="badge">5</span> {/* Ví dụ badge thông báo */}
          </Link>
        </li>
      </ul>
      <div className="logout-section">
        <Link to="/logout" className="sidebar-item logout-link">
          <FiLogOut className="menu-icon" />
          <span className="menu-text">Đăng xuất</span>
          <FiChevronRight className="chevron-icon" />
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
