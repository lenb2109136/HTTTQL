// src/components/Sidebar.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FiGrid,
  FiCalendar,
  FiDollarSign,
  FiBuilding,
  FiUsers,
  FiSettings,
} from 'react-icons/fi'; // Sử dụng react-icons

const Sidebar = () => {
  const location = useLocation(); // Lấy URL hiện tại

  return (
    <div className="sidebar">
      <div className="logo">
        <FiGrid /> Samsung Admin
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
            <FiBuilding /> Companies
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
    </div>
  );
};

export default Sidebar;
