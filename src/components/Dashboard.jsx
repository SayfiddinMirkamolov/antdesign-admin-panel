import React from 'react';
import { Layout, Menu } from 'antd';
import { Outlet, Link } from 'react-router-dom';

const { Sider, Content } = Layout;

const Dashboard = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={200} className="site-layout-background">
        <Menu
          mode="inline"
          defaultSelectedKeys={['1']}
          style={{ height: '100%', borderRight: 0 }}
        >
          <Menu.Item key="1">
            <Link to="students">Students</Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Link to="teachers">Teachers</Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout style={{ padding: '0 24px', minHeight: 280 }}>
        <Content style={{ padding: 24, margin: 0, minHeight: 280 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
