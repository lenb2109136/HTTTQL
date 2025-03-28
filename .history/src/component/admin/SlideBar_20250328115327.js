// src/components/Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="logo">Samsung Admin</div>
      <ul>
        <li>
          <Link to="/">
            <i>📊</i> Dashboard
          </Link>
        </li>
        <li>
          <Link to="/calendar">
            <i>📅</i> Calendar
          </Link>
        </li>
        <li>
          <Link to="/payroll-management">
            <i>📈</i> Payroll Management
          </Link>
        </li>
        <li>
          <Link to="/companies">
            <i>🏢</i> Companies
          </Link>
        </li>
        <li>
          <Link to="/contacts">
            <i>📞</i> Contacts
          </Link>
        </li>
        <li>
          <Link to="/administration">
            <i>⚙️</i> Administration
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
