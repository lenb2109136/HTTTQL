import React, { useState, useEffect } from 'react';
import {
  FiSearch,
  FiBell,
  FiClock,
  FiUser,
  FiLock,
  FiLogOut,
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import './admin-style/Header-Admin.css';

const Header = () => {
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const userName = localStorage.getItem('employeeName') || 'Nguyễn Văn A'; // Dữ liệu mẫu

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();

      const formattedTime = now.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });

      const formattedDate = now.toLocaleDateString('vi-VN', {
        weekday: 'long',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });

      setCurrentTime(formattedTime);
      setCurrentDate(formattedDate);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

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
    toast.success('Đăng xuất thành công!');
    setTimeout(() => {
      localStorage.removeItem('employeeId');
      window.location.href = '/login';
    }, 2000);
    setShowProfileMenu(false);
  };

  return (
    <div className="header">
      <div className="search-bar">
        <FiSearch className="search-icon" />
        <input type="text" placeholder="Tìm kiếm..." />
      </div>

      <div className="header-right">
        <div className="current-date-time">
          <FiClock className="clock-icon" />
          <span>
            {currentDate} - {currentTime}
          </span>
        </div>

        <FiBell className="notification-icon" />

        {/* Xóa toggle sáng/tối */}

        <div className="profile-section" onClick={handleProfileClick}>
          <div className="avatar">
            <img
              src="https://cdn-icons-png.flaticon.com/512/219/219970.png"
              alt="Avatar"
              className="avatar-img"
            />
          </div>
          <span className="user-name">{userName}</span>
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
