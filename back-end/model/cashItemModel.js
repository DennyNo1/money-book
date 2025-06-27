const mongoose = require("mongoose");
//Model只保留基础的数据类型约束！
const cashItemSchema = new mongoose.Schema(
    {
        itemName: {
            type: String,
            required: true,      // 只保留基础必填验证
            trim: true           // 自动去除空格
        },
        balance: {
            //前端传过来字符串
            type: Number,
            required: true,
            default: 0.00
            // 移除复杂的业务验证
        },
        createUser: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'user'
        },
        createDate: {
            type: Date,
            default: Date.now
        },
        updateDate: {
            type: Date,
            default: Date.now
        }
    }
)

//三个名称分别代表，model name/schema/collection name
module.exports = mongoose.model('CashItem', cashItemSchema, 'cashItem');