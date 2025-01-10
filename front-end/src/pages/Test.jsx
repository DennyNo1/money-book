import React, { useState } from "react";
import ColumnCalculator from "../components/ColumnCalculator";

const Test = () => {
  // 模拟数据和列
  const columns = ["A", "B", "C", "D"];
  const data = [
    { A: 1, B: 2, C: 3, D: 4 },
    { A: 5, B: 6, C: 7, D: 8 },
    { A: 9, B: 10, C: 11, D: 12 },
  ];

  const [results, setResults] = useState([]); // 计算结果

  return (
    <div style={{ padding: "16px" }}>
      <h1>表格操作页面</h1>

      {/* 抽屉组件 */}
      <ColumnCalculator
        columns={columns}
        data={data}
        onCalculate={(res) => setResults(res)} // 接收计算结果
      />

      {/* 显示计算结果 */}
      <div style={{ marginTop: "24px" }}>
        <h2>计算结果</h2>
        {results.length > 0 ? (
          <table border="1" style={{ width: "100%", textAlign: "left" }}>
            <thead>
              <tr>
                <th>行号</th>
                <th>结果</th>
              </tr>
            </thead>
            <tbody>
              {results.map((res, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{res}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>暂无结果，请输入公式并计算。</p>
        )}
      </div>
    </div>
  );
};

export default Test;
