import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HiOutlineHome, // Icon nhà đẹp hơn
  HiOutlineUsers, // Icon người dùng
  HiOutlineOfficeBuilding, // Icon tòa nhà (phòng ban)
  HiOutlineCalendar, // Icon lịch
  HiOutlineCurrencyDollar, // Icon tiền tệ
  HiOutlineCog, // Icon cài đặt
  HiOutlineLogout, // Icon đăng xuất
  HiOutlineChevronRight, // Dấu >
} from '@heroicons/react/outline'; // Sử dụng Heroicons để icon phong phú hơn
import { FiBell } from 'react-icons/fi'; // Giữ FiBell cho thông báo

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
            <HiOutlineHome className="menu-icon" />
            <span className="menu-text">Trang chủ</span>
            <HiOutlineChevronRight className="chevron-icon" />
          </Link>
        </li>
        <li className={location.pathname === '/employees' ? 'active' : ''}>
          <Link to="/employees" className="sidebar-item">
            <HiOutlineUsers className="menu-icon" />
            <span className="menu-text">Nhân viên</span>
            <HiOutlineChevronRight className="chevron-icon" />
          </Link>
        </li>
        <li className={location.pathname === '/departments' ? 'active' : ''}>
          <Link to="/departments" className="sidebar-item">
            <HiOutlineOfficeBuilding className="menu-icon" />
            <span className="menu-text">Phòng ban</span>
            <HiOutlineChevronRight className="chevron-icon" />
          </Link>
        </li>
        <li className={location.pathname === '/salary-scale' ? 'active' : ''}>
          <Link to="/salary-scale" className="sidebar-item">
            <HiOutlineCalendar className="menu-icon" />
            <span className="menu-text">Ngạch lương</span>
            <HiOutlineChevronRight className="chevron-icon" />
          </Link>
        </li>
        <li className={location.pathname === '/pay-grade' ? 'active' : ''}>
          <Link to="/pay-grade" className="sidebar-item">
            <HiOutlineCurrencyDollar className="menu-icon" />
            <span className="menu-text">Bậc lương</span>
            <HiOutlineChevronRight className="chevron-icon" />
          </Link>
        </li>
        <li
          className={
            location.pathname === '/salary-calculation' ? 'active' : ''
          }
        >
          <Link to="/salary-calculation" className="sidebar-item">
            <HiOutlineCurrencyDollar className="menu-icon" />
            <span className="menu-text">Tính lương</span>
            <HiOutlineChevronRight className="chevron-icon" />
          </Link>
        </li>
        <li className={location.pathname === '/deductions' ? 'active' : ''}>
          <Link to="/deductions" className="sidebar-item">
            <HiOutlineUsers className="menu-icon" />
            <span className="menu-text">Khấu trừ</span>
            <HiOutlineChevronRight className="chevron-icon" />
          </Link>
        </li>
        <li className={location.pathname === '/salary-advance' ? 'active' : ''}>
          <Link to="/salary-advance" className="sidebar-item">
            <HiOutlineCurrencyDollar className="menu-icon" />
            <span className="menu-text">Ứng lương</span>
            <HiOutlineChevronRight className="chevron-icon" />
          </Link>
        </li>
        <li className={location.pathname === '/settings' ? 'active' : ''}>
          <Link to="/settings" className="sidebar-item">
            <HiOutlineCog className="menu-icon" />
            <span className="menu-text">Cài đặt</span>
            <HiOutlineChevronRight className="chevron-icon" />
          </Link>
        </li>
        <li className={location.pathname === '/notifications' ? 'active' : ''}>
          <Link to="/notifications" className="sidebar-item">
            <FiBell className="menu-icon" />
            <span className="menu-text">Thông báo</span>
            <HiOutlineChevronRight className="chevron-icon" />
            <span className="badge">5</span>
          </Link>
        </li>
      </ul>
      <div className="logout-section">
        <Link to="/logout" className="sidebar-item logout-link">
          <HiOutlineLogout className="menu-icon" />
          <span className="menu-text">Đăng xuất</span>
          <HiOutlineChevronRight className="chevron-icon" />
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
