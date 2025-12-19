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
    Space
} from "antd";
import dayjs from 'dayjs';
const { Title, Text } = Typography;

const { Header, Content } = Layout;
export default function Expense() {
    const [datePicker, setDatePicker] = useState(dayjs(new Date()));
    const datePickerOnChange = (date, dateString) => {
        console.log(date, dateString);
        setDatePicker(date);

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
                            title={<div >新增支出记录</div>}
                        >
                            <Space>
                                <Button style={{
                                    backgroundColor: '#1E90FF',
                                    borderColor: '#1E90FF',
                                    color: '#fff'                // 自定义文字色
                                }} >
                                    支付宝
                                </Button>
                                <Button type="primary" >
                                    微信
                                </Button></Space>


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