import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form } from 'react-bootstrap';
import { Bar, Pie, Doughnut, Line } from 'react-chartjs-2';
import './admin-style/Dashboard.css';
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
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBuilding,
  faUsers,
  faMoneyBillWave,
  faHandHoldingUsd,
  faExclamationTriangle,
} from '@fortawesome/free-solid-svg-icons';

// Register Chart.js components and plugins
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement,
  ChartDataLabels
);

const AdminDashboard = () => {
  const [totalSalaryData, setTotalSalaryData] = useState(null);
  const [deductionRatioData, setDeductionRatioData] = useState(null);
  const [employeeCountData, setEmployeeCountData] = useState(null);
  const [salaryVsDeductionData, setSalaryVsDeductionData] = useState(null);
  const [totalPayrollCostData, setTotalPayrollCostData] = useState(null);
  const [monthlySalaryData, setMonthlySalaryData] = useState(null);
  const [stats, setStats] = useState({
    phongBanCount: 0,
    nhanVienCount: 0,
    totalSalary: 0,
    ungLuongCount: 0,
    khieuNaiCount: 0,
  });
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Default to current year
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Default to current month (1-12)
  const [availableYears, setAvailableYears] = useState([]); // List of years with data

  useEffect(() => {
    fetchStats();
    fetchChartData();
  }, [selectedYear, selectedMonth]); // Re-fetch data when year or month changes

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

      const totalSalary = phieuLuongData.reduce(
        (sum, item) => sum + (item.luongNhan || 0),
        0
      );

      setStats({
        phongBanCount: Array.isArray(phongBanData) ? phongBanData.length : 0,
        nhanVienCount: Array.isArray(nhanVienData) ? nhanVienData.length : 0,
        totalSalary: totalSalary,
        ungLuongCount: Array.isArray(ungLuongData) ? ungLuongData.length : 0,
        khieuNaiCount: Array.isArray(khieuNaiData) ? khieuNaiData.length : 0,
      });

      // Extract available years from phieuLuongData for the dropdown
      const years = [
        ...new Set(
          phieuLuongData.map(item => new Date(item.ngayPhat).getFullYear())
        ),
      ].sort();
      setAvailableYears(years);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchChartData = async () => {
    try {
      const phieuLuongResponse = await fetch(
        'http://localhost:8080/api/phieu-luong/all'
      );
      const phieuLuongData = await phieuLuongResponse.json();
      const ungLuongResponse = await fetch(
        'http://localhost:8080/api/ung-luong'
      );
      const ungLuongData = await ungLuongResponse.json();
      const nhanVienResponse = await fetch(
        'http://localhost:8080/api/nhanvien'
      );
      const nhanVienData = await nhanVienResponse.json();

      // Filter phieuLuongData by selected month for "Tổng lương theo phòng ban" and "Tỷ lệ khấu trừ và thu nhập"
      const filteredByMonth = phieuLuongData.filter(item => {
        const date = new Date(item.ngayPhat);
        return date.getMonth() + 1 === selectedMonth;
      });

      // 1. Total Salary by Department (Bar Chart) - Filtered by Month
      const salaryByDepartment = filteredByMonth.reduce((acc, item) => {
        const deptName = item?.nvId?.PB_ID?.PB_TEN || 'Không xác định';
        acc[deptName] = (acc[deptName] || 0) + (item.luongNhan || 0);
        return acc;
      }, {});
      setTotalSalaryData({
        labels: Object.keys(salaryByDepartment),
        datasets: [
          {
            label: 'Tổng lương thực nhận',
            data: Object.values(salaryByDepartment),
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
          },
        ],
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: 'Số tiền (VND)' },
              ticks: {
                callback: value => value.toLocaleString('vi-VN'),
              },
            },
            x: { title: { display: true, text: 'Phòng ban' } },
          },
          plugins: {
            legend: { position: 'top' },
            title: {
              display: true,
              text: `Tổng lương theo phòng ban (Tháng ${selectedMonth})`,
            },
            datalabels: {
              anchor: 'end',
              align: 'top',
              formatter: value => value.toLocaleString('vi-VN'),
              color: '#000',
              font: { size: 12 },
            },
          },
        },
      });

      // 2. Deduction Ratio (Pie Chart) - Filtered by Month
      const totalIncome = filteredByMonth.reduce(
        (sum, item) => sum + (item.tongThuNhap || 0),
        0
      );
      const totalDeduction = filteredByMonth.reduce(
        (sum, item) => sum + (item.tongKhauTru || 0),
        0
      );
      setDeductionRatioData({
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
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top' },
            title: {
              display: true,
              text: `Tỷ lệ khấu trừ và thu nhập (Tháng ${selectedMonth})`,
            },
            tooltip: {
              enabled: true,
              callbacks: {
                label: context => {
                  const value = context.raw.toLocaleString('vi-VN');
                  const total = context.dataset.data.reduce(
                    (sum, val) => sum + val,
                    0
                  );
                  const percentage = ((context.raw / total) * 100).toFixed(1);
                  return `${context.label}: ${value} VND (${percentage}%)`;
                },
              },
            },
            datalabels: {
              formatter: (value, context) => {
                const total = context.dataset.data.reduce(
                  (sum, val) => sum + val,
                  0
                );
                const percentage = ((value / total) * 100).toFixed(1);
                return `${percentage}%`;
              },
              color: '#fff',
              font: { size: 14, weight: 'bold' },
            },
          },
        },
      });

      // 3. Employee Count by Department (Doughnut Chart) - Not filtered by month
      const employeeByDepartment = nhanVienData.reduce((acc, item) => {
        const deptName = item?.PB_ID?.PB_TEN || 'Không xác định';
        acc[deptName] = (acc[deptName] || 0) + 1;
        return acc;
      }, {});
      setEmployeeCountData({
        labels: Object.keys(employeeByDepartment),
        datasets: [
          {
            data: Object.values(employeeByDepartment),
            backgroundColor: [
              '#4e73df',
              '#1cc88a',
              '#36b9cc',
              '#f6c23e',
              '#e74a3b',
            ],
            borderColor: ['#ffffff'],
            borderWidth: 2,
          },
        ],
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Số nhân viên theo phòng ban' },
            datalabels: {
              formatter: value => value.toLocaleString('vi-VN'),
              color: '#fff',
              font: { size: 14, weight: 'bold' },
            },
          },
        },
      });

      // 4. Salary vs Deduction by Department (Grouped Bar Chart) - Not filtered by month
      const salaryVsDeduction = phieuLuongData.reduce((acc, item) => {
        const deptName = item?.nvId?.PB_ID?.PB_TEN || 'Không xác định';
        acc[deptName] = {
          salary: (acc[deptName]?.salary || 0) + (item.luongNhan || 0),
          deduction: (acc[deptName]?.deduction || 0) + (item.tongKhauTru || 0),
        };
        return acc;
      }, {});
      setSalaryVsDeductionData({
        labels: Object.keys(salaryVsDeduction),
        datasets: [
          {
            label: 'Lương thực nhận',
            data: Object.values(salaryVsDeduction).map(item => item.salary),
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
          },
          {
            label: 'Khấu trừ',
            data: Object.values(salaryVsDeduction).map(item => item.deduction),
            backgroundColor: 'rgba(255, 99, 132, 0.6)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
          },
        ],
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: 'Số tiền (VND)' },
              ticks: {
                callback: value => value.toLocaleString('vi-VN'),
              },
            },
            x: { title: { display: true, text: 'Phòng ban' } },
          },
          plugins: {
            legend: { position: 'top' },
            title: {
              display: true,
              text: 'Lương thực nhận và khấu trừ theo phòng ban',
            },
            datalabels: {
              anchor: 'end',
              align: 'top',
              formatter: value => value.toLocaleString('vi-VN'),
              color: '#000',
              font: { size: 12 },
            },
          },
        },
      });

      // 5. Total Payroll Cost Over Time (Line Chart) - Not filtered by month
      const monthlyPayroll = phieuLuongData.reduce((acc, item) => {
        const date = new Date(item.ngayPhat).toLocaleString('default', {
          month: 'short',
          year: 'numeric',
        });
        acc[date] = (acc[date] || 0) + (item.luongNhan || 0);
        return acc;
      }, {});
      setTotalPayrollCostData({
        labels: Object.keys(monthlyPayroll),
        datasets: [
          {
            label: 'Tổng chi phí lương',
            data: Object.values(monthlyPayroll),
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            fill: true,
            tension: 0.3,
          },
        ],
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: 'Số tiền (VND)' },
              ticks: {
                callback: value => value.toLocaleString('vi-VN'),
              },
            },
            x: { title: { display: true, text: 'Thời gian' } },
          },
          plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Tổng chi phí lương theo thời gian' },
            datalabels: {
              anchor: 'end',
              align: 'top',
              formatter: value => value.toLocaleString('vi-VN'),
              color: '#000',
              font: { size: 12 },
            },
          },
        },
      });

      // 6. Monthly Salary Bar Chart - Filtered by Year
      const filteredByYear = phieuLuongData.filter(item => {
        const date = new Date(item.ngayPhat);
        return date.getFullYear() === selectedYear;
      });

      const monthlySalary = Array(12).fill(0);
      filteredByYear.forEach(item => {
        const date = new Date(item.ngayPhat);
        const month = date.getMonth();
        monthlySalary[month] += item.luongNhan || 0;
      });

      setMonthlySalaryData({
        labels: [
          'Tháng 1',
          'Tháng 2',
          'Tháng 3',
          'Tháng 4',
          'Tháng 5',
          'Tháng 6',
          'Tháng 7',
          'Tháng 8',
          'Tháng 9',
          'Tháng 10',
          'Tháng 11',
          'Tháng 12',
        ],
        datasets: [
          {
            label: 'Tổng lương theo tháng',
            data: monthlySalary,
            backgroundColor: 'rgba(153, 102, 255, 0.6)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 1,
          },
        ],
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: 'Số tiền (VND)' },
              ticks: {
                callback: value => value.toLocaleString('vi-VN'),
              },
            },
            x: { title: { display: true, text: 'Tháng' } },
          },
          plugins: {
            legend: { position: 'top' },
            title: {
              display: true,
              text: `Tổng lương theo tháng (Năm ${selectedYear})`,
            },
            datalabels: {
              anchor: 'end',
              align: 'top',
              formatter: value => value.toLocaleString('vi-VN'),
              color: '#000',
              font: { size: 12 },
            },
          },
        },
      });
    } catch (error) {
      console.error('Error fetching chart data:', error);
    }
  };

  // Check if there is data for the selected year in "Tổng lương theo tháng"
  const hasDataForSelectedYear = monthlySalaryData?.datasets[0]?.data.some(
    value => value > 0
  );

  return (
    <Container fluid className="p-4 bg-light min-vh-100">
      <h1 className="text-center my-4 text-gray-800">
        Trang chủ - Quản lý lương
      </h1>
      <h5 className="text-center mb-4 text-gray-600">
        Chào mừng! Đây là tổng quan hệ thống của bạn.
      </h5>

      {/* Quick Stats */}
      <Row className="mb-5 g-3">
        {[
          {
            title: 'Số phòng ban',
            value: stats.phongBanCount,
            icon: faBuilding,
            className: 'border-left-primary',
            iconColor: '#4e73df',
          },
          {
            title: 'Số nhân viên',
            value: stats.nhanVienCount,
            icon: faUsers,
            className: 'border-left-success',
            iconColor: '#1cc88a',
          },
          {
            title: 'Tổng lương',
            value: stats.totalSalary.toLocaleString() + ' VND',
            icon: faMoneyBillWave,
            className: 'border-left-info',
            iconColor: '#36b9cc',
          },
          {
            title: 'Yêu cầu ứng lương',
            value: stats.ungLuongCount,
            icon: faHandHoldingUsd,
            className: 'border-left-warning',
            iconColor: '#f6c23e',
          },
          {
            title: 'Số khiếu nại',
            value: stats.khieuNaiCount,
            icon: faExclamationTriangle,
            className: 'border-left-danger',
            iconColor: '#e74a3b',
          },
        ].map((stat, index) => (
          <Col xs={12} sm={6} md={4} lg={2} key={index}>
            <Card
              className={`stat-card shadow-sm rounded-3 border-0 h-100 ${stat.className}`}
            >
              <Card.Body className="d-flex align-items-center py-2 px-3">
                <div className="flex-grow-1">
                  <div className="stat-title text-uppercase mb-1 text-gray-600">
                    {stat.title}
                  </div>
                  <div className="stat-value text-gray-800">{stat.value}</div>
                </div>
                <FontAwesomeIcon
                  icon={stat.icon}
                  size="lg"
                  style={{ color: stat.iconColor }}
                  className="ms-2"
                />
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Charts */}
      <Row className="g-4">
        {/* Month Selection Dropdown for "Tổng lương theo phòng ban" and "Tỷ lệ khấu trừ và thu nhập" */}
        <Col md={12} className="mb-3">
          <Form.Group controlId="monthSelect">
            <Form.Label>Chọn tháng:</Form.Label>
            <Form.Control
              as="select"
              value={selectedMonth}
              onChange={e => setSelectedMonth(parseInt(e.target.value))}
              style={{ width: '200px' }}
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                <option key={month} value={month}>
                  Tháng {month}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Col>

        {/* Biểu đồ Tổng lương theo phòng ban */}
        <Col md={12}>
          <Card className="shadow border-0 rounded-3 chart-card h-100">
            <Card.Header className="py-3 bg-white border-bottom">
              <h6 className="m-0 stat-title text-primary">
                Tổng lương theo phòng ban (Tháng {selectedMonth})
              </h6>
            </Card.Header>
            <Card.Body className="chart-body">
              {totalSalaryData ? (
                <Bar
                  data={totalSalaryData}
                  options={totalSalaryData.options}
                  height={300}
                />
              ) : (
                <p>Đang tải...</p>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Hai biểu đồ tròn trong cùng một hàng */}
        <Col md={6}>
          <Card className="shadow border-0 rounded-3 chart-card h-100">
            <Card.Header className="py-3 bg-white border-bottom">
              <h6 className="m-0 stat-title text-primary">
                Tỷ lệ khấu trừ và thu nhập (Tháng {selectedMonth})
              </h6>
            </Card.Header>
            <Card.Body className="chart-body">
              {deductionRatioData ? (
                <Pie
                  data={deductionRatioData}
                  options={deductionRatioData.options}
                  height={300}
                />
              ) : (
                <p>Đang tải...</p>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="shadow border-0 rounded-3 chart-card h-100">
            <Card.Header className="py-3 bg-white border-bottom">
              <h6 className="m-0 stat-title text-primary">
                Số nhân viên theo phòng ban
              </h6>
            </Card.Header>
            <Card.Body className="chart-body">
              {employeeCountData ? (
                <Doughnut
                  data={employeeCountData}
                  options={employeeCountData.options}
                  height={300}
                />
              ) : (
                <p>Đang tải...</p>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Biểu đồ Tổng chi phí lương theo thời gian */}
        <Col md={12}>
          <Card className="shadow border-0 rounded-3 chart-card h-100">
            <Card.Header className="py-3 bg-white border-bottom">
              <h6 className="m-0 stat-title text-primary">
                Tổng chi phí lương theo thời gian
              </h6>
            </Card.Header>
            <Card.Body className="chart-body">
              {totalPayrollCostData ? (
                <Line
                  data={totalPayrollCostData}
                  options={totalPayrollCostData.options}
                  height={300}
                />
              ) : (
                <p>Đang tải...</p>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Year Selection Dropdown for "Tổng lương theo tháng" */}
        <Col md={12} className="mb-3">
          <Form.Group controlId="yearSelect">
            <Form.Label>Chọn năm:</Form.Label>
            <Form.Control
              as="select"
              value={selectedYear}
              onChange={e => setSelectedYear(parseInt(e.target.value))}
              style={{ width: '200px' }}
            >
              {availableYears.map(year => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Col>

        {/* Biểu đồ Tổng lương theo tháng */}
        {hasDataForSelectedYear && (
          <Col md={12}>
            <Card className="shadow border-0 rounded-3 chart-card h-100">
              <Card.Header className="py-3 bg-white border-bottom">
                <h6 className="m-0 stat-title text-primary">
                  Tổng lương theo tháng (Năm {selectedYear})
                </h6>
              </Card.Header>
              <Card.Body className="chart-body">
                {monthlySalaryData ? (
                  <Bar
                    data={monthlySalaryData}
                    options={monthlySalaryData.options}
                    height={300}
                  />
                ) : (
                  <p>Đang tải...</p>
                )}
              </Card.Body>
            </Card>
          </Col>
        )}

        {/* Biểu đồ Lương thực nhận và khấu trừ theo phòng ban */}
        <Col md={12}>
          <Card className="shadow border-0 rounded-3 chart-card h-100">
            <Card.Header className="py-3 bg-white border-bottom">
              <h6 className="m-0 stat-title text-primary">
                Lương thực nhận và khấu trừ theo phòng ban
              </h6>
            </Card.Header>
            <Card.Body className="chart-body">
              {salaryVsDeductionData ? (
                <Bar
                  data={salaryVsDeductionData}
                  options={salaryVsDeductionData.options}
                  height={300}
                />
              ) : (
                <p>Đang tải...</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;
