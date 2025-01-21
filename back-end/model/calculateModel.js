const mongoose = require("mongoose");
const calculateSchema = new mongoose.Schema({
  book_id: {
    type: String,
    required: true,
  },
  //暂时允许为空
  formula: {
    type: String,
    default: "",
  },
  //暂时允许为空
  //计算的结果
  data: {
    type: Array,
    default: [],
  },
  field: {
    type: String,
    default: "",
  },
});
module.exports = mongoose.model("Calculate", calculateSchema, "calculate");
