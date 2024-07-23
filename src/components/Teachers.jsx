import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, message } from 'antd';
import axios from 'axios';

const { Option } = Select;

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingTeacher, setEditingTeacher] = useState(null);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const response = await axios.get('http://localhost:3000/teachers');
      setTeachers(response.data);
    } catch (error) {
      message.error('Failed to fetch teachers.');
    }
  };

  const handleAdd = () => {
    form.resetFields();
    setEditingTeacher(null);
    setIsModalVisible(true);
  };

  const handleEdit = (teacher) => {
    setEditingTeacher(teacher);
    form.setFieldsValue(teacher);
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/teachers/${id}`);
      message.success('Teacher deleted successfully.');
      fetchTeachers();
    } catch (error) {
      message.error('Failed to delete teacher.');
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleFinish = async (values) => {
    try {
      if (editingTeacher) {
        await axios.put(`http://localhost:3000/teachers/${editingTeacher.id}`, values);
        message.success('Teacher updated successfully.');
      } else {
        const newId = teachers.length ? teachers[teachers.length - 1].id + 1 : 1;
        await axios.post('http://localhost:3000/teachers', { ...values, id: newId });
        message.success('Teacher added successfully.');
      }
      setIsModalVisible(false);
      fetchTeachers();
    } catch (error) {
      message.error('Failed to save teacher.');
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'First Name', dataIndex: 'firstName', key: 'firstName' },
    { title: 'Last Name', dataIndex: 'lastName', key: 'lastName' },
    { title: 'Level', dataIndex: 'level', key: 'level' },
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
      <Button type="primary" onClick={handleAdd} style={{ marginBottom: 16 }}>Add Teacher</Button>
      <Table columns={columns} dataSource={teachers} rowKey="id" />
      <Modal
        title={editingTeacher ? 'Edit Teacher' : 'Add Teacher'}
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
          <Form.Item name="level" label="Level" rules={[{ required: true, message: 'Please select a level!' }]}>
            <Select>
              <Option value="Senior">Senior</Option>
              <Option value="Middle">Middle</Option>
              <Option value="Junior">Junior</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">{editingTeacher ? 'Update' : 'Add'}</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Teachers;
