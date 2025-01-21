const mongoose = require("mongoose");
const bookSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, // 确保 name 字段唯一
  },
  fields: {
    type: Array,
    default: [],
  },
  user_id: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model("Book", bookSchema, "book"); //如果不写最后的book，会默认是把Book转换为books的集合名
