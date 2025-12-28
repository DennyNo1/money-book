
const aiService = require('../service/aiService');
async function postWechatRecords(req, res) {
    const { wechatRecords } = req.body;
    const newRecords = await aiService.categorizeWechatRecordWithAI(wechatRecords);
    return res.status(200).json(newRecords);
}





module.exports = { postWechatRecords };

