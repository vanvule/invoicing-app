import React, { useState } from 'react';
import { Layout, Menu, MenuProps, theme } from 'antd';
import { Link, BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import sidebarItems from './sidebarItems.json';
import { CreateInvoiceForm } from '../CreateInvoiceForm/CreateInvoiceForm';
import { InvoiceTable } from '../InvoiceTable/InvoiceTable';
import {
  HomeTwoTone,
  BookTwoTone,
  PlusSquareTwoTone
} from '@ant-design/icons';

import { Typography } from 'antd';

const { Title } = Typography;

const { Header, Content, Sider } = Layout;
const { SubMenu } = Menu;

type MenuItem = Required<MenuProps>['items'][number];

export const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const handleCollapse = (value: boolean) => {
    setCollapsed(value);
  };


  const iconMap: { [key: string]: JSX.Element } = {
    HomeTwoTone: <HomeTwoTone />,
    BookTwoTone: <BookTwoTone />,
    PlusSquareTwoTone: <PlusSquareTwoTone />
  };

  const renderTitle = () => {
    const currentPath = window.location.pathname;
    const currentRoute = sidebarItems.find((item) => item.route === currentPath);
    return currentRoute ? currentRoute.label : 'Invoice App';
  }

  return (
    <Router>
      <Layout style={{ minHeight: '100vh'}}>
        <Sider collapsible collapsed={collapsed} onCollapse={handleCollapse}>
          <div className="demo-logo-vertical" />
          <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
            {sidebarItems.map((item) => {
              if (item.children) {
                return (
                  <SubMenu
                    key={item.key}
                    icon={iconMap[item.icon]}
                    title={item.label}
                  >
                    {item.children.map((child) => (
                      <Menu.Item key={child.key}>
                        <Link to={child.route}>{child.label}</Link>
                      </Menu.Item>
                    ))}
                  </SubMenu>
                );
              }
              return (
                <Menu.Item key={item.key} icon={iconMap[item.icon]}>
                  <Link to={item.route}>{item.label}</Link>
                </Menu.Item>
              );
            })}
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ padding: 0, background: colorBgContainer }}>
            <Title level={2}
              style={{
                color: '#22247d',
                textAlign: 'start',
                paddingLeft: '16px'
              }}
            >
              {renderTitle()}
            </Title>
          </Header>
          <Content style={{ margin: '0 16px'}}>
            <Routes>
              <Route path="/create-invoice" element={
                <CreateInvoiceForm />
              } />
              <Route path="/all-invoices" element={<InvoiceTable />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Router>
  );
};
