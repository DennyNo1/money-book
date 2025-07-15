//简单计算放前端
const User = require('../model/userModel');
const InvestItem = require('../model/investItemModel');
const InvestHistory = require('../model/investHistoryModel');
const mongoose = require('mongoose'); // Added for mongoose.Types.ObjectId

// 日期验证函数
function isValidDate(dateString) {
    // 检查是否为空
    if (!dateString) return false;

    // 尝试创建Date对象
    const date = new Date(dateString);

    // 检查是否为有效日期
    // date.getTime() 如果日期无效会返回NaN
    return !isNaN(date.getTime()) && date.toString() !== 'Invalid Date';
}
//创建投资项目
const createInvestItem = async (req, res) => {
    //note可以为空
    //itemId在创建时可以为空
    const { itemName, balance, price, amount, total, type, investDate, note, itemId } = req.body
    const userId = req.user.userId
    // 检查任意字段为空
    // 基础字段存在性验证
    if (!itemName || !balance || !price || !amount || !total || !type || !investDate || !userId) {
        return res.status(400).json({
            error: 'Missing required fields',
            message: 'itemName, balance, price, amount, total, type, investDate, and userId  are required'
        });
    }

    //对balance, price, amount, total进行数字类型验证
    if (isNaN(parseFloat(balance)) || !isFinite(balance)) {
        return res.status(400).json({
            error: 'Invalid balance',
            message: 'balance must be a valid number'
        });
    }

    if (isNaN(parseFloat(price)) || !isFinite(price)) {
        return res.status(400).json({
            error: 'Invalid price',
            message: 'price must be a valid number'
        });
    }

    if (isNaN(parseFloat(amount)) || !isFinite(amount)) {
        return res.status(400).json({
            error: 'Invalid amount',
            message: 'amount must be a valid number'
        });
    }

    if (isNaN(parseFloat(total)) || !isFinite(total)) {
        return res.status(400).json({
            error: 'Invalid total',
            message: 'total must be a valid number'
        });
    }

    // type字段验证

    if (!['sell', 'buy'].includes(type)) {
        return res.status(400).json({
            error: 'Invalid type',
            message: 'type must be either "sell" or "buy"'
        });
    }
    // investDate字段验证
    if (!isValidDate(investDate)) {
        return res.status(400).json({
            error: 'Invalid investDate',
            message: 'investDate must be a valid date'
        });
    }

    try {
        // 验证用户是否存在
        const userExists = await User.exists({ _id: userId });
        if (!userExists) {
            return res.status(400).json({
                error: 'Invalid userId',
                message: 'User not found'
            });
        }

        //无论创建还是交易，都需要创建investHistory
        const investHistory = new InvestHistory({
            itemName: itemName,
            balance: balance,
            price: price,
            amount: amount,
            total: total,
            type: type,
            investDate: new Date(investDate),
            createUser: userId,
            note: note || ''
        });


        //根据itemId是否存在，判断是创建还是修改
        if (itemId) {
            //交易
            investHistory.itemId = itemId;
            await investHistory.save();
            const item = await InvestItem.findById(itemId);
            item.balance = balance;
            item.updateDate = new Date();
            await item.save();
        } else {
            //创建
            const investItem = new InvestItem({
                itemName: itemName.trim(),
                balance: balance,
                startDate: new Date(investDate),
                createUser: userId
            });
            const savedItem = await investItem.save();
            investHistory.itemId = savedItem._id;
            await investHistory.save();
        }

        return res.status(200).json({
            message: "Add new invest item successfully.",
        });

    } catch (error) {
        console.error('Error creating invest item:', error);

        // 处理Mongoose验证错误
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                error: 'Validation Error',
                message: error.message
            });
        }

        res.status(500).json({
            error: 'Server Error',
            message: 'An internal server error occurred'
        });
    }
}

//获取用户的所有投资项目。目前不做分页。
const getInvestItem = async (req, res) => {
    const userId = req.user.userId
    try {
        // 使用 distinct 获取不重复的项目名称
        const uniqueItemNames = await InvestItem.distinct('itemName, _id, balance', { createUser: userId });
        res.status(200).json(uniqueItemNames); // 过滤掉null值
    } catch (error) {
        console.error('Error getting invest items:', error);
        res.status(500).json({
            error: 'Server Error',
            message: 'An internal server error occurred'
        });
    }
}

module.exports = { createInvestItem, getInvestItem };