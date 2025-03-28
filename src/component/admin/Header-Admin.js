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
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();

      // Lấy giờ hiện tại
      const formattedTime = now.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });

      // Lấy ngày hiện tại
      const formattedDate = now.toLocaleDateString('vi-VN', {
        weekday: 'long',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });

      setCurrentTime(formattedTime);
      setCurrentDate(formattedDate);
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
        {/* Hiển thị ngày tháng và giờ hiện tại */}
        <div className="current-date-time">
          <FiClock className="clock-icon" />
          <span>
            {currentDate} - {currentTime}
          </span>
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
