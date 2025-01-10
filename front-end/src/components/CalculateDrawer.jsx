import React from "react";
import { Drawer, Divider, Checkbox } from "antd";
import { useState, useEffect } from "react";

//drawer
function CalculateDrawer({ allFields = [], showDrawer, closeDrawer }) {
  //新field名
  const [newFieldName, setNewFieldName] = useState([]);
  const [fields, setFields] = useState(allFields); // 本地状态

  // 监听 allFields 的变化，并同步到本地状态
  useEffect(() => {
    setFields(allFields);
    console.log(allFields);
  }, [allFields]);

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

  return (
    <div>
      {/* drawer，用于产生新的列，并进行加减乘除的运算 */}
      <Drawer onClose={closeDrawer} open={showDrawer}>
        {" "}
        <label className="block text-gray-700">New Calculate Field</label>
        <input
          type="text"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 mt-2"
          required
          value={newFieldName}
          onChange={(e) => setNewFieldName(e.target.value)}
        />
        <Divider />
        {fields.length > 1 &&
          fields.map(
            (item, index) =>
              item.type === "number" && (
                <Checkbox
                  onChange={(e) => onChange(e.target.checked, item.field)}
                >
                  {item.field}
                </Checkbox>
              )
          )}
        {/* <button
          type="submit"
          className="w-auto h-10 p-2 my-4 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition duration-300"
          onClick={() => {
            setRemaining();
            addCalculatedFields();
          }}
        >
          Add calculated column
        </button>
        <div>
          {calculatedFields.map((item, index) => (
            <div key={index}>
              <select
                id="options"
                value={selectedValue}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 mt-4"
                required
              >
                <option value="" disabled>
                  Please select column
                </option>
                {remainingFields.map((option, index) => (
                  <option key={index} value={option.field}>
                    {option.field}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div> */}
        <Divider />
        <button
          type="submit"
          className="w-full py-2 my-6 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition duration-300"
        >
          Submit
        </button>
      </Drawer>
    </div>
  );
}

export default CalculateDrawer;
