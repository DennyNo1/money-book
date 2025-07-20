//个人认为，重复性需要超过50%，再统一使用一个组件。
//创建时需要itemName，而买入卖出不需要itemName

import { Modal, Form, Input, InputNumber, DatePicker } from 'antd';
function InvestModal(props) {
    const { modalOpen, setModalOpen, handleOk, loading, form, title, neeItemName, needNote } = props
    return (
        <Modal
            width="30%"
            title={title}
            open={modalOpen}
            onOk={handleOk}
            okButtonProps={{ loading: loading }}
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
                {neeItemName && (
                    <Form.Item
                        style={{ marginBottom: 24 }}
                        // initialValue={itemName}
                        name="itemName"
                        rules={[
                            { required: true, message: '请输入项目名称' },
                            { min: 1, message: '项目名称不能为空' },
                            { max: 50, message: '项目名称不能超过50个字符' }
                        ]}
                    >
                        <Input
                            placeholder="你的项目名"
                            style={{ height: '4vh' }}
                        />
                    </Form.Item>)}
                {/* 单价 */}
                <Form.Item
                    name="price"
                    style={{ marginBottom: 24 }}

                    rules={[
                        { required: true, message: '请输入单价' },
                        { type: 'number', min: 0.01, message: '单价必须大于0' }
                    ]}
                >
                    <InputNumber
                        placeholder="单价"
                        prefix="￥"
                        style={{ width: '100%', height: '4vh' }}
                        precision={2}
                        min={0}
                        controls={false}
                        parser={(value) => value?.replace(/\$\s?|(,*)/g, '')}
                        formatter={(value) => value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''}
                    />
                </Form.Item>
                {/* 数量 */}
                <Form.Item
                    name="amount"
                    style={{ marginBottom: 24 }}
                    rules={[
                        { required: true, message: '请输入数量' },
                        { type: 'number', min: 0.01, message: '数量必须大于0' }
                    ]}

                >
                    <InputNumber
                        placeholder="数量"
                        style={{ width: '100%', height: '4vh' }}
                        precision={2}
                        min={0}
                        controls={false}
                        parser={(value) => value?.replace(/\$\s?|(,*)/g, '')}
                        formatter={(value) => value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''}
                    />
                </Form.Item>
                {/* 日期 */}
                <Form.Item
                    name="investDate"
                    style={{ marginBottom: needNote ? 24 : 36 }}

                    rules={[
                        { required: true, message: '请选择投资日期' }
                    ]}
                >
                    <DatePicker
                        style={{ width: '100%', height: '4vh' }}
                        placeholder="选择投资日期"
                        format="YYYY-MM-DD"
                    />
                </Form.Item>
                {/* 备注 */}
                {
                    needNote && <Form.Item
                        name="note"
                        style={{ marginBottom: 36 }}
                    >
                        <Input.TextArea placeholder="备注" rows={1} showCount maxLength={30} />
                    </Form.Item>
                }

            </Form>



        </Modal>
    )

}
export default InvestModal;