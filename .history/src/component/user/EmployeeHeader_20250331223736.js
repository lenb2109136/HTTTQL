import React, { useState, useEffect } from 'react';
import {
  Container,
  Table,
  Modal,
  Row,
  Col,
  Button,
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EmployeeSidebar from './EmployeeSidebar';
import EmployeeHeader from './EmployeeHeader'; // Import Header

const UserHome = () => {
  const [phieuLuong, setPhieuLuong] = useState([]);
  const [employee, setEmployee] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    NV_HOTEN: '',
    NV_EMAIL: '',
    NV_SDT: '',
    NV_DIACHI: '',
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const API_URL = 'http://localhost:8080/api';
  const employeeId = localStorage.getItem('employeeId');

  useEffect(() => {
    if (!employeeId) {
      navigate('/login');
      return;
    }

    fetchPhieuLuong();
    fetchEmployee();
  }, [employeeId, navigate]);

  const fetchPhieuLuong = async () => {
    try {
      const response = await axios.get(`${API_URL}/phieu-luong?employeeId=${employeeId}`);
      console.log('Dữ liệu phiếu lương:', response.data);
      setPhieuLuong(response.data);
    } catch (error) {
      console.error('Lỗi khi lấy phiếu lương:', error);
      toast.error('Không thể tải danh sách phiếu lương: ' + error.message);
    }
  };

  const fetchEmployee = async () => {
    try {
      const response = await axios.get(`${API_URL}/nhanvien/${employeeId}`);
      console.log('Dữ liệu nhân viên:', response.data);
      setEmployee(response.data);
      setFormData({
        NV_HOTEN: response.data.NV_HOTEN || '',
        NV_EMAIL: response.data.NV_EMAIL || '',
        NV_SDT: response.data.NV_SDT || '',
        NV_DIACHI: response.data.NV_DIACHI || '',
      });
    } catch (error) {
      console.error('Lỗi khi lấy thông tin nhân viên:', error);
      toast.error('Không thể tải thông tin nhân viên: ' + error.message);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.NV_HOTEN) {
      newErrors.NV_HOTEN = 'Họ tên là bắt buộc';
    }
    if (!formData.NV_EMAIL) {
      newErrors.NV_EMAIL = 'Email là bắt buộc';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.NV_EMAIL)) {
      newErrors.NV_EMAIL = 'Email không hợp lệ