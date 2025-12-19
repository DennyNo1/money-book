// 这是新的，第二个版本的支出的模型
// 目前先按照支付宝的格式来设计
const mongoose = require("mongoose");

const expenseTwoSchema = new mongoose.Schema({
    //消费日期
    expenseDate: {
        required: true,
        type: Date,
        //加快查询
        index: true,

    },
    //支出金额
    amount: {
        required: true,
        type: Number,
        required: true
    },
    //这条记录关联的用户ID
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    createDate: {
        type: Date,
        default: Date.now
    },
    //消费类型，目前不做限制
    category: {
        type: String,
        required: true
    },
    //支付对象，即支付给谁
    payObject: {
        required: true,
        type: String,
    },
    note: {
        type: String,
    },
    //允许修改.以后再加相关field



});
module.exports = mongoose.model('ExpenseTwo', expenseTwoSchema, 'expenseTwo')