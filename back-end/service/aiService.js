const { OpenAI } = require("openai");
const ExpenseTwo = require("../model/expenseTwoModel");

const openai = new OpenAI(
    {
        // 若没有配置环境变量，请用百炼API Key将下行替换为：apiKey: "sk-xxx",
        apiKey: process.env.ALI_API_KEY,
        baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1"
    }
);

async function aliAI(systemPrompt, userPrompt) {
    const completion = await openai.chat.completions.create({
        model: "qwen-flash",  //此处以qwen-plus为例，可按需更换模型名称。模型列表：https://help.aliyun.com/zh/model-studio/getting-started/models
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
        ],

    });
    return completion.choices[0].message.content;

}

async function categorizeWechatRecordWithAI(wechatRecords) {
    let proceededRecords = []
    //构建提示词
    const systemPrompt = "你是一个财务助理，负责将微信交易记录分类到预定义的类别中。";
    let userPrompt = `请将以下微信交易记录分类.
    请严格只返回 JSON，不要包含任何解释文字，不要使用 Markdown。
    返回格式示例：
    {"category":"餐饮"}
    预定义类别包括：餐饮、休闲玩乐、购物、穿搭美容、水果零食、交通、生活用品、人情社交、宠物、养娃、运动、生活服务、买菜、住房、爱车、学习、网络虚拟、烟酒、医疗保健、金融保险、家居家电、酒店旅行、转账、公益、互助保障、其他、数码、通讯、礼金、零食`;
    for (let i = 0; i < wechatRecords.length; i++) {
        const record = wechatRecords[i];
        if (await checkIfRecordExists(record)) {
            continue;
        }

        const userPromptWithRecord =
            userPrompt + `\n记录${i + 1}：${JSON.stringify(record)}`;
        const recordAfterAI = await aliAI(systemPrompt, userPromptWithRecord);
        const newRecord = { ...JSON.parse(recordAfterAI), ...record }
        proceededRecords.push(newRecord);
    }

    return proceededRecords;
}
// 由于ai分类每次不同，会导致一条记录被分到不同的类别，从而产生多条记录。所以检验下该记录是否存在。
// | 原值          | `!!` 后  |
// | ----------- | ------- |
// | 对象          | `true`  |
// | `null`      | `false` |
// | `undefined` | `false` |

async function checkIfRecordExists(record) {
    const existingRecord = await ExpenseTwo.findOne({
        date: record.date,
        payObject: record.payObject,
        amount: record.amount,
        payMethod: record.payMethod,
        userId: record.userId,
        source: record.source,

    });

    return !!existingRecord;
}


module.exports = { categorizeWechatRecordWithAI };