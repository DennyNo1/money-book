import { useEffect, useState } from "react";
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
    Upload
} from "antd";
import dayjs from 'dayjs';
import * as XLSX from "xlsx";
import { importAliRecords, getExpenseTwoByMonth } from "../api/expenseTwo";
import { importWechatRecordWithAI } from "../api/expenseTwo";




const { Title, Text } = Typography;
const { Header, Content } = Layout;

export default function Expense() {
    const [datePicker, setDatePicker] = useState(dayjs(new Date()));

    const datePickerOnChange = (date, dateString) => {
        console.log(date, dateString);
        setDatePicker(date);

    }
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
            });
        }
        try {
            await importAliRecords(data);

        } catch (error) {
            console.log(error);
        }

        // console.log(data);
    }

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
            });
        }

        //之后把consolelog替换成消息提示
        try {
            console.log(formatedData);
            const res = await importWechatRecordWithAI(formatedData);
            console.log("AI返回的结果是：", res);
        } catch (err) {
            console.log("调用AI接口出错：", err);
        }

    }

    return (
        <Layout className="h-screen ">
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
                            title={<div >日期选择</div>}
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
                                    beforeUpload={(file) => {
                                        const reader = new FileReader();
                                        //onload是readastext的回调。一般性，反而是回调函数写在前头。
                                        reader.onload = (e) => {

                                            // 调用你的 CSV 校验和解析逻辑
                                            const arrayBuffer = e.target.result; // 读取为 ArrayBuffer
                                            const decoder = new TextDecoder("gbk"); // 或 "utf-16le"
                                            const text = decoder.decode(arrayBuffer);
                                            parseAliCsvAndValidate(text);
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
                                    beforeUpload={(file) => {
                                        const reader = new FileReader();
                                        //onload是readastext的回调。一般性，反而是回调函数写在前头。
                                        reader.onload = (e) => {

                                            // 调用xlsx 校验和解析逻辑
                                            const data = new Uint8Array(e.target.result);
                                            parseWechatXlsx(data);



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
                                <div className="text-lg font-bold text-green-500 text-center">123</div>
                            </div>
                            <div className="p-3 rounded-lg hover:bg-red-50 transition-colors duration-200">
                                <Text type="secondary" className="block text-center text-sm">最大单笔支出</Text>
                                <div className="text-lg font-bold text-red-500 text-center">
                                    321
                                </div>
                            </div>
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card
                            title={<div >支出分布</div>}
                        >
                            {/* 这里的row和col是自适应高度，所以后续高度估计要固定，暂时让gap存在 */}
                            <Empty
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                description="还没有支出记录,欢迎添加"
                            >
                            </Empty>

                        </Card>
                    </Col>
                </Row>

                <Row >
                    <Col span={12}>
                        <Card
                            title={<div >支出趋势</div>}
                        >
                            <Empty
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                description="还没有支出记录,欢迎添加"
                            >
                            </Empty>
                        </Card>
                    </Col>
                </Row>

            </Content>

        </Layout >
    )
}