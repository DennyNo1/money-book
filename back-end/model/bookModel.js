const mongoose = require("mongoose");
const bookSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  fields: {
    type: Array,
    default: [],
  },
});
module.exports = mongoose.model("Book", bookSchema,'book');//如果不写最后的book，会默认是把Book转换为books的集合名
