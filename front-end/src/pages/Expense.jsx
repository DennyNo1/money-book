import { useEffect, useState, useMemo } from "react";
import {
    Row,
    Col,
    Card,
    Empty,
    Button,
    Typography,
    message,
    Layout,
    DatePicker,
    Space,
    Upload,
    Spin,

} from "antd";
import dayjs from 'dayjs';
import * as XLSX from "xlsx";
import { importAliRecords, getExpenseRecordsMonthly } from "../api/expenseTwo";
import { importWechatRecordWithAI } from "../api/expenseTwo";
import ChartComponent from "../components/ChartComponent";
import { CATEGORY_COLORS } from "../utils/CategoryColors";





const { Title, Text } = Typography;
const { Header, Content } = Layout;

export default function Expense() {
    const [datePicker, setDatePicker] = useState(dayjs(new Date()));
    const [recordsMonthly, setRecordsMonthly] = useState([]);
    const [spinning, setSpinning] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const res = await getExpenseRecordsMonthly(datePicker.year(), datePicker.month() + 1);
            setRecordsMonthly(res.data.records);

        };
        fetchData();

    }, [datePicker]);

    const datePickerOnChange = (date, dateString) => {
        if (!date) return;        // 或者给默认值
        setDatePicker(date);

    }
    //
    const totalAmountMonthly = useMemo(() => {
        let total = 0;
        for (let i = 0; i < recordsMonthly.length; i++) {
            total += recordsMonthly[i].amount;
        }
        //只保留两位小数
        return Number(total.toFixed(2));
    }, [recordsMonthly]);

    const maxAmountMonthly = useMemo(() => {
        let max = 0;
        recordsMonthly.forEach(r => {
            max = Math.max(max, r.amount);
        });
        return max;
    }, [recordsMonthly]);

    // 线状图的数据和选项

    const lineData = useMemo(() => {
        if (!recordsMonthly.length) return null;
        // 按时间升序排序
        // 里面的 ... 叫 展开运算符（spread operator），
        // 作用：把数组“拆开”，生成一个新的数组副本。
        const sorted = [...recordsMonthly].sort(
            (a, b) => new Date(a.expenseDate) - new Date(b.expenseDate)
        );
        const dateMap = {};
        sorted.forEach(r => {
            // 以天为单位
            r.expenseDate = dayjs(r.expenseDate).format("YYYY-MM-DD");
            dateMap[r.expenseDate] = (dateMap[r.expenseDate] || 0) + r.amount;

        });
        return {
            labels: Object.keys(dateMap),
            datasets: [
                {
                    label: "金额",
                    data: Object.values(dateMap),
                    backgroundColor: "rgba(75, 192, 192, 0.2)",
                    borderColor: "rgba(75, 192, 192, 1)",
                    borderWidth: 1,
                },
            ],
        }


    }, [recordsMonthly]);
    // line先不需要option
    const lineOptions = {
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
    }
    const lineChart = useMemo(() => ({
        chartType: 'line',
        chartData: lineData,
        chartOptions: lineOptions,
    }), [lineData, lineOptions]);

    const pieData = useMemo(() => {
        if (!recordsMonthly.length) return null;

        const categoryMap = {};

        recordsMonthly.forEach(r => {
            categoryMap[r.category] =
                (categoryMap[r.category] || 0) + r.amount;
        });

        return {
            labels: Object.keys(categoryMap),
            datasets: [
                {
                    data: Object.values(categoryMap),
                    backgroundColor: Object.keys(categoryMap).map(
                        c => CATEGORY_COLORS[c] || '#9ca3af'
                    ),
                },
            ],
        };
    }, [recordsMonthly]);
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
            // // 检查是否点击到了图表元素
            // if (elements.length > 0) {
            //     const clickedElementIndex = elements[0].index;
            //     const clickedItem = cashItems[clickedElementIndex];
            //     // 执行对应的功能
            //     handlePieChartClick(clickedItem, clickedElementIndex);
            // }
        },

    }
    const pieChart = useMemo(() => ({
        chartType: 'pie',
        chartData: pieData,
        chartOptions: pieOptions,
    }), [pieData, pieOptions]);


    //用于解析支付宝支出csv文件并获取对应的数据
    const parseAliCsvAndValidate = async (text) => {
        const lines = text.split(/\r?\n/); // 支持 \n 或 \r\n
        const data = [];

        for (let i = 11; i < lines.length; i++) { // 第 12 行 index = 11
            const line = lines[i].trim();
            if (!line) continue; // 空行跳过

            const cols = line.split(",");
            if (cols.length < 4) continue; // 不够列跳过
            data.push({
                expenseDate: cols[0],       // 第一列
                category: cols[1],   // 第二列
                amount: cols[3],  // 第四列
                payObject: cols[4],
                payMethod: cols[5],
                source: "alipay"
            });
        }
        try {
            await importAliRecords(data);
            message.success("导入支付宝记录成功");

        } catch (error) {
            console.log(error);
            message.error("导入支付宝记录失败失败，请检查文件格式是否正确和反馈给Denny");
        }

        // console.log(data);
    }

    //用于解析微信支出xlsx文件并获取对应数据
    const parseWechatXlsx = async (data) => {
        const workbook = XLSX.read(data, { type: "array" }); // 解析为 workbook
        // 选择第一个 sheet
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        // 转为 JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }); // header:1 返回二维数组
        // jsonData 是二维数组，每一行是一个数组

        const formatedData = [];
        // 从18行开始
        for (let i = 17; i < jsonData.length; i++) {
            const row = jsonData[i];
            formatedData.push({
                //日期、金额、支付对象、支付方式，差个类别，交给后端AI去判断
                expenseDate: row[0],
                payObject: row[2] + row[3],
                amount: row[5].slice(1),
                payMethod: row[6],
                source: "wechat"
            });
        }

        //之后把consolelog替换成消息提示
        try {

            await importWechatRecordWithAI(formatedData);
            message.success("导入微信记录成功");

        } catch (err) {
            console.log(err);
            message.error("导入微信记录失败失败，请检查文件格式是否正确或者反馈给Denny");
        }

    }

    return (
        <Layout className="h-screen ">
            <Spin spinning={spinning} fullscreen />
            {/* AppBar */}
            <Header className="h-1/8 bg-gradient-to-r from-green-100 to-white shadow-md px-6 flex justify-between items-center">
                <div className="flex items-center">
                    <img src="/logo.svg" alt="Logo" className="h-8 mr-4" />
                    <Title level={4} style={{ margin: 0 }}>支出管理</Title>
                </div>
                <Button onClick={() => window.history.back()}
                >返回</Button>
            </Header>

            <Content className="px-6 bg-gradient-to-r from-green-100 to-white ">
                <Row >
                    <Col span={6}>
                        <Card
                            title={<div >月份选择</div>}
                        >
                            <DatePicker onChange={datePickerOnChange} picker="month" defaultValue={datePicker} />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card
                            title={<div >上传支出记录</div>}
                        >

                            <Space>
                                <Upload
                                    //已经对文件类型做了校验
                                    accept=".csv"
                                    showUploadList={false}
                                    beforeUpload={(file) => {
                                        const reader = new FileReader();
                                        //onload是readastext的回调。一般性，反而是回调函数写在前头。
                                        reader.onload = async (e) => {
                                            // 调用你的 CSV 校验和解析逻辑
                                            const arrayBuffer = e.target.result; // 读取为 ArrayBuffer
                                            const decoder = new TextDecoder("gbk"); // 或 "utf-16le"
                                            const text = decoder.decode(arrayBuffer);
                                            setSpinning(true);
                                            await parseAliCsvAndValidate(text);
                                            setSpinning(false);
                                        };
                                        reader.readAsArrayBuffer(file);
                                        return false; // 阻止默认上传
                                    }}
                                >
                                    <Button style={{
                                        backgroundColor: '#1E90FF',
                                        borderColor: '#1E90FF',
                                        color: '#fff'                // 自定义文字色
                                    }} >
                                        支付宝
                                    </Button>
                                </Upload>
                                <Upload
                                    //已经对文件类型做了校验
                                    accept=".xlsx"
                                    showUploadList={false}
                                    beforeUpload={(file) => {
                                        const reader = new FileReader();
                                        //onload是readastext的回调。一般性，反而是回调函数写在前头。
                                        reader.onload = async (e) => {

                                            // 调用xlsx 校验和解析逻辑
                                            const data = new Uint8Array(e.target.result);
                                            setSpinning(true);
                                            await parseWechatXlsx(data);
                                            setSpinning(false);
                                        }
                                        reader.readAsArrayBuffer(file); // XLSX 文件必须用 arrayBuffer
                                        return false; // 阻止 Upload 自动上传
                                    }}
                                >
                                    <Button type="primary" >
                                        微信
                                    </Button>
                                </Upload>
                            </Space>
                        </Card>
                    </Col>
                </Row>
                <Row >
                    <Col span={4}>
                        <Card
                            title={<div >核心数字</div>}
                        >
                            <div className="p-3 rounded-lg hover:bg-green-50 transition-colors duration-200">
                                <Text type="secondary" className="block text-center text-sm">本月总支出</Text>
                                <div className="text-lg font-bold text-blue-400 text-center">
                                    {totalAmountMonthly}
                                </div>
                            </div>
                            <div className="p-3 rounded-lg hover:bg-red-50 transition-colors duration-200">
                                <Text type="secondary" className="block text-center text-sm">最大单笔支出</Text>
                                <div className="text-lg font-bold text-amber-500 text-center">
                                    {maxAmountMonthly}
                                </div>
                            </div>
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card
                            title={<div >月度支出分布</div>}
                        >
                            {pieData && <ChartComponent data={pieChart} />}
                            {
                                !pieData && <Empty
                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                    description="还没有支出记录,欢迎添加"
                                >
                                </Empty>
                            }
                        </Card>
                    </Col>
                </Row>

                <Row >
                    <Col span={12}>
                        <Card
                            title={<div >月度支出趋势</div>}
                        >
                            {lineData && <ChartComponent data={lineChart} />}
                            {!lineData && <Empty
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                description="还没有支出记录,欢迎添加"
                            >
                            </Empty>
                            }

                        </Card>
                    </Col>
                </Row>

            </Content>

        </Layout >
    )
}