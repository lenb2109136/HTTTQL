import React, { useState, useEffect } from 'react';
import {
  FiSearch,
  FiBell,
  FiSun,
  FiMoon,
  FiClock,
  FiUser,
  FiLock,
  FiLogOut,
} from 'react-icons/fi';
import { toast } from 'react-toastify'; // Import toast từ react-toastify
import './admin-style/Header-Admin.css';

const Header = () => {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);

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

  const handleProfileClick = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  const handleEditProfile = () => {
    toast.info('Chức năng chỉnh sửa thông tin cá nhân đang được phát triển!');
    setShowProfileMenu(false);
  };

  const handleChangePassword = () => {
    toast.info('Chức năng đổi mật khẩu đang được phát triển!');
    setShowProfileMenu(false);
  };

  const handleLogout = () => {
    toast.success('Đăng xuất thành công!'); // Sử dụng toast.success thay cho alert
    localStorage.removeItem('employeeId'); // Xóa employeeId khi đăng xuất
    setTimeout(() => {
      window.location.href = '/login'; // Chuyển hướng sau khi toast hiển thị
    }, 2000); // Chờ 2 giây để người dùng thấy thông báo
    setShowProfileMenu(false);
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

        {/* Hình avatar thay cho đăng xuất */}
        <div className="profile-section" onClick={handleProfileClick}>
          <div className="avatar">
            {/* Hình ảnh mặc định (sử dụng placeholder) */}
            <img
              src="https://cdn-icons-png.flaticon.com/512/219/219970.png"
              alt="Avatar"
              className="avatar-img"
            />
          </div>
          {showProfileMenu && (
            <div className="profile-menu">
              <div className="menu-item" onClick={handleEditProfile}>
                <FiUser className="menu-icon" /> Chỉnh sửa thông tin cá nhân
              </div>
              <div className="menu-item" onClick={handleChangePassword}>
                <FiLock className="menu-icon" /> Đổi mật khẩu
              </div>
              <div className="menu-item" onClick={handleLogout}>
                <FiLogOut className="menu-icon" /> Đăng xuất
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
