import { Modal, Form, Input, InputNumber } from 'antd';

{/* modal的高度也是自适应的 */ }
function CashModal(props) {
  const { modalOpen, setModalOpen, handleOk, loading, form, title, disabled, buttonStyle } = props
  return (
    //用form这个数据来控制整个表单的值，而不是一个form.item单独绑定一个数据
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
          style={{ marginBottom: 16, }}
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
            disabled={disabled || false}
          />
        </Form.Item>
        {disabled && <Form.Item
          name="currentBalance"
          style={{ marginBottom: 16 }}

        >
          <InputNumber
            prefix="￥"
            style={{ width: '100%', height: '4vh' }}

            min={0}
            controls={false}

            disabled={true}
          />
        </Form.Item>}

        <Form.Item
          name="balance"
          style={{ marginBottom: 36 }}
          // label="金额"
          rules={[
            { required: true, message: '请输入金额' },
            // 逻辑上是可以等于0，甚至小于0
            // // { type: 'number', min: 0.01, message: '金额必须大于0' }
          ]}
        >
          <InputNumber
            placeholder="请输入最新的值"
            prefix="￥"
            style={{ width: '100%', height: '4vh' }}
            precision={2}
            min={0}
            controls={false}
            parser={(value) => value?.replace(/\$\s?|(,*)/g, '')}
            formatter={(value) => value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''}
          />
        </Form.Item>


      </Form>
    </Modal >)
}

export default CashModal;