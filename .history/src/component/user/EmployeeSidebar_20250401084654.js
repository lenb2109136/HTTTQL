import React from 'react';
import { Nav } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiHome, FiDollarSign, FiAlertCircle, FiBell } from 'react-icons/fi';

const EmployeeSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div
      className="bg-white border-right"
      style={{
        width: '250px',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        paddingTop: '60px', // Tránh bị đè bởi header
        boxShadow: '2px 0 10px rgba(0, 0, 0, 0.1)',
        zIndex: 1000,
        transition: 'box-shadow 0.3s ease',
      }}
      onMouseEnter={e =>
        (e.currentTarget.style.boxShadow = '2px 0 15px rgba(0, 0, 0, 0.15)')
      }
      onMouseLeave={e =>
        (e.currentTarget.style.boxShadow = '2px 0 10px rgba(0, 0, 0, 0.1)')
      }
    >
      <Nav className="flex-column">
        <Nav.Link
          onClick={() => navigate('/userhome')}
          className={`d-flex align-items-center p-3 ${
            location.pathname === '/userhome' ? 'active' : ''
          }`}
          style={{
            color: '#333',
            transition: 'all 0.3s ease',
          }}
        >
          <FiHome
            className="me-2"
            style={{ fontSize: '18px', color: '#007bff' }}
          />
          <span style={{ fontSize: '14px', fontWeight: 500 }}>
            Trang chủ nhân viên
          </span>
        </Nav.Link>
        <Nav.Link
          onClick={() => navigate('/advance-salary')}
          className={`d-flex align-items-center p-3 ${
            location.pathname === '/advance-salary' ? 'active' : ''
          }`}
          style={{
            color: '#333',
            transition: 'all 0.3s ease',
          }}
        >
          <FiDollarSign
            className="me-2"
            style={{ fontSize: '18px', color: '#007bff' }}
          />
          <span style={{ fontSize: '14px', fontWeight: 500 }}>Ứng lương</span>
        </Nav.Link>
        <Nav.Link
          onClick={() => navigate('/complaints')}
          className={`d-flex align-items-center p-3 ${
            location.pathname === '/complaints' ? 'active' : ''
          }`}
          style={{
            color: '#333',
            transition: 'all 0.3s ease',
          }}
        >
          <FiAlertCircle
            className="me-2"
            style={{ fontSize: '18px', color: '#007bff' }}
          />
          <span style={{ fontSize: '14px', fontWeight: 500 }}>Khiếu nại</span>
        </Nav.Link>
      </Nav>
    </div>
  );
};

export default EmployeeSidebar;
