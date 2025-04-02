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
import Modal from 'react-modal'; // You'll need to install this package
import './admin-style/Header-Admin.css';

const Header = () => {
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] =
    useState(false);
  const [userInfo, setUserInfo] = useState({
    name: localStorage.getItem('employeeName') || 'Nguyễn Văn A',
    email: localStorage.getItem('employeeEmail') || 'example@email.com',
    phone: localStorage.getItem('employeePhone') || '0123456789',
  });
  const [passwords, setPasswords] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});

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

  const handleLogout = () => {
    toast.success('Đăng xuất thành công!');
    setTimeout(() => {
      localStorage.clear(); // Xóa tất cả localStorage
      sessionStorage.clear(); // Xóa tất cả sessionStorage
      window.location.href = '/login';
    }, 2000);
    setShowProfileMenu(false);
  };

  const openEditModal = () => {
    setIsEditModalOpen(true);
    setShowProfileMenu(false);
  };

  const openChangePasswordModal = () => {
    setIsChangePasswordModalOpen(true);
    setShowProfileMenu(false);
  };

  const closeModals = () => {
    setIsEditModalOpen(false);
    setIsChangePasswordModalOpen(false);
    setErrors({});
    setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
  };

  const validateUserInfo = data => {
    let tempErrors = {};
    if (!data.name.trim()) tempErrors.name = 'Tên không được để trống';
    if (!data.email.trim()) {
      tempErrors.email = 'Email không được để trống';
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      tempErrors.email = 'Email không hợp lệ';
    }
    if (!data.phone.trim()) {
      tempErrors.phone = 'Số điện thoại không được để trống';
    } else if (!/^\d{10}$/.test(data.phone)) {
      tempErrors.phone = 'Số điện thoại phải là 10 số';
    }
    return tempErrors;
  };

  const handleSaveUserInfo = () => {
    const validationErrors = validateUserInfo(userInfo);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Lưu thông tin vào localStorage
    localStorage.setItem('employeeName', userInfo.name);
    localStorage.setItem('employeeEmail', userInfo.email);
    localStorage.setItem('employeePhone', userInfo.phone);

    setErrors({});
    setIsEditModalOpen(false);
    toast.success('Đổi thông tin thành công!');
  };

  const validatePasswords = () => {
    let tempErrors = {};
    if (!passwords.oldPassword)
      tempErrors.oldPassword = 'Mật khẩu cũ không được để trống';
    if (!passwords.newPassword)
      tempErrors.newPassword = 'Mật khẩu mới không được để trống';
    if (passwords.newPassword !== passwords.confirmPassword) {
      tempErrors.confirmPassword = 'Mật khẩu mới không khớp';
    }
    return tempErrors;
  };

  const handleSaveNewPassword = () => {
    const validationErrors = validatePasswords();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Logic đổi mật khẩu (giả lập)
    setErrors({});
    setIsChangePasswordModalOpen(false);
    toast.success('Đổi mật khẩu thành công!');
    setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handlePasswordChange = e => {
    const { name, value } = e.target;
    setPasswords({ ...passwords, [name]: value });
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

        <div className="profile-section" onClick={handleProfileClick}>
          <div className="avatar">
            <img
              src="https://cdn-icons-png.flaticon.com/512/219/219970.png"
              alt="Avatar"
              className="avatar-img"
            />
          </div>
          <span className="user-name">{userInfo.name}</span>
          {showProfileMenu && (
            <div className="profile-menu">
              <div className="menu-item" onClick={openEditModal}>
                <FiUser className="menu-icon" /> Chỉnh sửa thông tin cá nhân
              </div>
              <div className="menu-item" onClick={openChangePasswordModal}>
                <FiLock className="menu-icon" /> Đổi mật khẩu
              </div>
              <div className="menu-item" onClick={handleLogout}>
                <FiLogOut className="menu-icon" /> Đăng xuất
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal chỉnh sửa thông tin cá nhân */}
      <Modal
        isOpen={isEditModalOpen}
        onRequestClose={closeModals}
        style={{
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: '400px',
          },
        }}
      >
        <h2>Chỉnh sửa thông tin cá nhân</h2>
        <div>
          <input
            type="text"
            name="name"
            value={userInfo.name}
            onChange={handleInputChange}
            placeholder="Tên"
            className={errors.name ? 'error-input' : ''}
          />
          {errors.name && <span className="error-text">{errors.name}</span>}
          <input
            type="email"
            name="email"
            value={userInfo.email}
            onChange={handleInputChange}
            placeholder="Email"
            className={errors.email ? 'error-input' : ''}
          />
          {errors.email && <span className="error-text">{errors.email}</span>}
          <input
            type="tel"
            name="phone"
            value={userInfo.phone}
            onChange={handleInputChange}
            placeholder="Số điện thoại"
            className={errors.phone ? 'error-input' : ''}
          />
          {errors.phone && <span className="error-text">{errors.phone}</span>}
          <button onClick={handleSaveUserInfo}>Lưu</button>
          <button onClick={closeModals}>Hủy</button>
        </div>
      </Modal>

      {/* Modal đổi mật khẩu */}
      <Modal
        isOpen={isChangePasswordModalOpen}
        onRequestClose={closeModals}
        style={{
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: '400px',
          },
        }}
      >
        <h2>Đổi mật khẩu</h2>
        <div>
          <input
            type="password"
            name="oldPassword"
            value={passwords.oldPassword}
            onChange={handlePasswordChange}
            placeholder="Mật khẩu cũ"
            className={errors.oldPassword ? 'error-input' : ''}
          />
          {errors.oldPassword && (
            <span className="error-text">{errors.oldPassword}</span>
          )}
          <input
            type="password"
            name="newPassword"
            value={passwords.newPassword}
            onChange={handlePasswordChange}
            placeholder="Mật khẩu mới"
            className={errors.newPassword ? 'error-input' : ''}
          />
          {errors.newPassword && (
            <span className="error-text">{errors.newPassword}</span>
          )}
          <input
            type="password"
            name="confirmPassword"
            value={passwords.confirmPassword}
            onChange={handlePasswordChange}
            placeholder="Xác nhận mật khẩu mới"
            className={errors.confirmPassword ? 'error-input' : ''}
          />
          {errors.confirmPassword && (
            <span className="error-text">{errors.confirmPassword}</span>
          )}
          <button onClick={handleSaveNewPassword}>Lưu</button>
          <button onClick={closeModals}>Hủy</button>
        </div>
      </Modal>
    </div>
  );
};

export default Header;
