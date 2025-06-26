const mongoose = require("mongoose");

const cashHistoryScheme = new mongoose.Schema(
    {
        itemName: {
            type: String,
            required: true,      // 只保留基础必填验证
            trim: true           // 自动去除空格
        },
        balance: {
            type: mongoose.Schema.Types.Decimal128,
            required: true,
            default: mongoose.Types.Decimal128.fromString('0.00')
            // 移除复杂的业务验证
        },
        creatUser: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'user'
        },
        date: {
            type: Date,
            default: Date.now
        },
    }
)
module.exports = mongoose.model('CashHistory', cashHistoryScheme, 'cashHistory')