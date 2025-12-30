
const { isValidDate } = require('../utils/dateValidator');
const mongoose = require("mongoose");
const ExpenseTwo = require("../model/expenseTwoModel");
const InvalidInputError = require("../error/InvalidInputError");
// service不该使用http
//校验fields
function validateExpenseRecordFields(record) {

    //校验错误在controller中处理
    const { expenseDate, amount, category, payObject, payMethod, source } = record;
    if (!expenseDate || !amount || !category || !payObject || !payMethod || !source) {
        throw new InvalidInputError('Missing or invalid fields');
    }
    // 把字符串转为数字
    const parsedAmount = Number(amount);
    // Number.isFinite(parsedAmount):只有在 x 是 number 且不是 NaN / Infinity / -Infinity 时，才返回 true。
    if (source !== "alipay" && source !== "wechat") {
        throw new InvalidInputError('Invalid source');
    }
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
        throw new InvalidInputError('Invalid amount');
    }
    if (typeof payObject !== 'string' || payObject.trim() === '') {
        throw new InvalidInputError('Invalid payObject');
    }
    if (typeof payMethod !== 'string' || payMethod.trim() === '') {
        throw new InvalidInputError('Invalid payMethod');
    }
    if (typeof category !== 'string' || category.trim() === '') {
        throw new InvalidInputError('Invalid category');
    }
    if (!isValidDate(expenseDate)) {
        throw new InvalidInputError('Invalid expenseDate');
    }
}



async function insertExpenseTwoRecords(records, userId) {
    //允许插入失败。此变量用于记录插入成功数。
    let successCount = 0;
    let failedCount = 0;
    const errors = [];

    // 遍历每一条记录,即逐条插入
    for (const record of records) {
        try {
            validateExpenseRecordFields(record);
            // 添加userId字段
            record.userId = new mongoose.Types.ObjectId(userId);
            // 存入
            await ExpenseTwo.create(record);
            successCount++;
        }

        catch (error) {
            // {
            //     name: 'ValidationError',
            //         message: 'Invalid expenseDate',
            //             statusCode: 400,
            //                 isOperational: true,
            //                     stack: '...'
            // }
            //这个接口，有3层错误。第一层是校验错误，这里没有res，所以继续抛出。
            //第二层是储存时的错误，因为我这里允许插入失败，那么在这里处理。
            //这个代表重复插入
            //理论上其他的校验error是不存在的
            if (error.name === 'MongoServerError' && error.code === 11000) {
                console.error('Error inserting record:', error);
                errors.push({ record, error: error.message });
                failedCount++;
            }
            //第三层是系统错误，交给全局处理器处理，也不在这里处理。
            else throw error;


        }
    }
    return { successCount, failedCount, errors };
}

module.exports = {
    insertExpenseTwoRecords
};