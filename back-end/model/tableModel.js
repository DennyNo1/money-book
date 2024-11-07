const mongoose = require("mongoose");
const tableSchema = new mongoose.Schema({
  field: {
    type: String,
    required: true
  },
  collection: {
    type: String,
    required: true
  },
});
module.exports = mongoose.model("Table", tableSchema);