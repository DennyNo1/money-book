import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BackHome from "../components/BackHome";
import {
  Form,
  message,
  Card,
  Row,
  Col,
  Typography,
  Tag,
} from "antd";
import {

  BarChartOutlined,
  CaretUpOutlined,

} from "@ant-design/icons";
import InvestModal from "../components/InvestModal";
import { createCashItem, getInvestItem } from "../api/invest";


const { Text, Title } = Typography;

function MoneyBook() {
  const navigate = useNavigate(); //路由跳转
  const [investItems, setInvestItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState([]);
  const [input, setInput] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm();
  const [title, setTitle] = useState("Add New Invest Item");
  const [neeItemName, setNeeItemName] = useState(true);
  const [type, setType] = useState("buy");
  const handleOk = async () => {
    setLoading(true);
    try {
      const values = await form.validateFields();
      const response = await createCashItem(values.itemName, values.price * values.amount, values.price, values.amount, values.price * values.amount, type, values.investDate);
      if (response.status === 200) {
        message.success("Invest item created successfully");
        fetchInvestItems();
      } else {
        message.error("Failed to create invest item");
      }
      setModalOpen(false);
    } catch (error) {
      console.error("Error creating invest item:", error);
    }
    finally {
      setLoading(false);

    }
  }
  const handleOpenModal = () => {
    setModalOpen(true);
  }

  const handleDelete = (book) => {
    console.log(book);
    setSelectedBook(book);
    setShowDeleteModal(true);
  };

  const fetchInvestItems = async () => {
    try {
      const { data } = await getInvestItem();
      console.log(data);
      setInvestItems(data);
    } catch (error) {
      setError("Error fetching books");
    }
  };


  useEffect(() => {
    fetchInvestItems();
  }, []);



  return (
    <div className="h-screen w-screen bg-gradient-to-r from-green-100 to-white flex items-center justify-center relative">
      {/* book区域 */}
      {/* 投资项目区域 - 一个一个展示 */}
      <div className="px-6 bg-gradient-to-r from-green-100 to-white  w-2/3 h-2/3">
        <Row gutter={[24, 24]} justify="left">
          {investItems.map((item, index) => (
            <Col key={index} span={6}>
              <Card
                // title={<div className="flex items-center"><StockOutlined className="mr-2" />投资管理</div>}
                onClick={() => {
                  navigate(`/moneybook/${item._id}`)
                }}
                className="                  shadow-md
                  hover:shadow-2xl
                  hover:scale-105
   
                  transition
                  duration-300
                  ease-in-out
      
                 hover:bg-gray-50"
              // extra={<Button type="primary" onClick={() => navigate(`/moneybook/${item._id}`)}>进入</Button>}
              >
                <div className="flex flex-col h-56 justify-between">
                  <div className="text-center p-4">
                    <div className="w-20 h-20 mx-auto mb-4 relative">
                      <div className="w-full h-full bg-gradient-to-br from-green-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                        <BarChartOutlined className="text-3xl text-white" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <CaretUpOutlined className="text-xs text-white" />
                      </div>
                    </div>
                    <Text className="block mb-2 text-lg">{item.itemName}</Text>
                    <Text type="secondary" className="block">
                      {item.itemName}
                    </Text>
                    <div className="mt-3 flex justify-center gap-4">
                      <div className="text-center">
                        <Text type="secondary" className="block text-xs">创建时间</Text>
                        <Text className="text-sm">{new Date(item.createdAt).toLocaleDateString()}</Text>
                      </div>
                      <div className="text-center">
                        <Text type="secondary" className="block text-xs">状态</Text>
                        <Tag color="success" className="text-xs">活跃</Tag>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </Col>


          ))}


        </Row>
      </div>

      {/* 新增投资项目 */}
      <div className="absolute top-10 right-6">
        <button
          onClick={handleOpenModal}
          className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition duration-300"
        >
          开始投资
        </button>
      </div>

      <InvestModal
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        handleOk={handleOk}
        loading={loading}
        form={form}
        title={title}
        neeItemName={neeItemName}
      />

      {/* <ChartComponent
        data={{
          chartType: 'mixed',
          chartData: mixedChartData,
          chartOptions: mixedChartOptions
        }}
      /> */}
      <BackHome></BackHome>
    </div>
  );
}

export default MoneyBook;
