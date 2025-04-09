import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Container, Row, Col, Button, Modal } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Đăng ký các thành phần cần thiết cho Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const UserHome = () => {
  const [phieuLuongList, setPhieuLuongList] = useState([]);
  const [monthlyStats, setMonthlyStats] = useState({});
  const [employee, setEmployee] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedPhieuLuong, setSelectedPhieuLuong] = useState(null);
  const [ngachLuong, setNgachLuong] = useState(null);
  const [bacLuong, setBacLuong] = useState(null);
  const API_URL = 'http://localhost:8080/api';

  useEffect(() => {
    const employeeData = localStorage.getItem('employee');
    if (employeeData) {
      const parsedEmployee = JSON.parse(employeeData);
      setEmployee(parsedEmployee);
      fetchPhieuLuong(parsedEmployee.NV_ID);
      fetchSalaryDetails(parsedEmployee.NV_ID); // Lấy ngạch và bậc lương
    } else {
      toast.error('Không tìm thấy thông tin nhân viên. Vui lòng đăng nhập lại.');
    }
  }, []);

  const fetchPhieuLuong = async (nvId) => {
    try {
      const response = await axios.get(`${API_URL}/phieu-luong`, {
        params: { employeeId: nvId },
      });
      const phieuLuongData = response.data;
      setPhieuLuongList(phieuLuongData);
      calculateMonthlyStats(phieuLuongData);
    } catch (error) {
      console.error('Lỗi khi lấy phiếu lương:', error);
      toast.error(
        error.response?.data || 'Không thể tải danh sách phiếu lương.'
      );
    }
  };

  const fetchSalaryDetails = async (nvId) => {
    try {
      const response = await axios.get(`${API_URL}/chi-tiet-bac-luong/nhan-vien/${nvId}/latest`);
      const latestChiTiet = response.data;
      setNgachLuong(latestChiTiet?.bac_ID?.ngachLuong?.ten || 'N/A');
      setBacLuong(latestChiTiet?.bac_ID?.ten || 'N/A');
    } catch (error) {
      console.error('Lỗi khi lấy chi tiết lương:', error);
      toast.error('Không thể tải thông tin ngạch và bậc lương.');
    }
  };

  const calculateMonthlyStats = (phieuLuongData) => {
    const stats = {};
    phieuLuongData.forEach((phieu) => {
      const date = new Date(phieu.ngayPhat);
      const monthYear = `Tháng ${date.getMonth() + 1} ${date.getFullYear()}`; // Hiển thị "Tháng 3 2025"
      stats[monthYear] = phieu.luongNhan || 0;
    });
    setMonthlyStats(stats);
  };

  const handleShowModal = (phieu) => {
    setSelectedPhieuLuong(phieu);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPhieuLuong(null);
  };

  // Dữ liệu và tùy chọn cho biểu đồ cột
  const chartData = {
    labels: Object.keys(monthlyStats),
    datasets: [
      {
        label: `Lương thực nhận (Ngạch: ${ngachLuong || 'N/A'}, Bậc: ${bacLuong || 'N/A'})`,
        data: Object.values(monthlyStats),
        backgroundColor: 'rgba(54, 162, 235, 0.7)', // Màu xanh dương nhạt
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2,
        hoverBackgroundColor: 'rgba(54, 162, 235, 0.9)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Cho phép điều chỉnh chiều cao
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: { size: 14, family: 'Arial' },
          color: '#333',
        },
      },
      title: {
        display: true,
        text: 'Biểu đồ lương theo tháng',
        font: { size: 20, family: 'Arial', weight: 'bold' },
        color: '#333',
        padding: 20,
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.parsed.y.toLocaleString('vi-VN')} VNĐ`,
        },
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: { size: 14 },
        bodyFont: { size: 12 },
      },
    },
    scales: {
      x: {
        ticks: {
          font: { size: 12, family: 'Arial' },
          color: '#555',
        },
        grid: { display: false }, // Ẩn lưới trục X
      },
      y: {
        beginAtZero: true,
        ticks: {
          font: { size: 12, family: 'Arial' },
          color: '#555',
          callback: (value) => `${value.toLocaleString('vi-VN')} VNĐ`,
        },
        grid: { color: 'rgba(200, 200, 200, 0.3)' }, // Lưới nhạt
      },
    },
  };

  return (
    <Container className="mt-4">
      <h1 className="text-center my-4">Trang chủ</h1>

      {/* Biểu đồ cột */}
      <Row className="mb-3 d-flex justify-content-between align-items-center">
        <Col>
          <h2>Biểu đồ lương theo tháng</h2>
        </Col>
      </Row>
      <Row>
        <Col>
          {Object.keys(monthlyStats).length === 0 ? (
            <p>Không có dữ liệu để hiển thị biểu đồ.</p>
          ) : (
            <div style={{ height: '400px' }}>
              <Bar data={chartData} options={chartOptions} />
            </div>
          )}
        </Col>
      </Row>

      {/* Danh sách phiếu lương */}
      <Row className="mb-3 d-flex justify-content-between align-items-center mt-4">
        <Col>
          <h2>Danh sách phiếu lương</h2>
        </Col>
      </Row>
      <Row>
        <Col>
          {phieuLuongList.length === 0 ? (
            <p>Không có phiếu lương nào để hiển thị.</p>
          ) : (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Phiếu lương</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {phieuLuongList.map((phieu, index) => {
                  const date = new Date(phieu.ngayPhat);
                  const monthYear = `Tháng ${date.getMonth() + 1} ${date.getFullYear()}`;
                  return (
                    <tr key={phieu.id || index}>
                      <td>{index + 1}</td>
                      <td>
                        Phiếu lương {monthYear} -{' '}
                        {phieu.luongNhan.toLocaleString('vi-VN')} VNĐ
                      </td>
                      <td>
                        <Button
                          variant="info"
                          size="sm"
                          onClick={() => handleShowModal(phieu)}
                        >
                          Xem
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          )}
        </Col>
      </Row>

      {/* Modal chi tiết phiếu lương */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Chi tiết phiếu lương</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPhieuLuong && (
            <div>
              <p>
                <strong>Ngày phát:</strong>{' '}
                {new Date(selectedPhieuLuong.ngayPhat).toLocaleDateString('vi-VN')}
              </p>
              <p>
                <strong>Lương cơ bản:</strong>{' '}
                {selectedPhieuLuong.luongCoBan.toLocaleString('vi-VN')} VNĐ
              </p>
              <p>
                <strong>Lương tăng ca:</strong>{' '}
                {selectedPhieuLuong.luongTangCa.toLocaleString('vi-VN')} VNĐ
              </p>
              <p>
                <strong>Tổng thu nhập:</strong>{' '}
                {selectedPhieuLuong.tongThuNhap.toLocaleString('vi-VN')} VNĐ
              </p>
              <p>
                <strong>Tổng khấu trừ:</strong>{' '}
                {selectedPhieuLuong.tongKhauTru.toLocaleString('vi-VN')} VNĐ
              </p>
              <p>
                <strong>Ứng lương:</strong>{' '}
                {selectedPhieuLuong.ungLuong.toLocaleString('vi-VN')} VNĐ
              </p>
              <p>
                <strong>Lương nhận:</strong>{' '}
                {selectedPhieuLuong.luongNhan.toLocaleString('vi-VN')} VNĐ
              </p>
              <p>
                <strong>Nợ:</strong>{' '}
                {selectedPhieuLuong.no.toLocaleString('vi-VN')} VNĐ
              </p>
              <p>
                <strong>Trạng thái:</strong> {selectedPhieuLuong.trangThai}
              </p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Container>
  );
};

export default UserHome;