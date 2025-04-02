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
    localStorage.removeItem('employeeId');
    toast.success('Đăng xuất thành công!');
    navigate('/login');
  };

  return (
    <Navbar
      bg="light"
      expand="lg"
      className="shadow-sm"
      style={{ position: 'fixed', top: 0, width: '100%', zIndex: 1000 }}
    >
      <Container>
        <Navbar.Brand>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Samsung_Logo.svg/1280px-Samsung_Logo.svg.png"
            alt="Samsung Logo"
            style={{ height: '40px' }}
          />
        </Navbar.Brand>
        <Form className="d-flex mx-auto" style={{ width: '40%' }}>
          <FormControl
            type="search"
            placeholder="Tìm kiếm..."
            className="me-2"
            aria-label="Search"
          />
          <Button variant="outline-primary">Tìm</Button>
        </Form>
        <div className="d-flex align-items-center">
          <span className="me-3">{today}</span>
          <div className="position-relative me-3">
            <FiBell size={24} />
            <Badge
              bg="danger"
              className="position-absolute top-0 start-100 translate-middle"
            >
              3
            </Badge>
          </div>
          <Dropdown>
            <Dropdown.Toggle
              variant="link"
              id="dropdown-user"
              className="d-flex align-items-center text-decoration-none"
            >
              <img
                src="https://via.placeholder.com/40"
                alt="Avatar"
                className="rounded-circle me-2"
                style={{ width: '40px', height: '40px' }}
              />
              <span>{employee ? employee.NV_HOTEN : 'Nhân viên'}</span>
            </Dropdown.Toggle>
            <Dropdown.Menu align="end">
              <Dropdown.Item onClick={() => navigate('/profile')}>
                <FiUser className="me-2" /> Profile
              </Dropdown.Item>
              <Dropdown.Item onClick={() => navigate('/inbox')}>
                <FiInbox className="me-2" /> Inbox{' '}
                <Badge bg="info" className="ms-2">
                  25
                </Badge>
              </Dropdown.Item>
              <Dropdown.Item onClick={() => navigate('/settings')}>
                <FiSettings className="me-2" /> Settings
              </Dropdown.Item>
              <Dropdown.Item>
                <FiDollarSign className="me-2" /> Bal: 0 VNĐ
              </Dropdown.Item>
              <Dropdown.Item onClick={() => navigate('/support')}>
                <FiHeadphones className="me-2" /> Support
              </Dropdown.Item>
              <Dropdown.Item onClick={handleLogout}>
                <FiLogOut className="me-2" /> Log Out
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </Container>
    </Navbar>
  );
};

export default EmployeeHeader;
