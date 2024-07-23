import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, message } from 'antd';
import axios from 'axios';

const { Option } = Select;

const Students = () => {
  const [students, setStudents] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingStudent, setEditingStudent] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://localhost:3000/students');
      setStudents(response.data);
    } catch (error) {
      message.error('Failed to fetch students.');
    }
  };

  const handleAdd = () => {
    form.resetFields();
    setEditingStudent(null);
    setIsModalVisible(true);
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    form.setFieldsValue(student);
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/students/${id}`);
      message.success('Student deleted successfully.');
      fetchStudents();
    } catch (error) {
      message.error('Failed to delete student.');
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleFinish = async (values) => {
    try {
      if (editingStudent) {
        await axios.put(`http://localhost:3000/students/${editingStudent.id}`, values);
        message.success('Student updated successfully.');
      } else {
        const newId = students.length ? students[students.length - 1].id + 1 : 1;
        await axios.post('http://localhost:3000/students', { ...values, id: newId });
        message.success('Student added successfully.');
      }
      setIsModalVisible(false);
      fetchStudents();
    } catch (error) {
      message.error('Failed to save student.');
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'First Name', dataIndex: 'firstName', key: 'firstName' },
    { title: 'Last Name', dataIndex: 'lastName', key: 'lastName' },
    { title: 'Group', dataIndex: 'group', key: 'group' },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <span>
          <Button onClick={() => handleEdit(record)} style={{ marginRight: 8 }}>Edit</Button>
          <Button onClick={() => handleDelete(record.id)} danger>Delete</Button>
        </span>
      ),
    },
  ];

  return (
    <div>
      <Button type="primary" onClick={handleAdd} style={{ marginBottom: 16 }}>Add Student</Button>
      <Table columns={columns} dataSource={students} rowKey="id" />
      <Modal
        title={editingStudent ? 'Edit Student' : 'Add Student'}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} onFinish={handleFinish} layout="vertical">
          <Form.Item name="firstName" label="First Name" rules={[{ required: true, message: 'Please input the first name!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="lastName" label="Last Name" rules={[{ required: true, message: 'Please input the last name!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="group" label="Group" rules={[{ required: true, message: 'Please select a group!' }]}>
            <Select>
              <Option value="A">A</Option>
              <Option value="B">B</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">{editingStudent ? 'Update' : 'Add'}</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Students;
