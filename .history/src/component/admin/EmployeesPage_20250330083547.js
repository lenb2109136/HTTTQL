import React, { useState } from 'react';
import { Table, Button, Container, Row, Col } from 'react-bootstrap';
import { FiPlus } from 'react-icons/fi';

const EmployeesPage = () => {
  const [employees, setEmployees] = useState([
    {
      id: 1,
      name: 'Nguyễn Văn A',
      salary: '15,000,000 VND',
      payDate: '01/04/2025',
    },
    {
      id: 2,
      name: 'Trần Thị B',
      salary: '12,000,000 VND',
      payDate: '01/04/2025',
    },
    {
      id: 3,
      name: 'Lê Văn C',
      salary: '18,000,000 VND',
      payDate: '01/04/2025',
    },
  ]);

  const handleDelete = id => {
    setEmployees(employees.filter(emp => emp.id !== id));
  };

  return (
    <Container>
      <h1 className="text-center my-4">Quản lý gì thì mấy ní tự sửa nhé</h1>
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
              <td>{emp.salary}</td>
              <td>{emp.payDate}</td>
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
    </Container>
  );
};

export default EmployeesPage;
