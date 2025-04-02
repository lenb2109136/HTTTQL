import React from 'react';
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
import './EmployeeHeader.css'; // Import file CSS riêng

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
    <Navbar
      bg="white"
      expand="lg"
      className="header"
      fixed="top" // Đặt header ở vị trí cố định trên cùng
      style={{ zIndex: 1000 }}
    >
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

          <div className="profile-section">
            <Dropdown>
              <Dropdown.Toggle
                variant="link"
                id="dropdown-user"
                className="profile-toggle"
              >
                <div className="avatar">
                  <img
                    src={
                      employee && employee.avatar
                        ? employee.avatar
                        : 'https://cdn-icons-png.flaticon.com/512/219/219986.png'
                    }
                    alt="Avatar"
                    className="avatar-img"
                  />
                </div>
                <span className="user-name">
                  {employee && employee.NV_HOTEN
                    ? employee.NV_HOTEN
                    : 'Người dùng'}
                </span>
              </Dropdown.Toggle>

              <Dropdown.Menu align="end" className="profile-menu">
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
