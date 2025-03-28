import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import SidebarAdmin from './component/admin/SlideBar.js';
import Admin from './component/admin/Index.js';

function App() {
  return (
    <Router>
      <div className="App">
        {/* Header chính */}
        <header className="App-header bg-dark text-white p-3">
          <h1 className="header-title">SamSung Admin Dashboard</h1>
        </header>

        {/* Header phụ */}
        <div className="sub-header bg-secondary text-white p-2 d-flex justify-content-between align-items-center">
          <div>
            <span>Xin chào, Admin</span>
          </div>
          <div>
            <button className="btn btn-outline-light btn-sm">Đăng xuất</button>
          </div>
        </div>

        {/* Main layout with Sidebar and Content */}
        <div className="main-layout d-flex">
          {/* Sidebar */}
          <SidebarAdmin />

          {/* Main Content */}
          <div className="content flex-grow-1 p-4 bg-light">
            <Routes>
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin/salary" element={<div>Quản lý lương</div>} />
              <Route
                path="/admin/attendance"
                element={<div>Quản lý chấm công</div>}
              />
              <Route
                path="/admin/bonus"
                element={<div>Thưởng & Phụ cấp</div>}
              />
              <Route path="/admin/department" element={<div>Phòng ban</div>} />
              <Route path="/admin/employee" element={<div>Nhân viên</div>} />
              <Route path="/" element={<Admin />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
