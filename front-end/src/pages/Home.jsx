import React, { useEffect, useState } from "react";
import "../input.css";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Row,
  Col,
  Button,
  Layout,
  Menu,
  Dropdown,
  Avatar,
  Typography
} from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  PieChartOutlined,
  WalletOutlined,
  KeyOutlined
} from "@ant-design/icons";

const { Header, Content } = Layout;
const { Title, Text } = Typography;

function Home() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("用户");

  // 判断登录，未登录则跳转
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.warn("No token found. Redirecting to /login...");
      navigate("/login");
    } else {
      // 从本地存储获取用户名，如果有的话
      const storedUsername = localStorage.getItem("username");
      if (storedUsername) {
        setUsername(storedUsername);
      }
    }
  }, [navigate]);

  const handleNavigate = (destination) => {
    navigate(destination);
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("username");
    navigate("/login");
  };

  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        个人资料
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        退出登录
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout className="min-h-screen">
      {/* AppBar */}
      <Header className="bg-white shadow-md px-6 flex justify-between items-center">
        <div className="flex items-center">
          <img src="/logo.svg" alt="Logo" className="h-8 mr-4" />
          <Title level={4} style={{ margin: 0 }}>财务管理系统</Title>
        </div>
        <Dropdown overlay={userMenu} placement="bottomRight">
          <div className="flex items-center cursor-pointer">
            <Avatar icon={<UserOutlined />} className="mr-2" />
            <Text>{username}</Text>
          </div>
        </Dropdown>
      </Header>

      {/* 主内容区域 */}
      <Content className="p-6 bg-gradient-to-r from-green-100 to-white">
        <Row gutter={[24, 24]}>
          {/* 记账管理区域 */}
          <Col xs={24} md={12}>
            <Card
              title={<div className="flex items-center"><WalletOutlined className="mr-2" />记账管理</div>}
              className="h-80 shadow-md hover:shadow-lg transition-shadow"
              extra={<Button type="primary" onClick={() => handleNavigate('/moneybook')}>进入</Button>}
            >
              <div className="flex flex-col h-56 justify-between">
                <div className="text-center p-4">
                  <img src="/money.svg" alt="记账" className="w-20 h-20 mx-auto mb-4" />
                  <Text className="block mb-2 text-lg">管理您的财务记录</Text>
                  <Text type="secondary" className="block">
                    轻松记录日常收支，查看财务报表，合理规划预算
                  </Text>
                </div>
                <Button
                  type="default"
                  icon={<WalletOutlined />}
                  block
                  onClick={() => handleNavigate('/moneybook')}
                >
                  开始记账
                </Button>
              </div>
            </Card>
          </Col>

          {/* 密码管理区域 */}
          <Col xs={24} md={12}>
            <Card
              title={<div className="flex items-center"><KeyOutlined className="mr-2" />密码管理</div>}
              className="h-80 shadow-md hover:shadow-lg transition-shadow"
              extra={<Button type="primary" onClick={() => handleNavigate('/code')}>进入</Button>}
            >
              <div className="flex flex-col h-56 justify-between">
                <div className="text-center p-4">
                  <img src="/code.svg" alt="密码" className="w-20 h-20 mx-auto mb-4" />
                  <Text className="block mb-2 text-lg">管理您的密码和代码</Text>
                  <Text type="secondary" className="block">
                    安全存储重要密码，管理代码片段，便捷查询
                  </Text>
                </div>
                <Button
                  type="default"
                  icon={<KeyOutlined />}
                  block
                  onClick={() => handleNavigate('/code')}
                >
                  管理密码
                </Button>
              </div>
            </Card>
          </Col>

          {/* 饼状图区域 - 独占一行 */}
          <Col xs={24}>
            <Card
              title={<div className="flex items-center"><PieChartOutlined className="mr-2" />财务统计</div>}
              className="shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-center items-center" style={{ height: "400px" }}>
                <div className="text-center">
                  <PieChartOutlined style={{ fontSize: '80px', color: '#1890ff' }} />
                  <p className="mt-4 text-gray-500">此处将显示财务数据饼状图</p>
                  <div className="mt-6">
                    <Row gutter={48} className="text-center">
                      <Col span={8}>
                        <Text type="secondary">总收入</Text>
                        <div className="text-xl font-bold text-green-500">¥12,580.00</div>
                      </Col>
                      <Col span={8}>
                        <Text type="secondary">总支出</Text>
                        <div className="text-xl font-bold text-red-500">¥8,320.50</div>
                      </Col>
                      <Col span={8}>
                        <Text type="secondary">结余</Text>
                        <div className="text-xl font-bold text-blue-500">¥4,259.50</div>
                      </Col>
                    </Row>
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
}

export default Home;
