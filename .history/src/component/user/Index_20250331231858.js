import React, { useState } from 'react';
import {
  Container,
  Table,
  Button,
  Navbar,
  Nav,
  Offcanvas,
} from 'react-bootstrap';
import {
  FaBars,
  FaSignOutAlt,
  FaMoneyBillWave,
  FaExclamationCircle,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './UserHome.css'; // Tạo file CSS để tùy chỉnh giao diện

const UserHome = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const navigate = useNavigate();

  // Dữ liệu mẫu
  const employee = { NV_HOTEN: 'Nguyễn Văn An' };
  const phieuLuongSample = [
    {
      id: 1,
      ngayPhat: '2025-03-31',
      luongCoBan: 3780000,
      luongTangCa: 0,
      tongThuNhap: 3780000,
      tongKhauTru: 500000,
      ungLuong: 0,
      luongNhan: 3280000,
      no: 0,
    },
    {
      id: 2,
      ngayPhat: '2025-02-28',
      luongCoBan: 3780000,
      luongTangCa: 500000,
      tongThuNhap: 4280000,
      tongKhauTru: 600000,
      ungLuong: 1000000,
      luongNhan: 2680000,
      no: 0,
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem('employeeId');
    navigate('/login');
  };

  const handleRequestAdvance = () => {
    alert('Chức năng ứng lương đang được phát triển!');
    // Thêm logic để mở modal hoặc chuyển hướng đến trang ứng lương
  };

  const handleComplaint = () => {
    alert('Chức năng khiếu nại đang được phát triển!');
    // Thêm logic để mở modal hoặc chuyển hướng đến trang khiếu nại
  };

  return (
    <div className="user-home">
      {/* Header */}
      <Navbar bg="dark" variant="dark" expand="lg" fixed="top">
        <Container fluid>
          <Button
            variant="outline-light"
            onClick={() => setShowSidebar(true)}
            className="me-2"
          >
            <FaBars />
          </Button>
          <Navbar.Brand href="#">Hệ Thống Quản Lý Lương</Navbar.Brand>
          <Nav className="ms-auto">
            <Nav.Link
              onClick={handleLogout}
              className="d-flex align-items-center"
            >
              <FaSignOutAlt className="me-1" /> Đăng Xuất
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      {/* Sidebar */}
      <Offcanvas
        show={showSidebar}
        onHide={() => setShowSidebar(false)}
        placement="start"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Menu Nhân Viên</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column">
            <Nav.Link href="#" active>
              Xem Phiếu Lương
            </Nav.Link>
            <Nav.Link onClick={handleRequestAdvance}>
              <FaMoneyBillWave className="me-2" /> Ứng Lương
            </Nav.Link>
            <Nav.Link onClick={handleComplaint}>
              <FaExclamationCircle className="me-2" /> Khiếu Nại
            </Nav.Link>
            <Nav.Link onClick={handleLogout}>
              <FaSignOutAlt className="me-2" /> Đăng Xuất
            </Nav.Link>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>

      {/* Nội dung chính */}
      <Container className="main-content" fluid>
        <h1 className="text-center mb-4">Trang Nhân Viên</h1>
        <p className="text-center mb-4">
          Chào mừng {employee ? employee.NV_HOTEN : 'bạn'} đến với trang cá nhân
          của nhân viên!
        </p>

        {/* Bảng phiếu lương */}
        <h3 className="mb-3">Danh Sách Phiếu Lương</h3>
        <Table striped bordered hover responsive>
          <thead className="table-dark">
            <tr>
              <th>STT</th>
              <th>Tháng/Năm</th>
              <th>Lương Cơ Bản</th>
              <th>Lương Tăng Ca</th>
              <th>Tổng Thu Nhập</th>
              <th>Tổng Khấu Trừ</th>
              <th>Ứng Lương</th>
              <th>Lương Nhận</th>
              <th>Nợ</th>
              <th>Ngày Phát</th>
            </tr>
          </thead>
          <tbody>
            {phieuLuongSample.length === 0 ? (
              <tr>
                <td colSpan="10" className="text-center">
                  Không có phiếu lương nào.
                </td>
              </tr>
            ) : (
              phieuLuongSample.map((phieu, index) => (
                <tr key={phieu.id}>
                  <td>{index + 1}</td>
                  <td>
                    {new Date(phieu.ngayPhat).toLocaleDateString('vi-VN', {
                      month: 'long',
                      year: 'numeric',
                    })}
                  </td>
                  <td>{phieu.luongCoBan.toLocaleString()} VNĐ</td>
                  <td>{phieu.luongTangCa.toLocaleString()} VNĐ</td>
                  <td>{phieu.tongThuNhap.toLocaleString()} VNĐ</td>
                  <td>{phieu.tongKhauTru.toLocaleString()} VNĐ</td>
                  <td>{phieu.ungLuong.toLocaleString()} VNĐ</td>
                  <td>{phieu.luongNhan.toLocaleString()} VNĐ</td>
                  <td>{phieu.no.toLocaleString()} VNĐ</td>
                  <td>
                    {new Date(phieu.ngayPhat).toLocaleDateString('vi-VN')}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>

        {/* Nút chức năng */}
        <div className="d-flex justify-content-end mt-4">
          <Button
            variant="primary"
            className="me-2"
            onClick={handleRequestAdvance}
          >
            <FaMoneyBillWave className="me-1" /> Ứng Lương
          </Button>
          <Button variant="warning" onClick={handleComplaint}>
            <FaExclamationCircle className="me-1" /> Khiếu Nại
          </Button>
        </div>
      </Container>
    </div>
  );
};

export default UserHome;
