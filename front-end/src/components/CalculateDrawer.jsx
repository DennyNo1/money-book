import React from "react";
import { Drawer, Divider, Checkbox } from "antd";
import { useState, useEffect } from "react";

//drawer
function CalculateDrawer({ allFields = [], showDrawer, closeDrawer, docs }) {
  //新field名
  const [newFieldName, setNewFieldName] = useState([]);
  const [fields, setFields] = useState(allFields); // 本地的所有field
  const [localDocs, setLocalDocs] = useState(docs);

  // 监听 allFields 的变化，并同步到本地状态
  useEffect(() => {
    setFields(allFields);
    // console.log(allFields);
  }, [allFields]);

  useEffect(() => {
    setLocalDocs(docs);
  }, [docs]);

  // 创建状态存储选中的字段
  const [selectedFields, setSelectedFields] = useState([]);

  // 处理 Checkbox 的选中状态变化
  const onChange = (checked, field) => {
    if (checked) {
      // 添加选中的字段
      setSelectedFields((prev) => [...prev, field]);
    } else {
      // 移除未选中的字段
      setSelectedFields((prev) => prev.filter((item) => item !== field));
    }
  };

  const [formula, setFormula] = useState(""); // 用户输入的公式

  const handleCalculate = () => {
    if (!formula) {
      alert("请输入公式！");
      return;
    }

    try {
      const result = localDocs.map((row) => {
        const context = selectedFields.reduce((acc, col) => {
          acc[col] = parseFloat(row[col]) || 0; // 将值转换为数字类型，默认值为 0
          return acc;
        }, {});

        // 使用动态函数计算公式
        return new Function(...Object.keys(context), `return ${formula}`)(
          ...Object.values(context)
        );
      });

      console.log(result);
    } catch (error) {
      alert("Formula error,please check your formula");
    }
  };

  return (
    <div>
      {/* drawer，用于产生新的列，并进行加减乘除的运算 */}
      <Drawer onClose={closeDrawer} open={showDrawer}>
        <div className="text-lg ">
          {" "}
          <label className="block text-gray-700 mt-4">
            New Calculate Field
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 mt-4 mb-10"
            required
            value={newFieldName}
            onChange={(e) => setNewFieldName(e.target.value)}
          />
          <label className="block text-gray-700 mb-4">
            Select Field To Calculate
          </label>
          {fields.length > 1 &&
            fields.map(
              (item, index) =>
                item.type === "number" && (
                  <Checkbox
                    className="p-2"
                    onChange={(e) => onChange(e.target.checked, item.field)}
                    key={index}
                  >
                    {item.field}
                  </Checkbox>
                )
            )}
          {/* <Divider /> */}
          <div style={{ marginTop: "16px" }}>
            <label className="block text-gray-700 mb-4 mt-10">
              Input Your Formula
            </label>
            <textarea
              value={formula}
              onChange={(e) => setFormula(e.target.value)}
              placeholder="Example: A + B * C"
              className="h-40 w-full p-2"
            />
          </div>
          <button
            onClick={handleCalculate}
            type="submit"
            className="w-full py-2 my-10 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition duration-300"
          >
            Calculate
          </button>
        </div>
      </Drawer>
    </div>
  );
}

export default CalculateDrawer;
