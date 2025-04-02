import React, { useState } from 'react';
import {
  Navbar,
  Container,
  FormControl,
  Badge,
  Dropdown,
} from 'react-bootstrap';
import {
  FiBell,
  FiLogOut,
  FiEdit,
  FiLock,
  FiClock,
  FiSearch,
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './EmployeeHeader.css';

const EmployeeHeader = () => {
  const navigate = useNavigate();

  // Lấy thông tin người dùng từ localStorage
  const employee = JSON.parse(localStorage.getItem('employee')) || {
    NV_HOTEN: 'Người dùng',
    avatar: 'https://cdn-icons-png.flaticon.com/512/219/219986.png',
  };

  // Lấy ngày tháng hiện tại
  const today = new Date().toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Danh sách thông báo (dữ liệu mẫu)
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: 'Yêu cầu ứng lương đã được phê duyệt',
      time: '2 giờ trước',
    },
    { id: 2, message: 'Bạn có lương mới tháng 4/2025', time: '1 ngày trước' },
    { id: 3, message: 'Khiếu nại đã được xử lý', time: '2 ngày trước' },
  ]);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    toast.success('Đăng xuất thành công!', {
      position: 'top-right',
      autoClose: 2000,
    });
    navigate('/login', { replace: true });
  };

  return (
    <Navbar className="header">
      <Container>
        <div className="search-bar">
          <FiSearch className="search-icon" />
          <FormControl
            type="search"
            placeholder="Tìm kiếm..."
            className="search-input"
          />
        </div>

        <div className="header-right">
          <div className="current-date-time">
            <FiClock className="clock-icon" />
            <span>{today}</span>
          </div>

          <div className="notification-icon-wrapper">
            <Dropdown>
              <Dropdown.Toggle
                variant="link"
                id="dropdown-notifications"
                className="notification-toggle"
                noCaret // Bỏ mũi tên xuống
              >
                <FiBell className="notification-icon" />
                <Badge bg="danger" className="notification-badge">
                  {notifications.length}
                </Badge>
              </Dropdown.Toggle>

              <Dropdown.Menu className="notification-menu">
                {notifications.length > 0 ? (
                  notifications.map(notification => (
                    <Dropdown.Item
                      key={notification.id}
                      className="notification-item"
                    >
                      <div className="notification-content">
                        <span>{notification.message}</span>
                        <small>{notification.time}</small>
                      </div>
                    </Dropdown.Item>
                  ))
                ) : (
                  <Dropdown.Item className="notification-item">
                    Không có thông báo
                  </Dropdown.Item>
                )}
              </Dropdown.Menu>
            </Dropdown>
          </div>

          <div className="profile-section">
            <Dropdown>
              <Dropdown.Toggle
                variant="link"
                id="dropdown-user"
                className="profile-toggle"
              >
                <div className="avatar">
                  <img
                    src={employee.avatar}
                    alt="Avatar"
                    className="avatar-img"
                  />
                </div>
                <span className="user-name">{employee.NV_HOTEN}</span>
              </Dropdown.Toggle>

              <Dropdown.Menu className="profile-menu">
                <Dropdown.Item
                  onClick={() => navigate('/edit-profile')}
                  className="menu-item"
                >
                  <FiEdit className="menu-icon" /> Chỉnh sửa thông tin cá nhân
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => navigate('/change-password')}
                  className="menu-item"
                >
                  <FiLock className="menu-icon" /> Đổi mật khẩu
                </Dropdown.Item>
                <Dropdown.Item onClick={handleLogout} className="menu-item">
                  <FiLogOut className="menu-icon" /> Đăng xuất
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      </Container>
    </Navbar>
  );
};

export default EmployeeHeader;
