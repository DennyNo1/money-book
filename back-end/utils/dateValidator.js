function isValidDate(dateString) {
    // 检查是否为空
    if (!dateString) return false;

    // 尝试创建Date对象
    const date = new Date(dateString);

    // 检查是否为有效日期
    // date.getTime() 如果日期无效会返回NaN
    // 这种返回true/false的方法实际上不是一个好的选择
    return !isNaN(date.getTime()) && date.toString() !== 'Invalid Date';
}

function validateYearMonth(year, month) {
    // 1️⃣ 必须存在 & 必须是字符串
    if (typeof year !== "string" || typeof month !== "string") {
        throw new Error("year and month must be strings");
    }

    // 2️⃣ 格式校验（只允许固定格式）
    if (!/^\d{4}$/.test(year)) {
        throw new Error("invalid year format");
    }

    if (!/^\d{2}$/.test(month)) {
        throw new Error("invalid month format");
    }

    // 3️⃣ 数值校验
    const yearNum = Number(year);
    const monthNum = Number(month);

    if (yearNum < 1900 || yearNum > 2100) {
        throw new Error("year out of range");
    }

    if (monthNum < 1 || monthNum > 12) {
        throw new Error("month out of range");
    }

    return {
        year: yearNum,
        month: monthNum
    };
}
module.exports = { isValidDate, validateYearMonth }