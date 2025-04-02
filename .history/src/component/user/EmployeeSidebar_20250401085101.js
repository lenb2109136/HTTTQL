import React from 'react';
import { Nav } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiHome, FiDollarSign, FiAlertCircle, FiBell } from 'react-icons/fi';
import './EmployeeSidebar.css'; // Import file CSS riêng

const EmployeeSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="employee-sidebar">
      {/* Thêm logo Samsung ở đầu sidebar */}
      <div className="sidebar-logo">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Samsung_Logo.svg/1280px-Samsung_Logo.svg.png"
          alt="Samsung Logo"
        />
      </div>

      <Nav className="nav-sidebar">
        <Nav.Link
          onClick={() => navigate('/userhome')}
          className={`nav-link ${
            location.pathname === '/userhome' ? 'active' : ''
          }`}
        >
          <FiHome className="nav-icon" />
          <span className="nav-text">Trang chủ nhân viên</span>
        </Nav.Link>
        <Nav.Link
          onClick={() => navigate('/advance-salary')}
          className={`nav-link ${
            location.pathname === '/advance-salary' ? 'active' : ''
          }`}
        >
          <FiDollarSign className="nav-icon" />
          <span className="nav-text">Ứng lương</span>
        </Nav.Link>
        <Nav.Link
          onClick={() => navigate('/complaints')}
          className={`nav-link ${
            location.pathname === '/complaints' ? 'active' : ''
          }`}
        >
          <FiAlertCircle className="nav-icon" />
          <span className="nav-text">Khiếu nại</span>
        </Nav.Link>
      </Nav>
    </div>
  );
};

export default EmployeeSidebar;
