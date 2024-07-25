import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Select, Space, Row, Col, Input, message } from 'antd';
import { useForm } from 'react-hook-form';
import { fetchStudents, createStudent, updateStudent, deleteStudent } from './api';

const { Option } = Select;
const { Search } = Input;

const Students = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const response = await fetchStudents();
      setStudents(response.data);
      setFilteredStudents(response.data);  // Filterlash uchun boshlang'ich holat
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
    reset();
    setIsModalVisible(true);
  };

  const handleEdit = (student) => {
    setIsEditing(true);
    setCurrentStudent(student);
    setValue('firstName', student.firstName);
    setValue('lastName', student.lastName);
    setValue('group', student.group);
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteStudent(id);
      setStudents(students.filter(student => student.id !== id));
      setFilteredStudents(filteredStudents.filter(student => student.id !== id));  // Filtrlangan holatni yangilash
      message.success('Student deleted successfully');
    } catch (error) {
      console.error('Error deleting student:', error);
      message.error('Failed to delete student');
    }
  };

  const onSubmit = async (data) => {
    try {
      if (isEditing && currentStudent) {
        await updateStudent(currentStudent.id, data);
        setStudents(students.map(student => student.id === currentStudent.id ? { ...data, id: currentStudent.id } : student));
        message.success('Student updated successfully');
      } else {
        const response = await createStudent(data);
        setStudents([...students, response.data]);
        message.success('Student added successfully');
      }
      setIsModalVisible(false);
      filterStudents(searchText, selectedGroup);  // Filtrlashni qayta qo'llash
    } catch (error) {
      console.error('Error saving student:', error);
      message.error('Failed to save student');
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
        onOk={handleSubmit(onSubmit)}
        onCancel={handleCancel}
      >
        <form>
          <div>
            <label>First Name</label>
            <input {...register('firstName', { required: 'First name is required' })} />
            {errors.firstName && <p>{errors.firstName.message}</p>}
          </div>
          <div>
            <label>Last Name</label>
            <input {...register('lastName', { required: 'Last name is required' })} />
            {errors.lastName && <p>{errors.lastName.message}</p>}
          </div>
          <div>
            <label>Group</label>
            <select {...register('group', { required: 'Group is required' })}>
              <option value="A">Group A</option>
              <option value="B">Group B</option>
            </select>
            {errors.group && <p>{errors.group.message}</p>}
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Students;
