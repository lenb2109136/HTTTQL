import React, { useEffect } from 'react';
import { toast } from 'react-toastify';

const UserHome = () => {
  useEffect(() => {
    // Kiểm tra nếu vừa đăng nhập (dựa trên localStorage)
    const employee = localStorage.getItem('employee');
    if (employee) {
      toast.success('Đăng nhập thành công!', {
        position: 'top-right',
        autoClose: 2000,
      });
    }
  }, []);

  return (
    <div>
      <h2>Chào mừng đến với Trang chủ người dùng!</h2>
      {/* Nội dung của trang UserHome */}
    </div>
  );
};

export default UserHome;
