const mongoose = require("mongoose");
const User = require('../model/userModel');
const ExpenseTwo = require("../model/expenseTwoModel");
const { isValidDate, validateYearMonth } = require('../utils/dateValidator');

//第一，把支付宝等支付记录，导入到数据库
// 判断函数示例
function isSystemError(err) {
    // MongoDB 断连 / 超时 / 未知错误
    return !['ValidationError', 'CastError', 'MongoServerError'].includes(err.name);
}
const importExpenseTwoRecords = async (req, res) => {
    const userId = req.user.userId;
    const { records } = req.body;
    //逻辑上每个出现的field都需要验证

    if (!records || !Array.isArray(records) || records.length === 0) {
        return res.status(400).json({
            error: 'Missing or invalid records',
            message: 'records must be a non-empty array'
        });
    }
    //允许插入失败。此变量用于记录插入成功数。
    const successCount = 0;
    const failedCount = 0;
    const errors = [];
    for (const record of records) {
        const { expenseDate, amount, category, payObject } = record;
        if (!expenseDate || !amount || !category || !payObject) {
            return res.status(400).json({
                error: 'Missing required fields in one of the records',
                message: 'expenseDate, amount, sources, category, and payObject are required'
            });
        }
        if (typeof amount !== 'number' || amount <= 0) {
            return res.status(400).json({
                error: 'Invalid amount in one of the records',
                message: 'amount must be a positive number'
            });
        }
        if (typeof payObject !== 'string' || payObject.trim() === '') {
            return res.status(400).json({
                error: 'Invalid payObject in one of the records',
                message: 'payObject must be a non-empty string'
            });
        }
        if (typeof category !== 'string' || category.trim() === '') {
            return res.status(400).json({
                error: 'Invalid category in one of the records',
                message: 'category must be a non-empty string'
            });
        }
        if (!isValidDate(expenseDate)) {
            return res.status(400).json({
                error: 'Invalid expenseDate in one of the records',
                message: 'expenseDate must be a valid date'
            });
        }
        record.userId = mongoose.Types.ObjectId(userId);

        //插入数据库
        try {
            await ExpenseTwo.create(record);
            successCount++;
        } catch (error) {
            //判断是否为系统错误,抛出即交给全局错误处理器处理
            if (isSystemError(error)) {
                // 直接抛出，停止批量插入
                throw error;
            }
            console.error('Error inserting record:', error);
            errors.push({ record, error: error.message });
            failedCount++;

        }

    }
    return res.status(200).json({
        message: 'Import completed',
        successCount,
        failedCount,
        errors
    });
}

//第二，为前端获取指定月份的记录，创建api
const getExpenseTwoByMonth = async (req, res) => {
    const userId = req.user.userId;
    const { year, month } = req.params;
    //验证year和month
    //对于这种可数字可字符串的变量，前端传过来还是字符串比较好
    //交给dateValidator.js中的validateYearMonth函数处理
    try {
        const { year, month } = validateYearMonth(year, month);
        //把年和月重新组成一个Date范围再去查询
        const start = new Date(year, month - 1, 1);
        const end = new Date(year, month, 1);
        const expenseTwoRecords = await ExpenseTwo.find({
            userId: mongoose.Types.ObjectId(userId),
            // $gte = 大于等于（>=）
            // lt = 小于（<）
            expenseDate: {
                $gte: start,
                $lt: end
            }
        })
        return res.status(200).json({
            message: 'Records fetched successfully',
            records: expenseTwoRecords
        });
    }
    catch (error) {
        //判断是否为系统错误,抛出即交给全局错误处理器处理
        if (isSystemError(error)) {
            // 直接抛出，停止批量插入
            // throw error 会立刻终止当前函数的执行。
            throw error;
        }
        console.error('Error inserting record:', error);
        return res.status(400).json({
            //统一的400错误返回格式
            error: 'Invalid year or month',
            message: error.message
        });
    }



}

