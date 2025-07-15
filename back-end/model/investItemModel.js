const mongoose = require("mongoose");
const investItemSchema = new mongoose.Schema({
    itemName: {
        type: String,
        required: true,
    },
    //Number类型天然支持小数
    balance: {
        type: Number,
        required: true,
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
    price: {
        type: Number,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
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
    investDate: {
        type: Date,
        required: true,
    }

})
module.exports = mongoose.model("InvestItem", investItemSchema, "investItem"); //如果不写最后的book，会默认是把Book转换为books的集合名