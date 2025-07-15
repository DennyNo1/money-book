import React, { useState, useEffect } from "react";
import { addBook, getAllBooks, deleteBook } from "../api/book";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import BackHome from "../components/BackHome";
import {
  Form,
  message,
} from "antd";
import InvestModal from "../components/InvestModal";
import { createCashItem } from "../api/invest";
import ChartComponent from "../components/ChartComponent";

function MoneyBook() {
  const navigate = useNavigate(); //路由跳转
  const [showModal, setShowModal] = useState(false);
  const [books, setBooks] = useState([]);
  const [error, setError] = useState([]);
  const [input, setInput] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm();
  const title = "Add New Invest Item";
  const neeItemName = true;
  const type = "buy";
  const handleOk = async () => {
    setLoading(true);
    try {
      const values = await form.validateFields();
      const response = await createCashItem(values.itemName, -values.price * values.amount, values.price, values.amount, values.price * values.amount, type, values.investDate);
      if (response.status === 200) {
        message.success("Invest item created successfully");
      } else {
        message.error("Failed to create invest item");
      }
    } catch (error) {
      console.error("Error creating invest item:", error);
    }
    finally {
      setLoading(false);
      setModalOpen(false);
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

  const fetchBooks = async () => {
    try {
      const { data } = await getAllBooks(localStorage.getItem("user_id"));
      // console.log(data);
      setBooks(data);
    } catch (error) {
      setError("Error fetching books");
    }
  };


  useEffect(() => {
    fetchBooks();
  }, []);

  // const mixedChartData = {
  //   labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
  //   datasets: [
  //     {
  //       type: 'bar',  // 柱状图数据集
  //       label: '销售额',
  //       data: [12, 19, 3, 5, 2, 3],
  //       backgroundColor: 'rgba(54, 162, 235, 0.5)',
  //       borderColor: 'rgba(54, 162, 235, 1)',
  //       borderWidth: 1,
  //       yAxisID: 'y'  // 使用左侧Y轴
  //     },
  //     {
  //       type: 'line',  // 折线图数据集
  //       label: '增长率',
  //       data: [65, 59, 80, 81, 56, 55],
  //       backgroundColor: 'rgba(255, 99, 132, 0.2)',
  //       borderColor: 'rgba(255, 99, 132, 1)',
  //       borderWidth: 2,
  //       fill: false,
  //       yAxisID: 'y1'  // 使用右侧Y轴
  //     }
  //   ]
  // };

  // const mixedChartOptions = {
  //   responsive: true,
  //   plugins: {
  //     title: {
  //       display: true,
  //       text: '销售额与增长率对比'
  //     },
  //     legend: {
  //       position: 'top'
  //     }
  //   },
  //   scales: {
  //     x: {
  //       display: true,
  //       title: {
  //         display: true,
  //         text: '月份'
  //       }
  //     },
  //     y: {
  //       type: 'linear',
  //       display: true,
  //       position: 'left',
  //       title: {
  //         display: true,
  //         text: '销售额 (万元)'
  //       }
  //     },
  //     y1: {
  //       type: 'linear',
  //       display: true,
  //       position: 'right',
  //       title: {
  //         display: true,
  //         text: '增长率 (%)'
  //       },
  //       grid: {
  //         drawOnChartArea: false  // 避免网格线重叠
  //       }
  //     }
  //   }
  // };

  return (
    <div className="h-screen w-screen bg-gradient-to-r from-green-100 to-white flex items-center justify-center relative">
      {/* book区域 */}
      <div className="flex items-center justify-center gap-4 p-4">
        {books.map((book, index) => (
          <div
            className="border w-48 h-64 bg-white shadow-lg rounded-md p-4 flex flex-col justify-between items-center border-gray-300 transition-transform duration-300 transform hover:scale-105 relative"
            key={index}
          >
            <img
              src="/cover.svg"
              onClick={() => navigate(`/moneybook/${book._id}`)}
            ></img>
            <h2
              className="font-semibold text-gray-800 cursor-pointer my-8"
              onClick={() => navigate(`/moneybook/${book._id}`)}
            >
              {book.name}
            </h2>
            {/* 删除按钮 */}
            <button
              onClick={() => handleDelete(book)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 font-bold text-2xl"
            >
              &times;
            </button>
            <div
              className="w-full h-full  "
              onClick={() => navigate(`/moneybook/${book._id}`)}
            ></div>
          </div>
        ))}
      </div>

      {/* 新增书本 */}
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
