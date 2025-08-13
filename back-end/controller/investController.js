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
    const { itemName, description, balance, price, amount, total, type, investDate, note, itemId } = req.body
    const userId = req.user.userId
    // 检查任意字段为空
    // 基础字段存在性验证
    //note可以为空
    if (!itemName || !description || !balance || !price || !amount || !total || !type || !investDate || !userId) {
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
                createUser: userId,
                description: description.trim()
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
//现在开始做分页了
const getInvestItem = async (req, res) => {
    const userId = req.user.userId
    try {
        // 使用 distinct 获取不重复的项目名称
        const page = parseInt(req.query.page) || 1;       // 当前页，默认1
        const pageSize = parseInt(req.query.pageSize) || 8;  // 每页数量，默认10
        //req.query.active 是字符串（比如 "false" 或 "true"），不是布尔值或排序值。
        const active = req.query.active || true;
        console.log(active);
        const activeSort = active === 'true' ? -1 : 1;

        const filter = { createUser: userId, isDeleted: false };

        // 1. 先查总数
        const totalCount = await InvestItem.countDocuments(filter);

        // 2. 查分页数据
        const investItems = await InvestItem.find(filter)
            .sort({ active: activeSort, createDate: -1 })
            .skip((page - 1) * pageSize)
            .limit(pageSize);
        // 返回结果示例
        res.json({
            data: investItems,
            total: totalCount,
            page,
            pageSize,
        });
    } catch (error) {
        console.error('Error getting invest items:', error);
        res.status(500).json({
            error: 'Server Error',
            message: 'An internal server error occurred'
        });
    }
}
const deleteInvestItem = async (req, res) => {
    try {
        const { itemId } = req.params;
        await InvestItem.findByIdAndUpdate(itemId, { isDeleted: true });
        res.status(200).json({ message: 'Invest item deleted successfully' });

    } catch (error) {
        console.error('Error deleting invest item:', error);
        res.status(500).json({
            error: 'Server Error',
            message: 'An internal server error occurred'
        });

    }
};

const makeInvest = async (req, res) => {
    const { itemId, balance, price, amount, total, type, investDate, note } = req.body
    // 检查任意字段为空
    if (!itemId || !balance || !price || !amount || !total || !type || !investDate) {
        return res.status(400).json({
            error: 'Missing required fields',
            message: 'itemId, balance, price, amount, total, type, investDate, and userId  are required'
        });
    }
    // 检查balance, price, amount, total是否为数字
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
    // 检查type是否为buy或sell
    if (!['buy', 'sell'].includes(type)) {
        return res.status(400).json({
            error: 'Invalid type',
            message: 'type must be either "buy" or "sell"'
        });
    }
    // 检查investDate是否为有效日期 
    if (!isValidDate(investDate)) {
        return res.status(400).json({
            error: 'Invalid investDate',
            message: 'investDate must be a valid date'
        });
    }
    try {
        //根据itemId先查询item，并更新它
        const item = await InvestItem.findById(itemId);
        if (!item) {
            return res.status(400).json({
                error: 'Invalid itemId',
                message: 'Item not found'
            });
        }
        item.balance = balance;
        item.updateDate = new Date();
        await item.save();

        const investHistory = new InvestHistory({
            itemId: itemId,
            balance: balance,
            price: price,
            amount: amount,
            total: total,
            type: type,
            investDate: new Date(investDate),
            note: note || ''
        })
        await investHistory.save();
        return res.status(200).json({
            message: "Make invest successfully.",
        });
    }
    catch (error) {
        console.error('Error making invest:', error);
        res.status(500).json({
            error: 'Server Error',
            message: 'An internal server error occurred'
        });
    }
}

// 获取投资过往记录
const getInvestmentHistory = async (req, res) => {
    const { itemId } = req.params;
    try {
        const investItem = await InvestItem.findOne({
            _id: itemId,
        }).select('itemName balance startDate active updateDate');//select用于筛选字段
        if (!investItem) {
            return res.status(404).json({
                error: 'Item not found',
                message: 'Investment item not found'
            });
        }
        const investHistory = await InvestHistory.find({
            itemId: itemId,
        }).select('balance price amount total type investDate note createDate')
            .sort({ investDate: 1 });
        res.status(200).json({
            item: investItem,
            history: investHistory
        });
    } catch (error) {
        console.error('Error getting invest history:', error);
        res.status(500).json({
            error: 'Server Error',
            message: 'An internal server error occurred'
        });
    }
}

//查询投资项目是否重名
//t
//是否能与已完结项目重名？不行
const checkDuplicateInvestment = async (req, res) => {
    const { itemName } = req.query;
    try {
        const investItem = await InvestItem.findOne({ itemName: itemName });
        if (investItem) {
            res.status(200).json({
                message: '项目名已存在',
                isExist: true
            });
        } else {
            res.status(200).json({
                message: '项目名可用',
                isExist: false
            });
        }
    } catch (error) {
        console.error('Error query invest item name:', error);
        res.status(500).json({
            error: 'Server Error',
            message: 'An internal server error occurred'
        });
    }
}

const finishInvestment = async (req, res) => {
    const { itemId } = req.params;
    const { epilogue } = req.body;
    try {

        //对itemId进行验证,epilogue可以为空
        if (!itemId) {
            return res.status(400).json({
                error: 'missing parameter',
                message: 'itemId is required'
            });
        }
        const investItem = await InvestItem.findOne({ _id: itemId });
        if (!investItem) {
            return res.status(404).json({
                error: 'Invest item not found',
                message: 'Invest item not found'
            });
        }
        investItem.active = false;
        if (epilogue)
            investItem.epilogue = epilogue;
        investItem.endDate = Date.now();
        await investItem.save();
        res.status(200).json({
            message: 'finish item successfully',

        });

    }
    catch (error) {
        console.error('Error finish item:', error);
        res.status(500).json({
            error: 'Server Error',
            message: 'An internal server error occurred'
        });
    }

}

module.exports = { createInvestItem, getInvestItem, getInvestmentHistory, makeInvest, deleteInvestItem, checkDuplicateInvestment, finishInvestment };