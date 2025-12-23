// 这是新的，第二个版本的支出的模型
// 目前先按照支付宝的格式来设计
const mongoose = require("mongoose");


const expenseTwoSchema = new mongoose.Schema({
    //消费日期
    expenseDate: {
        required: true,
        type: Date,
        //字段级别索引。加快查询
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
    payMethod: {
        type: String,
        required: true
    },

    //允许修改.以后再加相关field

});
//复合唯一索引，主要为了防止重复导入，当然也可以加快查询
expenseTwoSchema.index(
    { expenseDate: 1, category: 1, payObject: 1, amount: 1, userId: 1 },
    { unique: true }
);
module.exports = mongoose.model('ExpenseTwo', expenseTwoSchema, 'expenseTwo')