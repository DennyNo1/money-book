const mongoose = require("mongoose");
const CashItem = require('../model/cashItemModel')
const CashHistory = require('../model/cashHistoryModel')
const User = require('../model/userModel');

const createCashItem = async (req, res) => {
    const { itemName, balance, userId } = req.body
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
            creatUser: userId,

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
            itemName, balance, creatUser: userId
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










