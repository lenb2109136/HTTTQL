// src/components/Header.js
import React, { useState } from 'react';
import { FiSearch, FiLogOut } from 'react-icons/fi';
import './admin-style/Header.css';

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
        <input type="text" placeholder="Search" />
      </div>

      {/* Phần bên phải: Tên người dùng và Avatar */}
      <div className="header-right">
        <span className="user-name">Jessica Jones</span>
        <div className="user-profile">
          <div className="avatar" onClick={toggleDropdown}>
            <img src="https://via.placeholder.com/40" alt="User Avatar" />
          </div>
          {isDropdownOpen && (
            <div className="dropdown-menu">
              <div className="dropdown-item">Jessica Jones</div>
              <div className="dropdown-item">jessica.jones@samsung.com</div>
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
