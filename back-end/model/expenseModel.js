const mongoose = require("mongoose");
const expenseSchema = new mongoose.Schema({
    //日期
    date: {
        type: Date,
        required: true
    },
    //支出总金额
    total: {
        type: Number,
        required: true
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
    // //重大支出项
    // majorItem: {
    //     type: Array,
    // },
    //支出的来源，以键值对存储
    sources: {
        type: Object,
        required: true
    },
    note: {
        type: String,
    },


});
module.exports = mongoose.model('Expense', expenseSchema, 'expense')