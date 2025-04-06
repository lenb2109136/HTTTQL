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

      <Nav className="flex-column">
        <Nav.Link
          onClick={() => navigate('/userhome')}
          className={location.pathname === '/userhome' ? 'active' : ''}
        >
          <FiHome className="fi" />
          <span>Trang chủ nhân viên</span>
        </Nav.Link>
        <Nav.Link
          onClick={() => navigate('/advance-salary')}
          className={location.pathname === '/advance-salary' ? 'active' : ''}
        >
          <FiDollarSign className="fi" />
          <span>Ứng lương</span>
        </Nav.Link>
        <Nav.Link
          onClick={() => navigate('/complaints')}
          className={location.pathname === '/complaints' ? 'active' : ''}
        >
          <FiAlertCircle className="fi" />
          <span>Khiếu nại</span>
        </Nav.Link>
      </Nav>
    </div>
  );
};

export default EmployeeSidebar;
