import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './SidebarAdmin.css';

export default function SidebarAdmin() {
  const navigate = useNavigate();
  const location = useLocation(); // Get current route

  return (
    <div className="sidebar bg-light shadow-sm">
      <h2 className="sidebar-title text-primary fw-bold p-3">Traveller</h2>
      <ul className="list-unstyled">
        <li className="sidebar-item">
          <span
            onClick={() => navigate('/admin')}
            className={`sidebar-link ${
              location.pathname === '/admin' ? 'active' : ''
            }`}
          >
            <span className="sidebar-icon">🏠</span> Trang chủ
          </span>
        </li>
        <li className="sidebar-item">
          <span
            onClick={() => navigate('/admin/tour')}
            className={`sidebar-link ${
              location.pathname === '/admin/tour' ? 'active' : ''
            }`}
          >
            <span className="sidebar-icon">✈️</span> Quản lý tour
          </span>
        </li>
        <li className="sidebar-item">
          <span
            onClick={() => navigate('/admin/booking')}
            className={`sidebar-link ${
              location.pathname === '/admin/booking' ? 'active' : ''
            }`}
          >
            <span className="sidebar-icon">📅</span> Quản lý Booking
          </span>
        </li>
        <li className="sidebar-item">
          <span
            onClick={() => navigate('/admin/discount')}
            className={`sidebar-link ${
              location.pathname === '/admin/discount' ? 'active' : ''
            }`}
          >
            <span className="sidebar-icon">🎟️</span> Mã giảm giá
          </span>
        </li>
        <li className="sidebar-item">
          <span
            onClick={() => navigate('/admin/category')}
            className={`sidebar-link ${
              location.pathname === '/admin/category' ? 'active' : ''
            }`}
          >
            <span className="sidebar-icon">📋</span> Danh mục tour
          </span>
        </li>
        <li className="sidebar-item">
          <span
            onClick={() => navigate('/admin/user')}
            className={`sidebar-link ${
              location.pathname === '/admin/user' ? 'active' : ''
            }`}
          >
            <span className="sidebar-icon">👥</span> Khách hàng
          </span>
        </li>
      </ul>
    </div>
  );
}
