import React from 'react';
import {
  Navbar,
  Container,
  Form,
  FormControl,
  Button,
  Dropdown,
  Badge,
} from 'react-bootstrap';
import {
  FiBell,
  FiLogOut,
  FiUser,
  FiInbox,
  FiSettings,
  FiDollarSign,
  FiHeadphones,
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './EmployeeHeader.css'; // Import file CSS riêng (nếu có)

const EmployeeHeader = ({ employee }) => {
  const navigate = useNavigate();

  // Lấy ngày tháng hiện tại
  const today = new Date().toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleLogout = () => {
    try {
      localStorage.removeItem('employeeId');
      toast.success('Đăng xuất thành công!', {
        position: 'top-right',
        autoClose: 4000,
      });
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    } catch (error) {
      console.error('Lỗi khi đăng xuất:', error);
      toast.error('Đăng xuất thất bại!');
    }
  };

  return (
    <Navbar bg="white" expand="lg" className="header" style={{ zIndex: 1000 }}>
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
            <FiBell className="notification-icon" />
            <Badge bg="danger" className="notification-badge">
              3
            </Badge>
          </div>

          <div className="profile-section" onClick={() => {}}>
            <div className="avatar">
              <img
                src="https://via.placeholder.com/40"
                alt="Avatar"
                className="avatar-img"
              />
            </div>
            <span className="user-name">
              {employee ? employee.NV_HOTEN : 'Nhân viên'}
            </span>
            <Dropdown>
              <Dropdown.Toggle
                variant="link"
                id="dropdown-user"
                className="profile-toggle"
              />
              <Dropdown.Menu align="end" className="profile-menu">
                <Dropdown.Item
                  onClick={() => navigate('/profile')}
                  className="menu-item"
                >
                  <FiUser className="menu-icon" /> Profile
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => navigate('/inbox')}
                  className="menu-item"
                >
                  <FiInbox className="menu-icon" /> Inbox{' '}
                  <Badge bg="info" className="ms-2">
                    25
                  </Badge>
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => navigate('/settings')}
                  className="menu-item"
                >
                  <FiSettings className="menu-icon" /> Settings
                </Dropdown.Item>
                <Dropdown.Item className="menu-item">
                  <FiDollarSign className="menu-icon" /> Bal: 0 VNĐ
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => navigate('/support')}
                  className="menu-item"
                >
                  <FiHeadphones className="menu-icon" /> Support
                </Dropdown.Item>
                <Dropdown.Item onClick={handleLogout} className="menu-item">
                  <FiLogOut className="menu-icon" /> Log Out
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
