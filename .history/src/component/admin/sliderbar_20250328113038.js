import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './SidebarAdmin.css';

export default function SidebarAdmin() {
  const navigate = useNavigate();
  const location = useLocation(); // Get current route

  return (
    <div className="sidebar bg-light shadow-sm">
      <h2 className="sidebar-title text-primary fw-bold p-3">SamSung</h2>
      <ul className="list-unstyled">
        <li className="sidebar-item">
          <span
            onClick={() => navigate('/admin')}
            className={`sidebar-link ${
              location.pathname === '/admin' ? 'active' : ''
            }`}
          >
            <span className="sidebar-icon">📊</span> Trang chủ
          </span>
        </li>
        <li className="sidebar-item">
          <span
            onClick={() => navigate('/admin/salary')}
            className={`sidebar-link ${
              location.pathname === '/admin/salary' ? 'active' : ''
            }`}
          >
            <span className="sidebar-icon">💰</span> Quản lý lương
          </span>
        </li>
        <li className="sidebar-item">
          <span
            onClick={() => navigate('/admin/attendance')}
            className={`sidebar-link ${
              location.pathname === '/admin/attendance' ? 'active' : ''
            }`}
          >
            <span className="sidebar-icon">⏰</span> Quản lý chấm công
          </span>
        </li>
        <li className="sidebar-item">
          <span
            onClick(() => navigate('/admin/bonus')}
            className={`sidebar-link ${
              location.pathname === '/admin/bonus' ? 'active' : ''
            }`}
          >
            <span className="sidebar-icon">🎁</span> Thưởng & Phụ cấp
          </span>
        </li>
        <li className="sidebar-item">
          <span
            onClick(() => navigate('/admin/department')}
            className={`sidebar-link ${
              location.pathname === '/admin/department' ? 'active' : ''
            }`}
          >
            <span className="sidebar-icon">🏢</span> Phòng ban
          </span>
        </li>
        <li className="sidebar-item">
          <span
            onClick={() => navigate('/admin/employee')}
            className={`sidebar-link ${
              location.pathname === '/admin/employee' ? 'active' : ''
            }`}
          >
            <span className="sidebar-icon">👤</span> Nhân viên
          </span>
        </li>
      </ul>
    </div>
  );
}