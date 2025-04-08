import React, { useState, useEffect } from 'react';
import { Table, Button, Container, Row, Col, Form } from 'react-bootstrap';
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

const SalaryManagementPage = () => {
  const [employees, setEmployees] = useState([]);
  const [phieuLuong, setPhieuLuong] = useState([]);
  const [chartType, setChartType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [chartData, setChartData] = useState(null);

  // Lấy dữ liệu khi component mount
  useEffect(() => {
    fetchEmployees();
    fetchAllPhieuLuong();
  }, []);

  // Lấy danh sách nhân viên
  const fetchEmployees = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/nhanvien');
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách nhân viên:', error);
    }
  };

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

  // Xử lý tạo biểu đồ
  const fetchChartData = async () => {
    if (!chartType || !startDate || !endDate) {
      alert('Vui lòng chọn loại biểu đồ và khoảng thời gian!');
      return;
    }

    let chartConfig;
    try {
      switch (chartType) {
        case 'totalSalaryByDepartment': {
          // Lấy lương theo bộ phận
          const response = await fetch(
            `http://localhost:8080/api/nhanvien/getluongnhanvienbybophan?nbd=${startDate}&nkt=${endDate}`
          );
          const { data } = await response.json();

          chartConfig = {
            labels: data.map(item => item.departmentName || 'Không xác định'),
            datasets: [
              {
                label: 'Tổng lương thực nhận',
                data: data.map(item => item.totalSalary || 0),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
              },
            ],
          };
          setChartData(<Bar data={chartConfig} />);
          break;
        }
        case 'deductionRatio': {
          // Tỷ lệ khấu trừ tổng hợp
          const response = await fetch(
            'http://localhost:8080/api/phieu-luong/all'
          );
          const data = await response.json();

          const filteredData = data.filter(item => {
            const payDate = new Date(item.ngayPhat);
            return (
              payDate >= new Date(startDate) && payDate <= new Date(endDate)
            );
          });

          const totalIncome = filteredData.reduce(
            (sum, item) => sum + (item.tongThuNhap || 0),
            0
          );
          const totalDeduction = filteredData.reduce(
            (sum, item) => sum + (item.tongKhauTru || 0),
            0
          );

          chartConfig = {
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
          setChartData(<Pie data={chartConfig} />);
          break;
        }
        case 'advanceTrend': {
          // Xu hướng ứng lương
          const response = await fetch('http://localhost:8080/api/ung-luong');
          const data = await response.json();

          const filteredData = data.filter(item => {
            const advanceDate = new Date(item.requestDate); // Giả sử có field requestDate
            return (
              advanceDate >= new Date(startDate) &&
              advanceDate <= new Date(endDate)
            );
          });

          // Nhóm theo tháng
          const monthlyData = filteredData.reduce((acc, item) => {
            const month = new Date(item.requestDate).toLocaleString('default', {
              month: 'short',
              year: 'numeric',
            });
            acc[month] = (acc[month] || 0) + (item.amount || 0); // Giả sử có field amount
            return acc;
          }, {});

          chartConfig = {
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
          setChartData(<Line data={chartConfig} />);
          break;
        }
        default:
          setChartData(null);
      }
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu biểu đồ:', error);
      alert('Không thể tạo biểu đồ do lỗi dữ liệu!');
    }
  };

  return (
    <Container>
      <h1 className="text-center my-4">Quản lý lương nhân viên</h1>

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
          {phieuLuong.map((phieu, index) => (
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

      {/* Thống kê */}
      <h2 className="mt-5">Thống kê</h2>
      <Row className="mb-3">
        <Col md={4}>
          <Form.Group>
            <Form.Label>Loại biểu đồ</Form.Label>
            <Form.Select
              value={chartType}
              onChange={e => setChartType(e.target.value)}
            >
              <option value="">Chọn loại biểu đồ</option>
              <option value="totalSalaryByDepartment">
                Tổng lương theo phòng ban
              </option>
              <option value="deductionRatio">Tỷ lệ khấu trừ</option>
              <option value="advanceTrend">Xu hướng ứng lương</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group>
            <Form.Label>Ngày bắt đầu</Form.Label>
            <Form.Control
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group>
            <Form.Label>Ngày kết thúc</Form.Label>
            <Form.Control
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col md={2} className="d-flex align-items-end">
          <Button variant="success" onClick={fetchChartData}>
            Tạo thống kê
          </Button>
        </Col>
      </Row>
      <Row>
        <Col>
          {chartData && <div style={{ height: '400px' }}>{chartData}</div>}
        </Col>
      </Row>
    </Container>
  );
};

export default SalaryManagementPage;
