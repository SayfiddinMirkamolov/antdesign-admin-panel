import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Select, Space, Row, Col, Input, message } from 'antd';
import { useForm } from 'react-hook-form';
import { fetchTeachers, createTeacher, updateTeacher, deleteTeacher } from './api';

const { Option } = Select;
const { Search } = Input;

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTeacher, setCurrentTeacher] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  useEffect(() => {
    loadTeachers();
  }, []);

  const loadTeachers = async () => {
    try {
      const response = await fetchTeachers();
      setTeachers(response.data);
      setFilteredTeachers(response.data);  // Filterlash uchun boshlang'ich holat
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
    reset();
    setIsModalVisible(true);
  };

  const handleEdit = (teacher) => {
    setIsEditing(true);
    setCurrentTeacher(teacher);
    setValue('firstName', teacher.firstName);
    setValue('lastName', teacher.lastName);
    setValue('level', teacher.level);
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteTeacher(id);
      setTeachers(teachers.filter(teacher => teacher.id !== id));
      setFilteredTeachers(filteredTeachers.filter(teacher => teacher.id !== id));  // Filtrlangan holatni yangilash
      message.success('Teacher deleted successfully');
    } catch (error) {
      console.error('Error deleting teacher:', error);
      message.error('Failed to delete teacher');
    }
  };

  const onSubmit = async (data) => {
    try {
      if (isEditing && currentTeacher) {
        await updateTeacher(currentTeacher.id, data);
        setTeachers(teachers.map(teacher => teacher.id === currentTeacher.id ? { ...data, id: currentTeacher.id } : teacher));
        message.success('Teacher updated successfully');
      } else {
        const response = await createTeacher(data);
        setTeachers([...teachers, response.data]);
        message.success('Teacher added successfully');
      }
      setIsModalVisible(false);
      filterTeachers(searchText, selectedLevel);  // Filtrlashni qayta qo'llash
    } catch (error) {
      console.error('Error saving teacher:', error);
      message.error('Failed to save teacher');
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
            <label>Level</label>
            <select {...register('level', { required: 'Level is required' })}>
              <option value="Senior">Senior</option>
              <option value="Middle">Middle</option>
              <option value="Junior">Junior</option>
            </select>
            {errors.level && <p>{errors.level.message}</p>}
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Teachers;
