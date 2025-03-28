import React, { useState, useEffect } from 'react';
import { FiSearch, FiLogOut, FiBell, FiSun, FiMoon } from 'react-icons/fi';
import './admin-style/Header-Admin.css';

const Header = () => {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  return (
    <div className="header">
      {/* Thanh tìm kiếm */}
      <div className="search-bar">
        <FiSearch className="search-icon" />
        <input type="text" placeholder="Search" />
      </div>

      {/* Phần bên phải */}
      <div className="header-right">
        <FiBell className="notification-icon" />
        <div className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? (
            <FiSun className="theme-icon" />
          ) : (
            <FiMoon className="theme-icon" />
          )}
        </div>
        <div className="logout-section">
          <FiLogOut className="logout-icon" />
          <span>Đăng xuất</span>
        </div>
      </div>
    </div>
  );
};

export default Header;
