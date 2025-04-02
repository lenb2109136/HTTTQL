import React from 'react';
import { Nav } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiHome, FiDollarSign, FiAlertCircle } from 'react-icons/fi';
import './EmployeeSidebar.css'; // Tạo file CSS riêng

const EmployeeSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="sidebar">
      <Nav className="flex-column">
        <Nav.Link
          onClick={() => navigate('/userhome')}
          className={`sidebar-item ${
            location.pathname === '/userhome' ? 'active' : ''
          }`}
        >
          <FiHome className="me-2" /> Trang chủ nhân viên
        </Nav.Link>
        <Nav.Link
          onClick={() => navigate('/advance-salary')}
          className={`sidebar-item ${
            location.pathname === '/advance-salary' ? 'active' : ''
          }`}
        >
          <FiDollarSign className="me-2" /> Ứng lương
        </Nav.Link>
        <Nav.Link
          onClick={() => navigate('/complaints')}
          className={`sidebar-item ${
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
