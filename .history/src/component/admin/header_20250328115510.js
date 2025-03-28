// src/components/Header.js
import React, { useState } from 'react';
import { FiSearch, FiBell, FiLogOut } from 'react-icons/fi'; // Import icons
import './Header.css'; // Tạo file CSS riêng cho Header

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="header">
      {/* Thanh tìm kiếm */}
      <div className="search-bar">
        <FiSearch className="search-icon" />
        <input type="text" placeholder="Search..." />
      </div>

      {/* Phần bên phải: Thông báo và Avatar */}
      <div className="header-right">
        {/* Biểu tượng thông báo */}
        <div className="notification">
          <FiBell className="notification-icon" />
          <span className="notification-badge">3</span> {/* Số thông báo */}
        </div>

        {/* Avatar và Dropdown */}
        <div className="user-profile">
          <div className="avatar" onClick={toggleDropdown}>
            <img
              src="https://via.placeholder.com/40" // Thay bằng URL ảnh avatar của bạn
              alt="User Avatar"
            />
          </div>
          {isDropdownOpen && (
            <div className="dropdown-menu">
              <div className="dropdown-item">John Doe</div>{' '}
              {/* Tên người dùng */}
              <div className="dropdown-item">john.doe@samsung.com</div>{' '}
              {/* Email */}
              <div className="dropdown-item logout">
                <FiLogOut className="logout-icon" />
                Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
