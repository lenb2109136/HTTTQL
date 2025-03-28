import React, { useState } from 'react';
import { Table, Button, Container } from 'react-bootstrap';

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
      <h2 className="my-3">Danh sách nhân viên</h2>
      <Button variant="primary" className="mb-3">
        Thêm nhân viên
      </Button>
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
