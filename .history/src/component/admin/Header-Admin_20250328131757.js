import React, { useState, useEffect } from 'react';
import { FiSearch, FiLogOut, FiBell, FiSun, FiMoon } from 'react-icons/fi';
import './admin-style/Header-Admin.css';

const Header = () => {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  const toggleTheme = () => {
    const newTheme = !darkMode;
    setDarkMode(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    document.body.classList.toggle('dark-mode', newTheme);
  };

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  return (
    <div className="header">
      <div className="search-bar">
        <FiSearch className="search-icon" />
        <input type="text" placeholder="Search" />
      </div>

      <div className="header-right">
        <FiBell className="notification-icon" />

        {/* Nút chuyển đổi chế độ sáng/tối với icon */}
        <div className="theme-toggle" onClick={toggleTheme}>
          <div className={`toggle-btn ${darkMode ? 'dark' : 'light'}`}>
            <div className="toggle-circle">
              {darkMode ? (
                <FiMoon className="theme-icon" />
              ) : (
                <FiSun className="theme-icon" />
              )}
            </div>
          </div>
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
