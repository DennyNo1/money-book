const mongoose = require("mongoose");

const ExpenseTwo = require("../model/expenseTwoModel");
const { validateYearMonth } = require('../utils/dateValidator');
const { insertExpenseTwoRecords } = require('../service/expenseService');
const InvalidInputError = require("../error/InvalidInputError");
const aiService = require('../service/aiService');
// 微信支付记录经过ai分类后插入数据库
async function postWechatRecords(req, res) {
    const userId = req.user.userId;
    const { wechatRecords } = req.body;
    const records = wechatRecords
    if (!records || !Array.isArray(records) || records.length === 0) {
        return res.status(400).json({
            error: 'Missing or invalid records',
            message: 'records must be a non-empty array'
        });
    }
    const recordsAfterAI = await aiService.categorizeWechatRecordWithAI(wechatRecords);
    try {
        const { successCount, failedCount, errors } = await insertExpenseTwoRecords(recordsAfterAI, userId);
        return res.status(200).json({
            message: 'Insert completed',
            successCount,
            failedCount,
            errors
        });

    } catch (error) {
        if (error instanceof InvalidInputError) {
            return res.status(400).json({
                error: 'Invalid input',
                message: error.message
            });
        }
        else throw error;
    }
}

//第一，把支付宝支付记录，导入到数据库
const postAliRecords = async (req, res) => {
    const userId = req.user.userId;
    const { records } = req.body;
    //逻辑上每个出现的field都需要验证

    if (!records || !Array.isArray(records) || records.length === 0) {
        return res.status(400).json({
            error: 'Missing or invalid records',
            message: 'records must be a non-empty array'
        });
    }
    try {
        const { successCount, failedCount, errors } = await insertExpenseTwoRecords(records, userId);
        return res.status(200).json({
            message: 'Insert completed',
            successCount,
            failedCount,
            errors
        });

    } catch (error) {
        if (error instanceof InvalidInputError) {
            return res.status(400).json({
                error: 'Invalid input',
                message: error.message
            });
        }
        else throw error;
    }

}

// const importExpenseTwoRecords = async (req, res) => {
//     const userId = req.user.userId;
//     const { records } = req.body;
//     //逻辑上每个出现的field都需要验证

//     if (!records || !Array.isArray(records) || records.length === 0) {
//         return res.status(400).json({
//             error: 'Missing or invalid records',
//             message: 'records must be a non-empty array'
//         });
//     }
//     //允许插入失败。此变量用于记录插入成功数。
//     let successCount = 0;
//     let failedCount = 0;
//     const errors = [];
//     for (const record of records) {
//         const { expenseDate, amount, category, payObject, payMethod
//         } = record;
//         if (!expenseDate || !amount || !category || !payObject || !payMethod) {
//             return res.status(400).json({
//                 error: 'Missing required fields in one of the records',
//                 message: 'expenseDate, amount, category, payObject,payMethod are required'
//             });
//         }
//         // 把字符串转为数字
//         const parsedAmount = Number(amount);

//         if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
//             return res.status(400).json({
//                 error: 'Invalid amount in one of the records',
//                 message: 'amount must be a positive number',
//             });
//         }
//         if (typeof payObject !== 'string' || payObject.trim() === '') {
//             return res.status(400).json({
//                 error: 'Invalid payObject in one of the records',
//                 message: 'payObject must be a non-empty string'
//             });
//         }
//         if (typeof category !== 'string' || category.trim() === '') {
//             return res.status(400).json({
//                 error: 'Invalid category in one of the records',
//                 message: 'category must be a non-empty string'
//             });
//         }
//         if (typeof payMethod !== 'string' || payMethod.trim() === '') {
//             return res.status(400).json({
//                 error: 'Invalid payMethod in one of the records',
//                 message: 'payMethod must be a non-empty string'
//             });
//         }
//         if (!isValidDate(expenseDate)) {
//             return res.status(400).json({
//                 error: 'Invalid expenseDate in one of the records',
//                 message: 'expenseDate must be a valid date'
//             });
//         }
//         record.userId = new mongoose.Types.ObjectId(userId);

//         //插入数据库
//         try {
//             await ExpenseTwo.create(record);
//             successCount++;
//         } catch (error) {
//             //判断是否为系统错误,抛出即交给全局错误处理器处理
//             if (isSystemError(error)) {
//                 // 直接抛出，停止批量插入
//                 throw error;
//             }
//             // 重复的记录产生的错误有必要单独捕获？目前没必要
//             console.error('Error inserting record:', error);
//             errors.push({ record, error: error.message });
//             failedCount++;

//         }

//     }
//     return res.status(200).json({
//         message: 'Import completed',
//         successCount,
//         failedCount,
//         errors
//     });
// }

//第二，为前端获取指定月份的记录，创建api
const getExpenseTwoByMonth = async (req, res) => {
    const userId = req.user.userId;
    const { year: yearStr, month: monthStr } = req.query;
    //验证year和month
    //对于这种可数字可字符串的变量，前端传过来还是字符串比较好
    //交给dateValidator.js中的validateYearMonth函数处理
    try {
        const { year, month } = validateYearMonth(yearStr, monthStr);
        //把年和月重新组成一个Date范围再去查询
        const start = new Date(year, month - 1, 1);
        const end = new Date(year, month, 1);
        const expenseTwoRecords = await ExpenseTwo.find({
            userId: new mongoose.Types.ObjectId(userId),
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
        //假设查询时除了校验错误，只有系统级错误
        throw error;
    }
}

module.exports = {
    postAliRecords,
    postWechatRecords,
    getExpenseTwoByMonth
};