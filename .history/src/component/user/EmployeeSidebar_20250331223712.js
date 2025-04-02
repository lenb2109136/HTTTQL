import React from 'react';
import { Nav } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiHome, FiDollarSign, FiAlertCircle, FiBell } from 'react-icons/fi';

const EmployeeSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div
      className="bg-light border-right"
      style={{
        width: '250px',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        paddingTop: '60px', // Để tránh bị đè bởi header
      }}
    >
      <Nav className="flex-column">
        <Nav.Link
          onClick={() => navigate('/userhome')}
          className={`d-flex align-items-center ${
            location.pathname === '/userhome' ? 'active' : ''
          }`}
        >
          <FiHome className="me-2" /> Trang chủ nhân viên
        </Nav.Link>
        <Nav.Link
          onClick={() => navigate('/advance-salary')}
          className={`d-flex align-items-center ${
            location.pathname === '/advance-salary' ? 'active' : ''
          }`}
        >
          <FiDollarSign className="me-2" /> Ứng lương
        </Nav.Link>
        <Nav.Link
          onClick={() => navigate('/complaints')}
          className={`d-flex align-items-center ${
            location.pathname === '/complaints' ? 'active' : ''
          }`}
        >
          <FiAlertCircle className="me-2" /> Khiếu nại
        </Nav.Link>
      </Nav>
    </div>
  );
};

export default EmployeeSidebar;
