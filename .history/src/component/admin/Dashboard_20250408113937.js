import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Card } from 'react-bootstrap';
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

// Register Chart.js components
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

// Font Awesome icons (ensure you have @fortawesome/react-fontawesome installed)
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBuilding,
  faUsers,
  faMoneyBillWave,
  faHandHoldingUsd,
  faExclamationTriangle,
} from '@fortawesome/free-solid-svg-icons';

const AdminDashboard = () => {
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );
  const [totalSalaryData, setTotalSalaryData] = useState(null);
  const [deductionRatioData, setDeductionRatioData] = useState(null);
  const [advanceTrendData, setAdvanceTrendData] = useState(null);
  const [stats, setStats] = useState({
    phongBanCount: 0,
    nhanVienCount: 0,
    totalSalary: 0,
    ungLuongCount: 0,
    khieuNaiCount: 0,
  });

  useEffect(() => {
    fetchStats();
    fetchChartData();
  }, [selectedMonth]);

  const fetchStats = async () => {
    try {
      const [
        phongBanRes,
        nhanVienRes,
        phieuLuongRes,
        ungLuongRes,
        khieuNaiRes,
      ] = await Promise.all([
        fetch('http://localhost:8080/api/phongban'),
        fetch('http://localhost:8080/api/nhanvien'),
        fetch('http://localhost:8080/api/phieu-luong/all'),
        fetch('http://localhost:8080/api/ung-luong'),
        fetch('http://localhost:8080/api/khieu-nai'),
      ]);

      const phongBanData = await phongBanRes.json();
      const nhanVienData = await nhanVienRes.json();
      const phieuLuongData = await phieuLuongRes.json();
      const ungLuongData = await ungLuongRes.json();
      const khieuNaiData = await khieuNaiRes.json();

      const [year, month] = selectedMonth.split('-');
      const startDate = `${year}-${month}-01`;
      const endDate = new Date(year, month, 0).toISOString().split('T')[0];

      const filteredPhieuLuong = phieuLuongData.filter(item => {
        const payDate = new Date(item.ngayPhat);
        return payDate >= new Date(startDate) && payDate <= new Date(endDate);
      });

      const totalSalary = filteredPhieuLuong.reduce(
        (sum, item) => sum + (item.luongNhan || 0),
        0
      );

      setStats({
        phongBanCount: phongBanData.length,
        nhanVienCount: nhanVienData.length,
        totalSalary: totalSalary,
        ungLuongCount: ungLuongData.length,
        khieuNaiCount: khieuNaiData.length,
      });
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu thống kê:', error);
    }
  };

  const fetchChartData = async () => {
    const [year, month] = selectedMonth.split('-');
    const startDate = `${year}-${month}-01`;
    const endDate = new Date(year, month, 0).toISOString().split('T')[0];

    try {
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
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      };
      setTotalSalaryData(
        <Bar
          data={totalSalaryConfig}
          options={{ maintainAspectRatio: false }}
        />
      );

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
            borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
            borderWidth: 1,
          },
        ],
      };
      setDeductionRatioData(
        <Pie
          data={deductionRatioConfig}
          options={{ maintainAspectRatio: false }}
        />
      );

      const ungLuongResponse = await fetch(
        'http://localhost:8080/api/ung-luong'
      );
      const ungLuongData = await ungLuongResponse.json();
      const filteredUngLuong = ungLuongData.filter(item => {
        const advanceDate = new Date(item.requestDate);
        return (
          advanceDate >= new Date(startDate) && advanceDate <= new Date(endDate)
        );
      });
      const monthlyData = filteredUngLuong.reduce((acc, item) => {
        const date = new Date(item.requestDate).toLocaleString('default', {
          month: 'short',
          year: 'numeric',
        });
        acc[date] = (acc[date] || 0) + (item.amount || 0);
        return acc;
      }, {});
      const advanceTrendConfig = {
        labels: Object.keys(monthlyData),
        datasets: [
          {
            label: 'Tổng ứng lương',
            data: Object.values(monthlyData),
            borderColor: 'rgba(153, 102, 255, 1)',
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            fill: true,
            tension: 0.3,
          },
        ],
      };
      setAdvanceTrendData(
        <Line
          data={advanceTrendConfig}
          options={{ maintainAspectRatio: false }}
        />
      );
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu biểu đồ:', error);
    }
  };

  return (
    <Container fluid className="p-4">
      <h1 className="text-center my-4 text-gray-800">
        Trang chủ - Quản lý lương
      </h1>

      {/* Month Filter */}
      <Row className="mb-4">
        <Col md={3}>
          <Form.Group>
            <Form.Label className="font-weight-bold text-gray-700">
              Chọn tháng
            </Form.Label>
            <Form.Control
              type="month"
              value={selectedMonth}
              onChange={e => setSelectedMonth(e.target.value)}
              className="shadow-sm"
            />
          </Form.Group>
        </Col>
      </Row>

      {/* Quick Stats */}
      <Row className="mb-4">
        <Col md={3} className="mb-4">
          <Card className="shadow h-100 py-2 border-left-primary">
            <Card.Body>
              <Row className="no-gutters align-items-center">
                <Col className="mr-2">
                  <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                    Số phòng ban
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {stats.phongBanCount}
                  </div>
                </Col>
                <Col className="col-auto">
                  <FontAwesomeIcon
                    icon={faBuilding}
                    size="2x"
                    className="text-gray-300"
                  />
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-4">
          <Card className="shadow h-100 py-2 border-left-success">
            <Card.Body>
              <Row className="no-gutters align-items-center">
                <Col className="mr-2">
                  <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                    Số nhân viên
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {stats.nhanVienCount}
                  </div>
                </Col>
                <Col className="col-auto">
                  <FontAwesomeIcon
                    icon={faUsers}
                    size="2x"
                    className="text-gray-300"
                  />
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-4">
          <Card className="shadow h-100 py-2 border-left-info">
            <Card.Body>
              <Row className="no-gutters align-items-center">
                <Col className="mr-2">
                  <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                    Tổng lương tháng
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {stats.totalSalary.toLocaleString()} VND
                  </div>
                </Col>
                <Col className="col-auto">
                  <FontAwesomeIcon
                    icon={faMoneyBillWave}
                    size="2x"
                    className="text-gray-300"
                  />
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-4">
          <Card className="shadow h-100 py-2 border-left-warning">
            <Card.Body>
              <Row className="no-gutters align-items-center">
                <Col className="mr-2">
                  <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                    Số yêu cầu ứng lương
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {stats.ungLuongCount}
                  </div>
                </Col>
                <Col className="col-auto">
                  <FontAwesomeIcon
                    icon={faHandHoldingUsd}
                    size="2x"
                    className="text-gray-300"
                  />
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-4">
          <Card className="shadow h-100 py-2 border-left-danger">
            <Card.Body>
              <Row className="no-gutters align-items-center">
                <Col className="mr-2">
                  <div className="text-xs font-weight-bold text-danger text-uppercase mb-1">
                    Số khiếu nại
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {stats.khieuNaiCount}
                  </div>
                </Col>
                <Col className="col-auto">
                  <FontAwesomeIcon
                    icon={faExclamationTriangle}
                    size="2x"
                    className="text-gray-300"
                  />
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row className="mb-5">
        <Col md={4} className="mb-4">
          <Card className="shadow border">
            <Card.Header className="py-3">
              <h6 className="m-0 font-weight-bold text-primary">
                Tổng lương theo phòng ban
              </h6>
            </Card.Header>
            <Card.Body>
              {totalSalaryData && (
                <div style={{ height: '400px', width: '100%' }}>
                  {totalSalaryData}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card className="shadow border">
            <Card.Header className="py-3">
              <h6 className="m-0 font-weight-bold text-primary">
                Tỷ lệ khấu trừ
              </h6>
            </Card.Header>
            <Card.Body>
              {deductionRatioData && (
                <div style={{ height: '400px', width: '100%' }}>
                  {deductionRatioData}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card className="shadow border">
            <Card.Header className="py-3">
              <h6 className="m-0 font-weight-bold text-primary">
                Xu hướng ứng lương
              </h6>
            </Card.Header>
            <Card.Body>
              {advanceTrendData && (
                <div style={{ height: '400px', width: '100%' }}>
                  {advanceTrendData}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

/* Add custom CSS in your stylesheet */
export default AdminDashboard;
