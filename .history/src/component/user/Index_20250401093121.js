import React, { useState, useEffect } from 'react';
import { Container, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserHome = () => {
  const [phieuLuong, setPhieuLuong] = useState([]);
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const API_URL = 'http://localhost:8080/api';
  const employeeId = localStorage.getItem('employeeId');

  useEffect(() => {
    if (!employeeId) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Lấy thông tin nhân viên
        const employeeResponse = await axios.get(
          `${API_URL}/nhanvien/${employeeId}`
        );
        setEmployee(employeeResponse.data);

        // Lấy danh sách phiếu lương
        const phieuLuongResponse = await axios.get(
          `${API_URL}/phieu-luong?employeeId=${employeeId}`
        );
        setPhieuLuong(phieuLuongResponse.data);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error);
        if (error.response) {
          setError(
            `Lỗi từ server: ${error.response.status} - ${
              error.response.data.message || error.message
            }`
          );
          toast.error(
            `Lỗi từ server: ${error.response.status} - ${
              error.response.data.message || error.message
            }`
          );
        } else if (error.request) {
          setError(
            'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng hoặc server.'
          );
          toast.error(
            'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng hoặc server.'
          );
        } else {
          setError(`Lỗi: ${error.message}`);
          toast.error(`Lỗi: ${error.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [employeeId, navigate]);

  if (loading) {
    return (
      <Container
        className="py-4"
        style={{ marginLeft: '250px', paddingTop: '60px' }}
      >
        <h1 className="text-center mb-4">Trang Nhân Viên</h1>
        <p className="text-center mb-4">Đang tải dữ liệu...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container
        className="py-4"
        style={{ marginLeft: '250px', paddingTop: '60px' }}
      >
        <h1 className="text-center mb-4">Trang Nhân Viên</h1>
        <p className="text-center mb-4 text-danger">{error}</p>
      </Container>
    );
  }
};

export default UserHome;
