import React, { useState, useEffect } from 'react';
import { Container, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserHome = () => {
  const [phieuLuong, setPhieuLuong] = useState([]);
  const [employee, setEmployee] = useState(null);
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
      const response = await axios.get(
        `${API_URL}/phieu-luong?employeeId=${employeeId}`
      );
      console.log('Dữ liệu phiếu lương:', response.data);
      setPhieuLuong(response.data);
    } catch (error) {
      console.error('Lỗi khi lấy phiếu lương:', error);
      toast.error('Không thể tải danh sách phiếu lương: ' + error.message, {
        position: 'top-right',
        autoClose: 4000,
      });
    }
  };

  const fetchEmployee = async () => {
    try {
      const response = await axios.get(`${API_URL}/nhanvien/${employeeId}`);
      console.log('Dữ liệu nhân viên:', response.data);
      setEmployee(response.data);
    } catch (error) {
      console.error('Lỗi khi lấy thông tin nhân viên:', error);
      toast.error('Không thể tải thông tin nhân viên: ' + error.message, {
        position: 'top-right',
        autoClose: 4000,
      });
    }
  };

  return (
    <>
      {/* Nội dung chính */}
      <Container
        className="py-4"
        style={{ marginLeft: '250px', paddingTop: '60px' }}
      >
        <h1 className="text-center mb-4">Trang Nhân Viên</h1>
        <p className="text-center mb-4">
          Chào mừng {employee ? employee.NV_HOTEN : 'bạn'} đến với trang cá nhân
          của nhân viên!
        </p>

        {/* Bảng phiếu lương */}
        <h3 className="mb-3">Danh sách phiếu lương</h3>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>STT</th>
              <th>Tháng/Năm</th>
              <th>Lương cơ bản</th>
              <th>Lương tăng ca</th>
              <th>Tổng thu nhập</th>
              <th>Tổng khấu trừ</th>
              <th>Ứng lương</th>
              <th>Lương nhận</th>
              <th>Nợ</th>
              <th>Ngày phát</th>
            </tr>
          </thead>
          <tbody>
            {phieuLuong.length === 0 ? (
              <tr>
                <td colSpan="10" className="text-center">
                  Không có phiếu lương nào.
                </td>
              </tr>
            ) : (
              phieuLuong.map((phieu, index) => (
                <tr key={phieu.id}>
                  <td>{index + 1}</td>
                  <td>
                    {new Date(phieu.ngayPhat).toLocaleDateString('vi-VN', {
                      month: 'long',
                      year: 'numeric',
                    })}
                  </td>
                  <td>{phieu.luongCoBan?.toLocaleString()} VNĐ</td>
                  <td>{phieu.luongTangCa?.toLocaleString()} VNĐ</td>
                  <td>{phieu.tongThuNhap?.toLocaleString()} VNĐ</td>
                  <td>{phieu.tongKhauTru?.toLocaleString()} VNĐ</td>
                  <td>{phieu.ungLuong?.toLocaleString()} VNĐ</td>
                  <td>{phieu.luongNhan?.toLocaleString()} VNĐ</td>
                  <td>{phieu.no?.toLocaleString()} VNĐ</td>
                  <td>
                    {new Date(phieu.ngayPhat).toLocaleDateString('vi-VN')}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </Container>
    </>
  );
};

export default UserHome;
