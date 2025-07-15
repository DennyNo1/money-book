//简单计算放前端
const User = require('../model/userModel');
const InvestItem = require('../model/investItemModel');

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
//目前不做分页
const createInvestItem = async (req, res) => {
    const { itemName, balance, price, amount, total, type, investDate } = req.body
    const userId = req.user.userId

    // 检查任意字段为空
    // 基础字段存在性验证
    if (!itemName || !balance || !price || !amount || !total || !type || !investDate || !userId) {
        return res.status(400).json({
            error: 'Missing required fields',
            message: 'itemName, balance, price, amount, total, type, investDate, and userId are required'
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

        // 创建投资项目
        const investItem = new InvestItem({
            itemName: itemName.trim(),
            balance: parseFloat(balance),
            price: parseFloat(price),
            amount: parseFloat(amount),
            total: parseFloat(total),
            type,
            investDate: new Date(investDate),
            createUser: userId
        });

        await investItem.save();

        return res.status(200).json({
            message: "Add new invest item successfully.",
            investItem: {
                id: investItem._id,
                itemName: investItem.itemName,
                balance: investItem.balance,
                price: investItem.price,
                amount: investItem.amount,
                total: investItem.total,
                type: investItem.type,
                investDate: investItem.investDate
            }
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

//目前不做分页，返回所有投资项目
const getInvestItem = async (req, res) => {
    const userId = req.user.userId
    const investItems = await InvestItem.find({ createUser: userId })
        .select('itemName') // 只返回前端需要的字段
        .lean() // 返回普通对象，提高性能
    res.status(200).json(investItems)
}

module.exports = { createInvestItem, getInvestItem };