import React from 'react';
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';

// 注册Chart.js组件
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

function ChartComponent(props) {
    const pieChart = props.data
    const { chartType, chartData, chartOptions } = pieChart;
    // 准备数据
    const data = chartData
        || {
        labels: ['一月', '二月', '三月', '四月', '五月', '六月'],
        datasets: [
            {
                label: '销售额',
                data: [12, 19, 3, 5, 2, 3],
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    // 配置选项
    const options = chartOptions
        || {
        scales: {
            y: {
                beginAtZero: true
            }
        },
        plugins: {
            title: {
                display: true,
                text: '默认标题'
            }
        }
    };

    // 根据chartType参数选择要渲染的图表类型
    const renderChart = () => {
        switch (chartType.toLowerCase()) {
            case 'doughnut':
                return <Doughnut data={data} options={options} />;
            case 'line':
                return <Line data={data} options={options} />;
            case 'pie':
                return <Pie data={data} options={options} />;
            case 'bar':
            default:
                return <Bar data={data} options={options} />;
        }
    };

    return (
        <div className="w-full h-full border-2 border-red-500">
            {renderChart()}
        </div>
    );
}

export default ChartComponent;