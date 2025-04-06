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
import Modal from 'react-modal';
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
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = '/login';
    }, 2000);
    setShowProfileMenu(false);
  };

  const openEditModal = () => {
    console.log('Opening Edit Modal');
    setIsEditModalOpen(true);
    setShowProfileMenu(false);
  };

  const openChangePasswordModal = () => {
    console.log('Opening Change Password Modal');
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

      <Modal
        isOpen={isEditModalOpen}
        onRequestClose={closeModals}
        className="modal"
        overlayClassName="modal-overlay"
      >
        <div className="modal-content">
          <h2 className="modal-title">Chỉnh sửa thông tin cá nhân</h2>
          <button className="close-button" onClick={closeModals}>
            ×
          </button>
          <div className="modal-body">
            <div className="form-group">
              <label>Tên</label>
              <input
                type="text"
                name="name"
                value={userInfo.name}
                onChange={handleInputChange}
                className={errors.name ? 'error-input' : ''}
              />
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={userInfo.email}
                onChange={handleInputChange}
                className={errors.email ? 'error-input' : ''}
              />
              {errors.email && (
                <span className="error-text">{errors.email}</span>
              )}
            </div>
            <div className="form-group">
              <label>Số điện thoại</label>
              <input
                type="tel"
                name="phone"
                value={userInfo.phone}
                onChange={handleInputChange}
                className={errors.phone ? 'error-input' : ''}
              />
              {errors.phone && (
                <span className="error-text">{errors.phone}</span>
              )}
            </div>
            <div className="modal-actions">
              <button className="btn-save" onClick={handleSaveUserInfo}>
                Lưu
              </button>
              <button className="btn-cancel" onClick={closeModals}>
                Hủy
              </button>
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isChangePasswordModalOpen}
        onRequestClose={closeModals}
        className="modal"
        overlayClassName="modal-overlay"
      >
        <div className="modal-content">
          <h2 className="modal-title">Đổi mật khẩu</h2>
          <button className="close-button" onClick={closeModals}>
            ×
          </button>
          <div className="modal-body">
            <div className="form-group">
              <label>Mật khẩu cũ</label>
              <input
                type="password"
                name="oldPassword"
                value={passwords.oldPassword}
                onChange={handlePasswordChange}
                className={errors.oldPassword ? 'error-input' : ''}
              />
              {errors.oldPassword && (
                <span className="error-text">{errors.oldPassword}</span>
              )}
            </div>
            <div className="form-group">
              <label>Mật khẩu mới</label>
              <input
                type="password"
                name="newPassword"
                value={passwords.newPassword}
                onChange={handlePasswordChange}
                className={errors.newPassword ? 'error-input' : ''}
              />
              {errors.newPassword && (
                <span className="error-text">{errors.newPassword}</span>
              )}
            </div>
            <div className="form-group">
              <label>Xác nhận mật khẩu mới</label>
              <input
                type="password"
                name="confirmPassword"
                value={passwords.confirmPassword}
                onChange={handlePasswordChange}
                className={errors.confirmPassword ? 'error-input' : ''}
              />
              {errors.confirmPassword && (
                <span className="error-text">{errors.confirmPassword}</span>
              )}
            </div>
            <div className="modal-actions">
              <button className="btn-save" onClick={handleSaveNewPassword}>
                Lưu
              </button>
              <button className="btn-cancel" onClick={closeModals}>
                Hủy
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Header;
