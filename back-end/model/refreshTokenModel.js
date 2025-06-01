const mongoose = require("mongoose");
const userModel = require("./userModel");
const refreshTokenSchema = new mongoose.Schema({
    tokenId: {
        type: String,
        required: true,
        unique: true,
    },
    userModel: {
        type: Object,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    tokenExp: {
        type: Date,
        required: true,
    },
})

module.exports = mongoose.model("RefreshToken", refreshTokenSchema, 'refreshToken');
