const mongoose = require("mongoose");
const investHistorySchema = new mongoose.Schema({
    itemId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'InvestItem'
    },
    // 冗余
    // itemName: {
    //     type: String,
    //     required: true,
    // },
    //当时的盈余
    balance: {
        type: Number,
        required: true,
    },
    // 冗余
    // createUser: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     required: true,
    //     ref: 'user'
    // },
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

})
module.exports = mongoose.model('InvestHistory', investHistorySchema, 'investHistory');