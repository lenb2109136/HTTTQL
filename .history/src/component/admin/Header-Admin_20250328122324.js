import React from 'react';
import { FiSearch, FiLogOut, FiBell } from 'react-icons/fi';
import './admin-style/Header-Admin.css'; // Adjusted import to match the provided file location

const Header = () => {
  return (
    <div className="header">
      {/* Thanh tìm kiếm */}
      <div className="search-bar">
        <FiSearch className="search-icon" />
        <input type="text" placeholder="Search" />
      </div>

      {/* Phần bên phải: Biểu tượng thông báo và nút đăng xuất */}
      <div className="header-right">
        <FiBell className="notification-icon" />
        <div className="logout-section">
          <FiLogOut className="logout-icon" />
          <span>Đăng xuất</span>
        </div>
      </div>
    </div>
  );
};

export default Header;
