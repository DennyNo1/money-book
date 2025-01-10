import React, { useState } from "react";

const ColumnCalculator = ({ columns, data, onCalculate }) => {
  const [selectedColumns, setSelectedColumns] = useState([]); // 用户选择的列
  const [formula, setFormula] = useState(""); // 用户输入的公式

  // 处理列选择
  const handleColumnSelect = (column) => {
    setSelectedColumns((prev) =>
      prev.includes(column)
        ? prev.filter((c) => c !== column)
        : [...prev, column]
    );
  };

  // 处理公式输入
  const handleFormulaChange = (e) => setFormula(e.target.value);

  // 提交公式进行计算
  const handleSubmit = () => {
    if (!formula) {
      alert("请输入公式！");
      return;
    }

    try {
      // 动态解析公式并计算结果
      const result = data.map((row) => {
        const context = selectedColumns.reduce((acc, col) => {
          acc[col] = row[col]; // 将选中列的值传入公式
          return acc;
        }, {});
        return new Function(...Object.keys(context), `return ${formula}`)(
          ...Object.values(context)
        );
      });
      onCalculate(result); // 返回结果到主页面
    } catch (error) {
      alert("公式有误，请检查！");
    }
  };

  return (
    <div
      className="drawer"
      style={{ border: "1px solid #ccc", padding: "16px" }}
    >
      <h3>列选择与公式编辑</h3>

      {/* 选择列 */}
      <div>
        <h4>选择列</h4>
        {columns.map((col) => (
          <label key={col} style={{ marginRight: "8px" }}>
            <input
              type="checkbox"
              value={col}
              checked={selectedColumns.includes(col)}
              onChange={() => handleColumnSelect(col)}
            />
            {col}
          </label>
        ))}
      </div>

      {/* 公式编辑 */}
      <div style={{ marginTop: "16px" }}>
        <h4>公式编辑</h4>
        <textarea
          value={formula}
          onChange={handleFormulaChange}
          placeholder="例如: A + B * C"
          style={{ width: "100%", height: "80px" }}
        />
      </div>

      {/* 提交按钮 */}
      <button onClick={handleSubmit} style={{ marginTop: "16px" }}>
        计算
      </button>
    </div>
  );
};

export default ColumnCalculator;
