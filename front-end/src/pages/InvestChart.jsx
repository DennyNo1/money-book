import BackHome from "../components/BackHome";
import BackBook from "../components/BackBook";
import React, { useState, useEffect } from "react";
import InvestModal from "../components/InvestModal";
import {
    Form,
    message,

} from "antd";
import { makeInvest, getInvestmentHistory } from "../api/invest";
import { useParams } from "react-router-dom";
import ChartComponent from "../components/ChartComponent";

function InvestChart() {
    const [modalOpen, setModalOpen] = useState(false);
    //感觉买入和卖出都可以用一个form，最后像后端发送数据时标注
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false)
    const [title, setTitle] = useState("");
    const { book_id } = useParams();
    const [chartData, setChartData] = useState({
        item: {
            itemName: "",
        },
        history: [{
            investDate: "2023-07-01"
        }],
    });
    const [currentBalance, setCurrentBalance] = useState(0);

    const handleOk = async () => {
        try {
            setLoading(true);
            const values = await form.validateFields();
            const response = await makeInvest(
                book_id,
                title === 'Buy' ? currentBalance - values.price * values.amount : currentBalance + values.price * values.amount,
                values.price,
                values.amount,
                values.price * values.amount,
                title === 'Buy' ? 'buy' : 'sell',
                values.investDate,
                values.note
            )
            // Axios 默认会将所有非2xx状态码视为错误。
            if (response.status === 200) {
                message.success("Making an investment successfully");
                setModalOpen(false);
                fetchInvestmentHistory()
            }
        } catch (error) {
            console.error("Error making an investment:", error);
            message.error("Failed to make an investment");
        }
        finally {
            setLoading(false);
        }
    }
    const handleModal = (type) => {
        if (type === "buy") {
            setTitle("Buy");
        } else {
            setTitle("Sell");
        }
        setModalOpen(true);
    }
    const fetchInvestmentHistory = async () => {
        const response = await getInvestmentHistory(book_id)

        setChartData(response.data)
        setCurrentBalance(response.data.item.balance)

    }
    const formatDate = (date) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    useEffect(() => {
        // 获取路由参数
        fetchInvestmentHistory();
    }, []);

    const mixedChartData = {
        labels: chartData.history && chartData.history.length > 0
            ? chartData.history.map(item => formatDate(item.investDate))
            : [],
        datasets: [
            {
                type: 'bar',  // 柱状图数据集
                label: '单次投资数额',
                data: chartData.history && chartData.history.length > 0
                    ? chartData.history.map(item => item.type === 'buy' ? -item.total : item.total) : []
                ,
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
                yAxisID: 'y',  // 使用左侧Y轴
                maxBarThickness: 50,  // 设置柱状图的最大宽度为50像素

            },
            {
                type: 'line',  // 折线图数据集
                label: '当时盈余',
                data: chartData.history && chartData.history.length > 0
                    ? chartData.history.map(item => item.balance) : [],
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 2,
                fill: false,
                yAxisID: 'y1',  // 使用右侧Y轴
                pointRadius: 10,        // 设置点的大小
                pointHoverRadius: 15,   // 鼠标悬停时点的大小

            }
        ]
    };

    const mixedChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                text: chartData.item.itemName + '投资总览'
            },
            legend: {
                position: 'top'
            }
        },
        scales: {
            x: {
                display: true,
                title: {
                    display: true,
                    text: '日期'
                },

            },
            y: {
                type: 'linear',
                display: true,
                position: 'left',
                title: {
                    display: true,
                    text: '单次投资数额'
                }
            },
            y1: {
                type: 'linear',
                display: true,
                position: 'right',
                title: {
                    display: true,
                    text: '当时盈余'
                },
                grid: {
                    drawOnChartArea: false  // 避免网格线重叠
                },

            }
        }
    };


    return (

        <div className="h-screen w-screen bg-gradient-to-r from-green-100 to-white flex items-center justify-center relative">
            <div className="absolute top-10 left-10 flex">
                <BackHome></BackHome>
                <BackBook path='/moneybook'></BackBook>
            </div>
            <div className="absolute top-10 right-6">
                <button
                    onClick={() => { handleModal("buy") }}
                    className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition duration-300 mr-4"
                >
                    买入
                </button>
                <button
                    onClick={() => { handleModal("sell") }}
                    className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition duration-300"
                >
                    卖出
                </button>
            </div>
            <div className="w-3/4 h-3/4">
                <ChartComponent
                    data={{
                        chartType: 'mixed',
                        chartData: mixedChartData,
                        chartOptions: mixedChartOptions
                    }}
                />
            </div>
            <InvestModal modalOpen={modalOpen} setModalOpen={setModalOpen} handleOk={handleOk} loading={loading} form={form} title={title} needNote={true} />
        </div>
    )
}

export default InvestChart;