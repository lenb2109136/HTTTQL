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
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import * as XLSX from 'xlsx';

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
  const [totalSalaryMonthYear, setTotalSalaryMonthYear] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });
  const [deductionRatioMonthYear, setDeductionRatioMonthYear] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });
  const [salaryVsDeductionMonthYear, setSalaryVsDeductionMonthYear] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });
  const [monthlySalaryYear, setMonthlySalaryYear] = useState(new Date().getFullYear());
  const [monthYearOptions, setMonthYearOptions] = useState([]); // Danh sách tháng/năm từ phiếu lương
  const [availableYears, setAvailableYears] = useState([]); // Các năm có trong phiếu lương
  const [totalPayrollCostLabels, setTotalPayrollCostLabels] = useState([]); // Nhãn cho "Tổng chi phí lương theo thời gian"
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportType, setReportType] = useState('salaryByDepartment');
  const [selectedReportMonthYear, setSelectedReportMonthYear] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchStats();
    fetchChartData();
  }, [
    totalSalaryMonthYear,
    deductionRatioMonthYear,
    salaryVsDeductionMonthYear,
    monthlySalaryYear,
  ]);

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

      // Lấy các tháng/năm từ phieuLuongData
      const monthYearSet = new Set();
      phieuLuongData.forEach(item => {
        const date = new Date(item.ngayPhat);
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        if (year < currentYear || (year === currentYear && month <= currentMonth)) {
          monthYearSet.add(`${month} - ${year}`);
        }
      });
      const monthYearArray = [...monthYearSet]
        .map(item => {
          const [month, year] = item.split(' - ').map(Number);
          return { month, year };
        })
        .sort((a, b) => {
          if (a.year === b.year) return a.month - b.month;
          return a.year - b.year;
        });
      setMonthYearOptions(monthYearArray);

      // Lấy các năm có trong phiếu lương
      const years = [...new Set(phieuLuongData.map(item => new Date(item.ngayPhat).getFullYear()))].sort();
      setAvailableYears(years);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchChartData = async () => {
    try {
      const phieuLuongResponse = await fetch('http://localhost:8080/api/phieu-luong/all');
      const phieuLuongData = await phieuLuongResponse.json();
      const nhanVienResponse = await fetch('http://localhost:8080/api/nhanvien');
      const nhanVienData = await nhanVienResponse.json();

      // 1. Tổng lương theo phòng ban
      const filteredByTotalSalary = phieuLuongData.filter(item => {
        const date = new Date(item.ngayPhat);
        return date.getMonth() + 1 === totalSalaryMonthYear.month && date.getFullYear() === totalSalaryMonthYear.year;
      });
      const salaryByDepartment = filteredByTotalSalary.reduce((acc, item) => {
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
              text: `Tổng lương theo phòng ban (Tháng ${totalSalaryMonthYear.month}/${totalSalaryMonthYear.year})`,
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

      // 2. Tỷ lệ khấu trừ và thu nhập
      const filteredByDeductionRatio = phieuLuongData.filter(item => {
        const date = new Date(item.ngayPhat);
        return date.getMonth() + 1 === deductionRatioMonthYear.month && date.getFullYear() === deductionRatioMonthYear.year;
      });
      const totalIncome = filteredByDeductionRatio.reduce(
        (sum, item) => sum + (item.tongThuNhap || 0),
        0
      );
      const totalDeduction = filteredByDeductionRatio.reduce(
        (sum, item) => sum + (item.tongKhauTru || 0),
        0
      );
      setDeductionRatioData({
        labels: ['Khấu trừ', 'Thu nhập thực nhận'],
        datasets: [
          {
            data: [totalDeduction, totalIncome - totalDeduction],
            backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)'],
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
              text: `Tỷ lệ khấu trừ và thu nhập (Tháng ${deductionRatioMonthYear.month}/${deductionRatioMonthYear.year})`,
            },
            tooltip: {
              callbacks: {
                label: context => {
                  const value = context.raw.toLocaleString('vi-VN');
                  const total = context.dataset.data.reduce((sum, val) => sum + val, 0);
                  const percentage = ((context.raw / total) * 100).toFixed(1);
                  return `${context.label}: ${value} VND (${percentage}%)`;
                },
              },
            },
            datalabels: {
              formatter: (value, context) => {
                const total = context.dataset.data.reduce((sum, val) => sum + val, 0);
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
            backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b'],
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

      // 4. Lương thực nhận và khấu trừ theo phòng ban
      const filteredBySalaryVsDeduction = phieuLuongData.filter(item => {
        const date = new Date(item.ngayPhat);
        return (
          date.getMonth() + 1 === salaryVsDeductionMonthYear.month &&
          date.getFullYear() === salaryVsDeductionMonthYear.year
        );
      });
      const salaryVsDeduction = filteredBySalaryVsDeduction.reduce(
        (acc, item) => {
          const deptName = item?.nvId?.PB_ID?.PB_TEN || 'Không xác định';
          acc[deptName] = {
            salary: (acc[deptName]?.salary || 0) + (item.luongNhan || 0),
            deduction: (acc[deptName]?.deduction || 0) + (item.tongKhauTru || 0),
          };
          return acc;
        },
        {}
      );
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
              text: `Lương thực nhận và khấu trừ theo phòng ban (Tháng ${salaryVsDeductionMonthYear.month}/${salaryVsDeductionMonthYear.year})`,
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

      // 5. Tổng chi phí lương theo thời gian
      const currentYearData = phieuLuongData.filter(item => {
        const date = new Date(item.ngayPhat);
        return date.getFullYear() === totalSalaryMonthYear.year;
      });
      const monthlyPayroll = Array(12).fill(0);
      currentYearData.forEach(item => {
        const date = new Date(item.ngayPhat);
        const month = date.getMonth();
        if (month < totalSalaryMonthYear.month)
          monthlyPayroll[month] += item.luongNhan || 0;
      });
      const labels = Array.from(
        { length: totalSalaryMonthYear.month },
        (_, i) => `Tháng ${i + 1}`
      );
      setTotalPayrollCostLabels(labels);
      setTotalPayrollCostData({
        labels: labels,
        datasets: [
          {
            label: 'Tổng chi phí lương',
            data: monthlyPayroll.slice(0, totalSalaryMonthYear.month),
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
              text: `Tổng chi phí lương từ tháng 1 đến tháng ${totalSalaryMonthYear.month} (${totalSalaryMonthYear.year})`,
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

      // 6. Tổng lương theo tháng
      const filteredByYear = phieuLuongData.filter(item => {
        const date = new Date(item.ngayPhat);
        return date.getFullYear() === monthlySalaryYear;
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
          'Th