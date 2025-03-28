// src/components/Sidebar.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FiGrid,
  FiCalendar,
  FiDollarSign,
  FiBriefcase,
  FiUsers,
  FiSettings,
  FiArrowUpCircle,
} from 'react-icons/fi';
import '../admin/';

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="sidebar">
      <div className="logo">
        <FiGrid /> argon
      </div>
      <ul>
        <li className={location.pathname === '/' ? 'active' : ''}>
          <Link to="/">
            <FiGrid /> Dashboard
          </Link>
        </li>
        <li className={location.pathname === '/calendar' ? 'active' : ''}>
          <Link to="/calendar">
            <FiCalendar /> Calendar
          </Link>
        </li>
        <li
          className={
            location.pathname === '/payroll-management' ? 'active' : ''
          }
        >
          <Link to="/payroll-management">
            <FiDollarSign /> Payroll Management
          </Link>
        </li>
        <li className={location.pathname === '/companies' ? 'active' : ''}>
          <Link to="/companies">
            <FiBriefcase /> Companies
          </Link>
        </li>
        <li className={location.pathname === '/contacts' ? 'active' : ''}>
          <Link to="/contacts">
            <FiUsers /> Contacts
          </Link>
        </li>
        <li className={location.pathname === '/administration' ? 'active' : ''}>
          <Link to="/administration">
            <FiSettings /> Administration
          </Link>
        </li>
      </ul>
      <div className="upgrade-section">
        <FiArrowUpCircle className="upgrade-icon" />
        <span>Upgrade to PRO</span>
      </div>
    </div>
  );
};

export default Sidebar;
