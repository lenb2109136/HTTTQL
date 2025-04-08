import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Modal,
} from 'react-bootstrap';
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
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Tháng hiện tại
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Năm hiện tại
  const [availableYears, setAvailableYears] = useState([]); // Các năm có trong phiếu lương
  const [totalPayrollCostLabels, setTotalPayrollCostLabels] = useState([]); // Nhãn cho "Tổng chi phí lương theo thời gian"
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportType, setReportType] = useState('salaryByDepartment');
  const [startMonth, setStartMonth] = useState(1);
  const [endMonth, setEndMonth] = useState(new Date().getMonth() + 1);
  const [startYear, setStartYear] = useState(new Date().getFullYear());
  const [endYear, setEndYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchStats();
    fetchChartData();
  }, [selectedMonth, selectedYear]); // Cập nhật khi tháng hoặc năm thay đổi

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

      // Lấy các năm có trong phiếu lương
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
      const nhanVienResponse = await fetch(
        'http://localhost:8080/api/nhanvien'
      );
      const nhanVienData = await nhanVienResponse.json();

      // 1. Tổng lương theo phòng ban (lọc theo tháng hiện tại)
      const filteredByMonth = phieuLuongData.filter(item => {
        const date = new Date(item.ngayPhat);
        return (
          date.getMonth() + 1 === selectedMonth &&
          date.getFullYear() === selectedYear
        );
      });
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
              ticks: { callback: value => value.toLocaleString('vi-VN') },
            },
            x: { title: { display: true, text: 'Phòng ban' } },
          },
          plugins: {
            legend: { position: 'top' },
            title: {
              display: true,
              text: `Tổng lương theo phòng ban (Tháng ${selectedMonth}/${selectedYear})`,
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

      // 2. Tỷ lệ khấu trừ và thu nhập (lọc theo tháng hiện tại)
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
              text: `Tỷ lệ khấu trừ và thu nhập (Tháng ${selectedMonth}/${selectedYear})`,
            },
            tooltip: {
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

      // 3. Số nhân viên theo phòng ban
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

      // 4. Lương thực nhận và khấu trừ theo phòng ban (lọc theo tháng hiện tại)
      const salaryVsDeduction = filteredByMonth.reduce((acc, item) => {
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
              ticks: { callback: value => value.toLocaleString('vi-VN') },
            },
            x: { title: { display: true, text: 'Phòng ban' } },
          },
          plugins: {
            legend: { position: 'top' },
            title: {
              display: true,
              text: `Lương thực nhận và khấu trừ theo phòng ban (Tháng ${selectedMonth}/${selectedYear})`,
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

      // 5. Tổng chi phí lương theo thời gian (từ tháng 1 đến tháng hiện tại trong năm hiện tại)
      const currentYearData = phieuLuongData.filter(item => {
        const date = new Date(item.ngayPhat);
        return date.getFullYear() === selectedYear;
      });
      const monthlyPayroll = Array(12).fill(0);
      currentYearData.forEach(item => {
        const date = new Date(item.ngayPhat);
        const month = date.getMonth();
        if (month < selectedMonth) monthlyPayroll[month] += item.luongNhan || 0;
      });
      const labels = Array.from(
        { length: selectedMonth },
        (_, i) => `Tháng ${i + 1}`
      );
      setTotalPayrollCostLabels(labels);
      setTotalPayrollCostData({
        labels: labels,
        datasets: [
          {
            label: 'Tổng chi phí lương',
            data: monthlyPayroll.slice(0, selectedMonth),
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
              ticks: { callback: value => value.toLocaleString('vi-VN') },
            },
            x: { title: { display: true, text: 'Tháng trong năm' } },
          },
          plugins: {
            legend: { position: 'top' },
            title: {
              display: true,
              text: `Tổng chi phí lương từ tháng 1 đến tháng ${selectedMonth} (${selectedYear})`,
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

      // 6. Tổng lương theo tháng (lọc theo năm đã chọn)
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
              ticks: { callback: value => value.toLocaleString('vi-VN') },
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

  // Kiểm tra dữ liệu
  const hasDataForSelectedMonth = totalSalaryData?.datasets[0]?.data.some(
    value => value > 0
  );
  const hasDataForSelectedYear = monthlySalaryData?.datasets[0]?.data.some(
    value => value > 0
  );

  const handleGenerateReport = () => {
    // Logic xuất file Excel (giả lập)
    console.log(
      `Generating report of type: ${reportType} from ${startMonth}/${startYear} to ${endMonth}/${endYear}`
    );
    // Thêm logic thực tế để xuất file Excel (sử dụng thư viện như xlsx hoặc file-saver)
    setShowReportModal(false);
  };

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

      {/* Nút tạo báo cáo */}
      <div className="mb-4 text-end">
        <Button variant="primary" onClick={() => setShowReportModal(true)}>
          Tạo báo cáo
        </Button>
      </div>

      {/* Charts */}
      <Row className="g-4">
        {/* Biểu đồ Tổng lương theo phòng ban với dropdown trong header */}
        {hasDataForSelectedMonth && (
          <Col md={12}>
            <Card className="shadow border-0 rounded-3 chart-card h-100">
              <Card.Header className="py-3 bg-white border-bottom d-flex justify-content-between align-items-center">
                <h6 className="m-0 stat-title text-primary">
                  Tổng lương theo phòng ban
                </h6>
                <div>
                  <Form.Group controlId="monthSelect" className="me-2">
                    <Form.Control
                      as="select"
                      value={selectedMonth}
                      onChange={e => setSelectedMonth(parseInt(e.target.value))}
                      style={{ width: '100px' }}
                    >
                      {Array.from(
                        { length: new Date().getMonth() + 1 },
                        (_, i) => i + 1
                      ).map(month => (
                        <option key={month} value={month}>
                          {month}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                  <Form.Group controlId="yearSelect">
                    <Form.Control
                      as="select"
                      value={selectedYear}
                      onChange={e => setSelectedYear(parseInt(e.target.value))}
                      style={{ width: '100px' }}
                    >
                      {availableYears.map(year => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                </div>
              </Card.Header>
              <Card.Body className="chart-body">
                {totalSalaryData ? (
                  <Bar
                    data={totalSalaryData}
                    options={{
                      ...totalSalaryData.options,
                      plugins: {
                        ...totalSalaryData.options.plugins,
                        title: {
                          display: true,
                          text: `Tổng lương theo phòng ban (Tháng ${selectedMonth}/${selectedYear})`,
                        },
                      },
                    }}
                    height={300}
                  />
                ) : (
                  <p>Đang tải...</p>
                )}
              </Card.Body>
            </Card>
          </Col>
        )}

        {/* Hai biểu đồ tròn trong cùng một hàng */}
        <Row>
          {hasDataForSelectedMonth && (
            <Col md={6}>
              <Card className="shadow border-0 rounded-3 chart-card h-100">
                <Card.Header className="py-3 bg-white border-bottom">
                  <h6 className="m-0 stat-title text-primary">
                    Tỷ lệ khấu trừ và thu nhập (Tháng {selectedMonth}/
                    {selectedYear})
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
          )}
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
        </Row>

        {/* Biểu đồ Tổng chi phí lương theo thời gian */}
        <Col md={12}>
          <Card className="shadow border-0 rounded-3 chart-card h-100">
            <Card.Header className="py-3 bg-white border-bottom">
              <h6 className="m-0 stat-title text-primary">
                Tổng chi phí lương từ tháng 1 đến tháng {selectedMonth} (
                {selectedYear})
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
        {hasDataForSelectedMonth && (
          <Col md={12}>
            <Card className="shadow border-0 rounded-3 chart-card h-100">
              <Card.Header className="py-3 bg-white border-bottom">
                <h6 className="m-0 stat-title text-primary">
                  Lương thực nhận và khấu trừ theo phòng ban (Tháng{' '}
                  {selectedMonth}/{selectedYear})
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
        )}
      </Row>

      {/* Modal cho tạo báo cáo */}
      <Modal show={showReportModal} onHide={() => setShowReportModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Tạo báo cáo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Loại báo cáo</Form.Label>
              <Form.Control
                as="select"
                value={reportType}
                onChange={e => setReportType(e.target.value)}
              >
                <option value="salaryByDepartment">
                  Tổng lương theo phòng ban
                </option>
                <option value="deductionRatio">
                  Tỷ lệ khấu trừ và thu nhập
                </option>
                <option value="salaryVsDeduction">
                  Lương thực nhận và khấu trừ
                </option>
                <option value="totalPayrollCost">Tổng chi phí lương</option>
                <option value="monthlySalary">Tổng lương theo tháng</option>
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Tháng bắt đầu</Form.Label>
              <Form.Control
                type="number"
                min="1"
                max="12"
                value={startMonth}
                onChange={e => setStartMonth(parseInt(e.target.value))}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Năm bắt đầu</Form.Label>
              <Form.Control
                type="number"
                min={Math.min(...availableYears)}
                max={new Date().getFullYear()}
                value={startYear}
                onChange={e => setStartYear(parseInt(e.target.value))}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Tháng kết thúc</Form.Label>
              <Form.Control
                type="number"
                min="1"
                max="12"
                value={endMonth}
                onChange={e => setEndMonth(parseInt(e.target.value))}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Năm kết thúc</Form.Label>
              <Form.Control
                type="number"
                min={Math.min(...availableYears)}
                max={new Date().getFullYear()}
                value={endYear}
                onChange={e => setEndYear(parseInt(e.target.value))}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowReportModal(false)}>
            Đóng
          </Button>
          <Button variant="primary" onClick={handleGenerateReport}>
            Tạo báo cáo
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminDashboard;
