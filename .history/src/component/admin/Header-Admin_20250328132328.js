import React, { useState, useEffect } from 'react';
import {
  FiSearch,
  FiLogOut,
  FiBell,
  FiSun,
  FiMoon,
  FiClock,
} from 'react-icons/fi';
import './admin-style/Header-Admin.css';

const Header = () => {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formattedTime = now.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      setCurrentTime(formattedTime);
    };

    updateTime(); // Cập nhật ngay khi component mount
    const interval = setInterval(updateTime, 1000); // Cập nhật mỗi giây

    return () => clearInterval(interval); // Xóa interval khi component unmount
  }, []);

  const toggleTheme = () => {
    const newTheme = !darkMode;
    setDarkMode(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    document.body.classList.toggle('dark-mode', newTheme);
  };

  return (
    <div className="header">
      <div className="search-bar">
        <FiSearch className="search-icon" />
        <input type="text" placeholder="Tìm kiếm..." />
      </div>

      <div className="header-right">
        {/* Hiển thị ngày giờ hiện tại */}
        <div className="current-time">
          <FiClock className="clock-icon" />
          <span>{currentTime}</span>
        </div>

        <FiBell className="notification-icon" />

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
