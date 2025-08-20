function isValidDate(dateString) {
    // 检查是否为空
    if (!dateString) return false;

    // 尝试创建Date对象
    const date = new Date(dateString);

    // 检查是否为有效日期
    // date.getTime() 如果日期无效会返回NaN
    return !isNaN(date.getTime()) && date.toString() !== 'Invalid Date';
}
module.exports = { isValidDate }