const mongoose = require("mongoose");
const Calculate = require("../model/calculateModel");
//将计算结果的一张表存入数据库
exports.addCalculateTable = async (req, res) => {
  console.log("addCalculateTable");
  const { book_id, data, formula, field } = req.body || {};
  if (!book_id) {
    return res.status(400).json({ message: "Book is required" });
  }

  try {
    const newCalculate = await Calculate.create({
      book_id,
      data,
      formula,
      field,
    });
    await newCalculate.save();

    res.status(200).json({
      message: "Calculate Result added successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred", error });
  }
};

exports.getCalculateTable = async (req, res) => {
  console.log("getCalculateTable");
  const { book_id } = req.query; // 获取查询参数中的 book|| {};

  if (!book_id) {
    return res.status(400).json({ message: "Book is required" });
  }
  try {
    const calculateTable = await Calculate.find({ book_id: book_id });
    res.status(200).json({
      message: "FcalculateTable in this book found",
      data: calculateTable,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred", error });
  }
};
