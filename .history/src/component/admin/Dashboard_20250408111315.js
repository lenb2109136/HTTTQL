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

const EmployeesPage = () => {
  const [employees, setEmployees] = useState([]);
  const [chartType, setChartType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [chartData, setChartData] = useState(null);

  // Lấy danh sách nhân viên khi component mount
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    const response = await fetch('http://localhost:8080/api/employees');
    const data = await response.json();
    setEmployees(data);
  };

  const handleDelete = async id => {
    await fetch(`http://localhost:8080/api/employees/${id}`, {
      method: 'DELETE',
    });
    setEmployees(employees.filter(emp => emp.id !== id));
  };

  const fetchChartData = async () => {
    if (!chartType || !startDate || !endDate) {
      alert('Vui lòng chọn loại biểu đồ và khoảng thời gian!');
      return;
    }

    const response = await fetch(
      `http://localhost:8080/api/statistics?type=${chartType}&startDate=${startDate}&endDate=${endDate}`
    );
    const data = await response.json();

    let chartConfig;
    switch (chartType) {
      case 'totalSalaryByDepartment':
        chartConfig = {
          labels: data.map(item => item.department),
          datasets: [
            {
              label: 'Tổng lương thực nhận',
              data: data.map(item => item.totalSalary),
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
          ],
        };
        setChartData(<Bar data={chartConfig} />);
        break;
      case 'deductionRatio':
        chartConfig = {
          labels: ['Khấu trừ', 'Thu nhập'],
          datasets: [
            {
              data: [
                data.totalDeduction,
                data.totalIncome - data.totalDeduction,
              ],
              backgroundColor: [
                'rgba(255, 99, 132, 0.6)',
                'rgba(54, 162, 235, 0.6)',
              ],
            },
          ],
        };
        setChartData(<Pie data={chartConfig} />);
        break;
      case 'advanceTrend':
        chartConfig = {
          labels: data.map(item => item.month),
          datasets: [
            {
              label: 'Tổng ứng lương',
              data: data.map(item => item.totalAdvance),
              borderColor: 'rgba(153, 102, 255, 1)',
              fill: false,
            },
          ],
        };
        setChartData(<Line data={chartConfig} />);
        break;
      default:
        setChartData(null);
    }
  };

  return (
    <Container>
      <h1 className="text-center my-4">Quản lý lương nhân viên</h1>

      {/* Danh sách nhân viên */}
      <Row className="mb-3 d-flex justify-content-between align-items-center">
        <Col>
          <h2>Danh sách nhân viên</h2>
        </Col>
        <Col className="text-end">
          <Button variant="primary">
            <FiPlus /> Thêm nhân viên
          </Button>
        </Col>
      </Row>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>STT</th>
            <th>Tên nhân viên</th>
            <th>Số lương</th>
            <th>Thời gian nhận lương</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp, index) => (
            <tr key={emp.id}>
              <td>{index + 1}</td>
              <td>{emp.name}</td>
              <td>{emp.salary.toLocaleString()} VND</td>
              <td>{new Date(emp.payDate).toLocaleDateString()}</td>
              <td>
                <Button variant="warning" className="me-2">
                  Sửa
                </Button>
                <Button variant="danger" onClick={() => handleDelete(emp.id)}>
                  Xóa
                </Button>
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

export default EmployeesPage;
