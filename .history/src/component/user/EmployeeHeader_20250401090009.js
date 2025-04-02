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
      className="shadow-sm"
      style={{
        position: 'fixed',
        top: 0,
        width: 'calc(100% - 250px)',
        left: '250px',
        zIndex: 1000,
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        transition: 'box-shadow 0.3s ease',
      }}
      onMouseEnter={e =>
        (e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.15)')
      }
      onMouseLeave={e =>
        (e.currentTarget.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)')
      }
    >
      <Container>
        <Form
          className="d-flex mx-auto"
          style={{
            width: '40%',
            borderRadius: '20px',
            overflow: 'hidden',
            border: '1px solid #e0e0e0',
          }}
        >
          <FormControl
            type="search"
            placeholder="Tìm kiếm..."
            className="me-2 border-0"
            aria-label="Search"
            style={{ background: 'none', outline: 'none', boxShadow: 'none' }}
          />
          <Button
            variant="outline-primary"
            style={{ borderRadius: '0 20px 20px 0' }}
          >
            Tìm
          </Button>
        </Form>
        <div className="d-flex align-items-center">
          <span
            className="me-3"
            style={{
              fontSize: '14px',
              fontWeight: 600,
              color: '#007bff',
              background: 'rgba(0, 123, 255, 0.1)',
              padding: '6px 12px',
              borderRadius: '8px',
              transition: 'all 0.3s ease',
            }}
          >
            {today}
          </span>
          <div className="position-relative me-3">
            <FiBell
              size={24}
              style={{ color: '#555', transition: 'color 0.3s ease' }}
            />
            <Badge
              bg="danger"
              className="position-absolute top-0 start-100 translate-middle"
              style={{ fontSize: '0.75rem' }}
            >
              3
            </Badge>
            <div
              onMouseEnter={e =>
                (e.currentTarget.firstChild.style.color = '#007bff')
              }
              onMouseLeave={e =>
                (e.currentTarget.firstChild.style.color = '#555')
              }
            />
          </div>
          <Dropdown>
            <Dropdown.Toggle
              variant="link"
              id="dropdown-user"
              className="d-flex align-items-center text-decoration-none"
              style={{ color: '#333', transition: 'color 0.3s ease' }}
            >
              <img
                src="https://via.placeholder.com/40"
                alt="Avatar"
                className="rounded-circle me-2"
                style={{
                  width: '40px',
                  height: '40px',
                  border: '2px solid #e0e0e0',
                  transition: 'transform 0.2s ease',
                }}
              />
              <span style={{ fontSize: '14px', fontWeight: 500 }}>
                {employee ? employee.NV_HOTEN : 'Nhân viên'}
              </span>
            </Dropdown.Toggle>
            <Dropdown.Menu
              align="end"
              className="mt-2"
              style={{
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              }}
            >
              <Dropdown.Item
                onClick={() => navigate('/profile')}
                className="d-flex align-items-center"
                style={{
                  padding: '10px 15px',
                  transition: 'background 0.3s ease',
                }}
              >
                <FiUser
                  className="me-2"
                  style={{ color: '#666', fontSize: '16px' }}
                />{' '}
                Profile
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => navigate('/inbox')}
                className="d-flex align-items-center"
                style={{
                  padding: '10px 15px',
                  transition: 'background 0.3s ease',
                }}
              >
                <FiInbox
                  className="me-2"
                  style={{ color: '#666', fontSize: '16px' }}
                />{' '}
                Inbox{' '}
                <Badge
                  bg="info"
                  className="ms-2"
                  style={{ fontSize: '0.75rem' }}
                >
                  25
                </Badge>
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => navigate('/settings')}
                className="d-flex align-items-center"
                style={{
                  padding: '10px 15px',
                  transition: 'background 0.3s ease',
                }}
              >
                <FiSettings
                  className="me-2"
                  style={{ color: '#666', fontSize: '16px' }}
                />{' '}
                Settings
              </Dropdown.Item>
              <Dropdown.Item
                className="d-flex align-items-center"
                style={{
                  padding: '10px 15px',
                  transition: 'background 0.3s ease',
                }}
              >
                <FiDollarSign
                  className="me-2"
                  style={{ color: '#666', fontSize: '16px' }}
                />{' '}
                Bal: 0 VNĐ
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => navigate('/support')}
                className="d-flex align-items-center"
                style={{
                  padding: '10px 15px',
                  transition: 'background 0.3s ease',
                }}
              >
                <FiHeadphones
                  className="me-2"
                  style={{ color: '#666', fontSize: '16px' }}
                />{' '}
                Support
              </Dropdown.Item>
              <Dropdown.Item
                onClick={handleLogout}
                className="d-flex align-items-center"
                style={{
                  padding: '10px 15px',
                  transition: 'background 0.3s ease',
                }}
              >
                <FiLogOut
                  className="me-2"
                  style={{ color: '#666', fontSize: '16px' }}
                />{' '}
                Log Out
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </Container>
    </Navbar>
  );
};

export default EmployeeHeader;
