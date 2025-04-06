import React from 'react';
import './admin-style/SideBar-Admin.css';
import { Link, useLocation } from 'react-router-dom';
import { HomeIcon } from '@heroicons/react/24/outline';
import { UsersIcon } from '@heroicons/react/24/outline';
import { BuildingOfficeIcon } from '@heroicons/react/24/outline';
import { CalendarIcon } from '@heroicons/react/24/outline';
import { CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { CogIcon } from '@heroicons/react/24/outline';
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { ChevronRightIcon } from '@heroicons/react/24/outline';

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="sidebar">
      <div className="logo">
        <span className="logo-text">Samsung</span>
      </div>
      <ul>
        <li className={location.pathname === '/' ? 'active' : ''}>
          <Link to="/">
            <HiOutlineHome className="menu-icon" />
            <span>Trang chủ</span>
            <HiOutlineChevronRight className="chevron-icon" />
          </Link>
        </li>
        <li className={location.pathname === '/employees' ? 'active' : ''}>
          <Link to="/employees">
            <HiOutlineUsers className="menu-icon" />
            <span>Nhân viên</span>
            <HiOutlineChevronRight className="chevron-icon" />
          </Link>
        </li>
        <li className={location.pathname === '/departments' ? 'active' : ''}>
          <Link to="/departments">
            <HiOutlineOfficeBuilding className="menu-icon" />
            <span>Phòng ban</span>
            <HiOutlineChevronRight className="chevron-icon" />
          </Link>
        </li>
        <li className={location.pathname === '/salary-scale' ? 'active' : ''}>
          <Link to="/salary-scale">
            <HiOutlineCalendar className="menu-icon" />
            <span>Ngạch lương</span>
            <HiOutlineChevronRight className="chevron-icon" />
          </Link>
        </li>
        <li className={location.pathname === '/pay-grade' ? 'active' : ''}>
          <Link to="/pay-grade">
            <HiOutlineCurrencyDollar className="menu-icon" />
            <span>Bậc lương</span>
            <HiOutlineChevronRight className="chevron-icon" />
          </Link>
        </li>
        <li
          className={
            location.pathname === '/salary-calculation' ? 'active' : ''
          }
        >
          <Link to="/salary-calculation">
            <HiOutlineCurrencyDollar className="menu-icon" />
            <span>Tính lương</span>
            <HiOutlineChevronRight className="chevron-icon" />
          </Link>
        </li>
        <li className={location.pathname === '/deductions' ? 'active' : ''}>
          <Link to="/deductions">
            <HiOutlineUsers className="menu-icon" />
            <span>Khấu trừ</span>
            <HiOutlineChevronRight className="chevron-icon" />
          </Link>
        </li>
        <li className={location.pathname === '/salary-advance' ? 'active' : ''}>
          <Link to="/salary-advance">
            <HiOutlineCurrencyDollar className="menu-icon" />
            <span>Ứng lương</span>
            <HiOutlineChevronRight className="chevron-icon" />
          </Link>
        </li>
        <li className={location.pathname === '/settings' ? 'active' : ''}>
          <Link to="/settings">
            <HiOutlineCog className="menu-icon" />
            <span>Cài đặt</span>
            <HiOutlineChevronRight className="chevron-icon" />
          </Link>
        </li>
      </ul>
      <div className="logout-section">
        <Link to="/logout" className="logout-link">
          <HiOutlineLogout className="logout-icon" />
          <span>Đăng xuất</span>
          <HiOutlineChevronRight className="chevron-icon" />
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
