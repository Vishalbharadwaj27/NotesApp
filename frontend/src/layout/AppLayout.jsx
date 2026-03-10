import React, { useState } from 'react';
import { Layout, Menu, Button, Typography } from 'antd';
import { LogoutOutlined, FileTextOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { logout } from '../utils/auth';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const AppLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    {
      key: 'notes',
      icon: <FileTextOutlined />,
      label: 'Notes',
      onClick: () => navigate('/dashboard'),
    },
    {
      key: 'create',
      icon: <PlusOutlined />,
      label: 'Create Note',
      onClick: () => navigate('/dashboard?create=true'),
    },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#001529', padding: '0 20px' }}>
        <Title level={3} style={{ color: 'white', margin: 0 }}>Notes App</Title>
        <Button type="text" icon={<LogoutOutlined />} onClick={handleLogout} style={{ color: 'white' }}>
          Logout
        </Button>
      </Header>
      <Layout>
        <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed} theme="dark">
          <Menu theme="dark" mode="inline" items={menuItems} />
        </Sider>
        <Layout style={{ padding: '0 24px 24px' }}>
          <Content style={{ padding: 24, margin: 0, minHeight: 280, background: '#fff' }}>
            {children}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
