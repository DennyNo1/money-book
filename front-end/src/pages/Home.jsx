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
  message,
  Form,
  Popconfirm,
  Empty,
} from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  PieChartOutlined,
  WalletOutlined,
  KeyOutlined,
  DownOutlined,
  AccountBookOutlined,
  QuestionCircleOutlined,
  CloseOutlined,
  PayCircleOutlined,
  TransactionOutlined
} from "@ant-design/icons";
import ChartComponent from "../components/ChartComponent";
import CashModal from "../components/CashModal";
import ExpenseModal from "../components/ExpenseModal";
import { createCashItem, getAllCashItem, deleteCashItem, getCashHistory, modifyCashItem } from "../api/cash";
import HomeFormErrorHandler from "../components/HomeFormErrorHandler";
import { createExpenseRecordMonthly, listExpenseRecordMonthly } from "../api/expense";








const { Header, Content } = Layout;
const { Title, Text } = Typography;

function Home() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("用户");
  const [modalOpen, setModalOpen] = useState(false);
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [loading, setLoading] = useState(false)
  // 是 Ant Design 的表单 Hook，用于创建和管理表单实例。
  const [form] = Form.useForm();

  const [modifyForm] = Form.useForm();
  const [expenseForm] = Form.useForm()
  //用于存储后端传回的所有饼状图的数据
  const [cashItems, setCashItems] = useState([{ itemName: '', balance: 0 }]);
  const total = cashItems.reduce((acc, item) => acc + item.balance, 0);
  const [showLineChart, setShowLineChart] = useState(false);
  const [cashHistory, setCashHistory] = useState([]);
  const [expenseRecordMonthly, setExpenseRecordMonthly] = useState([{ total: 0 }]);
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
    labels: cashItems.map(item => {
      const percent = total
        ? ((item.balance / total) * 100).toFixed(2)
        : '0.00';
      return item.itemName + `(${percent}%)`
    }),
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
      // title: {
      //   display: true,
      //   text: '现金流图分析',
      //   font: {
      //     size: 20,
      //     weight: 'bold'
      //   }
      // },

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
    },

  }
  const pieChart = {
    chartType: 'pie',
    chartData: pieData,
    chartOptions: pieOptions,
  }



  //属于现金流的折线图配置
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
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        bottom: 30
      }
    },
    plugins: {
      title: {
        display: true,
        // text: cashHistory.length > 0 ? cashHistory[0].itemName + '历史变动' : '历史变化',
        text: '每月支出',
        font: {
          size: 15,

        },
        padding: {
          top: 30,
          bottom: 10
        }

      }
    }
  };

  const lineChart = {
    chartType: 'line',
    chartData: lineData,
    chartOptions: lineOptions,
  };




  //属于支出流的折线图配置
  const expenseLineData = {
    labels: expenseRecordMonthly.map(item => {
      const date = new Date(item.date);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    }),
    datasets: [{
      label: '该月总支出',
      data: expenseRecordMonthly.length > 0 ? expenseRecordMonthly.map(item => parseFloat(item.total)) : [100],
      fill: false,
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]


  }
  const expenseLineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        bottom: 30
      }
    },
    plugins: {
      title: {
        display: true,
        // text: cashHistory.length > 0 ? cashHistory[0].itemName + '历史变动' : '历史变化',
        text: '每月支出',
        font: {
          size: 15,

        },
        padding: {
          top: 30,
          bottom: 10
        }

      },
      //只有当鼠标悬停在图表的数据点上 时才会触发。
      tooltip: {
        callbacks: {
          // 自定义 tooltip 标题
          title: (tooltipItems) => {
            const item = tooltipItems[0];
            return ` ${item.label}`;
          },
          // 自定义每一行的文本
          label: (tooltipItem) => {
            const index = tooltipItem.datasetIndex
            const value = tooltipItem.raw; // 原始 y 值
            const sourceArray = expenseRecordMonthly[index].sources;
            const sourceText = sourceArray.map((item, index) => {
              return `${item.source}: ${item.amount}`
            }).join('\n');
            return [
              `本月支出: ${value}`,

              `来源: ${sourceText}`,

              `备注: ${expenseRecordMonthly[index].note}`,

            ];
          },
        },
      },
    }
  }
  const expenseLineChart = {
    chartType: 'line',
    chartData: expenseLineData,
    chartOptions: expenseLineOptions,
  };




  // 判断登录，未登录则跳转
  useEffect(() => {
    fetchCashItems();
    fetchExpenseRecordMonthly();
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

  const fetchExpenseRecordMonthly = async () => {
    const response = await listExpenseRecordMonthly();
    console.log(response.data.expenseRecord)
    setExpenseRecordMonthly(response.data.expenseRecord);
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
      HomeFormErrorHandler(error, form);
    }
    finally {
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
      HomeFormErrorHandler(error, form);
    }
    finally {
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


  const handleCreateExpense = async () => {
    try {
      const values = await expenseForm.validateFields();
      console.log(values.date);
      const response = await createExpenseRecordMonthly(values.date, values.sources, values.note);
      if (response.status === 201) {
        message.success(response.data.message);
        expenseForm.resetFields();
        setExpenseModalOpen(false);
      }
    }
    catch (error) {
      HomeFormErrorHandler(error, form);
    }
    finally {

      setLoading(false);
      fetchExpenseRecordMonthly();
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
  // const 在这里保证的是 deleteItems这个变量在单次渲染的执行作用域内不会被重新赋值。它并不会阻止在下一次渲染时创建一个新的 deleteItems 变量。
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
        currentBalance: clickedItem.balance + "(现值)"
      });
    }

  }));
  const modifyMenuProps = {
    items: modifyItems,
  };
  const handleCloseLineChart = () => {
    setShowLineChart(false);
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
              title={<div className="flex items-center"><WalletOutlined className="mr-2" />投资管理</div>}
              className="shadow-md hover:shadow-lg transition-shadow"
              extra={<Button type="primary" onClick={() => message.warning("Oops!该功能还在建设中.....")}>进入</Button>}
            >
              <div className="flex flex-col h-56 justify-between">
                <div className="text-center p-4">
                  <img src="/money.svg" alt="记账" className="w-20 h-20 mx-auto mb-4" />
                  <Text className="block mb-2 text-lg">管理您的投资记录</Text>
                  <Text type="secondary" className="block">
                    智能跟踪投资收益，分析投资趋势，优化资产配置
                  </Text>
                </div>
                {/* <Button
                  type="default"
                  icon={<WalletOutlined />}
                  block
                  onClick={() => handleNavigate('/moneybook')}
                >
                  开始投资
                </Button> */}
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
          {/* 支出管理区域 */}
          <Col xs={24} md={12}>
            <Card
              title={<div className="flex items-center"><TransactionOutlined className="mr-2" />支出管理</div>}
              className=" shadow-md hover:shadow-lg transition-shadow"
              extra={<Button type="primary" onClick={() => handleNavigate('/code')}>进入</Button>}
            >
              <div className="flex flex-col h-56 justify-between">
                <div className="text-center p-4">
                  <img src="/expense.svg" alt="支出" className="w-20 h-20 mx-auto mb-4" />
                  <Text className="block mb-2 text-lg">管理您的消费支出</Text>
                  <Text type="secondary" className="block">
                    一眼看清，这个月钱花去哪了。
                  </Text>
                </div>
                {/* <Button
                  type="default"
                  icon={<KeyOutlined />}
                  block
                  onClick={() => handleNavigate('/code')}
                >
                  管理密码
                </Button> */}
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
                  {/* <Button
                    type="primary"
                    onClick={() => {
                      setExpenseModalOpen(true)
                    }}
                  >
                    开始记月支出
                  </Button> */}
                  <Button
                    type="primary"
                    onClick={() => {
                      setModalOpen(true)
                    }}
                  >
                    添加现金流项目
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
                      修改现金流项目数值 <DownOutlined />
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
                      删除现金流项目 <DownOutlined />
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
                    {/* 右侧占领水平的1 。因为左侧也占领水平的1，所以总水平是2，而右侧的flex-1 会占领水平的1/2 */}
                    <div className="w-4/5 h-full">

                      <div className=" flex  h-full w-full">
                        {/* 支出部分作为一个独立的页面，所以删去 */}
                        {/* <div className="w-1/2 h-full">
                          <ChartComponent data={expenseLineChart} />
                        </div> */}
                        {
                          cashItems.length == 0 ?
                            <div className="w-full h-full  flex justify-center items-center">
                              <Empty
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                description="还没有现金流记录,欢迎添加"
                              >
                              </Empty></div> :
                            <div className="w-full h-full  flex justify-center items-centerl">
                              <ChartComponent data={pieChart} />
                            </div>
                        }





                        {/* 我想把历史记录的详情，放到新的页面中，可能未来在做一个现金流的详情页，同一只在首页展示总览。 */}
                        {/* {showLineChart && (
                          <div className="w-1/3 h-full relative">
                            <Button
                              type="text"
                              icon={<CloseOutlined />}
                              onClick={handleCloseLineChart}
                              style={{
                                position: 'absolute',
                                top: '8px',
                                right: '8px',
                                zIndex: 10,
                                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                border: 'none',
                                borderRadius: '50%',
                                width: '32px',
                                height: '32px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            />
                            <ChartComponent data={lineChart} />
                          </div>
                        )} */}
                      </div>

                    </div>
                    {/* 左侧占领水平的1 */}
                    <div className="w-1/6 ">
                      <div className="p-3 rounded-lg hover:bg-green-50 transition-colors duration-200">
                        <Text type="secondary" className="block text-center text-sm">总现金</Text>
                        <div className="text-lg font-bold text-green-500 text-center">{total}</div>
                      </div>
                      <div className="p-3 rounded-lg hover:bg-red-50 transition-colors duration-200">
                        <Text type="secondary" className="block text-center text-sm">上月支出</Text>
                        <div className="text-lg font-bold text-red-500 text-center">
                          {expenseRecordMonthly.at(-1)?.total ?? 0}          {/* 取数组最后一个元素；防止undifined*/}
                        </div>
                      </div>
                      {/* <div className="p-3 rounded-lg hover:bg-blue-50 transition-colors duration-200">
                        <Text type="secondary" className="block text-center text-sm">结余</Text>
                        <div className="text-lg font-bold text-blue-500 text-center">¥0</div>
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </Content >
      <CashModal
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        handleOk={handleCreateCashItem}
        loading={loading} form={form}
        title="添加你的现金项目" />
      <CashModal
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
      <ExpenseModal
        modalOpen={expenseModalOpen}
        setModalOpen={setExpenseModalOpen}
        form={expenseForm}
        title="添加你的月支出"
        handleOk={handleCreateExpense}
      >
      </ExpenseModal>

    </Layout >
  );
}

export default Home;
