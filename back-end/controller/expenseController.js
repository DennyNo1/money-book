const mongoose = require("mongoose");
const Expense = require("../model/expenseModel");
const User = require('../model/userModel');
const { isValidDate } = require('../utils/dateValidator');

const createExpenseRecordMonthly = async (req, res) => {
    const userId = req.user.userId
    const { date, total,
        // majorItem,
        sources, note } = req.body;
    //逻辑上每个出现的field都需要验证
    //非空验证
    if (!date || !total || !sources) {
        console.log(date, total, sources)
        return res.status(400).json({
            error: 'Missing required fields',
            message: 'date, total, and source are required'
        });
    }
    if (isValidDate(date) === false) return res.status(400).json({
        error: 'Invalid date',
        message: 'date must be a valid date'
    });
    //total数字类型验证
    if (isNaN(parseFloat(total)) || !isFinite(total)) {
        return res.status(400).json({
            error: 'Invalid total',
            message: 'total must be a valid number'
        });
    }
    //source的对象类型验证
    if (typeof sources !== 'object') {
        return res.status(400).json({
            error: 'Invalid source',
            message: 'source must be an object'
        });
    }
    //majorItem数组类型验证
    // if (majorItem && !Array.isArray(majorItem)) {
    //     return res.status(400).json({
    //         error: 'Invalid majorItem',
    //         message: 'majorItem must be an array'
    //     });
    // }
    //note字符串类型验证
    if (note && typeof note !== 'string') {
        return res.status(400).json({
            error: 'Invalid note',
            message: 'note must be a string'
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
        //日期年月不允许重复
        const existingExpense = await Expense.exists({
            date: new Date(date),
            createUser: userId
        });
        if (existingExpense) {
            return res.status(400).json({
                error: 'Expense already exists',
                message: 'An expense record for the specified date already exists'
            });
        }
        const newExpense = new Expense({
            date: new Date(date),
            total,
            // majorItem,
            sources,
            note,
            createUser: userId
            //createDate自动插入

        });

        await newExpense.save();
        return res.status(201).json({
            message: 'Expense created successfully',
            expense: newExpense
        });

    }
    catch (error) {
        console.error('Error creating expense:', error); res.status(500).json({
            error: 'Server Error',
            message: 'An internal server error occurred'
        });
    }


};
//目前不根据年份做统计，全部获取

const listExpenseRecordMonthly = async (req, res) => {
    const userId = req.user.userId
    console.log(userId)
    try {
        //id的数据类型是ObjectId，所以需要转换
        const expenseRecord = await Expense.find({ createUser: new mongoose.Types.ObjectId(userId) }).sort({ date: -1 });
        console.log(expenseRecord)
        return res.status(200).json({
            message: 'Expense record retrieved successfully',
            expenseRecord: expenseRecord
        });
    } catch (error) {
        console.error('Error retrieving expense record:', error);
        res.status(500).json({
            error: 'Server Error',
            message: 'An internal server error occurred'
        })
    }
};
module.exports = { createExpenseRecordMonthly, listExpenseRecordMonthly };