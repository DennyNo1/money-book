const mongoose = require("mongoose");
const CashItem = require('../model/cashItemModel')
const CashHistory = require('../model/cashHistoryModel')
const User = require('../model/userModel');

const createCashItem = async (req, res) => {
    const { itemName, balance } = req.body
    const userId = req.user.userId

    // 检查任意字段为空
    // 基础字段存在性验证
    if (!itemName || !balance || !userId) {
        return res.status(400).json({
            error: 'Missing required fields',
            message: 'itemName, balance, and userId are required'
        });
    }

    // balance 数字类型验证
    //isNaN：检查是否"不是数字"
    //isFinite() - 检查是否为有限数字
    if (isNaN(parseFloat(balance)) || !isFinite(balance)) {
        return res.status(400).json({
            error: 'Invalid balance',
            message: 'balance must be a valid number'
        });
    }
    try {
        const userExists = await User.exists({ _id: userId });
        if (!userExists) {
            return res.status(400).json({
                error: 'Invalid userId',
                message: 'User not found'
            });
        }

        // itemName 重复性检查
        const existingItem = await CashItem.findOne({
            itemName: itemName.trim(),
            createUser: userId,

        });

        if (existingItem) {
            return res.status(409).json({
                error: 'Duplicate itemName ',
                message: 'You already have a cash item with this name'
            });
        }

        //
        const cashItme = new CashItem({
            //后面两个参数默认自带现在时间
            itemName, balance, createUser: userId
        })
        await cashItme.save();
        const cashHistory = new CashHistory({
            itemName, balance, createUser: userId
        })
        await cashHistory.save()

        return res.status(200).json({
            message: "Add new cash item successfully.",
        });

    }
    catch (error) {
        console.error('Error creating cash item:', error);
        res.status(500).json({
            error: 'Server Error',
            message: 'An internal server error occurred'
        });
    }
}


//假设同一个用户项目名有重复
async function modifyCashItem(req, res) {
    const { balance } = req.body
    const { _id } = req.params
    const userId = req.user.userId
    // 检查任意字段为空
    // 基础字段存在性验证
    console.log(balance)
    if (!typeof balance === 'number' || isNaN(balance) || !userId || !_id) {
        return res.status(400).json({
            error: 'Missing required fields',
            message: 'balance, userId, and _id are required'
        });
    }

    // balance 数字类型验证
    //isNaN：检查是否"不是数字"
    //isFinite() - 检查是否为有限数字
    if (isNaN(parseFloat(balance)) || !isFinite(balance)) {
        return res.status(400).json({
            error: 'Invalid balance',
            message: 'balance must be a valid number'
        });
    }
    try {
        const cashItem = await CashItem.findById(_id)
        if (!cashItem) {
            return res.status(404).json({
                error: 'Cash item not found',
                message: 'Cash item not found'
            })
        }
        cashItem.balance = balance
        await cashItem.save()


        const cashHistory = new CashHistory({
            itemName: cashItem.itemName, balance, createUser: userId
        })
        await cashHistory.save()

        return res.status(200).json({
            message: 'Cash flow update successfully',
            modifiedItem: {
                id: cashItem._id,
                itemName: cashItem.itemName,
                balance: cashItem.balance
            }
        })
    }
    catch (error) {
        console.error('Error modifying cash item:', error)
        res.status(500).json({
            error: 'Server Error',
            message: 'An internal server error occurred'
        });
    }
}


async function getAllCashItem(req, res) {
    const userId = req.user.userId

    try {
        // 只查询未删除的项目，只返回前端需要的字段
        const cashItems = await CashItem.find({
            createUser: userId,
            isDeleted: false  // 过滤已软删除的项目
        })
            .select('itemName balance createdAt updatedAt') // 只返回前端需要的字段
            .lean() // 返回普通对象，提高性能

        res.status(200).json(cashItems)
    }
    catch (error) {
        console.error('Error getting cash items:', error)
        res.status(500).json({
            error: 'Server Error',
            message: 'An internal server error occurred'
        });
    }
}

async function getCashHistory(req, res) {
    //目前只能自己查自己
    const userId = req.user.userId
    const { itemName } = req.params
    if (!itemName) {
        return res.status(400).json({
            error: 'Missing required fields',
            message: 'itemName are required'
        });
    }
    try {
        const cashHistory = await CashHistory.find({ createUser: userId, itemName: itemName })
            .select('itemName balance date createdAt') // 只返回前端需要的字段
            .lean() // 返回普通对象，提高性能
            .sort({ createdAt: 1 }) // 按时间排序
        res.status(200).json(cashHistory)
    }
    catch (error) {
        console.error('Error getting cash items:', error)
        res.status(500).json({
            error: 'Server Error',
            message: 'An internal server error occurred'
        });
    }
}

async function deleteCashItem(req, res) {
    const { _id } = req.params  // 
    const userId = req.user.userId
    if (!_id) {
        return res.status(400).json({
            error: 'Missing required fields',
            message: '_id are required'
        });
    }
    try {
        // 检查项目是否存在且属于当前用户，且未被删除
        const cashItem = await CashItem.findOne({
            _id,
            createUser: userId,
            isDeleted: false
        })

        if (!cashItem) {
            return res.status(404).json({
                error: 'Cash item not found',
                message: 'Cash item not found or already deleted'
            })
        }

        // 软删除：只更新标记，不真正删除
        await CashItem.findByIdAndUpdate(_id, {
            isDeleted: true,
            deletedAt: new Date(),
            deletedBy: userId
        })


        return res.status(200).json({
            message: 'Cash item deleted successfully',
            deletedItem: {
                id: _id,
                itemName: cashItem.itemName
            }
        })
    }
    catch (error) {
        console.error('Error deleting cash item:', error)
        res.status(500).json({
            error: 'Server Error',
            message: 'An internal server error occurred while deleting the cash item'
        });
    }
}

module.exports = { createCashItem, getAllCashItem, deleteCashItem, getCashHistory, modifyCashItem }










