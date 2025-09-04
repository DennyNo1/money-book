import { Modal, Form, Input, InputNumber, DatePicker, Button, Space } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
function ExpenseModal(props) {
    const { modalOpen, setModalOpen, handleOk, loading, form, title, buttonStyle } = props
    return (
        < Modal
            width="30%"
            title={title}
            open={modalOpen}
            onOk={handleOk}
            okButtonProps={{ loading: loading, style: buttonStyle }}
            onCancel={() => {
                setModalOpen(false);
                form.resetFields(); // 关闭时重置表单
            }}>
            <Form
                form={form}
                layout="vertical"
                // 这是jsx的语法
                style={{ marginTop: 36, }}
            >
                <Form.Item
                    style={{ marginBottom: 32, }}
                    name="date"
                >
                    <DatePicker
                        picker="month" style={{ width: '100%', height: '4vh' }}
                        disabledDate={(current) => current && current > dayjs().endOf('month')} />
                </Form.Item>


                {/* 使用 Form.List 动态增加来源 */}
                <Form.List name="sources">
                    {/* antd的form list已经提前写好了field这个数组,以及add和remove，默认是这个写法 */}
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map(({ key, name, ...restField }) => (
                                <div style={{
                                    display: 'flex', marginBottom: 8,
                                    justifyContent: 'space-between',
                                    alignItems: 'baseline',
                                    width: '100%',
                                    height: '100%',
                                }}>
                                    <Form.Item {...restField} name={[name, 'source']} rules={[{ required: true, message: '请输入来源' }]} style={{ width: '60%', }}>
                                        <Input placeholder="来源" />
                                    </Form.Item>
                                    <Form.Item {...restField} name={[name, 'amount']} rules={[{ required: true, message: '请输入数值' }]} style={{ width: '30%', }} >
                                        {/* InputNumber自带最小宽度 */}
                                        <InputNumber placeholder="数值" />
                                    </Form.Item>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <MinusCircleOutlined onClick={() => remove(name)} />
                                    </div>
                                </div>
                            ))}

                            <Form.Item>
                                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                    增加来源
                                </Button>
                            </Form.Item>
                        </>
                    )}
                </Form.List>


                <Form.Item
                    style={{ marginBottom: 16, }}
                    name="note"
                    rules={[
                        { max: 50, message: '项目名称不能超过50个字符' }
                    ]}
                >
                    <Input
                        placeholder="备注"
                        style={{ height: '4vh' }}
                    />
                </Form.Item>

            </Form>
        </Modal>
    )
}

export default ExpenseModal;