// src/Students.jsx
import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, Space, Row, Col } from 'antd';
import { fetchStudents, createStudent, updateStudent, deleteStudent } from './api';

const { Option } = Select;
const { Search } = Input;

const Students = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const response = await fetchStudents();
      setStudents(response.data);
      filterStudents(searchText, selectedGroup);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const filterStudents = (search, group) => {
    let filtered = students;

    if (search) {
      filtered = filtered.filter(student =>
        student.firstName.toLowerCase().includes(search.toLowerCase()) ||
        student.lastName.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (group) {
      filtered = filtered.filter(student => student.group === group);
    }

    setFilteredStudents(filtered);
  };

  const handleAdd = () => {
    setIsEditing(false);
    setCurrentStudent(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (student) => {
    setIsEditing(true);
    setCurrentStudent(student);
    form.setFieldsValue(student);
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteStudent(id);
      setStudents(students.filter(student => student.id !== id));
      filterStudents(searchText, selectedGroup);
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (isEditing && currentStudent) {
        await updateStudent(currentStudent.id, values);
        setStudents(students.map(student => student.id === currentStudent.id ? values : student));
      } else {
        const response = await createStudent(values);
        setStudents([...students, response.data]);
      }
      setIsModalVisible(false);
      filterStudents(searchText, selectedGroup);
    } catch (error) {
      console.error('Error saving student:', error);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSearch = (value) => {
    setSearchText(value);
    filterStudents(value, selectedGroup);
  };

  const handleFilterChange = (value) => {
    setSelectedGroup(value);
    filterStudents(searchText, value);
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'First Name', dataIndex: 'firstName', key: 'firstName' },
    { title: 'Last Name', dataIndex: 'lastName', key: 'lastName' },
    { title: 'Group', dataIndex: 'group', key: 'group' },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button onClick={() => handleEdit(record)}>Edit</Button>
          <Button danger onClick={() => handleDelete(record.id)}>Delete</Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Row gutter={16}>
        <Col span={8}>
          <Search
            placeholder="Search by name"
            onSearch={handleSearch}
            enterButton
          />
        </Col>
        <Col span={8}>
          <Select
            placeholder="Select group"
            style={{ width: '100%' }}
            onChange={handleFilterChange}
            allowClear
          >
            <Option value="">All Groups</Option>
            <Option value="A">Group A</Option>
            <Option value="B">Group B</Option>
          </Select>
        </Col>
        <Col span={8}>
          <Button type="primary" onClick={handleAdd}>Add Student</Button>
        </Col>
      </Row>
      <Table
        dataSource={filteredStudents}
        columns={columns}
        rowKey="id"
        style={{ marginTop: 16 }}
      />
      <Modal
        title={isEditing ? 'Edit Student' : 'Add Student'}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="firstName" label="First Name" rules={[{ required: true, message: 'Please input the first name!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="lastName" label="Last Name" rules={[{ required: true, message: 'Please input the last name!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="group" label="Group" rules={[{ required: true, message: 'Please select a group!' }]}>
            <Select>
              <Option value="A">Group A</Option>
              <Option value="B">Group B</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Students;
