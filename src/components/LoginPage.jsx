import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, message } from 'antd';
import axios from 'axios';

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Foydalanuvchi ma'lumotlarini JSON-serverdan olish
      const response = await axios.get('http://localhost:3000/users');
      const user = response.data.find(
        (user) => user.username === values.username && user.password === values.password
      );

      // Login ma'lumotlari to'g'ri bo'lsa
      if (user) {
        message.success('Login successful!');
        // Foydalanuvchi ma'lumotlarini sessiyaga saqlash (agar kerak bo'lsa)
        sessionStorage.setItem('authenticated', 'true');
        // Dashboard sahifasiga yo'naltirish
        navigate('/dashboard');
      } else {
        message.error('Invalid username or password');
      }
    } catch (error) {
      message.error('Failed to login.');
    } finally {
      setLoading(false);
    }
  };

  const goToSignUp = () => {
    navigate('/signup');
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Form name="login" onFinish={onFinish} style={{ width: '300px' }}>
        <Form.Item
          name="username"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input placeholder="Username" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input type="password" placeholder="Password" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Sign In
          </Button>
        </Form.Item>
        <Form.Item>
          <Button type="link" onClick={goToSignUp}>
            Sign Up
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginPage;
