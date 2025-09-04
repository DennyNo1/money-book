const mongoose = require("mongoose");
const investHistorySchema = new mongoose.Schema({
    itemId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'InvestItem'
    },
    //应该再加入一个交易后的平均价，
    //以及每一笔根据交易前的均价计算的盈亏
    //目前先不加入手续费

    //当时的盈余
    balance: {
        type: Number,
        required: true,
    },

    createDate: {
        type: Date,
        default: Date.now
    },
    price: {
        type: Number,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    //交易的总金额
    total: {
        type: Number,
        required: true,
    },
    type: {
        type: String,
        required: true,
        enum: ['sell', 'buy'],
        default: 'buy'
    },
    //交易日期，可以为过去
    investDate: {
        type: Date,
        required: true,
    },
    note: {
        type: String,
    },
    //目前先不对单条投资记录做软删除

})
module.exports = mongoose.model('InvestHistory', investHistorySchema, 'investHistory');