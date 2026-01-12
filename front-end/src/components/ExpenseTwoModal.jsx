import React, { useState, useMemo } from 'react';
import { Button, Modal, Table, Input, Select, Space } from 'antd';
import dayjs from 'dayjs';

//props 约定只读
const ExpenseTwoModal = (props) => {
    const { setModalVisible, modalVisible, modalData } = props;
    // 对modalData中的日期进行格式化
    const formattedData = modalData.map(item => ({
        ...item,
        expenseDate: dayjs(item.expenseDate).format('YYYY-MM-DD HH:mm:ss'),
    }));
    const [searchText, setSearchText] = useState('');
    const [category, setCategory] = useState('');
    // 表格列
    const columns = [
        {
            title: '日期', dataIndex: 'expenseDate', key: 'expenseDate',
            sorter: (a, b) =>
                dayjs(a.expenseDate).valueOf() - dayjs(b.expenseDate).valueOf(),
            width: 200,
        },
        { title: '类别', dataIndex: 'category', key: 'category', width: 100 },
        {
            title: '支出对象', dataIndex: 'payObject', key: 'payObject',
            width: 500,
        },
        { title: '金额', dataIndex: 'amount', key: 'amount', sorter: (a, b) => Number(a.amount) - Number(b.amount), },
        { title: '支出方式', dataIndex: 'payMethod', key: 'payMethod' },
        { title: '来源', dataIndex: 'source', key: 'source' },
        {}
    ];
    // 根据搜索和分类过滤数据
    const filteredData = useMemo(() => {
        return formattedData.filter(item => {
            const matchesCategory = category ? item.category === category : true;
            const keyword = searchText.toLowerCase();
            const matchesSearch = searchText
                ? item.payObject?.toLowerCase().includes(keyword) ||
                item.source?.toLowerCase().includes(keyword) ||
                item.payMethod?.toLowerCase().includes(keyword)
                : true;

            return matchesCategory && matchesSearch;
        });
    }, [searchText, category, formattedData]);
    return (
        <Modal
            title="本月支出详情"
            open={modalVisible}
            onCancel={() => setModalVisible(false)}
            width={1200}
            footer={null}
        >
            <Space style={{ marginBottom: 16 }}>
                <Select
                    placeholder="选择常见分类"
                    onChange={value => setCategory(value)}
                    style={{ width: 150 }}
                    allowClear
                >
                    <Select.Option value="餐饮">餐饮</Select.Option>
                    <Select.Option value="生活日用">生活日用</Select.Option>
                    <Select.Option value="医疗保健">医疗保健</Select.Option>
                    <Select.Option value="休闲玩乐">休闲玩乐</Select.Option>
                    <Select.Option value="穿搭美容">穿搭美容</Select.Option>
                    <Select.Option value="生活服务">生活服务</Select.Option>
                    <Select.Option value="学习">学习</Select.Option>
                    <Select.Option value="转账">转账</Select.Option>
                </Select>

                <Input.Search
                    placeholder="搜索关键词"
                    onSearch={value => setSearchText(value)}
                    allowClear
                    style={{ width: 200 }}
                />
            </Space>

            <Table
                columns={columns}
                dataSource={filteredData}
                rowKey="_id"
            // pagination={{ pageSize: 5 }}
            />
        </Modal>)
};
export default ExpenseTwoModal;