import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BackHome from "../components/BackHome";
import SwitchToFinished from "../components/SwitchToFinished";
import {
  Form,
  message,
  Card,
  Row,
  Col,
  Typography,
  Tag,
  Button,
  Dropdown,
  Popconfirm,
  Pagination,
  Tooltip
} from "antd";
import {

  BarChartOutlined,
  CaretUpOutlined,
  DeleteOutlined,
  DownOutlined,
  QuestionCircleOutlined,
  AccountBookOutlined

} from "@ant-design/icons";
import InvestModal from "../components/InvestModal";
import { createInvestItem, getInvestItem, deleteInvestItem, checkDuplicateInvestment, patchInvestment } from "../api/invest";
import { use } from "react";




const { Text, Title } = Typography;

function MoneyBook() {
  const navigate = useNavigate(); //路由跳转
  const [investItems, setInvestItems] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [finishModalOpen, setFinishModalOpen] = useState(false);
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm();
  const [title, setTitle] = useState("Add New Invest Item");
  const [finishTitle, setFinishTitle] = useState("Finish your Invest Item");
  const [type, setType] = useState("buy");
  const [finishForm] = Form.useForm();
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [active, setActive] = useState(true);

  //这个是否需要封装成组件?可做可不做，重复率并不是很高
  // //最后还是选择封装成组件了
  const dropdownItems = (type, getLable, clickFuction, danger) => {
    return investItems.map((item, index) => (
      {
        label: getLable(item),
        key: index.toString(),
        icon: <AccountBookOutlined />,
        danger: danger,
        //...代表展开另一个对象，加入到原对象
        ...(type === 'finish' && { onClick: () => clickFuction(item) })
      }));

  }

  const getDeleteLabel = (item) => (
    <Popconfirm
      title="Delete the item"
      description={`Are you sure to delete ${item.itemName}?`}
      okText="Yes"
      cancelText="No"
      icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
      okType="danger"
      onConfirm={() => handleDelete(item._id)}
    >
      <div
        style={{
          whiteSpace: 'normal',
          wordWrap: 'break-word',
          width: '100%',
          lineHeight: '1.2',
        }}
      >
        {item.itemName}
      </div>
    </Popconfirm>
  );

  const getFinishLable = (item) => (
    <div
      style={{
        whiteSpace: 'normal',
        wordWrap: 'break-word',
        width: '100%',
        lineHeight: '1.2',
      }}
    >
      {item.itemName}
    </div>
  );
  const clickFinish = async (item) => {
    await finishForm.setFieldsValue({
      itemId: item._id,
    });
    setFinishModalOpen(true);
  }
  const handleFinish = async () => {
    setLoading(true);

    try {
      const values = await finishForm.validateFields();
      console.log(values.epilogue)
      console.log(values.itemId)
      const response = await patchInvestment(values.itemId, values.epilogue);
      if (response.status === 200) {
        message.success("Invest item finished successfully");
        fetchInvestItems();
      }
      else {
        message.error("Failed to finish invest item");
      }
      setFinishModalOpen(false);
    } catch (error) {
      console.error("Error creating invest item:", error);
    }
    finally {
      setLoading(false);

    }
  }





  const getMenuProps = (type) => {
    switch (type) {
      case 'delete':
        return { items: dropdownItems("delete", getDeleteLabel, null, true) };
      case 'finish':
        return { items: dropdownItems("finish", getFinishLable, clickFinish, false) };
      default:
        return { items: [] };
    }
  };
  const handleOk = async () => {
    setLoading(true);
    try {
      const values = await form.validateFields();
      const response = await createInvestItem(values.itemName,
        values.description, -values.price * values.amount, values.price, values.amount, values.price * values.amount, type, values.investDate, values.note);
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


  const handleDelete = async (itemId) => {
    console.log(itemId)
    const response = await deleteInvestItem(itemId);
    if (response.status === 200) {
      message.success(response.data.message);
      fetchInvestItems()
    }
    else {
      message.error(response.data.message);
    }
  };

  const fetchInvestItems = async (type) => {
    try {
      let response;
      if (type === 'inactive')
        response = await getInvestItem(currentPage, pageSize, false);
      else response = await getInvestItem(currentPage, pageSize, true);
      const { data } = response;
      // console.log(data);
      setInvestItems(data.data);
      setTotalItems(data.total);
      setCurrentPage(1);
    } catch (error) {
      message.error(error.message);
    }
  };


  const checkName = async (itemName) => {
    try {
      const response = await checkDuplicateInvestment(itemName);
      return response.data.isExist;
    }
    catch (error) {
      message.error(error.message);
    }


  };


  useEffect(() => {
    fetchInvestItems();
  }, []);


  const formatDate = (dateString) => {
    if (!dateString) return '';

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
    } catch (error) {
      console.error('日期格式化错误:', error);
      return dateString;
    }
  };

  const pageChange = (page, pageSize) => {
    console.log(page, pageSize);
  };


  return (
    <div className="h-screen w-screen bg-gradient-to-r from-green-100 to-white flex items-center justify-center relative">
      {/* book区域 */}
      {/* 投资项目区域 - 一个一个展示 */}
      <div className=" bg-gradient-to-r from-green-100 to-white  w-2/3 h-2/3 flex flex-col ">
        <Row gutter={[24, 24]} justify="left" >
          {investItems.map((item, index) => (
            <Col key={index} span={6}>
              <Card
                // title={<div className="flex items-center"><StockOutlined className="mr-2" />投资管理</div>}
                onClick={() => {
                  navigate(`/moneybook/${item._id}`)
                }}
                className="                  
                shadow-md
                hover:shadow-2xl
                hover:scale-105
                transition
                duration-300
                ease-in-out
                hover:bg-gray-50
                "
                style={{ height: 280 }}

              // extra={<Button type="primary" danger >删除项目 <DeleteOutlined /></Button>}

              >
                <div className="flex flex-col h-full justify-between ">
                  <div className="text-center px-4">
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
                      {item.description}
                    </Text>
                    <div className=" flex justify-center gap-4 mt-4 absolute bottom-4 left-4 right-4">
                      <div className="text-center">
                        <Text type="secondary" className="block text-xs">创建时间</Text>
                        <Text className="text-sm">{formatDate(item.createDate)}</Text>
                      </div>
                      <div className="text-center">
                        <Text type="secondary" className="block text-xs">状态</Text>
                        {
                          item.active ? (
                            <Tag color="success" className="text-xs ml-2">活跃</Tag>
                          ) : (
                            <Tag color="default" className="text-xs ml-2">完结</Tag>
                          )
                        }

                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </Col>


          ))}

        </Row>

        {/* 分页放在Row外面 */}
        <div className="mt-10 flex justify-center py-4">
          <Pagination defaultCurrent={currentPage} defaultPageSize={8} total={totalItems} pageSize={pageSize} showSizeChanger={false} />
        </div>
      </div>

      {/* 新增投资项目 */}
      <div className="absolute top-10 right-6">
        <button
          onClick={setModalOpen}
          className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition duration-300 mr-4"
        >
          开始投资
        </button>
        <Dropdown
          placement="bottom"
          //控制不同下拉框
          menu={getMenuProps("delete")}
          overlayStyle={{
            minWidth: '200px', // 设置最小宽度与按钮一致
            maxWidth: '200px'  // 设置最大宽度
          }}
        >
          <button type="primary" className="px-6 py-3 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition duration-300 mr-4">
            删除项目 <DownOutlined />
          </button>
        </Dropdown>
        <Dropdown
          placement="bottom"
          menu={getMenuProps("finish")}
          overlayStyle={{
            minWidth: '200px', // 设置最小宽度与按钮一致
            maxWidth: '200px'  // 设置最大宽度
          }}
        >
          <button type="primary" className="px-6 py-3 bg-gray-400 text-white font-semibold rounded-lg shadow-md hover:bg-gray-500 transition duration-300 mr-4">
            完结项目 <DownOutlined />
          </button>
        </Dropdown>
      </div>

      <InvestModal
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        handleOk={handleOk}
        loading={loading}
        form={form}
        title={title}
        startInvesting={true}
        needNote={true}
        checkName={checkName}
      />

      <InvestModal
        modalOpen={finishModalOpen}
        setModalOpen={setFinishModalOpen}
        handleOk={handleFinish}
        loading={loading}
        form={finishForm}
        title={finishTitle}
        finish={true}
      />

      {/* <ChartComponent
        data={{
          chartType: 'mixed',
          chartData: mixedChartData,
          chartOptions: mixedChartOptions
        }}
      /> */}

      <div className="absolute top-10 left-10 flex">
        <BackHome></BackHome>

        <SwitchToFinished onClick={
          () => {
            console.log("切换到历史")
            if (active) {
              fetchInvestItems("inactive")
              setActive(false)
            }
            else {
              fetchInvestItems("active")
              setActive(true)
            }
          }

        }
          active={active}></SwitchToFinished>
      </div>

    </div >
  );
}

export default MoneyBook;
