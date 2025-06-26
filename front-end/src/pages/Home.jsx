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
import ChartComponent from "../components/ChartComponent";

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

  const data = {
    labels: [
      'Red',
      'Blue',
      'Yellow'
    ],
    datasets: [{
      label: 'My First Dataset',
      data: [300, 50, 100],
      backgroundColor: [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
        'rgb(255, 205, 86)'
      ],
      hoverOffset: 4
    }]
  };
  const options = {
    plugins: {
      title: {
        display: true,
        text: '默认标题'
      }
    }
  }
  const pieChart = {
    chartType: 'doughnut',
    chartData: data,
    chartOptions: options,
    title: '我的现金流'
  }

  return (
    <Layout className="h-screen ">
      {/* AppBar */}
      <Header className="h-1/8 bg-gradient-to-r from-green-100 to-white shadow-md px-6 flex justify-between items-center">
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
      <Content className="px-6 bg-gradient-to-r from-green-100 to-white">
        <Row gutter={[24, 24]} >
          {/* 记账管理区域 */}
          <Col xs={24} md={12}>
            <Card
              title={<div className="flex items-center"><WalletOutlined className="mr-2" />记账管理</div>}
              className="shadow-md hover:shadow-lg transition-shadow"
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
              className=" shadow-md hover:shadow-lg transition-shadow"
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


          {/* 用ui库的组件，都有默认的style，比如col和row，想要实现自定义高度就很困难 */}
          {/* 饼状图区域 - 独占一行 */}
          <Col xs={24}>
            <Card
              title={<div className="flex items-center"><PieChartOutlined className="mr-2" />我的现金流</div>}
              className="shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-center items-center">
                <div className="text-center rounded-lg px-6 w-full">

                  {/* 使用 flex 布局让图表和统计数据并排 */}
                  {/* flex-direction: row (默认) */}
                  {/* 即默认flex是水平方向 */}
                  <div className="flex items-center gap-8">
                    {/* 左侧占领水平的1 */}
                    <div className="flex-1">
                      <div className="space-y-4">
                        <div className="p-3 rounded-lg hover:bg-green-50 transition-colors duration-200">
                          <Text type="secondary" className="block text-center text-sm">总收入</Text>
                          <div className="text-lg font-bold text-green-500 text-center">¥12,580.00</div>
                        </div>

                        <div className="p-3 rounded-lg hover:bg-red-50 transition-colors duration-200">
                          <Text type="secondary" className="block text-center text-sm">总支出</Text>
                          <div className="text-lg font-bold text-red-500 text-center">¥8,320.50</div>
                        </div>

                        <div className="p-3 rounded-lg hover:bg-blue-50 transition-colors duration-200">
                          <Text type="secondary" className="block text-center text-sm">结余</Text>
                          <div className="text-lg font-bold text-blue-500 text-center">¥4,259.50</div>
                        </div>
                      </div>
                    </div>

                    {/* 右侧占领水平的1 。因为左侧也占领水平的1，所以总水平是2，而右侧的flex-1 会占领水平的1/2 */}
                    <div className="flex-1 ">
                      <Button
                        type="primary"
                      >
                        开始记账
                      </Button>
                      <div className="h-[35vh]">
                        <ChartComponent data={pieChart} />
                      </div>
                    </div>
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
