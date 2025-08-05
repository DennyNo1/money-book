const mongoose = require("mongoose");
//这个schema是主，history schema是子元素
const investItemSchema = new mongoose.Schema({
    itemName: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    //Number类型天然支持小数
    //每次交易都要更新
    balance: {
        type: Number,
        required: true,
    },
    createUser: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    //创建时自带默认，可不写
    createDate: {
        type: Date,
        default: Date.now
    },
    //整个项目开始的日期，即第一笔交易的investDate
    startDate: {
        type: Date,
        required: true,
    },
    //之后如果要修改，额外写个接口
    active: {
        type: Boolean,
        default: true
    },
    //每次交易，都要更新
    //创建时自带默认，可不写
    updateDate: {
        type: Date,
        default: Date.now
    },
    //买入均价
    // 软删除相关字段
    isDeleted: {
        type: Boolean,
        default: false
    },
})
module.exports = mongoose.model("InvestItem", investItemSchema, "investItem"); //如果不写最后的book，会默认是把Book转换为books的集合名