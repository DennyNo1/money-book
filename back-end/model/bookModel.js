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
module.exports = mongoose.model("Book", bookSchema);
