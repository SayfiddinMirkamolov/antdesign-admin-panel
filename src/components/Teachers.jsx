// src/Teachers.jsx
import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, Space, Row, Col } from 'antd';
import { fetchTeachers, createTeacher, updateTeacher, deleteTeacher } from './api';

const { Option } = Select;
const { Search } = Input;

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTeacher, setCurrentTeacher] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');

  useEffect(() => {
    loadTeachers();
  }, []);

  const loadTeachers = async () => {
    try {
      const response = await fetchTeachers();
      setTeachers(response.data);
      filterTeachers(searchText, selectedLevel);
    } catch (error) {
      console.error('Error fetching teachers:', error);
    }
  };

  const filterTeachers = (search, level) => {
    let filtered = teachers;

    if (search) {
      filtered = filtered.filter(teacher =>
        teacher.firstName.toLowerCase().includes(search.toLowerCase()) ||
        teacher.lastName.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (level) {
      filtered = filtered.filter(teacher => teacher.level === level);
    }

    setFilteredTeachers(filtered);
  };

  const handleAdd = () => {
    setIsEditing(false);
    setCurrentTeacher(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (teacher) => {
    setIsEditing(true);
    setCurrentTeacher(teacher);
    form.setFieldsValue(teacher);
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteTeacher(id);
      setTeachers(teachers.filter(teacher => teacher.id !== id));
      filterTeachers(searchText, selectedLevel);
    } catch (error) {
      console.error('Error deleting teacher:', error);
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (isEditing && currentTeacher) {
        await updateTeacher(currentTeacher.id, values);
        setTeachers(teachers.map(teacher => teacher.id === currentTeacher.id ? values : teacher));
      } else {
        const response = await createTeacher(values);
        setTeachers([...teachers, response.data]);
      }
      setIsModalVisible(false);
      filterTeachers(searchText, selectedLevel);
    } catch (error) {
      console.error('Error saving teacher:', error);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSearch = (value) => {
    setSearchText(value);
    filterTeachers(value, selectedLevel);
  };

  const handleFilterChange = (value) => {
    setSelectedLevel(value);
    filterTeachers(searchText, value);
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'First Name', dataIndex: 'firstName', key: 'firstName' },
    { title: 'Last Name', dataIndex: 'lastName', key: 'lastName' },
    { title: 'Level', dataIndex: 'level', key: 'level' },
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
            placeholder="Select level"
            style={{ width: '100%' }}
            onChange={handleFilterChange}
            allowClear
          >
            <Option value="">All Levels</Option>
            <Option value="Senior">Senior</Option>
            <Option value="Middle">Middle</Option>
            <Option value="Junior">Junior</Option>
          </Select>
        </Col>
        <Col span={8}>
          <Button type="primary" onClick={handleAdd}>Add Teacher</Button>
        </Col>
      </Row>
      <Table
        dataSource={filteredTeachers}
        columns={columns}
        rowKey="id"
        style={{ marginTop: 16 }}
      />
      <Modal
        title={isEditing ? 'Edit Teacher' : 'Add Teacher'}
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
          <Form.Item name="level" label="Level" rules={[{ required: true, message: 'Please select a level!' }]}>
            <Select>
              <Option value="Senior">Senior</Option>
              <Option value="Middle">Middle</Option>
              <Option value="Junior">Junior</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Teachers;
