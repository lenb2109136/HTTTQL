import React, { useState, useEffect } from 'react';
import { FiSearch, FiLogOut, FiBell } from 'react-icons/fi';
import './admin-style/Header-Admin.css';

const Header = () => {
  // Lấy trạng thái từ localStorage hoặc mặc định là light mode
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  // Hàm chuyển đổi chế độ
  const toggleTheme = () => {
    const newTheme = !darkMode;
    setDarkMode(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    document.body.classList.toggle('dark-mode', newTheme);
  };

  // Áp dụng trạng thái theme khi load trang
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
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

        {/* Nút chuyển đổi chế độ sáng/tối */}
        <div className="theme-toggle" onClick={toggleTheme}>
          <div className={`toggle-btn ${darkMode ? 'dark' : 'light'}`}>
            <div className="toggle-circle"></div>
          </div>
        </div>

        {/* Đăng xuất */}
        <div className="logout-section">
          <FiLogOut className="logout-icon" />
          <span>Đăng xuất</span>
        </div>
      </div>
    </div>
  );
};

export default Header;
