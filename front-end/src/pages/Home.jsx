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
  Typography,
  Modal,
  Input,
  InputNumber,
  Space,
  message,
  Form,
  Popconfirm
} from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  PieChartOutlined,
  WalletOutlined,
  KeyOutlined,
  DownOutlined,
  AccountBookOutlined,
  QuestionCircleOutlined
} from "@ant-design/icons";
import ChartComponent from "../components/ChartComponent";
import ModalComponent from "../components/ModalComponent";
import { createCashItem, getAllCashItem, deleteCashItem, getCashHistory, modifyCashItem } from "../api/cash";





const { Header, Content } = Layout;
const { Title, Text } = Typography;

function Home() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("用户");
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false)
  // 是 Ant Design 的表单 Hook，用于创建和管理表单实例。
  const [form] = Form.useForm();
  const [modifyForm] = Form.useForm();
  //用于存储后端传回的所有饼状图的数据
  const [cashItems, setCashItems] = useState([{ itemName: '', balance: 0 }]);
  const amount = cashItems.reduce((acc, item) => acc + item.balance, 0);
  const [showLineChart, setShowLineChart] = useState(false);
  const [cashHistory, setCashHistory] = useState([]);
  const [modifyModalOpen, setModifyModalOpen] = useState(false);

  const [selectedItem, setSelectedItem] = useState({ itemName: '', balance: 0 });


  // 预定义漂亮的颜色池
  const colorPool = [
    'rgb(255, 99, 132)',   // 红色
    'rgb(54, 162, 235)',   // 蓝色
    'rgb(255, 205, 86)',   // 黄色
    'rgb(75, 192, 192)',   // 青色
    'rgb(153, 102, 255)',  // 紫色
    'rgb(255, 159, 64)',   // 橙色
    'rgb(199, 199, 199)',  // 灰色
    'rgb(83, 102, 255)',   // 靛蓝
    'rgb(255, 99, 255)',   // 品红
    'rgb(99, 255, 132)'    // 绿色
  ];

  //用于生成饼状图的数据，即处理后后端传回的数据
  const pieData = {
    labels: cashItems.map(item => item.itemName),
    datasets: [
      {
        // label: '我的收入', // 第一个数据集
        data: cashItems.map(item => parseFloat(item.balance)),
        backgroundColor: cashItems.map((item, index) => colorPool[index % colorPool.length]),
        hoverOffset: 4
      },

    ]
  };





  const pieOptions = {
    // 响应式
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: '我的现金流',
        font: {
          size: 20,
          weight: 'bold'
        }
      }
    },
    // 添加点击事件处理器
    onClick: (event, elements) => {
      // 检查是否点击到了图表元素
      if (elements.length > 0) {
        const clickedElementIndex = elements[0].index;
        const clickedItem = cashItems[clickedElementIndex];
        // 执行对应的功能
        handlePieChartClick(clickedItem, clickedElementIndex);
      }
    }
  }
  const pieChart = {
    chartType: 'pie',
    chartData: pieData,
    chartOptions: pieOptions,
  }





  const lineData = {
    labels: cashHistory.map(item => {
      const date = new Date(item.date);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    }),
          datasets: [{
        label: cashHistory.length > 0 ? cashHistory[0].itemName : '数据',
        data: cashHistory.length > 0 ? cashHistory.map(item => parseFloat(item.balance.$numberDecimal)) : [100],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }]
  };

  const lineOptions = {
    plugins: {
      title: {
        display: true,
        text: cashHistory.length > 0 ? cashHistory[0].itemName + '历史变动' : '历史变化',
        font: {
          size: 20,
          weight: 'bold'
        }
      }
    }
  };

  const lineChart = {
    chartType: 'line',
    chartData: lineData,
    chartOptions: lineOptions,
  };


  // 判断登录，未登录则跳转
  useEffect(() => {
    fetchCashItems();
  }, []);

  //跳转页面
  const handleNavigate = (destination) => {
    navigate(destination);
  };
  const fetchCashItems = async () => {
    const response = await getAllCashItem();
    setCashItems(response.data);
    //对后端传回的数据进行处理，把项目名放入删除的下拉框

  }


  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("username");
    navigate("/login");
  };




  // 添加饼状图点击处理函数
  const handlePieChartClick = async (clickedItem, index) => {

    const response = await getCashHistory(clickedItem.itemName)
    setCashHistory(response.data)
    setShowLineChart(true)

  };


  const handleCreateCashItem = async () => {
    try {
      // 🔑 自动验证所有字段
      const values = await form.validateFields();
      console.log('验证通过的值:', values);

      setLoading(true);
      const response = await createCashItem(values.itemName, values.balance);

      if (response.status === 200) {
        message.success(response.data.message);
        form.resetFields(); // 重置表单

        setModalOpen(false)
      }
    }
    catch (error) {
      if (error.errorFields) {
        // 验证失败，Ant Design 会自动显示错误
        console.log('验证失败:', error);
      } else {
        // API 错误处理
        console.error('Create cash item error:', error);

        // 🔑 组合处理
        const errorHandler = {
          400: () => message.error('请检查输入信息'),
          401: () => {
            console.log(error)
            message.error(error.response.data.message);
            // setTimeout(() => navigate('/login'), 1500);
          },
          409: () => {
            // message.error('项目名称已存在，请使用不同名称');
            form.setFields([{
              name: 'itemName',
              errors: ['该项目已建立']
            }]);
          },
          500: () => message.error('服务器错误，请稍后重试'),
          network: () => message.error('网络连接失败，请检查网络'),
          default: () => message.error('操作失败，请重试')
        };

        if (error.response) {
          const handler = errorHandler[error.response.status] || errorHandler.default;
          handler();
        } else if (error.request) {
          errorHandler.network();
        } else {
          errorHandler.default();
        }
      }
    } finally {
      setLoading(false);
      fetchCashItems();
    }
  }

  const handleModifyCashItem = async () => {
    try {
      // 🔑 自动验证所有字段
      const values = await modifyForm.validateFields();
      console.log('验证通过的值:', values);

      setLoading(true);
      const response = await modifyCashItem(selectedItem._id, values.balance);

      if (response.status === 200) {
        message.success(response.data.message);
        modifyForm.resetFields(); // 重置表单
        setModifyModalOpen(false)
      }
    }
    catch (error) {
      if (error.errorFields) {
        // 验证失败，Ant Design 会自动显示错误
        console.log('验证失败:', error);
      } else {
        // API 错误处理
        console.error('Create cash item error:', error);

        // 🔑 组合处理
        const errorHandler = {
          400: () => message.error('请检查输入信息'),
          401: () => {
            console.log(error)
            message.error(error.response.data.message);
            // setTimeout(() => navigate('/login'), 1500);
          },
          409: () => {
            // message.error('项目名称已存在，请使用不同名称');
            form.setFields([{
              name: 'itemName',
              errors: ['该项目已建立']
            }]);
          },
          500: () => message.error('服务器错误，请稍后重试'),
          network: () => message.error('网络连接失败，请检查网络'),
          default: () => message.error('操作失败，请重试')
        };

        if (error.response) {
          const handler = errorHandler[error.response.status] || errorHandler.default;
          handler();
        } else if (error.request) {
          errorHandler.network();
        } else {
          errorHandler.default();
        }
      }
    } finally {
      setLoading(false);
      fetchCashItems();
    }
  }




  const handleDeleteCashItem = async (itemId) => {
    console.log(itemId)
    const response = await deleteCashItem(itemId);
    if (response.status === 200) {
      message.success(response.data.message);
      fetchCashItems();
    }
    else {
      message.error(response.data.message);
    }
  }




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

  const deleteItems = cashItems.map((item, index) => ({
    label: (
      <Popconfirm
        title="Delete the item"
        description={`Are you sure to delete ${item.itemName}?`}
        okText="Yes"
        cancelText="No"
        icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
        okType="danger"
        onConfirm={() => handleDeleteCashItem(item._id)}
      >
        <div style={{
          whiteSpace: 'normal',
          wordWrap: 'break-word',
          width: '100%', // 使用全宽
          lineHeight: '1.2'
        }}>
          {item.itemName}
        </div>
      </Popconfirm>
    ),
    key: index.toString(),
    icon: <AccountBookOutlined />,
    danger: true,
  }));
  const menuProps = {
    items: deleteItems,
  };

  const modifyItems = cashItems.map((item, index) => ({
    label: (
      <div style={{
        whiteSpace: 'normal',
        wordWrap: 'break-word',
        width: '100%', // 使用全宽
        lineHeight: '1.2'
      }}>
        {item.itemName}
        <button></button>
      </div>

    ),
    key: index.toString(),
    icon: <AccountBookOutlined />,
    onClick: (menuInfo) => {

      const clickedItem = cashItems[parseInt(menuInfo.key)];
      console.log(clickedItem)
      setSelectedItem(clickedItem)
      setModifyModalOpen(true)
      modifyForm.setFieldsValue({
        itemName: clickedItem.itemName,    // 使用当前点击的 item
        // 使用当前点击的 item
      });
    }

  }));
  const modifyMenuProps = {
    items: modifyItems,
  };

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
          {/* 
          xs = extra small（≥0px，超小屏幕，如手机）
          sm = small（≥576px，小屏幕）
          md = medium（≥768px，中等屏幕，如平板）
          lg = large（≥992px，大屏幕）
          xl = extra large（≥1200px，超大屏幕）
          xxl = extra extra large（≥1600px，超超大屏幕） 
          */}
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
              className="shadow-md hover:shadow-lg transition-shadow  "
              bodyStyle={{ padding: 0 }}  // 去除 Card 的默认 padding
              extra={
                <div className="flex gap-2 ">
                  <Button
                    type="primary"
                    onClick={() => {
                      setModalOpen(true)
                    }}
                  >
                    开始记账
                  </Button>
                  <Dropdown
                    placement="bottomLeft"
                    menu={modifyMenuProps}
                    overlayStyle={{
                      minWidth: '200px', // 设置最小宽度与按钮一致
                      maxWidth: '200px'  // 设置最大宽度
                    }}
                  >
                    <Button type="primary"
                      style={{
                        backgroundColor: '#1E90FF',
                        borderColor: '#1E90FF',
                        color: '#fff'                // 自定义文字色
                      }} >
                      修改数值 <DownOutlined />
                    </Button>
                  </Dropdown>
                  <Dropdown
                    placement="bottomLeft"
                    menu={menuProps}

                    overlayStyle={{
                      minWidth: '200px', // 设置最小宽度与按钮一致
                      maxWidth: '200px'  // 设置最大宽度
                    }}
                  >
                    <Button type="primary" danger >
                      删除项目 <DownOutlined />
                    </Button>
                  </Dropdown>
                </div>
              }

            >
              <div className="flex justify-center items-center h-[26rem]  ">
                <div className="text-center rounded-lg px-6 w-full  h-full ">

                  {/* 使用 flex 布局让图表和统计数据并排 */}
                  {/* flex-direction: row (默认) */}
                  {/* 即默认flex是水平方向 */}
                  <div className="flex items-center  h-full">
                    {/* 左侧占领水平的1 */}
                    <div className="w-1/5 ">
                      <div >
                        <div className="p-3 rounded-lg hover:bg-green-50 transition-colors duration-200">
                          <Text type="secondary" className="block text-center text-sm">总现金</Text>
                          <div className="text-lg font-bold text-green-500 text-center">{amount}</div>
                        </div>

                        <div className="p-3 rounded-lg hover:bg-red-50 transition-colors duration-200">
                          <Text type="secondary" className="block text-center text-sm">总支出</Text>
                          <div className="text-lg font-bold text-red-500 text-center">¥0</div>
                        </div>

                        <div className="p-3 rounded-lg hover:bg-blue-50 transition-colors duration-200">
                          <Text type="secondary" className="block text-center text-sm">结余</Text>
                          <div className="text-lg font-bold text-blue-500 text-center">¥0</div>
                        </div>
                      </div>
                    </div>

                    {/* 右侧占领水平的1 。因为左侧也占领水平的1，所以总水平是2，而右侧的flex-1 会占领水平的1/2 */}
                    <div className="w-4/5 h-full">

                      <div className=" flex  h-full w-full">

                        <div className="w-1/2 h-full">
                          <ChartComponent data={pieChart} /></div>
                        {showLineChart && <ChartComponent data={lineChart} />}
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </Content>
      <ModalComponent modalOpen={modalOpen} setModalOpen={setModalOpen} handleOk={handleCreateCashItem} loading={loading} form={form} title="添加你的现金项目" />
      <ModalComponent
        modalOpen={modifyModalOpen}
        setModalOpen={setModifyModalOpen}
        handleOk={handleModifyCashItem}
        loading={loading}
        form={modifyForm}
        title="修改你的现金项目"
        disabled={true}
        itemName={selectedItem.itemName}
        buttonStyle={{ backgroundColor: '#1E90FF', borderColor: '#1E90FF', color: '#fff' }}

      />




    </Layout >
  );
}

export default Home;
