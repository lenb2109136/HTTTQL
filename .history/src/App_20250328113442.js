import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SidebarAdmin from './component/admin/SliderBar.js'; // Import SidebarAdmin
import Admin from './component/admin/Header.js'; // Import Admin component

function App() {
  return (
    <Router>
      <div className="App">
        {/* Header */}
        <header className="App-header">
          <h1 className="header-title">SamSung Admin Dashboard</h1>
        </header>

        {/* Main layout with Sidebar and Content */}
        <div className="main-layout">
          {/* Sidebar */}
          <SidebarAdmin />

          {/* Main Content */}
          <div className="content">
            <Routes>
              <Route path="/admin" element={<Admin />} />
              {/* Bạn có thể thêm các route khác ở đây nếu cần */}
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
              {/* Route mặc định khi truy cập root */}
              <Route path="/" element={<Admin />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
