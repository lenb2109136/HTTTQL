import React from 'react';
import { Container } from 'react-bootstrap';

const UserHome = () => {
  return (
    <Container className="py-4">
      <h1 className="text-center">Trang Nhân Viên</h1>
      <p className="text-center">
        Chào mừng bạn đến với trang cá nhân của nhân viên!
      </p>
    </Container>
  );
};

export default UserHome;
