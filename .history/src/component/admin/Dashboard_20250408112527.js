import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Table, Button } from 'react-bootstrap';
import { FiPlus } from 'react-icons/fi';
import { Bar, Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement,
} from 'chart.js';

// Đăng ký các thành phần của Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement
);

const AdminDashboard = () => {
  const [phieuLuong, setPhieuLuong] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  ); // Mặc định là tháng hiện tại
  const [totalSalaryData, setTotalSalaryData] = useState(null);
  const [deductionRatioData, setDeductionRatioData] = useState(null);
  const [advanceTrendData, setAdvanceTrendData] = useState(null);

  // Lấy dữ liệu khi component mount và khi thay đổi tháng
  useEffect(() => {
    fetchAllPhieuLuong();
    fetchChartData();
  }, [selectedMonth]);

  // Lấy tất cả phiếu lương
  const fetchAllPhieuLuong = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/phieu-luong/all');
      const data = await response.json();
      setPhieuLuong(data);
    } catch (error) {
      console.error('Lỗi khi lấy phiếu lương:', error);
    }
  };

  // Lấy dữ liệu cho các biểu đồ
  const fetchChartData = async () => {
    const [year, month] = selectedMonth.split('-');
    const startDate = `${year}-${month}-01`;
    const endDate = new Date(year, month, 0).toISOString().split('T')[0]; // Ngày cuối tháng

    try {
      // 1. Tổng lương theo phòng ban
      const salaryResponse = await fetch(
        `http://localhost:8080/api/nhanvien/getluongnhanvienbybophan?nbd=${startDate}&nkt=${endDate}`
      );
      const { data: salaryData } = await salaryResponse.json();
      const totalSalaryConfig = {
        labels: salaryData.map(item => item.departmentName || 'Không xác định'),
        datasets: [
          {
            label: 'Tổng lương thực nhận',
            data: salaryData.map(item => item.totalSalary || 0),
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
          },
        ],
      };
      setTotalSalaryData(<Bar data={totalSalaryConfig} />);

      // 2. Tỷ lệ khấu trừ
      const phieuLuongResponse = await fetch(
        'http://localhost:8080/api/phieu-luong/all'
      );
      const phieuLuongData = await phieuLuongResponse.json();
      const filteredPhieuLuong = phieuLuongData.filter(item => {
        const payDate = new Date(item.ngayPhat);
        return payDate >= new Date(startDate) && payDate <= new Date(endDate);
      });
      const totalIncome = filteredPhieuLuong.reduce(
        (sum, item) => sum + (item.tongThuNhap || 0),
        0
      );
      const totalDeduction = filteredPhieuLuong.reduce(
        (sum, item) => sum + (item.tongKhauTru || 0),
        0
      );
      const deductionRatioConfig = {
        labels: ['Khấu trừ', 'Thu nhập thực nhận'],
        datasets: [
          {
            data: [totalDeduction, totalIncome - totalDeduction],
            backgroundColor: [
              'rgba(255, 99, 132, 0.6)',
              'rgba(54, 162, 235, 0.6)',
            ],
          },
        ],
      };
      setDeductionRatioData(<Pie data={deductionRatioConfig} />);

      // 3. Xu hướng ứng lương
      const ungLuongResponse = await fetch(
        'http://localhost:8080/api/ung-luong'
      );
      const ungLuongData = await ungLuongResponse.json();
      const filteredUngLuong = ungLuongData.filter(item => {
        const advanceDate = new Date(item.requestDate); // Giả sử có field requestDate
        return (
          advanceDate >= new Date(startDate) && advanceDate <= new Date(endDate)
        );
      });
      const monthlyData = filteredUngLuong.reduce((acc, item) => {
        const date = new Date(item.requestDate).toLocaleString('default', {
          month: 'short',
          year: 'numeric',
        });
        acc[date] = (acc[date] || 0) + (item.amount || 0); // Giả sử có field amount
        return acc;
      }, {});
      const advanceTrendConfig = {
        labels: Object.keys(monthlyData),
        datasets: [
          {
            label: 'Tổng ứng lương',
            data: Object.values(monthlyData),
            borderColor: 'rgba(153, 102, 255, 1)',
            fill: false,
          },
        ],
      };
      setAdvanceTrendData(<Line data={advanceTrendConfig} />);
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu biểu đồ:', error);
    }
  };

  return (
    <Container fluid>
      <h1 className="text-center my-4">Trang chủ Admin - Quản lý lương</h1>

      {/* Bộ lọc tháng */}
      <Row className="mb-4">
        <Col md={3}>
          <Form.Group>
            <Form.Label>Chọn tháng</Form.Label>
            <Form.Control
              type="month"
              value={selectedMonth}
              onChange={e => setSelectedMonth(e.target.value)}
            />
          </Form.Group>
        </Col>
      </Row>

      {/* Biểu đồ */}
      <Row className="mb-5">
        <Col md={4}>
          <h3>Tổng lương theo phòng ban</h3>
          {totalSalaryData && (
            <div style={{ height: '300px' }}>{totalSalaryData}</div>
          )}
        </Col>
        <Col md={4}>
          <h3>Tỷ lệ khấu trừ</h3>
          {deductionRatioData && (
            <div style={{ height: '300px' }}>{deductionRatioData}</div>
          )}
        </Col>
        <Col md={4}>
          <h3>Xu hướng ứng lương</h3>
          {advanceTrendData && (
            <div style={{ height: '300px' }}>{advanceTrendData}</div>
          )}
        </Col>
      </Row>

      {/* Danh sách phiếu lương */}
      <Row className="mb-3 d-flex justify-content-between align-items-center">
        <Col>
          <h2>Danh sách phiếu lương</h2>
        </Col>
        <Col className="text-end">
          <Button variant="primary">
            <FiPlus /> Thêm phiếu lương
          </Button>
        </Col>
      </Row>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>STT</th>
            <th>Tên nhân viên</th>
            <th>Lương thực nhận</th>
            <th>Ngày phát</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {phieuLuong
            .filter(phieu => {
              const payDate = new Date(phieu.ngayPhat);
              const [year, month] = selectedMonth.split('-');
              return (
                payDate.getFullYear() === parseInt(year) &&
                payDate.getMonth() === parseInt(month) - 1
              );
            })
            .map((phieu, index) => (
              <tr key={phieu.id}>
                <td>{index + 1}</td>
                <td>{phieu.nvId?.NV_TEN || 'N/A'}</td>
                <td>{phieu.luongNhan?.toLocaleString()} VND</td>
                <td>{new Date(phieu.ngayPhat).toLocaleDateString()}</td>
                <td>
                  <Button variant="warning" className="me-2">
                    Sửa
                  </Button>
                  <Button variant="danger">Xóa</Button>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default AdminDashboard;
